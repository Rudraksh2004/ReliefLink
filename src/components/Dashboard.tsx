'use client';
import React from 'react';
import dynamic from 'next/dynamic';
import StatCards from './StatCards';
import VolunteerDatabase from './VolunteerDatabase';
import EmergencyForm from './EmergencyForm';
import SmartMatchingPanel from './SmartMatchingPanel';
import AllocationBreakdown from './AllocationBreakdown';
import Notifications from './Notifications';

const GeographicHeatmap = dynamic(() => import('./GeographicHeatmap'), { 
  ssr: false,
  loading: () => <div className="h-[300px] w-full bg-gray-100 animate-pulse rounded-xl flex items-center justify-center text-gray-400">Loading Map...</div>
});

const Dashboard: React.FC = () => {
  return (
    <div className="flex flex-col gap-3 h-full min-h-0">
      {/* Stat Cards Row */}
      <StatCards />

      {/* Main Content Grid - 3 columns */}
      <div
        className="grid gap-3 flex-1 min-h-0"
        style={{ gridTemplateColumns: '1fr 1fr 1.15fr' }}
      >
        {/* LEFT COLUMN */}
        <div className="flex flex-col gap-3 min-h-0 overflow-y-auto">
          <VolunteerDatabase />
          <EmergencyForm />
        </div>

        {/* MIDDLE COLUMN */}
        <div className="flex flex-col gap-3 min-h-0 overflow-y-auto">
          <SmartMatchingPanel />
          <AllocationBreakdown />
        </div>

        {/* RIGHT COLUMN */}
        <div className="flex flex-col gap-3 min-h-0 overflow-y-auto">
          <GeographicHeatmap />
          <Notifications />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
