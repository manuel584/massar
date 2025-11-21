
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../services/dataService';
import { ChevronLeft, Plus, Table, Calendar } from '../components/Icons';

const SessionSheetsListPage: React.FC = () => {
  const { sectionId } = useParams<{ sectionId: string }>();
  const navigate = useNavigate();
  const sId = Number(sectionId);
  
  const sessions = db.getSessionsBySection(sId);
  const section = db.getAllSections().find(s => s.id === sId);

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <header className="bg-white p-4 shadow-sm sticky top-0 z-10 flex items-center justify-between">
        <div className="flex items-center gap-2">
            <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full">
            <ChevronLeft size={24} />
            </button>
            <div>
                <h1 className="text-lg font-bold text-gray-800">جداول المتابعة</h1>
                <p className="text-xs text-gray-500">الفصل {section?.name}</p>
            </div>
        </div>
        <button 
            onClick={() => navigate(`/create-session/${sId}`)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-blue-700"
        >
            <Plus size={16} /> جديد
        </button>
      </header>

      <main className="p-4 space-y-4">
        {sessions.length === 0 ? (
            <div className="text-center py-12">
                <div className="bg-white w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                    <Table size={48} className="text-gray-300" />
                </div>
                <h3 className="text-gray-800 font-bold mb-2">لا توجد جداول بعد</h3>
                <p className="text-gray-500 text-sm mb-6">قم بإنشاء جدول لتتبع الحضور، الواجبات، أو المشاركة.</p>
                <button 
                    onClick={() => navigate(`/create-session/${sId}`)}
                    className="text-blue-600 font-bold text-sm border border-blue-200 bg-blue-50 px-6 py-3 rounded-xl hover:bg-blue-100"
                >
                    إنشاء أول جدول
                </button>
            </div>
        ) : (
            sessions.map(session => (
                <div 
                    key={session.id}
                    onClick={() => navigate(`/session/${session.id}`)}
                    className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer"
                >
                    <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-3">
                            <div className="bg-purple-100 p-3 rounded-lg text-purple-600">
                                <Table size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-800">{session.name}</h3>
                                <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                                    <Calendar size={12} />
                                    <span>{session.start_date}</span>
                                    <span>•</span>
                                    <span>{session.duration} {session.time_unit === 'day' ? 'أيام' : session.time_unit === 'week' ? 'أسابيع' : 'أشهر'}</span>
                                </div>
                            </div>
                        </div>
                        <ChevronLeft size={16} className="text-gray-400 rotate-180 mt-2" />
                    </div>
                </div>
            ))
        )}
      </main>
    </div>
  );
};

export default SessionSheetsListPage;
