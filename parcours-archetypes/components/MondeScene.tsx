// Scènes « ligne claire » (esprit BD / Yoko Tsuno) pour les 5 mondes de la Quête.
// Trait net + aplats, aucune ombre : le SVG rend cet esprit à la perfection.
// Les couleurs viennent du monde (accent / accent2 / ink) → chaque scène reste
// cohérente avec la peau choisie. viewBox commun 320×170.

import type { MondeKey } from "../mondes";

export function MondeScene({
  mk,
  accent,
  accent2,
  ink,
  fond,
  height = 170,
}: {
  mk: MondeKey;
  accent: string;
  accent2: string;
  ink: string;
  fond: string;
  height?: number;
}) {
  return (
    <svg
      viewBox="0 0 320 170"
      width="100%"
      height={height}
      preserveAspectRatio="xMidYMid slice"
      fill="none"
      stroke={accent}
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      style={{ display: "block" }}
    >
      <rect x="0" y="0" width="320" height="170" fill={fond} stroke="none" />
      {mk === "nature" && (
        <>
          {/* soleil + rayons */}
          <circle cx="238" cy="52" r="26" stroke={accent2} />
          <g stroke={accent2} strokeWidth={1.3}>
            <path d="M238 14 v-6 M238 96 v6 M276 52 h6 M200 52 h-6 M266 24 l4 -4 M206 80 l-4 4 M266 80 l4 4 M206 24 l-4 -4" />
          </g>
          {/* collines */}
          <path d="M0 128 q80 -34 160 -8 t160 -12" stroke={accent} />
          <path d="M0 150 q90 -22 170 -4 t150 -8" stroke={accent2} strokeWidth={1.3} opacity="0.65" />
          {/* fougère */}
          <path d="M74 152 q4 -66 -10 -110" stroke={ink} />
          <g stroke={ink} strokeWidth={1.3}>
            <path d="M66 124 q-18 -4 -26 -20 M69 106 q18 -4 26 -20 M63 90 q-16 -4 -22 -18 M67 72 q15 -4 21 -16 M62 58 q-12 -3 -16 -13" />
          </g>
          {/* oiseaux */}
          <g stroke={ink} strokeWidth={1.3}>
            <path d="M120 40 q6 -6 12 0 M132 40 q6 -6 12 0" />
          </g>
        </>
      )}

      {mk === "urbain" && (
        <>
          {/* lune */}
          <circle cx="252" cy="42" r="16" stroke={ink} />
          <circle cx="246" cy="38" r="16" fill={fond} stroke="none" />
          {/* étoiles */}
          <circle cx="60" cy="34" r="1.4" fill={ink} stroke="none" />
          <circle cx="140" cy="24" r="1.2" fill={ink} stroke="none" />
          {/* skyline */}
          <g stroke={accent}>
            <rect x="20" y="96" width="34" height="58" />
            <rect x="60" y="70" width="40" height="84" />
            <rect x="106" y="110" width="30" height="44" />
            <rect x="142" y="52" width="46" height="102" />
            <rect x="196" y="88" width="36" height="66" />
            <rect x="238" y="104" width="30" height="50" />
            <rect x="274" y="76" width="34" height="78" />
          </g>
          {/* fenêtres allumées */}
          <g fill={accent2} stroke="none">
            <rect x="68" y="80" width="6" height="6" /><rect x="82" y="80" width="6" height="6" />
            <rect x="68" y="96" width="6" height="6" /><rect x="82" y="110" width="6" height="6" />
            <rect x="152" y="64" width="7" height="7" /><rect x="168" y="64" width="7" height="7" />
            <rect x="152" y="84" width="7" height="7" /><rect x="168" y="104" width="7" height="7" />
            <rect x="282" y="90" width="6" height="6" /><rect x="296" y="106" width="6" height="6" />
          </g>
          <path d="M0 154 H320" stroke={accent} strokeWidth={1.3} opacity="0.6" />
        </>
      )}

      {mk === "futuriste" && (
        <>
          <circle cx="232" cy="70" r="50" fill="rgba(0,0,0,0.25)" stroke={accent} />
          <circle cx="240" cy="64" r="22" stroke={accent2} />
          <ellipse cx="240" cy="64" rx="36" ry="10" stroke={accent} strokeWidth={1.3} opacity="0.8" />
          <circle cx="208" cy="44" r="1.6" fill={ink} stroke="none" />
          <circle cx="262" cy="100" r="1.4" fill={ink} stroke="none" />
          {/* console */}
          <rect x="24" y="120" width="150" height="34" rx="4" stroke={accent} strokeWidth={1.4} fill="rgba(0,0,0,0.25)" />
          <rect x="32" y="128" width="34" height="18" rx="2" stroke={accent2} strokeWidth={1.2} />
          <rect x="74" y="128" width="34" height="18" rx="2" stroke={accent} strokeWidth={1.2} />
          <path d="M116 146 v-14 M126 146 v-9 M136 146 v-18" stroke={accent} strokeWidth={1.4} />
          {/* figure de dos */}
          <circle cx="150" cy="70" r="13" stroke={ink} />
          <path d="M133 118 q17 -34 34 0" stroke={ink} fill="rgba(0,0,0,0.25)" />
          <path d="M167 96 q14 2 18 20" stroke={ink} />
        </>
      )}

      {mk === "retro" && (
        <>
          {/* écran CRT */}
          <rect x="70" y="34" width="180" height="104" rx="14" stroke={accent} />
          <rect x="82" y="46" width="156" height="80" rx="8" stroke={accent} strokeWidth={1.2} opacity="0.7" />
          {/* scanlines */}
          <g stroke={accent} strokeWidth={1} opacity="0.28">
            <path d="M84 58 H236 M84 72 H236 M84 86 H236 M84 100 H236 M84 114 H236" />
          </g>
          {/* invader pixel (accent2) */}
          <g fill={accent2} stroke="none">
            <rect x="146" y="66" width="8" height="8" /><rect x="170" y="66" width="8" height="8" />
            <rect x="134" y="78" width="56" height="8" />
            <rect x="146" y="90" width="8" height="8" /><rect x="170" y="90" width="8" height="8" />
            <rect x="134" y="90" width="8" height="8" /><rect x="182" y="90" width="8" height="8" />
          </g>
          {/* socle + manette */}
          <path d="M120 138 H200 M160 138 v-6" stroke={ink} strokeWidth={1.3} />
          <circle cx="160" cy="150" r="6" stroke={ink} strokeWidth={1.4} />
        </>
      )}

      {mk === "manga" && (
        <>
          {/* lignes de vitesse convergentes */}
          <g stroke={accent} strokeWidth={1.2} opacity="0.55">
            <path d="M0 8 L150 78 M0 44 L150 82 M0 84 L150 86 M0 124 L150 90 M0 160 L150 96
                     M320 6 L172 76 M320 40 L172 82 M320 84 L172 86 M320 128 L172 92 M320 162 L172 98" />
          </g>
          {/* étoile d'impact */}
          <path d="M161 40 L169 78 L206 84 L169 92 L163 132 L155 92 L118 84 L155 78 Z"
                fill={accent2} stroke={accent2} strokeWidth={1} opacity="0.9" />
          {/* silhouette qui regarde */}
          <circle cx="52" cy="86" r="15" stroke={ink} strokeWidth={1.6} />
          <path d="M30 140 q22 -40 44 0" stroke={ink} strokeWidth={1.6} fill="rgba(0,0,0,0.25)" />
          {/* petit éclat */}
          <path d="M240 40 l3 8 l8 3 l-8 3 l-3 8 l-3 -8 l-8 -3 l8 -3 Z" fill={ink} stroke="none" />
        </>
      )}
    </svg>
  );
}
