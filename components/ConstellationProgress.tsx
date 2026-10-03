"use client";

// « ConstellationProgress » — pendant le questionnaire, chaque réponse REJOINT la
// constellation : un point de plus, relié au précédent. Au début presque rien ;
// à la fin, une figure. C'est la progression (pas une barre), et l'annonce de la
// révélation. Disposition en spirale d'or (déterministe). Le dernier point pulse.

import { positionEtoile } from "@/parcours-archetypes/constellationVivante";

export function ConstellationProgress({
  count,
  total,
  size = 150,
}: {
  count: number;
  total: number;
  size?: number;
}) {
  // Positions en spirale (i = 1..count), normalisées dans un viewBox 240×240.
  const pts = Array.from({ length: count }, (_, k) => positionEtoile(k + 1));
  const dernier = pts[pts.length - 1] ?? null;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 240 240"
      role="img"
      aria-label={`Ta constellation se compose : ${count} sur ${total}`}
    >
      {/* cœur — toujours là */}
      <circle cx="120" cy="120" r="2.4" fill="var(--ink)" opacity="0.7" />

      {/* liens : cœur → 1er, puis de proche en proche */}
      <g stroke="var(--muted)" strokeWidth="0.8" strokeLinecap="round" opacity="0.4">
        {pts.map((p, k) => {
          const prev = k === 0 ? { x: 120, y: 120 } : pts[k - 1];
          return <line key={k} x1={prev.x} y1={prev.y} x2={p.x} y2={p.y} />;
        })}
      </g>

      {/* nœuds : encre ; le dernier (réponse du moment) en rouge signal */}
      <g>
        {pts.map((p, k) => {
          const last = k === pts.length - 1;
          return (
            <circle
              key={k}
              cx={p.x}
              cy={p.y}
              r={last ? 3.4 : 2.4}
              fill={last ? "var(--prune)" : "var(--ink)"}
              style={{
                transformBox: "fill-box",
                transformOrigin: "center",
                animation: last ? "idx-pop var(--dur) var(--ease-out)" : undefined,
              }}
            />
          );
        })}
      </g>

      {/* halo discret sur le dernier point */}
      {dernier && (
        <circle cx={dernier.x} cy={dernier.y} r="8" fill="none" stroke="var(--prune)" strokeWidth="0.8" opacity="0.25" />
      )}
    </svg>
  );
}
