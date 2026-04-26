import React from "react";

export default function CommunityNeedsPage() {
  return (
    <div className="p-8 space-y-6">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Community Needs</h1>
          <p className="text-gray-500">Track and manage resource requests from the field.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-gray-100 dark:bg-neutral-800 rounded-lg hover:bg-gray-200 transition-colors">
            Upload CSV
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20">
            Manual Entry
          </button>
        </div>
      </header>

      <div className="rounded-2xl bg-white dark:bg-neutral-900 shadow-sm border border-gray-100 dark:border-neutral-800 overflow-hidden">
        <div className="p-6 border-b border-gray-100 dark:border-neutral-800 flex justify-between items-center">
          <h2 className="font-semibold text-lg">Active Requests</h2>
          {/* Table filters */}
        </div>
        <div className="p-12 text-center text-gray-400">
          No data available. Use "Manual Entry" or "Upload CSV" to get started.
        </div>
      </div>
    </div>
  );
}
