
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../services/dataService';
import { PastelColors, RECOGNITION_LABELS } from '../constants';
import { ChevronLeft, Star, Heart, Shield, Zap, Award, Plus, BookOpen, Trophy, Medal, Crown, MinusCircle, CheckCircle2, AlertTriangle } from '../components/Icons';
import Avatar from '../components/Avatar';
import { RecognitionCategory, Badge } from '../types';

const StudentProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [student, setStudent] = useState(db.getStudent(Number(id)));
  const [activeTab, setActiveTab] = useState<'academic' | 'recognition' | 'badges'>('academic');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Modal State
  const [pointMode, setPointMode] = useState<'add' | 'deduct'>('add');
  const [selectedCategory, setSelectedCategory] = useState<RecognitionCategory>('excellence');
  const [pointsToAward, setPointsToAward] = useState(5);
  const [awardReason, setAwardReason] = useState('');

  useEffect(() => {
    if (id) setStudent(db.getStudent(Number(id)));
  }, [id, isModalOpen]);

  if (!student) return <div>Student not found</div>;

  const levelProgress = db.calculateLevelProgress(student.total_points);
  const rankInfo = db.getStudentRank(student.id);
  const logs = db.getLogs(student.id);
  const badges = db.getStudentBadges(student.id);

  const handlePointsSubmit = () => {
    const points = pointMode === 'add' ? pointsToAward : -pointsToAward;
    const reason = awardReason || (pointMode === 'add' ? RECOGNITION_LABELS[selectedCategory] : 'خصم نقاط');
    
    db.addPoints(student.id, points, selectedCategory, reason);
    setIsModalOpen(false);
    setPointsToAward(5);
    setAwardReason('');
  };

  const renderBadgeIcon = (iconName: string, size: number = 20) => {
      switch (iconName) {
          case 'medal': return <Medal size={size} />;
          case 'crown': return <Crown size={size} />;
          case 'trophy': return <Trophy size={size} />;
          case 'heart': return <Heart size={size} />;
          default: return <Star size={size} />;
      }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24 dark:bg-gray-900 transition-colors duration-200">
      <header className="bg-white p-4 shadow-sm sticky top-0 z-20 flex items-center justify-between dark:bg-gray-800 dark:border-b dark:border-gray-700">
        <div className="flex items-center gap-2">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full dark:hover:bg-gray-700">
            <ChevronLeft size={24} className="text-gray-600 dark:text-gray-300" />
          </button>
          <h1 className="text-lg font-bold text-gray-800 dark:text-white">{student.name}</h1>
        </div>
      </header>

      <div className="bg-white p-6 pb-8 mb-4 shadow-sm rounded-b-3xl relative z-10 dark:bg-gray-800">
        <div className="flex flex-col items-center">
          <Avatar level={student.avatar_level} size="lg" gender={student.gender} />
          <h2 className="mt-3 text-2xl font-bold text-gray-800 dark:text-white">{student.name}</h2>
          <div className="text-sm text-gray-500 mt-1 dark:text-gray-400">المستوى {levelProgress.currentLevel} | {student.total_points} نقطة</div>
          
          <div className="w-full mt-4 max-w-xs">
            <div className="flex justify-between text-xs text-gray-500 mb-1 dark:text-gray-400">
              <span>المستوى {levelProgress.currentLevel}</span>
              <span>المستوى {levelProgress.currentLevel + 1}</span>
            </div>
            <div className="h-3 bg-gray-100 rounded-full overflow-hidden dark:bg-gray-700">
              <div 
                className="h-full bg-gradient-to-r from-blue-400 to-purple-500 transition-all duration-500"
                style={{ width: `${levelProgress.percent}%` }}
              />
            </div>
            <div className="text-center text-xs text-blue-600 mt-1 font-medium dark:text-blue-400">
              باقي {levelProgress.remaining} نقطة للترقية
            </div>
          </div>
          
          {/* Rank Card */}
          <div className="mt-4 bg-yellow-50 border border-yellow-100 px-4 py-2 rounded-xl flex items-center gap-2 dark:bg-yellow-900/20 dark:border-yellow-900/30">
              <Trophy size={16} className="text-yellow-600 dark:text-yellow-500" />
              <span className="text-sm text-yellow-800 font-bold dark:text-yellow-500">
                  أنت في المركز {rankInfo.rank} من {rankInfo.total}
              </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-6">
          <div className="bg-green-50 p-3 rounded-xl flex items-center gap-3 dark:bg-green-900/20">
            <div className="bg-green-100 p-2 rounded-full text-green-600 dark:bg-green-900/50 dark:text-green-400"><Heart size={18} /></div>
            <div>
              <div className="text-xs text-gray-500 dark:text-gray-400">المساعدة</div>
              <div className="font-bold text-gray-800 dark:text-white">{student.helpfulness_points}</div>
            </div>
          </div>
          <div className="bg-purple-50 p-3 rounded-xl flex items-center gap-3 dark:bg-purple-900/20">
            <div className="bg-purple-100 p-2 rounded-full text-purple-600 dark:bg-purple-900/50 dark:text-purple-400"><Award size={18} /></div>
            <div>
              <div className="text-xs text-gray-500 dark:text-gray-400">التميز</div>
              <div className="font-bold text-gray-800 dark:text-white">{student.excellence_points}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 mb-4">
        <div className="bg-white p-1 rounded-xl flex shadow-sm dark:bg-gray-800">
          <button 
            onClick={() => setActiveTab('academic')}
            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${activeTab === 'academic' ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500'}`}
          >
            الأكاديمي
          </button>
          <button 
            onClick={() => setActiveTab('recognition')}
            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${activeTab === 'recognition' ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500'}`}
          >
            التقديرات
          </button>
          <button 
            onClick={() => setActiveTab('badges')}
            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${activeTab === 'badges' ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500'}`}
          >
            الشارات
          </button>
        </div>
      </div>

      <div className="px-4 space-y-4">
        {activeTab === 'academic' && (
          <div className="space-y-3">
             <div 
                onClick={() => navigate(`/track/${student.id}`)}
                className="bg-blue-600 text-white p-4 rounded-xl shadow-lg flex items-center justify-between cursor-pointer active:scale-95 transition-transform dark:bg-blue-700"
             >
                <div className="flex items-center gap-3">
                    <div className="bg-white/20 p-2 rounded-lg">
                        <BookOpen size={24} />
                    </div>
                    <div>
                        <div className="font-bold">تتبع درس جديد</div>
                        <div className="text-blue-100 text-xs">سجّل المشاركة، الواجب، والتسميع</div>
                    </div>
                </div>
                <ChevronLeft className="rotate-180" />
             </div>
             
             <div className="text-center py-8 text-gray-400 bg-white rounded-xl border border-dashed dark:bg-gray-800 dark:border-gray-700">
                سجل الدرجات والواجبات السابقة سيظهر هنا
             </div>
          </div>
        )}

        {activeTab === 'recognition' && (
          <div className="space-y-3">
             <button 
                onClick={() => setIsModalOpen(true)}
                className="w-full bg-white border-2 border-dashed border-gray-300 text-gray-500 p-4 rounded-xl font-bold hover:bg-gray-50 hover:border-gray-400 transition-colors flex items-center justify-center gap-2 dark:bg-gray-800 dark:border-gray-600 dark:hover:bg-gray-700 dark:text-gray-400"
             >
                <Plus size={20} /> منح أو خصم نقاط
             </button>

             {logs.map(log => (
               <div key={log.id} className="bg-white p-4 rounded-xl shadow-sm border-r-4 border-r-transparent dark:bg-gray-800" style={{ borderRightColor: log.points > 0 ? (PastelColors.categories[log.category as RecognitionCategory] || '#4CAF50') : '#EF4444' }}>
                 <div className="flex justify-between items-start">
                    <div>
                        <span className={`text-xs font-bold uppercase tracking-wider mb-1 block ${log.points > 0 ? 'text-gray-400 dark:text-gray-500' : 'text-red-500'}`}>
                            {log.category === 'deduction' ? 'خصم سلوكي' : RECOGNITION_LABELS[log.category]}
                        </span>
                        <p className="text-gray-800 font-medium dark:text-white">{log.reason || 'بدون سبب'}</p>
                        <p className="text-xs text-gray-400 mt-2">{new Date(log.date).toLocaleDateString('ar-EG')}</p>
                    </div>
                    <div className={`font-bold px-3 py-1 rounded-lg text-sm ${log.points > 0 ? 'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-500' : 'bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400'}`}>
                        {log.points > 0 ? '+' : ''}{log.points}
                    </div>
                 </div>
               </div>
             ))}
             {logs.length === 0 && (
                 <div className="text-center text-gray-400 py-8">لا توجد سجلات للنقاط بعد</div>
             )}
          </div>
        )}

        {activeTab === 'badges' && (
            <div className="grid grid-cols-2 gap-3">
                {badges.map(({ badge, earned }) => (
                    <div key={badge.id} className={`p-4 rounded-xl border-2 flex flex-col items-center text-center transition-all ${earned ? 'bg-white border-blue-100 dark:bg-gray-800 dark:border-gray-700' : 'bg-gray-50 border-gray-100 grayscale opacity-60 dark:bg-gray-800 dark:border-gray-700'}`}>
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${earned ? 'shadow-sm' : ''}`} style={{ backgroundColor: earned ? `${badge.color}20` : '#eee', color: earned ? badge.color : '#999' }}>
                            {renderBadgeIcon(badge.icon)}
                        </div>
                        <div className="font-bold text-sm text-gray-800 mb-1 dark:text-white">{badge.name}</div>
                        <div className="text-xs text-gray-500 leading-tight dark:text-gray-400">{badge.description}</div>
                    </div>
                ))}
            </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4 animate-fade-in backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl slide-up dark:bg-gray-800">
            <div className="flex justify-between items-center mb-4">
                 <h3 className="text-xl font-bold dark:text-white">إدارة النقاط</h3>
                 {/* Mode Toggle */}
                 <div className="flex bg-gray-100 p-1 rounded-lg dark:bg-gray-700">
                     <button 
                        onClick={() => setPointMode('add')}
                        className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all flex items-center gap-1 ${pointMode === 'add' ? 'bg-white text-green-600 shadow-sm dark:bg-gray-600 dark:text-green-400' : 'text-gray-400'}`}
                     >
                         <Plus size={14} /> مكافأة
                     </button>
                     <button 
                        onClick={() => setPointMode('deduct')}
                        className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all flex items-center gap-1 ${pointMode === 'deduct' ? 'bg-white text-red-600 shadow-sm dark:bg-gray-600 dark:text-red-400' : 'text-gray-400'}`}
                     >
                         <MinusCircle size={14} /> خصم
                     </button>
                 </div>
            </div>
            
            {/* Categories (Show only for Add mode ideally, but useful for context in deduct too) */}
            <div className="grid grid-cols-2 gap-3 mb-6">
                {(Object.keys(RECOGNITION_LABELS) as RecognitionCategory[]).map(cat => (
                    <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`p-3 rounded-xl border-2 text-sm font-bold transition-all ${
                            selectedCategory === cat 
                            ? (pointMode === 'add' ? 'border-green-500 bg-green-50 text-green-700' : 'border-red-400 bg-red-50 text-red-700')
                            : 'border-gray-100 bg-gray-50 text-gray-600 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-400'
                        }`}
                    >
                        {RECOGNITION_LABELS[cat]}
                    </button>
                ))}
            </div>

            {pointMode === 'deduct' && (
                <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-xl flex items-center gap-2 text-red-700 text-xs font-bold dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
                    <AlertTriangle size={16} />
                    <span>سيتم خصم النقاط من رصيد "{RECOGNITION_LABELS[selectedCategory]}"</span>
                </div>
            )}

            <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-bold text-gray-700 dark:text-gray-300">
                        {pointMode === 'add' ? 'عدد النقاط للإضافة' : 'عدد النقاط للخصم'}
                    </label>
                    <span className={`text-xl font-bold ${pointMode === 'add' ? 'text-green-600' : 'text-red-600'}`}>
                        {pointMode === 'add' ? '+' : '-'}{pointsToAward}
                    </span>
                </div>
                
                {/* Quick Select Buttons */}
                <div className="flex gap-2 mb-4">
                    {[1, 3, 5, 10].map(num => (
                        <button
                            key={num}
                            onClick={() => setPointsToAward(num)}
                            className={`flex-1 py-2 rounded-lg font-bold border-2 transition-colors ${
                                pointsToAward === num
                                ? (pointMode === 'add' ? 'border-green-500 bg-green-50 text-green-700' : 'border-red-500 bg-red-50 text-red-700')
                                : 'border-gray-200 text-gray-500 dark:border-gray-600'
                            }`}
                        >
                            {num}
                        </button>
                    ))}
                </div>

                <input 
                    type="range" 
                    min="1" 
                    max="20" 
                    value={pointsToAward} 
                    onChange={(e) => setPointsToAward(Number(e.target.value))}
                    className={`w-full h-2 rounded-lg appearance-none cursor-pointer ${pointMode === 'add' ? 'bg-green-200 accent-green-600' : 'bg-red-200 accent-red-600'}`}
                />
            </div>

            <div className="mb-6">
                <label className="block text-sm font-bold text-gray-700 mb-2 dark:text-gray-300">السبب (اختياري)</label>
                <input 
                    type="text" 
                    value={awardReason}
                    onChange={(e) => setAwardReason(e.target.value)}
                    placeholder={pointMode === 'add' ? "مثال: مساعدة زميل..." : "مثال: نسيان الكتاب..."}
                    className="w-full p-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-900/50"
                />
            </div>

            <div className="flex gap-3">
                <button 
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 p-4 rounded-xl font-bold text-gray-500 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                >
                    إلغاء
                </button>
                <button 
                    onClick={handlePointsSubmit}
                    className={`flex-1 p-4 rounded-xl font-bold text-white shadow-lg transition-colors flex items-center justify-center gap-2 ${
                        pointMode === 'add' 
                        ? 'bg-green-600 hover:bg-green-700 shadow-green-200' 
                        : 'bg-red-600 hover:bg-red-700 shadow-red-200'
                    }`}
                >
                    {pointMode === 'add' ? <CheckCircle2 size={20} /> : <AlertTriangle size={20} />}
                    {pointMode === 'add' ? 'منح النقاط' : 'تأكيد الخصم'}
                </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentProfilePage;
