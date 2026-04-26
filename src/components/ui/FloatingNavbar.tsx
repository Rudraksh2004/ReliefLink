"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  ClipboardList, 
  Map as MapIcon, 
  Users,
  Home
} from "lucide-react";
import { cn } from "../../lib/utils";

const navItems = [
  { name: "Home", href: "/", icon: Home },
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Needs", href: "/community-needs", icon: ClipboardList },
  { name: "Map", href: "/map", icon: MapIcon },
  { name: "Volunteers", href: "/volunteers", icon: Users },
];

export const FloatingNavbar = () => {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
      <nav className="flex items-center gap-1 p-2 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl border border-gray-200 dark:border-neutral-800 rounded-full shadow-2xl transition-all hover:shadow-blue-500/10">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative flex items-center justify-center p-3 rounded-full transition-all duration-300 group",
                isActive 
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30" 
                  : "text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="absolute -top-12 left-1/2 -translate-x-1/2 px-2 py-1 bg-neutral-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                {item.name}
              </span>
              {isActive && (
                <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full" />
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
};
