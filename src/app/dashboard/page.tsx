import React from "react";

export default function DashboardPage() {
  return (
    <div className="p-8 space-y-6">
      <header className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
        <div className="flex gap-2">
          {/* Dashboard filters or date range could go here */}
        </div>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Placeholder cards for metrics */}
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="p-6 rounded-2xl bg-white dark:bg-neutral-900 shadow-sm border border-gray-100 dark:border-neutral-800 animate-pulse">
            <div className="h-4 w-24 bg-gray-200 dark:bg-neutral-800 rounded mb-4"></div>
            <div className="h-8 w-16 bg-gray-300 dark:bg-neutral-700 rounded"></div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white dark:bg-neutral-900 shadow-sm border border-gray-100 dark:border-neutral-800 min-h-[300px] flex items-center justify-center text-gray-400">
          Urgerncy Score Distribution Chart Placeholder
        </div>
        <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 shadow-sm border border-gray-100 dark:border-neutral-800 min-h-[300px] flex items-center justify-center text-gray-400">
          Recent Activity Placeholder
        </div>
      </div>
    </div>
  );
}
