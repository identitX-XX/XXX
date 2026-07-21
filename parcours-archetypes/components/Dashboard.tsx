"use client";
// parcours-archetypes/components/Dashboard.tsx
// Le tableau de bord : lit l'état d'évolution via le store, calcule les
// indicateurs, et dispose les 6 visualisations. Style IdentitX, inline.

import { useParcoursStore } from "../store";
import { genererRevelations } from "../revelations";
import {
  coherenceCourante,
  courbeEvolution,
  equilibreSpheres,
  heatmapEmotions,
  archetypeDominant,
  progression,
  radarCourant,
  topArchetypes,
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
  const dom = archetypeDominant(etat);
  const top = topArchetypes(etat, 3);
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
            L'archétype qui ressort aujourd'hui, jamais une étiquette : demain,
            la respiration rebat les cartes.
          </p>
        )}
      </div>

      <Revelations />

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
                Top 3 archétypes actifs
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

// Bloc « Ce qui ressort » : les révélations sourcées & falsifiables. Chaque
// insight cite sa preuve ; l'utilisatrice peut l'infirmer (« Pas vraiment »),
// ce qui l'écarte — la crédibilité se gagne, elle ne se décrète pas.
function Revelations() {
  const etat = useParcoursStore((s) => s.etat);
  const reponses = useParcoursStore((s) => s.reponses);
  const feedback = useParcoursStore((s) => s.revelationsFeedback);
  const noter = useParcoursStore((s) => s.noterRevelation);

  const toutes = genererRevelations(etat, reponses);
  const visibles = toutes.filter((r) => feedback[r.id] !== "non").slice(0, 3);
  if (visibles.length === 0) return null;

  return (
    <div
      style={{
        marginBottom: 24,
        borderRadius: 18,
        border: `1px solid ${LINE}`,
        background:
          "radial-gradient(130% 130% at 0% 0%, rgba(255,79,163,0.07), rgba(255,255,255,0.02) 60%)",
        padding: 22,
      }}
    >
      <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 4 }}>
        <span style={{ fontFamily: serif, fontWeight: 400, fontSize: 22, color: INK }}>
          Ce qui ressort
        </span>
        <span style={{ fontSize: 12, color: MUTED }}>
          d'après tes {etat.historique.length} journées · sourcé, jamais une étiquette
        </span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 14 }}>
        {visibles.map((r) => {
          const confirme = feedback[r.id] === "oui";
          return (
            <div
              key={r.id}
              style={{
                display: "flex",
                gap: 14,
                paddingTop: 14,
                borderTop: `1px solid ${LINE}`,
              }}
            >
              <span
                style={{
                  flex: "none",
                  marginTop: 6,
                  width: 8,
                  height: 8,
                  borderRadius: 3,
                  background: "linear-gradient(180deg, #ff4fa3, #ff8a4c)",
                }}
              />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, color: INK, lineHeight: 1.45 }}>{r.titre}</div>
                <div style={{ fontSize: 12.5, color: MUTED, marginTop: 4, lineHeight: 1.5 }}>
                  {r.preuve}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 10 }}>
                  {confirme ? (
                    <span style={{ fontSize: 12.5, color: FUCHSIA }}>✓ Noté — ça te parle</span>
                  ) : (
                    <>
                      <button
                        onClick={() => noter(r.id, "oui")}
                        style={btnRev(true)}
                      >
                        Ça me parle
                      </button>
                      <button
                        onClick={() => noter(r.id, "non")}
                        style={btnRev(false)}
                      >
                        Pas vraiment
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function btnRev(primary: boolean): React.CSSProperties {
  return {
    fontFamily: sans,
    fontSize: 12.5,
    padding: "6px 13px",
    borderRadius: 999,
    cursor: "pointer",
    color: primary ? "#fff" : MUTED,
    border: primary ? "none" : `1px solid ${LINE}`,
    background: primary ? "linear-gradient(90deg,#ff4fa3,#ff8a4c)" : "transparent",
  };
}
