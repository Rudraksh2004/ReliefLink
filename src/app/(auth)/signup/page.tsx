"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { Button } from "@/components/ui/Button";
import { BackgroundGlow } from "@/components/ui/BackgroundGlow";
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
  ShieldCheck
} from "lucide-react";

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "community_user",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

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
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-white dark:bg-neutral-950 transition-colors duration-300">
      
      {/* LEFT PANE: Form Area */}
      <div className="lg:col-span-5 flex items-center justify-center p-6 sm:p-12 md:p-16 relative overflow-hidden">
        <BackgroundGlow />
        
        <div className="w-full max-w-md relative z-10 space-y-6">
          
          {/* Header & Logo */}
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-600 dark:bg-blue-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-500/25">
                <Heart className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <span className="text-2xl font-black tracking-tight text-neutral-950 dark:text-white">
                  Relief<span className="text-blue-600 dark:text-blue-500">Link</span>
                </span>
                <p className="text-xs text-neutral-400 font-semibold tracking-wider uppercase">Coordination Hub</p>
              </div>
            </div>
          </div>

          <div className="bg-white/60 dark:bg-neutral-900/60 backdrop-blur-xl p-8 rounded-[2rem] border border-neutral-200/50 dark:border-neutral-800/50 shadow-xl shadow-neutral-100/40 dark:shadow-none">
            <div className="mb-6">
              <h1 className="text-2xl font-black tracking-tight text-neutral-950 dark:text-white flex items-center gap-2">
                Join Network <Sparkles className="w-5 h-5 text-blue-500" />
              </h1>
              <p className="text-neutral-500 dark:text-neutral-400 text-sm mt-1">
                Create an account to start contributing or receiving assistance.
              </p>
            </div>

            <form onSubmit={handleSignup} className="space-y-4">
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 mb-1.5 pl-1">
                    Full Name
                  </label>
                  <div className="relative group">
                    <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400 group-focus-within:text-blue-600 dark:group-focus-within:text-blue-500 transition-colors" />
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-neutral-100/50 dark:bg-neutral-800/50 border border-neutral-200/30 dark:border-neutral-700/30 focus:border-blue-500/50 dark:focus:border-blue-500/50 focus:bg-white dark:focus:bg-neutral-900 outline-none transition-all text-sm font-medium text-neutral-900 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 mb-1.5 pl-1">
                    Email Address
                  </label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400 group-focus-within:text-blue-600 dark:group-focus-within:text-blue-500 transition-colors" />
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="john@example.com"
                      className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-neutral-100/50 dark:bg-neutral-800/50 border border-neutral-200/30 dark:border-neutral-700/30 focus:border-blue-500/50 dark:focus:border-blue-500/50 focus:bg-white dark:focus:bg-neutral-900 outline-none transition-all text-sm font-medium text-neutral-900 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 mb-1.5 pl-1">
                    Password
                  </label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400 group-focus-within:text-blue-600 dark:group-focus-within:text-blue-500 transition-colors" />
                    <input
                      type="password"
                      name="password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-neutral-100/50 dark:bg-neutral-800/50 border border-neutral-200/30 dark:border-neutral-700/30 focus:border-blue-500/50 dark:focus:border-blue-500/50 focus:bg-white dark:focus:bg-neutral-900 outline-none transition-all text-sm font-medium text-neutral-900 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 mb-2 pl-1">
                    Select Your Role
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    
                    {/* Role Card 1 */}
                    <button
                      type="button"
                      onClick={() => selectRole("community_user")}
                      className={`flex flex-col items-start p-3 rounded-xl border text-left transition-all ${
                        formData.role === "community_user"
                          ? "border-blue-600 dark:border-blue-500 bg-blue-500/5 text-blue-600 dark:text-blue-400"
                          : "border-neutral-200/30 dark:border-neutral-700/30 hover:border-neutral-300 dark:hover:border-neutral-600 text-neutral-600 dark:text-neutral-400"
                      }`}
                    >
                      <HelpCircle className="w-4 h-4 mb-2" />
                      <span className="text-xs font-bold block">Community Member</span>
                      <span className="text-[10px] opacity-70 leading-tight mt-1 block">Request supply aid & file alerts.</span>
                    </button>

                    {/* Role Card 2 */}
                    <button
                      type="button"
                      onClick={() => selectRole("volunteer")}
                      className={`flex flex-col items-start p-3 rounded-xl border text-left transition-all ${
                        formData.role === "volunteer"
                          ? "border-blue-600 dark:border-blue-500 bg-blue-500/5 text-blue-600 dark:text-blue-400"
                          : "border-neutral-200/30 dark:border-neutral-700/30 hover:border-neutral-300 dark:hover:border-neutral-600 text-neutral-600 dark:text-neutral-400"
                      }`}
                    >
                      <ShieldCheck className="w-4 h-4 mb-2" />
                      <span className="text-xs font-bold block">Field Volunteer</span>
                      <span className="text-[10px] opacity-70 leading-tight mt-1 block">Fulfill needs & coordinate drops.</span>
                    </button>

                  </div>
                </div>
              </div>

              {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-600 dark:text-red-400 text-xs font-bold flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 shrink-0" />
                  <span className="line-clamp-2">{error}</span>
                </div>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 text-sm rounded-xl font-bold bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white shadow-lg shadow-blue-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Registering...
                  </>
                ) : (
                  <>
                    Create Account
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            </form>

            <div className="mt-5 text-center text-sm text-neutral-500 dark:text-neutral-400">
              Already have an account?{" "}
              <Link href="/login" className="text-blue-600 dark:text-blue-400 font-bold hover:underline underline-offset-4">
                Sign in
              </Link>
            </div>
          </div>
          
        </div>
      </div>

      {/* RIGHT PANE: Interactive Visual Dashboard / Info Hub */}
      <div className="hidden lg:col-span-7 lg:flex flex-col justify-between p-12 relative overflow-hidden bg-gradient-to-br from-blue-900 via-indigo-950 to-neutral-950 text-white border-l border-neutral-800">
        
        {/* Dynamic Abstract Tech Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:32px_32px]"></div>
        <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-blue-500/15 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-1/4 left-1/3 w-[300px] h-[300px] bg-indigo-500/10 rounded-full blur-[120px]"></div>
        
        {/* Upper Visual Feed */}
        <div className="relative z-10 flex justify-between items-center">
          <div className="flex items-center space-x-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full text-xs font-medium backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            <span className="text-neutral-300">Live Network Active</span>
          </div>
          <span className="text-xs text-neutral-400 font-medium">System Version 2.4.0</span>
        </div>

        {/* Hero Copy & Teaser Cards */}
        <div className="relative z-10 max-w-xl space-y-8 my-auto">
          <div className="space-y-4">
            <h2 className="text-4xl font-extrabold tracking-tight leading-tight">
              Coordinate Relief. <br />
              <span className="bg-gradient-to-r from-blue-400 to-indigo-300 bg-clip-text text-transparent">
                Empower Communities.
              </span>
            </h2>
            <p className="text-neutral-300 text-sm leading-relaxed max-w-lg">
              ReliefLink bridges resource gaps in critical times. Access live intelligence, map local support, and deploy responses seamlessly across our global volunteer grid.
            </p>
          </div>

          {/* Simulated Live Feed Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Status Card 1 */}
            <div className="bg-white/5 border border-white/10 backdrop-blur-lg p-5 rounded-2xl space-y-4 hover:border-white/20 transition-all hover:translate-y-[-2px]">
              <div className="flex items-center justify-between">
                <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
                  <Activity className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-md">Live Status</span>
              </div>
              <div>
                <p className="text-xs text-neutral-400">Active Supply Dispatches</p>
                <p className="text-2xl font-black tracking-tight mt-1 text-white">412 <span className="text-xs font-normal text-neutral-400">kits / hr</span></p>
              </div>
              <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                <div className="bg-blue-500 h-full w-[78%] rounded-full"></div>
              </div>
            </div>

            {/* Status Card 2 */}
            <div className="bg-white/5 border border-white/10 backdrop-blur-lg p-5 rounded-2xl space-y-4 hover:border-white/20 transition-all hover:translate-y-[-2px]">
              <div className="flex items-center justify-between">
                <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400">
                  <Users className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-neutral-300 bg-white/10 px-2 py-0.5 rounded-md">Updated</span>
              </div>
              <div>
                <p className="text-xs text-neutral-400">Volunteers Deployed</p>
                <p className="text-2xl font-black tracking-tight mt-1 text-white">1,824 <span className="text-xs font-normal text-neutral-400">on field</span></p>
              </div>
              <div className="flex -space-x-2 overflow-hidden mt-1">
                <div className="inline-block h-6 w-6 rounded-full ring-2 ring-indigo-950 bg-neutral-800 flex items-center justify-center text-[8px] font-bold">JD</div>
                <div className="inline-block h-6 w-6 rounded-full ring-2 ring-indigo-950 bg-neutral-700 flex items-center justify-center text-[8px] font-bold">AS</div>
                <div className="inline-block h-6 w-6 rounded-full ring-2 ring-indigo-950 bg-neutral-600 flex items-center justify-center text-[8px] font-bold">MK</div>
                <div className="inline-block h-6 w-6 rounded-full ring-2 ring-indigo-950 bg-neutral-500 flex items-center justify-center text-[8px] font-bold">+18</div>
              </div>
            </div>

          </div>
        </div>

        {/* Footer info */}
        <div className="relative z-10 flex justify-between items-center text-xs text-neutral-400">
          <p>© 2026 ReliefLink Core. Secure coordination server.</p>
          <div className="flex space-x-4">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>

      </div>

    </div>
  );
}
