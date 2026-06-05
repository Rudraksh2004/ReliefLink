import React from "react";
import Link from "next/link";
import { ShieldAlert, Heart, Activity } from "lucide-react";

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
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a href="#" className="p-2.5 rounded-xl bg-slate-100 dark:bg-neutral-800 text-slate-500 hover:text-blue-500 dark:hover:text-blue-400 hover:scale-105 transition-all">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="p-2.5 rounded-xl bg-slate-100 dark:bg-neutral-800 text-slate-500 hover:text-blue-500 dark:hover:text-blue-400 hover:scale-105 transition-all">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
                </svg>
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
