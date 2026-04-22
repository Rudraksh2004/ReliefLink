import React, { useState } from 'react';

const matches = [
  {
    id: 1,
    name: 'Rahul',
    location: 'Mumbai, 1.2 km',
    reason: 'Matched for specific availability',
    avatar: 'Ra',
    color: 'bg-blue-400',
    assigned: false,
  },
  {
    id: 2,
    name: 'Jaya',
    location: 'Mumbai, 6.7 km',
    reason: 'Matched for Cooking skills',
    avatar: 'J',
    color: 'bg-purple-400',
    assigned: false,
  },
  {
    id: 3,
    name: 'Amit',
    location: 'Mumbai, 1.5 km',
    reason: 'Matched for Driver skills (delivery)',
    avatar: 'A',
    color: 'bg-green-400',
    assigned: false,
  },
];

const SmartMatchingPanel: React.FC = () => {
  const [assigned, setAssigned] = useState<number[]>([]);

  const handleAssign = (id: number) => {
    setAssigned((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 px-4 py-4">
      <h2 className="text-base font-bold text-gray-800 mb-1">Smart Matching Panel</h2>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-sm text-gray-600 font-medium">Critical Food Shortage</span>
        <span className="text-xs font-bold text-orange-500">(High Priority)</span>
      </div>

      <div className="flex flex-col gap-2">
        {matches.map((m) => {
          const isAssigned = assigned.includes(m.id);
          return (
            <div
              key={m.id}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 border transition-all ${
                isAssigned
                  ? 'border-green-300 bg-green-50'
                  : 'border-gray-100 bg-gray-50 hover:border-blue-200'
              }`}
            >
              {/* Blue accent line */}
              <div className={`w-1 h-full min-h-[40px] rounded-full ${isAssigned ? 'bg-green-400' : 'bg-blue-400'}`} />

              {/* Avatar */}
              <div className={`w-9 h-9 ${m.color} rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                {m.avatar}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-gray-800">{m.name}</div>
                <div className="text-xs text-gray-500">{m.location}</div>
                <div className="text-xs text-gray-400 truncate">{m.reason}</div>
              </div>

              {/* Assign Button */}
              <button
                onClick={() => handleAssign(m.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  isAssigned
                    ? 'bg-green-500 text-white'
                    : 'bg-[#16a34a] text-white hover:bg-[#15803d]'
                }`}
              >
                {isAssigned ? 'Assigned ✓' : 'Assign'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SmartMatchingPanel;
