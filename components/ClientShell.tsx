"use client";

import { ReactNode, useEffect, useState } from "react";
import { Menu, Moon, Sun, X } from "lucide-react";
import { useStore } from "@/store/useStore";
import { Onboarding } from "./Onboarding";
import { Welcome } from "./Welcome";


import { Brand, NavList } from "./Sidebar";
import { NextStep } from "./NextStep";
import { JourneyBar } from "./JourneyBar";

export function ClientShell({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false); 
  const [started, setStarted] = useState(false);

  const onboarded = useStore((s) => s.onboarded);
  const theme = useStore((s) => s.theme);
  const setTheme = useStore((s) => s.setTheme);

  useEffect(() => setMounted(true), []);

  // Apply theme class to <html>
  useEffect(() => {
    if (!mounted) return;
    const root = document.documentElement;
    if (theme === "light") root.classList.add("light");
    else root.classList.remove("light");
  }, [theme, mounted]);

  if (!mounted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-noir">
        <div className="brand-gradient h-10 w-10 animate-pulse rounded-xl" />
      </div>
    );
  }

if (!onboarded && !started) return <Welcome onStart={() => setStarted(true)} />;
  if (!onboarded) return <Onboarding />;

  return (
    <div className="min-h-screen bg-noir">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col border-r border-line bg-surface px-5 py-7 lg:flex">
        <Brand />
        <NavList />
        <div className="mt-auto">
          <ThemeToggle theme={theme} setTheme={setTheme} />
        </div>
      </aside>

      {/* Mobile top bar */}
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-line bg-surface px-5 py-4 backdrop-blur lg:hidden">
        <Brand />
        <button
          aria-label="Ouvrir le menu"
          onClick={() => setMenuOpen(true)}
          className="rounded-lg border border-line p-2 text-ink"
        >
          <Menu size={18} />
        </button>
      </header>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-black/60 animate-fade-in"
            onClick={() => setMenuOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 flex w-72 flex-col border-r border-line bg-surface px-5 py-7">
            <div className="mb-2 flex items-center justify-between">
              <Brand />
              <button
                aria-label="Fermer"
                onClick={() => setMenuOpen(false)}
                className="rounded-lg border border-line p-2 text-ink"
              >
                <X size={18} />
              </button>
            </div>
            <NavList onNavigate={() => setMenuOpen(false)} />
            <div className="mt-8">
              <ThemeToggle theme={theme} setTheme={setTheme} />
            </div>
          </div>
        </div>
      )}

      <main className="px-5 py-8 lg:ml-64 lg:px-12 lg:py-12">
        <div className="mx-auto max-w-5xl">
          <JourneyBar />
          {children}
          <NextStep />
        </div>
      </main>
    </div>
  );
}

function ThemeToggle({
  theme,
  setTheme,
}: {
  theme: string;
  setTheme: (t: "dark" | "light") => void;
}) {
  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm text-muted transition-colors hover:bg-raised hover:text-ink"
    >
      {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
      {theme === "dark" ? "Mode clair" : "Mode sombre"}
    </button>
  );
}
