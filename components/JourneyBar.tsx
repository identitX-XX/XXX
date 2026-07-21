"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { ArrowRight, Flame } from "lucide-react";
import { useParcoursStore } from "@/parcours-archetypes/store";
import { progression, momentum } from "@/parcours-archetypes/indicateurs";
import { phaseDuJour } from "@/parcours-archetypes/archetypes";

// Repère d'orientation persistant (« tu es ici ») en tête de chaque page :
// une ancre spatio-temporelle anti-désorientation. Où tu en es dans la quête,
// toujours visible, toujours cliquable pour revenir au hub. C'est le pendant
// du NextStep en pied de page (où aller) — ensemble ils ferment la boucle.
export function JourneyBar() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const diagnostic = useParcoursStore((s) => s.diagnostic);
  const etat = useParcoursStore((s) => s.etat);

  if (!mounted) return null;
  // Sur le hub, la position est déjà l'objet même de la page.
  if (pathname === "/aujourdhui") return null;

  // Quête pas encore lancée : le repère devient une invite douce.
  if (!diagnostic) {
    return (
      <Link
        href="/parcours-archetypes"
        className="group mb-6 flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-2 text-xs text-muted transition-colors hover:border-fuchsia hover:text-fuchsia"
      >
        <span className="h-1.5 w-1.5 rounded-full brand-gradient" />
        <span>Quête non commencée — révèle ton archétype</span>
        <ArrowRight
          size={13}
          className="ml-auto transition-transform group-hover:translate-x-0.5"
        />
      </Link>
    );
  }

  const prog = progression(etat);
  const mo = momentum(etat);
  const termine = prog.jourCourant > 30;
  const n = Math.min(prog.jourCourant, 30);
  const phase = phaseDuJour(n);
  const pct = Math.round((prog.faits / 30) * 100);

  return (
    <Link
      href="/aujourdhui"
      aria-label="Revenir à Aujourd'hui"
      className="group mb-6 flex items-center gap-3 rounded-full border border-line bg-surface px-4 py-2 text-xs transition-colors hover:border-fuchsia"
    >
      <span className="font-medium text-ink">
        {termine ? "Quête accomplie" : `Jour ${n} / 30`}
      </span>
      <span className="hidden text-muted sm:inline">· {phase.label}</span>
      <div className="h-1 flex-1 overflow-hidden rounded-full bg-line">
        <div
          className="h-full rounded-full brand-gradient"
          style={{ width: `${pct}%` }}
        />
      </div>
      {mo.serie > 0 && (
        <span
          className="flex items-center gap-1 font-medium"
          style={{ color: "var(--orange)" }}
        >
          <Flame size={12} />
          {mo.serie}
        </span>
      )}
      <ArrowRight
        size={13}
        className="text-muted transition-transform group-hover:translate-x-0.5 group-hover:text-fuchsia"
      />
    </Link>
  );
}
