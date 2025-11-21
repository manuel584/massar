
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../services/dataService';
import { BarChart2, Users, TrendingUp, Trophy, ChevronLeft, Filter, ArrowRightLeft, AlertTriangle } from '../components/Icons';
import Avatar from '../components/Avatar';

const AnalyticsPage: React.FC = () => {
  const navigate = useNavigate();
  const teacher = db.getTeacherProfile();
  
  // View Mode State
  const [viewMode, setViewMode] = useState<'overview' | 'class' | 'compare'>('overview');
  
  // Selections
  const allSections = db.getAllSections();
  const allStudents = db.getAllStudents();
  
  const [selectedSectionId, setSelectedSectionId] = useState<number | ''>('');
  
  // Comparison State
  const [compareType, setCompareType] = useState<'sections' | 'students'>('sections');
  const [entityA, setEntityA] = useState<string>('');
  const [entityB, setEntityB] = useState<string>('');

  // Derived Data based on View Mode
  const overviewStats = db.getBehaviorDistribution(null);
  const globalTopStudents = db.getTopStudents(5);

  const sectionStats = selectedSectionId ? db.getSectionStats(Number(selectedSectionId)) : null;
  const classTopStudents = selectedSectionId ? db.getTopStudents(5, Number(selectedSectionId)) : [];
  
  // Helper for Pie Chart CSS
  const getPieStyle = (stats: any) => ({
    background: `conic-gradient(
      #A8E6CF 0% ${stats.helpfulness}%, 
      #FFD3B6 ${stats.helpfulness}% ${stats.helpfulness + stats.respect}%, 
      #FFAAA5 ${stats.helpfulness + stats.respect}% ${stats.helpfulness + stats.respect + stats.teamwork}%, 
      #C7CEEA ${stats.helpfulness + stats.respect + stats.teamwork}% 100%
    )`
  });

  // Comparison Logic
  const renderComparison = () => {
      if (!entityA || !entityB) return <div className="text-center text-gray-400 py-10">اختر الطرفين للمقارنة</div>;

      let dataA, dataB;
      if (compareType === 'sections') {
          dataA = db.getSectionStats(Number(entityA));
          dataB = db.getSectionStats(Number(entityB));
      } else {
          dataA = db.getStudentStats(Number(entityA));
          dataB = db.getStudentStats(Number(entityB));
      }

      if (!dataA || !dataB) return null;

      // Max value for bar scaling
      const maxPoints = Math.max((dataA as any).averagePoints || (dataA as any).totalPoints, (dataB as any).averagePoints || (dataB as any).totalPoints) || 1;

      return (
          <div className="space-y-6 animate-fade-in">
             <div className="grid grid-cols-2 gap-4">
                 <div className="bg-blue-50 p-4 rounded-xl border-2 border-blue-100 text-center dark:bg-blue-900/20 dark:border-blue-800">
                     <div className="font-bold text-blue-800 mb-1 dark:text-blue-300">{dataA.name}</div>
                     <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {(dataA as any).averagePoints || (dataA as any).totalPoints}
                     </div>
                     <div className="text-xs text-blue-400">النقاط</div>
                 </div>
                 <div className="bg-purple-50 p-4 rounded-xl border-2 border-purple-100 text-center dark:bg-purple-900/20 dark:border-purple-800">
                     <div className="font-bold text-purple-800 mb-1 dark:text-purple-300">{dataB.name}</div>
                     <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                        {(dataB as any).averagePoints || (dataB as any).totalPoints}
                     </div>
                     <div className="text-xs text-purple-400">النقاط</div>
                 </div>
             </div>

             {/* Comparison Bars */}
             <div className="bg-white p-5 rounded-xl border border-gray-100 dark:bg-gray-800 dark:border-gray-700">
                 <h3 className="font-bold text-gray-800 mb-4 dark:text-white">مقارنة النقاط</h3>
                 
                 <div className="mb-4">
                     <div className="flex justify-between text-xs mb-1 text-gray-500 dark:text-gray-400">
                         <span>{dataA.name}</span>
                         <span>{Math.round((((dataA as any).averagePoints || (dataA as any).totalPoints) / maxPoints) * 100)}%</span>
                     </div>
                     <div className="h-3 bg-gray-100 rounded-full overflow-hidden dark:bg-gray-700">
                         <div className="h-full bg-blue-500" style={{ width: `${(((dataA as any).averagePoints || (dataA as any).totalPoints) / maxPoints) * 100}%` }} />
                     </div>
                 </div>

                 <div>
                     <div className="flex justify-between text-xs mb-1 text-gray-500 dark:text-gray-400">
                         <span>{dataB.name}</span>
                         <span>{Math.round((((dataB as any).averagePoints || (dataB as any).totalPoints) / maxPoints) * 100)}%</span>
                     </div>
                     <div className="h-3 bg-gray-100 rounded-full overflow-hidden dark:bg-gray-700">
                         <div className="h-full bg-purple-500" style={{ width: `${(((dataB as any).averagePoints || (dataB as any).totalPoints) / maxPoints) * 100}%` }} />
                     </div>
                 </div>
             </div>
          </div>
      );
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24 dark:bg-gray-900 transition-colors duration-200">
      <header className="bg-white p-4 shadow-sm sticky top-0 z-10 flex flex-col gap-4 dark:bg-gray-800 dark:border-b dark:border-gray-700">
        <div className="flex items-center gap-3">
             <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full dark:hover:bg-gray-700">
                <ChevronLeft size={24} className="text-gray-600 dark:text-gray-300" />
            </button>
            <div>
                <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2 dark:text-white">
                <BarChart2 size={24} className="text-blue-600" />
                لوحة التحليل
                </h1>
            </div>
        </div>
        
        {/* Mode Switcher */}
        <div className="flex bg-gray-100 p-1 rounded-xl dark:bg-gray-700">
            <button 
                onClick={() => setViewMode('overview')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${viewMode === 'overview' ? 'bg-white shadow text-gray-800 dark:bg-gray-600 dark:text-white' : 'text-gray-500'}`}
            >
                نظرة عامة
            </button>
            <button 
                onClick={() => setViewMode('class')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${viewMode === 'class' ? 'bg-white shadow text-gray-800 dark:bg-gray-600 dark:text-white' : 'text-gray-500'}`}
            >
                عرض فصل
            </button>
            <button 
                onClick={() => setViewMode('compare')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${viewMode === 'compare' ? 'bg-white shadow text-gray-800 dark:bg-gray-600 dark:text-white' : 'text-gray-500'}`}
            >
                مقارنة
            </button>
        </div>
      </header>

      <main className="p-4 space-y-6">
        
        {/* --- VIEW MODE: OVERVIEW --- */}
        {viewMode === 'overview' && (
             <div className="space-y-6 animate-fade-in">
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 dark:bg-gray-800 dark:border-gray-700">
                        <div className="text-gray-500 text-xs font-bold mb-1 dark:text-gray-400">إجمالي الطلاب</div>
                        <div className="text-2xl font-bold text-gray-800 dark:text-white">{allStudents.length}</div>
                    </div>
                    <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 dark:bg-gray-800 dark:border-gray-700">
                        <div className="text-gray-500 text-xs font-bold mb-1 dark:text-gray-400">أعلى فصل</div>
                        <div className="text-sm font-bold text-green-600 dark:text-green-400">الصف الأول - أ</div>
                    </div>
                </div>
                
                {/* Behavior Chart */}
                <section className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 dark:bg-gray-800 dark:border-gray-700">
                    <h2 className="font-bold text-gray-800 mb-6 dark:text-white">توزيع السلوك (الكل)</h2>
                    <div className="flex items-center gap-8">
                        <div className="relative w-32 h-32 rounded-full shadow-inner" style={getPieStyle(overviewStats)}>
                            <div className="absolute inset-0 m-8 bg-white rounded-full shadow-sm flex items-center justify-center dark:bg-gray-800">
                                <span className="font-bold text-gray-400 text-xs">الإجمالي</span>
                            </div>
                        </div>
                        <div className="flex-1 space-y-3">
                            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#A8E6CF]"></div><span className="text-xs font-bold text-gray-600 dark:text-gray-300">المساعدة ({overviewStats.helpfulness}%)</span></div>
                            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#FFD3B6]"></div><span className="text-xs font-bold text-gray-600 dark:text-gray-300">الاحترام ({overviewStats.respect}%)</span></div>
                            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#FFAAA5]"></div><span className="text-xs font-bold text-gray-600 dark:text-gray-300">التعاون ({overviewStats.teamwork}%)</span></div>
                            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#C7CEEA]"></div><span className="text-xs font-bold text-gray-600 dark:text-gray-300">التميز ({overviewStats.excellence}%)</span></div>
                        </div>
                    </div>
                </section>

                {/* Top Students (Global) */}
                <section className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 dark:bg-gray-800 dark:border-gray-700">
                    <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2 dark:text-white">
                        <Trophy size={20} className="text-yellow-500" />
                        لوحة الشرف (العامة)
                    </h2>

                    <div className="space-y-4">
                        {globalTopStudents.map((student, index) => (
                            <div key={student.id} className="flex items-center gap-4 border-b border-gray-50 pb-3 last:border-0 last:pb-0 dark:border-gray-700">
                                <div className="font-bold text-gray-300 w-4 text-center dark:text-gray-600">{index + 1}</div>
                                <Avatar level={student.avatar_level} gender={student.gender} size="sm" />
                                <div className="flex-1">
                                    <div className="font-bold text-gray-800 text-sm dark:text-white">{student.name}</div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400">
                                         {db.getGrades().find(g => g.id === student.grade_id)?.name}
                                    </div>
                                </div>
                                <div className="bg-yellow-50 text-yellow-700 px-2 py-1 rounded-lg text-xs font-bold dark:bg-yellow-900/30 dark:text-yellow-400">
                                    {student.total_points} ⭐️
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
             </div>
        )}

        {/* --- VIEW MODE: CLASS VIEW --- */}
        {viewMode === 'class' && (
            <div className="space-y-6 animate-fade-in">
                <select 
                    value={selectedSectionId}
                    onChange={(e) => setSelectedSectionId(Number(e.target.value))}
                    className="w-full p-3 rounded-xl border border-gray-200 bg-white font-bold text-gray-700 outline-none focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                >
                    <option value=""> اختر الفصل لعرض التفاصيل...</option>
                    {allSections.map(s => (
                        <option key={s.id} value={s.id}>الصف {db.getGrades().find(g => g.id === s.grade_id)?.name} - فصل {s.name}</option>
                    ))}
                </select>

                {sectionStats ? (
                     <div className="space-y-4">
                         <div className="bg-blue-600 text-white p-6 rounded-2xl shadow-lg shadow-blue-200 dark:shadow-none">
                             <div className="text-blue-100 text-sm font-medium mb-1">متوسط نقاط الفصل</div>
                             <div className="text-4xl font-bold">{sectionStats.averagePoints}</div>
                             <div className="mt-4 flex items-center gap-2 text-xs bg-white/20 w-fit px-3 py-1 rounded-full">
                                 <Users size={14} />
                                 {sectionStats.studentCount} طالب
                             </div>
                         </div>

                         {/* Filtered Top Students */}
                         <section className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 dark:bg-gray-800 dark:border-gray-700">
                            <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2 dark:text-white">
                                <Trophy size={20} className="text-yellow-500" />
                                الأوائل في الفصل
                            </h2>
                            {classTopStudents.length > 0 ? (
                                <div className="space-y-4">
                                    {classTopStudents.map((student, index) => (
                                        <div key={student.id} className="flex items-center gap-4 border-b border-gray-50 pb-3 last:border-0 last:pb-0 dark:border-gray-700">
                                            <div className="font-bold text-gray-300 w-4 text-center dark:text-gray-600">{index + 1}</div>
                                            <Avatar level={student.avatar_level} gender={student.gender} size="sm" />
                                            <div className="flex-1">
                                                <div className="font-bold text-gray-800 text-sm dark:text-white">{student.name}</div>
                                            </div>
                                            <div className="bg-yellow-50 text-yellow-700 px-2 py-1 rounded-lg text-xs font-bold dark:bg-yellow-900/30 dark:text-yellow-400">
                                                {student.total_points} ⭐️
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-gray-400 text-sm text-center py-4">لا توجد بيانات كافية</div>
                            )}
                         </section>

                         <section className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 dark:bg-gray-800 dark:border-gray-700">
                            <h2 className="font-bold text-gray-800 mb-6 dark:text-white">توزيع السلوك للفصل</h2>
                            <div className="flex items-center gap-8">
                                <div className="relative w-32 h-32 rounded-full shadow-inner" style={getPieStyle(sectionStats.distribution)}>
                                    <div className="absolute inset-0 m-8 bg-white rounded-full shadow-sm flex items-center justify-center dark:bg-gray-800">
                                        <span className="font-bold text-gray-400 text-xs">الإجمالي</span>
                                    </div>
                                </div>
                                <div className="flex-1 space-y-2 text-xs">
                                    {/* Simplified Legend */}
                                    <div className="flex justify-between text-gray-600 dark:text-gray-300"><span>المساعدة</span><b>{sectionStats.distribution.helpfulness}%</b></div>
                                    <div className="flex justify-between text-gray-600 dark:text-gray-300"><span>الاحترام</span><b>{sectionStats.distribution.respect}%</b></div>
                                    <div className="flex justify-between text-gray-600 dark:text-gray-300"><span>التعاون</span><b>{sectionStats.distribution.teamwork}%</b></div>
                                    <div className="flex justify-between text-gray-600 dark:text-gray-300"><span>التميز</span><b>{sectionStats.distribution.excellence}%</b></div>
                                </div>
                            </div>
                        </section>
                     </div>
                ) : (
                    <div className="text-center py-10 text-gray-400">
                        <Filter size={48} className="mx-auto mb-3 opacity-20" />
                        يرجى اختيار فصل لعرض بياناته
                    </div>
                )}
            </div>
        )}

        {/* --- VIEW MODE: COMPARE --- */}
        {viewMode === 'compare' && (
            <div className="space-y-6 animate-fade-in">
                <div className="flex bg-gray-200 p-1 rounded-lg dark:bg-gray-700">
                     <button 
                        onClick={() => setCompareType('sections')}
                        className={`flex-1 py-1 text-xs font-bold rounded transition-all ${compareType === 'sections' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500'}`}
                    >
                        مقارنة فصول
                    </button>
                    <button 
                        onClick={() => setCompareType('students')}
                        className={`flex-1 py-1 text-xs font-bold rounded transition-all ${compareType === 'students' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500'}`}
                    >
                        مقارنة طلاب
                    </button>
                </div>

                <div className="grid grid-cols-2 gap-3 relative">
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white border rounded-full p-1 z-10 shadow-sm dark:bg-gray-700 dark:border-gray-600">
                        <ArrowRightLeft size={16} className="text-gray-400" />
                    </div>

                    {/* Select A */}
                    <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1">الطرف الأول</label>
                        <select 
                            value={entityA}
                            onChange={(e) => setEntityA(e.target.value)}
                            className="w-full p-2 rounded-lg border border-gray-200 text-xs font-bold bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                        >
                            <option value="">اختر...</option>
                            {compareType === 'sections' 
                                ? allSections.map(s => <option key={s.id} value={s.id}>{s.name}</option>)
                                : allStudents.map(s => <option key={s.id} value={s.id}>{s.name}</option>)
                            }
                        </select>
                    </div>

                    {/* Select B */}
                    <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1">الطرف الثاني</label>
                        <select 
                            value={entityB}
                            onChange={(e) => setEntityB(e.target.value)}
                            className="w-full p-2 rounded-lg border border-gray-200 text-xs font-bold bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                        >
                            <option value="">اختر...</option>
                            {compareType === 'sections' 
                                ? allSections.map(s => <option key={s.id} value={s.id}>{s.name}</option>)
                                : allStudents.map(s => <option key={s.id} value={s.id}>{s.name}</option>)
                            }
                        </select>
                    </div>
                </div>

                {renderComparison()}
            </div>
        )}

      </main>
    </div>
  );
};

export default AnalyticsPage;
