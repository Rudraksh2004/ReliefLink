import React, { useState } from 'react';
import { Plus, Minus, Layers } from 'lucide-react';

const pins = [
  {
    id: 1,
    label: 'Medical Help',
    priority: 'High',
    color: '#ef4444',
    x: '72%',
    y: '22%',
    icon: '🏥',
  },
  {
    id: 2,
    label: 'Rahul',
    sub: 'First Aid  6km to',
    x: '60%',
    y: '38%',
    icon: '🩺',
    color: '#3b82f6',
    isCard: true,
  },
  {
    id: 3,
    label: 'Sita',
    sub: 'Driver  1.5 km',
    x: '66%',
    y: '58%',
    icon: '🚗',
    color: '#8b5cf6',
    isCard: true,
  },
  {
    id: 4,
    label: 'Rahul',
    sub: 'Evacuation  0.5 km',
    x: '38%',
    y: '62%',
    icon: '🚨',
    color: '#f59e0b',
    isCard: true,
  },
];

const heatZones = [
  { cx: '68%', cy: '28%', rx: '18%', ry: '16%', color: '#ef4444', opacity: 0.35 },
  { cx: '54%', cy: '42%', rx: '16%', ry: '14%', color: '#f97316', opacity: 0.28 },
  { cx: '40%', cy: '55%', rx: '14%', ry: '12%', color: '#eab308', opacity: 0.22 },
  { cx: '75%', cy: '55%', rx: '10%', ry: '9%', color: '#3b82f6', opacity: 0.2 },
  { cx: '30%', cy: '38%', rx: '12%', ry: '10%', color: '#22c55e', opacity: 0.18 },
];

