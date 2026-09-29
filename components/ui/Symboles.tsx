// Le vocabulaire graphique CéliBOSS™, en SVG pur.
//
// - Osram ne Nsoromma, « la lune et l'étoile » : symbole adinkra (Akan, Ghana)
//   de l'amour, de la fidélité et de l'harmonie. Emblème du Cercle.
// - L'étoile à huit branches : l'intuition, le guide.
// - La bande bogolan : losanges, points et zigzags inspirés des tissus du Mali.
// - Le ciel : un semis d'étoiles pour les fonds Nuit.

import { useId } from "react";

const ETOILE_8 =
  "50,6 57.6,31.5 81.1,18.9 68.5,42.4 94,50 68.5,57.6 81.1,81.1 57.6,68.5 50,94 42.4,68.5 18.9,81.1 31.5,57.6 6,50 31.5,42.4 18.9,18.9 42.4,31.5";
const ETOILE_BERCEE =
  "50,22 52.3,30.46 59.9,26.1 55.54,33.7 64,36 55.54,38.3 59.9,45.9 52.3,41.54 50,50 47.7,41.54 40.1,45.9 44.46,38.3 36,36 44.46,33.7 40.1,26.1 47.7,30.46";

type Taille = { taille?: number; className?: string };

/** Osram ne Nsoromma : un croissant qui berce une étoile. */
export function LuneEtoile({ taille = 100, className = "", etoile = "rgb(var(--ivoire))" }: Taille & { etoile?: string }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg aria-hidden width={taille} height={taille} viewBox="0 0 100 100" className={className}>
      <defs>
        <mask id={`croissant-${id}`}>
          <rect width="100" height="100" fill="#fff" />
          <circle cx="50" cy="44" r="34" fill="#000" />
        </mask>
      </defs>
      <circle cx="50" cy="58" r="38" fill="currentColor" mask={`url(#croissant-${id})`} />
      <polygon fill={etoile} points={ETOILE_BERCEE} />
    </svg>
  );
}

/** Étoile à huit branches. */
export function Etoile({ taille = 14, className = "" }: Taille) {
  return (
    <svg aria-hidden width={taille} height={taille} viewBox="0 0 100 100" className={className}>
      <polygon fill="currentColor" points={ETOILE_8} />
    </svg>
  );
}

/** Bande de motifs bogolan, pleine largeur. */
export function BandeBogolan({ className = "" }: { className?: string }) {
  const id = useId().replace(/:/g, "");
  return (
    <div aria-hidden className={`h-14 overflow-hidden ${className}`}>
      <svg width="100%" height="56">
        <defs>
          <pattern id={`bogolan-${id}`} width="112" height="56" patternUnits="userSpaceOnUse">
            <path d="M28 10 L46 28 L28 46 L10 28Z" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="28" cy="28" r="3" fill="currentColor" />
            <path d="M60 16 L68 24 L76 16 L84 24 L92 16 L100 24" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <path d="M60 32 L68 40 L76 32 L84 40 L92 32 L100 40" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="56" cy="6" r="1.5" fill="currentColor" />
            <circle cx="56" cy="50" r="1.5" fill="currentColor" />
            <circle cx="108" cy="28" r="1.5" fill="currentColor" />
          </pattern>
        </defs>
        <rect width="100%" height="56" fill={`url(#bogolan-${id})`} />
      </svg>
    </div>
  );
}

// Positions fixes (en %) : un ciel identique à chaque rendu, sans hasard.
const ASTRES: [number, number, number][] = [
  [10, 10, 1.5], [22, 23, 1], [36, 8, 1.2], [48, 18, 1], [61, 7, 1.6], [71, 28, 1], [82, 13, 1.3],
  [92, 33, 1], [88, 69, 1.4], [97, 84, 1], [57, 80, 1.2], [4, 58, 1], [29, 91, 1.3], [68, 62, 1],
];
const SCINTILLEMENTS: [number, number, number][] = [[53, 13, 9], [94, 20, 6], [17, 71, 6]];

/** Semis d'étoiles pour les fonds Nuit (se place en absolu dans un parent relatif). */
export function Ciel({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden className={`pointer-events-none absolute inset-0 h-full w-full text-champagne ${className}`}>
      {ASTRES.map(([x, y, r]) => (
        <circle key={`${x}-${y}`} cx={`${x}%`} cy={`${y}%`} r={r} fill="currentColor" />
      ))}
      {SCINTILLEMENTS.map(([x, y, t]) => (
        <svg key={`s-${x}-${y}`} x={`${x}%`} y={`${y}%`} overflow="visible">
          <path
            d={`M0,${-t} L${t / 4},${-t / 4} L${t},0 L${t / 4},${t / 4} L0,${t} L${-t / 4},${t / 4} L${-t},0 L${-t / 4},${-t / 4}Z`}
            fill="currentColor"
          />
        </svg>
      ))}
    </svg>
  );
}
