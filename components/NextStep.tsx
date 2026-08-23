"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { Card } from "./ui";
import { useParcoursStore } from "@/parcours-archetypes/store";
import { prochaineEtape } from "@/lib/prochaineEtape";

// Continuité de parcours : sur chaque page « périphérique », un unique passage
// à l'action ramène l'utilisateur dans la boucle quotidienne — jamais de
// cul-de-sac, jamais perdu. Leviers : Zeigarnik (boucle ouverte à refermer),
// goal-gradient (« plus que X jours » près du but), charge cognitive minimale
// (une seule action primaire), indice directionnel (flèche, verbe d'action).

// On masque le fléchage UNIQUEMENT là où la page porte déjà sa propre action de
// tête (le hub a sa capsule ; parcours-signatures a son parcours) ou n'a pas de
// boucle (admin, découverte). Partout ailleurs — coach, scénarios, quête,
// progression, portrait… — on affiche la prochaine étape pour ne JAMAIS laisser
// l'utilisatrice sur un cul-de-sac : toujours une flèche vers quoi faire ensuite.
const SKIP_EXACT = ["/aujourdhui", "/admin", "/decouverte"];

export function NextStep() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const diagnostic = useParcoursStore((s) => s.diagnostic);
  const objectifs = useParcoursStore((s) => s.objectifs);
  const etat = useParcoursStore((s) => s.etat);
  const reponses = useParcoursStore((s) => s.reponses);

  // Évite tout écart d'hydratation : le store se réhydrate côté client.
  if (!mounted) return null;
  if (SKIP_EXACT.includes(pathname) || pathname.startsWith("/parcours-signatures"))
    return null;

  const step = prochaineEtape(diagnostic, objectifs, etat, reponses);

  return (
    <div className="mt-12 animate-fade-up">
      <div className="mb-3 text-xs uppercase tracking-[0.18em] text-muted">
        La suite
      </div>
      <Card className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="font-display text-lg font-light text-ink">
            {step.titre}
          </div>
          <p className="mt-1 text-sm text-muted">{step.pourquoi}</p>
        </div>
        <Link
          href={step.href}
          className="group inline-flex flex-none items-center justify-center gap-2 rounded-full brand-gradient px-6 py-3 text-sm font-medium text-[color:var(--on-brand)] shadow-glow transition-transform hover:scale-[1.02]"
        >
          {step.cta}
          <ArrowRight
            size={16}
            className="transition-transform group-hover:translate-x-0.5"
          />
        </Link>
      </Card>
    </div>
  );
}
