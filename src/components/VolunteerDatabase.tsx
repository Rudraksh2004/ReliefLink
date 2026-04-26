'use client';
import React, { useState, useEffect } from 'react';
import { Search, MoreHorizontal, MapPin } from 'lucide-react';
import { db } from '../lib/firebase';
import { collection, onSnapshot, query, where, QuerySnapshot, DocumentData } from 'firebase/firestore';

const VolunteerDatabase: React.FC = () => {
  const [search, setSearch] = useState('');
  const [volunteers, setVolunteers] = useState<any[]>([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'volunteers'), (snapshot: QuerySnapshot<DocumentData>) => {
      const docs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setVolunteers(docs);
    });
    return () => unsubscribe();
  }, []);

  const filtered = volunteers.filter(
    (v) =>
      (v.name || '').toLowerCase().includes(search.toLowerCase()) ||
      (v.skills || []).join(', ').toLowerCase().includes(search.toLowerCase())
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
            <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 ${v.isActive ? 'bg-blue-400' : 'bg-gray-400'}`}>
              {(v.name || 'V')[0]}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-800">{v.name}</span>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <span>{v.location_name || 'Mumbai'}</span>
                  <span className="text-gray-300">›</span>
                </div>
              </div>
              <div className="text-xs text-gray-500 truncate">{(v.skills || []).join(', ')}</div>
              <div className="flex items-center gap-2 mt-0.5">
                <div className="flex items-center gap-1 text-xs text-gray-400">
                  <MapPin size={10} />
                  <span>{v.distance || 'Nearby'}</span>
                </div>
                {v.isActive && (
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
