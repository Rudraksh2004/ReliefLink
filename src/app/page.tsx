"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { BackgroundGlow } from "@/components/ui/BackgroundGlow";
import { 
  ShieldAlert, 
  Zap, 
  Users, 
  BarChart3, 
  Map as MapIcon, 
  ArrowRight,
  CheckCircle2,
  HeartHandshake
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-white dark:bg-neutral-950 selection:bg-blue-100 dark:selection:bg-blue-900/30">
      <BackgroundGlow />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto text-center space-y-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-sm font-bold border border-blue-100 dark:border-blue-800 animate-fade-in">
            <Zap className="w-4 h-4 fill-current" />
            <span>Next-Gen Disaster Relief Platform</span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-neutral-900 dark:text-white leading-[1.1]">
            Coordinating Relief with <br />
            <span className="bg-gradient-to-br from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Intelligent Precision.
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-xl text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
            ReliefLink is an AI-powered NGO coordination platform that connects community needs with volunteers using real-time urgency scoring and semantic matching.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link href="/signup">
              <Button size="lg" className="h-16 px-10 text-lg rounded-2xl shadow-2xl shadow-blue-500/25 font-bold group">
                Get Started
                <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link href="/community-needs">
              <Button size="lg" variant="outline" className="h-16 px-10 text-lg rounded-2xl font-bold bg-white/50 dark:bg-neutral-900/50 backdrop-blur-xl">
                Report a Need
              </Button>
            </Link>
          </div>

          <div className="pt-20 grid grid-cols-2 md:grid-cols-4 gap-8 opacity-50">
            <div className="flex flex-col items-center gap-2">
              <span className="text-3xl font-black text-neutral-900 dark:text-white">94%</span>
              <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Match Accuracy</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <span className="text-3xl font-black text-neutral-900 dark:text-white">&lt;12m</span>
              <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Response Time</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <span className="text-3xl font-black text-neutral-900 dark:text-white">10k+</span>
              <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Active Responders</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <span className="text-3xl font-black text-neutral-900 dark:text-white">24/7</span>
              <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Live Coordination</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 px-6 relative z-10">
        <div className="max-w-7xl mx-auto space-y-20">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-black text-neutral-900 dark:text-white tracking-tight">Powerful AI Capabilities</h2>
            <p className="text-gray-500 dark:text-gray-400 font-medium">Modern tools for modern disaster response.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<ShieldAlert className="w-8 h-8 text-red-600" />}
              title="Urgency Scoring"
              description="Proprietary AI models analyze reports in real-time to calculate mission-critical urgency scores."
            />
            <FeatureCard 
              icon={<Users className="w-8 h-8 text-blue-600" />}
              title="Smart Matching"
              description="Semantic skill matching connects the right volunteers to the right needs based on expertise."
            />
            <FeatureCard 
              icon={<BarChart3 className="w-8 h-8 text-indigo-600" />}
              title="Live Analytics"
              description="Visualize the entire relief operation with real-time dashboards and predictive insights."
            />
            <FeatureCard 
              icon={<MapIcon className="w-8 h-8 text-green-600" />}
              title="Priority Heatmaps"
              description="Identify high-priority zones instantly with dynamic regional priority mapping."
            />
            <FeatureCard 
              icon={<Zap className="w-8 h-8 text-amber-600" />}
              title="Rapid Reporting"
              description="Public users can report community needs instantly with automatic location detection."
            />
            <FeatureCard 
              icon={<HeartHandshake className="w-8 h-8 text-pink-600" />}
              title="NGO Collaboration"
              description="Seamlessly bridge the gap between community members, volunteers, and NGOs."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6">
        <div className="max-w-5xl mx-auto rounded-[3rem] bg-gradient-to-br from-blue-600 to-indigo-800 p-12 md:p-20 text-center text-white relative overflow-hidden shadow-2xl shadow-blue-500/40">
          <div className="relative z-10 space-y-8">
            <h2 className="text-4xl md:text-6xl font-black tracking-tight">Ready to make a difference?</h2>
            <p className="text-blue-100 text-lg max-w-xl mx-auto font-medium">
              Join thousands of volunteers and community members working together to build more resilient regions.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/signup">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 h-16 px-10 text-lg rounded-2xl font-bold shadow-xl">
                  Sign Up Now
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline" className="border-white/20 hover:bg-white/10 h-16 px-10 text-lg rounded-2xl font-bold backdrop-blur-md">
                  Volunteer Login
                </Button>
              </Link>
            </div>
          </div>
          
          {/* Decorative background circle */}
          <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute -left-20 -top-20 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl"></div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-6 border-t border-gray-100 dark:border-neutral-900">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center text-[10px] text-white font-bold">RL</div>
            <span className="font-black tracking-tighter">ReliefLink</span>
          </div>
          <div className="flex gap-8 text-sm font-bold text-gray-400 uppercase tracking-widest">
            <a href="#" className="hover:text-blue-600 transition-colors">Platform</a>
            <a href="#" className="hover:text-blue-600 transition-colors">Resources</a>
            <a href="#" className="hover:text-blue-600 transition-colors">About</a>
            <a href="#" className="hover:text-blue-600 transition-colors">Contact</a>
          </div>
          <div className="text-xs text-gray-400 font-medium">
            © 2026 ReliefLink AI platform. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="p-8 rounded-[2.5rem] bg-white dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 shadow-sm hover:shadow-xl hover:shadow-blue-500/5 transition-all hover:-translate-y-1 group">
      <div className="w-16 h-16 rounded-2xl bg-gray-50 dark:bg-neutral-800 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-xl font-black mb-3 text-neutral-900 dark:text-white">{title}</h3>
      <p className="text-gray-500 dark:text-gray-400 text-sm font-medium leading-relaxed">
        {description}
      </p>
    </div>
  );
}
