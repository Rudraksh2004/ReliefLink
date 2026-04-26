import React from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isUp: boolean;
  };
}

export const StatCard = ({ title, value, description, icon, trend }: StatCardProps) => {
  return (
    <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 shadow-sm border border-gray-100 dark:border-neutral-800">
      <div className="flex justify-between items-start mb-4">
        <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
          {icon}
        </div>
        {trend && (
          <span className={`text-xs font-medium ${trend.isUp ? "text-green-600" : "text-red-600"}`}>
            {trend.isUp ? "+" : "-"}{trend.value}%
          </span>
        )}
      </div>
      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</h3>
      <div className="text-2xl font-bold mt-1">{value}</div>
      {description && (
        <p className="text-xs text-gray-400 mt-2">{description}</p>
      )}
    </div>
  );
};
