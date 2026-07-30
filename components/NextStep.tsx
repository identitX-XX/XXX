"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { Card } from "./ui";
import { useParcoursStore } from "@/parcours-archetypes/store";
import { progression } from "@/parcours-archetypes/indicateurs";

// Continuité de parcours : sur chaque page « périphérique », un unique passage
// à l'action ramène l'utilisateur dans la boucle quotidienne — jamais de
// cul-de-sac, jamais perdu. Leviers : Zeigarnik (boucle ouverte à refermer),
// goal-gradient (« plus que X jours » près du but), charge cognitive minimale
// (une seule action primaire), indice directionnel (flèche, verbe d'action).

// On masque le fléchage là où la page porte déjà sa propre action de tête :
// le hub, la quête active, la progression.
// On masque le fléchage là où la page porte déjà sa propre action de tête :
// le hub, la quête active, la progression, la Quête (déjà un CTA « Révéler »).
const SKIP_EXACT = ["/aujourdhui", "/progression", "/admin", "/coach", "/quete"];

type Step = { titre: string; pourquoi: string; cta: string; href: string };

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

  const step = computeStep(diagnostic, objectifs, etat, reponses);

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
          className="group inline-flex flex-none items-center justify-center gap-2 rounded-full brand-gradient px-6 py-3 text-sm font-medium text-white shadow-glow transition-transform hover:scale-[1.02]"
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

function computeStep(
  diagnostic: unknown,
  objectifs: unknown,
  etat: Parameters<typeof progression>[0],
  reponses: Record<number, unknown>
): Step {
  if (!diagnostic)
    return {
      titre: "Révèle ta signature",
      pourquoi: "Tout part de là : douze questions, et ton point de départ.",
      cta: "Commencer",
      href: "/parcours-signatures",
    };
  if (!objectifs)
    return {
      titre: "Pose ton cap",
      pourquoi: "Un objectif par périmètre — ta boussole des 30 jours.",
      cta: "Poser mon cap",
      href: "/parcours-signatures",
    };

  const prog = progression(etat);
  if (prog.jourCourant > 30)
    return {
      titre: "Ton bilan t'attend",
      pourquoi: "Tes 30 jours sont accomplis — recueille ce qui ressort.",
      cta: "Voir mon bilan",
      href: "/parcours-signatures/rapport",
    };

  const n = Math.min(prog.jourCourant, 30);
  if (!reponses[n])
    return {
      titre: "Ta capsule du jour",
      pourquoi: "≈ 4 min, quand tu veux. Une question, un geste, un appui — à ton rythme.",
      cta: "Vivre ma capsule",
      href: "/parcours-signatures",
    };

  return {
    titre: "Journée close ✓",
    pourquoi: "Retrouve ton élan sur la carte des 30 jours.",
    cta: "Voir ma progression",
    href: "/progression",
  };
}
