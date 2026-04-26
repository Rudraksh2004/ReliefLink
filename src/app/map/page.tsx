import React from "react";

export default function MapPage() {
  return (
    <div className="h-screen w-full relative flex flex-col">
      <div className="absolute top-8 left-8 z-[1000] p-6 rounded-2xl bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md shadow-xl border border-white/20 dark:border-neutral-800/20 max-w-sm">
        <h1 className="text-2xl font-bold mb-2">Priority Heatmap</h1>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          Visualizing urgent community needs across the region. Brighter spots indicate higher urgency and resource scarcity.
        </p>
        <div className="mt-4 flex flex-col gap-2">
          <div className="flex items-center gap-2 text-xs">
            <span className="w-3 h-3 rounded-full bg-red-500"></span> Critical Urgency
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="w-3 h-3 rounded-full bg-orange-500"></span> High Priority
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="w-3 h-3 rounded-full bg-yellow-500"></span> Stable
          </div>
        </div>
      </div>

      <div className="flex-1 bg-gray-200 dark:bg-neutral-900 flex items-center justify-center text-gray-400">
        <div className="text-center">
          <p className="text-xl font-semibold mb-2 text-gray-500 dark:text-gray-300">Map Loading...</p>
          <p className="text-sm">Leaflet.js will be initialized here.</p>
        </div>
      </div>
    </div>
  );
}
