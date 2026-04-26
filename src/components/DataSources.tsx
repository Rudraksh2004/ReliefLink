'use client';
import React, { useState } from 'react';
import { Database, CheckCircle, AlertCircle, RefreshCw, Upload, Plus } from 'lucide-react';

const sources = [
  { id: 1, name: 'Field Survey System', type: 'Survey', records: 1240, lastSync: '2 min ago', status: 'Active', coverage: 92 },
  { id: 2, name: 'Volunteer Reports', type: 'Reports', records: 843, lastSync: '5 min ago', status: 'Active', coverage: 88 },
  { id: 3, name: 'NGO Partner Feed', type: 'API', records: 562, lastSync: '1 hr ago', status: 'Syncing', coverage: 75 },
  { id: 4, name: 'Volunteer WhatsApp', type: 'Social', records: 2100, lastSync: '15 min ago', status: 'Active', coverage: 95 },
  { id: 5, name: 'Paper Forms (OCR)', type: 'OCR', records: 320, lastSync: '3 hr ago', status: 'Warning', coverage: 60 },
  { id: 6, name: 'Government DB', type: 'API', records: 4500, lastSync: '12 hr ago', status: 'Offline', coverage: 40 },
];

const statusConfig: Record<string, { color: string; icon: React.ReactNode }> = {
  Active: { color: 'text-green-600 bg-green-100', icon: <CheckCircle size={12} /> },
  Syncing: { color: 'text-blue-600 bg-blue-100', icon: <RefreshCw size={12} className="animate-spin" /> },
  Warning: { color: 'text-orange-600 bg-orange-100', icon: <AlertCircle size={12} /> },
  Offline: { color: 'text-gray-500 bg-gray-100', icon: <AlertCircle size={12} /> },
};

const DataSources: React.FC = () => {
  const [refreshing, setRefreshing] = useState<number | null>(null);

  const handleRefresh = (id: number) => {
    setRefreshing(id);
    setTimeout(() => setRefreshing(null), 1500);
  };

  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Data Sources</h2>
          <p className="text-sm text-gray-500">Manage and monitor all integrated data pipelines</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-200 transition-colors">
            <Upload size={14} /> Import
          </button>
          <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors">
            <Plus size={14} /> Add Source
          </button>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Total Records', value: '9,565', icon: '📊', color: 'bg-blue-50 border-blue-100' },
          { label: 'Active Sources', value: '4/6', icon: '🔗', color: 'bg-green-50 border-green-100' },
          { label: 'Offline Entries', value: '156', icon: '📡', color: 'bg-orange-50 border-orange-100' },
        ].map((s) => (
          <div key={s.label} className={`${s.color} border rounded-xl p-4`}>
            <div className="text-2xl mb-1">{s.icon}</div>
            <div className="text-xl font-extrabold text-gray-800">{s.value}</div>
            <div className="text-xs text-gray-500">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Sources Table */}
      <div className="flex-1 overflow-y-auto">
        <div className="flex flex-col gap-2">
          {sources.map((src) => {
            const sc = statusConfig[src.status];
            return (
              <div key={src.id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Database size={20} className="text-blue-500" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-gray-800">{src.name}</span>
                      <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded">{src.type}</span>
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">{src.records.toLocaleString()} records • Last sync: {src.lastSync}</div>
                    <div className="flex items-center gap-2 mt-1.5">
                      <div className="flex-1 bg-gray-100 rounded-full h-1.5">
                        <div
                          className="h-1.5 rounded-full bg-blue-500 transition-all"
                          style={{ width: `${src.coverage}%` }}
                        />
                      </div>
                      <span className="text-[10px] text-gray-500 font-medium">{src.coverage}%</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded ${sc.color}`}>
                      {sc.icon}
                      {src.status}
                    </span>
                    <button
                      onClick={() => handleRefresh(src.id)}
                      className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors"
                    >
                      <RefreshCw size={14} className={`text-gray-500 ${refreshing === src.id ? 'animate-spin' : ''}`} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DataSources;
