import { useEffect, useState, useCallback } from "react";
import { Sun, Moon } from "lucide-react";

function getInitialTheme(): boolean {
  if (typeof window === "undefined") return false;
  const stored = localStorage.getItem("theme");
  if (stored) return stored === "dark";
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

export function Navbar() {
  const [isDark, setIsDark] = useState(getInitialTheme);

  const applyTheme = useCallback((dark: boolean) => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, []);

  useEffect(() => {
    applyTheme(isDark);
  }, [isDark, applyTheme]);

  useEffect(() => {
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem("theme")) {
        setIsDark(e.matches);
      }
    };
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-40">
      <div className="max-w-7xl mx-auto px-6 md:px-12 h-16 flex items-center justify-between">
        <a
          href="/knowyourai"
          className="flex items-center gap-2 group"
        >
          <div className="w-7 h-7 rounded-lg bg-emerald-600 flex items-center justify-center">
            <svg viewBox="0 0 16 16" className="w-4 h-4" fill="none">
              <rect x="2" y="2" width="5" height="5" rx="1.5" fill="white" opacity="0.95" />
              <rect x="9" y="2" width="5" height="5" rx="1.5" fill="white" opacity="0.7" />
              <rect x="2" y="9" width="5" height="5" rx="1.5" fill="white" opacity="0.55" />
              <rect x="9" y="9" width="5" height="5" rx="1.5" fill="white" opacity="0.35" />
            </svg>
          </div>
          <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 tracking-tight group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
            KnowYourAI
          </span>
        </a>

        <button
          onClick={() => setIsDark((d) => !d)}
          className="w-9 h-9 rounded-xl flex items-center justify-center bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 border border-zinc-200/60 dark:border-zinc-700/60 transition-colors"
          aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
        >
          {isDark ? (
            <Sun className="w-4 h-4 text-zinc-400" />
          ) : (
            <Moon className="w-4 h-4 text-zinc-500" />
          )}
        </button>
      </div>
    </nav>
  );
}
