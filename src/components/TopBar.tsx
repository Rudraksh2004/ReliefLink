'use client';
import React from 'react';
import { Settings, Search, Bell } from 'lucide-react';

const TopBar: React.FC = () => {
  return (
    <div className="flex items-center justify-between px-6 py-3 bg-white border-b border-gray-200 flex-shrink-0">
      <h1 className="text-xl font-bold text-[#1a2340]">
        ReliefLink
      </h1>
      <div className="flex items-center gap-3">
        <div className="relative">
          <Bell size={20} className="text-gray-500 cursor-pointer hover:text-blue-600" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-[9px] flex items-center justify-center font-bold">3</span>
        </div>
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center overflow-hidden border-2 border-blue-200">
          <svg viewBox="0 0 36 36" className="w-8 h-8" fill="none">
            <circle cx="18" cy="13" r="7" fill="#bfdbfe"/>
            <ellipse cx="18" cy="30" rx="11" ry="8" fill="#bfdbfe"/>
          </svg>
        </div>
        <span className="text-sm font-semibold text-gray-700">Admin</span>
        <button className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
          <Settings size={16} className="text-gray-500" />
        </button>
        <button className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
          <Search size={16} className="text-gray-500" />
        </button>
      </div>
    </div>
  );
};

export default TopBar;
