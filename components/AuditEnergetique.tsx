"use client";

// « Ton audit énergétique » — la pièce maîtresse de l'accueil, à la place de la
// capsule. Lecture AUTOMATIQUE (rien à remplir) de l'énergie disponible sur tes
// 4 piliers, dérivée de ce qu'on sait déjà de toi. Elle rend visible ta
// ressource (pilier chargé) et ce qui est à recharger — et INDUIT une direction.
// Design nuancé : jauges en dégradé de gris (de l'ombre à la lumière), carte en
// profondeur, tout en fusain & blanc.

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Battery } from "lucide-react";
import { useParcoursStore } from "@/parcours-archetypes/store";
import { auditDepuisEtat, CreditDirection } from "@/parcours-archetypes/auditEnergetique";
import { progression } from "@/parcours-archetypes/indicateurs";

// Couleur de l'état — PAS de barre de jauge (ça faisait tableau de bord). La
// nuance passe par la COULEUR de notre palette, chaude et incarnée : le pilier
// chargé en Bleu de Prusse, celui à recharger en laiton (il appelle le soin),
// le stable en encre sourde. De la DA, pas de l'analytics.
function etatColor(etat: CreditDirection["etat"]): string {
  if (etat === "haute") return "var(--fuchsia)"; // Bleu de Prusse
  if (etat === "basse") return "var(--orange)"; // laiton — ce qui demande du soin
  return "var(--muted)";
}

const ETAT_LABEL: Record<CreditDirection["etat"], string> = {
  haute: "chargée",
  stable: "stable",
  basse: "à recharger",
};

export function AuditEnergetique() {
  const etat = useParcoursStore((s) => s.etat);
  const objectifs = useParcoursStore((s) => s.objectifs);
  const climat = useParcoursStore((s) => s.climat);
  const diagnostic = useParcoursStore((s) => s.diagnostic);

  const noterClimat = useParcoursStore((s) => s.noterClimat);

  // Audit robuste (ne plante jamais, même sur un état hérité).
  const audit = auditDepuisEtat(etat, objectifs, climat, diagnostic);

  // « Énergie du moment » — MODIFIABLE à chaque passage. On l'écrit sur le jour
  // courant (en préservant le reste du climat) ; l'audit lit le relevé le plus
  // récent → le chiffre et les jauges bougent aussitôt.
  const jourCourant = progression(etat).jourCourant;
  const climatJour = climat[jourCourant];
  const [energie, setEnergie] = useState<number>(climatJour?.energie ?? audit.global);
  const reglerEnergie = (v: number) => {
    setEnergie(v);
    noterClimat({
      jour: jourCourant,
      date: new Date().toISOString(),
      sommeil: climatJour?.sommeil ?? 60,
      energie: v,
      vagues: climatJour?.vagues ?? 20,
    });
  };

  return (
    <section className="mt-1">
      <div className="mb-2 flex items-center gap-2 font-mono text-[12px] font-semibold uppercase tracking-[0.14em] text-fuchsia">
        <Battery size={13} /> Ton audit énergétique
      </div>

      <div className="relative overflow-hidden rounded-2xl border border-line bg-surface p-6 sm:p-7">
        <div className="relative">
          <div className="font-display text-[1.5rem] font-semibold leading-tight text-ink">
            Ton énergie, aujourd'hui
          </div>
        </div>

        {/* Les 4 piliers — en LECTURE éditoriale, plus en jauges. Le pilier et
            son état, l'état porté par la couleur de notre palette : une page de
            carnet, pas un tableau de bord. */}
        <div className="relative mt-5 divide-y divide-line">
          {audit.directions.map((d) => (
            <div key={d.key} className="flex items-baseline justify-between gap-3 py-2.5 first:pt-0">
              <span className="font-display text-base text-ink">{d.label}</span>
              <span
                className="font-mono text-[11px] font-semibold uppercase tracking-[0.12em]"
                style={{ color: etatColor(d.etat) }}
              >
                {ETAT_LABEL[d.etat]}
              </span>
            </div>
          ))}
        </div>

        {/* Énergie du moment — modifiable à chaque passage (curseur). */}
        <div className="relative mt-5 border-t border-line pt-4">
          <div className="mb-1 flex items-baseline justify-between gap-3">
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
              Mon énergie, là maintenant
            </span>
            <span className="font-display text-base text-ink tnum">{energie}</span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            value={energie}
            aria-label="Mon énergie, là maintenant"
            onChange={(e) => reglerEnergie(Number(e.target.value))}
            className="w-full cursor-pointer"
            style={{ accentColor: "var(--fuchsia)" }}
          />
        </div>

        {/* Lecture : ressource + à recharger → induit une direction */}
        <div className="relative mt-5 border-t border-line pt-4">
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
                Ta ressource
              </div>
              <div className="text-sm font-semibold text-ink">{audit.ressource.label}</div>
            </div>
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
                À recharger
              </div>
              <div className="text-sm font-semibold text-ink">{audit.aRecharger.label}</div>
            </div>
          </div>
          <Link
            href="/progression"
            className="group mt-3 inline-flex items-center gap-1.5 font-mono text-[11px] font-semibold uppercase tracking-[0.1em] text-ink"
          >
            Ajuster mes directions
            <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
