'use client';
import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { MoreHorizontal } from 'lucide-react';

const weekData = [
  { day: 'Mon', value: 4 },
  { day: 'Tue', value: 7 },
  { day: 'Wed', value: 5 },
  { day: 'Thu', value: 9 },
  { day: 'Fri', value: 6 },
  { day: 'Sat', value: 11 },
  { day: 'Sun', value: 8 },
];

const barColors = ['#93c5fd', '#93c5fd', '#93c5fd', '#93c5fd', '#93c5fd', '#f87171', '#fbbf24'];

const DonutChart: React.FC = () => {
  const size = 90;
  const cx = size / 2;
  const cy = size / 2;
  const r = 32;
  const strokeWidth = 14;

  const segments = [
    { pct: 40, color: '#ef4444' },   // Medical - red
    { pct: 30, color: '#f59e0b' },   // Evacuation - amber
    { pct: 30, color: '#3b82f6' },   // Food - blue
  ];

  const circumference = 2 * Math.PI * r;
  let offset = 0;

  const paths = segments.map((seg, i) => {
    const dash = (seg.pct / 100) * circumference;
    const gap = circumference - dash;
    const el = (
      <circle
        key={i}
        cx={cx}
        cy={cy}
        r={r}
        fill="none"
        stroke={seg.color}
        strokeWidth={strokeWidth}
        strokeDasharray={`${dash} ${gap}`}
        strokeDashoffset={-offset}
        transform={`rotate(-90 ${cx} ${cy})`}
        strokeLinecap="butt"
      />
    );
    offset += dash;
    return el;
  });

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size}>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#f3f4f6" strokeWidth={strokeWidth} />
        {paths}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-lg font-extrabold text-gray-800 leading-none">32</span>
        <span className="text-[9px] text-gray-500 font-medium">Matched</span>
      </div>
    </div>
  );
};

const AllocationBreakdown: React.FC = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 px-4 py-4 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold text-gray-800">Allocation Breakdown</h2>
        <button className="text-gray-400 hover:text-gray-600">
          <MoreHorizontal size={18} />
        </button>
      </div>

      {/* Donut + Legend */}
      <div className="flex items-center gap-4">
        <DonutChart />
        <div className="flex flex-col gap-1.5 flex-1">
          {[
            { label: 'Medical', pct: '40%', color: '#ef4444' },
            { label: 'Evacuation', pct: '30%', color: '#f59e0b' },
            { label: 'Food', pct: '30%', color: '#3b82f6' },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: item.color }} />
                <span className="text-xs text-gray-600 font-medium">{item.label}</span>
              </div>
              <span className="text-xs font-bold text-gray-700">{item.pct}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Weekly Bar Chart */}
      <div className="h-20">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={weekData} barSize={10} margin={{ top: 0, right: 0, left: -30, bottom: 0 }}>
            <XAxis dataKey="day" tick={{ fontSize: 9, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 9, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ fontSize: 10, padding: '4px 8px', borderRadius: 6 }}
              cursor={{ fill: '#f3f4f6' }}
            />
            <Bar dataKey="value" radius={[3, 3, 0, 0]}>
              {weekData.map((_, i) => (
                <Cell key={i} fill={barColors[i]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Stats Row */}
      <div className="flex flex-col gap-1 pt-1 border-t border-gray-100">
        {[
          { icon: '👥', label: 'Active Missions', value: 14 },
          { icon: '👤', label: 'Assigned Volunteers', value: 32 },
          { icon: '📋', label: 'Total Requests', value: 145 },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-2 text-xs text-gray-600">
            <span>{item.icon}</span>
            <span className="font-bold text-gray-800">{item.value}</span>
            <span>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllocationBreakdown;
