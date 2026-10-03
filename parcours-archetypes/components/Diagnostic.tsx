"use client";
// parcours-archetypes/components/Diagnostic.tsx
// L'écran-miroir : 8 questions → ton dominant (+ secondaire) → lance le parcours.

import { useEffect, useState } from "react";
import { archetypeByKey } from "../archetypes";
import { QUESTIONS, calculerDiagnostic } from "../sens";
import { ArchetypeKey, Diagnostic as Diag } from "../types";
import { useParcoursStore } from "../store";
import { track } from "@/lib/metrics";
import { ADN } from "@/components/ParcoursGraphics";
import { SignatureReveal } from "@/components/SignatureReveal";
import { ConstellationProgress } from "@/components/ConstellationProgress";

const FUCHSIA = "var(--fuchsia)";
const ORANGE = "var(--orange)";
const LINE = "var(--line)";
const MUTED = "var(--muted)";
const INK = "var(--ink)";
const SURFACE = "var(--surface)";
const RAISED = "var(--raised)";
const PRUNE = "var(--prune)";
const serif = "var(--font-fraunces), Georgia, serif";
const sans = "var(--font-inter), system-ui, sans-serif";
const mono = "var(--font-mono), ui-monospace, monospace";

export function Diagnostic() {
  const initialiserParcours = useParcoursStore((s) => s.initialiserParcours);
  const [started, setStarted] = useState(false);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, ArchetypeKey>>({});
  const [result, setResult] = useState<Diag | null>(null);

  const total = QUESTIONS.length;
  const q = QUESTIONS[step];

  // Chaque nouvelle question (ou l'écran-résultat) repart du haut : on ne laisse
  // jamais l'utilisatrice « accrochée » en bas après avoir tapé une réponse.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [step, result]);

  const choisir = (arch: ArchetypeKey) => {
    const next = { ...answers, [q.id]: arch };
    setAnswers(next);
    if (step < total - 1) {
      setStep(step + 1);
    } else {
      const diag = calculerDiagnostic(next);
      track("quiz_completed", { dominant: diag.dominant });
      setResult(diag);
    }
  };

  if (result) {
    // Écran de révélation : la constellation générative se construit, puis la
    // signature émerge. La logique métier (initialiserParcours) est préservée.
    return (
      <div style={wrap}>
        <SignatureReveal result={result} onExplore={() => initialiserParcours(result)} />
      </div>
    );
  }

  // Écran d'amorce premium — on arrive ici juste après la présentation. On pose
  // le sens (« détermine ta signature ») avec l'ADN, avant les questions : plus
  // d'entrée brutale sur un quiz nu.
  if (!started) {
    return (
      <div style={wrap}>
        <div style={{ fontSize: 12, letterSpacing: ".22em", fontWeight: 700, textTransform: "uppercase", color: FUCHSIA, textAlign: "center" }}>
          Ta signature · ~3 min
        </div>
        <div style={{ maxWidth: 340, margin: "26px auto 0" }}>
          <ADN />
        </div>
        <h1 className="fr-title" style={{ ...h1, fontSize: 30, textAlign: "center", margin: "20px 0 0" }}>
          Détermine ta signature
        </h1>
        <p style={{ color: MUTED, fontSize: 15.5, lineHeight: 1.6, textAlign: "center", maxWidth: 420, margin: "12px auto 0" }}>
          12 questions révèlent ta <b style={{ color: INK }}>signature principale</b> et ta{" "}
          <b style={{ color: INK }}>secondaire</b>. Pas un test — un miroir de ce qui te met
          en mouvement, aujourd'hui.
        </p>
        <button style={cta} onClick={() => setStarted(true)}>
          Commencer les questions →
        </button>
      </div>
    );
  }

  const repondu = Object.keys(answers).length;
  return (
    <div
      style={{
        maxWidth: 580,
        margin: "0 auto",
        fontFamily: sans,
        color: INK,
        minHeight: "72vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* La constellation se compose à chaque réponse — silence & espace. */}
      <div style={{ display: "flex", justifyContent: "center", paddingTop: 8 }}>
        <ConstellationProgress count={repondu} total={total} />
      </div>

      {/* La question, posée seule, avec beaucoup d'air (le vide fait partie du design). */}
      <div key={step} className="animate-fade-up" style={{ marginTop: "auto", paddingTop: 22 }}>
        <div style={{ fontFamily: mono, fontSize: 13, letterSpacing: "0.22em", color: MUTED }}>
          {String(step + 1).padStart(2, "0")}
          <span style={{ opacity: 0.5 }}> / {String(total).padStart(2, "0")}</span>
        </div>
        <h2
          className="fr-title"
          style={{
            fontFamily: serif,
            fontWeight: 400,
            fontSize: 34,
            color: INK,
            margin: "16px 0 26px",
            lineHeight: 1.12,
          }}
        >
          {q.question}
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
          {q.options.map((o) => {
            // Au retour sur une question, la réponse déjà donnée est pré-sélectionnée.
            const sel = answers[q.id] === o.archetype;
            return (
              <button
                key={o.archetype + o.label}
                onClick={() => choisir(o.archetype)}
                style={{
                  ...optBtn,
                  borderColor: sel ? PRUNE : LINE,
                  background: sel ? "color-mix(in srgb, var(--prune) 7%, var(--raised))" : RAISED,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = PRUNE;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = sel ? PRUNE : LINE;
                }}
              >
                {o.label}
              </button>
            );
          })}
        </div>

        {step > 0 && (
          <button style={ghost} onClick={() => setStep(step - 1)}>
            ← Précédent
          </button>
        )}
      </div>
    </div>
  );
}

const wrap: React.CSSProperties = { maxWidth: 560, margin: "0 auto", fontFamily: sans, color: INK };
const h1: React.CSSProperties = { fontFamily: serif, fontWeight: 600, fontSize: 32, margin: "8px 0 0", color: INK };
const optBtn: React.CSSProperties = {
  textAlign: "left", padding: "15px 18px", borderRadius: 14,
  border: `1px solid ${LINE}`, background: SURFACE, color: INK,
  fontFamily: sans, fontSize: 15, cursor: "pointer", transition: "border-color .2s",
};
const cta: React.CSSProperties = {
  marginTop: 22, width: "100%", padding: "17px 26px", minHeight: 52, borderRadius: 12,
  border: "none", color: "var(--on-brand)", fontSize: 16, fontWeight: 600, cursor: "pointer",
  background: FUCHSIA,
};
const ghost: React.CSSProperties = {
  marginTop: 12, width: "100%", padding: "10px", borderRadius: 12,
  border: "none", background: "transparent", color: MUTED, fontSize: 13, cursor: "pointer",
};
