"use client";

import React from "react";
import Link from "next/link";
import { ShieldAlert, Github, Twitter, Linkedin, Heart, Activity } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="relative z-10 bg-slate-50/80 dark:bg-slate-950/80 backdrop-blur-xl border-t border-slate-200/50 dark:border-neutral-900/50">
      {/* Decorative top gradient glow */}
      <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50"></div>

      <div className="max-w-7xl mx-auto px-6 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 pb-12 border-b border-slate-200/50 dark:border-neutral-900/50">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-6">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white shadow-md shadow-blue-500/20 transition-transform group-hover:scale-105">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <span className="text-xl font-black tracking-tight text-neutral-900 dark:text-white">
                ReliefLink
              </span>
            </Link>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold leading-relaxed max-w-sm">
              Next-generation AI disaster coordination platform bridging the gap between critical community needs and volunteers using semantic precision.
            </p>
            {/* System Status Indicator */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/20">
              <Activity className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
              <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
                All AI Systems Active
              </span>
            </div>
          </div>

          {/* Navigation Columns */}
          <div className="space-y-4">
            <h4 className="text-[11px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
              Platform
            </h4>
            <ul className="space-y-3">
              <li>
                <Link href="/dashboard" className="text-xs font-bold text-slate-500 hover:text-blue-500 dark:hover:text-blue-400 transition-colors">
                  Live Analytics
                </Link>
              </li>
              <li>
                <Link href="/community-needs" className="text-xs font-bold text-slate-500 hover:text-blue-500 dark:hover:text-blue-400 transition-colors">
                  Report a Need
                </Link>
              </li>
              <li>
                <Link href="/volunteers" className="text-xs font-bold text-slate-500 hover:text-blue-500 dark:hover:text-blue-400 transition-colors">
                  Volunteer Directory
                </Link>
              </li>
              <li>
                <Link href="/map" className="text-xs font-bold text-slate-500 hover:text-blue-500 dark:hover:text-blue-400 transition-colors">
                  Tactical Heatmap
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-[11px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
              Resources
            </h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-xs font-bold text-slate-500 hover:text-blue-500 dark:hover:text-blue-400 transition-colors">
                  Emergency Protocols
                </a>
              </li>
              <li>
                <a href="#" className="text-xs font-bold text-slate-500 hover:text-blue-500 dark:hover:text-blue-400 transition-colors">
                  Platform Documentation
                </a>
              </li>
              <li>
                <a href="#" className="text-xs font-bold text-slate-500 hover:text-blue-500 dark:hover:text-blue-400 transition-colors">
                  API Integrations
                </a>
              </li>
              <li>
                <a href="#" className="text-xs font-bold text-slate-500 hover:text-blue-500 dark:hover:text-blue-400 transition-colors">
                  Help Center
                </a>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-[11px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
              Organization
            </h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-xs font-bold text-slate-500 hover:text-blue-500 dark:hover:text-blue-400 transition-colors">
                  About ReliefLink
                </a>
              </li>
              <li>
                <a href="#" className="text-xs font-bold text-slate-500 hover:text-blue-500 dark:hover:text-blue-400 transition-colors">
                  Partners & NGOs
                </a>
              </li>
              <li>
                <a href="#" className="text-xs font-bold text-slate-500 hover:text-blue-500 dark:hover:text-blue-400 transition-colors">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="text-xs font-bold text-slate-500 hover:text-blue-500 dark:hover:text-blue-400 transition-colors">
                  Contact Support
                </a>
              </li>
            </ul>
          </div>

          {/* Socials / Action */}
          <div className="space-y-4">
            <h4 className="text-[11px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
              Connect
            </h4>
            <div className="flex gap-3">
              <a href="#" className="p-2.5 rounded-xl bg-slate-100 dark:bg-neutral-800 text-slate-500 hover:text-blue-500 dark:hover:text-blue-400 hover:scale-105 transition-all">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="p-2.5 rounded-xl bg-slate-100 dark:bg-neutral-800 text-slate-500 hover:text-blue-500 dark:hover:text-blue-400 hover:scale-105 transition-all">
                <Github className="w-4 h-4" />
              </a>
              <a href="#" className="p-2.5 rounded-xl bg-slate-100 dark:bg-neutral-800 text-slate-500 hover:text-blue-500 dark:hover:text-blue-400 hover:scale-105 transition-all">
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold leading-relaxed">
              Empowering relief organizations worldwide with tactical insight.
            </p>
          </div>

        </div>

        {/* Lower Footer */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-8">
          <div className="text-xs text-slate-400 font-bold flex items-center gap-1">
            <span>© 2026 ReliefLink Emergency Operations. Built with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 animate-pulse" />
            <span>for resilient communities.</span>
          </div>
          <div className="flex gap-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">
            <a href="#" className="hover:text-blue-500 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-blue-500 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-blue-500 transition-colors">Security Audit</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
