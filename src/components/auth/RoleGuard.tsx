"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Loader2, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: string[];
  redirectPath?: string;
}

export const RoleGuard: React.FC<RoleGuardProps> = ({ 
  children, 
  allowedRoles, 
  redirectPath = "/" 
}) => {
  const { user, userProfile, loading } = useAuth();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/login");
        return;
      }

      if (userProfile) {
        if (allowedRoles.includes(userProfile.role)) {
          setIsAuthorized(true);
        } else {
          setIsAuthorized(false);
          // Auto-redirect community users if they try to access map
          if (userProfile.role === "community_user" && window.location.pathname === "/map") {
            router.push("/community");
          }
        }
      }
    }
  }, [user, userProfile, loading, allowedRoles, router]);

  if (loading || isAuthorized === null) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
        <p className="text-gray-500 font-bold animate-pulse">Checking permissions...</p>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center max-w-lg mx-auto">
        <div className="w-20 h-20 bg-red-50 dark:bg-red-900/10 rounded-3xl flex items-center justify-center text-red-600 dark:text-red-400 mb-8 shadow-xl shadow-red-500/10">
          <ShieldAlert className="w-10 h-10" />
        </div>
        <h1 className="text-3xl font-black mb-4">Access Restricted</h1>
        <p className="text-gray-500 dark:text-gray-400 font-medium mb-10 leading-relaxed">
          Heatmap access is available only for volunteers and admins coordinating relief operations.
        </p>
        <Button 
          onClick={() => router.push("/")}
          className="h-14 px-10 rounded-2xl font-bold shadow-lg shadow-blue-500/20"
        >
          Return to Home
        </Button>
      </div>
    );
  }

  return <>{children}</>;
};
