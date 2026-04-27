"use client";

import React, { useState } from "react";
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
  Activity,
  Search,
  Plus,
  RefreshCcw,
  ArrowRight,
  Filter,
  ShieldCheck
} from "lucide-react";
import { BackgroundGlow } from "@/components/ui/BackgroundGlow";

export default function AdminDashboard() {
  const { data: needs, loading: loadingNeeds } = useFirestoreListener<CommunityNeed>("community_needs");
  const { data: volunteers, loading: loadingVolunteers } = useFirestoreListener<Volunteer>("volunteers");
  const { data: assignments, loading: loadingAssignments } = useFirestoreListener<Assignment>("assignments");
  
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | "community_user" | "volunteer">("all");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  if (loadingNeeds || loadingVolunteers || loadingAssignments) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <RefreshCcw className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const totalNeeds = needs.length;
  const totalVolunteers = volunteers.length;
  const totalAssignments = assignments.length;
  const resolvedNeeds = needs.filter(n => n.status === CommunityNeedStatus.RESOLVED).length;
  const publicNeeds = needs.filter(n => n.submittedByRole === "community_user").length;

  const filteredNeeds = roleFilter === "all" 
    ? needs 
    : needs.filter(n => n.submittedByRole === roleFilter);

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-neutral-950 px-6 py-10 relative overflow-hidden">
      <BackgroundGlow />
      
      <div className="max-w-[1600px] mx-auto space-y-10 relative z-10">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 px-3 py-1 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-full text-xs font-bold w-fit">
              <ShieldCheck className="w-3 h-3" />
              ADMINISTRATIVE CONTROL PANEL
            </div>
            <h1 className="text-4xl font-black tracking-tight text-neutral-900 dark:text-white">Admin Dashboard</h1>
            <p className="text-gray-500 dark:text-gray-400 font-medium">Full visibility into global relief operations and system performance.</p>
          </div>
          
          <div className="flex items-center gap-3">
            <button onClick={handleRefresh} className="p-3 rounded-2xl bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 shadow-sm">
              <RefreshCcw className={`w-5 h-5 ${isRefreshing ? "animate-spin" : ""}`} />
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Total Needs" value={totalNeeds} icon={<AlertTriangle />} color="orange" description="Global requests" />
          <StatCard title="Active Volunteers" value={totalVolunteers} icon={<Users />} color="blue" description="Verified responders" />
          <StatCard title="Ongoing Tasks" value={totalAssignments} icon={<Activity />} color="green" description="Active deployments" />
          <StatCard title="Public Reports" value={publicNeeds} icon={<ClipboardList />} color="blue" description="Community submissions" />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          <div className="xl:col-span-8 space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <section className="bg-white/70 dark:bg-neutral-900/70 backdrop-blur-xl p-8 rounded-[2rem] border border-gray-100 dark:border-neutral-800 shadow-sm">
                <h2 className="text-xl font-black mb-6">Urgency Analysis</h2>
                <UrgencyChart needs={filteredNeeds} />
              </section>
              <section className="bg-white/70 dark:bg-neutral-900/70 backdrop-blur-xl p-8 rounded-[2rem] border border-gray-100 dark:border-neutral-800 shadow-sm">
                <h2 className="text-xl font-black mb-6">Category Distribution</h2>
                <CategoryDistributionChart needs={filteredNeeds} />
              </section>
            </div>
          </div>
          
          <div className="xl:col-span-4 space-y-8">
            <section className="bg-white/70 dark:bg-neutral-900/70 backdrop-blur-xl p-8 rounded-[2.5rem] border border-gray-100 dark:border-neutral-800 shadow-sm">
              <h2 className="text-xl font-black mb-6">System Health</h2>
              <div className="space-y-4">
                <div className="p-4 bg-green-50 dark:bg-green-900/10 rounded-2xl flex items-center justify-between">
                  <span className="text-sm font-bold text-green-700">Matching Engine</span>
                  <span className="px-2 py-1 bg-green-200 dark:bg-green-800 rounded text-[10px] font-black uppercase">Active</span>
                </div>
                <div className="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-2xl flex items-center justify-between">
                  <span className="text-sm font-bold text-blue-700">Urgency Scorer</span>
                  <span className="px-2 py-1 bg-blue-200 dark:bg-blue-800 rounded text-[10px] font-black uppercase">Online</span>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
