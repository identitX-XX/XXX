"use client";
// parcours-archetypes/components/Diagnostic.tsx
// L'écran-miroir : 8 questions → ton dominant (+ secondaire) → lance le parcours.

import { useState } from "react";
import Link from "next/link";
import { archetypeByKey } from "../archetypes";
import { QUESTIONS, calculerDiagnostic } from "../sens";
import { ArchetypeKey, Diagnostic as Diag } from "../types";
import { useParcoursStore } from "../store";

const FUCHSIA = "#ff4fa3";
const ORANGE = "#ff8a4c";
const LINE = "rgba(255,255,255,0.10)";
const MUTED = "rgba(240,235,246,0.55)";
const INK = "#f2eef5";
const SURFACE = "rgba(255,255,255,0.03)";
const serif = "var(--font-fraunces), Georgia, serif";
const sans = "var(--font-inter), system-ui, sans-serif";

export function Diagnostic() {
  const initialiserParcours = useParcoursStore((s) => s.initialiserParcours);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, ArchetypeKey>>({});
  const [result, setResult] = useState<Diag | null>(null);

  const total = QUESTIONS.length;
  const q = QUESTIONS[step];

  const choisir = (arch: ArchetypeKey) => {
    const next = { ...answers, [q.id]: arch };
    setAnswers(next);
    if (step < total - 1) {
      setStep(step + 1);
    } else {
      setResult(calculerDiagnostic(next));
    }
  };

  if (result) {
    const dom = archetypeByKey[result.dominant];
    const sec = archetypeByKey[result.secondaire];
    return (
      <div style={wrap}>
        <div style={{ fontSize: 11, letterSpacing: ".22em", textTransform: "uppercase", color: FUCHSIA }}>
          Ton miroir
        </div>
        <h1 style={h1}>Ton archétype</h1>
        <p style={{ color: MUTED, fontSize: 15, margin: "0 0 22px" }}>
          Ce qui te met le plus en mouvement, d'après tes réponses. Pas une
          étiquette : un point de départ, qui va respirer sur 30 jours.
        </p>

        <div style={{ ...card, borderColor: "color-mix(in srgb, #ff4fa3 40%, rgba(255,255,255,.1))" }}>
          <div style={{ fontSize: 11, letterSpacing: ".18em", textTransform: "uppercase", color: FUCHSIA }}>
            Archétype
          </div>
          <div style={{ fontFamily: serif, fontSize: 26, color: INK, margin: "4px 0 6px" }}>{dom.name}</div>
          <p style={{ margin: 0, color: MUTED, fontSize: 14.5, lineHeight: 1.55 }}>{dom.lens}</p>
        </div>

        <div style={{ ...card, marginTop: 12 }}>
          <div style={{ fontSize: 11, letterSpacing: ".18em", textTransform: "uppercase", color: MUTED }}>
            Secondaire
          </div>
          <div style={{ fontFamily: serif, fontSize: 20, color: INK, margin: "4px 0 6px" }}>{sec.name}</div>
          <p style={{ margin: 0, color: MUTED, fontSize: 14, lineHeight: 1.5 }}>{sec.lens}</p>
        </div>

        <button style={cta} onClick={() => initialiserParcours(result)}>
          Commencer mon parcours 30 jours →
        </button>
        <button
          style={ghost}
          onClick={() => { setResult(null); setStep(0); setAnswers({}); }}
        >
          Refaire ma quête
        </button>
      </div>
    );
  }

  return (
    <div style={wrap}>
      <div style={{ fontSize: 11, letterSpacing: ".22em", textTransform: "uppercase", color: FUCHSIA }}>
        Ma quête · ~3 min
      </div>
      <h1 style={h1}>Je commence ma quête</h1>
      <p style={{ color: MUTED, fontSize: 15, margin: "8px 0 0", lineHeight: 1.5 }}>
        En 12 questions, on repère — parmi <strong style={{ color: INK }}>12 archétypes</strong> —
        celui qui te met le plus en mouvement. Il ouvrira tes 30 jours.
      </p>
      <Link
        href="/parcours-archetypes/objectif"
        style={{ display: "inline-block", marginTop: 10, color: FUCHSIA, fontSize: 13, textDecoration: "none" }}
      >
        Voir les 12 archétypes et l'objectif →
      </Link>

      {/* Progress */}
      <div style={{ display: "flex", gap: 5, margin: "14px 0 26px" }}>
        {QUESTIONS.map((_, i) => (
          <div
            key={i}
            style={{
              height: 4, flex: 1, borderRadius: 999,
              background: i <= step ? `linear-gradient(90deg, ${FUCHSIA}, ${ORANGE})` : LINE,
              transition: "background .4s",
            }}
          />
        ))}
      </div>

      <div key={step} className="animate-fade-up">
        <div style={{ fontSize: 13, color: MUTED, marginBottom: 6 }}>
          Question {step + 1} / {total}
        </div>
        <h2 style={{ fontFamily: serif, fontWeight: 400, fontSize: 24, color: INK, margin: "0 0 18px", lineHeight: 1.2 }}>
          {q.question}
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {q.options.map((o) => (
            <button
              key={o.archetype + o.label}
              onClick={() => choisir(o.archetype)}
              style={optBtn}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = FUCHSIA; e.currentTarget.style.color = INK; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = LINE; e.currentTarget.style.color = INK; }}
            >
              {o.label}
            </button>
          ))}
        </div>
      </div>

      {step > 0 && (
        <button style={ghost} onClick={() => setStep(step - 1)}>← Question précédente</button>
      )}
    </div>
  );
}

const wrap: React.CSSProperties = { maxWidth: 560, margin: "0 auto", fontFamily: sans, color: INK };
const h1: React.CSSProperties = { fontFamily: serif, fontWeight: 300, fontSize: 32, margin: "8px 0 0", color: INK };
const card: React.CSSProperties = { background: SURFACE, border: `1px solid ${LINE}`, borderRadius: 16, padding: "18px 20px" };
const optBtn: React.CSSProperties = {
  textAlign: "left", padding: "15px 18px", borderRadius: 14,
  border: `1px solid ${LINE}`, background: SURFACE, color: INK,
  fontFamily: sans, fontSize: 15, cursor: "pointer", transition: "border-color .2s",
};
const cta: React.CSSProperties = {
  marginTop: 22, width: "100%", padding: "15px 24px", borderRadius: 999,
  border: "none", color: "#fff", fontSize: 15, fontWeight: 600, cursor: "pointer",
  background: `linear-gradient(90deg, ${FUCHSIA}, ${ORANGE})`,
};
const ghost: React.CSSProperties = {
  marginTop: 12, width: "100%", padding: "10px", borderRadius: 12,
  border: "none", background: "transparent", color: MUTED, fontSize: 13, cursor: "pointer",
};
