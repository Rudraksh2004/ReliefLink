"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { Button } from "@/components/ui/Button";
import { BackgroundGlow } from "@/components/ui/BackgroundGlow";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { 
  UserPlus, 
  Mail, 
  Lock, 
  User as UserIcon, 
  Loader2, 
  Activity, 
  ShieldAlert, 
  Users, 
  Heart,
  ArrowRight,
  Sparkles,
  HelpCircle,
  ShieldCheck,
  Eye,
  EyeOff,
  Clock,
  Compass
} from "lucide-react";

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "community_user",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Simulated live activity feed to make the page feel dynamic and premium
  const [activities, setActivities] = useState([
    { id: 1, text: "45 Water Purifiers dispatched to Sector 4", time: "Just now", type: "dispatch" },
    { id: 2, text: "Medical Team Gamma deployed at East Shelter", time: "2m ago", type: "deploy" },
    { id: 3, text: "Severe weather alert logged in Coastal Zone", time: "5m ago", type: "alert" },
    { id: 4, text: "Route 12 cleared for supply transport trucks", time: "12m ago", type: "clear" },
  ]);

  useEffect(() => {
    const feedUpdates = [
      "10 blankets & shelter kits dispatched to Zone B",
      "Volunteer Group Alpha reached North Station",
      "Power grids restored at Community Center 3",
      "New medical support request logged from Sector 2",
      "Emergency food rations delivered to West Shelter",
    ];
    
    const types = ["dispatch", "deploy", "clear", "alert"];

    const interval = setInterval(() => {
      const randomText = feedUpdates[Math.floor(Math.random() * feedUpdates.length)];
      const randomType = types[Math.floor(Math.random() * types.length)];
      setActivities(prev => [
        { id: Date.now(), text: randomText, time: "Just now", type: randomType },
        ...prev.slice(0, 3)
      ]);
    }, 7000);

    return () => clearInterval(interval);
  }, []);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const user = userCredential.user;

      // Save user profile to Firestore
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name: formData.name,
        email: formData.email,
        role: formData.role,
        createdAt: serverTimestamp(),
      });

      // Redirect to Analytics Dashboard
      router.push("/dashboard");
    } catch (err: any) {
      console.error("Signup error:", err);
      setError(err.message || "Failed to create account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const selectRole = (role: string) => {
    setFormData(prev => ({ ...prev, role }));
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-slate-50 dark:bg-neutral-950 transition-colors duration-500 overflow-x-hidden font-sans">
      
      {/* LEFT PANE: Form Area */}
      <div className="lg:col-span-5 flex flex-col justify-between p-6 sm:p-12 relative overflow-hidden min-h-screen">
        <BackgroundGlow />
        
        {/* Top Header Bar */}
        <div className="relative z-10 flex items-center justify-between w-full mb-6">
          <div className="flex items-center space-x-3 group cursor-pointer">
            <div className="w-11 h-11 bg-gradient-to-tr from-blue-600 to-indigo-500 dark:from-blue-500 dark:to-indigo-400 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/30 group-hover:scale-105 transition-transform duration-300">
              <Heart className="w-5.5 h-5.5 fill-white/20 animate-pulse" />
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-neutral-900 dark:text-white">
                Relief<span className="bg-gradient-to-r from-blue-600 to-indigo-500 dark:from-blue-400 dark:to-indigo-300 bg-clip-text text-transparent">Link</span>
              </span>
              <p className="text-[10px] text-neutral-455 dark:text-neutral-500 font-bold tracking-wider uppercase">Coordination Hub</p>
            </div>
          </div>
          <ThemeToggle />
        </div>

        {/* Form Card */}
        <div className="w-full max-w-md mx-auto my-auto relative z-10 space-y-6">
          <div className="bg-white/80 dark:bg-neutral-900/60 backdrop-blur-xl p-8 rounded-[2.5rem] border border-slate-200/60 dark:border-neutral-800/40 shadow-[0_20px_50px_rgba(8,112,184,0.04)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.2)] hover:border-slate-200 dark:hover:border-neutral-855/65 transition-all duration-300">
            <div className="mb-6">
              <h1 className="text-2xl font-black tracking-tight text-neutral-900 dark:text-white flex items-center gap-2">
                Join Network <Sparkles className="w-5 h-5 text-blue-500 animate-bounce" />
              </h1>
              <p className="text-neutral-500 dark:text-neutral-400 text-sm mt-2 font-medium">
                Create an account to start contributing or receiving assistance.
              </p>
            </div>

            <form onSubmit={handleSignup} className="space-y-4">
              <div className="space-y-3.5">
                
                {/* Full Name */}
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 pl-1">
                    Full Name
                  </label>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none">
                      <UserIcon className="w-5 h-5 text-neutral-450 dark:text-neutral-500 group-focus-within:text-blue-500 dark:group-focus-within:text-blue-400 transition-colors" />
                    </div>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      className="w-full pl-12 pr-4 py-3 rounded-2xl bg-slate-100/50 dark:bg-neutral-800/30 border border-slate-200/60 dark:border-neutral-800/30 focus:border-blue-500 dark:focus:border-blue-500/60 focus:bg-white dark:focus:bg-neutral-900/90 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all text-sm font-semibold text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-600"
                    />
                  </div>
                </div>

                {/* Email Address */}
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 pl-1">
                    Email Address
                  </label>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none">
                      <Mail className="w-5 h-5 text-neutral-450 dark:text-neutral-500 group-focus-within:text-blue-500 dark:group-focus-within:text-blue-400 transition-colors" />
                    </div>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="john@example.com"
                      className="w-full pl-12 pr-4 py-3 rounded-2xl bg-slate-100/50 dark:bg-neutral-800/30 border border-slate-200/60 dark:border-neutral-800/30 focus:border-blue-500 dark:focus:border-blue-500/60 focus:bg-white dark:focus:bg-neutral-900/90 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all text-sm font-semibold text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-600"
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 pl-1">
                    Password
                  </label>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none">
                      <Lock className="w-5 h-5 text-neutral-450 dark:text-neutral-500 group-focus-within:text-blue-500 dark:group-focus-within:text-blue-400 transition-colors" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="w-full pl-12 pr-12 py-3 rounded-2xl bg-slate-100/50 dark:bg-neutral-800/30 border border-slate-200/60 dark:border-neutral-800/30 focus:border-blue-500 dark:focus:border-blue-500/60 focus:bg-white dark:focus:bg-neutral-900/90 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all text-sm font-semibold text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-600"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-450 dark:text-neutral-555 hover:text-neutral-805 dark:hover:text-neutral-350 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Role selection */}
                <div className="space-y-2">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 pl-1">
                    Select Your Role
                  </label>
                  <div className="grid grid-cols-2 gap-3.5">
                    
                    {/* Role Card 1 */}
                    <button
                      type="button"
                      onClick={() => selectRole("community_user")}
                      className={`flex flex-col items-start p-4.5 rounded-2xl border text-left transition-all cursor-pointer ${
                        formData.role === "community_user"
                          ? "border-blue-600 dark:border-blue-500 bg-blue-500/5 text-blue-600 dark:text-blue-400 shadow-[0_8px_20px_rgba(37,99,235,0.08)]"
                          : "border-slate-200/50 dark:border-neutral-800/50 hover:border-slate-300 dark:hover:border-neutral-700 text-neutral-500 dark:text-neutral-400 bg-transparent"
                      }`}
                    >
                      <HelpCircle className="w-5 h-5 mb-2.5" />
                      <span className="text-xs font-bold block">Community Member</span>
                      <span className="text-[10px] opacity-75 leading-snug mt-1.5 block font-medium">Request supply aid & file alerts.</span>
                    </button>

                    {/* Role Card 2 */}
                    <button
                      type="button"
                      onClick={() => selectRole("volunteer")}
                      className={`flex flex-col items-start p-4.5 rounded-2xl border text-left transition-all cursor-pointer ${
                        formData.role === "volunteer"
                          ? "border-blue-600 dark:border-blue-500 bg-blue-500/5 text-blue-600 dark:text-blue-400 shadow-[0_8px_20px_rgba(37,99,235,0.08)]"
                          : "border-slate-200/50 dark:border-neutral-800/50 hover:border-slate-300 dark:hover:border-neutral-700 text-neutral-500 dark:text-neutral-400 bg-transparent"
                      }`}
                    >
                      <ShieldCheck className="w-5 h-5 mb-2.5" />
                      <span className="text-xs font-bold block">Field Volunteer</span>
                      <span className="text-[10px] opacity-75 leading-snug mt-1.5 block font-medium">Fulfill needs & coordinate drops.</span>
                    </button>

                  </div>
                </div>
              </div>

              {error && (
                <div className="p-4 bg-red-500/8 border border-red-500/20 rounded-2xl text-red-655 dark:text-red-400 text-xs font-bold flex items-center gap-3">
                  <ShieldAlert className="w-5 h-5 shrink-0" />
                  <span className="line-clamp-2">{error}</span>
                </div>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-13 text-sm rounded-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 dark:from-blue-500 dark:to-indigo-500 dark:hover:from-blue-600 dark:hover:to-indigo-600 text-white shadow-lg shadow-blue-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Registering Account...
                  </>
                ) : (
                  <>
                    Create Account
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-neutral-550 dark:text-neutral-400 font-medium">
              Already have an account?{" "}
              <Link href="/login" className="text-blue-600 dark:text-blue-400 font-bold hover:underline underline-offset-4 decoration-2">
                Sign in
              </Link>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="relative z-10 text-center text-xs text-neutral-400 dark:text-neutral-600 mt-8">
          <p>© {new Date().getFullYear()} ReliefLink. Secure Verification Node.</p>
        </div>
      </div>

      {/* RIGHT PANE: Interactive Visual Dashboard / Info Hub */}
      <div className="hidden lg:col-span-7 lg:flex flex-col justify-between p-12 relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-neutral-950 text-white border-l border-slate-200/10 dark:border-neutral-900/60 shadow-[inset_1px_0_0_rgba(255,255,255,0.05)]">
        
        {/* Dynamic Abstract Tech Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:36px_36px]"></div>
        <div className="absolute top-[-10%] right-[-10%] w-[550px] h-[550px] bg-blue-500/15 rounded-full blur-[130px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[450px] h-[450px] bg-indigo-500/10 rounded-full blur-[130px]" style={{ animationDelay: '2s' }}></div>
        
        {/* Upper Visual Feed Status Bar */}
        <div className="relative z-10 flex justify-between items-center">
          <div className="flex items-center space-x-2.5 bg-white/5 border border-white/10 px-4 py-2 rounded-full text-xs font-semibold backdrop-blur-md shadow-inner">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
            <span className="text-neutral-200">Global Network Sync Active</span>
          </div>
          <div className="flex items-center space-x-2 text-xs text-neutral-400 font-semibold bg-white/5 border border-white/10 px-3 py-2 rounded-lg backdrop-blur-md">
            <Compass className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '8s' }} />
            <span>Ver. 2.4.5</span>
          </div>
        </div>

        {/* Hero Copy & Teaser Cards */}
        <div className="relative z-10 max-w-xl space-y-10 my-auto">
          <div className="space-y-5">
            <h2 className="text-5xl font-black tracking-tight leading-[1.15]">
              Coordinate Relief.<br />
              <span className="bg-gradient-to-r from-blue-400 via-indigo-350 to-emerald-300 bg-clip-text text-transparent drop-shadow-sm">
                Empower Communities.
              </span>
            </h2>
            <p className="text-neutral-305 dark:text-neutral-300 text-sm leading-relaxed max-w-lg font-medium">
              ReliefLink bridges resource gaps in critical times. Access live intelligence, map local support networks, and deploy humanitarian responses seamlessly across our global volunteer grid.
            </p>
          </div>

          {/* Simulated Live Feed Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            
            {/* Status Card 1: Active Supply */}
            <div className="bg-white/5 border border-white/10 hover:border-blue-500/30 backdrop-blur-lg p-6 rounded-3xl space-y-4 hover:translate-y-[-4px] transition-all duration-300 group shadow-lg">
              <div className="flex items-center justify-between">
                <div className="p-3 bg-blue-500/15 rounded-2xl text-blue-400 group-hover:scale-110 transition-transform">
                  <Activity className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-400 bg-emerald-400/10 px-2.5 py-1 rounded-full">
                  Live Dispatch
                </span>
              </div>
              <div>
                <p className="text-xs text-neutral-400 font-semibold">Active Supply Dispatches</p>
                <p className="text-3xl font-black tracking-tight mt-1 text-white">
                  412 <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest pl-1">kits / hr</span>
                </p>
              </div>
              <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full w-[78%] rounded-full animate-pulse"></div>
              </div>
            </div>

            {/* Status Card 2: Volunteers Deployed */}
            <div className="bg-white/5 border border-white/10 hover:border-indigo-500/30 backdrop-blur-lg p-6 rounded-3xl space-y-4 hover:translate-y-[-4px] transition-all duration-300 group shadow-lg">
              <div className="flex items-center justify-between">
                <div className="p-3 bg-indigo-500/15 rounded-2xl text-indigo-400 group-hover:scale-110 transition-transform">
                  <Users className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-neutral-300 bg-white/10 px-2.5 py-1 rounded-full">
                  Deployed
                </span>
              </div>
              <div>
                <p className="text-xs text-neutral-400 font-semibold">Volunteers on Field</p>
                <p className="text-3xl font-black tracking-tight mt-1 text-white">
                  1,824 <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest pl-1">Active</span>
                </p>
              </div>
              <div className="flex items-center justify-between mt-1">
                <div className="flex -space-x-2 overflow-hidden">
                  <div className="inline-flex h-6.5 w-6.5 rounded-full ring-2 ring-indigo-955 bg-neutral-800 items-center justify-center text-[8px] font-bold">JD</div>
                  <div className="inline-flex h-6.5 w-6.5 rounded-full ring-2 ring-indigo-955 bg-neutral-700 items-center justify-center text-[8px] font-bold">AS</div>
                  <div className="inline-flex h-6.5 w-6.5 rounded-full ring-2 ring-indigo-950 bg-neutral-600 items-center justify-center text-[8px] font-bold">MK</div>
                  <div className="inline-flex h-6.5 w-6.5 rounded-full ring-2 ring-indigo-955 bg-neutral-550 items-center justify-center text-[8px] font-bold">+24</div>
                </div>
                <span className="text-[10px] font-bold text-neutral-400">12 stations</span>
              </div>
            </div>

          </div>

          {/* Real-time Dynamic Activity Feed */}
          <div className="bg-white/5 border border-white/10 backdrop-blur-lg p-6 rounded-3xl space-y-4 shadow-lg">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <h3 className="text-sm font-bold text-neutral-100 flex items-center gap-2">
                <Activity className="w-4 h-4 text-blue-400 animate-pulse" /> Live Activity Feed
              </h3>
              <span className="text-[10px] text-neutral-400 font-bold flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> Real-time
              </span>
            </div>
            
            <div className="space-y-3.5">
              {activities.map((act) => (
                <div key={act.id} className="flex items-start justify-between text-xs bg-white/2 p-3 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/5">
                  <div className="flex items-center gap-2.5">
                    <span className={`w-2 h-2 rounded-full shrink-0 ${
                      act.type === "dispatch" ? "bg-blue-400" :
                      act.type === "deploy" ? "bg-indigo-400" :
                      act.type === "alert" ? "bg-amber-400" : "bg-emerald-400"
                    }`}></span>
                    <span className="text-neutral-300 font-medium">{act.text}</span>
                  </div>
                  <span className="text-neutral-500 font-bold shrink-0 text-[10px]">{act.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="relative z-10 flex justify-between items-center text-xs text-neutral-455">
          <p>© 2026 ReliefLink Core. Secure end-to-end coordination system.</p>
          <div className="flex space-x-5 font-semibold">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
          </div>
        </div>

      </div>

    </div>
  );
}
