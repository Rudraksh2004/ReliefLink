"use client";

import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { CommunityNeed } from "@/types/communityNeed";

interface CategoryDistributionChartProps {
  needs: CommunityNeed[];
}

const COLORS = [
  "#3b82f6", // Blue
  "#10b981", // Emerald
  "#f59e0b", // Amber
  "#ef4444", // Red
  "#8b5cf6", // Purple
  "#ec4899", // Pink
  "#06b6d4", // Cyan
];

export const CategoryDistributionChart = ({ needs }: CategoryDistributionChartProps) => {
  const categoryCounts: Record<string, number> = {};
  let totalCount = 0;
  
  needs.forEach((need) => {
    categoryCounts[need.category] = (categoryCounts[need.category] || 0) + 1;
    totalCount++;
  });

  const data = Object.keys(categoryCounts).map((key) => ({
    name: key.charAt(0).toUpperCase() + key.slice(1),
    value: categoryCounts[key],
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/90 dark:bg-slate-950/95 p-4 rounded-2xl shadow-2xl border border-gray-100 dark:border-neutral-800/80 backdrop-blur-xl">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{payload[0].name}</p>
          <div className="flex items-center gap-2">
            <div className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: payload[0].payload.fill }}></div>
            <span className="text-xl font-black text-slate-900 dark:text-white">{payload[0].value} Needs</span>
          </div>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold mt-1 tracking-tighter">
            {((payload[0].value / (totalCount || 1)) * 100).toFixed(0)}% of total operations
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-[300px] w-full relative flex items-center justify-center">
      {/* Center Label for Donut Chart */}
      <div className="absolute flex flex-col items-center justify-center text-center pointer-events-none mb-12">
        <span className="text-3xl font-black text-slate-900 dark:text-white leading-none">
          {totalCount}
        </span>
        <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1">
          Active Needs
        </span>
      </div>

      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={72}
            outerRadius={95}
            paddingAngle={6}
            dataKey="value"
            stroke="none"
            animationDuration={800}
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={COLORS[index % COLORS.length]} 
                style={{ filter: "drop-shadow(0px 2px 4px rgba(0,0,0,0.05))" }}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            verticalAlign="bottom" 
            align="center"
            iconType="circle"
            iconSize={8}
            wrapperStyle={{ paddingTop: 10 }}
            formatter={(value) => <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider pl-1">{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
