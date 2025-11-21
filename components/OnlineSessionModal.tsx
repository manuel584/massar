
import React, { useState, useEffect } from 'react';
import { XSquare, Video, Copy, ExternalLink, MonitorPlay, Link2 } from './Icons';

interface OnlineSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  gradeName: string;
  sectionName: string;
}

type Platform = 'jitsi' | 'google' | 'zoom' | 'custom';

const OnlineSessionModal: React.FC<OnlineSessionModalProps> = ({ isOpen, onClose, gradeName, sectionName }) => {
  const [platform, setPlatform] = useState<Platform>('jitsi');
  const [topic, setTopic] = useState(`${gradeName} - ${sectionName}`);
  const [customLink, setCustomLink] = useState('');
  const [generatedLink, setGeneratedLink] = useState('');

  // Generate Jitsi link on open or topic change
  useEffect(() => {
    if (platform === 'jitsi') {
      // Create a safe room name: Remove spaces, special chars, add random suffix
      const safeTopic = topic.replace(/[^a-zA-Z0-9]/g, '');
      const randomId = Math.random().toString(36).substring(7);
      setGeneratedLink(`https://meet.jit.si/MasarClass-${safeTopic}-${randomId}`);
    } else if (platform === 'google') {
      setGeneratedLink('https://meet.google.com/new');
    } else {
      setGeneratedLink('');
    }
  }, [topic, platform, isOpen]);

  if (!isOpen) return null;

  const handleLaunch = () => {
    const link = platform === 'custom' || platform === 'zoom' ? customLink : generatedLink;
    if (link) {
      window.open(link, '_blank');
      onClose();
    }
  };

  const handleCopy = () => {
    const link = platform === 'custom' || platform === 'zoom' ? customLink : generatedLink;
    if (link) {
      navigator.clipboard.writeText(link);
      alert('تم نسخ رابط الحصة بنجاح');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4 animate-fade-in backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl slide-up dark:bg-gray-800 dark:text-white">
        
        <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
                <div className="bg-red-100 p-2 rounded-lg text-red-600 dark:bg-red-900/30 dark:text-red-400">
                    <Video size={24} />
                </div>
                <h3 className="text-xl font-bold">حصة أونلاين مباشرة</h3>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-red-500">
                <XSquare size={24} />
            </button>
        </div>

        <div className="space-y-4 mb-6">
            <div>
                <label className="block text-sm font-bold text-gray-500 mb-2 dark:text-gray-400">موضوع الحصة</label>
                <input 
                    type="text" 
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="w-full p-3 rounded-xl border border-gray-200 focus:border-blue-500 outline-none dark:bg-gray-700 dark:border-gray-600"
                />
            </div>

            <div>
                <label className="block text-sm font-bold text-gray-500 mb-2 dark:text-gray-400">المنصة</label>
                <div className="grid grid-cols-2 gap-3">
                    <button 
                        onClick={() => setPlatform('jitsi')}
                        className={`p-3 rounded-xl border-2 text-sm font-bold transition-all flex flex-col items-center gap-2 ${platform === 'jitsi' ? 'border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' : 'border-gray-100 bg-gray-50 text-gray-600 dark:bg-gray-700 dark:border-gray-600'}`}
                    >
                        <MonitorPlay size={20} />
                        <span>Jitsi Meet (مجاني)</span>
                    </button>
                    <button 
                        onClick={() => setPlatform('google')}
                        className={`p-3 rounded-xl border-2 text-sm font-bold transition-all flex flex-col items-center gap-2 ${platform === 'google' ? 'border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' : 'border-gray-100 bg-gray-50 text-gray-600 dark:bg-gray-700 dark:border-gray-600'}`}
                    >
                        <Video size={20} />
                        <span>Google Meet</span>
                    </button>
                    <button 
                        onClick={() => setPlatform('zoom')}
                        className={`p-3 rounded-xl border-2 text-sm font-bold transition-all flex flex-col items-center gap-2 ${platform === 'zoom' ? 'border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' : 'border-gray-100 bg-gray-50 text-gray-600 dark:bg-gray-700 dark:border-gray-600'}`}
                    >
                        <Video size={20} />
                        <span>Zoom</span>
                    </button>
                    <button 
                        onClick={() => setPlatform('custom')}
                        className={`p-3 rounded-xl border-2 text-sm font-bold transition-all flex flex-col items-center gap-2 ${platform === 'custom' ? 'border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' : 'border-gray-100 bg-gray-50 text-gray-600 dark:bg-gray-700 dark:border-gray-600'}`}
                    >
                        <Link2 size={20} />
                        <span>رابط خارجي</span>
                    </button>
                </div>
            </div>

            {(platform === 'custom' || platform === 'zoom') && (
                 <div>
                    <label className="block text-sm font-bold text-gray-500 mb-2 dark:text-gray-400">الرابط</label>
                    <input 
                        type="text" 
                        value={customLink}
                        onChange={(e) => setCustomLink(e.target.value)}
                        placeholder="https://zoom.us/j/..."
                        className="w-full p-3 rounded-xl border border-gray-200 focus:border-blue-500 outline-none dark:bg-gray-700 dark:border-gray-600"
                    />
                 </div>
            )}

            {platform === 'jitsi' && (
                <div className="bg-blue-50 p-3 rounded-xl text-xs text-blue-800 border border-blue-100 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-300">
                    سيتم إنشاء غرفة اجتماعات مجانية فورية بدون تسجيل.
                </div>
            )}
            
            {platform === 'google' && (
                <div className="bg-green-50 p-3 rounded-xl text-xs text-green-800 border border-green-100 dark:bg-green-900/20 dark:border-green-800 dark:text-green-300">
                    سيتم فتح رابط إنشاء اجتماع جديد في Google Meet.
                </div>
            )}
        </div>

        <div className="flex gap-3">
            {generatedLink && platform !== 'google' && (
                <button 
                    onClick={handleCopy}
                    className="p-4 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 flex items-center justify-center dark:bg-gray-700 dark:text-gray-300"
                    title="نسخ الرابط"
                >
                    <Copy size={20} />
                </button>
            )}
            
            <button 
                onClick={handleLaunch}
                className="flex-1 p-4 rounded-xl font-bold text-white bg-red-600 hover:bg-red-700 shadow-lg shadow-red-200 flex items-center justify-center gap-2 dark:shadow-none"
            >
                {platform === 'google' ? 'إنشاء الاجتماع' : 'بدء الحصة الآن'}
            </button>
        </div>
      </div>
    </div>
  );
};

export default OnlineSessionModal;
