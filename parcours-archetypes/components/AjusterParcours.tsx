"use client";

// « AjusterParcours » — le poste de pilotage TOUJOURS accessible : des curseurs
// qui déplacent la cartographie EN DIRECT (fin du figé), et une porte pour
// MODIFIER sa signature sans rien détruire. Deux temps : les curseurs des
// sphères (ta carte bouge pendant que tu règles), puis « ajuster ma signature ».

import { useState } from "react";
import { useParcoursStore } from "../store";
import { equilibreSpheres } from "../indicateurs";
import { SphereKey } from "../types";
import { Diagnostic } from "./Diagnostic";

const FUCHSIA = "var(--fuchsia)";
const ORANGE = "var(--orange)";
const PRUNE = "var(--prune)";
const LINE = "var(--line)";
const MUTED = "var(--muted)";
const INK = "var(--ink)";
const SURFACE = "var(--surface)";
const serif = "var(--font-fraunces), Georgia, serif";
const sans = "var(--font-inter), system-ui, sans-serif";
const mono = "var(--font-mono), ui-monospace, monospace";

// Petit repère pour relier le vocabulaire de l'utilisatrice aux sphères.
const ALIAS: Record<SphereKey, string> = {
  travail: "pro",
  relations: "relationnel",
  creation: "création",
  corps: "perso · santé",
  sens: "identitaire",
};

export function AjusterParcours() {
  const diagnostic = useParcoursStore((s) => s.diagnostic);
  const etat = useParcoursStore((s) => s.etat);
  const ajusterSpheres = useParcoursStore((s) => s.ajusterSpheres);
  const [edit, setEdit] = useState(false);
  const [ouvert, setOuvert] = useState(false);

  if (!diagnostic) return null;

  // Mode « modifier ma signature » : on remplace le panneau par le questionnaire
  // pré-rempli (non destructif). On revient au panneau une fois terminé.
  if (edit) {
    return (
      <section style={{ margin: "8px 0 28px" }}>
        <Diagnostic mode="ajuster" onDone={() => setEdit(false)} />
      </section>
    );
  }

  const spheres = equilibreSpheres(etat);

  return (
    <section
      style={{
        margin: "4px 0 28px",
        borderRadius: 18,
        border: `1px solid ${LINE}`,
        background: SURFACE,
        overflow: "hidden",
      }}
    >
      {/* En-tête — toujours là, dépliable. */}
      <button
        onClick={() => setOuvert((v) => !v)}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          padding: "16px 18px",
          background: "none",
          border: "none",
          cursor: "pointer",
          textAlign: "left",
        }}
      >
        <span>
          <span style={{ fontFamily: mono, fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: PRUNE }}>
            Ajuster
          </span>
          <span style={{ display: "block", fontFamily: serif, fontSize: 19, color: INK, marginTop: 3 }}>
            Ta carte, ta signature
          </span>
        </span>
        <span style={{ color: MUTED, fontSize: 22, lineHeight: 1, transform: ouvert ? "rotate(45deg)" : "none", transition: "transform .2s" }}>
          ＋
        </span>
      </button>

      {ouvert && (
        <div className="animate-fade-up" style={{ padding: "2px 18px 20px", fontFamily: sans, color: INK }}>
          <p style={{ fontSize: 13.5, lineHeight: 1.55, color: MUTED, margin: "0 0 16px" }}>
            Déplace un curseur : ta <b style={{ color: INK }}>cartographie bouge en direct</b>.
            Rien n'est figé — tu sculptes ta carte quand tu veux, entre deux capsules.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {spheres.map((sp) => (
              <div key={sp.key}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--ink)", flex: "none" }} />
                    <span style={{ fontSize: 14, color: INK }}>{sp.label}</span>
                    <span style={{ fontSize: 11.5, color: MUTED }}>· {ALIAS[sp.key]}</span>
                  </span>
                  <span style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                    <span style={{ fontFamily: serif, fontSize: 16, color: INK, fontVariantNumeric: "tabular-nums" }}>{sp.valeur}</span>
                    <span style={{ fontFamily: mono, fontSize: 11, color: MUTED }}>{sp.part}%</span>
                  </span>
                </div>
                {/* Barre « part » — la cartographie en miniature, qui réagit. */}
                <div style={{ height: 6, borderRadius: 999, background: LINE, overflow: "hidden", marginBottom: 8 }}>
                  <div
                    style={{
                      height: "100%",
                      width: `${sp.part}%`,
                      borderRadius: 999,
                      background: `linear-gradient(90deg, ${FUCHSIA}, ${ORANGE})`,
                      transition: "width .25s var(--ease-out)",
                    }}
                  />
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={sp.valeur}
                  aria-label={`Énergie ${sp.label}`}
                  onChange={(e) => ajusterSpheres({ [sp.key]: Number(e.target.value) })}
                  style={{ width: "100%", accentColor: FUCHSIA, cursor: "pointer" }}
                />
              </div>
            ))}
          </div>

          <div style={{ borderTop: `1px solid ${LINE}`, margin: "18px 0 0", paddingTop: 16 }}>
            <div style={{ fontSize: 13, color: MUTED, marginBottom: 10, lineHeight: 1.5 }}>
              Ta signature ne te correspond plus tout à fait ? Tu peux revoir tes
              réponses — <b style={{ color: INK }}>sans perdre tes capsules ni ta carte</b>.
            </div>
            <button
              onClick={() => setEdit(true)}
              style={{
                width: "100%",
                padding: "13px 18px",
                minHeight: 46,
                borderRadius: 12,
                border: `1px solid ${LINE}`,
                background: "transparent",
                color: INK,
                fontFamily: sans,
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Ajuster ma signature →
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
