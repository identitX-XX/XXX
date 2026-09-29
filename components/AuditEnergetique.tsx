"use client";

// « Ton audit énergétique » — la pièce maîtresse de l'accueil, à la place de la
// capsule. Lecture AUTOMATIQUE (rien à remplir) de l'énergie disponible sur tes
// 4 piliers, dérivée de ce qu'on sait déjà de toi. Elle rend visible ta
// ressource (pilier chargé) et ce qui est à recharger — et INDUIT une direction.
// Design nuancé : jauges en dégradé de gris (de l'ombre à la lumière), carte en
// profondeur, tout en fusain & blanc.

import Link from "next/link";
import { ArrowRight, Battery } from "lucide-react";
import { useParcoursStore } from "@/parcours-archetypes/store";
import { equilibreSpheres } from "@/parcours-archetypes/indicateurs";
import {
  auditEnergetique,
  SpheresValeurs,
  CreditDirection,
} from "@/parcours-archetypes/auditEnergetique";

// Teinte de remplissage selon l'état — la nuance porte l'information : plus c'est
// chargé, plus la jauge va vers la lumière (blanc) ; plus c'est bas, plus elle
// reste dans l'ombre (gris).
function fillDe(etat: CreditDirection["etat"]): string {
  if (etat === "haute")
    return "linear-gradient(90deg, color-mix(in srgb, var(--ink) 55%, var(--muted)), var(--ink))";
  if (etat === "stable")
    return "linear-gradient(90deg, color-mix(in srgb, var(--muted) 70%, var(--noir)), color-mix(in srgb, var(--ink) 82%, var(--muted)))";
  return "linear-gradient(90deg, color-mix(in srgb, var(--muted) 45%, var(--noir)), var(--muted))";
}

const ETAT_LABEL: Record<CreditDirection["etat"], string> = {
  haute: "chargé",
  stable: "stable",
  basse: "à recharger",
};

export function AuditEnergetique() {
  const etat = useParcoursStore((s) => s.etat);
  const objectifs = useParcoursStore((s) => s.objectifs);
  const climat = useParcoursStore((s) => s.climat);
  const diagnostic = useParcoursStore((s) => s.diagnostic);

  // Sphères → valeurs brutes.
  const sph = equilibreSpheres(etat);
  const val = (k: string) => sph.find((s) => s.key === k)?.valeur ?? 0;
  const map: SpheresValeurs = {
    travail: val("travail"),
    relations: val("relations"),
    creation: val("creation"),
    corps: val("corps"),
    sens: val("sens"),
  };

  // Énergie du moment : moyenne des relevés de climat, sinon inconnue.
  const vals = Object.values(climat || {})
    .map((c) => (c && typeof c.energie === "number" ? c.energie : null))
    .filter((n): n is number => n !== null);
  const energie = vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : null;

  const audit = auditEnergetique(map, objectifs, energie, diagnostic);

  return (
    <section className="mt-1">
      <div className="mb-2 flex items-center gap-2 font-mono text-[12px] font-semibold uppercase tracking-[0.14em] text-fuchsia">
        <Battery size={13} /> Ton audit énergétique
      </div>

      <div
        className="relative overflow-hidden rounded-2xl border border-line p-6 shadow-soft sm:p-7"
        style={{
          // Profondeur : dégradé subtil du haut (plus clair) vers le fond — de la
          // nuance, pas un aplat.
          background:
            "linear-gradient(180deg, color-mix(in srgb, var(--raised) 75%, var(--surface)), var(--surface) 58%)",
          borderTopWidth: 2,
          borderTopColor: "var(--prune)",
        }}
      >
        {/* Halo diffus en haut à droite pour la profondeur. */}
        <div
          aria-hidden
          className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full"
          style={{
            background:
              "radial-gradient(closest-side, color-mix(in srgb, var(--ink) 8%, transparent), transparent)",
          }}
        />

        <div className="relative flex items-end justify-between">
          <div>
            <div className="font-display text-[1.5rem] font-semibold leading-tight text-ink">
              Ton énergie, aujourd'hui
            </div>
            <p className="mt-1 text-sm text-muted">
              Lu automatiquement dans ce que tu as déjà déposé.
            </p>
          </div>
          <div className="text-right">
            <div className="font-display text-3xl font-semibold leading-none text-ink tnum">
              {audit.global}
            </div>
            <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
              /100
            </div>
          </div>
        </div>

        {/* Les 4 jauges */}
        <div className="relative mt-5 grid gap-3.5">
          {audit.directions.map((d) => (
            <div key={d.key}>
              <div className="mb-1 flex items-baseline justify-between gap-3">
                <span className="text-sm font-semibold text-ink">{d.label}</span>
                <span className="flex items-baseline gap-2">
                  <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted">
                    {ETAT_LABEL[d.etat]}
                  </span>
                  <span className="text-sm text-ink tnum">{d.credit}</span>
                </span>
              </div>
              <div
                className="h-2.5 w-full overflow-hidden rounded-full"
                style={{ background: "color-mix(in srgb, var(--ink) 8%, transparent)" }}
              >
                <div
                  className="h-full rounded-full transition-[width] duration-700"
                  style={{ width: `${d.credit}%`, background: fillDe(d.etat) }}
                />
              </div>
            </div>
          ))}
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
          <p className="mt-3 text-sm leading-relaxed text-muted">{audit.phrase}</p>
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
