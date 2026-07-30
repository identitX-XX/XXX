// Jeu de glyphes maison d'IdentitX — trait fin « gravé », accents étoilés, dans
// la même famille que la constellation-visage et l'orbite des phases. Remplace
// les pictos lucide génériques sous l'accueil (onboarding, sphères, rythme).
//
// Tous les glyphes héritent la couleur d'accent via `currentColor` (la palette
// n'est jamais codée en dur ici), et sont dessinés sur une grille 24×24.

import type { ReactNode } from "react";

export type GlyphName =
  | "signature"
  | "mue"
  | "possibles"
  | "perso"
  | "pro"
  | "relationnel"
  | "question"
  | "defi"
  | "ressource";

// Une petite étoile pleine — le point d'accent récurrent de la famille.
function Star({ cx, cy, r = 1 }: { cx: number; cy: number; r?: number }) {
  return <circle cx={cx} cy={cy} r={r} fill="currentColor" stroke="none" />;
}

const GLYPHS: Record<GlyphName, ReactNode> = {
  // Signature — une étoile-sceau à quatre branches, deux satellites.
  signature: (
    <>
      <path d="M12 4.5 L13.4 10.6 L19.5 12 L13.4 13.4 L12 19.5 L10.6 13.4 L4.5 12 L10.6 10.6 Z" />
      <Star cx={18.6} cy={5.4} r={1} />
      <Star cx={5.6} cy={17.6} r={0.85} />
    </>
  ),
  // La mue — croissant de lune et sa traîne d'étoiles (le passage, la nuit).
  mue: (
    <>
      <path d="M15.5 4.6 A8 8 0 1 0 15.5 19.4 A6.3 6.3 0 1 1 15.5 4.6 Z" />
      <Star cx={8} cy={7.6} r={1} />
      <Star cx={6.4} cy={12} r={0.8} />
      <Star cx={8} cy={16.4} r={0.9} />
    </>
  ),
  // Tes possibles — un éventail de chemins qui rayonnent d'un même point.
  possibles: (
    <>
      <path d="M12 19.5 L6 8.2" />
      <path d="M12 19.5 L12 5.6" />
      <path d="M12 19.5 L18 8.2" />
      <Star cx={12} cy={19.5} r={1.6} />
      <Star cx={6} cy={6.9} r={1} />
      <Star cx={12} cy={4.3} r={1} />
      <Star cx={18} cy={6.9} r={1} />
    </>
  ),
  // Perso — une pousse qui s'ouvre sur une étoile (l'intériorité qui grandit).
  perso: (
    <>
      <path d="M12 20 L12 10.5" />
      <path d="M12 13 C9 13 7.5 11 7.5 8.4 C10.6 8.4 12 10.4 12 13" />
      <path d="M12 10.8 C15 10.8 16.5 8.8 16.5 6.2 C13.4 6.2 12 8.2 12 10.8" />
      <Star cx={12} cy={4.6} r={1.15} />
    </>
  ),
  // Pro — une structure en losange, bâtie autour d'un cœur (projets, cap).
  pro: (
    <>
      <path d="M12 3.6 L20.4 12 L12 20.4 L3.6 12 Z" />
      <path d="M12 8.6 L15.4 12 L12 15.4 L8.6 12 Z" />
    </>
  ),
  // Relationnel — deux astres reliés par une orbite douce (le lien).
  relationnel: (
    <>
      <circle cx="8" cy="9" r="2" />
      <circle cx="16" cy="15" r="2" />
      <path d="M9.5 10.4 C11 13 13 11 14.5 13.6" />
    </>
  ),
  // Une question — un tracé interrogatif fin, sous une petite étoile.
  question: (
    <>
      <path d="M9 9.2 A3.2 3.2 0 1 1 12.2 12.4 L12.2 14.2" />
      <Star cx={12.2} cy={17.6} r={1} />
      <Star cx={6.4} cy={6} r={0.9} />
    </>
  ),
  // Un micro-défi — un sommet à atteindre, guidé par une étoile.
  defi: (
    <>
      <path d="M4.5 18.5 L12 7.5 L19.5 18.5" />
      <path d="M9 18.5 L12 13.6 L15 18.5" />
      <Star cx={12} cy={5} r={1.2} />
    </>
  ),
  // Une ressource — un livre ouvert d'où monte une étoile (le savoir).
  ressource: (
    <>
      <path d="M12 8.6 C9.5 6.9 6 6.9 4 7.9 L4 18 C6 17 9.5 17 12 18.7" />
      <path d="M12 8.6 C14.5 6.9 18 6.9 20 7.9 L20 18 C18 17 14.5 17 12 18.7" />
      <path d="M12 8.6 L12 18.7" />
      <Star cx={12} cy={4.6} r={1.1} />
    </>
  ),
};

export function Glyph({
  name,
  size = 22,
  strokeWidth = 1.3,
  className,
}: {
  name: GlyphName;
  size?: number;
  strokeWidth?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      {GLYPHS[name]}
    </svg>
  );
}
