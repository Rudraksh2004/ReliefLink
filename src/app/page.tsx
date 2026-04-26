"use client";

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';

const Dashboard = dynamic(() => import('@/components/Dashboard'), { ssr: false });
const NeedsHub = dynamic(() => import('@/components/NeedsHub'), { ssr: false });
const VolunteersPage = dynamic(() => import('@/components/VolunteersPage'), { ssr: false });
const Analytics = dynamic(() => import('@/components/Analytics'), { ssr: false });
const DataSources = dynamic(() => import('@/components/DataSources'), { ssr: false });
const Settings = dynamic(() => import('@/components/Settings'), { ssr: false });

export default function Home() {
  const [activeNav, setActiveNav] = useState('dashboard');

  const renderContent = () => {
    switch (activeNav) {
      case 'dashboard': return <Dashboard />;
      case 'needs': return <NeedsHub />;
      case 'volunteers': return <VolunteersPage />;
      case 'analytics': return <Analytics />;
      case 'data': return <DataSources />;
      case 'settings': return <Settings />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen w-screen bg-gray-100 overflow-hidden font-sans">
      {/* Sidebar */}
      <Sidebar activeNav={activeNav} setActiveNav={setActiveNav} />

      {/* Main Area */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Top Bar */}
        <TopBar />

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-4 min-h-0">
          <div className="h-full">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
}
