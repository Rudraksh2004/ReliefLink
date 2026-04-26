import React from "react";

export default function VolunteersPage() {
  return (
    <div className="p-8 space-y-6">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Volunteers</h1>
          <p className="text-gray-500">Manage volunteer matching and resource allocation.</p>
        </div>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20">
          Add Volunteer
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Placeholder for volunteer cards */}
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-6 rounded-2xl bg-white dark:bg-neutral-900 shadow-sm border border-gray-100 dark:border-neutral-800 animate-pulse">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-gray-200 dark:bg-neutral-800 rounded-full"></div>
              <div className="space-y-2">
                <div className="h-4 w-24 bg-gray-200 dark:bg-neutral-800 rounded"></div>
                <div className="h-3 w-16 bg-gray-100 dark:bg-neutral-800 rounded"></div>
              </div>
            </div>
            <div className="h-3 w-full bg-gray-100 dark:bg-neutral-800 rounded mt-2"></div>
            <div className="h-3 w-2/3 bg-gray-100 dark:bg-neutral-800 rounded mt-2"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
