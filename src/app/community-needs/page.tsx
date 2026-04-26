"use client";

import React from "react";
import { CommunityNeedForm } from "@/components/forms/CommunityNeedForm";
import { PipelineTestButton } from "@/components/debug/PipelineTestButton";
import { BackgroundGlow } from "@/components/ui/BackgroundGlow";

export default function CommunityNeedsPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 relative overflow-hidden">
      <BackgroundGlow />

      <div className="max-w-7xl mx-auto px-8 py-12 space-y-12 relative z-10">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-black tracking-tight bg-gradient-to-br from-neutral-900 to-neutral-500 dark:from-white dark:to-neutral-500 bg-clip-text text-transparent">
              Community Needs
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2 text-lg font-medium">Track and manage resource requests from the field in real-time.</p>
          </div>
          <div className="flex flex-col md:flex-row gap-3">
            <PipelineTestButton />
            <button className="px-6 py-3 bg-white/70 dark:bg-neutral-900/70 backdrop-blur-xl border border-gray-200 dark:border-neutral-800 rounded-2xl font-bold hover:bg-gray-50 transition-all h-fit shadow-sm hover:shadow-lg">
              Export Analytics
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-5 gap-12">
          {/* Left Column: Form */}
          <div className="xl:col-span-2">
            <div className="sticky top-8 bg-white/70 dark:bg-neutral-900/70 backdrop-blur-xl p-8 rounded-[2.5rem] border border-gray-100 dark:border-neutral-800 shadow-sm">
              <CommunityNeedForm />
            </div>
          </div>

          {/* Right Column: Data View Placeholder */}
          <div className="xl:col-span-3 space-y-8">
            <div className="rounded-[2.5rem] bg-white/70 dark:bg-neutral-900/70 backdrop-blur-xl shadow-sm border border-gray-100 dark:border-neutral-800 overflow-hidden">
              <div className="p-8 border-b border-gray-100 dark:border-neutral-800 flex justify-between items-center bg-gray-50/50 dark:bg-neutral-800/50">
                <h2 className="font-black text-2xl">Active Relief Requests</h2>
                <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                  Live Updates
                </div>
              </div>
              
              <div className="p-24 text-center flex flex-col items-center justify-center space-y-6">
                <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/20 rounded-[2rem] flex items-center justify-center">
                  <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="max-w-xs">
                  <p className="font-black text-xl text-gray-900 dark:text-gray-100">No requests submitted yet</p>
                  <p className="text-gray-500 font-medium text-sm mt-2 leading-relaxed">Use the form to create the first relief request for this region.</p>
                </div>
              </div>
            </div>

            {/* Aggregated Stats Placeholder */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-8 rounded-[2.5rem] bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-xl shadow-blue-500/20 relative overflow-hidden group">
                <div className="relative z-10">
                  <h3 className="text-blue-100 text-xs font-bold uppercase tracking-widest">Average Urgency</h3>
                  <p className="text-5xl font-black mt-2">0.0</p>
                </div>
                <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
              </div>
              <div className="p-8 rounded-[2.5rem] bg-white/70 dark:bg-neutral-900/70 backdrop-blur-xl border border-gray-100 dark:border-neutral-800 shadow-sm">
                <h3 className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-widest">Total Affected</h3>
                <p className="text-5xl font-black mt-2 text-gray-900 dark:text-gray-100">0</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
