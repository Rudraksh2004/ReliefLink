"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/Button";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { LogOut, LayoutDashboard, User as UserIcon, ShieldAlert, Menu, X } from "lucide-react";

export const Navbar = () => {
  const { user, userProfile, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);
  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-b border-gray-100 dark:border-neutral-800">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group" onClick={closeMobileMenu}>
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-blue-500/25 transition-transform group-hover:scale-110">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <span className="text-xl font-black tracking-tight text-neutral-900 dark:text-white">
            ReliefLink
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-6">
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
                <div className="flex flex-col items-end hidden lg:flex">
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

        {/* Mobile controls & toggle */}
        <div className="flex items-center gap-4 md:hidden">
          <ThemeToggle />
          <button
            onClick={toggleMobileMenu}
            className="p-2 rounded-xl bg-slate-100 dark:bg-neutral-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-neutral-700 transition-all"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer/Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 top-16 z-40 bg-slate-50/95 dark:bg-slate-900/95 backdrop-blur-xl md:hidden animate-fade-in flex flex-col justify-between p-6 overflow-y-auto border-t border-gray-100 dark:border-neutral-800 h-[calc(100vh-4rem)]">
          <div className="space-y-6">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Navigation</span>
            <div className="flex flex-col gap-4">
              <Link 
                href="/dashboard" 
                onClick={closeMobileMenu}
                className="text-lg font-black text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors py-2 border-b border-gray-100 dark:border-neutral-800/50"
              >
                Analytics Dashboard
              </Link>
              <Link 
                href="/community-needs" 
                onClick={closeMobileMenu}
                className="text-lg font-black text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors py-2 border-b border-gray-100 dark:border-neutral-800/50"
              >
                Community Needs
              </Link>
              <Link 
                href="/volunteers" 
                onClick={closeMobileMenu}
                className="text-lg font-black text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors py-2 border-b border-gray-100 dark:border-neutral-800/50"
              >
                Volunteers Directory
              </Link>
              {(userProfile?.role === "volunteer" || userProfile?.role === "admin") && (
                <Link 
                  href="/map" 
                  onClick={closeMobileMenu}
                  className="text-lg font-black text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors py-2 border-b border-gray-100 dark:border-neutral-800/50"
                >
                  Tactical Heatmap
                </Link>
              )}
            </div>
          </div>

          <div className="space-y-4 pt-6 border-t border-gray-100 dark:border-neutral-800">
            {user ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-slate-100/50 dark:bg-neutral-800/40 rounded-2xl">
                  <div className="w-10 h-10 rounded-xl bg-blue-600/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-black">
                    <UserIcon className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white">
                      {userProfile?.name || user.email?.split("@")[0]}
                    </span>
                    <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-tighter">
                      {userProfile?.role || "user"}
                    </span>
                  </div>
                </div>

                <Link 
                  href={
                    !userProfile ? "#" :
                    userProfile.role === "admin" ? "/admin" : 
                    userProfile.role === "volunteer" ? "/volunteer" : 
                    "/community"
                  }
                  onClick={closeMobileMenu}
                  className="block w-full"
                >
                  <Button className="w-full h-12 rounded-xl flex items-center justify-center gap-2 font-bold shadow-lg shadow-blue-500/20">
                    <LayoutDashboard className="w-4 h-4" />
                    Go to Portal Dashboard
                  </Button>
                </Link>

                <button 
                  onClick={() => {
                    logout();
                    closeMobileMenu();
                  }}
                  className="w-full h-12 rounded-xl border border-red-200 dark:border-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 font-bold transition-all flex items-center justify-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <Link href="/login" onClick={closeMobileMenu} className="w-full">
                  <Button variant="outline" className="w-full h-12 rounded-xl font-bold">
                    Login
                  </Button>
                </Link>
                <Link href="/signup" onClick={closeMobileMenu} className="w-full">
                  <Button className="w-full h-12 rounded-xl shadow-lg shadow-blue-500/25 font-bold">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
