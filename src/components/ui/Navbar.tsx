"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/Button";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { LogOut, LayoutDashboard, User as UserIcon, ShieldAlert } from "lucide-react";

export const Navbar = () => {
  const { user, userProfile, logout } = useAuth();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-b border-gray-100 dark:border-neutral-800">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-blue-500/25 transition-transform group-hover:scale-110">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <span className="text-xl font-black tracking-tight text-neutral-900 dark:text-white">
            ReliefLink
          </span>
        </Link>

        <div className="flex items-center gap-6">
          <Link 
            href="/dashboard" 
            className="text-sm font-bold text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            Analytics
          </Link>
          <Link 
            href="/community-needs" 
            className="text-sm font-bold text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            Needs
          </Link>
          <Link 
            href="/volunteers" 
            className="text-sm font-bold text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            Volunteers
          </Link>
          {(userProfile?.role === "volunteer" || userProfile?.role === "admin") && (
            <Link 
              href="/map" 
              className="text-sm font-bold text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Map
            </Link>
          )}

          <div className="h-4 w-[1px] bg-gray-200 dark:bg-neutral-800" />
          
          <ThemeToggle />

          {user ? (
            <div className="flex items-center gap-4">
              <Link 
                href={
                  !userProfile ? "#" :
                  userProfile.role === "admin" ? "/admin" : 
                  userProfile.role === "volunteer" ? "/volunteer" : 
                  "/community"
                }
                className={!userProfile ? "cursor-wait opacity-50" : ""}
              >
                <Button variant="outline" className="h-10 px-4 rounded-xl flex items-center gap-2">
                  <LayoutDashboard className="w-4 h-4" />
                  <span className="hidden sm:inline">
                    {!userProfile ? "Loading..." :
                     userProfile.role === "admin" ? "Admin Dashboard" : 
                     userProfile.role === "volunteer" ? "Volunteer Dashboard" : 
                     "User Dashboard"}
                  </span>
                </Button>
              </Link>
              
              <div className="flex items-center gap-3 pl-2">
                <div className="flex flex-col items-end hidden md:flex">
                  <span className="text-xs font-black uppercase tracking-widest text-neutral-900 dark:text-white">
                    {userProfile?.name || user.email?.split("@")[0]}
                  </span>
                  <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-tighter">
                    {userProfile?.role || "user"}
                  </span>
                </div>
                <button 
                  onClick={logout}
                  className="p-2.5 rounded-xl bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/20 transition-all"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link href="/login">
                <Button variant="ghost" className="h-10 px-5 font-bold">
                  Login
                </Button>
              </Link>
              <Link href="/signup">
                <Button className="h-10 px-5 rounded-xl shadow-lg shadow-blue-500/20 font-bold">
                  Sign Up
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
