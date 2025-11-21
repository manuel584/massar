
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, BarChart2, Settings, Table } from './Icons';

const BottomNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="fixed bottom-0 w-full max-w-md bg-white border-t border-gray-100 shadow-lg z-40 flex justify-around items-center pb-safe dark:bg-gray-800 dark:border-gray-700 transition-colors duration-200">
      <button 
        onClick={() => navigate('/')}
        className={`flex flex-col items-center justify-center w-full py-3 transition-colors ${
          (isActive('/') || isActive('/home')) ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300'
        }`}
      >
        <Home size={24} strokeWidth={(isActive('/') || isActive('/home')) ? 2.5 : 2} />
        <span className="text-[10px] font-medium mt-1">الرئيسية</span>
      </button>

      <button 
        onClick={() => navigate('/sessions-hub')}
        className={`flex flex-col items-center justify-center w-full py-3 transition-colors ${
          isActive('/sessions-hub') ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300'
        }`}
      >
        <Table size={24} strokeWidth={isActive('/sessions-hub') ? 2.5 : 2} />
        <span className="text-[10px] font-medium mt-1">المتابعة</span>
      </button>

      <button 
        onClick={() => navigate('/analytics')}
        className={`flex flex-col items-center justify-center w-full py-3 transition-colors ${
          isActive('/analytics') ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300'
        }`}
      >
        <BarChart2 size={24} strokeWidth={isActive('/analytics') ? 2.5 : 2} />
        <span className="text-[10px] font-medium mt-1">التحليل</span>
      </button>

      <button 
        onClick={() => navigate('/settings')}
        className={`flex flex-col items-center justify-center w-full py-3 transition-colors ${
          isActive('/settings') ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300'
        }`}
      >
        <Settings size={24} strokeWidth={isActive('/settings') ? 2.5 : 2} />
        <span className="text-[10px] font-medium mt-1">الإعدادات</span>
      </button>
    </div>
  );
};

export default BottomNav;
