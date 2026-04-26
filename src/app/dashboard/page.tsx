"use client";

import React from "react";
import { useFirestoreListener } from "@/hooks/useFirestoreListener";
import { CommunityNeed, CommunityNeedStatus } from "@/types/communityNeed";
import { Volunteer } from "@/types/volunteer";
import { Assignment } from "@/types/assignment";
import { StatCard } from "@/components/dashboard/StatCard";
import { UrgencyChart } from "@/components/dashboard/UrgencyChart";
import { CategoryDistributionChart } from "@/components/dashboard/CategoryDistributionChart";
import { 
  Users, 
  ClipboardList, 
  CheckCircle, 
  AlertTriangle,
  Activity
} from "lucide-react";

export default function DashboardPage() {
  const { data: needs, loading: loadingNeeds } = useFirestoreListener<CommunityNeed>("community_needs");
  const { data: volunteers, loading: loadingVolunteers } = useFirestoreListener<Volunteer>("volunteers");
  const { data: assignments, loading: loadingAssignments } = useFirestoreListener<Assignment>("assignments");

  if (loadingNeeds || loadingVolunteers || loadingAssignments) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (needs.length >= 0) {
    console.log("Dashboard realtime listener working");
  }

  // Summary Metrics
  const totalNeeds = needs.length;
  const totalVolunteers = volunteers.length;
  const totalAssignments = assignments.length;
  const resolvedNeeds = needs.filter(n => n.status === CommunityNeedStatus.RESOLVED).length;
  const pendingNeeds = needs.filter(n => n.status === CommunityNeedStatus.PENDING).length;
  const matchedNeeds = needs.filter(n => n.status === CommunityNeedStatus.MATCHED).length;

  // Latest 5 Assignments
  const latestAssignments = [...assignments]
    .sort((a, b) => {
      const dateA = (a.createdAt as any)?.seconds || 0;
      const dateB = (b.createdAt as any)?.seconds || 0;
      return dateB - dateA;
    })
    .slice(0, 5);

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <header>
        <h1 className="text-3xl font-extrabold tracking-tight">ReliefLink Coordination Analytics</h1>
        <p className="text-gray-500 mt-1">Real-time oversight of community needs and volunteer mobilization.</p>
      </header>

      {/* Summary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Needs" 
          value={totalNeeds} 
          icon={<AlertTriangle className="w-5 h-5" />} 
          description={`${pendingNeeds} currently pending`}
        />
        <StatCard 
          title="Active Volunteers" 
          value={totalVolunteers} 
          icon={<Users className="w-5 h-5" />} 
          description="Registered responders"
        />
        <StatCard 
          title="Total Assignments" 
          value={totalAssignments} 
          icon={<Activity className="w-5 h-5" />} 
          description={`${matchedNeeds} active matches`}
        />
        <StatCard 
          title="Resolved" 
          value={resolvedNeeds} 
          icon={<CheckCircle className="w-5 h-5" />} 
          description="Tasks completed"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-gray-100 dark:border-neutral-800 shadow-sm">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-blue-600" />
            Urgency Distribution
          </h2>
          <UrgencyChart needs={needs} />
        </div>
        <div className="bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-gray-100 dark:border-neutral-800 shadow-sm">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Activity className="w-5 h-5 text-green-600" />
            Needs by Category
          </h2>
          <CategoryDistributionChart needs={needs} />
        </div>
      </div>

      {/* Status & Latest Assignments */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Status Tracker */}
        <div className="bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-gray-100 dark:border-neutral-800 shadow-sm h-full">
          <h2 className="text-xl font-bold mb-6">Matching Status</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 rounded-xl bg-orange-50 dark:bg-orange-900/10 text-orange-700 dark:text-orange-400">
              <span className="font-medium">Pending</span>
              <span className="text-xl font-bold">{pendingNeeds}</span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-xl bg-blue-50 dark:bg-blue-900/10 text-blue-700 dark:text-blue-400">
              <span className="font-medium">Matched</span>
              <span className="text-xl font-bold">{matchedNeeds}</span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-xl bg-green-50 dark:bg-green-900/10 text-green-700 dark:text-green-400">
              <span className="font-medium">Resolved</span>
              <span className="text-xl font-bold">{resolvedNeeds}</span>
            </div>
          </div>
        </div>

        {/* Latest Assignments List */}
        <div className="lg:col-span-2 bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-gray-100 dark:border-neutral-800 shadow-sm">
          <h2 className="text-xl font-bold mb-6">Latest Relief Assignments</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm text-gray-500 border-b border-gray-100 dark:border-neutral-800">
                  <th className="pb-4 font-medium">Volunteer</th>
                  <th className="pb-4 font-medium">Community Need</th>
                  <th className="pb-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-neutral-800">
                {latestAssignments.length > 0 ? (
                  latestAssignments.map((assignment) => {
                    const volunteer = volunteers.find(v => v.id === assignment.volunteerId);
                    const need = needs.find(n => n.id === assignment.needId);
                    return (
                      <tr key={assignment.id} className="text-sm">
                        <td className="py-4 font-medium">{volunteer?.name || "Unknown"}</td>
                        <td className="py-4 text-gray-600 dark:text-gray-400">{need?.title || "Unknown Need"}</td>
                        <td className="py-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            assignment.status === 'completed' 
                              ? 'bg-green-100 text-green-700 dark:bg-green-900/20' 
                              : 'bg-blue-100 text-blue-700 dark:bg-blue-900/20'
                          }`}>
                            {assignment.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={3} className="py-8 text-center text-gray-400">No assignments recorded yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
