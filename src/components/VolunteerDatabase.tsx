import React, { useState } from 'react';
import { Search, MoreHorizontal, MapPin } from 'lucide-react';

const volunteers = [
  {
    id: 1,
    name: 'Jaya',
    skills: 'First Aid, Cooking',
    location: 'Mumbai',
    distance: '6.7 km',
    available: true,
    avatar: 'J',
    color: 'bg-purple-400',
  },
  {
    id: 2,
    name: 'Rohit',
    skills: 'Driver',
    location: 'Mumbai',
    distance: '1.4 km',
    available: true,
    avatar: 'R',
    color: 'bg-blue-400',
  },
  {
    id: 3,
    name: 'Sita',
    skills: 'Medical, Training',
    location: 'Mumbai',
    distance: '4.7 km',
    available: true,
    avatar: 'S',
    color: 'bg-pink-400',
  },
  {
    id: 4,
    name: 'Amit',
    skills: 'Driver',
    location: 'Mumbai',
    distance: '1.5 km',
    available: true,
    avatar: 'A',
    color: 'bg-green-400',
  },
];

const VolunteerDatabase: React.FC = () => {
  const [search, setSearch] = useState('');

  const filtered = volunteers.filter(
    (v) =>
      v.name.toLowerCase().includes(search.toLowerCase()) ||
      v.skills.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col h-full">
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <h2 className="text-base font-bold text-gray-800">Volunteer Database</h2>
        <button className="text-gray-400 hover:text-gray-600">
          <MoreHorizontal size={18} />
        </button>
      </div>

      {/* Search */}
      <div className="px-4 pb-2">
        <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
          <Search size={14} className="text-gray-400" />
          <input
            type="text"
            placeholder="Search Volunteers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none flex-1"
          />
        </div>
      </div>

      {/* Volunteer List */}
      <div className="flex-1 overflow-y-auto px-2 pb-2">
        {filtered.map((v) => (
          <div
            key={v.id}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer group border-b border-gray-50 last:border-0"
          >
            {/* Avatar */}
            <div className={`w-9 h-9 ${v.color} rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
              {v.avatar}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-800">{v.name}</span>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <span>{v.location}</span>
                  <span className="text-gray-300">›</span>
                </div>
              </div>
              <div className="text-xs text-gray-500 truncate">{v.skills}</div>
              <div className="flex items-center gap-2 mt-0.5">
                <div className="flex items-center gap-1 text-xs text-gray-400">
                  <MapPin size={10} />
                  <span>{v.distance}</span>
                </div>
                {v.available && (
                  <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded font-semibold">
                    Available
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VolunteerDatabase;
