"use client";

// « Ta constellation » — la mémoire visuelle du parcours. Chaque capsule vécue
// allume une étoile de plus, posée sur une spirale d'or : le ciel s'étoffe, sans
// jamais de « jour 30 ». C'est le jardin de soi qu'on a envie de faire grandir —
// une raison douce de revenir. Sobre : encre + accent prune, scintillement léger.

import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { useParcoursStore } from "@/parcours-archetypes/store";
import { progression } from "@/parcours-archetypes/indicateurs";
import {
  positionEtoile,
  infoConstellation,
} from "@/parcours-archetypes/constellationVivante";

// Plafond d'étoiles réellement rendues (perf) : au-delà, le halo continue de
// s'intensifier, mais on ne dessine pas des milliers de cercles.
const MAX_RENDU = 90;

export function ConstellationVivante() {
  const etat = useParcoursStore((s) => s.etat);
  const prog = progression(etat);
  const info = infoConstellation(prog.faits);

  const n = Math.min(info.etoiles, MAX_RENDU);
  // Étoiles allumées autour du cœur : i = 1..n (i = 0 est le cœur, « toi »).
  const etoiles = Array.from({ length: n }, (_, k) => positionEtoile(k + 1));
  const derniere = etoiles[etoiles.length - 1] ?? null;

  return (
    <section className="mt-4">
      <div className="mb-2 flex items-center gap-2 text-[12px] font-mono font-semibold uppercase tracking-[0.14em] text-fuchsia">
        <Sparkles size={13} /> Ta constellation
      </div>

      <Link
        href="/progression"
        className="group block overflow-hidden rounded-2xl border border-line bg-surface shadow-soft transition-colors hover:border-fuchsia/40"
        style={{ borderTopWidth: 2, borderTopColor: "var(--prune)" }}
      >
        <div className="flex flex-col items-center gap-4 p-6 sm:flex-row sm:items-center sm:gap-6 sm:p-7">
          {/* Le ciel */}
          <div className="relative flex-none">
            <svg
              width={200}
              height={200}
              viewBox="0 0 240 240"
              aria-hidden="true"
              className="block"
            >
              <defs>
                <radialGradient id="idx-cv-halo" cx="50%" cy="50%" r="55%">
                  <stop offset="0%" stopColor="var(--prune)" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="var(--prune)" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* Halo dont l'intensité croît avec l'exploration. */}
              <circle
                cx="120"
                cy="120"
                r="110"
                fill="url(#idx-cv-halo)"
                opacity={0.06 + info.halo * 0.22}
              />

              {/* Fils de la constellation : cœur → 1ʳᵉ étoile, puis de proche en
                  proche (le trait de la spirale). Très discrets. */}
              <g stroke="var(--prune)" strokeWidth="0.9" strokeLinecap="round" opacity="0.32">
                {etoiles.map((e, k) => {
                  const prev = k === 0 ? { x: 120, y: 120 } : etoiles[k - 1];
                  return <line key={k} x1={prev.x} y1={prev.y} x2={e.x} y2={e.y} />;
                })}
              </g>

              {/* Le cœur — « toi », toujours présent (plus vif dès la 1ʳᵉ capsule). */}
              <circle cx="120" cy="120" r={n > 0 ? 4 : 3} fill="var(--ink)" />
              {n === 0 && (
                <circle cx="120" cy="120" r="7" fill="none" stroke="var(--line)" strokeWidth="1" />
              )}

              {/* Les étoiles allumées : une par capsule vécue. Une sur ~4 en prune
                  pour faire scintiller l'accent chaud. */}
              <g>
                {etoiles.map((e, k) => {
                  const accent = k % 4 === 2;
                  return (
                    <circle
                      key={k}
                      cx={e.x}
                      cy={e.y}
                      r={accent ? 2.4 : 2}
                      fill={accent ? "var(--prune)" : "var(--ink)"}
                      style={{
                        animation: "idx-twinkle 3.6s ease-in-out infinite",
                        animationDelay: `${(k % 6) * 0.4}s`,
                      }}
                    />
                  );
                })}
              </g>

              {/* La dernière allumée pulse une fois de plus — la capsule du moment. */}
              {derniere && (
                <>
                  <circle
                    cx={derniere.x}
                    cy={derniere.y}
                    r="7"
                    fill="none"
                    stroke="var(--prune)"
                    strokeWidth="1.4"
                    style={{
                      transformBox: "fill-box",
                      transformOrigin: "center",
                      animation: "idx-pulse-ring 2.4s ease-out infinite",
                    }}
                  />
                  <circle cx={derniere.x} cy={derniere.y} r="2.6" fill="var(--prune)" />
                </>
              )}
            </svg>
          </div>

          {/* La lecture */}
          <div className="min-w-0 flex-1 text-center sm:text-left">
            <div className="font-display text-[1.6rem] font-semibold leading-tight text-ink">
              {info.palier.nom}
            </div>
            <p className="mt-1.5 text-sm leading-relaxed text-muted">
              {info.etoiles === 0
                ? "Ton ciel est encore vierge. Chaque capsule que tu vis y pose une étoile."
                : `${info.etoiles} étoile${info.etoiles > 1 ? "s" : ""} allumée${
                    info.etoiles > 1 ? "s" : ""
                  } — une par capsule vécue. Ta constellation s'étoffe à ton rythme.`}
            </p>
            <p className="mt-2 text-xs text-fuchsia">{info.phrase}</p>
            <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.08em] text-fuchsia">
              Voir ma progression
              <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
            </span>
          </div>
        </div>
      </Link>
    </section>
  );
}
