"use client";

// « Ton chemin » — la colonne vertébrale visuelle de l'app : trois stations
// reliées, Archétype → La Mue → Tes Choix, qui se révèlent DANS L'ORDRE de la
// progression (verrouillées tant que la précédente n'est pas atteinte). Le
// graphique d'abord ; les parties écrites restent accessibles à la demande
// (un tap ouvre le détail) pour épurer l'écran. Branché sur les vraies données :
// diagnostic réel, mue détectée depuis l'historique, choix débloqués par la mue.

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, Compass, Lock, Route, Shuffle } from "lucide-react";
import { useParcoursStore } from "@/parcours-archetypes/store";
import { archetypeByKey } from "@/parcours-archetypes/archetypes";
import { basculeDepuisHistorique } from "@/lib/turbine/fromParcours";

type Etat = "fait" | "encours" | "avenir";

interface Station {
  label: string;
  icon: React.ReactNode;
  etat: Etat;
  valeur: string; // statut court, toujours visible sous la station
  detail: string; // la partie écrite, révélée au tap
  cta?: { href: string; label: string };
}

export function LeChemin({ mapOnly = false }: { mapOnly?: boolean }) {
  const diagnostic = useParcoursStore((s) => s.diagnostic);
  const etat = useParcoursStore((s) => s.etat);
  const bascule = basculeDepuisHistorique(etat.historique);

  const arch = diagnostic ? archetypeByKey[diagnostic.dominant] : null;

  const stations: Station[] = [
    // 1 — Archétype
    diagnostic && arch
      ? {
          label: "Ta signature",
          icon: <Compass size={20} />,
          etat: "fait",
          valeur: arch.name,
          detail: `Ton schéma dominant : ${arch.name}. ${arch.lens}`,
          cta: { href: "/parcours-signatures", label: "Revoir ta signature" },
        }
      : {
          label: "Ta signature",
          icon: <Compass size={20} />,
          etat: "encours",
          valeur: "À révéler",
          detail:
            "12 questions pour faire émerger tes identités dominantes — le seuil de ta quête.",
          cta: { href: "/parcours-signatures", label: "Révéler ma signature" },
        },
    // 2 — Ton vortex
    bascule
      ? {
          label: "Ton vortex",
          icon: <Shuffle size={20} />,
          etat: "fait",
          valeur: "Révélé",
          detail: `De ${bascule.precedent} à ${bascule.actuel}. ${bascule.bascule}`,
          cta: { href: "/scenarios", label: "Voir ce que ça ouvre" },
        }
      : diagnostic
      ? {
          label: "Ton vortex",
          icon: <Shuffle size={20} />,
          etat: "encours",
          valeur: "En observation",
          detail:
            "Ton vortex se déclenche quand ta signature dominante bascule — et qu'elle tient. Continue ta quête : il se révèle de lui-même.",
          cta: { href: "/parcours-signatures", label: "Continuer ma quête" },
        }
      : {
          label: "Ton vortex",
          icon: <Shuffle size={20} />,
          etat: "avenir",
          valeur: "Après la signature",
          detail:
            "Le mouvement dans ton narratif. Il apparaît une fois ta signature révélée, quand celle-ci commence à bouger.",
        },
    // 3 — Tes Choix
    bascule
      ? {
          label: "Tes possibles",
          icon: <Route size={20} />,
          etat: "encours",
          valeur: "À explorer",
          detail:
            "Des expériences à tenter, générées pour ton vortex. Ce qui construit ta réalité — pas un portrait à contempler.",
          cta: { href: "/scenarios", label: "Découvrir mes possibles" },
        }
      : {
          label: "Tes possibles",
          icon: <Route size={20} />,
          etat: "avenir",
          valeur: "Scénarios",
          detail:
            "Tes scénarios possibles se déploient avec ton premier vortex : c'est lui qui rend de nouvelles expériences envisageables. Tu peux déjà les entrouvrir.",
          cta: { href: "/scenarios", label: "Voir les scénarios" },
        },
  ];

  // La station « active » = la première non accomplie (là où agir maintenant).
  const activeIndex = Math.max(
    0,
    stations.findIndex((s) => s.etat !== "fait")
  );
  const [selected, setSelected] = useState(
    activeIndex === -1 ? stations.length - 1 : activeIndex
  );

  const s = stations[selected];

  return (
    <section className="mb-6 animate-fade-up">
      <div className="mb-3 flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-fuchsia">
        <Route size={13} /> Ton chemin
      </div>

      <div className="rounded-2xl border border-line bg-surface p-5 shadow-soft sm:p-6">
        {/* La colonne vertébrale : trois stations reliées, graphique d'abord. */}
        <div className="flex items-start justify-between">
          {stations.map((st, i) => (
            <div key={st.label} className="flex flex-1 items-start">
              <button
                onClick={() => setSelected(i)}
                className="group flex flex-1 flex-col items-center gap-2 text-center focus:outline-none"
                aria-pressed={selected === i}
              >
                <Pastille st={st} actif={selected === i} />
                <span
                  className={`text-[12px] font-medium uppercase tracking-[0.1em] transition-colors ${
                    selected === i ? "text-ink" : "text-muted"
                  }`}
                >
                  {st.label}
                </span>
                <span
                  className={`max-w-[10ch] text-[12px] leading-tight ${
                    st.etat === "avenir" ? "text-muted/60" : "text-muted"
                  }`}
                >
                  {st.valeur}
                </span>
              </button>

              {/* Flèche de liaison — dorée dès que la station de gauche est acquise. */}
              {i < stations.length - 1 && (
                <ArrowRight
                  size={16}
                  className="mt-4 flex-none"
                  style={{
                    color:
                      st.etat === "fait"
                        ? "var(--fuchsia)"
                        : "color-mix(in srgb, var(--muted) 45%, transparent)",
                  }}
                />
              )}
            </div>
          ))}
        </div>

        {/* Le détail de la station choisie — la partie écrite, à la demande.
            En « mapOnly » (ex. l'amorce, où une carte porte déjà le message et
            l'action), on ne montre que la carte des stations, sans doublon. */}
        {!mapOnly && (
          <div
            key={selected}
            className="mt-5 border-t border-line pt-4 animate-fade-in"
          >
            <p className="text-sm leading-relaxed text-ink">{s.detail}</p>
            {s.cta && (
              <Link
                href={s.cta.href}
                className="group mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-fuchsia"
              >
                {s.cta.label}
                <ArrowRight
                  size={14}
                  className="transition-transform group-hover:translate-x-0.5"
                />
              </Link>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

// La pastille d'une station : accomplie (or plein + coche), en cours (anneau or
// + aura pulsée), ou à venir (pointillés + cadenas).
function Pastille({ st, actif }: { st: Station; actif: boolean }) {
  const size = 52;
  if (st.etat === "fait") {
    return (
      <span
        className={`relative grid place-items-center rounded-full brand-gradient text-white transition-transform ${
          actif ? "scale-105" : ""
        }`}
        style={{ width: size, height: size }}
      >
        <Check size={22} />
      </span>
    );
  }
  if (st.etat === "encours") {
    return (
      <span className="relative grid place-items-center" style={{ width: size, height: size }}>
        <span
          aria-hidden
          className="absolute inset-0 rounded-full opacity-40"
          style={{
            background:
              "radial-gradient(circle, var(--fuchsia), transparent 70%)",
            animation: "idx-twinkle 2.4s ease-in-out infinite",
          }}
        />
        <span
          className="relative grid h-full w-full place-items-center rounded-full bg-surface"
          style={{
            boxShadow: `inset 0 0 0 2px var(--fuchsia)`,
            color: "var(--fuchsia)",
            transform: actif ? "scale(1.05)" : undefined,
          }}
        >
          {st.icon}
        </span>
      </span>
    );
  }
  // à venir
  return (
    <span
      className="grid place-items-center rounded-full border border-dashed text-muted"
      style={{
        width: size,
        height: size,
        borderColor: "color-mix(in srgb, var(--muted) 40%, transparent)",
        opacity: actif ? 0.9 : 0.6,
      }}
    >
      <Lock size={18} />
    </span>
  );
}
