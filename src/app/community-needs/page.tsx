import React from "react";
import { CommunityNeedForm } from "@/components/forms/CommunityNeedForm";
import { PipelineTestButton } from "@/components/debug/PipelineTestButton";

export default function CommunityNeedsPage() {
  return (
    <div className="p-8 space-y-12 max-w-7xl mx-auto">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight">Community Needs</h1>
          <p className="text-gray-500 mt-2 text-lg">Track and manage resource requests from the field in real-time.</p>
        </div>
        <div className="flex flex-col md:flex-row gap-3">
          <PipelineTestButton />
          <button className="px-5 py-2.5 bg-gray-100 dark:bg-neutral-800 rounded-xl font-medium hover:bg-gray-200 transition-colors h-fit">
            Export Analytics
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-12">
        {/* Left Column: Form */}
        <div className="xl:col-span-2">
          <div className="sticky top-8">
            <CommunityNeedForm />
          </div>
        </div>

        {/* Right Column: Data View Placeholder */}
        <div className="xl:col-span-3 space-y-6">
          <div className="rounded-2xl bg-white dark:bg-neutral-900 shadow-sm border border-gray-100 dark:border-neutral-800 overflow-hidden">
            <div className="p-6 border-b border-gray-100 dark:border-neutral-800 flex justify-between items-center bg-gray-50/50 dark:bg-neutral-800/50">
              <h2 className="font-bold text-xl">Active Relief Requests</h2>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                Live Updates Enabled
              </div>
            </div>
            
            <div className="p-20 text-center flex flex-col items-center justify-center space-y-4">
              <div className="w-16 h-16 bg-gray-100 dark:bg-neutral-800 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="max-w-xs">
                <p className="font-semibold text-gray-900 dark:text-gray-100">No requests submitted yet</p>
                <p className="text-gray-500 text-sm mt-1">Use the form to create the first relief request for this region.</p>
              </div>
            </div>
          </div>

          {/* Aggregated Stats Placeholder */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-blue-600 text-white shadow-xl shadow-blue-500/20">
              <h3 className="text-blue-100 text-sm font-medium">Average Urgency</h3>
              <p className="text-3xl font-bold mt-1">0.0</p>
            </div>
            <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800">
              <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Total Affected</h3>
              <p className="text-3xl font-bold mt-1 text-gray-900 dark:text-gray-100">0</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
