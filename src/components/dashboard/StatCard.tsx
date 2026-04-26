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
  color?: "blue" | "green" | "orange" | "red";
}

export const StatCard = ({ title, value, description, icon, trend, color = "blue" }: StatCardProps) => {
  const colorMap = {
    blue: "from-blue-500/10 to-blue-600/5 text-blue-600 border-blue-100/50 dark:border-blue-900/20",
    green: "from-green-500/10 to-green-600/5 text-green-600 border-green-100/50 dark:border-green-900/20",
    orange: "from-orange-500/10 to-orange-600/5 text-orange-600 border-orange-100/50 dark:border-orange-900/20",
    red: "from-red-500/10 to-red-600/5 text-red-600 border-red-100/50 dark:border-red-900/20",
  };

  const iconBgMap = {
    blue: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
    green: "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400",
    orange: "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400",
    red: "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400",
  };

  return (
    <div className={`group relative overflow-hidden p-6 rounded-3xl bg-gradient-to-br ${colorMap[color]} bg-white dark:bg-neutral-900 shadow-sm border transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/5 hover:-translate-y-1`}>
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-2xl ${iconBgMap[color]} transition-transform duration-300 group-hover:scale-110`}>
          {icon}
        </div>
        {trend && (
          <span className={`px-2 py-1 rounded-full text-xs font-bold ${trend.isUp ? "bg-green-100 text-green-700 dark:bg-green-900/30" : "bg-red-100 text-red-700 dark:bg-red-900/30"}`}>
            {trend.isUp ? "↑" : "↓"} {trend.value}%
          </span>
        )}
      </div>
      <div>
        <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 tracking-wide uppercase">{title}</h3>
        <div className="text-3xl font-black mt-1 tracking-tight">{value}</div>
        {description && (
          <p className="text-xs text-gray-400 mt-2 font-medium">{description}</p>
        )}
      </div>
      
      {/* Decorative background element */}
      <div className={`absolute -right-4 -bottom-4 w-24 h-24 rounded-full bg-current opacity-[0.03] transition-transform duration-500 group-hover:scale-150`} />
    </div>
  );
};
