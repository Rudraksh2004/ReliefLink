"use client";

import React from "react";
import { VolunteerRegistrationForm } from "@/components/forms/VolunteerRegistrationForm";
import { BackgroundGlow } from "@/components/ui/BackgroundGlow";

export default function VolunteersPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 relative overflow-hidden">
      <BackgroundGlow />

      <div className="max-w-7xl mx-auto px-8 py-12 space-y-12 relative z-10">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-black tracking-tight bg-gradient-to-br from-neutral-900 to-neutral-500 dark:from-white dark:to-neutral-500 bg-clip-text text-transparent">
              Volunteers
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2 text-lg font-medium">Manage volunteer registration and task matching.</p>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left: Registration Form */}
          <div className="lg:col-span-5">
            <div className="bg-white/70 dark:bg-neutral-900/70 backdrop-blur-xl p-8 rounded-[2.5rem] border border-gray-100 dark:border-neutral-800 shadow-sm">
              <VolunteerRegistrationForm />
            </div>
          </div>

          {/* Right: Volunteer List / Stats Placeholder */}
          <div className="lg:col-span-7 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-8 rounded-[2.5rem] bg-white/70 dark:bg-neutral-900/70 backdrop-blur-xl border border-gray-100 dark:border-neutral-800 shadow-sm group hover:-translate-y-1 transition-all">
                <h3 className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-widest">Active Volunteers</h3>
                <p className="text-5xl font-black mt-2">0</p>
                <div className="mt-6 flex items-center gap-2 text-green-600 text-xs font-bold uppercase tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-green-600 animate-pulse"></span>
                  Ready to assist
                </div>
              </div>
              <div className="p-8 rounded-[2.5rem] bg-white/70 dark:bg-neutral-900/70 backdrop-blur-xl border border-gray-100 dark:border-neutral-800 shadow-sm group hover:-translate-y-1 transition-all">
                <h3 className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-widest">Tasks Assigned</h3>
                <p className="text-5xl font-black mt-2">0</p>
                <div className="mt-6 flex items-center gap-2 text-blue-600 text-xs font-bold uppercase tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                  Ongoing operations
                </div>
              </div>
            </div>

            <div className="rounded-[2.5rem] bg-white/70 dark:bg-neutral-900/70 backdrop-blur-xl border border-gray-100 dark:border-neutral-800 shadow-sm overflow-hidden">
              <div className="p-8 border-b border-gray-100 dark:border-neutral-800 flex justify-between items-center bg-gray-50/50 dark:bg-neutral-800/50">
                <h2 className="font-black text-2xl">Recent Registrations</h2>
              </div>
              <div className="p-24 text-center flex flex-col items-center justify-center space-y-6">
                <div className="w-20 h-20 bg-gray-100 dark:bg-neutral-800 rounded-[2rem] flex items-center justify-center">
                  <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <div className="max-w-xs mx-auto">
                  <p className="font-black text-xl text-gray-900 dark:text-gray-100">No volunteers registered</p>
                  <p className="text-gray-500 font-medium text-sm mt-2 leading-relaxed">New volunteers will appear here once they complete the registration form.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
