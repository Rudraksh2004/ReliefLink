import React from "react";
import { VolunteerRegistrationForm } from "@/components/forms/VolunteerRegistrationForm";

export default function VolunteersPage() {
  return (
    <div className="p-8 space-y-12 max-w-7xl mx-auto">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight">Volunteers</h1>
          <p className="text-gray-500 mt-2 text-lg">Manage volunteer registration and task matching.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left: Registration Form */}
        <div className="lg:col-span-5">
          <VolunteerRegistrationForm />
        </div>

        {/* Right: Volunteer List / Stats Placeholder */}
        <div className="lg:col-span-7 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 shadow-sm">
              <h3 className="text-gray-500 text-sm font-medium">Active Volunteers</h3>
              <p className="text-4xl font-bold mt-2">0</p>
              <div className="mt-4 flex items-center gap-2 text-green-600 text-sm font-medium">
                <span className="w-2 h-2 rounded-full bg-green-600"></span>
                Available for matching
              </div>
            </div>
            <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 shadow-sm">
              <h3 className="text-gray-500 text-sm font-medium">Tasks Assigned</h3>
              <p className="text-4xl font-bold mt-2">0</p>
              <div className="mt-4 flex items-center gap-2 text-blue-600 text-sm font-medium">
                <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                In-progress relief
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-white dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100 dark:border-neutral-800 flex justify-between items-center bg-gray-50/50 dark:bg-neutral-800/50">
              <h2 className="font-bold text-xl">Recent Registrations</h2>
            </div>
            <div className="p-20 text-center flex flex-col items-center justify-center space-y-4">
              <div className="w-16 h-16 bg-gray-100 dark:bg-neutral-800 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <div className="max-w-xs mx-auto">
                <p className="font-semibold text-gray-900 dark:text-gray-100">No volunteers registered</p>
                <p className="text-gray-500 text-sm mt-1">New volunteers will appear here once they complete the registration form.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
