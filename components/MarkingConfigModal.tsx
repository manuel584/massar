
import React, { useState, useEffect } from 'react';
import { MarkingConfig, MarkDefinition } from '../types';
import { XSquare, Save, Plus, Trash2, Edit } from './Icons';
import { db } from '../services/dataService';

interface MarkingConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  presetId: string;
  onSave: () => void;
}

const MarkingConfigModal: React.FC<MarkingConfigModalProps> = ({ isOpen, onClose, presetId, onSave }) => {
  const [config, setConfig] = useState<MarkingConfig | null>(null);

  useEffect(() => {
    if (isOpen) {
      const presets = db.getMarkingConfigs();
      const current = presets.find(p => p.id === presetId);
      if (current) {
        setConfig(JSON.parse(JSON.stringify(current))); // Deep copy
      }
    }
  }, [isOpen, presetId]);

  if (!isOpen || !config) return null;

  const handleSave = () => {
    db.updateMarkingConfig(config);
    onSave();
    onClose();
  };

  const updateMark = (index: number, field: keyof MarkDefinition, value: any) => {
      const newMarks = [...config.marks];
      newMarks[index] = { ...newMarks[index], [field]: value };
      setConfig({ ...config, marks: newMarks });
  };

  const addMark = () => {
      const newMark: MarkDefinition = {
          type: `custom_${Date.now()}`,
          label: 'جديد',
          symbol: '🔹',
          color: '#3B82F6',
          weight: 0
      };
      setConfig({ ...config, marks: [...config.marks, newMark] });
  };

  const removeMark = (index: number) => {
      const newMarks = config.marks.filter((_, i) => i !== index);
      setConfig({ ...config, marks: newMarks });
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4 animate-fade-in backdrop-blur-sm">
      <div className="bg-white w-full max-w-lg rounded-3xl p-6 shadow-2xl slide-up max-h-[90vh] overflow-y-auto dark:bg-gray-800 dark:text-white">
        <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold">تخصيص التقييم</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-red-500">
                <XSquare size={24} />
            </button>
        </div>

        <div className="mb-6">
            <label className="block text-sm font-bold text-gray-500 mb-2 dark:text-gray-400">اسم المجموعة</label>
            <input 
                type="text" 
                value={config.name}
                onChange={(e) => setConfig({...config, name: e.target.value})}
                className="w-full p-3 rounded-xl border border-gray-200 focus:border-blue-500 outline-none dark:bg-gray-700 dark:border-gray-600"
            />
        </div>

        <div className="space-y-3 mb-6">
            <label className="block text-sm font-bold text-gray-500 mb-1 dark:text-gray-400">أنواع العلامات</label>
            {config.marks.map((mark, index) => (
                <div key={index} className="flex gap-2 items-center bg-gray-50 p-2 rounded-xl border border-gray-100 dark:bg-gray-700 dark:border-gray-600">
                    <input 
                        type="text" 
                        value={mark.symbol}
                        onChange={(e) => updateMark(index, 'symbol', e.target.value)}
                        className="w-12 p-2 text-center text-xl rounded-lg border border-gray-200 dark:bg-gray-600 dark:border-gray-500"
                        placeholder="رمز"
                    />
                    <input 
                        type="text" 
                        value={mark.label}
                        onChange={(e) => updateMark(index, 'label', e.target.value)}
                        className="flex-1 p-2 rounded-lg border border-gray-200 text-sm font-bold dark:bg-gray-600 dark:border-gray-500"
                        placeholder="الوصف"
                    />
                    <input 
                        type="color" 
                        value={mark.color}
                        onChange={(e) => updateMark(index, 'color', e.target.value)}
                        className="w-10 h-10 rounded-lg cursor-pointer border-0"
                    />
                    <button onClick={() => removeMark(index)} className="text-red-400 hover:text-red-600 p-2">
                        <Trash2 size={18} />
                    </button>
                </div>
            ))}
            <button onClick={addMark} className="w-full py-2 border-2 border-dashed border-gray-300 rounded-xl text-gray-400 font-bold hover:bg-gray-50 hover:text-blue-500 dark:hover:bg-gray-700 dark:border-gray-600">
                <Plus size={18} className="inline mx-1" /> إضافة علامة
            </button>
        </div>

        <div className="flex gap-3">
            <button onClick={() => { db.resetMarkingConfigs(); onClose(); onSave(); }} className="px-4 py-3 text-red-500 font-bold text-sm">
                استعادة الافتراضي
            </button>
            <div className="flex-1 flex gap-3">
                <button onClick={onClose} className="flex-1 py-3 bg-gray-100 rounded-xl font-bold text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                    إلغاء
                </button>
                <button onClick={handleSave} className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold shadow-lg hover:bg-blue-700 flex items-center justify-center gap-2">
                    <Save size={18} /> حفظ التغييرات
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default MarkingConfigModal;
