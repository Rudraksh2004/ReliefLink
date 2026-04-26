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

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#6b7280"];

export const CategoryDistributionChart = ({ needs }: CategoryDistributionChartProps) => {
  const categoryCounts: Record<string, number> = {};
  
  needs.forEach((need) => {
    categoryCounts[need.category] = (categoryCounts[need.category] || 0) + 1;
  });

  const data = Object.keys(categoryCounts).map((key) => ({
    name: key.charAt(0).toUpperCase() + key.slice(1),
    value: categoryCounts[key],
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-neutral-900 p-4 rounded-2xl shadow-xl border border-gray-100 dark:border-neutral-800 backdrop-blur-md">
          <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-1">{payload[0].name}</p>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: payload[0].payload.fill }}></div>
            <span className="text-lg font-black">{payload[0].value} Tasks</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={70}
            outerRadius={100}
            paddingAngle={8}
            dataKey="value"
            stroke="none"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            verticalAlign="bottom" 
            align="center"
            iconType="circle"
            formatter={(value) => <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
