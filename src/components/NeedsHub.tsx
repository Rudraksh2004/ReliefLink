import React, { useState } from 'react';
import { AlertCircle, Clock, CheckCircle, Plus } from 'lucide-react';

const needs = [
  { id: 1, title: 'Food Shortage – Dharavi', type: 'Food', priority: 'Critical', status: 'Active', reported: '10 min ago', location: 'Dharavi, Mumbai', volunteers: 3, impact: 120 },
  { id: 2, title: 'Medical Aid Required – Kurla', type: 'Medical', priority: 'High', status: 'Active', reported: '25 min ago', location: 'Kurla, Mumbai', volunteers: 2, impact: 45 },
  { id: 3, title: 'Shelter for Flood Victims', type: 'Shelter', priority: 'High', status: 'Pending', reported: '1 hr ago', location: 'Vasai, Maharashtra', volunteers: 0, impact: 200 },
  { id: 4, title: 'Emergency Evacuation – Zone 4', type: 'Evacuation', priority: 'Critical', status: 'Active', reported: '5 min ago', location: 'Zone 4, Mumbai', volunteers: 5, impact: 80 },
  { id: 5, title: 'Child Nutrition Support', type: 'Food', priority: 'Medium', status: 'Resolved', reported: '2 hr ago', location: 'Andheri, Mumbai', volunteers: 4, impact: 60 },
  { id: 6, title: 'Water Supply Disruption', type: 'Medical', priority: 'High', status: 'Pending', reported: '45 min ago', location: 'Borivali, Mumbai', volunteers: 1, impact: 300 },
];

const priorityColors: Record<string, string> = {
  Critical: 'bg-red-100 text-red-700 border-red-200',
  High: 'bg-orange-100 text-orange-700 border-orange-200',
  Medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  Low: 'bg-green-100 text-green-700 border-green-200',
};

const statusIcons: Record<string, React.ReactNode> = {
  Active: <span className="text-green-500"><CheckCircle size={14} /></span>,
  Pending: <span className="text-yellow-500"><Clock size={14} /></span>,
  Resolved: <span className="text-gray-400"><CheckCircle size={14} /></span>,
};

const NeedsHub: React.FC = () => {
  const [filter, setFilter] = useState('All');

  const filtered = filter === 'All' ? needs : needs.filter((n) => n.priority === filter || n.status === filter);

  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Needs Hub</h2>
          <p className="text-sm text-gray-500">Real-time community needs aggregation & prioritization</p>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors">
          <Plus size={16} />
          Add Need
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 flex-wrap">
        {['All', 'Critical', 'High', 'Active', 'Pending', 'Resolved'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
              filter === f ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Need Cards */}
      <div className="grid grid-cols-1 gap-3 overflow-y-auto flex-1">
        {filtered.map((need) => (
          <div key={need.id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 flex-1">
                <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center flex-shrink-0">
                  <AlertCircle size={20} className="text-red-500" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm font-bold text-gray-800">{need.title}</h3>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${priorityColors[need.priority]}`}>
                      {need.priority}
                    </span>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">{need.type}</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">📍 {need.location} • {need.reported}</div>
                </div>
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-500 flex-shrink-0">
                {statusIcons[need.status]}
                <span className="font-medium">{need.status}</span>
              </div>
            </div>
            <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-100 text-xs text-gray-500">
              <span>👥 <b>{need.volunteers}</b> volunteers</span>
              <span>👤 <b>{need.impact}</b> people impacted</span>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span>Urgency</span>
                  <span className="font-semibold">{need.priority === 'Critical' ? '95%' : need.priority === 'High' ? '75%' : need.priority === 'Medium' ? '50%' : '25%'}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1.5">
                  <div
                    className={`h-1.5 rounded-full ${need.priority === 'Critical' ? 'bg-red-500' : need.priority === 'High' ? 'bg-orange-500' : 'bg-yellow-400'}`}
                    style={{ width: need.priority === 'Critical' ? '95%' : need.priority === 'High' ? '75%' : '50%' }}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NeedsHub;
