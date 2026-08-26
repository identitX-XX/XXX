"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { ArrowRight, Flame } from "lucide-react";
import { useParcoursStore } from "@/parcours-archetypes/store";
import { progression, momentum } from "@/parcours-archetypes/indicateurs";
import { phaseDuJour } from "@/parcours-archetypes/archetypes";
import { prochaineEtape } from "@/lib/prochaineEtape";

// Repère d'orientation persistant (« tu es ici ») en tête de chaque page :
// une ancre spatio-temporelle anti-désorientation. À GAUCHE : où tu en es
// (Jour N / 30, cliquable → hub). À DROITE : la MÊME prochaine étape que la
// carte de pied (NextStep), en version compacte — pour que l'action à faire
// soit visible SANS scroller. Ensemble (haut + bas), impossible de se perdre.
export function JourneyBar() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const diagnostic = useParcoursStore((s) => s.diagnostic);
  const objectifs = useParcoursStore((s) => s.objectifs);
  const etat = useParcoursStore((s) => s.etat);
  const reponses = useParcoursStore((s) => s.reponses);

  if (!mounted) return null;
  // La barre « Jour N / 30 » reste visible PARTOUT (demande utilisatrice : un
  // repère de progression toujours présent). Seul l'admin l'exclut.
  if (pathname === "/admin") return null;

  // Quête pas encore lancée : NextStep porte déjà l'unique appel « révèle ta
  // signature ». On ne le répète pas ici — une seule action par écran.
  if (!diagnostic) return null;

  const prog = progression(etat);
  const mo = momentum(etat);
  const termine = prog.jourCourant > 30;
  const n = Math.min(prog.jourCourant, 30);
  const phase = phaseDuJour(n);
  const pct = Math.round((prog.faits / 30) * 100);

  const step = prochaineEtape(diagnostic, objectifs, etat, reponses);
  // On masque la puce d'action quand on est déjà sur sa destination (ou déjà
  // dans le parcours) : inutile de flécher « Terminer » quand on y est.
  const montrerAction =
    pathname !== step.href && !pathname.startsWith("/parcours-signatures");

  return (
    <div className="mb-6 flex items-center gap-2">
      {/* Ancre « tu es ici » → retour au hub */}
      <Link
        href="/aujourdhui"
        aria-label="Revenir à Aujourd'hui"
        className="group flex min-w-0 flex-1 items-center gap-3 rounded-full border border-line bg-surface px-4 py-2 text-xs transition-colors hover:border-fuchsia"
      >
        <span className="flex-none font-medium text-ink">
          {termine ? "Quête accomplie" : `Jour ${n} / 30`}
        </span>
        <span className="hidden flex-none text-muted sm:inline">· {phase.label}</span>
        <div className="h-1 min-w-[24px] flex-1 overflow-hidden rounded-full bg-line">
          <div className="h-full rounded-full brand-gradient" style={{ width: `${pct}%` }} />
        </div>
        {mo.serie > 0 && (
          <span
            className="flex flex-none items-center gap-1 font-medium"
            style={{ color: "var(--orange)" }}
          >
            <Flame size={12} />
            {mo.serie}
          </span>
        )}
      </Link>

      {/* Puce d'action = la prochaine étape, visible sans scroller */}
      {montrerAction && (
        <Link
          href={step.href}
          aria-label={step.cta}
          className="group flex flex-none items-center gap-1.5 rounded-full brand-gradient px-3.5 py-2 text-xs font-semibold text-[color:var(--on-brand)] shadow-glow transition-transform hover:scale-[1.02]"
        >
          {step.ctaCourt}
          <ArrowRight
            size={13}
            className="transition-transform group-hover:translate-x-0.5"
          />
        </Link>
      )}
    </div>
  );
}
