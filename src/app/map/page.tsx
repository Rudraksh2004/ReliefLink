"use client";

import React from "react";
import dynamic from "next/dynamic";
import { BackgroundGlow } from "@/components/ui/BackgroundGlow";

// Dynamic import for Map component to avoid SSR issues with Leaflet
const PriorityHeatmap = dynamic(
  () => import("@/components/map/PriorityHeatmap").then((mod) => mod.PriorityHeatmap),
  { 
    ssr: false,
    loading: () => (
      <div className="h-[600px] w-full flex items-center justify-center bg-white/70 dark:bg-neutral-900/70 backdrop-blur-xl rounded-[2.5rem] border border-gray-100 dark:border-neutral-800 animate-pulse">
        <p className="text-gray-400 font-bold text-lg uppercase tracking-widest">Initialising Tactical Map...</p>
      </div>
    )
  }
);

export default function MapPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 relative overflow-hidden">
      <BackgroundGlow />

      <div className="max-w-7xl mx-auto px-8 py-12 space-y-12 relative z-10">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-4xl font-black tracking-tight bg-gradient-to-br from-neutral-900 to-neutral-500 dark:from-white dark:to-neutral-500 bg-clip-text text-transparent">
              Priority Region Heatmap
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2 text-lg font-medium leading-relaxed max-w-2xl">
              Real-time visualization of resource scarcity and regional urgency scores across coordinated zones.
            </p>
          </div>
          <div className="flex gap-2 p-2 bg-white/70 dark:bg-neutral-900/70 backdrop-blur-xl rounded-[1.5rem] border border-gray-100 dark:border-neutral-800 shadow-sm h-fit">
             <div className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-gray-400 border-r border-gray-100 dark:border-neutral-800">Legend</div>
             <div className="flex items-center gap-6 px-4 py-2">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-600 shadow-lg shadow-red-500/40"></span>
                  <span className="text-[10px] font-black uppercase tracking-wider text-gray-500">Critical</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#ef4444] shadow-lg shadow-red-400/40"></span>
                  <span className="text-[10px] font-black uppercase tracking-wider text-gray-500">High</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#f59e0b] shadow-lg shadow-orange-400/40"></span>
                  <span className="text-[10px] font-black uppercase tracking-wider text-gray-500">Medium</span>
                </div>
             </div>
          </div>
        </header>

        <div className="space-y-8">
          {/* Main Map Container */}
          <div className="rounded-[3rem] overflow-hidden border-8 border-white/50 dark:border-neutral-900/50 shadow-2xl relative">
            <PriorityHeatmap />
          </div>

          {/* Map Information / Guidelines */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-[2.5rem] bg-white/70 dark:bg-neutral-900/70 backdrop-blur-xl border border-gray-100 dark:border-neutral-800 shadow-sm group hover:-translate-y-1 transition-all">
              <h3 className="font-black text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                Live Heat Data
              </h3>
              <p className="text-sm text-gray-500 font-medium leading-relaxed">
                Intensity is calculated dynamically using normalized urgency scores. Red zones indicate a critical lack of resources.
              </p>
            </div>
            <div className="p-8 rounded-[2.5rem] bg-white/70 dark:bg-neutral-900/70 backdrop-blur-xl border border-gray-100 dark:border-neutral-800 shadow-sm group hover:-translate-y-1 transition-all">
              <h3 className="font-black text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-600"></div>
                Region Aggregation
              </h3>
              <p className="text-sm text-gray-500 font-medium leading-relaxed">
                Points are aggregated at the regional level. Clicking on a marker provides a detailed breakdown of active needs.
              </p>
            </div>
            <div className="p-8 rounded-[2.5rem] bg-white/70 dark:bg-neutral-900/70 backdrop-blur-xl border border-gray-100 dark:border-neutral-800 shadow-sm group hover:-translate-y-1 transition-all">
              <h3 className="font-black text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-orange-600"></div>
                Coordination Protocol
              </h3>
              <p className="text-sm text-gray-500 font-medium leading-relaxed">
                High-priority zones are automatically prioritized for the next available batch of volunteer-task matching assignments.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
