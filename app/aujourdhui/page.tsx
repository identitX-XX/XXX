"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Card, PageHead } from "@/components/ui";
import { useParcoursStore } from "@/parcours-archetypes/store";
import { archetypeByKey, phaseDuJour } from "@/parcours-archetypes/archetypes";
import { progression } from "@/parcours-archetypes/indicateurs";

// Home « Aujourd'hui » : l'app s'ouvre sur la seule chose du jour — ta capsule
// identitaire + ton avancement — au lieu d'un menu. Le reste est un tiroir.
export default function AujourdhuiPage() {
  const diagnostic = useParcoursStore((s) => s.diagnostic);
  const objectifs = useParcoursStore((s) => s.objectifs);
  const parcours = useParcoursStore((s) => s.parcours);
  const etat = useParcoursStore((s) => s.etat);
  const reponses = useParcoursStore((s) => s.reponses);

  // Pas encore lancé : on flèche vers la prochaine étape à faire.
  if (!diagnostic) {
    return (
      <Amorce
        eyebrow="Aujourd'hui"
        titre="Commence par toi"
        texte="Réponds à une batterie de 12 questions pour identifier ton archétype. C'est le point de départ de tes 30 jours."
        cta="Je commence ma quête"
      />
    );
  }
  if (!objectifs) {
    return (
      <Amorce
        eyebrow="Aujourd'hui"
        titre="Pose ton cap"
        texte="Formule un objectif par périmètre — perso, pro, relationnel. Il te servira de boussole."
        cta="Poser mon cap"
      />
    );
  }

  const prog = progression(etat);
  const termine = prog.jourCourant > 30;
  const n = Math.min(prog.jourCourant, 30);
  const jour = parcours.jours.find((j) => j.n === n) ?? null;
  const arch = jour ? archetypeByKey[jour.archetype] : null;
  const phase = phaseDuJour(n);
  const angle = (prog.part / 100) * 360;
  const dejaFait = Boolean(reponses[n]);

  return (
    <div>
      <PageHead
        eyebrow="Aujourd'hui"
        title="Ton rendez-vous du jour"
        sub="Une seule chose compte : vivre ta journée. Le reste peut attendre."
      />

      {termine ? (
        <Card className="p-8 text-center">
          <div className="text-3xl">🎉</div>
          <h2 className="mt-2 font-display text-2xl font-light text-ink">
            Tes 30 jours sont accomplis
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted">
            Il est temps de recueillir ce qui ressort : ton rapport te propose
            trois scénarios activables sur tes périmètres.
          </p>
          <Link
            href="/parcours-archetypes/rapport"
            className="mt-5 inline-flex items-center gap-2 rounded-full brand-gradient px-6 py-3 text-sm font-medium text-white"
          >
            Voir mon bilan
            <ArrowRight size={16} />
          </Link>
        </Card>
      ) : (
        <Card className="p-6 sm:p-8">
          <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center">
            {/* Anneau d'avancement */}
            <div
              style={{
                width: 120, height: 120, borderRadius: "50%", flex: "none",
                background: `conic-gradient(var(--fuchsia) ${angle}deg, var(--line) ${angle}deg)`,
                display: "grid", placeItems: "center",
              }}
            >
              <div className="grid h-[96px] w-[96px] place-items-center rounded-full bg-noir text-center">
                <div>
                  <div className="font-display text-3xl text-ink">{prog.faits}</div>
                  <div className="text-[10px] uppercase tracking-wider text-muted">/ 30 jours</div>
                </div>
              </div>
            </div>

            {/* La capsule du jour */}
            <div className="flex-1 text-center sm:text-left">
              <div className="text-xs uppercase tracking-wider text-fuchsia">
                Jour {n} · phase {phase.label}
              </div>
              <h2 className="mt-1 font-display text-2xl font-light text-ink">
                {arch ? arch.name : "Ta capsule du jour"}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted">{arch?.lens}</p>
              <Link
                href="/parcours-archetypes"
                className="mt-5 inline-flex items-center gap-2 rounded-full brand-gradient px-6 py-3 text-sm font-medium text-white"
              >
                {dejaFait ? "Revoir ma journée" : "Vivre ma journée"}
                <ArrowRight size={16} />
              </Link>
              <div className="mt-2 text-xs text-muted">≈ 4 min · le soir, idéalement</div>
            </div>
          </div>
        </Card>
      )}

      {/* Le reste, en second plan */}
      <div className="mt-8">
        <div className="mb-3 text-xs uppercase tracking-wider text-muted">Explorer</div>
        <div className="flex flex-wrap gap-3">
          {[
            { href: "/progression", label: "Ma progression" },
            ...(prog.faits >= 5 ? [{ href: "/parcours-archetypes/rapport", label: "Mon rapport" }] : []),
            { href: "/parcours", label: "Ma quête (les modules)" },
            { href: "/dashboard", label: "Tableau de bord" },
          ].map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-full border border-line px-4 py-2 text-sm text-muted transition-colors hover:border-fuchsia hover:text-fuchsia"
            >
              {l.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

function Amorce({
  eyebrow,
  titre,
  texte,
  cta,
}: {
  eyebrow: string;
  titre: string;
  texte: string;
  cta: string;
}) {
  return (
    <div>
      <PageHead eyebrow={eyebrow} title="Ton rendez-vous du jour" sub="Une étape à la fois." />
      <Card className="p-8 text-center">
        <h2 className="font-display text-2xl font-light text-ink">{titre}</h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted">{texte}</p>
        <Link
          href="/parcours-archetypes"
          className="mt-5 inline-flex items-center gap-2 rounded-full brand-gradient px-6 py-3 text-sm font-medium text-white"
        >
          {cta}
          <ArrowRight size={16} />
        </Link>
      </Card>
    </div>
  );
}
