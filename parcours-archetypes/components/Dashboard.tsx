"use client";
// parcours-archetypes/components/Dashboard.tsx
// Le tableau de bord : lit l'état d'évolution via le store, calcule les
// indicateurs, et dispose les 6 visualisations. Style IdentitX, inline.

import { useParcoursStore } from "../store";
import {
  coherenceCourante,
  courbeEvolution,
  equilibreSpheres,
  heatmapEmotions,
  lentilleDominante,
  progression,
  radarCourant,
  topLentilles,
} from "../indicateurs";
import {
  BarreProgression,
  CourbeEvolution,
  EquilibreSpheres,
  HeatmapEmotions,
  JaugeCoherence,
  RadarArchetypes,
} from "./charts";

const LINE = "rgba(255,255,255,0.10)";
const MUTED = "rgba(240,235,246,0.55)";
const INK = "#f2eef5";
const SURFACE = "rgba(255,255,255,0.03)";
const FUCHSIA = "#ff4fa3";
const serif = "var(--font-fraunces), Georgia, serif";
const sans = "var(--font-inter), system-ui, sans-serif";

function Carte({ children, span = 1 }: { children: React.ReactNode; span?: number }) {
  return (
    <div
      style={{
        gridColumn: `span ${span}`,
        borderRadius: 18,
        border: `1px solid ${LINE}`,
        background: SURFACE,
        padding: 20,
      }}
    >
      {children}
    </div>
  );
}

export function Dashboard() {
  const etat = useParcoursStore((s) => s.etat);

  const radar = radarCourant(etat);
  const dom = lentilleDominante(etat);
  const top = topLentilles(etat, 3);
  const prog = progression(etat);
  const vide = etat.historique.length === 0;

  return (
    <div style={{ fontFamily: sans, color: INK }}>
      {/* Bandeau */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase", color: FUCHSIA }}>
          Tableau de bord · Parcours des 12 archétypes
        </div>
        <h1 style={{ fontFamily: serif, fontWeight: 300, fontSize: 32, margin: "8px 0 0", color: INK }}>
          {vide ? "Ton radar va s'éveiller" : dom ? `En ce moment · ${dom.name}` : "Ton radar vivant"}
        </h1>
        {!vide && (
          <p style={{ fontSize: 13, color: MUTED, margin: "6px 0 0" }}>
            Une lentille dominante aujourd'hui, jamais une étiquette : demain,
            la respiration rebat les cartes.
          </p>
        )}
      </div>

      {vide ? (
        <Carte>
          <p style={{ fontSize: 14, color: MUTED, lineHeight: 1.6, margin: 0 }}>
            Vis ta première journée pour éveiller le radar. Rien n'est encore
            écrit : chaque jour ajoute une nuance, et rien ne se fige.
          </p>
        </Carte>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 16,
          }}
        >
          <Carte>
            <RadarArchetypes data={radar} />
          </Carte>

          <Carte>
            <JaugeCoherence valeur={coherenceCourante(etat)} />
            <div style={{ marginTop: 18 }}>
              <div style={{ fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", color: MUTED, marginBottom: 10 }}>
                Top 3 lentilles actives
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {top.map((t, i) => (
                  <div key={t.key} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontFamily: serif, color: MUTED, width: 16 }}>{i + 1}</span>
                    <span style={{ flex: 1, fontSize: 13 }}>{t.name}</span>
                    <span style={{ fontFamily: serif, fontSize: 15, color: INK }}>{t.valeur}</span>
                  </div>
                ))}
              </div>
            </div>
          </Carte>

          <Carte>
            <CourbeEvolution data={courbeEvolution(etat)} />
          </Carte>

          <Carte>
            <EquilibreSpheres data={equilibreSpheres(etat)} />
          </Carte>

          <Carte>
            <HeatmapEmotions data={heatmapEmotions(etat)} />
          </Carte>

          <Carte>
            <BarreProgression progression={prog} />
          </Carte>
        </div>
      )}
    </div>
  );
}
