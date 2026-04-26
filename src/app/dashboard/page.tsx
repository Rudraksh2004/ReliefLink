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
  Filter
} from "lucide-react";

export default function DashboardPage() {
  const { data: needs, loading: loadingNeeds } = useFirestoreListener<CommunityNeed>("community_needs");
  const { data: volunteers, loading: loadingVolunteers } = useFirestoreListener<Volunteer>("volunteers");
  const { data: assignments, loading: loadingAssignments } = useFirestoreListener<Assignment>("assignments");
  
  const [searchQuery, setSearchQuery] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  if (loadingNeeds || loadingVolunteers || loadingAssignments) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-neutral-950">
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
    <div className="min-h-screen bg-[#f8fafc] dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 selection:bg-blue-100 dark:selection:bg-blue-900/30 relative overflow-hidden">
      {/* Savvy Background Elements */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Animated Glows */}
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-500/10 dark:bg-blue-600/10 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-500/10 dark:bg-indigo-600/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '3s' }}></div>
        <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-purple-500/5 dark:bg-purple-600/5 rounded-full blur-[100px]"></div>
        
        {/* Tech Grid/Mesh Pattern */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] dark:opacity-[0.05] brightness-100 contrast-150"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
      </div>

      <div className="max-w-[1600px] mx-auto px-6 py-10 space-y-10 relative z-10">
        
        {/* Header Section */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full text-xs font-bold w-fit">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              LIVE ANALYTICS SYSTEM
            </div>
            <h1 className="text-4xl font-black tracking-tight bg-gradient-to-br from-neutral-900 to-neutral-500 dark:from-white dark:to-neutral-500 bg-clip-text text-transparent">
              ReliefLink Dashboard
            </h1>
            <p className="text-gray-500 dark:text-gray-400 max-w-xl font-medium">
              Intelligent coordination of emergency responses and community resources through real-time AI urgency scoring.
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={handleRefresh}
              className="p-3 rounded-2xl bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 text-gray-500 hover:text-blue-600 transition-all hover:shadow-lg shadow-sm"
            >
              <RefreshCcw className={`w-5 h-5 ${isRefreshing ? "animate-spin" : ""}`} />
            </button>
            <button className="flex items-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold transition-all shadow-lg shadow-blue-500/25 group">
              <Plus className="w-5 h-5 transition-transform group-hover:rotate-90" />
              <span>Register Need</span>
            </button>
          </div>
        </header>

        {/* Summary Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            title="Active Needs" 
            value={totalNeeds} 
            icon={<AlertTriangle className="w-5 h-5" />} 
            description={`${pendingNeeds} pending, ${matchedNeeds} matched`}
            color="orange"
            trend={{ value: 12, isUp: true }}
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
              <section className="bg-white/70 dark:bg-neutral-900/70 backdrop-blur-xl p-8 rounded-[2rem] border border-gray-100 dark:border-neutral-800 shadow-sm hover:shadow-xl hover:shadow-blue-500/5 transition-all">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-xl font-black flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
                      <AlertTriangle className="w-5 h-5 text-red-600" />
                    </div>
                    Urgency Analysis
                  </h2>
                  <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">AI Scoring Distribution</div>
                </div>
                <UrgencyChart needs={needs} />
              </section>

              <section className="bg-white/70 dark:bg-neutral-900/70 backdrop-blur-xl p-8 rounded-[2rem] border border-gray-100 dark:border-neutral-800 shadow-sm hover:shadow-xl hover:shadow-blue-500/5 transition-all">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-xl font-black flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                      <ClipboardList className="w-5 h-5 text-blue-600" />
                    </div>
                    Needs by Category
                  </h2>
                  <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">Resource Allocation</div>
                </div>
                <CategoryDistributionChart needs={needs} />
              </section>
            </div>

            {/* Assignments Table Section */}
            <section className="bg-white/70 dark:bg-neutral-900/70 backdrop-blur-xl p-8 rounded-[2.5rem] border border-gray-100 dark:border-neutral-800 shadow-sm overflow-hidden">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                  <h2 className="text-2xl font-black">Recent Operations</h2>
                  <p className="text-sm text-gray-500 font-medium">Real-time log of volunteer deployments and task status.</p>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                    <input 
                      type="text" 
                      placeholder="Search operations..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-11 pr-4 py-3 rounded-2xl bg-gray-50 dark:bg-neutral-800/50 border border-transparent focus:border-blue-500/50 focus:bg-white dark:focus:bg-neutral-800 outline-none transition-all w-full md:w-64 text-sm font-medium"
                    />
                  </div>
                  <button className="p-3 rounded-2xl bg-gray-50 dark:bg-neutral-800/50 text-gray-400 hover:text-blue-600 transition-colors">
                    <Filter className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto -mx-8 px-8">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 dark:border-neutral-800">
                      <th className="pb-4 pr-4">Volunteer</th>
                      <th className="pb-4 pr-4">Assigned Task</th>
                      <th className="pb-4 pr-4">Timeline</th>
                      <th className="pb-4 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 dark:divide-neutral-800/50">
                    {filteredAssignments.length > 0 ? (
                      filteredAssignments.map((assignment) => {
                        const volunteer = volunteers.find(v => v.id === assignment.volunteerId);
                        const need = needs.find(n => n.id === assignment.needId);
                        return (
                          <tr key={assignment.id} className="group hover:bg-blue-50/30 dark:hover:bg-blue-900/5 transition-colors">
                            <td className="py-5 pr-4">
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/40 dark:to-indigo-900/40 flex items-center justify-center text-blue-700 dark:text-blue-300 font-bold text-xs">
                                  {volunteer?.name?.charAt(0) || "U"}
                                </div>
                                <span className="font-bold text-sm">{volunteer?.name || "Unknown"}</span>
                              </div>
                            </td>
                            <td className="py-5 pr-4">
                              <div className="flex flex-col">
                                <span className="font-semibold text-sm line-clamp-1">{need?.title || "Unknown Need"}</span>
                                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">{need?.category || "Uncategorized"}</span>
                              </div>
                            </td>
                            <td className="py-5 pr-4">
                              <span className="text-xs text-gray-500 font-medium">
                                {assignment.createdAt ? new Date((assignment.createdAt as any).seconds * 1000).toLocaleDateString() : "Pending"}
                              </span>
                            </td>
                            <td className="py-5 text-right">
                              <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider ${
                                assignment.status === 'completed' 
                                  ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400' 
                                  : 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
                              }`}>
                                <div className={`w-1 h-1 rounded-full ${assignment.status === 'completed' ? 'bg-green-600' : 'bg-blue-600'}`} />
                                {assignment.status}
                              </span>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={4} className="py-20 text-center">
                          <div className="flex flex-col items-center gap-3 text-gray-400">
                            <Search className="w-10 h-10 opacity-20" />
                            <p className="font-medium">No matching operations found.</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              
              <button className="w-full mt-8 py-4 border-2 border-dashed border-gray-100 dark:border-neutral-800 rounded-2xl text-gray-400 hover:text-blue-600 hover:border-blue-100 dark:hover:border-blue-900/30 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-all font-bold text-sm flex items-center justify-center gap-2 group">
                View Full Operational Log
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            </section>
          </div>

          {/* Sidebar Info */}
          <div className="xl:col-span-4 space-y-8">
            <section className="bg-gradient-to-br from-blue-600 to-indigo-700 p-8 rounded-[2.5rem] text-white shadow-xl shadow-blue-500/20 overflow-hidden relative group">
              <div className="relative z-10">
                <div className="w-14 h-14 bg-white/20 backdrop-blur-lg rounded-2xl flex items-center justify-center mb-6">
                  <Activity className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-black mb-2">Coordination Status</h2>
                <p className="text-blue-100 text-sm font-medium mb-8 leading-relaxed">
                  Overall system efficiency is at 94%. Optimal volunteer distribution detected in primary response zones.
                </p>
                
                <div className="space-y-4">
                  <div className="p-5 bg-white/10 backdrop-blur-md rounded-[1.5rem] border border-white/10">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-bold uppercase tracking-widest text-blue-100">Response Speed</span>
                      <span className="text-xs font-black">Fast</span>
                    </div>
                    <div className="h-2 bg-blue-900/30 rounded-full overflow-hidden">
                      <div className="h-full bg-white rounded-full w-[85%]"></div>
                    </div>
                  </div>
                  <div className="p-5 bg-white/10 backdrop-blur-md rounded-[1.5rem] border border-white/10">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-bold uppercase tracking-widest text-blue-100">Resource Coverage</span>
                      <span className="text-xs font-black">High</span>
                    </div>
                    <div className="h-2 bg-blue-900/30 rounded-full overflow-hidden">
                      <div className="h-full bg-white rounded-full w-[72%]"></div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Decorative background circle */}
              <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
            </section>

            <section className="bg-white/70 dark:bg-neutral-900/70 backdrop-blur-xl p-8 rounded-[2.5rem] border border-gray-100 dark:border-neutral-800 shadow-sm">
              <h2 className="text-xl font-black mb-6">Quick Insights</h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 shrink-0 rounded-2xl bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center">
                    <AlertTriangle className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">Critical Surge</h4>
                    <p className="text-xs text-gray-500 font-medium leading-relaxed mt-1">High urgency needs in Medical category increased by 15% today.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 shrink-0 rounded-2xl bg-green-50 dark:bg-green-900/20 flex items-center justify-center">
                    <Users className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">Volunteer Growth</h4>
                    <p className="text-xs text-gray-500 font-medium leading-relaxed mt-1">New logistics experts joined from Kolkata central district.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 shrink-0 rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">Resolution Path</h4>
                    <p className="text-xs text-gray-500 font-medium leading-relaxed mt-1">Matching algorithm successfully reduced wait time to 12 mins.</p>
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
