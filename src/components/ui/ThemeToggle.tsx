"use client";

import { useTheme } from "@/context/ThemeContext";
import { Sun, Moon } from "lucide-react";

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg bg-slate-200 dark:bg-slate-700 hover:ring-2 ring-slate-300 transition-all duration-300 focus:outline-none"
      aria-label="Toggle Theme"
    >
      {theme === "light" ? (
        <Moon className="w-5 h-5 text-slate-800" />
      ) : (
        <Sun className="w-5 h-5 text-yellow-400" />
      )}
    </button>
  );
};
