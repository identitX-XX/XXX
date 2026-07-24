"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles } from "lucide-react";
import { NAV_GROUPS } from "@/data/constants";
import { useParcoursStore } from "@/parcours-archetypes/store";

export function NavList({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  // Badge « nouveau » sur « Aujourd'hui » : allumé quand le fil du jour courant
  // n'a pas encore été vu (et que le parcours est bien lancé).
  const diagnostic = useParcoursStore((s) => s.diagnostic);
  const jourCourant = useParcoursStore((s) => s.etat.jourCourant);
  const filVu = useParcoursStore((s) => s.filVu);
  const jour = Math.min(jourCourant, 30);
  const filNeuf = Boolean(diagnostic) && filVu < jour;

  return (
    <nav className="flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto pr-1">
      {NAV_GROUPS.map((group, gi) => (
        <div key={gi} className="flex flex-col gap-0.5">
          {group.section && (
            <div className="mb-1 px-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted/60">
              {group.section}
            </div>
          )}
          {group.items.map((item) => {
            const active = pathname === item.href;
            const badge = item.href === "/aujourdhui" && filNeuf && !active;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onNavigate}
                aria-current={active ? "page" : undefined}
                className={`rounded-xl px-4 py-2.5 text-sm transition-colors ${
                  active ? "bg-raised text-ink" : "text-muted hover:bg-raised hover:text-ink"
                }`}
              >
                <span className="flex items-center gap-3">
                  <span
                    className={`h-1.5 w-1.5 flex-none rounded-full transition-all ${
                      active ? "brand-gradient" : "bg-line"
                    }`}
                  />
                  <span className="flex-1">{item.label}</span>
                  {badge && (
                    <span
                      className="rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.12em] text-white"
                      style={{ background: "linear-gradient(90deg,var(--fuchsia),var(--orange))" }}
                    >
                      Nouveau
                    </span>
                  )}
                </span>
              </Link>
            );
          })}
        </div>
      ))}
    </nav>
  );
}

export function Brand() {
  return (
    <Link href="/dashboard" className="mb-8 flex items-center gap-2">
      <div className="brand-gradient flex h-8 w-8 items-center justify-center rounded-lg">
        <Sparkles size={16} className="text-white" />
      </div>
      <span className="font-display text-lg tracking-tight text-ink">
        IDENTITX
      </span>
    </Link>
  );
}
