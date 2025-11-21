
import React, { useState } from 'react';
import { db } from '../services/dataService';
import { FilePlus, UploadCloud, Download, XSquare, CheckCircle2, FileText } from './Icons';

interface ImportLessonsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportComplete: () => void;
}

const ImportLessonsModal: React.FC<ImportLessonsModalProps> = ({ isOpen, onClose, onImportComplete }) => {
  const [mode, setMode] = useState<'manual' | 'csv' | 'predefined'>('manual');
  const [manualForm, setManualForm] = useState({ unit: '', number: '', name: '' });
  const [csvData, setCsvData] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleManualSubmit = () => {
    if (!manualForm.unit || !manualForm.name) return;
    
    db.addLessons([{
      unit_name: manualForm.unit,
      lesson_number: Number(manualForm.number) || 0,
      lesson_name: manualForm.name
    }]);
    
    setSuccessMsg('تمت إضافة الدرس بنجاح!');
    setManualForm({ unit: '', number: '', name: '' });
    setTimeout(() => {
        setSuccessMsg('');
        onImportComplete();
    }, 1000);
  };

  const handleCsvImport = () => {
    if (!csvData) return;

    const lines = csvData.trim().split('\n');
    const lessons = lines.map(line => {
        const parts = line.split(',');
        // Expecting: Unit Name, Lesson Number, Lesson Name
        if (parts.length >= 3) {
            return {
                unit_name: parts[0].trim(),
                lesson_number: Number(parts[1].trim()) || 0,
                lesson_name: parts[2].trim()
            };
        }
        return null;
    }).filter(l => l !== null); // Remove nulls

    if (lessons.length > 0) {
        // @ts-ignore
        db.addLessons(lessons);
        setSuccessMsg(`تم استيراد ${lessons.length} درس بنجاح!`);
        setCsvData('');
        setTimeout(() => {
            setSuccessMsg('');
            onImportComplete();
            onClose();
        }, 1500);
    }
  };

  const loadPredefined = () => {
      const standardLessons = [
          { unit_name: 'الوحدة الثالثة', lesson_number: 1, lesson_name: 'الطاقة وتحولاتها' },
          { unit_name: 'الوحدة الثالثة', lesson_number: 2, lesson_name: 'الكهرباء في حياتنا' },
          { unit_name: 'الوحدة الرابعة', lesson_number: 1, lesson_name: 'الأجرام السماوية' },
          { unit_name: 'الوحدة الرابعة', lesson_number: 2, lesson_name: 'حركة الأرض' }
      ];
      db.addLessons(standardLessons);
      setSuccessMsg('تم تحميل منهج الفصل الدراسي الثاني!');
      setTimeout(() => {
          setSuccessMsg('');
          onImportComplete();
          onClose();
      }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4 animate-fade-in">
      <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl slide-up max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-800">إضافة / استيراد دروس</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-red-500">
                <XSquare size={24} />
            </button>
        </div>

        {successMsg && (
            <div className="bg-green-100 text-green-800 p-3 rounded-xl mb-4 flex items-center gap-2 font-bold animate-scale-in">
                <CheckCircle2 size={20} /> {successMsg}
            </div>
        )}

        {/* Tabs */}
        <div className="flex bg-gray-100 p-1 rounded-xl mb-6">
            <button 
                onClick={() => setMode('manual')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1 ${mode === 'manual' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500'}`}
            >
                <FilePlus size={14} /> يدوي
            </button>
            <button 
                onClick={() => setMode('csv')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1 ${mode === 'csv' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500'}`}
            >
                <UploadCloud size={14} /> نسخ/لصق
            </button>
            <button 
                onClick={() => setMode('predefined')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1 ${mode === 'predefined' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500'}`}
            >
                <Download size={14} /> منهج جاهز
            </button>
        </div>

        {mode === 'manual' && (
            <div className="space-y-4">
                <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">اسم الوحدة</label>
                    <input 
                        type="text" 
                        value={manualForm.unit}
                        onChange={(e) => setManualForm({...manualForm, unit: e.target.value})}
                        placeholder="مثال: الوحدة الثالثة"
                        className="w-full p-3 rounded-xl border border-gray-200 focus:border-blue-500 outline-none"
                    />
                </div>
                <div className="flex gap-3">
                    <div className="w-1/3">
                        <label className="block text-xs font-bold text-gray-500 mb-1">رقم الدرس</label>
                        <input 
                            type="number" 
                            value={manualForm.number}
                            onChange={(e) => setManualForm({...manualForm, number: e.target.value})}
                            placeholder="1"
                            className="w-full p-3 rounded-xl border border-gray-200 focus:border-blue-500 outline-none"
                        />
                    </div>
                    <div className="flex-1">
                        <label className="block text-xs font-bold text-gray-500 mb-1">اسم الدرس</label>
                        <input 
                            type="text" 
                            value={manualForm.name}
                            onChange={(e) => setManualForm({...manualForm, name: e.target.value})}
                            placeholder="مثال: القوى والحركة"
                            className="w-full p-3 rounded-xl border border-gray-200 focus:border-blue-500 outline-none"
                        />
                    </div>
                </div>
                <button 
                    onClick={handleManualSubmit}
                    disabled={!manualForm.unit || !manualForm.name}
                    className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                    إضافة الدرس
                </button>
            </div>
        )}

        {mode === 'csv' && (
            <div className="space-y-4">
                <div className="bg-blue-50 text-blue-700 p-3 rounded-lg text-xs leading-relaxed">
                    <strong>الصيغة المطلوبة:</strong><br/>
                    اسم الوحدة, رقم الدرس, عنوان الدرس<br/>
                    <em>مثال: الوحدة الأولى, 4, أنواع الصخور</em>
                </div>
                <textarea 
                    value={csvData}
                    onChange={(e) => setCsvData(e.target.value)}
                    placeholder="الصق البيانات هنا..."
                    className="w-full h-32 p-3 rounded-xl border border-gray-200 focus:border-blue-500 outline-none resize-none text-sm font-mono"
                ></textarea>
                <button 
                    onClick={handleCsvImport}
                    disabled={!csvData}
                    className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 disabled:bg-gray-300"
                >
                    استيراد القائمة
                </button>
            </div>
        )}

        {mode === 'predefined' && (
            <div className="space-y-4 text-center py-4">
                <div className="bg-purple-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-2">
                    <FileText size={32} className="text-purple-600" />
                </div>
                <h4 className="font-bold text-gray-800">تحميل منهج العلوم (مثال)</h4>
                <p className="text-sm text-gray-500 mb-4">سيتم إضافة وحدات ودروس الفصل الدراسي الثاني القياسية.</p>
                
                <button 
                    onClick={loadPredefined}
                    className="w-full bg-purple-600 text-white py-3 rounded-xl font-bold hover:bg-purple-700"
                >
                    تحميل المنهج
                </button>
            </div>
        )}

      </div>
    </div>
  );
};

export default ImportLessonsModal;
