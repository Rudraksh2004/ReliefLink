"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useFirestoreListener } from "@/hooks/useFirestoreListener";
import { CommunityNeed, CommunityNeedStatus } from "@/types/communityNeed";
import { BackgroundGlow } from "@/components/ui/BackgroundGlow";
import { 
  Plus, 
  Clock, 
  CheckCircle2, 
  MapPin, 
  Heart,
  MessageCircle,
  Zap,
  LayoutDashboard
} from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function CommunityUserDashboard() {
  const { user, userProfile } = useAuth();
  const { data: needs, loading } = useFirestoreListener<CommunityNeed>("community_needs");

  const myNeeds = needs.filter(n => n.reporterId === user?.uid);

  if (loading) {
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
            <div className="flex items-center gap-2 px-3 py-1 bg-pink-50 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400 rounded-full text-xs font-bold w-fit">
              <Heart className="w-3 h-3 fill-current" />
              COMMUNITY PORTAL
            </div>
            <h1 className="text-4xl font-black tracking-tight text-neutral-900 dark:text-white">My Relief Requests</h1>
            <p className="text-gray-500 dark:text-gray-400 font-medium">Track the status of your reported needs and connect with responders.</p>
          </div>
          
          <Link href="/community-needs">
            <Button size="lg" className="h-14 px-8 rounded-2xl shadow-xl shadow-blue-500/20 font-bold group">
              <Plus className="w-5 h-5 mr-2 transition-transform group-hover:rotate-90" />
              Report New Need
            </Button>
          </Link>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-8 rounded-[2.5rem] bg-white dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 shadow-sm">
            <h3 className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1">Active Requests</h3>
            <p className="text-4xl font-black">{myNeeds.filter(n => n.status !== CommunityNeedStatus.RESOLVED).length}</p>
          </div>
          <div className="p-8 rounded-[2.5rem] bg-white dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 shadow-sm">
            <h3 className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1">Impacted People</h3>
            <p className="text-4xl font-black">{myNeeds.reduce((acc, n) => acc + n.peopleAffected, 0)}</p>
          </div>
          <div className="p-8 rounded-[2.5rem] bg-white dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 shadow-sm">
            <h3 className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1">Resolved</h3>
            <p className="text-4xl font-black text-green-600">{myNeeds.filter(n => n.status === CommunityNeedStatus.RESOLVED).length}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {myNeeds.length > 0 ? (
            myNeeds.map((need) => (
              <div key={need.id} className="p-8 rounded-[2.5rem] bg-white/70 dark:bg-neutral-900/70 backdrop-blur-xl border border-gray-100 dark:border-neutral-800 shadow-sm hover:shadow-xl transition-all group">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600">
                      <Zap className="w-5 h-5 fill-current" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">{need.category}</span>
                      <span className="text-xs font-bold text-gray-500">{new Date((need.createdAt as any).seconds * 1000).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                    need.status === CommunityNeedStatus.RESOLVED 
                      ? 'bg-green-100 text-green-700' 
                      : need.status === CommunityNeedStatus.MATCHED 
                        ? 'bg-blue-100 text-blue-700 animate-pulse'
                        : 'bg-orange-100 text-orange-700'
                  }`}>
                    {need.status}
                  </span>
                </div>

                <h2 className="text-2xl font-black mb-3 group-hover:text-blue-600 transition-colors leading-tight">{need.title}</h2>
                
                <div className="flex items-center gap-4 text-sm text-gray-500 font-medium mb-6">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-blue-600" />
                    {need.locationName.split(',').slice(0, 2).join(',')}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-gray-100 dark:border-neutral-800">
                  <div className="flex items-center -space-x-2">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="w-8 h-8 rounded-full border-2 border-white dark:border-neutral-900 bg-gray-200 dark:bg-neutral-800 flex items-center justify-center text-[8px] font-black">
                        U{i}
                      </div>
                    ))}
                    <span className="pl-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      {need.status === CommunityNeedStatus.MATCHED ? 'Volunteer matched' : 'Waiting for match'}
                    </span>
                  </div>
                  <Button variant="ghost" className="p-2.5 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20">
                    <MessageCircle className="w-5 h-5 text-blue-600" />
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="lg:col-span-2 p-24 text-center bg-white/50 dark:bg-neutral-900/50 rounded-[3rem] border-2 border-dashed border-gray-200 dark:border-neutral-800">
              <div className="w-20 h-20 bg-gray-100 dark:bg-neutral-800 rounded-full flex items-center justify-center mx-auto mb-6">
                <LayoutDashboard className="w-10 h-10 text-gray-400" />
              </div>
              <h2 className="text-2xl font-black mb-2">You haven't reported any needs yet</h2>
              <p className="text-gray-500 font-medium max-w-xs mx-auto mb-8">Your reported community needs and their real-time statuses will appear here.</p>
              <Link href="/community-needs">
                <Button className="h-14 px-10 rounded-2xl font-bold">Report First Need</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
