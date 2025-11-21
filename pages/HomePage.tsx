
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../services/dataService';
import { Users, Plus, BookOpen, MoreHorizontal, Trash2, Edit } from '../components/Icons';
import { ManageGradeModal } from '../components/ManagementModals';
import { Grade } from '../types';

const HomePage: React.FC = () => {
    const navigate = useNavigate();
    const [grades, setGrades] = useState<Grade[]>([]);
    const [isGradeModalOpen, setIsGradeModalOpen] = useState(false);
    const [editingGrade, setEditingGrade] = useState<Grade | null>(null);
    const [menuOpenId, setMenuOpenId] = useState<number | null>(null);

    useEffect(() => {
        setGrades(db.getGrades());
    }, []);

    const refreshGrades = () => {
        setGrades(db.getGrades());
    };

    const handleSaveGrade = (name: string, color: string, icon: string) => {
        if (editingGrade) {
            db.updateGrade(editingGrade.id, name, color, icon);
        } else {
            db.addGrade(name, color, icon);
        }
        setEditingGrade(null);
        setIsGradeModalOpen(false);
        refreshGrades();
    };

    const handleDeleteGrade = (id: number, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();

        db.deleteGrade(id);
        refreshGrades();
        setMenuOpenId(null);
    };

    const openEdit = (grade: Grade, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setEditingGrade(grade);
        setIsGradeModalOpen(true);
        setMenuOpenId(null);
    };

    // Click outside to close menu
    useEffect(() => {
        const closeMenu = () => setMenuOpenId(null);
        if (menuOpenId !== null) {
            document.addEventListener('click', closeMenu);
        }
        return () => document.removeEventListener('click', closeMenu);
    }, [menuOpenId]);

    return (
        <div className="min-h-screen bg-gray-50 pb-24 dark:bg-gray-900 transition-colors duration-200">
            {/* Header */}
            <header className="bg-white p-4 shadow-sm sticky top-0 z-10 flex items-center justify-between dark:bg-gray-800 dark:border-b dark:border-gray-700">
                <h1 className="text-xl font-bold text-gray-800 dark:text-white">الصفوف الدراسية</h1>
                <button onClick={() => navigate('/settings')} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600">
                    <div className="w-6 h-6 flex items-center justify-center font-bold text-gray-600 dark:text-gray-300">⚙️</div>
                </button>
            </header>

            {/* Grades List */}
            <main className="p-4 space-y-4">
                {grades.length === 0 ? (
                    <div className="text-center py-20 opacity-50">
                        <BookOpen size={48} className="mx-auto mb-4 text-gray-300" />
                        <p className="text-gray-500 font-bold">لا توجد صفوف دراسية</p>
                        <p className="text-sm text-gray-400 mt-1">اضغط على الزر أدناه لإضافة صف جديد</p>
                    </div>
                ) : (
                    grades.map((grade) => (
                        <div
                            key={grade.id}
                            onClick={() => navigate(`/grade/${grade.id}`)}
                            style={{ backgroundColor: grade.color }}
                            className={`relative rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow cursor-pointer transition-transform duration-200 group ${menuOpenId === grade.id ? 'z-30' : 'z-0 active:scale-95'}`}
                        >
                            <div className="flex justify-between items-start relative z-10">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-2xl">{grade.icon}</span>
                                        <h2 className="text-lg font-bold text-gray-800">{grade.name}</h2>
                                    </div>
                                    <p className="text-sm text-gray-600 flex items-center gap-2 font-medium">
                                        <Users size={14} />
                                        {grade.studentCount} طالب | {grade.sectionCount} أقسام
                                    </p>
                                </div>

                                {/* Menu Button */}
                                <button
                                    onClick={(e) => { e.stopPropagation(); setMenuOpenId(menuOpenId === grade.id ? null : grade.id); }}
                                    className="p-2 bg-white/50 rounded-full hover:bg-white text-gray-700 transition-colors"
                                >
                                    <MoreHorizontal size={20} />
                                </button>

                                {/* Dropdown Menu */}
                                {menuOpenId === grade.id && (
                                    <div
                                        className="absolute top-12 left-4 bg-white rounded-xl shadow-xl p-1 z-50 flex flex-col min-w-[140px] animate-fade-in border border-gray-100 dark:bg-gray-800 dark:border-gray-700"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <button
                                            onClick={(e) => openEdit(grade, e)}
                                            className="flex items-center gap-2 px-4 py-3 hover:bg-gray-50 rounded-lg text-sm font-bold text-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 text-right w-full"
                                        >
                                            <Edit size={16} /> تعديل
                                        </button>
                                        <button
                                            onClick={(e) => handleDeleteGrade(grade.id, e)}
                                            className="flex items-center gap-2 px-4 py-3 hover:bg-red-50 rounded-lg text-sm font-bold text-red-600 dark:hover:bg-red-900/20 text-right w-full"
                                        >
                                            <Trash2 size={16} /> حذف
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                )}

                {/* Add Class Button (Explicit) */}
                <button
                    onClick={() => { setEditingGrade(null); setIsGradeModalOpen(true); }}
                    className="w-full py-6 border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center text-gray-400 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 transition-all group dark:border-gray-700 dark:hover:border-blue-500 dark:hover:bg-gray-800"
                >
                    <div className="bg-gray-100 p-3 rounded-full mb-2 group-hover:bg-blue-100 transition-colors dark:bg-gray-800 dark:group-hover:bg-blue-900/30">
                        <Plus size={24} />
                    </div>
                    <span className="font-bold">إضافة صف جديد</span>
                </button>
            </main>

            {/* FAB (Moved to Right) */}
            <button
                onClick={() => { setEditingGrade(null); setIsGradeModalOpen(true); }}
                className="fixed bottom-24 right-6 bg-blue-600 text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center hover:bg-blue-700 active:scale-90 transition-transform z-40 dark:bg-blue-700 dark:hover:bg-blue-600"
            >
                <Plus size={28} />
            </button>

            {/* Modal */}
            <ManageGradeModal
                isOpen={isGradeModalOpen}
                onClose={() => setIsGradeModalOpen(false)}
                onSave={handleSaveGrade}
                initialData={editingGrade ? { name: editingGrade.name, color: editingGrade.color, icon: editingGrade.icon } : undefined}
            />
        </div>
    );
};

export default HomePage;
