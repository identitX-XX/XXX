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

const GLYPHS: Record<GlyphName, ReactNode> = {
  // Signature — un jeton identitaire : losange net, cœur plein.
  signature: (
    <>
      <path d="M12 3.5 L20.5 12 L12 20.5 L3.5 12 Z" />
      <circle cx="12" cy="12" r="2.4" fill="currentColor" stroke="none" />
    </>
  ),
  // La mue — un disque à moitié plein : le basculement, le contraste.
  mue: (
    <>
      <circle cx="12" cy="12" r="7.5" />
      <path d="M12 4.5 A7.5 7.5 0 0 0 12 19.5 Z" fill="currentColor" stroke="none" />
    </>
  ),
  // Tes possibles — un point qui se ramifie en deux voies ouvertes.
  possibles: (
    <>
      <path d="M12 18.4 C12 13 8 12 7 7.5" />
      <path d="M12 18.4 C12 13 16 12 17 7.5" />
      <circle cx="12" cy="18.4" r="1.8" fill="currentColor" stroke="none" />
    </>
  ),
  // Perso — une figure épurée (tête + épaules), soi.
  perso: (
    <>
      <circle cx="12" cy="9.3" r="2.7" fill="currentColor" stroke="none" />
      <path d="M6.4 18.6 C7 14.4 17 14.4 17.6 18.6" />
    </>
  ),
  // Pro — trois barres ascendantes (projets, élan).
  pro: (
    <>
      <path d="M7 18.5 L7 13.2" />
      <path d="M12 18.5 L12 9.6" />
      <path d="M17 18.5 L17 6.2" />
    </>
  ),
  // Relationnel — deux disques qui se recouvrent, le lien.
  relationnel: (
    <>
      <circle cx="9.4" cy="12" r="4.8" />
      <circle cx="14.6" cy="12" r="4.8" />
    </>
  ),
  // Une question — tracé interrogatif net, point plein.
  question: (
    <>
      <path d="M8.8 9.4 A3.3 3.3 0 1 1 12 12.9 L12 14.4" />
      <circle cx="12" cy="17.8" r="1.4" fill="currentColor" stroke="none" />
    </>
  ),
  // Un micro-défi — une cible : viser, atteindre.
  defi: (
    <>
      <circle cx="12" cy="12" r="7.6" />
      <circle cx="12" cy="12" r="3.7" />
      <circle cx="12" cy="12" r="1.3" fill="currentColor" stroke="none" />
    </>
  ),
  // Une ressource — deux cartes empilées (le savoir, la bibliothèque).
  ressource: (
    <>
      <rect x="5" y="6.4" width="14" height="4.7" rx="1.6" />
      <rect x="5" y="12.9" width="14" height="4.7" rx="1.6" />
    </>
  ),
};

export function Glyph({
  name,
  size = 22,
  strokeWidth = 1.75,
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
