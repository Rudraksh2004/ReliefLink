'use client';
import React, { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, onSnapshot, query, orderBy, limit, doc, updateDoc, QuerySnapshot, DocumentData } from 'firebase/firestore';

const SmartMatchingPanel: React.FC = () => {
  const [matches, setMatches] = useState<any[]>([]);

  useEffect(() => {
    const q = query(collection(db, 'matches'), orderBy('timestamp', 'desc'), limit(5));
    const unsubscribe = onSnapshot(q, (snapshot: QuerySnapshot<DocumentData>) => {
      const docs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMatches(docs);
    });
    return () => unsubscribe();
  }, []);

  const handleAssign = async (matchId: string) => {
    try {
      const matchRef = doc(db, 'matches', matchId);
      await updateDoc(matchRef, {
        status: 'assigned',
        assignedAt: new Date()
      });
    } catch (error) {
      console.error("Error assigning:", error);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 px-4 py-4">
      <h2 className="text-base font-bold text-gray-800 mb-1">Smart Matching Panel</h2>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-sm text-gray-600 font-medium">Recent AI Recommendations</span>
        <span className="text-xs font-bold text-blue-500">(Real-time)</span>
      </div>

      <div className="flex flex-col gap-2">
        {matches.map((m) => {
          const isAssigned = m.status === 'assigned';
          return (
            <div
              key={m.id}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 border transition-all ${
                isAssigned
                  ? 'border-green-300 bg-green-50'
                  : 'border-gray-100 bg-gray-50 hover:border-blue-200'
              }`}
            >
              {/* Status accent line */}
              <div className={`w-1 h-full min-h-[40px] rounded-full ${isAssigned ? 'bg-green-400' : 'bg-blue-400'}`} />

              {/* Avatar Fallback */}
              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 ${isAssigned ? 'bg-green-400' : 'bg-blue-400'}`}>
                {m.volunteerId ? m.volunteerId[0].toUpperCase() : 'V'}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-gray-800">ID: {m.volunteerId?.substring(0, 8)}</div>
                <div className="text-xs text-gray-500">Score: {Math.round(m.score * 100)}%</div>
                <div className="text-xs text-gray-400 truncate">{m.explanation || 'Matched for expertise'}</div>
              </div>

              {/* Assign Button */}
              <button
                onClick={() => !isAssigned && handleAssign(m.id)}
                disabled={isAssigned}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  isAssigned
                    ? 'bg-green-500 text-white cursor-default'
                    : 'bg-[#16a34a] text-white hover:bg-[#15803d]'
                }`}
              >
                {isAssigned ? 'Assigned ✓' : 'Assign'}
              </button>
            </div>
          );
        })}
        {matches.length === 0 && (
          <div className="text-center py-4 text-xs text-gray-400 italic">
            Waiting for AI recommendations...
          </div>
        )}
      </div>
    </div>
  );
};

export default SmartMatchingPanel;
