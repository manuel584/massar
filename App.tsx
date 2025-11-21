
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { db } from './services/dataService';
import HomePage from './pages/HomePage';
import GradePage from './pages/GradePage';
import StudentProfilePage from './pages/StudentProfilePage';
import LessonProgressPage from './pages/LessonProgressPage';
import SessionSheetsListPage from './pages/SessionSheetsListPage';
import CreateSessionSheetPage from './pages/CreateSessionSheetPage';
import SessionSheetPage from './pages/SessionSheetPage';
import SessionsHubPage from './pages/SessionsHubPage';
import ParentReportPage from './pages/ParentReportPage';
import SettingsPage from './pages/SettingsPage';
import AnalyticsPage from './pages/AnalyticsPage';
import BottomNav from './components/BottomNav';
import SplashScreen from './pages/SplashScreen';

const AppContent: React.FC = () => {
  const location = useLocation();
  // Hide bottom nav on the lesson tracking page and session sheet to utilize full screen
  const hideBottomNavPaths = ['/track/', '/session/', '/create-session', '/report/'];
  const showBottomNav = !hideBottomNavPaths.some(path => location.pathname.includes(path));

  return (
    <div className="max-w-md mx-auto min-h-screen shadow-2xl bg-white relative flex flex-col dark:bg-gray-900 dark:border-gray-800">
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/grade/:id" element={<GradePage />} />
          <Route path="/student/:id" element={<StudentProfilePage />} />
          <Route path="/track/:studentId" element={<LessonProgressPage />} />
          
          {/* Session Sheet Routes */}
          <Route path="/sessions-hub" element={<SessionsHubPage />} />
          <Route path="/sessions/:sectionId" element={<SessionSheetsListPage />} />
          <Route path="/create-session/:sectionId" element={<CreateSessionSheetPage />} />
          <Route path="/session/:sheetId" element={<SessionSheetPage />} />
          
          {/* Report Route */}
          <Route path="/report/student/:studentId/lesson/:lessonId" element={<ParentReportPage />} />
          
          {/* New Routes */}
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
        </Routes>
      </div>
      {showBottomNav && <BottomNav />}
    </div>
  );
};

const App: React.FC = () => {
  const [showSplash, setShowSplash] = useState(true);

  // Apply theme on startup
  useEffect(() => {
      const isDark = db.getTheme();
      if (isDark) {
          document.documentElement.classList.add('dark');
      } else {
          document.documentElement.classList.remove('dark');
      }
  }, []);

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;
