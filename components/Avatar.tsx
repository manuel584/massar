import React from 'react';
import { Trophy } from './Icons';

interface AvatarProps {
  level: number;
  size?: 'sm' | 'md' | 'lg';
  gender: 'male' | 'female';
}

const Avatar: React.FC<AvatarProps> = ({ level, size = 'md', gender }) => {
  const sizeClasses = {
    sm: 'w-10 h-10 text-xs',
    md: 'w-16 h-16 text-sm',
    lg: 'w-24 h-24 text-base'
  };

  const iconSize = size === 'sm' ? 16 : size === 'md' ? 24 : 32;
  
  // Simple visual distinction based on level
  const getBorderColor = (lvl: number) => {
    if (lvl >= 10) return 'border-purple-500 ring-purple-200';
    if (lvl >= 7) return 'border-yellow-500 ring-yellow-200';
    if (lvl >= 4) return 'border-blue-500 ring-blue-200';
    return 'border-gray-300 ring-gray-100';
  };

  return (
    <div className={`relative ${sizeClasses[size]} rounded-full border-4 ${getBorderColor(level)} ring-2 bg-white flex items-center justify-center overflow-hidden shadow-lg`}>
       <img 
        src={`https://picsum.photos/seed/${level}${gender}/200`} 
        alt="Avatar" 
        className="w-full h-full object-cover"
      />
      <div className="absolute bottom-0 right-0 bg-yellow-400 text-white rounded-full p-1 shadow-sm border border-white">
        <div className="font-bold text-[10px] flex items-center justify-center w-4 h-4">
            {level}
        </div>
      </div>
    </div>
  );
};

export default Avatar;