'use client';
import React from 'react';
import { LayoutDashboard, Heart, Users, BarChart3, Database, Settings, Wifi } from 'lucide-react';

interface SidebarProps {
  activeNav: string;
  setActiveNav: (nav: string) => void;
}

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'needs', label: 'Needs Hub', icon: Heart },
  { id: 'volunteers', label: 'Volunteers', icon: Users },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'data', label: 'Data Sources', icon: Database },
  { id: 'settings', label: 'Settings', icon: Settings },
];

const Sidebar: React.FC<SidebarProps> = ({ activeNav, setActiveNav }) => {
  return (
    <div className="flex flex-col h-full bg-[#1a2340] text-white w-[200px] min-w-[200px]">
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-[#2a3558]">
        <div className="w-10 h-10 bg-[#2563eb] rounded-xl flex items-center justify-center flex-shrink-0">
          <svg viewBox="0 0 40 40" className="w-7 h-7" fill="none">
            <circle cx="14" cy="14" r="6" fill="#60a5fa" />
            <circle cx="26" cy="14" r="6" fill="#34d399" />
            <circle cx="20" cy="26" r="6" fill="#f472b6" />
            <line x1="14" y1="14" x2="26" y2="14" stroke="white" strokeWidth="1.5" />
            <line x1="14" y1="14" x2="20" y2="26" stroke="white" strokeWidth="1.5" />
            <line x1="26" y1="14" x2="20" y2="26" stroke="white" strokeWidth="1.5" />
          </svg>
        </div>
        <div className="leading-tight">
          <div className="text-sm font-bold text-white leading-none">ReliefLink</div>
        </div>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 py-4 px-2">
        {navItems.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveNav(id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 text-sm font-medium transition-all duration-150 ${
              activeNav === id
                ? 'bg-[#2563eb] text-white shadow-lg'
                : 'text-[#94a3b8] hover:bg-[#2a3558] hover:text-white'
            }`}
          >
            <Icon size={18} />
            <span>{label}</span>
          </button>
        ))}
      </nav>

      {/* Offline Sync */}
      <div className="px-4 py-4 border-t border-[#2a3558]">
        <div className="flex items-center gap-2 text-xs text-[#34d399]">
          <Wifi size={14} className="animate-pulse" />
          <span className="font-medium">Offline Sync Active</span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
