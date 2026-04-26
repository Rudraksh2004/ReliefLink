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
    { name: "Low", range: "1-3", value: 0, color: "#10b981", bg: "rgba(16, 185, 129, 0.1)" },
    { name: "Medium", range: "4-6", value: 0, color: "#f59e0b", bg: "rgba(245, 158, 11, 0.1)" },
    { name: "High", range: "7-10", value: 0, color: "#ef4444", bg: "rgba(239, 68, 68, 0.1)" },
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
        <div className="bg-white dark:bg-neutral-900 p-4 rounded-2xl shadow-xl border border-gray-100 dark:border-neutral-800 backdrop-blur-md">
          <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-1">{data.name} Urgency</p>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: data.color }}></div>
            <span className="text-lg font-black">{data.value} Needs</span>
          </div>
          <p className="text-[10px] text-gray-500 font-bold mt-1">SCORE RANGE: {data.range}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" opacity={0.5} />
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: "#9ca3af", fontSize: 10, fontWeight: 700 }}
            dy={10}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: "#9ca3af", fontSize: 10, fontWeight: 700 }}
          />
          <Tooltip 
            cursor={{ fill: "rgba(0,0,0,0.02)", radius: 12 }}
            content={<CustomTooltip />}
          />
          <Bar dataKey="value" radius={[12, 12, 4, 4]} barSize={40}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} fillOpacity={0.8} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
