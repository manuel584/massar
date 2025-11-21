
import React, { useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { db } from '../services/dataService';
import Avatar from '../components/Avatar';
import { CheckCircle2, AlertCircle, BookOpen, Calendar, Star } from '../components/Icons';

const ParentReportPage: React.FC = () => {
  const { studentId, lessonId } = useParams<{ studentId: string; lessonId: string }>();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  
  const student = db.getStudent(Number(studentId));
  const lesson = db.getLessonInfo(Number(lessonId));
  const progress = db.getStudentLessonProgress(Number(studentId), Number(lessonId));

  // Read configuration from URL
  const showEngagement = searchParams.get('eng') !== '0';
  const showHomework = searchParams.get('hw') === '1'; // Default false now since removed
  const showNotes = searchParams.get('notes') !== '0';
  const showPoints = searchParams.get('pts') === '1'; 

  // Get class name for meta/title
  const grade = student ? db.getGrades().find(g => g.id === student.grade_id) : null;
  const section = student ? db.getSections(student.grade_id).find(s => s.id === student.section_id) : null;

  useEffect(() => {
    if (student && grade && section) {
      document.title = `تقرير: ${student.name} - ${grade.name} فصل ${section.name}`;
    }
  }, [student, grade, section]);

  if (!student || !lesson || !progress) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 text-center">
        <div>
          <AlertCircle size={48} className="text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-600">عذراً، التقرير غير متوفر</h2>
          <p className="text-gray-400 mt-2">تأكد من الرابط أو تواصل مع المعلم.</p>
        </div>
      </div>
    );
  }

  // Calculate status roughly based on points (Max 15 now)
  const isEngaged = progress.calculated_points >= 10; 
  // If homework is undefined (simplified mode), treat as false for display logic or hide
  const isHomeworkDone = progress.homework_completion;

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 font-sans" dir="rtl">
      <div className="max-w-md mx-auto bg-white rounded-3xl shadow-xl overflow-hidden">
        
        {/* Header */}
        <div className="bg-blue-600 p-6 text-center text-white relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full opacity-10">
                 <BookOpen size={200} className="absolute -top-10 -left-10 transform rotate-12" />
            </div>
            <div className="relative z-10">
                <h1 className="text-lg font-bold opacity-90 mb-1">تقرير المتابعة اليومي</h1>
                <div className="text-2xl font-bold">{grade?.name} - فصل {section?.name}</div>
                <div className="mt-4 inline-block bg-blue-500/50 px-4 py-1 rounded-full text-sm border border-blue-400/30">
                     {new Date(progress.date).toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
            </div>
        </div>

        {/* Student Info */}
        <div className="text-center -mt-10 relative z-20 mb-6">
            <div className="inline-block p-2 bg-white rounded-full shadow-md">
                 <Avatar level={student.avatar_level} gender={student.gender} size="lg" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mt-2">{student.name}</h2>
            <p className="text-gray-500">الرقم الأكاديمي: #{student.id}</p>
        </div>

        {/* Lesson Details (Always Shown) */}
        <div className="px-6 mb-6">
            <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                <h3 className="text-xs font-bold text-gray-400 uppercase mb-2">موضوع الدرس</h3>
                <div className="flex items-start gap-3">
                    <div className="bg-orange-100 text-orange-600 p-2 rounded-lg mt-1">
                        <BookOpen size={20} />
                    </div>
                    <div>
                        <div className="text-sm text-gray-500 font-bold">{lesson.unit_name}</div>
                        <div className="text-lg font-bold text-gray-800">{lesson.lesson_name}</div>
                    </div>
                </div>
            </div>
        </div>
        
        {/* Points Breakdown (Optional) */}
        {showPoints && (
            <div className="px-6 mb-6 animate-fade-in">
                <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-2xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="bg-indigo-100 text-indigo-600 p-2 rounded-full">
                            <Star size={20} />
                        </div>
                        <span className="font-bold text-indigo-900">تقييم اليوم</span>
                    </div>
                    {/* Update to show out of 15 */}
                    <span className="text-2xl font-bold text-indigo-600">{progress.calculated_points} / 15</span>
                </div>
            </div>
        )}

        {/* Status Cards */}
        <div className="px-6 grid grid-cols-1 gap-4 mb-6">
            {/* Engagement */}
            {showEngagement && (
                <div className={`p-4 rounded-2xl border-2 flex flex-col items-center justify-center text-center gap-2 ${isEngaged ? 'bg-green-50 border-green-100' : 'bg-yellow-50 border-yellow-100'}`}>
                    {isEngaged ? (
                        <div className="bg-green-100 text-green-600 p-2 rounded-full"><CheckCircle2 size={24} /></div>
                    ) : (
                        <div className="bg-yellow-100 text-yellow-600 p-2 rounded-full"><AlertCircle size={24} /></div>
                    )}
                    <div>
                        <div className="font-bold text-gray-800">{isEngaged ? 'تفاعل ممتاز' : 'أداء جيد'}</div>
                        <div className="text-xs text-gray-500">{isEngaged ? 'شارك بفاعلية في الدرس' : 'يحتاج إلى المزيد من المشاركة'}</div>
                    </div>
                    {/* Simple Stars Visual */}
                    <div className="flex gap-1 mt-1">
                        {[...Array(5)].map((_, i) => (
                            <Star key={i} size={14} className={i < (progress.calculated_points/3) ? "text-yellow-400 fill-current" : "text-gray-300"} />
                        ))}
                    </div>
                </div>
            )}

            {/* Homework (Only show if it was recorded in old data) */}
            {showHomework && isHomeworkDone !== undefined && (
                <div className={`p-4 rounded-2xl border-2 flex flex-col items-center justify-center text-center gap-2 ${isHomeworkDone ? 'bg-blue-50 border-blue-100' : 'bg-yellow-50 border-yellow-100'}`}>
                    {isHomeworkDone ? (
                        <div className="bg-blue-100 text-blue-600 p-2 rounded-full"><CheckCircle2 size={24} /></div>
                    ) : (
                        <div className="bg-yellow-100 text-yellow-600 p-2 rounded-full"><AlertCircle size={24} /></div>
                    )}
                    <div>
                        <div className="font-bold text-gray-800">{isHomeworkDone ? 'أنجز الواجب' : 'الواجب ناقص'}</div>
                        <div className="text-xs text-gray-500">{isHomeworkDone ? 'تم تسليم الواجب المطلوب' : 'لم يتم تسليم الواجب'}</div>
                    </div>
                </div>
            )}
        </div>
        
        {/* Fallback if everything hidden */}
        {!showEngagement && !showHomework && !showNotes && !showPoints && (
             <div className="px-6 text-center text-gray-400 text-sm py-4 italic">
                 تم إخفاء تفاصيل التقييم لهذا التقرير.
             </div>
        )}

        {/* Note */}
        {showNotes && progress.notes && (
            <div className="px-6 mb-8">
                 <h3 className="text-xs font-bold text-gray-400 uppercase mb-2">ملاحظات المعلم</h3>
                 <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-100 text-gray-700 text-sm italic leading-relaxed">
                     "{progress.notes}"
                 </div>
            </div>
        )}

        {/* Footer */}
        <div className="bg-gray-50 p-6 text-center border-t border-gray-100">
            <p className="text-xs text-gray-400">تم إنشاء هذا التقرير آلياً عبر تطبيق مَسار</p>
        </div>
      </div>
    </div>
  );
};

export default ParentReportPage;
