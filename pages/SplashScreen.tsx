
import React, { useEffect } from 'react';
import { Map } from '../components/Icons';

interface SplashScreenProps {
  onFinish: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  useEffect(() => {
    const timer = setTimeout(onFinish, 2500);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-600 to-blue-800 flex flex-col items-center justify-center text-white z-50">
      <div className="bg-white/20 p-8 rounded-3xl backdrop-blur-sm mb-6 animate-bounce shadow-xl border border-white/10">
        <Map size={72} className="text-white drop-shadow-md" strokeWidth={2} />
      </div>
      
      <h1 className="text-5xl font-bold tracking-wider mb-2 animate-fade-in drop-shadow-lg font-tajawal">مَسار</h1>
      <p className="text-blue-100 text-lg font-medium opacity-90 tracking-wide">رفيق المعلم الذكي</p>
      
      <div className="absolute bottom-10 w-full flex justify-center">
        <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
      </div>
    </div>
  );
};

export default SplashScreen;