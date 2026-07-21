"use client";
// parcours-archetypes/components/Objectifs.tsx
// Poser / ajuster un objectif par périmètre de vie (perso / pro / relationnel).
// Utilisé au départ ("Pose ton cap") ET pour modifier en cours de route.

import { useState } from "react";
import { archetypeByKey } from "../archetypes";
import { Objectifs as ObjectifsT, PerimetreKey } from "../types";
import { useParcoursStore } from "../store";

const FUCHSIA = "#ff4fa3";
const ORANGE = "#ff8a4c";
const LINE = "rgba(255,255,255,0.10)";
const MUTED = "rgba(240,235,246,0.55)";
const INK = "#f2eef5";
const NOIR = "#0a090d";
const serif = "var(--font-fraunces), Georgia, serif";
const sans = "var(--font-inter), system-ui, sans-serif";

const CHAMPS: { key: PerimetreKey; emoji: string; label: string; hint: string }[] = [
  { key: "perso", emoji: "🌱", label: "Perso", hint: "Pour toi : ton équilibre, ton corps, ton sens, ta création." },
  { key: "pro", emoji: "💼", label: "Pro", hint: "Côté travail et projets : ce que tu veux faire avancer." },
  { key: "relationnel", emoji: "🤝", label: "Relationnel", hint: "Dans tes liens : couple, famille, amis." },
];

const VIDE: ObjectifsT = { perso: "", pro: "", relationnel: "" };

export function Objectifs({
  initial,
  eyebrow = "Ma quête · le cap",
  titre = "Pose ton cap",
  intro,
  submitLabel = "Entrer dans mes 30 jours →",
  onSubmit,
  onCancel,
}: {
  initial?: ObjectifsT;
  eyebrow?: string;
  titre?: string;
  intro?: React.ReactNode;
  submitLabel?: string;
  onSubmit?: (o: ObjectifsT) => void;
  onCancel?: () => void;
}) {
  const diagnostic = useParcoursStore((s) => s.diagnostic);
  const definirObjectifs = useParcoursStore((s) => s.definirObjectifs);
  const [vals, setVals] = useState<ObjectifsT>(initial ?? VIDE);

  const set = (k: PerimetreKey, v: string) => setVals((p) => ({ ...p, [k]: v }));
  const auMoinsUn = Object.values(vals).some((v) => v.trim().length > 0);
  const arch = diagnostic ? archetypeByKey[diagnostic.dominant] : null;
  const submit = () => (onSubmit ?? definirObjectifs)(vals);

  const introDefaut = (
    <>
      {arch ? <>Ton archétype <strong style={{ color: INK }}>{arch.name}</strong> t'accompagnera. </> : null}
      Avant d'entrer dans tes 30 jours, formule un objectif par périmètre. Même
      flou, il te sert de boussole — on le reprécisera au Jour 30.
    </>
  );

  return (
    <div style={{ maxWidth: 620, margin: "0 auto", fontFamily: sans, color: INK }}>
      <div style={{ fontSize: 11, letterSpacing: ".22em", textTransform: "uppercase", color: FUCHSIA }}>
        {eyebrow}
      </div>
      <h1 style={{ fontFamily: serif, fontWeight: 300, fontSize: 32, margin: "8px 0 0", color: INK }}>
        {titre}
      </h1>
      <p style={{ color: MUTED, fontSize: 15, margin: "8px 0 22px", lineHeight: 1.55 }}>
        {intro ?? introDefaut}
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {CHAMPS.map((c) => (
          <div
            key={c.key}
            style={{ borderRadius: 16, border: `1px solid ${LINE}`, background: "rgba(255,255,255,0.03)", padding: "16px 18px" }}
          >
            <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 4 }}>
              <span style={{ fontSize: 16 }}>{c.emoji}</span>
              <span style={{ fontFamily: serif, fontSize: 18, color: INK }}>{c.label}</span>
            </div>
            <div style={{ fontSize: 12.5, color: MUTED, marginBottom: 10 }}>{c.hint}</div>
            <textarea
              value={vals[c.key]}
              onChange={(e) => set(c.key, e.target.value)}
              rows={2}
              placeholder="Mon objectif…"
              style={{
                width: "100%", resize: "none", borderRadius: 12,
                border: `1px solid ${LINE}`, background: NOIR, color: INK,
                fontFamily: sans, fontSize: 14.5, padding: "11px 13px", lineHeight: 1.5,
              }}
            />
          </div>
        ))}
      </div>

      <button
        onClick={submit}
        disabled={!auMoinsUn}
        style={{
          marginTop: 22, width: "100%", padding: "15px 24px", borderRadius: 999,
          border: "none", color: "#fff", fontSize: 15, fontWeight: 600,
          cursor: auMoinsUn ? "pointer" : "default", opacity: auMoinsUn ? 1 : 0.4,
          background: `linear-gradient(90deg, ${FUCHSIA}, ${ORANGE})`,
        }}
      >
        {submitLabel}
      </button>
      {onCancel && (
        <button
          onClick={onCancel}
          style={{
            marginTop: 12, width: "100%", padding: "10px", borderRadius: 12,
            border: "none", background: "transparent", color: MUTED, fontSize: 13, cursor: "pointer",
          }}
        >
          Annuler
        </button>
      )}
    </div>
  );
}
