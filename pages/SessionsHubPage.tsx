
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../services/dataService';
import { Table, Users, ChevronLeft } from '../components/Icons';

const SessionsHubPage: React.FC = () => {
  const navigate = useNavigate();
  const grades = db.getGrades();

  return (
    <div className="min-h-screen bg-gray-50 pb-24 dark:bg-gray-900 transition-colors duration-200">
      <header className="bg-white p-4 shadow-sm sticky top-0 z-10 border-b border-gray-100 flex items-center gap-3 dark:bg-gray-800 dark:border-gray-700">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full dark:hover:bg-gray-700">
            <ChevronLeft size={24} className="text-gray-600 dark:text-gray-300" />
        </button>
        <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2 dark:text-white">
          <div className="bg-blue-50 p-2 rounded-lg text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
            <Table size={24} />
          </div>
          المتابعة اليومية
        </h1>
      </header>

      <main className="p-4 space-y-6 animate-fade-in">
        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 dark:bg-blue-900/20 dark:border-blue-800">
            <p className="text-blue-800 text-sm font-bold dark:text-blue-300">اختر الفصل للوصول السريع إلى جداول الحضور، الواجبات، والمتابعة.</p>
        </div>

        {grades.map(grade => {
          const sections = db.getSections(grade.id);
          return (
            <div key={grade.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 dark:bg-gray-800 dark:border-gray-700">
              <div className="flex items-center gap-3 mb-4 border-b border-gray-50 pb-2 dark:border-gray-700">
                <span className="text-2xl">{grade.icon}</span>
                <h2 className="font-bold text-lg text-gray-800 dark:text-white">{grade.name}</h2>
              </div>
              
              <div className="grid grid-cols-3 gap-3">
                {sections.map(section => {
                  const studentCount = db.getStudentsBySection(section.id).length;
                  return (
                    <button
                        key={section.id}
                        onClick={() => navigate(`/sessions/${section.id}`)}
                        className="bg-gray-50 hover:bg-blue-50 hover:border-blue-200 border border-gray-200 rounded-xl p-3 flex flex-col items-center justify-center gap-2 transition-all active:scale-95 group dark:bg-gray-700 dark:border-gray-600 dark:hover:bg-blue-900/30 dark:hover:border-blue-800"
                    >
                        <span className="text-base font-bold text-gray-700 group-hover:text-blue-700 dark:text-gray-200 dark:group-hover:text-blue-400">فصل {section.name}</span>
                        <div className="flex items-center gap-1 text-[10px] text-gray-400 group-hover:text-blue-400 dark:text-gray-500">
                            <Users size={12} />
                            <span>{studentCount}</span>
                        </div>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </main>
    </div>
  );
};

export default SessionsHubPage;
