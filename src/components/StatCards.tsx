import React from 'react';
import { AlertCircle, Users, Cpu, Timer } from 'lucide-react';

const StatCards: React.FC = () => {
  return (
    <div className="grid grid-cols-4 gap-4 flex-shrink-0">
      {/* Critical Urgent Needs */}
      <div className="bg-[#ef4444] text-white rounded-xl px-5 py-4 flex items-center gap-4 shadow-md">
        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
          <AlertCircle size={26} className="text-white" />
        </div>
        <div>
          <div className="text-3xl font-extrabold leading-none">
            8 <span className="text-xl font-bold">Critical</span>
          </div>
          <div className="text-sm font-medium text-red-100 mt-0.5">Urgent Needs</div>
        </div>
      </div>

      {/* Available Volunteers */}
      <div className="bg-white border border-gray-200 rounded-xl px-5 py-4 flex items-center gap-4 shadow-sm">
        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
          <Users size={24} className="text-blue-600" />
        </div>
        <div className="flex-1">
          <div className="text-3xl font-extrabold text-gray-800 leading-none">
            46 <span className="text-xl font-bold text-gray-600">Available</span>
          </div>
          <div className="text-sm text-gray-500 mt-0.5">Volunteers</div>
        </div>
        <span className="text-blue-500 text-lg font-bold">›</span>
      </div>

      {/* AI Match Success Rate */}
      <div className="bg-[#16a34a] text-white rounded-xl px-5 py-4 flex items-center gap-4 shadow-md">
        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
          <Cpu size={24} className="text-white" />
        </div>
        <div>
          <div className="text-3xl font-extrabold leading-none">
            42% <span className="text-sm font-semibold bg-white/20 px-2 py-0.5 rounded-full ml-1">↑ +5%</span>
          </div>
          <div className="text-sm font-medium text-green-100 mt-0.5">AI Match Success Rate</div>
        </div>
      </div>

      {/* Response Time */}
      <div className="bg-white border border-gray-200 rounded-xl px-5 py-4 flex items-center gap-4 shadow-sm">
        <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
          <Timer size={24} className="text-orange-500" />
        </div>
        <div className="flex-1">
          <div className="flex items-baseline gap-2">
            <span className="text-sm text-gray-500 font-medium">Avg</span>
            <span className="text-3xl font-extrabold text-gray-800 leading-none">18 <span className="text-base font-semibold text-gray-600">min</span></span>
          </div>
          <div className="text-sm text-gray-500 mt-0.5">Response Time</div>
        </div>
        <span className="text-orange-500 font-bold text-sm whitespace-nowrap">– 2 min</span>
      </div>
    </div>
  );
};

export default StatCards;
