"use client";

// « SignatureReveal » — l'écran le plus important : la dramaturgie de révélation.
// Calme → la constellation se construit → « Ta signature » → le nom → une phrase
// éditoriale → primaire / secondaire → l'invitation. Rien n'est donné d'un coup :
// l'identité ÉMERGE. Respecte prefers-reduced-motion (tout s'affiche d'emblée).

import { useEffect, useState } from "react";
import { archetypeByKey } from "@/parcours-archetypes/archetypes";
import { compositionSignature } from "@/parcours-archetypes/constellationSignature";
import { SignatureConstellation } from "@/components/SignatureConstellation";
import type { Diagnostic } from "@/parcours-archetypes/types";

const serif = "var(--font-fraunces), Georgia, serif";
const mono = "var(--font-mono), ui-monospace, monospace";

export function SignatureReveal({
  result,
  onExplore,
}: {
  result: Diagnostic;
  onExplore: () => void;
}) {
  const dom = archetypeByKey[result.dominant];
  const sec = archetypeByKey[result.secondaire];
  const composition = compositionSignature(result);

  // Phases : 0 (la constellation se construit) → 1 nom → 2 détails → 3 invitation.
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setPhase(3);
      return;
    }
    const t = [
      setTimeout(() => setPhase(1), 1500),
      setTimeout(() => setPhase(2), 2000),
      setTimeout(() => setPhase(3), 2500),
    ];
    return () => t.forEach(clearTimeout);
  }, []);

  const step = (min: number): React.CSSProperties => ({
    opacity: phase >= min ? 1 : 0,
    transform: phase >= min ? "none" : "translateY(10px)",
    transition: "opacity 0.7s var(--ease-out), transform 0.7s var(--ease-out)",
  });

  return (
    <div style={{ maxWidth: 560, margin: "0 auto", textAlign: "center" }}>
      <div style={{ display: "flex", justifyContent: "center", margin: "4px 0 0" }}>
        <SignatureConstellation composition={composition} size={330} />
      </div>

      <div
        style={{
          ...step(1),
          fontFamily: mono,
          fontSize: 12,
          letterSpacing: "0.26em",
          textTransform: "uppercase",
          color: "var(--prune)",
          marginTop: 4,
        }}
      >
        Ta signature
      </div>

      <h1
        className="fr-title"
        style={{
          ...step(1),
          fontFamily: serif,
          fontWeight: 400,
          fontSize: 44,
          lineHeight: 1.05,
          color: "var(--ink)",
          margin: "10px 0 0",
          transitionDelay: "80ms",
        }}
      >
        {dom.name}
      </h1>

      <p
        style={{
          ...step(2),
          fontFamily: serif,
          fontStyle: "italic",
          fontSize: 18,
          lineHeight: 1.5,
          color: "var(--muted)",
          margin: "14px auto 0",
          maxWidth: 420,
        }}
      >
        {dom.lens}
      </p>

      {/* Primaire · Secondaire */}
      <div
        style={{
          ...step(2),
          display: "flex",
          justifyContent: "center",
          gap: 0,
          margin: "28px 0 0",
          transitionDelay: "120ms",
        }}
      >
        <Pole label="Primaire" name={dom.name} accent />
        <div style={{ width: 1, background: "var(--line)", margin: "4px 22px" }} />
        <Pole label="Secondaire" name={sec.name} />
      </div>

      <p
        style={{
          ...step(3),
          color: "var(--muted)",
          fontSize: 13.5,
          lineHeight: 1.55,
          margin: "26px auto 0",
          maxWidth: 440,
        }}
      >
        Ces signatures ne te définissent pas — elles rendent visibles des dynamiques
        qui te traversent aujourd'hui. Elles respireront au fil de ta quête.
      </p>

      <button
        onClick={onExplore}
        style={{
          ...step(3),
          marginTop: 26,
          minHeight: 48,
          padding: "0 26px",
          borderRadius: 12,
          border: "none",
          background: "var(--fuchsia)",
          color: "var(--on-brand)",
          fontFamily: "var(--font-inter), sans-serif",
          fontSize: 14,
          fontWeight: 600,
          letterSpacing: "0.01em",
          cursor: "pointer",
          transitionDelay: "160ms",
        }}
      >
        Explorer mes signatures →
      </button>
    </div>
  );
}

function Pole({ label, name, accent }: { label: string; name: string; accent?: boolean }) {
  return (
    <div style={{ textAlign: "center" }}>
      <div
        style={{
          fontFamily: mono,
          fontSize: 10.5,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: accent ? "var(--prune)" : "var(--muted)",
        }}
      >
        {label}
      </div>
      <div
        className="fr-title"
        style={{ fontFamily: serif, fontWeight: 400, fontSize: 20, color: "var(--ink)", marginTop: 4 }}
      >
        {name}
      </div>
    </div>
  );
}
