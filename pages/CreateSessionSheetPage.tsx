
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../services/dataService';
import { ChevronLeft, Calendar, CheckSquare, Table, ArrowRight, Edit } from '../components/Icons';
import { TimeUnit, MarkingConfig } from '../types';
import MarkingConfigModal from '../components/MarkingConfigModal';

const CreateSessionSheetPage: React.FC = () => {
    const { sectionId } = useParams<{ sectionId: string }>();
    const navigate = useNavigate();
    const sId = Number(sectionId);

    const [step, setStep] = useState(1);

    // Form State
    const [name, setName] = useState('');
    const [timeUnit, setTimeUnit] = useState<TimeUnit>('day');
    const [duration, setDuration] = useState(7);
    const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
    const [presetId, setPresetId] = useState('attendance');

    // Presets State
    const [presets, setPresets] = useState<MarkingConfig[]>([]);
    const [editingPresetId, setEditingPresetId] = useState<string | null>(null);

    useEffect(() => {
        setPresets(db.getMarkingConfigs());
    }, []);

    const refreshPresets = () => {
        setPresets(db.getMarkingConfigs());
    };

    const handleNext = () => {
        if (step < 3) setStep(step + 1);
        else handleCreate();
    };

    const handleBack = () => {
        if (step > 1) setStep(step - 1);
        else navigate(-1);
    };

    const handleCreate = () => {
        db.createSessionSheet(sId, name, timeUnit, duration, startDate, presetId);
        navigate(`/sessions/${sId}`);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <header className="bg-white p-4 shadow-sm flex items-center gap-2 sticky top-0 z-10">
                <button onClick={handleBack} className="p-2 hover:bg-gray-100 rounded-full">
                    <ChevronLeft size={24} />
                </button>
                <div className="flex-1">
                    <h1 className="text-lg font-bold text-gray-800">إنشاء جدول جديد</h1>
                    <div className="flex gap-1 mt-1">
                        {[1, 2, 3].map(i => (
                            <div key={i} className={`h-1 flex-1 rounded-full ${i <= step ? 'bg-blue-600' : 'bg-gray-200'}`} />
                        ))}
                    </div>
                </div>
            </header>

            <main className="flex-1 p-6 max-w-lg mx-auto w-full">
                {step === 1 && (
                    <div className="animate-fade-in">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">معلومات الجدول</h2>

                        <label className="block text-sm font-bold text-gray-700 mb-2">اسم الجدول</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="مثال: حضور شهر نوفمبر"
                            className="w-full p-4 rounded-xl border border-gray-200 mb-6 focus:border-blue-500 outline-none bg-white shadow-sm"
                            autoFocus
                        />

                        <div className="space-y-3">
                            <p className="text-sm font-bold text-gray-500">اقتراحات سريعة:</p>
                            {['حضور الفصل الدراسي الأول', 'متابعة الواجبات الشهرية', 'سجل المشاركة الأسبوعي'].map(s => (
                                <button
                                    key={s}
                                    onClick={() => setName(s)}
                                    className="block w-full text-right p-3 rounded-lg bg-white border border-gray-100 text-gray-600 hover:border-blue-300 hover:bg-blue-50 transition-colors text-sm"
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="animate-fade-in">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">إعدادات الوقت</h2>

                        <label className="block text-sm font-bold text-gray-700 mb-3">الوحدة الزمنية</label>
                        <div className="grid grid-cols-3 gap-3 mb-8">
                            {[
                                { id: 'day', label: 'يوم' },
                                { id: 'week', label: 'أسبوع' },
                                { id: 'month', label: 'شهر' }
                            ].map(opt => (
                                <button
                                    key={opt.id}
                                    onClick={() => setTimeUnit(opt.id as TimeUnit)}
                                    className={`p-4 rounded-xl border-2 font-bold text-center transition-all ${timeUnit === opt.id
                                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                                            : 'border-gray-100 bg-white text-gray-500'
                                        }`}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>

                        <label className="block text-sm font-bold text-gray-700 mb-3">
                            المدة (عدد الأعمدة): <span className="text-blue-600 text-lg">{duration}</span>
                        </label>
                        <input
                            type="range"
                            min="1"
                            max="55"
                            value={duration}
                            onChange={(e) => setDuration(Number(e.target.value))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600 mb-8"
                        />

                        <label className="block text-sm font-bold text-gray-700 mb-2">تاريخ البداية</label>
                        <div className="relative">
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="w-full p-4 rounded-xl border border-gray-200 focus:border-blue-500 outline-none bg-white shadow-sm pl-10"
                            />
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="animate-fade-in">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">نظام التقييم</h2>

                        <div className="space-y-4">
                            {presets.map(preset => (
                                <div key={preset.id} className="relative group">
                                    <button
                                        onClick={() => setPresetId(preset.id)}
                                        className={`w-full p-4 rounded-xl border-2 text-right transition-all ${presetId === preset.id
                                                ? 'border-blue-500 bg-blue-50'
                                                : 'border-gray-100 bg-white'
                                            }`}
                                    >
                                        <div className="flex justify-between items-center mb-2">
                                            <span className={`font-bold ${presetId === preset.id ? 'text-blue-800' : 'text-gray-800'}`}>{preset.name}</span>
                                            {presetId === preset.id && <div className="bg-blue-500 text-white rounded-full p-1"><CheckSquare size={12} /></div>}
                                        </div>
                                        <div className="flex gap-2 flex-wrap">
                                            {preset.marks.map(m => (
                                                <span key={m.type} className="text-xs px-2 py-1 rounded bg-white border border-gray-200 text-gray-600">
                                                    {m.symbol} {m.label}
                                                </span>
                                            ))}
                                        </div>
                                    </button>

                                    {/* Edit Button */}
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setEditingPresetId(preset.id);
                                        }}
                                        className="absolute top-4 left-4 p-2 bg-gray-100 text-gray-500 rounded-lg hover:bg-blue-100 hover:text-blue-600 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity"
                                        title="تخصيص"
                                    >
                                        <Edit size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </main>

            <footer className="p-4 bg-white border-t border-gray-100">
                <button
                    onClick={handleNext}
                    disabled={!name && step === 1}
                    className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg flex items-center justify-center gap-2 transition-all ${(!name && step === 1)
                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200 active:scale-95'
                        }`}
                >
                    {step === 3 ? 'إنشاء الجدول' : 'التالي'}
                    {step !== 3 && <ArrowRight className="rotate-180" size={20} />}
                </button>
            </footer>

            {/* Marking Config Modal */}
            {editingPresetId && (
                <MarkingConfigModal
                    isOpen={!!editingPresetId}
                    onClose={() => setEditingPresetId(null)}
                    presetId={editingPresetId}
                    onSave={refreshPresets}
                />
            )}
        </div>
    );
};

export default CreateSessionSheetPage;

