"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useFirestoreListener } from "@/hooks/useFirestoreListener";
import { Assignment, AssignmentStatus } from "@/types/assignment";
import { CommunityNeed, CommunityNeedStatus } from "@/types/communityNeed";
import { updateDocument } from "@/lib/firestore";
import { BackgroundGlow } from "@/components/ui/BackgroundGlow";
import { 
  CheckCircle2, 
  Clock, 
  MapPin, 
  AlertTriangle,
  User,
  ArrowUpRight,
  ClipboardCheck,
  Zap,
  Plus
} from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function VolunteerDashboard() {
  const { user } = useAuth();
  const { data: assignments, loading: loadingAssignments } = useFirestoreListener<Assignment>(
    "assignments", 
    // Filter logic is handled in the listener if possible, but here we filter on client for simplicity in prototype
  );
  const { data: needs } = useFirestoreListener<CommunityNeed>("community_needs");

  const myAssignments = assignments.filter(a => a.volunteerId === user?.uid);

  const handleUpdateStatus = async (assignmentId: string, needId: string, status: AssignmentStatus) => {
    try {
      await updateDocument("assignments", assignmentId, { status });
      if (status === AssignmentStatus.COMPLETED) {
        await updateDocument("community_needs", needId, { status: CommunityNeedStatus.RESOLVED });
      }
    } catch (err) {
      console.error("Error updating task status:", err);
    }
  };

  if (loadingAssignments) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Clock className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-neutral-950 px-6 py-10 relative overflow-hidden">
      <BackgroundGlow />
      
      <div className="max-w-7xl mx-auto space-y-10 relative z-10">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full text-xs font-bold w-fit">
              <Zap className="w-3 h-3 fill-current" />
              VOLUNTEER PORTAL
            </div>
            <h1 className="text-4xl font-black tracking-tight text-neutral-900 dark:text-white">Active Assignments</h1>
            <p className="text-gray-500 dark:text-gray-400 font-medium">Manage your assigned tasks and update relief progress.</p>
          </div>

          <Link 
            href="/community-needs"
            className="inline-flex items-center justify-center h-14 px-8 rounded-2xl bg-blue-600 text-white shadow-xl shadow-blue-500/20 font-bold hover:bg-blue-700 transition-all group"
          >
            <Plus className="w-5 h-5 mr-2 transition-transform group-hover:rotate-90" />
            Report New Need
          </Link>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-8 rounded-[2.5rem] bg-white dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 shadow-sm">
            <h3 className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1">Total Tasks</h3>
            <p className="text-4xl font-black">{myAssignments.length}</p>
          </div>
          <div className="p-8 rounded-[2.5rem] bg-white dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 shadow-sm">
            <h3 className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1">Pending</h3>
            <p className="text-4xl font-black">{myAssignments.filter(a => a.status !== 'completed').length}</p>
          </div>
          <div className="p-8 rounded-[2.5rem] bg-white dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 shadow-sm">
            <h3 className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1">Completed</h3>
            <p className="text-4xl font-black text-green-600">{myAssignments.filter(a => a.status === 'completed').length}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {myAssignments.length > 0 ? (
            myAssignments.map((assignment) => {
              const need = needs.find(n => n.id === assignment.needId);
              return (
                <div key={assignment.id} className="p-8 rounded-[2.5rem] bg-white/70 dark:bg-neutral-900/70 backdrop-blur-xl border border-gray-100 dark:border-neutral-800 shadow-sm hover:shadow-xl transition-all group">
                  <div className="flex flex-col md:flex-row justify-between gap-6">
                    <div className="space-y-4 flex-1">
                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          need?.urgencyScore && need.urgencyScore > 7 
                            ? 'bg-red-100 text-red-700' 
                            : 'bg-orange-100 text-orange-700'
                        }`}>
                          Urgency: {need?.urgencyScore?.toFixed(1) || "N/A"}
                        </span>
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {assignment.status}
                        </span>
                      </div>
                      <h2 className="text-2xl font-black group-hover:text-blue-600 transition-colors">{need?.title || "Untitled Need"}</h2>
                      <div className="flex items-center gap-4 text-sm text-gray-500 font-medium">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-4 h-4 text-blue-600" />
                          {need?.locationName || "Unknown Location"}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <User className="w-4 h-4 text-blue-600" />
                          {need?.reporterName || "Anonymous Reporter"}
                        </div>
                      </div>
                      <p className="text-gray-500 text-sm leading-relaxed line-clamp-2">{need?.description}</p>
                      {need?.imageUrl && (
                        <div className="mt-4 rounded-2xl overflow-hidden h-40 border border-gray-100 dark:border-neutral-800">
                          <img src={need.imageUrl} alt={need.title} className="w-full h-full object-cover" />
                        </div>
                      )}
                    </div>

                    <div className="flex flex-row md:flex-col justify-end gap-3 min-w-[200px]">
                      {assignment.status !== 'completed' && (
                        <Button 
                          onClick={() => handleUpdateStatus(assignment.id!, assignment.needId, AssignmentStatus.COMPLETED)}
                          className="w-full bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-500/20"
                        >
                          <ClipboardCheck className="w-4 h-4 mr-2" />
                          Mark Completed
                        </Button>
                      )}
                      <Button variant="outline" className="w-full border-gray-200 dark:border-neutral-800">
                        View Details
                        <ArrowUpRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-20 text-center bg-white/50 dark:bg-neutral-900/50 rounded-[3rem] border-2 border-dashed border-gray-200 dark:border-neutral-800">
              <div className="w-20 h-20 bg-gray-100 dark:bg-neutral-800 rounded-full flex items-center justify-center mx-auto mb-6">
                <ClipboardCheck className="w-10 h-10 text-gray-400" />
              </div>
              <h2 className="text-2xl font-black mb-2">No active assignments</h2>
              <p className="text-gray-500 font-medium">New tasks will appear here when the AI matching engine assigns them to you.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
