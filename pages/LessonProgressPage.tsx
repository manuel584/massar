
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../services/dataService';
import { StarRating, Lesson } from '../types';
import { ChevronLeft, Save, Star, BookOpen, UploadCloud, Plus, Share2, Settings, Eye, EyeOff, CheckSquare } from '../components/Icons';
import ImportLessonsModal from '../components/ImportLessonsModal';

const LessonProgressPage: React.FC = () => {
  const { studentId } = useParams<{ studentId: string }>();
  const navigate = useNavigate();
  const student = db.getStudent(Number(studentId));
  
  const [allLessons, setAllLessons] = useState<Lesson[]>(db.getAllLessons());
  const [selectedLessonId, setSelectedLessonId] = useState<string>('');
  const [currentLesson, setCurrentLesson] = useState<Lesson | undefined>(undefined);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  // Report Configuration State
  const [reportConfig, setReportConfig] = useState({
    showPoints: true,
    showNotes: true,
    showEngagement: true // Default to keeping engagement visible since we only have this data now
  });

  // Only keeping Performance (Stars) and Notes
  const [performance, setPerformance] = useState<{participation: StarRating, comprehension: StarRating, excellence: StarRating}>({
    participation: 3, comprehension: 3, excellence: 3
  });
  const [notes, setNotes] = useState('');

  // Refresh lessons when modal closes
  const refreshLessons = () => {
      setAllLessons(db.getAllLessons());
  };

  useEffect(() => {
      if (selectedLessonId) {
          setCurrentLesson(db.getLessonInfo(Number(selectedLessonId)));
      } else if (allLessons.length > 0) {
          // Default to first lesson if none selected
          setSelectedLessonId(String(allLessons[0].id));
      }
  }, [selectedLessonId, allLessons]);

  if (!student) return <div>Data not found</div>;

  const calculateTotal = () => {
    let total = 0;
    // Max possible points: 5 + 5 + 5 = 15 points
    total += performance.participation;
    total += performance.comprehension;
    total += performance.excellence;
    return total;
  };

  const totalPoints = calculateTotal();

  const handleSave = () => {
    if (!currentLesson) return;

    db.saveLessonProgress({
        id: Date.now(),
        student_id: student.id,
        lesson_id: currentLesson.id,
        // Removed breakdown fields
        participation: performance.participation,
        comprehension: performance.comprehension,
        excellence: performance.excellence,
        notes,
        calculated_points: totalPoints,
        date: new Date().toISOString()
    });
    navigate(-1);
  };
  
  const handleShare = () => {
      if (!currentLesson) return;
      
      // Save implicitly then show modal
      db.saveLessonProgress({
        id: Date.now(),
        student_id: student.id,
        lesson_id: currentLesson.id,
        participation: performance.participation,
        comprehension: performance.comprehension,
        excellence: performance.excellence,
        notes,
        calculated_points: totalPoints,
        date: new Date().toISOString()
    });
      
      setShowShareModal(true);
  };
  
  const generateReportLink = () => {
      if (!currentLesson) return '';
      const baseUrl = window.location.href.split('#')[0]; // Get base URL
      
      // Construct query params based on config
      const params = new URLSearchParams();
      if (reportConfig.showEngagement) params.append('eng', '1'); else params.append('eng', '0');
      if (reportConfig.showNotes) params.append('notes', '1'); else params.append('notes', '0');
      if (reportConfig.showPoints) params.append('pts', '1'); else params.append('pts', '0');
      
      // Hardcode homework/details to 0 as they are removed
      params.append('hw', '0');

      return `${baseUrl}#/report/student/${student.id}/lesson/${currentLesson.id}?${params.toString()}`;
  };
  
  const copyToClipboard = () => {
      const link = generateReportLink();
      navigator.clipboard.writeText(link);
      alert('تم نسخ الرابط بنجاح!');
      setShowShareModal(false);
  };

  const StarRatingInput = ({ value, onChange }: { value: number, onChange: (v: StarRating) => void }) => (
    <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
            <button 
                key={star}
                onClick={() => onChange(star as StarRating)}
                className={`text-xl ${star <= value ? 'text-yellow-400' : 'text-gray-200'}`}
            >
                <Star fill={star <= value ? "currentColor" : "none"} />
            </button>
        ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <header className="bg-white p-4 shadow-sm sticky top-0 z-20 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 flex-1">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full flex-shrink-0">
            <ChevronLeft size={24} />
          </button>
          <div className="flex-1">
            <h1 className="text-xs text-gray-500 font-medium mb-1">تتبع الدرس</h1>
            <div className="flex gap-2">
                <div className="relative flex-1">
                    <select 
                        value={selectedLessonId}
                        onChange={(e) => setSelectedLessonId(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 text-gray-800 text-sm font-bold rounded-lg p-2 pr-8 appearance-none focus:ring-2 focus:ring-blue-100 outline-none"
                    >
                        <option value="" disabled>اختر الدرس...</option>
                        {allLessons.map(l => (
                            <option key={l.id} value={l.id}>
                                {l.unit_name}: {l.lesson_name}
                            </option>
                        ))}
                    </select>
                    <BookOpen size={16} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
                <button 
                    onClick={() => setIsImportModalOpen(true)}
                    className="bg-blue-50 text-blue-600 p-2 rounded-lg hover:bg-blue-100 border border-blue-100"
                    title="إضافة دروس"
                >
                    <Plus size={20} />
                </button>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
            <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-lg font-bold text-sm flex-shrink-0 ml-1">
                {totalPoints} / 15
            </div>
            <button 
                onClick={handleShare}
                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                title="مشاركة التقرير"
            >
                <Share2 size={20} />
            </button>
        </div>
      </header>

      <div className="p-4 space-y-4 max-w-lg mx-auto">
        
        {/* Performance */}
        <section className="bg-white p-4 rounded-xl shadow-sm space-y-3 animate-fade-in">
            <h3 className="font-bold text-gray-800 mb-3">⭐ الأداء والتقييم</h3>
            
            <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">المشاركة</span>
                <StarRatingInput value={performance.participation} onChange={(v) => setPerformance({...performance, participation: v})} />
            </div>
            <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">الاستيعاب</span>
                <StarRatingInput value={performance.comprehension} onChange={(v) => setPerformance({...performance, comprehension: v})} />
            </div>
            <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">التميز</span>
                <StarRatingInput value={performance.excellence} onChange={(v) => setPerformance({...performance, excellence: v})} />
            </div>
        </section>

        {/* Notes */}
        <section className="bg-white p-4 rounded-xl shadow-sm animate-fade-in">
            <h3 className="font-bold text-gray-800 mb-2">💭 ملاحظات المعلم</h3>
            <textarea 
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="اكتب ملاحظة..."
                className="w-full h-24 bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm outline-none focus:border-blue-400 resize-none"
            ></textarea>
        </section>

        <button 
            onClick={handleSave}
            className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-blue-200 hover:bg-blue-700 active:scale-95 transition-all flex items-center justify-center gap-2"
        >
            <Save size={20} />
            حفظ التقييم
        </button>
      </div>
      
      <ImportLessonsModal 
          isOpen={isImportModalOpen} 
          onClose={() => setIsImportModalOpen(false)}
          onImportComplete={refreshLessons}
      />
      
      {/* Share & Config Modal */}
      {showShareModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4 animate-fade-in">
            <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl slide-up">
                
                <h3 className="text-xl font-bold text-gray-800 mb-2 flex items-center gap-2">
                    <Settings size={20} className="text-blue-600" />
                    تخصيص التقرير
                </h3>
                <p className="text-sm text-gray-500 mb-4">اختر ما يظهر لولي الأمر في الرابط:</p>
                
                <div className="space-y-2 mb-6">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl cursor-pointer" onClick={() => setReportConfig({...reportConfig, showEngagement: !reportConfig.showEngagement})}>
                        <div className="flex items-center gap-3">
                            {reportConfig.showEngagement ? <CheckSquare className="text-blue-600" size={20} /> : <div className="w-5 h-5 border-2 border-gray-300 rounded" />}
                            <span className="text-sm font-bold text-gray-700">مستوى الأداء (نجوم)</span>
                        </div>
                        {reportConfig.showEngagement ? <Eye size={18} className="text-blue-400" /> : <EyeOff size={18} className="text-gray-300" />}
                    </div>

                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl cursor-pointer" onClick={() => setReportConfig({...reportConfig, showNotes: !reportConfig.showNotes})}>
                        <div className="flex items-center gap-3">
                            {reportConfig.showNotes ? <CheckSquare className="text-blue-600" size={20} /> : <div className="w-5 h-5 border-2 border-gray-300 rounded" />}
                            <span className="text-sm font-bold text-gray-700">ملاحظات المعلم</span>
                        </div>
                        {reportConfig.showNotes ? <Eye size={18} className="text-blue-400" /> : <EyeOff size={18} className="text-gray-300" />}
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl cursor-pointer" onClick={() => setReportConfig({...reportConfig, showPoints: !reportConfig.showPoints})}>
                        <div className="flex items-center gap-3">
                            {reportConfig.showPoints ? <CheckSquare className="text-blue-600" size={20} /> : <div className="w-5 h-5 border-2 border-gray-300 rounded" />}
                            <span className="text-sm font-bold text-gray-700">مجموع النقاط ({totalPoints}/15)</span>
                        </div>
                        {reportConfig.showPoints ? <Eye size={18} className="text-blue-400" /> : <EyeOff size={18} className="text-gray-300" />}
                    </div>
                </div>

                <div className="bg-blue-50 p-3 rounded-xl border border-blue-100 mb-6 flex items-center gap-2 overflow-hidden">
                    <div className="flex-1 text-xs text-blue-700 truncate text-left font-mono" dir="ltr">
                        {generateReportLink()}
                    </div>
                </div>
                
                <div className="flex gap-3">
                    <button 
                        onClick={() => setShowShareModal(false)}
                        className="flex-1 p-3 rounded-xl font-bold text-gray-500 bg-gray-100 hover:bg-gray-200"
                    >
                        إلغاء
                    </button>
                    <button 
                        onClick={copyToClipboard}
                        className="flex-1 p-3 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 flex items-center justify-center gap-2"
                    >
                        <Share2 size={18} /> نسخ الرابط
                    </button>
                </div>
            </div>
          </div>
      )}
    </div>
  );
};

export default LessonProgressPage;
