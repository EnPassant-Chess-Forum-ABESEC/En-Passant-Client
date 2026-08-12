"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle() {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex items-center gap-2 p-1 bg-slate-100 dark:bg-slate-800/50 rounded-full mt-4 opacity-50">
        <div className="flex-1 h-8 bg-slate-200 dark:bg-slate-700/50 rounded-full animate-pulse" />
      </div>
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <div className="relative flex items-center p-1 bg-slate-100 dark:bg-[#020617] rounded-full mt-4 shadow-inner border border-slate-200 dark:border-slate-800">
      <div
        className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white dark:bg-blue-600 rounded-full shadow-sm transition-transform duration-300 ease-in-out ${
          isDark ? "translate-x-[calc(100%+0px)]" : "translate-x-0"
        }`}
      />
      <button
        onClick={() => setTheme("light")}
        className={`relative z-10 flex-1 flex justify-center py-2 transition-colors duration-300 ${
          !isDark ? "text-slate-900" : "text-slate-500 hover:text-slate-300"
        }`}
        title="Light Mode"
      >
        <Sun className="w-4 h-4" />
      </button>
      <button
        onClick={() => setTheme("dark")}
        className={`relative z-10 flex-1 flex justify-center py-2 transition-colors duration-300 ${
          isDark ? "text-white" : "text-slate-500 hover:text-slate-700"
        }`}
        title="Dark Mode"
      >
        <Moon className="w-4 h-4" />
      </button>
    </div>
  );
}
