import React from 'react';
import StatCards from './StatCards';
import VolunteerDatabase from './VolunteerDatabase';
import EmergencyForm from './EmergencyForm';
import SmartMatchingPanel from './SmartMatchingPanel';
import AllocationBreakdown from './AllocationBreakdown';
import GeographicHeatmap from './GeographicHeatmap';
import Notifications from './Notifications';

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
