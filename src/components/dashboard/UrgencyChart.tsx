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
    { name: "Low (1-3)", value: 0, color: "#10b981" },
    { name: "Medium (4-6)", value: 0, color: "#f59e0b" },
    { name: "High (7-10)", value: 0, color: "#ef4444" },
  ];

  needs.forEach((need) => {
    if (need.urgencyScore >= 7) data[2].value++;
    else if (need.urgencyScore >= 4) data[1].value++;
    else data[0].value++;
  });

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: "#6b7280", fontSize: 12 }}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: "#6b7280", fontSize: 12 }}
          />
          <Tooltip 
            cursor={{ fill: "transparent" }}
            contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
          />
          <Bar dataKey="value" radius={[4, 4, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
