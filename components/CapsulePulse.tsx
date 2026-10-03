"use client";

// « CapsulePulse » — rend le bilan de la capsule INTERACTIF : un petit champ
// génératif qui réagit EN TEMPS RÉEL aux curseurs (intensité ↔ relations) et aux
// émotions choisies. Le geste cesse d'être un formulaire : il modèle une forme.
// Minéral + rouge SIGNAL (tension / émotions difficiles). Respecte reduced-motion.

import { emotionByKey } from "@/parcours-archetypes/archetypes";
import type { EmotionKey } from "@/parcours-archetypes/types";

const CX = 170;
const CY = 78;

export function CapsulePulse({
  focus,
  relations,
  emotions,
}: {
  focus: number; // 0..100
  relations: number; // 0..100
  emotions: EmotionKey[];
}) {
  const f = Math.max(0, Math.min(100, focus));
  const r = Math.max(0, Math.min(100, relations));

  // Deux pôles : intensité (haut-gauche) et relations (bas-droite). Leur distance
  // au centre suit la valeur → les bras s'étendent/se rétractent avec les curseurs.
  const fx = CX - (26 + f * 0.95);
  const fy = CY - (10 + f * 0.28);
  const rx = CX + (26 + r * 0.95);
  const ry = CY + (10 + r * 0.28);

  const coreR = 5 + f * 0.05;
  const tension = f > 72; // intensité forte → signal rouge discret

  // Émotions : un point par émotion, sur un arc en bas. Rouge si valence négative
  // (tension), encre sinon. Clé stable pour l'animation d'apparition.
  const emo = emotions.slice(0, 7).map((k, i) => {
    const n = Math.max(1, emotions.length);
    const t = n === 1 ? 0.5 : i / (n - 1);
    const ang = Math.PI * (0.18 + t * 0.64); // arc bas
    const rad = 92;
    const val = emotionByKey[k]?.valence ?? 0;
    return {
      k,
      x: CX + Math.cos(ang) * rad * 0.9,
      y: CY + 24 + Math.sin(ang) * rad * 0.42,
      neg: val < 0,
    };
  });

  const geo = { transition: "cx var(--dur) var(--ease-out), cy var(--dur) var(--ease-out), r var(--dur) var(--ease-out), x1 var(--dur) var(--ease-out), y1 var(--dur) var(--ease-out), x2 var(--dur) var(--ease-out), y2 var(--dur) var(--ease-out)" } as React.CSSProperties;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", margin: "2px 0 18px" }}>
      <svg viewBox="0 0 340 170" width="100%" style={{ maxWidth: 340 }} aria-hidden="true">
        {/* bras */}
        <g stroke="var(--muted)" strokeWidth="1" strokeLinecap="round" opacity="0.45">
          <line x1={CX} y1={CY} x2={fx} y2={fy} style={geo} />
          <line x1={CX} y1={CY} x2={rx} y2={ry} style={geo} />
          {emo.map((e, i) => (
            <line key={i} x1={CX} y1={CY} x2={e.x} y2={e.y} opacity="0.3" style={geo} />
          ))}
        </g>

        {/* halo de tension (rouge, discret) quand l'intensité est forte */}
        <circle
          cx={CX}
          cy={CY}
          r="30"
          fill="none"
          stroke="var(--prune)"
          strokeWidth="1"
          style={{ opacity: tension ? 0.3 : 0, transition: "opacity var(--dur) var(--ease-out)" }}
        />

        {/* noyau — respire, grossit avec l'intensité */}
        <circle
          cx={CX}
          cy={CY}
          r={coreR}
          fill="var(--ink)"
          style={{
            ...geo,
            transformBox: "fill-box",
            transformOrigin: "center",
            animation: "idx-breathe 4s var(--ease-in-out) infinite",
          }}
        />

        {/* pôles */}
        <circle cx={fx} cy={fy} r="3.4" fill="var(--ink)" style={geo} />
        <circle cx={rx} cy={ry} r="3.4" fill="var(--ink)" style={geo} />

        {/* émotions */}
        <g>
          {emo.map((e) => (
            <circle
              key={e.k}
              cx={e.x}
              cy={e.y}
              r="3"
              fill={e.neg ? "var(--prune)" : "var(--ink)"}
              style={{
                transformBox: "fill-box",
                transformOrigin: "center",
                animation: "idx-pop var(--dur) var(--ease-out)",
              }}
            />
          ))}
        </g>
      </svg>
      <div
        style={{
          fontFamily: "var(--font-mono), ui-monospace, monospace",
          fontSize: 10.5,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "var(--muted)",
        }}
      >
        Ton climat se dessine
      </div>
    </div>
  );
}
