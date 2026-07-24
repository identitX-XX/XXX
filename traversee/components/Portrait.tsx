"use client";

// Le portrait qui se révèle. Une présence — pas une photo : une silhouette de
// femme dans le vide, derrière un verre dépoli qui se lève à mesure que la
// netteté monte. La fuchsia, diffuse au départ, se resserre en un point.
// Toute l'échelle vient de lib/portrait (déterministe, testée) ; ce composant
// ne fait que dessiner, feutrer les bords en cercle, et respecter
// prefers-reduced-motion.

import { portraitParams } from "../lib/portrait";

export function Portrait({ clarity, size = 300 }: { clarity: number; size?: number }) {
  const p = portraitParams(clarity);
  const pct = Math.round(Math.max(0, Math.min(100, clarity)));

  // Feutrage circulaire : supprime toute arête carrée du flou / du voile.
  const feather =
    "radial-gradient(circle at 50% 46%, #000 56%, rgba(0,0,0,0) 74%)";

  return (
    <div className="tx-portrait" style={{ width: size, margin: "0 auto" }}>
      <style>{`
        .tx-portrait .tx-layer { transition: filter 1.6s cubic-bezier(.16,1,.3,1),
          opacity 1.6s cubic-bezier(.16,1,.3,1); }
        @media (prefers-reduced-motion: reduce) {
          .tx-portrait .tx-layer { transition: none; }
        }
      `}</style>

      <div
        className="tx-visual"
        style={{
          position: "relative",
          width: size,
          height: size,
          WebkitMaskImage: feather,
          maskImage: feather,
        }}
      >
        <div className="tx-layer" style={{ position: "absolute", inset: 0, filter: `blur(${p.blur}px)` }}>
          <svg viewBox="0 0 100 100" width="100%" height="100%" aria-hidden="true">
            <defs>
              <radialGradient id="tx-body" cx="50%" cy="34%" r="66%">
                <stop offset="0%" stopColor="#402a58" />
                <stop offset="55%" stopColor="#251738" />
                <stop offset="100%" stopColor="#130c20" />
              </radialGradient>
              {/* le point fuchsia qui se concentre : rayon et intensité pilotés */}
              <radialGradient id="tx-glow" cx="50%" cy="40%" r={`${p.glowRadius * 100}%`}>
                <stop offset="0%" stopColor="#ff4ea8" stopOpacity={p.glowIntensity} />
                <stop offset="45%" stopColor="#e0409f" stopOpacity={p.glowIntensity * 0.32} />
                <stop offset="100%" stopColor="#e0409f" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Silhouette buste d'un seul trait : tête, cou pincé, épaules qui
                tombent — une présence, pas un pictogramme. */}
            <path
              fill="url(#tx-body)"
              d="M50 12
                 C59 12 66 20 66 30
                 C66 38 61 45 54 47
                 C72 50 85 70 88 108
                 L12 108
                 C15 70 28 50 46 47
                 C39 45 34 38 34 30
                 C34 20 41 12 50 12 Z"
            />
            {/* Le halo fuchsia, par-dessus la présence. */}
            <rect x="0" y="0" width="100" height="100" fill="url(#tx-glow)" />
          </svg>
        </div>

        {/* Le voile de vide qui se lève. */}
        <div
          className="tx-layer"
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at 50% 42%, rgba(10,7,18,0) 24%, rgba(8,6,15,0.92) 70%)",
            opacity: p.veil,
            pointerEvents: "none",
          }}
        />
      </div>

      {/* La netteté, visible en permanence — sous le portrait, hors du champ. */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          textAlign: "center",
          marginTop: 14,
          fontVariantNumeric: "tabular-nums",
          fontSize: 12,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: pct >= 100 ? "#ff4ea8" : "#8b84a3",
          fontWeight: 600,
        }}
      >
        Netteté {pct}%
      </div>
    </div>
  );
}
