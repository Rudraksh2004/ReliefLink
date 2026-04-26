import React from "react";
import dynamic from "next/dynamic";

// Dynamic import for Map component to avoid SSR issues with Leaflet
const PriorityHeatmap = dynamic(
  () => import("@/components/map/PriorityHeatmap").then((mod) => mod.PriorityHeatmap),
  { 
    ssr: false,
    loading: () => (
      <div className="h-[600px] w-full flex items-center justify-center bg-gray-50 dark:bg-neutral-900 rounded-2xl border border-gray-100 dark:border-neutral-800 animate-pulse">
        <p className="text-gray-400 font-medium text-lg">Loading Interactive Map...</p>
      </div>
    )
  }
);

export default function MapPage() {
  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight">Priority Region Heatmap</h1>
          <p className="text-gray-500 mt-2 text-lg">
            Real-time visualization of resource scarcity and regional urgency scores across India.
          </p>
        </div>
        <div className="flex gap-2 p-1 bg-white dark:bg-neutral-900 rounded-xl border border-gray-100 dark:border-neutral-800 shadow-sm">
           <div className="px-4 py-2 text-xs font-semibold uppercase tracking-widest text-gray-400">Legend</div>
           <div className="flex items-center gap-4 px-4 py-2">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-red-600"></span>
                <span className="text-xs font-medium">Critical</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[#ef4444]"></span>
                <span className="text-xs font-medium">High</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[#f59e0b]"></span>
                <span className="text-xs font-medium">Medium</span>
              </div>
           </div>
        </div>
      </header>

      <div className="space-y-6">
        {/* Main Map Container */}
        <PriorityHeatmap />

        {/* Map Information / Guidelines */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 shadow-sm">
            <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-2">Live Heat Data</h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              Intensity is calculated dynamically using normalized urgency scores. Red zones indicate a critical lack of resources coupled with high people affected counts.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 shadow-sm">
            <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-2">Region Aggregation</h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              Points are aggregated at the regional level. Clicking on a marker provides a detailed breakdown of total active needs and the average urgency level.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 shadow-sm">
            <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-2">Coordination Protocol</h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              High-priority zones (High/Critical) are automatically prioritized for the next available batch of volunteer-task matching assignments.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
