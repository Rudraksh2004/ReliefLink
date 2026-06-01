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
    blue: "border-blue-500/20 dark:border-blue-500/30 text-blue-600 dark:text-blue-400 shadow-blue-500/5 hover:border-blue-500/50",
    green: "border-green-500/20 dark:border-green-500/30 text-green-600 dark:text-green-400 shadow-green-500/5 hover:border-green-500/50",
    orange: "border-orange-500/20 dark:border-orange-500/30 text-orange-600 dark:text-orange-400 shadow-orange-500/5 hover:border-orange-500/50",
    red: "border-red-500/20 dark:border-red-500/30 text-red-600 dark:text-red-400 shadow-red-500/5 hover:border-red-500/50",
  };

  const neonBarMap = {
    blue: "bg-gradient-to-r from-blue-500 to-indigo-500 shadow-[0_1px_10px_rgba(59,130,246,0.5)]",
    green: "bg-gradient-to-r from-green-500 to-emerald-500 shadow-[0_1px_10px_rgba(16,185,129,0.5)]",
    orange: "bg-gradient-to-r from-orange-500 to-amber-500 shadow-[0_1px_10px_rgba(245,158,11,0.5)]",
    red: "bg-gradient-to-r from-red-500 to-rose-500 shadow-[0_1px_10px_rgba(239,68,68,0.5)]",
  };

  const iconBgMap = {
    blue: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20",
    green: "bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20",
    orange: "bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20",
    red: "bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20",
  };

  return (
    <div className={`group relative overflow-hidden p-6 rounded-[2rem] bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl border ${colorMap[color]} transition-all duration-300 hover:shadow-2xl hover:-translate-y-1.5 flex flex-col justify-between min-h-[170px]`}>
      
      {/* Dynamic light reflection effect */}
      <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      {/* Top row */}
      <div className="flex justify-between items-center mb-4 relative z-10">
        <div className={`p-3 rounded-2xl ${iconBgMap[color]} transition-transform duration-500 group-hover:scale-110`}>
          {icon}
        </div>
        {trend && (
          <span className={`px-3 py-1 rounded-full text-xs font-black flex items-center gap-1 ${
            trend.isUp 
              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20" 
              : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20"
          }`}>
            <span>{trend.isUp ? "↑" : "↓"}</span>
            <span>{trend.value}%</span>
          </span>
        )}
      </div>

      {/* Content */}
      <div className="relative z-10 mt-auto">
        <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 tracking-widest uppercase">{title}</h3>
        <div className="text-4xl font-black mt-1 tracking-tight text-slate-900 dark:text-white leading-none">
          {value}
        </div>
        {description && (
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 font-medium leading-relaxed">
            {description}
          </p>
        )}
      </div>
      
      {/* Premium Neon accent line */}
      <div className={`absolute bottom-0 left-0 right-0 h-[3px] w-full ${neonBarMap[color]} transform translate-y-[1px] group-hover:translate-y-0 transition-transform duration-300`} />
      
      {/* Subtle decorative background circle */}
      <div className={`absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-current opacity-[0.015] transition-transform duration-700 group-hover:scale-175`} />
    </div>
  );
};
