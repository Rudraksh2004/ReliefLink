"use client";

import React, { useState } from "react";
import Link from "next/link";
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
  MapPin
} from "lucide-react";

import { BackgroundGlow } from "@/components/ui/BackgroundGlow";
import { useAuth } from "@/context/AuthContext";

export default function DashboardPage() {
  const { userProfile } = useAuth();
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
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-900">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 bg-blue-600 rounded-full animate-pulse"></div>
          </div>
        </div>
        <p className="mt-4 text-gray-500 font-medium animate-pulse">Synchronizing Data...</p>
      </div>
    );
  }

  // Summary Metrics
  const totalNeeds = needs.length;
  const totalVolunteers = volunteers.length;
  const totalAssignments = assignments.length;
  const resolvedNeeds = needs.filter(n => n.status === CommunityNeedStatus.RESOLVED).length;
  const pendingNeeds = needs.filter(n => n.status === CommunityNeedStatus.PENDING).length;
  const matchedNeeds = needs.filter(n => n.status === CommunityNeedStatus.MATCHED).length;
  const publicNeeds = needs.filter(n => n.submittedByRole === "community_user").length;
  const volunteerNeeds = needs.filter(n => n.submittedByRole === "volunteer").length;

  const filteredNeeds = roleFilter === "all" 
    ? needs 
    : needs.filter(n => n.submittedByRole === roleFilter);

  // Filtered Assignments
  const filteredAssignments = assignments
    .filter(a => {
      const volunteer = volunteers.find(v => v.id === a.volunteerId);
      const need = needs.find(n => n.id === a.needId);
      const searchStr = `${volunteer?.name} ${need?.title} ${a.status}`.toLowerCase();
      return searchStr.includes(searchQuery.toLowerCase());
    })
    .sort((a, b) => {
      const dateA = (a.createdAt as any)?.seconds || 0;
      const dateB = (b.createdAt as any)?.seconds || 0;
      return dateB - dateA;
    })
    .slice(0, 8);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 selection:bg-blue-100 dark:selection:bg-blue-900/30 relative overflow-hidden">
      <BackgroundGlow />

      <div className="max-w-[1600px] mx-auto px-6 py-10 space-y-10 relative z-10">
        
        {/* Header Section */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded-full text-xs font-black border border-blue-500/20 tracking-wider">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              LIVE NGO COMMAND CENTER
            </div>
            <h1 className="text-5xl font-black tracking-tight text-neutral-900 dark:text-white">
              Emergency Analytics <span className="bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">Console</span>
            </h1>
            <p className="text-slate-500 dark:text-slate-400 max-w-2xl font-semibold leading-relaxed">
              Intelligent coordination of emergency responses and community resources through real-time AI urgency scoring.
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={handleRefresh}
              className="p-3.5 rounded-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-slate-200 dark:border-neutral-800 text-slate-500 hover:text-blue-600 hover:border-blue-500/30 transition-all hover:shadow-xl shadow-sm"
              title="Refresh Analytics"
            >
              <RefreshCcw className={`w-5 h-5 ${isRefreshing ? "animate-spin text-blue-500" : ""}`} />
            </button>
            
            {(userProfile?.role === "volunteer" || userProfile?.role === "admin") && (
              <Link href="/map">
                <button className="flex items-center gap-2 px-5 py-3.5 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-2xl font-bold transition-all shadow-lg hover:shadow-neutral-500/10 dark:hover:bg-neutral-100 group border border-transparent dark:border-neutral-200">
                  <MapPin className="w-5 h-5 transition-transform group-hover:scale-110" />
                  <span>View Heatmap</span>
                </button>
              </Link>
            )}

            <Link 
              href="/community-needs"
              className="flex items-center gap-2 px-5 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-2xl font-bold transition-all shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 group"
            >
              <Plus className="w-5 h-5 transition-transform group-hover:rotate-90" />
              <span>Register Need</span>
            </Link>
          </div>
        </header>

        {/* Summary Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          <StatCard 
            title="Active Needs" 
            value={totalNeeds} 
            icon={<AlertTriangle className="w-5 h-5" />} 
            description={`${pendingNeeds} pending, ${matchedNeeds} matched`}
            color="orange"
            trend={{ value: 12, isUp: true }}
          />
          <StatCard 
            title="Public Reports" 
            value={publicNeeds} 
            icon={<ClipboardList className="w-5 h-5" />} 
            description="Submitted by community members"
            color="orange"
            trend={{ value: Math.round((publicNeeds / (totalNeeds || 1)) * 100), isUp: true }}
          />
          <StatCard 
            title="Responders" 
            value={totalVolunteers} 
            icon={<Users className="w-5 h-5" />} 
            description="Verified community volunteers"
            color="blue"
            trend={{ value: 5, isUp: true }}
          />
          <StatCard 
            title="Deployments" 
            value={totalAssignments} 
            icon={<Activity className="w-5 h-5" />} 
            description="Ongoing relief operations"
            color="green"
            trend={{ value: 8, isUp: true }}
          />
          <StatCard 
            title="Completed" 
            value={resolvedNeeds} 
            icon={<CheckCircle className="w-5 h-5" />} 
            description="Successively resolved tasks"
            color="blue"
            trend={{ value: 24, isUp: true }}
          />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          {/* Main Visualizations */}
          <div className="xl:col-span-8 space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <section className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl p-8 rounded-[2rem] border border-slate-200/50 dark:border-neutral-800/80 shadow-sm hover:shadow-2xl hover:border-slate-300/50 dark:hover:border-neutral-700/60 transition-all duration-300">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-black flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center border border-rose-500/20">
                      <AlertTriangle className="w-5 h-5 text-rose-500" />
                    </div>
                    Urgency Analysis
                  </h2>
                  <div className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">AI Scoring Distribution</div>
                </div>
                <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                  {(['all', 'community_user', 'volunteer'] as const).map((role) => (
                    <button
                      key={role}
                      onClick={() => setRoleFilter(role)}
                      className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap border ${
                        roleFilter === role
                          ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20 border-transparent"
                          : "bg-slate-100/50 dark:bg-neutral-800/40 text-slate-500 dark:text-slate-400 border-transparent hover:bg-slate-200/50 dark:hover:bg-neutral-700/60 hover:text-slate-700 dark:hover:text-white"
                      }`}
                    >
                      {role === 'all' ? 'All Sources' : role === 'community_user' ? 'Public' : 'Volunteers'}
                    </button>
                  ))}
                </div>
                <UrgencyChart needs={filteredNeeds} />
              </section>

              <section className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl p-8 rounded-[2rem] border border-slate-200/50 dark:border-neutral-800/80 shadow-sm hover:shadow-2xl hover:border-slate-300/50 dark:hover:border-neutral-700/60 transition-all duration-300">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-black flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                      <ClipboardList className="w-5 h-5 text-blue-500" />
                    </div>
                    Needs by Category
                  </h2>
                  <div className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Resource Allocation</div>
                </div>
                <CategoryDistributionChart needs={filteredNeeds} />
              </section>
            </div>

            {/* Assignments Table Section */}
            <section className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl p-8 rounded-[2.5rem] border border-slate-200/50 dark:border-neutral-800/80 shadow-sm hover:shadow-2xl transition-all duration-300 overflow-hidden">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white">Recent Operations</h2>
                  <p className="text-sm text-slate-400 dark:text-slate-500 font-semibold">Real-time log of volunteer deployments and task status.</p>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                    <input 
                      type="text" 
                      placeholder="Search operations..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-11 pr-4 py-3 rounded-2xl bg-slate-100/50 dark:bg-neutral-800/30 border border-slate-200/40 dark:border-neutral-800 focus:border-blue-500/50 dark:focus:border-blue-500/50 focus:bg-white dark:focus:bg-slate-900 outline-none transition-all w-full md:w-64 text-sm font-semibold text-slate-700 dark:text-slate-200"
                    />
                  </div>
                  <button className="p-3 rounded-2xl bg-slate-100/50 dark:bg-neutral-800/30 text-slate-400 hover:text-blue-500 hover:bg-slate-200/30 dark:hover:bg-neutral-800/60 transition-colors border border-transparent dark:border-neutral-800">
                    <Filter className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto -mx-8 px-8">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest border-b border-slate-100 dark:border-neutral-800 pb-4">
                      <th className="pb-4 pr-4">Volunteer</th>
                      <th className="pb-4 pr-4">Assigned Task</th>
                      <th className="pb-4 pr-4">Timeline</th>
                      <th className="pb-4 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100/50 dark:divide-neutral-800/40">
                    {filteredAssignments.length > 0 ? (
                      filteredAssignments.map((assignment) => {
                        const volunteer = volunteers.find(v => v.id === assignment.volunteerId);
                        const need = needs.find(n => n.id === assignment.needId);
                        return (
                          <tr key={assignment.id} className="group hover:bg-blue-500/[0.02] dark:hover:bg-blue-500/[0.02] transition-colors">
                            <td className="py-5 pr-4">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500/10 to-indigo-500/10 dark:from-blue-500/20 dark:to-indigo-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400 font-black text-sm border border-blue-500/10">
                                  {volunteer?.name?.charAt(0) || "U"}
                                </div>
                                <div className="flex flex-col">
                                  <span className="font-bold text-sm text-slate-900 dark:text-white">{volunteer?.name || "Unknown Volunteer"}</span>
                                  <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">Responder</span>
                                </div>
                              </div>
                            </td>
                            <td className="py-5 pr-4">
                              <div className="flex flex-col">
                                <span className="font-bold text-sm text-slate-800 dark:text-slate-200 line-clamp-1 group-hover:text-blue-500 transition-colors">{need?.title || "Unknown Emergency Duty"}</span>
                                <span className="inline-flex items-center gap-1.5 mt-1">
                                  <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-slate-100 dark:bg-neutral-800 text-slate-500 dark:text-slate-400 border border-slate-200/50 dark:border-neutral-700/50">
                                    {need?.category || "Uncategorized"}
                                  </span>
                                  {need?.urgencyScore && (
                                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                                      need.urgencyScore >= 7 
                                        ? "bg-rose-500/10 text-rose-500 border border-rose-500/20" 
                                        : need.urgencyScore >= 4 
                                        ? "bg-amber-500/10 text-amber-500 border border-amber-500/20" 
                                        : "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                                    }`}>
                                      URGENCY {need.urgencyScore}
                                    </span>
                                  )}
                                </span>
                              </div>
                            </td>
                            <td className="py-5 pr-4">
                              <span className="text-xs text-slate-500 dark:text-slate-400 font-bold">
                                {assignment.createdAt ? new Date((assignment.createdAt as any).seconds * 1000).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : "Pending"}
                              </span>
                            </td>
                            <td className="py-5 text-right">
                              <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-2xl text-[10px] font-black uppercase tracking-wider border ${
                                assignment.status === 'completed' 
                                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' 
                                  : 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20'
                              }`}>
                                <span className={`relative flex h-1.5 w-1.5`}>
                                  {assignment.status !== 'completed' && (
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                  )}
                                  <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${assignment.status === 'completed' ? 'bg-emerald-500' : 'bg-blue-500'}`}></span>
                                </span>
                                {assignment.status}
                              </span>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={4} className="py-20 text-center">
                          <div className="flex flex-col items-center gap-3 text-slate-400">
                            <Search className="w-12 h-12 opacity-20" />
                            <p className="font-semibold text-slate-400 dark:text-slate-500">No active operations match search parameter.</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              
              <button className="w-full mt-8 py-4.5 border-2 border-dashed border-slate-200 dark:border-neutral-800 hover:border-blue-500/40 rounded-2xl text-slate-400 dark:text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-500/[0.02] transition-all font-bold text-sm flex items-center justify-center gap-2 group">
                View Full Operational Log
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            </section>
          </div>

          {/* Sidebar Info */}
          <div className="xl:col-span-4 space-y-8">
            <section className="bg-gradient-to-br from-blue-600 to-indigo-800 p-8 rounded-[2.5rem] text-white shadow-xl shadow-blue-500/15 overflow-hidden relative group border border-blue-500/20">
              <div className="relative z-10">
                <div className="w-14 h-14 bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl flex items-center justify-center mb-6 transition-transform duration-500 group-hover:scale-110">
                  <Activity className="w-7 h-7 text-white" />
                </div>
                <h2 className="text-2xl font-black mb-3">Coordination Efficiency</h2>
                <p className="text-blue-100/90 text-sm font-semibold mb-8 leading-relaxed">
                  Overall coordination index is verified at 94%. Strategic distribution algorithm recommends resource relocation in Sector C.
                </p>
                
                <div className="space-y-5">
                  <div className="p-5 bg-white/5 backdrop-blur-md rounded-[1.5rem] border border-white/10">
                    <div className="flex justify-between items-center mb-2.5">
                      <span className="text-[10px] font-black uppercase tracking-widest text-blue-200">Response Precision</span>
                      <span className="text-xs font-black">94%</span>
                    </div>
                    <div className="h-2 bg-blue-950/40 rounded-full overflow-hidden p-[1px]">
                      <div className="h-full bg-gradient-to-r from-cyan-400 to-blue-300 rounded-full w-[94%] shadow-[0_0_8px_#22d3ee]"></div>
                    </div>
                  </div>
                  <div className="p-5 bg-white/5 backdrop-blur-md rounded-[1.5rem] border border-white/10">
                    <div className="flex justify-between items-center mb-2.5">
                      <span className="text-[10px] font-black uppercase tracking-widest text-blue-200">Resource Coverage</span>
                      <span className="text-xs font-black">78%</span>
                    </div>
                    <div className="h-2 bg-blue-950/40 rounded-full overflow-hidden p-[1px]">
                      <div className="h-full bg-gradient-to-r from-emerald-400 to-teal-300 rounded-full w-[78%] shadow-[0_0_8px_#34d399]"></div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Decorative background visual elements */}
              <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-white/10 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-700"></div>
              <div className="absolute -left-20 -top-20 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-700"></div>
            </section>

            <section className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl p-8 rounded-[2.5rem] border border-slate-200/50 dark:border-neutral-800/80 shadow-sm hover:shadow-2xl transition-all duration-300">
              <h2 className="text-xl font-black mb-6 text-slate-900 dark:text-white flex items-center gap-2">
                <span className="inline-block w-1.5 h-6 rounded-full bg-blue-600"></span>
                System Diagnostics
              </h2>
              <div className="space-y-6">
                <div className="flex gap-4 group/item">
                  <div className="w-12 h-12 shrink-0 rounded-2xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20 group-hover/item:scale-110 transition-transform">
                    <AlertTriangle className="w-6 h-6 text-amber-500" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-slate-200">Critical Needs Surge</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold leading-relaxed mt-1">High urgency needs in Medical category calculated 15% increase today.</p>
                  </div>
                </div>
                <div className="flex gap-4 group/item">
                  <div className="w-12 h-12 shrink-0 rounded-2xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 group-hover/item:scale-110 transition-transform">
                    <Users className="w-6 h-6 text-emerald-500" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-slate-200">Logistics Deployment</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold leading-relaxed mt-1">Newly onboarded local coordinators matched to South Kolkata sectors.</p>
                  </div>
                </div>
                <div className="flex gap-4 group/item">
                  <div className="w-12 h-12 shrink-0 rounded-2xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20 group-hover/item:scale-110 transition-transform">
                    <CheckCircle className="w-6 h-6 text-blue-500" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-slate-200">Urgency Model Tuning</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold leading-relaxed mt-1">Matching latency optimized under 12 mins average response threshold.</p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
