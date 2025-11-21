
import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../services/dataService';
import { ChevronLeft, Table, BookOpen, UploadCloud, CheckSquare, Calendar, Settings, Edit } from '../components/Icons';
import { MarkType, Lesson, MarkingConfig } from '../types';
import ImportLessonsModal from '../components/ImportLessonsModal';
import MarkingConfigModal from '../components/MarkingConfigModal';

const SessionSheetPage: React.FC = () => {
  const { sheetId } = useParams<{ sheetId: string }>();
  const navigate = useNavigate();
  const sId = Number(sheetId);
  
  const [sheet, setSheet] = useState(db.getSessionSheet(sId));
  const [, forceUpdate] = useState({});
  
  // Lesson & Import State
  const [allLessons, setAllLessons] = useState<Lesson[]>(db.getAllLessons());
  const [selectedLessonId, setSelectedLessonId] = useState<string>('');
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  // View/Tab State
  const [markingPresets, setMarkingPresets] = useState<MarkingConfig[]>(db.getMarkingConfigs());
  const [activePresetId, setActivePresetId] = useState<string>(sheet?.marking_config_id || 'attendance');
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);

  // Refs for sync scrolling
  const headerScrollRef = useRef<HTMLDivElement>(null);
  const bodyScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
      setMarkingPresets(db.getMarkingConfigs());
  }, [isConfigModalOpen]);

  if (!sheet) return <div>Not Found</div>;

  const sectionStudents = db.getStudentsBySection(sheet.section_id);
  
  // Dynamic preset loading
  const preset = markingPresets.find(p => p.id === activePresetId) || markingPresets[0];

  const refreshLessons = () => {
      setAllLessons(db.getAllLessons());
  };

  const getMark = (studentId: number, colIndex: number) => {
    // Updated to filter by CONTEXT (activePresetId)
    // This ensures 'attendance' marks don't show up in 'homework' tab
    return sheet.marks.find(m => 
        m.student_id === studentId && 
        m.column_index === colIndex &&
        m.context === activePresetId
    );
  };

  const handleCellClick = (studentId: number, colIndex: number) => {
    const currentMark = getMark(studentId, colIndex);
    
    // Cycle logic
    let nextType: MarkType | null = null;
    
    if (!currentMark) {
        nextType = preset.marks[0].type;
    } else {
        const currentIndex = preset.marks.findIndex(m => m.type === currentMark.type);
        if (currentIndex < preset.marks.length - 1) {
            nextType = preset.marks[currentIndex + 1].type;
        } else {
            nextType = null; // Clear
        }
    }

    // Pass activePresetId as context
    db.updateSessionMark(sId, studentId, colIndex, nextType, activePresetId);
    setSheet(db.getSessionSheet(sId));
    forceUpdate({});
  };

  const calculateTotal = (studentId: number) => {
    // Filter marks by student AND context
    const studentMarks = sheet.marks.filter(m => 
        m.student_id === studentId && 
        m.context === activePresetId
    );
    let total = 0;
    studentMarks.forEach(mark => {
        const def = preset.marks.find(d => d.type === mark.type);
        if (def) total += def.weight;
    });
    return total;
  };

  const getMarkDefinition = (type: MarkType) => preset.marks.find(m => m.type === type);

  const handleBodyScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (headerScrollRef.current) {
      headerScrollRef.current.scrollLeft = e.currentTarget.scrollLeft;
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col dark:bg-gray-900">
      <header className="bg-white p-4 shadow-sm border-b border-gray-100 flex flex-col gap-4 sticky top-0 z-20 dark:bg-gray-800 dark:border-gray-700">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full dark:hover:bg-gray-700">
                <ChevronLeft size={24} className="text-gray-600 dark:text-gray-300" />
              </button>
              <div>
                 <h1 className="text-sm font-bold text-gray-800 dark:text-white">{sheet.name}</h1>
                 <p className="text-xs text-gray-500 flex gap-2 dark:text-gray-400">
                    <span>{sheet.time_unit === 'day' ? 'يومي' : sheet.time_unit === 'week' ? 'أسبوعي' : 'شهري'}</span>
                    <span>•</span>
                    <span>{sheet.duration} أعمدة</span>
                 </p>
              </div>
            </div>

            {/* Lesson Controls */}
             <div className="flex items-center gap-2">
                <div className="relative hidden sm:block w-48">
                     <select 
                        value={selectedLessonId}
                        onChange={(e) => setSelectedLessonId(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 text-gray-800 text-xs font-bold rounded-lg p-2 pr-8 appearance-none focus:ring-2 focus:ring-blue-100 outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    >
                        <option value="">اختر الدرس...</option>
                        {allLessons.map(l => (
                            <option key={l.id} value={l.id}>
                                {l.unit_name}: {l.lesson_name}
                            </option>
                        ))}
                    </select>
                    <BookOpen size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
                <button 
                    onClick={() => setIsImportModalOpen(true)}
                    className="bg-blue-50 text-blue-600 p-2 rounded-lg hover:bg-blue-100 border border-blue-100 flex items-center gap-1 dark:bg-blue-900/30 dark:border-blue-800 dark:text-blue-400"
                    title="استيراد دروس"
                >
                    <UploadCloud size={16} />
                    <span className="text-xs font-bold hidden sm:inline">استيراد</span>
                </button>
             </div>
        </div>

        {/* Mobile Lesson Dropdown */}
        <div className="sm:hidden">
             <div className="relative w-full">
                 <select 
                    value={selectedLessonId}
                    onChange={(e) => setSelectedLessonId(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 text-gray-800 text-xs font-bold rounded-lg p-2 pr-8 appearance-none focus:ring-2 focus:ring-blue-100 outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                    <option value="">اختر الدرس...</option>
                    {allLessons.map(l => (
                        <option key={l.id} value={l.id}>
                            {l.unit_name}: {l.lesson_name}
                        </option>
                    ))}
                </select>
                <BookOpen size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
        </div>

        {/* Navigation Tabs & Settings */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar w-full">
            <div className="flex bg-gray-100 p-1 rounded-lg flex-1 sm:flex-none dark:bg-gray-700">
                 {markingPresets.map(p => (
                     <button
                        key={p.id}
                        onClick={() => setActivePresetId(p.id)}
                        className={`flex-1 sm:flex-none px-4 py-1.5 rounded-md text-xs font-bold transition-all whitespace-nowrap ${
                            activePresetId === p.id 
                            ? 'bg-white text-blue-600 shadow-sm dark:bg-gray-600 dark:text-blue-300' 
                            : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'
                        }`}
                     >
                        {p.name}
                     </button>
                 ))}
            </div>
            <button 
                onClick={() => setIsConfigModalOpen(true)}
                className="p-2 bg-gray-100 rounded-lg text-gray-500 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-400"
            >
                <Settings size={18} />
            </button>
        </div>
      </header>

      {/* Table Container */}
      <div className="flex-1 overflow-hidden flex flex-col relative">
        
        {/* Sticky Header Row */}
        <div className="flex border-b border-gray-200 bg-gray-50 shadow-sm z-10 dark:bg-gray-800 dark:border-gray-700">
            {/* Fixed Corner Cell */}
            <div className="w-36 flex-shrink-0 p-3 border-l border-gray-200 font-bold text-xs text-gray-500 flex items-center justify-center bg-gray-50 sticky right-0 z-20 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)] dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700">
                الطلاب ({sectionStudents.length})
            </div>
            
            {/* Sync-able Header Cells */}
            <div ref={headerScrollRef} className="flex overflow-x-hidden no-scrollbar">
                {sheet.columns.map(col => (
                    <div key={col.index} className="w-16 flex-shrink-0 p-2 border-l border-gray-200 text-center bg-gray-50 flex flex-col justify-center dark:bg-gray-800 dark:border-gray-700">
                        <div className="text-xs font-bold text-gray-700 truncate px-1 dark:text-gray-300">{col.label}</div>
                        {col.date && <div className="text-[10px] text-gray-400 mt-0.5 truncate">{col.date}</div>}
                    </div>
                ))}
                <div className="w-16 flex-shrink-0 p-2 text-center bg-gray-50 flex items-center justify-center border-l border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                    <div className="text-xs font-bold text-gray-700 dark:text-gray-300">المجموع</div>
                </div>
                <div className="w-4 flex-shrink-0 dark:bg-gray-800"></div>
            </div>
        </div>

        {/* Scrollable Body */}
        <div 
            ref={bodyScrollRef} 
            onScroll={handleBodyScroll}
            className="flex-1 overflow-auto bg-white dark:bg-gray-900"
        >
            {sectionStudents.map((student, idx) => (
                <div key={student.id} className={`flex border-b border-gray-100 dark:border-gray-700 ${idx % 2 === 0 ? 'bg-white dark:bg-gray-900' : 'bg-gray-50/50 dark:bg-gray-800/50'}`}>
                    {/* Sticky Student Name Column */}
                    <div className="w-36 flex-shrink-0 p-3 border-l border-gray-200 flex items-center gap-2 bg-inherit sticky right-0 z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)] dark:border-gray-700">
                        <div className={`w-8 h-8 rounded-full bg-gray-200 border-2 flex items-center justify-center overflow-hidden text-xs font-bold text-gray-500 dark:bg-gray-700 dark:border-gray-600`}>
                            <img src={`https://picsum.photos/seed/${student.id}/100`} className="w-full h-full object-cover" alt="" />
                        </div>
                        <div className="text-xs font-bold text-gray-800 truncate dark:text-gray-200">
                            {student.name.split(' ')[0]} {student.name.split(' ')[1]?.charAt(0)}.
                        </div>
                    </div>

                    {/* Scrollable Marks */}
                    {sheet.columns.map(col => {
                        const mark = getMark(student.id, col.index);
                        const def = mark ? getMarkDefinition(mark.type) : null;
                        
                        return (
                            <div 
                                key={col.index} 
                                onClick={() => handleCellClick(student.id, col.index)}
                                className="w-16 h-14 flex-shrink-0 border-l border-gray-100 flex items-center justify-center cursor-pointer hover:bg-gray-100 active:bg-gray-200 transition-colors dark:border-gray-700 dark:hover:bg-gray-800"
                            >
                                {def ? (
                                    <div 
                                        className="w-8 h-8 rounded-lg flex items-center justify-center text-sm shadow-sm transition-transform animate-scale-in"
                                        style={{ backgroundColor: `${def.color}20`, color: def.color }}
                                    >
                                        {def.symbol}
                                    </div>
                                ) : (
                                    <div className="w-2 h-2 rounded-full bg-gray-200 opacity-30 dark:bg-gray-700" />
                                )}
                            </div>
                        );
                    })}

                    {/* Total Cell */}
                    <div className="w-16 flex-shrink-0 flex items-center justify-center border-l border-gray-100 bg-gray-50/30 font-bold text-xs text-gray-600 dark:bg-gray-800/50 dark:text-gray-400 dark:border-gray-700">
                        {calculateTotal(student.id)}/{sheet.columns.length}
                    </div>
                     <div className="w-4 flex-shrink-0"></div>
                </div>
            ))}
        </div>

        {/* Fixed Legend at Bottom */}
        <div className="bg-white border-t border-gray-100 p-2 z-20 shadow-[0_-2px_10px_rgba(0,0,0,0.05)] dark:bg-gray-800 dark:border-gray-700">
            <div className="flex gap-4 overflow-x-auto no-scrollbar pb-1">
                {preset.marks.map(m => (
                    <div key={m.type} className="flex items-center gap-1 flex-shrink-0 bg-gray-50 px-2 py-1 rounded-lg border border-gray-100 dark:bg-gray-700 dark:border-gray-600">
                         <div className="w-4 h-4 rounded flex items-center justify-center text-[10px]" style={{ backgroundColor: `${m.color}20`, color: m.color }}>
                            {m.symbol}
                         </div>
                         <span className="text-[10px] font-bold text-gray-600 dark:text-gray-300">{m.label}</span>
                    </div>
                ))}
                <button onClick={() => setIsConfigModalOpen(true)} className="flex items-center gap-1 text-xs text-blue-600 font-bold px-2">
                    <Edit size={12} /> تخصيص
                </button>
            </div>
        </div>

      </div>

      {/* Modals */}
      <ImportLessonsModal 
          isOpen={isImportModalOpen} 
          onClose={() => setIsImportModalOpen(false)}
          onImportComplete={refreshLessons}
      />

      <MarkingConfigModal
          isOpen={isConfigModalOpen}
          onClose={() => setIsConfigModalOpen(false)}
          presetId={activePresetId}
          onSave={() => setMarkingPresets(db.getMarkingConfigs())}
      />
    </div>
  );
};

export default SessionSheetPage;
