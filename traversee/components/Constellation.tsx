"use client";

// La constellation — la seule progression visible avec la netteté. Elle ne se
// remplit pas, elle se simplifie : LAISSER éteint un point, EMPORTER en avive
// un. Positions et rendus viennent de lib/constellation (déterministe, testé).

import { constellationLayout } from "../lib/constellation";
import { Etoile } from "../types";

export function Constellation({ etoiles, size = 300 }: { etoiles: Etoile[]; size?: number }) {
  const pts = constellationLayout(etoiles);

  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      aria-hidden="true"
      style={{ display: "block" }}
    >
      <style>{`
        .tx-star { transition: r 1.2s cubic-bezier(.16,1,.3,1),
          opacity 1.2s cubic-bezier(.16,1,.3,1); }
        @media (prefers-reduced-motion: reduce) { .tx-star { transition: none; } }
      `}</style>
      <defs>
        <filter id="tx-star-glow" x="-300%" y="-300%" width="700%" height="700%">
          <feGaussianBlur stdDeviation="1.4" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {pts.map((s) => {
        const intense = s.etat === "intense";
        return (
          <circle
            key={s.id}
            className="tx-star"
            cx={s.x}
            cy={s.y}
            r={s.r}
            fill={intense ? "#ff4ea8" : "#b9b0d8"}
            opacity={s.opacity}
            filter={intense ? "url(#tx-star-glow)" : undefined}
          />
        );
      })}
    </svg>
  );
}
