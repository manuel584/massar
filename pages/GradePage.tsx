
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../services/dataService';
import { ChevronLeft, Table, Users, Plus, Trash2, MoreHorizontal, UserPlus, UserMinus } from '../components/Icons';
import Avatar from '../components/Avatar';
import { RECOGNITION_LABELS } from '../constants';
import { RecognitionCategory, Student } from '../types';
import { ManageSectionModal, ManageStudentModal } from '../components/ManagementModals';

const GradePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const gradeId = Number(id);

  const [sections, setSections] = useState(db.getSections(gradeId));
  const currentGrade = db.getGrades().find(g => g.id === gradeId);
  const [activeSection, setActiveSection] = useState<number>(0);

  // State for students list to ensure UI updates on changes
  const [students, setStudents] = useState<Student[]>([]);

  // Modals State
  const [isSectionModalOpen, setIsSectionModalOpen] = useState(false);
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);

  // Bulk Action State
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [bulkMode, setBulkMode] = useState<'add' | 'deduct'>('add');
  const [bulkPoints, setBulkPoints] = useState(5);
  const [bulkReason, setBulkReason] = useState('');
  const [bulkCategory, setBulkCategory] = useState<RecognitionCategory>('excellence');

  // Student Menu State
  const [studentMenuId, setStudentMenuId] = useState<number | null>(null);

  // Initial Data Load
  useEffect(() => {
    const secs = db.getSections(gradeId);
    setSections(secs);

    // Default to first section if active is invalid
    if (secs.length > 0 && (!activeSection || !secs.find(s => s.id === activeSection))) {
      setActiveSection(secs[0].id);
    }
  }, [gradeId]);

  // Fetch students whenever active section changes
  useEffect(() => {
    if (activeSection) {
      setStudents(db.getStudentsBySection(activeSection));
    } else {
      setStudents([]);
    }
  }, [activeSection]);

  const refreshData = () => {
    const secs = db.getSections(gradeId);
    setSections(secs);
    if (secs.length === 1) setActiveSection(secs[0].id);
  };

  const refreshStudents = () => {
    if (activeSection) {
      const updatedStudents = db.getStudentsBySection(activeSection);
      setStudents([...updatedStudents]); // Create new array ref to force render
    }
  };

  const handleAddSection = (name: string) => {
    db.addSection(gradeId, name);
    refreshData();
  };

  const handleDeleteSection = (e: React.MouseEvent, sectionId: number) => {
    e.stopPropagation();
    e.preventDefault();
    db.deleteSection(sectionId);
    const remaining = db.getSections(gradeId);
    setSections(remaining);
    if (activeSection === sectionId) {
      setActiveSection(remaining[0]?.id || 0);
    } else {
      refreshData();
    }
  };

  const handleAddStudent = (name: string, gender: 'male' | 'female') => {
    if (!activeSection) return alert("الرجاء إضافة فصل أولاً");
    db.addStudent(name, gender, activeSection, gradeId);
    setStudentMenuId(null);
    refreshStudents(); // Update UI immediately
  };

  const handleDeleteStudent = (studentId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    db.deleteStudent(studentId);
    setStudentMenuId(null);
    refreshStudents(); // Update UI immediately
  };

  const handleBulkSubmit = () => {
    const finalPoints = bulkMode === 'add' ? bulkPoints : -bulkPoints;
    const category = bulkMode === 'deduct' ? 'deduction' : bulkCategory;
    const reason = bulkReason || (bulkMode === 'deduct' ? 'خصم جماعي' : 'مكافأة جماعية');

    db.bulkAddPoints(activeSection, finalPoints, category, reason);
    setIsBulkModalOpen(false);
    setBulkPoints(5);
    setBulkReason('');
    refreshStudents(); // Update points in UI
    alert(`تم ${bulkMode === 'add' ? 'إضافة' : 'خصم'} النقاط لـ ${students.length} طالب`);
  };

  const handleDeleteGrade = () => {
    db.deleteGrade(gradeId);
    navigate('/home');
  };

  useEffect(() => {
    const closeMenu = () => setStudentMenuId(null);
    if (studentMenuId) document.addEventListener('click', closeMenu);
    return () => document.removeEventListener('click', closeMenu);
  }, [studentMenuId]);

  return (
    <div className="min-h-screen bg-gray-50 pb-24 dark:bg-gray-900 transition-colors duration-200">
      <header className="bg-white p-4 shadow-sm sticky top-0 z-10 flex items-center justify-between gap-4 dark:bg-gray-800 dark:border-b dark:border-gray-700">
        <div className="flex items-center gap-2">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full dark:hover:bg-gray-700">
            <ChevronLeft size={24} className="text-gray-600 dark:text-gray-300" />
          </button>
          <h1 className="text-xl font-bold text-gray-800 dark:text-white">{currentGrade?.name}</h1>
        </div>
        <button
          onClick={handleDeleteGrade}
          className="p-2 bg-red-50 text-red-500 rounded-full hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40"
          title="حذف الصف"
        >
          <Trash2 size={20} />
        </button>
      </header>

      {/* Section Tabs */}
      <div className="flex overflow-x-auto p-4 gap-3 no-scrollbar bg-white border-b border-gray-100 dark:bg-gray-800 dark:border-gray-700 items-center">
        {sections.map(section => (
          <div
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            role="button"
            tabIndex={0}
            className={`px-6 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-colors relative group flex items-center gap-2 cursor-pointer select-none ${activeSection === section.id
              ? 'bg-blue-600 text-white shadow-md dark:bg-blue-700'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
              }`}
          >
            {section.name}
            {/* Delete Section Button (Small X) */}
            {activeSection === section.id && (
              <button
                onClick={(e) => handleDeleteSection(e, section.id)}
                className="bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors shadow-sm ml-2"
                title="حذف الفصل"
              >
                <Trash2 size={10} />
              </button>
            )}
          </div>
        ))}
        <button
          onClick={() => setIsSectionModalOpen(true)}
          className="px-3 py-2 rounded-full bg-blue-50 text-blue-600 border border-blue-100 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800"
        >
          <Plus size={20} />
        </button>
      </div>

      {activeSection ? (
        <>
          {/* Quick Actions for Section */}
          <div className="p-4 pb-0 grid grid-cols-2 gap-3">
            <button
              onClick={() => navigate(`/sessions/${activeSection}`)}
              className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 p-3 rounded-xl flex flex-col items-center justify-center gap-1 transition-colors font-bold text-xs border border-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-300 dark:border-indigo-800 dark:hover:bg-indigo-900/50"
            >
              <Table size={20} />
              جداول المتابعة
            </button>
            <button
              onClick={() => setIsBulkModalOpen(true)}
              className="bg-purple-50 hover:bg-purple-100 text-purple-700 p-3 rounded-xl flex flex-col items-center justify-center gap-1 transition-colors font-bold text-xs border border-purple-100 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800 dark:hover:bg-purple-900/50"
            >
              <Users size={20} />
              نقاط جماعية
            </button>
          </div>

          {/* Students Grid */}
          <main className="p-4 grid grid-cols-1 gap-4">
            {students.map((student) => (
              <div
                key={student.id}
                onClick={() => navigate(`/student/${student.id}`)}
                className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow cursor-pointer dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-750 relative"
              >
                <Avatar level={student.avatar_level} gender={student.gender} />
                <div className="flex-1">
                  <h3 className="font-bold text-gray-800 dark:text-white">{student.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-700 rounded-md font-medium dark:bg-yellow-900/40 dark:text-yellow-400">
                      المستوى {student.avatar_level}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {student.total_points} نقطة
                    </span>
                  </div>
                </div>

                <button
                  onClick={(e) => { e.stopPropagation(); setStudentMenuId(studentMenuId === student.id ? null : student.id); }}
                  className="p-2 text-gray-400 hover:bg-gray-100 rounded-full dark:hover:bg-gray-700"
                >
                  <MoreHorizontal size={20} />
                </button>

                {studentMenuId === student.id && (
                  <div
                    className="absolute left-10 top-4 bg-white shadow-lg rounded-xl p-1 z-20 border border-gray-100 dark:bg-gray-700 dark:border-gray-600"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button onClick={(e) => handleDeleteStudent(student.id, e)} className="flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-50 w-full rounded-lg font-bold dark:hover:bg-red-900/30">
                      <Trash2 size={14} /> حذف
                    </button>
                  </div>
                )}
              </div>
            ))}

            {students.length === 0 && (
              <div className="text-center py-10 text-gray-400 dark:text-gray-500">
                <Users size={48} className="mx-auto mb-2 opacity-20" />
                <p>لا يوجد طلاب في هذا الفصل</p>
                <p className="text-xs">أضف طلاباً للبدء</p>
              </div>
            )}
          </main>

          {/* Add Student FAB */}
          <button
            onClick={() => setIsStudentModalOpen(true)}
            className="fixed bottom-24 left-6 bg-blue-600 text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center hover:bg-blue-700 active:scale-90 transition-transform z-30 dark:bg-blue-700"
          >
            <UserPlus size={24} />
          </button>
        </>
      ) : (
        <div className="text-center py-20 opacity-50">
          <p className="font-bold text-gray-500">قم بإضافة فصل (شعبة) أولاً</p>
          <p className="text-xs text-gray-400 mt-2">اضغط على زر + في الشريط أعلاه</p>
        </div>
      )}

      {/* Modals */}
      <ManageSectionModal
        isOpen={isSectionModalOpen}
        onClose={() => setIsSectionModalOpen(false)}
        onSave={handleAddSection}
      />

      <ManageStudentModal
        isOpen={isStudentModalOpen}
        onClose={() => setIsStudentModalOpen(false)}
        onSave={handleAddStudent}
      />

      {/* Bulk Action Modal */}
      {isBulkModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4 animate-fade-in backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl slide-up dark:bg-gray-800">
            <h3 className="text-xl font-bold mb-4 text-center dark:text-white">إجراء جماعي للفصل</h3>

            <div className="flex bg-gray-100 p-1 rounded-lg mb-6 dark:bg-gray-700">
              <button
                onClick={() => setBulkMode('add')}
                className={`flex-1 py-2 text-xs font-bold rounded-md transition-all ${bulkMode === 'add' ? 'bg-white text-green-600 shadow-sm dark:bg-gray-600 dark:text-green-400' : 'text-gray-400'}`}
              >
                مكافأة جماعية
              </button>
              <button
                onClick={() => setBulkMode('deduct')}
                className={`flex-1 py-2 text-xs font-bold rounded-md transition-all ${bulkMode === 'deduct' ? 'bg-white text-red-600 shadow-sm dark:bg-gray-600 dark:text-red-400' : 'text-gray-400'}`}
              >
                خصم جماعي
              </button>
            </div>

            {bulkMode === 'add' && (
              <div className="grid grid-cols-2 gap-3 mb-6">
                {(Object.keys(RECOGNITION_LABELS) as RecognitionCategory[]).map(cat => (
                  <button
                    key={cat}
                    onClick={() => setBulkCategory(cat)}
                    className={`p-3 rounded-xl border-2 text-xs font-bold transition-all ${bulkCategory === cat
                      ? 'border-green-500 bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                      : 'border-gray-100 bg-gray-50 text-gray-600 dark:bg-gray-700 dark:border-gray-600'
                      }`}
                  >
                    {RECOGNITION_LABELS[cat]}
                  </button>
                ))}
              </div>
            )}

            <div className="mb-6">
              <label className="block text-sm font-bold text-gray-700 mb-2 dark:text-gray-300">
                قيمة النقاط ({bulkPoints})
              </label>
              <input
                type="range"
                min="1"
                max="20"
                value={bulkPoints}
                onChange={(e) => setBulkPoints(Number(e.target.value))}
                className={`w-full h-2 rounded-lg appearance-none cursor-pointer ${bulkMode === 'add' ? 'bg-green-200 accent-green-600' : 'bg-red-200 accent-red-600'}`}
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-bold text-gray-700 mb-2 dark:text-gray-300">السبب (اختياري)</label>
              <input
                type="text"
                value={bulkReason}
                onChange={(e) => setBulkReason(e.target.value)}
                placeholder={bulkMode === 'add' ? "مثال: نشاط صفي..." : "مثال: إزعاج..."}
                className="w-full p-3 rounded-xl border border-gray-200 focus:border-blue-500 outline-none bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>

            <div className="flex gap-3">
              <button onClick={() => setIsBulkModalOpen(false)} className="flex-1 py-3 bg-gray-100 rounded-xl font-bold text-gray-600 dark:bg-gray-700 dark:text-gray-300">إلغاء</button>
              <button
                onClick={handleBulkSubmit}
                className={`flex-1 py-3 text-white rounded-xl font-bold shadow-lg ${bulkMode === 'add' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}
              >
                تأكيد ({students.length} طالب)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GradePage;
