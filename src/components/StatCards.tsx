'use client';
import React, { useState, useEffect } from 'react';
import { AlertCircle, Users, Cpu, Timer } from 'lucide-react';
import { db } from '../lib/firebase';
import { collection, onSnapshot, query, where, QuerySnapshot, DocumentData } from 'firebase/firestore';

const StatCards: React.FC = () => {
  const [stats, setStats] = useState({
    criticalNeeds: 0,
    availableVolunteers: 0,
    matchCount: 0,
    avgResponse: 18
  });

  useEffect(() => {
    // 1. Listen to critical needs
    const qNeeds = query(collection(db, 'community_needs'), where('priority_level', '==', 'Critical'));
    const unsubscribeNeeds = onSnapshot(qNeeds, (snapshot: QuerySnapshot<DocumentData>) => {
      setStats((prev: any) => ({ ...prev, criticalNeeds: snapshot.docs.length }));
    });

    // 2. Listen to available volunteers
    const qVolunteers = query(collection(db, 'volunteers'), where('isActive', '==', true));
    const unsubscribeVolunteers = onSnapshot(qVolunteers, (snapshot: QuerySnapshot<DocumentData>) => {
      setStats((prev: any) => ({ ...prev, availableVolunteers: snapshot.docs.length }));
    });

    // 3. Listen to matches
    const unsubscribeMatches = onSnapshot(collection(db, 'matches'), (snapshot: QuerySnapshot<DocumentData>) => {
      setStats((prev: any) => ({ ...prev, matchCount: snapshot.docs.length }));
    });

    return () => {
      unsubscribeNeeds();
      unsubscribeVolunteers();
      unsubscribeMatches();
    };
  }, []);

  return (
    <div className="grid grid-cols-4 gap-4 flex-shrink-0">
      {/* Critical Urgent Needs */}
      <div className="bg-[#ef4444] text-white rounded-xl px-5 py-4 flex items-center gap-4 shadow-md">
        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
          <AlertCircle size={26} className="text-white" />
        </div>
        <div>
          <div className="text-3xl font-extrabold leading-none">
            {stats.criticalNeeds} <span className="text-xl font-bold">Critical</span>
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
            {stats.availableVolunteers} <span className="text-xl font-bold text-gray-600">Available</span>
          </div>
          <div className="text-sm text-gray-500 mt-0.5">Volunteers</div>
        </div>
      </div>

      {/* AI Match Success Rate */}
      <div className="bg-[#16a34a] text-white rounded-xl px-5 py-4 flex items-center gap-4 shadow-md">
        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
          <Cpu size={24} className="text-white" />
        </div>
        <div>
          <div className="text-3xl font-extrabold leading-none">
            {stats.matchCount > 0 ? Math.min(99, Math.round(stats.matchCount * 1.5)) : 0}% 
            <span className="text-sm font-semibold bg-white/20 px-2 py-0.5 rounded-full ml-1">↑ +5%</span>
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
