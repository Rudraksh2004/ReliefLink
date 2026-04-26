'use client';
import React, { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, onSnapshot, query, where, QuerySnapshot, DocumentData } from 'firebase/firestore';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, AreaChart, Area
} from 'recharts';

const Analytics: React.FC = () => {
  const [stats, setStats] = useState({
    totalRequests: 0,
    resolved: 0,
    volunteers: 0,
    highPriority: 0,
    assignments: 0
  });

  const [categoryData, setCategoryData] = useState<any[]>([]);

  useEffect(() => {
    // 1. Listen to community_needs
    const unsubscribeNeeds = onSnapshot(collection(db, 'community_needs'), (snapshot: QuerySnapshot<DocumentData>) => {
      const docs = snapshot.docs.map(doc => doc.data());
      const total = docs.length;
      const resolved = docs.filter(d => d.status === 'completed' || d.status === 'resolved').length;
      const high = docs.filter(d => d.priority_level === 'High' || d.priority_level === 'Critical').length;
      
      // Aggregate categories for the bar chart
      const categories: any = {};
      docs.forEach(d => {
        const cat = d.category || 'Other';
        categories[cat] = (categories[cat] || 0) + 1;
      });
      const catArray = Object.keys(categories).map(name => ({ name, value: categories[name] }));
      
      setStats((prev: any) => ({ ...prev, totalRequests: total, resolved, highPriority: high }));
      setCategoryData(catArray);
    });

    const unsubscribeVolunteers = onSnapshot(collection(db, 'volunteers'), (snapshot: QuerySnapshot<DocumentData>) => {
      setStats((prev: any) => ({ ...prev, volunteers: snapshot.docs.length }));
    });

    const unsubscribeMatches = onSnapshot(collection(db, 'matches'), (snapshot: QuerySnapshot<DocumentData>) => {
      setStats((prev: any) => ({ ...prev, assignments: snapshot.docs.length }));
    });

    return () => {
      unsubscribeNeeds();
      unsubscribeVolunteers();
      unsubscribeMatches();
    };
  }, []);

  return (
    <div className="flex flex-col gap-4 h-full overflow-y-auto">
      <div>
        <h2 className="text-xl font-bold text-gray-800">Analytics Dashboard</h2>
        <p className="text-sm text-gray-500">Real-time insights and performance metrics</p>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Total Needs', value: stats.totalRequests.toString(), color: 'text-blue-600' },
          { label: 'High Priority', value: stats.highPriority.toString(), color: 'text-red-600' },
          { label: 'Volunteers', value: stats.volunteers.toString(), color: 'text-green-600' },
          { label: 'Assignments', value: stats.assignments.toString(), color: 'text-purple-600' },
        ].map((kpi) => (
          <div key={kpi.label} className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
            <div className={`text-2xl font-extrabold ${kpi.color}`}>{kpi.value}</div>
            <div className="text-xs text-gray-500 mt-0.5">{kpi.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Needs by Category */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
          <h3 className="text-sm font-bold text-gray-700 mb-3">Needs by Category</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={categoryData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis type="number" hide />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} width={80} />
              <Tooltip />
              <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Distribution Pie */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
          <h3 className="text-sm font-bold text-gray-700 mb-3">Priority Distribution</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={[
                  { name: 'High/Critical', value: stats.highPriority, color: '#ef4444' },
                  { name: 'Others', value: stats.totalRequests - stats.highPriority, color: '#3b82f6' }
                ]}
                cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value"
              >
                <Cell fill="#ef4444" />
                <Cell fill="#3b82f6" />
              </Pie>
              <Legend verticalAlign="bottom" height={36}/>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
