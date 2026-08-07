"use client";

import { ReactNode, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, Moon, Sun, X } from "lucide-react";
import { useStore } from "@/store/useStore";
import { Onboarding } from "./Onboarding";


import { Brand, NavList } from "./Sidebar";
import { NextStep } from "./NextStep";
import { JourneyBar } from "./JourneyBar";
import { BottomNav } from "./BottomNav";
import { ConsentGate } from "./ConsentGate";
import { ScrollTop } from "./ScrollTop";
import { PageAnalytics } from "./PageAnalytics";
import { FeedbackButton } from "./FeedbackButton";
import { track } from "@/lib/metrics";

export function ClientShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const onboarded = useStore((s) => s.onboarded);
  const theme = useStore((s) => s.theme);
  const setTheme = useStore((s) => s.setTheme);
  const palette = useStore((s) => s.palette);

  useEffect(() => setMounted(true), []);

  // Backend A : ouverture d'app (no-op sans consentement ni backend).
  useEffect(() => {
    if (mounted) track("app_open");
  }, [mounted]);

  // Apply theme + palette classes to <html>
  useEffect(() => {
    if (!mounted) return;
    const root = document.documentElement;
    root.classList.toggle("light", theme === "light");
    ["pal-nuit", "pal-ardoise", "pal-or", "pal-aubergine", "pal-parme"].forEach(
      (c) => root.classList.remove(c)
    );
    if (palette && palette !== "origine") root.classList.add(`pal-${palette}`);
  }, [theme, palette, mounted]);

  // Le retour du lien magique se rend seul (pas d'onboarding, pas de chrome).
  if (pathname === "/auth/callback") return <>{children}</>;

  if (!mounted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-noir">
        <div className="brand-gradient h-10 w-10 animate-pulse rounded-xl" />
      </div>
    );
  }

  // Direct du portail à l'onboarding : plus d'écran d'accueil intermédiaire
  // (il faisait doublon avec la 1re étape de l'onboarding).
  if (!onboarded)
    return (
      <>
        <Onboarding />
        <ConsentGate />
      </>
    );

  return (
    <div className="min-h-screen bg-noir">
      {/* Fond FIXE (profondeur premium) : il reste immobile pendant que les blocs
          défilent par-dessus — donne le relief et la « dynamique » de scroll. */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10"
        style={{
          background:
            "radial-gradient(85% 55% at 50% -8%, color-mix(in srgb, var(--fuchsia) 12%, transparent), transparent 60%), radial-gradient(70% 50% at 100% 100%, color-mix(in srgb, var(--orange) 9%, transparent), transparent 55%), radial-gradient(60% 45% at 0% 40%, color-mix(in srgb, var(--fuchsia) 6%, transparent), transparent 60%), var(--noir)",
        }}
      />
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col border-r border-line bg-surface px-5 py-7 lg:flex">
        <Brand />
        <NavList />
        <div className="mt-auto">
          <ThemeToggle theme={theme} setTheme={setTheme} />
        </div>
      </aside>

      {/* Mobile top bar */}
      <header className="safe-top sticky top-0 z-30 flex items-center justify-between border-b border-line bg-surface px-5 py-4 backdrop-blur lg:hidden">
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

      <main className="px-5 py-8 pb-28 lg:ml-64 lg:px-12 lg:py-12 lg:pb-12">
        <div className="mx-auto max-w-5xl">
          <JourneyBar />
          {children}
          <NextStep />
        </div>
      </main>

      {/* Barre d'onglets persistante (mobile) — navigation toujours à portée. */}
      <BottomNav onMenu={() => setMenuOpen(true)} />
      <FeedbackButton />
      <ConsentGate />
      <ScrollTop />
      <PageAnalytics />
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
