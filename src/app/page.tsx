import Link from "next/link";
import { ArrowRight, LayoutDashboard, HeartHandshake } from "lucide-react";
import { BackgroundGlow } from "@/components/ui/BackgroundGlow";

export default function LandingPage() {
  return (
    <main className="relative flex flex-col items-center justify-center min-h-screen p-6 overflow-hidden bg-[#f8fafc] dark:bg-neutral-950">
      <BackgroundGlow />

      <div className="max-w-4xl w-full text-center space-y-10 relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/70 dark:bg-neutral-900/70 backdrop-blur-xl border border-gray-200 dark:border-neutral-800 rounded-full shadow-sm mx-auto">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
          </span>
          <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">v2.0 Beta Now Live</span>
        </div>

        <div className="space-y-4">
          <h1 className="text-6xl md:text-8xl font-[900] tracking-tighter text-neutral-900 dark:text-white">
            Relief<span className="text-blue-600">Link</span>
          </h1>
          <p className="max-w-2xl mx-auto text-xl md:text-2xl text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
            The AI-powered NGO coordination platform for <span className="text-neutral-900 dark:text-neutral-200 font-bold">real-time disaster relief</span> and intelligent volunteer matching.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
          <Link 
            href="/dashboard"
            className="group flex items-center gap-2 px-8 py-4 rounded-2xl bg-blue-600 text-white font-black transition-all shadow-xl shadow-blue-500/25 hover:bg-blue-700 hover:-translate-y-1 active:translate-y-0"
          >
            <LayoutDashboard className="w-5 h-5" />
            Launch Dashboard
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </Link>
          <Link 
            href="/community-needs"
            className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-white/70 dark:bg-neutral-900/70 backdrop-blur-xl border border-gray-200 dark:border-neutral-800 text-neutral-900 dark:text-white font-black transition-all hover:bg-gray-50 dark:hover:bg-neutral-800 hover:-translate-y-1 active:translate-y-0 shadow-sm"
          >
            <HeartHandshake className="w-5 h-5 text-blue-600" />
            Support Community
          </Link>
        </div>

        <div className="pt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 rounded-[2rem] bg-white/70 dark:bg-neutral-900/70 backdrop-blur-xl border border-gray-100 dark:border-neutral-800 shadow-sm">
            <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center mb-4 mx-auto">
              <span className="text-2xl font-black text-blue-600">01</span>
            </div>
            <h3 className="font-black text-lg mb-2 text-neutral-900 dark:text-white">AI Scoring</h3>
            <p className="text-sm text-gray-500 font-medium leading-relaxed">Predict urgency levels with machine learning models trained on historical disaster data.</p>
          </div>
          <div className="p-8 rounded-[2rem] bg-white/70 dark:bg-neutral-900/70 backdrop-blur-xl border border-gray-100 dark:border-neutral-800 shadow-sm">
            <div className="w-12 h-12 bg-green-50 dark:bg-green-900/20 rounded-2xl flex items-center justify-center mb-4 mx-auto">
              <span className="text-2xl font-black text-green-600">02</span>
            </div>
            <h3 className="font-black text-lg mb-2 text-neutral-900 dark:text-white">Smart Matching</h3>
            <p className="text-sm text-gray-500 font-medium leading-relaxed">Automatically assign the right volunteers based on skills, location, and availability.</p>
          </div>
          <div className="p-8 rounded-[2rem] bg-white/70 dark:bg-neutral-900/70 backdrop-blur-xl border border-gray-100 dark:border-neutral-800 shadow-sm">
            <div className="w-12 h-12 bg-orange-50 dark:bg-orange-900/20 rounded-2xl flex items-center justify-center mb-4 mx-auto">
              <span className="text-2xl font-black text-orange-600">03</span>
            </div>
            <h3 className="font-black text-lg mb-2 text-neutral-900 dark:text-white">Real-time Map</h3>
            <p className="text-sm text-gray-500 font-medium leading-relaxed">Visualize resource distribution and crisis hotspots in real-time across geographic regions.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
