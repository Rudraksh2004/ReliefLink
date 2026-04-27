"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { Button } from "@/components/ui/Button";
import { BackgroundGlow } from "@/components/ui/BackgroundGlow";
import { UserPlus, Mail, Lock, User as UserIcon, Loader2 } from "lucide-react";

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

      // Redirect based on role
      if (formData.role === "community_user") {
        router.push("/community-needs");
      } else {
        router.push("/volunteers");
      }
    } catch (err: any) {
      console.error("Signup error:", err);
      setError(err.message || "Failed to create account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-neutral-950 px-6 relative overflow-hidden">
      <BackgroundGlow />

      <div className="w-full max-w-md relative z-10">
        <div className="bg-white/70 dark:bg-neutral-900/70 backdrop-blur-2xl p-10 rounded-[2.5rem] border border-gray-100 dark:border-neutral-800 shadow-2xl shadow-blue-500/5">
          <div className="text-center space-y-2 mb-10">
            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-500/25 mx-auto mb-6">
              <UserPlus className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-black tracking-tight text-neutral-900 dark:text-white">Create Account</h1>
            <p className="text-gray-500 dark:text-gray-400 font-medium">Join the ReliefLink coordination network.</p>
          </div>

          <form onSubmit={handleSignup} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold uppercase tracking-widest text-gray-400 mb-2 pl-1">Full Name</label>
                <div className="relative group">
                  <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 dark:bg-neutral-800 border border-transparent focus:border-blue-500/50 outline-none transition-all font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold uppercase tracking-widest text-gray-400 mb-2 pl-1">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 dark:bg-neutral-800 border border-transparent focus:border-blue-500/50 outline-none transition-all font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold uppercase tracking-widest text-gray-400 mb-2 pl-1">Password</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                  <input
                    type="password"
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 dark:bg-neutral-800 border border-transparent focus:border-blue-500/50 outline-none transition-all font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold uppercase tracking-widest text-gray-400 mb-2 pl-1">I am a...</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full px-4 py-4 rounded-2xl bg-gray-50 dark:bg-neutral-800 border border-transparent focus:border-blue-500/50 outline-none transition-all font-medium appearance-none text-neutral-900 dark:text-white"
                >
                  <option value="community_user" className="bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white">Community User (Request Help)</option>
                  <option value="volunteer" className="bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white">Volunteer (Provide Help)</option>
                </select>
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-2xl text-red-600 dark:text-red-400 text-sm font-bold">
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full py-8 text-lg rounded-2xl shadow-xl shadow-blue-500/20 font-bold active:scale-[0.98] transition-all"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Creating Account...
                </>
              ) : (
                "Create Account"
              )}
            </Button>
          </form>

          <p className="mt-8 text-center text-gray-500 dark:text-gray-400 font-medium">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-600 dark:text-blue-400 font-black hover:underline underline-offset-4">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
