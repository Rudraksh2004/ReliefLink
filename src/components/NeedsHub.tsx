import React, { useState, useEffect } from 'react';
import { AlertCircle, Clock, CheckCircle, Plus } from 'lucide-react';
import { db } from '../lib/firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';

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
  const [needs, setNeeds] = useState<any[]>([]);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    const q = query(collection(db, 'community_needs'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setNeeds(docs);
    });
    return () => unsubscribe();
  }, []);

  const filtered = filter === 'All' ? needs : needs.filter((n) => 
    n.priority_level === filter || n.status?.toLowerCase() === filter.toLowerCase()
  );

  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Needs Hub</h2>
          <p className="text-sm text-gray-500">Real-time community needs aggregation & prioritization</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 flex-wrap">
        {['All', 'Critical', 'High', 'Pending', 'Resolved'].map((f) => (
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
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${priorityColors[need.priority_level] || priorityColors['Medium']}`}>
                      {need.priority_level}
                    </span>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">{need.category}</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">📍 {need.location_name || 'Unknown'} • {need.createdAt?.toDate().toLocaleTimeString() || 'Just now'}</div>
                </div>
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-500 flex-shrink-0">
                {statusIcons[need.status] || statusIcons['Pending']}
                <span className="font-medium">{need.status}</span>
              </div>
            </div>
            <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-100 text-xs text-gray-500">
              <span>👤 <b>{need.peopleAffected}</b> people impacted</span>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span>Urgency Score</span>
                  <span className="font-semibold">{need.urgency_score || 0}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1.5">
                  <div
                    className={`h-1.5 rounded-full ${need.urgency_score > 80 ? 'bg-red-500' : need.urgency_score > 60 ? 'bg-orange-500' : 'bg-yellow-400'}`}
                    style={{ width: `${need.urgency_score || 0}%` }}
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
