
import React, { useState, useEffect } from 'react';
import { db } from '../services/dataService';
import { Settings, Save, Trash2, User, Bell, Moon, Globe, Database } from '../components/Icons';

const SettingsPage: React.FC = () => {
  const [profile, setProfile] = useState({ name: '', subject: '' });
  const [notificationEnabled, setNotificationEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const p = db.getTeacherProfile();
    setProfile(p);
    
    // Load Theme
    const isDark = db.getTheme();
    setDarkMode(isDark);
  }, []);

  const handleSaveProfile = () => {
    db.updateTeacherProfile(profile.name, profile.subject);
    alert('تم حفظ الملف الشخصي بنجاح');
  };

  const handleResetData = () => {
    if (window.confirm('هل أنت متأكد تماماً؟ سيتم مسح جميع بيانات الطلاب والدرجات ولن يمكن استعادتها.')) {
       db.resetAllData();
    }
  };
  
  const handleToggleDarkMode = () => {
      const newMode = !darkMode;
      setDarkMode(newMode);
      db.setTheme(newMode);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24 dark:bg-gray-900">
      <header className="bg-white p-4 shadow-sm sticky top-0 z-10 dark:bg-gray-800 dark:border-b dark:border-gray-700">
        <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2 dark:text-white">
          <Settings size={24} className="text-gray-600 dark:text-gray-300" />
          الإعدادات
        </h1>
      </header>

      <main className="p-4 space-y-6 animate-fade-in">
        
        {/* Profile Section */}
        <section className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 dark:bg-gray-800 dark:border-gray-700">
          <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2 dark:text-white">
            <User size={20} className="text-blue-600 dark:text-blue-400" />
            الملف الشخصي للمعلم
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1 dark:text-gray-300">اسم المعلم</label>
              <input 
                type="text" 
                value={profile.name}
                onChange={(e) => setProfile({...profile, name: e.target.value})}
                className="w-full p-3 rounded-xl border border-gray-200 focus:border-blue-500 outline-none bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="أ. محمد أحمد"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1 dark:text-gray-300">المادة الدراسية</label>
              <input 
                type="text" 
                value={profile.subject}
                onChange={(e) => setProfile({...profile, subject: e.target.value})}
                className="w-full p-3 rounded-xl border border-gray-200 focus:border-blue-500 outline-none bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="العلوم"
              />
            </div>
            <button 
              onClick={handleSaveProfile}
              className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 flex items-center justify-center gap-2 transition-colors"
            >
              <Save size={18} /> حفظ التغييرات
            </button>
          </div>
        </section>

        {/* Preferences */}
        <section className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 dark:bg-gray-800 dark:border-gray-700">
          <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2 dark:text-white">
            <Globe size={20} className="text-purple-600 dark:text-purple-400" />
            التفضيلات العامة
          </h2>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg cursor-pointer" onClick={() => setNotificationEnabled(!notificationEnabled)}>
                <div className="flex items-center gap-3">
                    <Bell size={20} className="text-gray-500 dark:text-gray-400" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">الإشعارات والتنبيهات</span>
                </div>
                <div className={`w-12 h-6 rounded-full p-1 transition-colors ${notificationEnabled ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`}>
                    <div className={`bg-white w-4 h-4 rounded-full shadow-sm transform transition-transform ${notificationEnabled ? 'translate-x-0' : '-translate-x-6'}`} />
                </div>
            </div>

            <div className="flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg cursor-pointer" onClick={handleToggleDarkMode}>
                <div className="flex items-center gap-3">
                    <Moon size={20} className="text-gray-500 dark:text-gray-400" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">الوضع الليلي</span>
                </div>
                <div className={`w-12 h-6 rounded-full p-1 transition-colors ${darkMode ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`}>
                    <div className={`bg-white w-4 h-4 rounded-full shadow-sm transform transition-transform ${darkMode ? 'translate-x-0' : '-translate-x-6'}`} />
                </div>
            </div>
          </div>
        </section>

        {/* Danger Zone */}
        <section className="bg-red-50 rounded-2xl p-5 shadow-sm border border-red-100 dark:bg-red-900/20 dark:border-red-900/30">
          <h2 className="font-bold text-red-800 mb-4 flex items-center gap-2 dark:text-red-400">
            <Database size={20} className="text-red-600 dark:text-red-400" />
            إدارة البيانات
          </h2>
          
          <p className="text-sm text-red-600 mb-4 dark:text-red-300">
            يمكنك حذف جميع البيانات والبدء من جديد. كن حذراً، لا يمكن التراجع عن هذا الإجراء.
          </p>

          <button 
            onClick={handleResetData}
            className="w-full bg-white border border-red-200 text-red-600 py-3 rounded-xl font-bold hover:bg-red-600 hover:text-white transition-colors flex items-center justify-center gap-2 dark:bg-transparent dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/50"
          >
            <Trash2 size={18} /> تصفير البيانات بالكامل
          </button>
        </section>

        <div className="text-center text-xs text-gray-400 pt-4">
            نسخة التطبيق 1.0.0 • مَسار
        </div>

      </main>
    </div>
  );
};

export default SettingsPage;