const GeographicHeatmap: React.FC = () => {
  const [zoom, setZoom] = useState(1);
  const [filter, setFilter] = useState('Menu');

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col overflow-hidden h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-3 pb-2 flex-shrink-0">
        <h2 className="text-base font-bold text-gray-800">Geographic Need Heatmap</h2>
        <button
          className="flex items-center gap-1.5 bg-gray-100 border border-gray-200 rounded-lg px-3 py-1.5 text-xs font-semibold text-gray-600 hover:bg-gray-200 transition-colors"
          onClick={() => setFilter(filter === 'Menu' ? 'All' : 'Menu')}
        >
          <Layers size={12} />
          <span>{filter}</span>
          <span className="text-gray-400">▾</span>
        </button>
      </div>

      {/* Map Area */}
      <div className="flex-1 relative overflow-hidden bg-[#e8f4f8] min-h-0" style={{ minHeight: 260 }}>
        {/* Map Background - Mumbai style */}
        <svg
          viewBox="0 0 400 280"
          className="absolute inset-0 w-full h-full"
          preserveAspectRatio="xMidYMid slice"
        >
          {/* Water body */}
          <rect width="400" height="280" fill="#c8e6f0" />

          {/* Land masses */}
          <polygon points="0,280 80,180 120,200 180,140 220,160 260,100 300,120 340,80 400,100 400,280" fill="#d4e8c2" />
          <polygon points="0,280 0,180 60,200 100,240 140,220 160,280" fill="#c8e0b0" />
          <ellipse cx="200" cy="200" rx="80" ry="50" fill="#d0e8b8" />

          {/* Roads */}
          <line x1="50" y1="280" x2="350" y2="60" stroke="#b0c4b0" strokeWidth="1.5" strokeDasharray="4,2" opacity="0.6" />
          <line x1="0" y1="160" x2="400" y2="180" stroke="#b0c4b0" strokeWidth="1.5" strokeDasharray="4,2" opacity="0.6" />
          <line x1="200" y1="0" x2="180" y2="280" stroke="#b0c4b0" strokeWidth="1.2" strokeDasharray="4,2" opacity="0.5" />
          <line x1="100" y1="0" x2="80" y2="280" stroke="#b0c4b0" strokeWidth="1" strokeDasharray="3,2" opacity="0.4" />
          <line x1="300" y1="0" x2="320" y2="280" stroke="#b0c4b0" strokeWidth="1" strokeDasharray="3,2" opacity="0.4" />

          {/* City blocks */}
          <rect x="120" y="100" width="30" height="20" rx="2" fill="#c5d9b0" opacity="0.7" />
          <rect x="160" y="120" width="25" height="15" rx="2" fill="#c5d9b0" opacity="0.7" />
          <rect x="90" y="140" width="20" height="18" rx="2" fill="#c5d9b0" opacity="0.7" />
          <rect x="220" y="130" width="35" height="22" rx="2" fill="#c5d9b0" opacity="0.7" />
          <rect x="270" y="90" width="28" height="18" rx="2" fill="#c5d9b0" opacity="0.7" />

          {/* Heat Zones */}
          {heatZones.map((zone, i) => (
            <ellipse
              key={i}
              cx={zone.cx}
              cy={zone.cy}
              rx={zone.rx}
              ry={zone.ry}
              fill={zone.color}
              opacity={zone.opacity * zoom}
              style={{ filter: 'blur(2px)' }}
            />
          ))}

          {/* Mumbai Label */}
          <text x="165" y="215" fontSize="14" fontWeight="bold" fill="#4a6741" opacity="0.8">MUMBAI</text>

          {/* mapbox attribution */}
          <text x="8" y="272" fontSize="7" fill="#888">© mapbox</text>
        </svg>

        {/* Pins / Cards */}
        {pins.map((pin) => (
          <div
            key={pin.id}
            className="absolute"
            style={{ left: pin.x, top: pin.y, transform: 'translate(-50%, -50%)' }}
          >
            {pin.isCard ? (
              <div className="flex items-center gap-1.5 bg-white rounded-lg shadow-md px-2.5 py-1.5 border border-gray-200 text-xs font-semibold text-gray-800 whitespace-nowrap cursor-pointer hover:shadow-lg transition-shadow">
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0"
                  style={{ background: pin.color }}
                >
                  {pin.label[0]}
                </div>
                <div>
                  <div className="font-bold text-gray-800 text-[11px]">{pin.label}</div>
                  {pin.sub && <div className="text-gray-400 text-[10px]">{pin.sub}</div>}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-1 bg-white rounded-lg shadow-md px-2 py-1 border border-gray-200">
                <div className="w-4 h-4 rounded-full flex items-center justify-center text-white text-[8px]" style={{ background: pin.color }}>
                  ●
                </div>
                <span className="text-[10px] font-bold text-gray-800">{pin.label}</span>
                {pin.priority && (
                  <span className="text-[9px] font-bold" style={{ color: pin.color }}>
                    ({pin.priority})
                  </span>
                )}
              </div>
            )}
          </div>
        ))}

        {/* Zoom Controls */}
        <div className="absolute right-3 bottom-10 flex flex-col gap-1">
          <button
            onClick={() => setZoom((z) => Math.min(z + 0.1, 1.5))}
            className="w-7 h-7 bg-white border border-gray-300 rounded-md flex items-center justify-center shadow hover:bg-gray-50 text-gray-700 font-bold text-lg"
          >
            <Plus size={14} />
          </button>
          <button
            onClick={() => setZoom((z) => Math.max(z - 0.1, 0.5))}
            className="w-7 h-7 bg-white border border-gray-300 rounded-md flex items-center justify-center shadow hover:bg-gray-50 text-gray-700 font-bold text-lg"
          >
            <Minus size={14} />
          </button>
        </div>

        {/* Mapbox badge */}
        <div className="absolute right-3 bottom-2 bg-white/80 rounded px-1.5 py-0.5 flex items-center gap-1">
          <span className="text-[9px] font-bold text-gray-500">⬛ Mapbox</span>
          <span className="text-[9px] text-gray-400">⚙</span>
        </div>
      </div>
    </div>
  );
};

export default GeographicHeatmap;
