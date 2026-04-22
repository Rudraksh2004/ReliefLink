import React from 'react';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, AreaChart, Area
} from 'recharts';

const responseData = [
  { month: 'Jan', time: 32 }, { month: 'Feb', time: 28 }, { month: 'Mar', time: 25 },
  { month: 'Apr', time: 22 }, { month: 'May', time: 20 }, { month: 'Jun', time: 18 },
];

const requestsData = [
  { week: 'W1', medical: 12, food: 8, evacuation: 5 },
  { week: 'W2', medical: 19, food: 14, evacuation: 9 },
  { week: 'W3', medical: 15, food: 11, evacuation: 7 },
  { week: 'W4', medical: 24, food: 18, evacuation: 12 },
];

const pieData = [
  { name: 'Medical', value: 40, color: '#ef4444' },
  { name: 'Evacuation', value: 30, color: '#f59e0b' },
  { name: 'Food', value: 20, color: '#3b82f6' },
  { name: 'Shelter', value: 10, color: '#8b5cf6' },
];

const matchData = [
  { day: 'Mon', rate: 35 }, { day: 'Tue', rate: 38 }, { day: 'Wed', rate: 42 },
  { day: 'Thu', rate: 40 }, { day: 'Fri', rate: 45 }, { day: 'Sat', rate: 44 }, { day: 'Sun', rate: 47 },
];

const Analytics: React.FC = () => {
  return (
    <div className="flex flex-col gap-4 h-full overflow-y-auto">
      <div>
        <h2 className="text-xl font-bold text-gray-800">Analytics Dashboard</h2>
        <p className="text-sm text-gray-500">Real-time insights and performance metrics</p>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Total Requests', value: '145', change: '+12%', up: true, color: 'text-blue-600' },
          { label: 'Resolved', value: '98', change: '+8%', up: true, color: 'text-green-600' },
          { label: 'Avg Response', value: '18m', change: '-2m', up: true, color: 'text-orange-500' },
          { label: 'AI Match Rate', value: '42%', change: '+5%', up: true, color: 'text-purple-600' },
        ].map((kpi) => (
          <div key={kpi.label} className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
            <div className={`text-2xl font-extrabold ${kpi.color}`}>{kpi.value}</div>
            <div className="text-xs text-gray-500 mt-0.5">{kpi.label}</div>
            <div className="text-xs text-green-500 font-semibold mt-1">↑ {kpi.change}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Response Time Trend */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
          <h3 className="text-sm font-bold text-gray-700 mb-3">Response Time Trend (min)</h3>
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={responseData}>
              <defs>
                <linearGradient id="responseGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip />
              <Area type="monotone" dataKey="time" stroke="#3b82f6" fill="url(#responseGrad)" strokeWidth={2} dot={{ fill: '#3b82f6', r: 4 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Requests by Category */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
          <h3 className="text-sm font-bold text-gray-700 mb-3">Weekly Requests by Category</h3>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={requestsData} barSize={14}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="week" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip />
              <Bar dataKey="medical" fill="#ef4444" radius={[3,3,0,0]} />
              <Bar dataKey="food" fill="#3b82f6" radius={[3,3,0,0]} />
              <Bar dataKey="evacuation" fill="#f59e0b" radius={[3,3,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Allocation Pie */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
          <h3 className="text-sm font-bold text-gray-700 mb-3">Need Distribution</h3>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value" paddingAngle={2}>
                {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Legend iconType="circle" iconSize={10} wrapperStyle={{ fontSize: 11 }} />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* AI Match Rate */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
          <h3 className="text-sm font-bold text-gray-700 mb-3">AI Match Rate (Daily %)</h3>
          <ResponsiveContainer width="100%" height={160}>
            <LineChart data={matchData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="day" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} domain={[30, 50]} />
              <Tooltip />
              <Line type="monotone" dataKey="rate" stroke="#16a34a" strokeWidth={2.5} dot={{ fill: '#16a34a', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
