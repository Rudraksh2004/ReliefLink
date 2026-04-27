"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { 
  onAuthStateChanged, 
  User,
  signOut as firebaseSignOut
} from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useRouter, usePathname } from "next/navigation";

interface AuthContextType {
  user: User | null;
  userProfile: any | null;
  loading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userProfile: null,
  loading: true,
  logout: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      
      if (user) {
        try {
          // Fetch user profile from Firestore to get the role
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            const profile = userDoc.data();
            setUserProfile(profile);

            // Redirection to Analytics after login/on root
            if (pathname === "/login" || pathname === "/signup" || pathname === "/") {
              router.push("/dashboard");
            }

            // Protected route checks for specific roles
            if (pathname === "/admin" && profile.role !== "admin") router.push("/dashboard");
            if (pathname === "/volunteer" && profile.role !== "volunteer") router.push("/dashboard");
            if (pathname === "/community" && profile.role !== "community_user") router.push("/dashboard");
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
        }
      } else {
        setUserProfile(null);
        
        // Protected routes logic for unauthenticated users
        const protectedRoutes = ["/dashboard", "/map", "/admin", "/volunteer", "/community"];
        if (protectedRoutes.some(route => pathname.startsWith(route))) {
          router.push("/login");
        }
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, [pathname, router]);

  const logout = async () => {
    try {
      await firebaseSignOut(auth);
      router.push("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, userProfile, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
