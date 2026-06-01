"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { CommunityNeed } from "@/types/communityNeed";

interface UrgencyChartProps {
  needs: CommunityNeed[];
}

export const UrgencyChart = ({ needs }: UrgencyChartProps) => {
  const data = [
    { name: "Low", range: "1-3", value: 0, color: "#10b981", gradId: "lowGrad" },
    { name: "Medium", range: "4-6", value: 0, color: "#f59e0b", gradId: "medGrad" },
    { name: "High", range: "7-10", value: 0, color: "#ef4444", gradId: "highGrad" },
  ];

  needs.forEach((need) => {
    if (need.urgencyScore >= 7) data[2].value++;
    else if (need.urgencyScore >= 4) data[1].value++;
    else data[0].value++;
  });

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white/90 dark:bg-slate-950/95 p-4 rounded-2xl shadow-2xl border border-gray-100 dark:border-neutral-800/80 backdrop-blur-xl">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{data.name} Urgency</p>
          <div className="flex items-center gap-2">
            <div className="w-3.5 h-3.5 rounded-full shadow-[0_0_10px_rgba(255,255,255,0.1)]" style={{ backgroundColor: data.color }}></div>
            <span className="text-xl font-black text-slate-900 dark:text-white">{data.value} Needs</span>
          </div>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold mt-1.5 uppercase tracking-tighter">AI Urgent Range: {data.range}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-[300px] w-full relative">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="lowGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity={1}/>
              <stop offset="100%" stopColor="#059669" stopOpacity={0.4}/>
            </linearGradient>
            <linearGradient id="medGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity={1}/>
              <stop offset="100%" stopColor="#d97706" stopOpacity={0.4}/>
            </linearGradient>
            <linearGradient id="highGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ef4444" stopOpacity={1}/>
              <stop offset="100%" stopColor="#dc2626" stopOpacity={0.4}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="currentColor" className="text-slate-200 dark:text-neutral-800" opacity={0.3} />
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: "#94a3b8", fontSize: 10, fontWeight: 800, letterSpacing: "0.05em" }}
            dy={10}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: "#94a3b8", fontSize: 10, fontWeight: 800 }}
          />
          <Tooltip 
            cursor={{ fill: "currentColor", className: "text-slate-100/50 dark:text-neutral-800/30", radius: 16 }}
            content={<CustomTooltip />}
          />
          <Bar dataKey="value" radius={[16, 16, 6, 6]} barSize={44} animationDuration={1000}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={`url(#${entry.gradId})`} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
