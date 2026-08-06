"use client";

// Le motif signature d'Constellation : l'identité tracée comme une constellation en
// forme de visage/silhouette. Trait d'or (accent de palette), étoiles ivoire,
// scintillement doux. Remplace l'ancien réseau de neurones — chaud, humain,
// céleste, non « IA ». Inspiré de l'univers de la fondatrice.

// Nœuds de la constellation (repères d'un visage/buste), viewBox 230×300.
const STARS_IVOIRE = [
  [115, 34], [74, 66], [156, 66], [66, 112], [164, 112],
  [70, 162], [160, 162], [86, 206], [144, 206], [70, 258], [160, 258],
];
const STARS_OR = [
  [92, 126], [138, 126], [115, 150], [115, 182], [115, 86], [115, 226],
];
const AMBIANCE = [
  [30, 60], [200, 90], [40, 200], [195, 220], [150, 285],
];
const LIENS: [number, number, number, number][] = [
  [115, 34, 74, 66], [115, 34, 156, 66], [115, 34, 115, 86],
  [74, 66, 66, 112], [156, 66, 164, 112],
  [66, 112, 92, 126], [164, 112, 138, 126],
  [92, 126, 115, 150], [138, 126, 115, 150], [115, 150, 115, 182],
  [66, 112, 70, 162], [164, 112, 160, 162],
  [70, 162, 86, 206], [160, 162, 144, 206],
  [86, 206, 115, 226], [144, 206, 115, 226], [115, 182, 115, 226],
  [86, 206, 70, 258], [144, 206, 160, 258],
];

export function Constellation({ size = 300 }: { size?: number }) {
  const h = Math.round((size * 300) / 230);
  return (
    <svg
      width={size}
      height={h}
      viewBox="0 0 230 300"
      fill="none"
      aria-hidden="true"
      style={{ display: "block" }}
    >
      <defs>
        <radialGradient id="idx-halo" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="var(--fuchsia)" stopOpacity="0.9" />
          <stop offset="100%" stopColor="var(--fuchsia)" stopOpacity="0" />
        </radialGradient>
      </defs>

      <circle cx="115" cy="120" r="72" fill="url(#idx-halo)" opacity="0.18" />

      <g stroke="var(--fuchsia)" strokeWidth="1" opacity="0.4" strokeLinecap="round">
        {LIENS.map(([x1, y1, x2, y2], i) => (
          <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} />
        ))}
      </g>

      <g fill="var(--ink)">
        {STARS_IVOIRE.map(([x, y], i) => (
          <circle
            key={i}
            cx={x}
            cy={y}
            r="2.2"
            style={{
              animation: "idx-twinkle 3.5s ease-in-out infinite",
              animationDelay: `${(i % 5) * 0.4}s`,
            }}
          />
        ))}
      </g>

      <g fill="var(--fuchsia)">
        {STARS_OR.map(([x, y], i) => (
          <circle
            key={i}
            cx={x}
            cy={y}
            r={i === 3 ? 3.2 : 2.8}
            style={{
              animation: "idx-twinkle 4s ease-in-out infinite",
              animationDelay: `${i * 0.5}s`,
            }}
          />
        ))}
      </g>

      <g fill="var(--fuchsia)" opacity="0.6">
        {AMBIANCE.map(([x, y], i) => (
          <circle
            key={i}
            cx={x}
            cy={y}
            r="1.3"
            style={{
              animation: "idx-twinkle 5s ease-in-out infinite",
              animationDelay: `${i * 0.7}s`,
            }}
          />
        ))}
      </g>
    </svg>
  );
}
