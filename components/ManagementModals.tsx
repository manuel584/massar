
import React, { useState, useEffect } from 'react';
import { XSquare, Save, User, Palette, BookOpen } from './Icons';

// --- Manage Grade Modal ---
interface ManageGradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string, color: string, icon: string) => void;
  initialData?: { name: string; color: string; icon: string };
}

export const ManageGradeModal: React.FC<ManageGradeModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
  const [name, setName] = useState(initialData?.name || '');
  const [color, setColor] = useState(initialData?.color || '#FFE5E5');
  const [icon, setIcon] = useState(initialData?.icon || '📚');

  const ICONS = ['📚', '📖', '📝', '📐', '🧪', '🎨', '⚽', '🧩', '🏫', '🚌'];
  const COLORS = ['#FFE5E5', '#E5F3FF', '#FFF5E5', '#E5FFE5', '#F5E5FF', '#FFFFE5', '#F3F4F6'];

  useEffect(() => {
    if (isOpen) {
        setName(initialData?.name || '');
        setColor(initialData?.color || '#FFE5E5');
        setIcon(initialData?.icon || '📚');
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fade-in backdrop-blur-sm">
      <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl dark:bg-gray-800 dark:text-white slide-up">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold">{initialData ? 'تعديل الصف' : 'إضافة صف جديد'}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-red-500"><XSquare size={24} /></button>
        </div>

        <div className="space-y-4">
            <div>
                <label className="block text-sm font-bold text-gray-500 mb-1 dark:text-gray-400">اسم الصف</label>
                <input 
                    type="text" 
                    value={name} 
                    onChange={e => setName(e.target.value)} 
                    placeholder="مثال: الصف الأول" 
                    className="w-full p-3 rounded-xl border border-gray-200 outline-none focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" 
                    autoFocus
                />
            </div>

            <div>
                <label className="block text-sm font-bold text-gray-500 mb-1 dark:text-gray-400">الأيقونة</label>
                <div className="flex gap-2 overflow-x-auto py-2 no-scrollbar">
                    {ICONS.map(i => (
                        <button key={i} onClick={() => setIcon(i)} className={`min-w-[40px] h-[40px] rounded-lg border-2 flex items-center justify-center text-lg ${icon === i ? 'border-blue-500 bg-blue-50' : 'border-transparent bg-gray-50 dark:bg-gray-700'}`}>{i}</button>
                    ))}
                </div>
            </div>

            <div>
                <label className="block text-sm font-bold text-gray-500 mb-1 dark:text-gray-400">اللون المميز</label>
                <div className="flex gap-2 overflow-x-auto py-2 no-scrollbar">
                    {COLORS.map(c => (
                        <button key={c} onClick={() => setColor(c)} className={`min-w-[32px] h-[32px] rounded-full border-2 ${color === c ? 'border-gray-500 scale-110' : 'border-transparent'}`} style={{ backgroundColor: c }} />
                    ))}
                </div>
            </div>
        </div>

        <button 
            onClick={() => { 
                if(name) {
                    onSave(name, color, icon); 
                    onClose(); 
                }
            }} 
            disabled={!name} 
            className="w-full mt-6 py-3 bg-blue-600 text-white rounded-xl font-bold disabled:bg-gray-300 hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200 dark:shadow-none"
        >
            {initialData ? 'حفظ التغييرات' : 'إضافة الصف'}
        </button>
      </div>
    </div>
  );
};

// --- Manage Section Modal ---
interface ManageSectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string) => void;
}

export const ManageSectionModal: React.FC<ManageSectionModalProps> = ({ isOpen, onClose, onSave }) => {
  const [name, setName] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fade-in backdrop-blur-sm">
      <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl dark:bg-gray-800 dark:text-white slide-up">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold">إضافة فصل (شعبة)</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-red-500"><XSquare size={24} /></button>
        </div>
        <div className="mb-6">
            <label className="block text-sm font-bold text-gray-500 mb-1 dark:text-gray-400">اسم الفصل</label>
            <input 
                type="text" 
                value={name} 
                onChange={e => setName(e.target.value)} 
                placeholder="مثال: أ، ب، 1، 2..." 
                className="w-full p-3 rounded-xl border border-gray-200 outline-none focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" 
                autoFocus
            />
        </div>
        <button 
            onClick={() => { 
                if(name) {
                    onSave(name); 
                    onClose(); 
                    setName(''); 
                }
            }} 
            disabled={!name} 
            className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold disabled:bg-gray-300 hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200 dark:shadow-none"
        >
            إضافة
        </button>
      </div>
    </div>
  );
};

// --- Manage Student Modal ---
interface ManageStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string, gender: 'male' | 'female') => void;
}

export const ManageStudentModal: React.FC<ManageStudentModalProps> = ({ isOpen, onClose, onSave }) => {
  const [name, setName] = useState('');
  const [gender, setGender] = useState<'male' | 'female'>('male');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fade-in backdrop-blur-sm">
      <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl dark:bg-gray-800 dark:text-white slide-up">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold">إضافة طالب جديد</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-red-500"><XSquare size={24} /></button>
        </div>
        
        <div className="space-y-4">
            <div>
                <label className="block text-sm font-bold text-gray-500 mb-1 dark:text-gray-400">اسم الطالب</label>
                <input 
                    type="text" 
                    value={name} 
                    onChange={e => setName(e.target.value)} 
                    placeholder="الاسم الثلاثي" 
                    className="w-full p-3 rounded-xl border border-gray-200 outline-none focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" 
                    autoFocus
                />
            </div>
            
            <div>
                 <label className="block text-sm font-bold text-gray-500 mb-2 dark:text-gray-400">النوع</label>
                 <div className="flex bg-gray-100 p-1 rounded-xl dark:bg-gray-700">
                     <button onClick={() => setGender('male')} className={`flex-1 py-2 rounded-lg font-bold text-sm transition-all ${gender === 'male' ? 'bg-white shadow text-blue-600 dark:bg-gray-600 dark:text-blue-400' : 'text-gray-400'}`}>ذكر</button>
                     <button onClick={() => setGender('female')} className={`flex-1 py-2 rounded-lg font-bold text-sm transition-all ${gender === 'female' ? 'bg-white shadow text-pink-600 dark:bg-gray-600 dark:text-pink-400' : 'text-gray-400'}`}>أنثى</button>
                 </div>
            </div>
        </div>

        <button 
            onClick={() => { 
                if(name) {
                    onSave(name, gender); 
                    onClose(); 
                    setName(''); 
                }
            }} 
            disabled={!name} 
            className="w-full mt-6 py-3 bg-blue-600 text-white rounded-xl font-bold disabled:bg-gray-300 hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200 dark:shadow-none"
        >
            إضافة
        </button>
      </div>
    </div>
  );
};
