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

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
          />
          <Legend iconType="circle" />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
