"use client";

// « Les esprits du parcours » — une petite troupe en LIGNE CLAIRE (trait fin,
// encre sur papier, le rouge en SIGNAL : un seul détail rouge par personnage).
// Fées, magiciennes, trolls, lutins… disséminés avec parcimonie dans le parcours
// pour peupler l'univers sans jamais faire gadget. Chaque personnage est un SVG
// pur (viewBox 48×48), trait = couleur courante (var(--ink) via le parent), les
// accents rouges en var(--prune). Respecte le thème (currentColor).

import type { CSSProperties } from "react";

export type PersonnageKey =
  | "fee"
  | "magicienne"
  | "troll"
  | "lutin"
  | "chouette"
  | "dragon"
  | "gnome";

export const PERSONNAGES: PersonnageKey[] = [
  "fee",
  "magicienne",
  "troll",
  "lutin",
  "chouette",
  "dragon",
  "gnome",
];

export const PERSONNAGE_NOM: Record<PersonnageKey, string> = {
  fee: "La fée",
  magicienne: "La magicienne",
  troll: "Le troll",
  lutin: "Le lutin",
  chouette: "La chouette",
  dragon: "Le dragon",
  gnome: "Le gnome",
};

const PRUNE = "var(--prune)";

function Svg({
  size = 44,
  className = "",
  title,
  children,
}: {
  size?: number;
  className?: string;
  title: string;
  children: React.ReactNode;
}) {
  const base: CSSProperties = {
    color: "var(--ink)",
    display: "block",
  };
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      role="img"
      aria-label={title}
      className={className}
      style={base}
    >
      <title>{title}</title>
      {children}
    </svg>
  );
}

// Petite étoile rouge (signal) — pointe de baguette, éclat…
function EtoileRouge({ cx, cy, r = 3 }: { cx: number; cy: number; r?: number }) {
  const pts = [];
  for (let i = 0; i < 10; i++) {
    const ang = (Math.PI / 5) * i - Math.PI / 2;
    const rad = i % 2 === 0 ? r : r * 0.44;
    pts.push(`${(cx + Math.cos(ang) * rad).toFixed(2)},${(cy + Math.sin(ang) * rad).toFixed(2)}`);
  }
  return <polygon points={pts.join(" ")} fill={PRUNE} stroke="none" />;
}

export function Fee({ size, className }: { size?: number; className?: string }) {
  return (
    <Svg size={size} className={className} title="La fée">
      {/* ailes */}
      <path d="M23 25c-5-5-11-4-11 1 0 4 6 5 11 1z" />
      <path d="M25 25c5-5 11-4 11 1 0 4-6 5-11 1z" />
      {/* tête */}
      <circle cx="24" cy="12" r="3" />
      {/* robe */}
      <path d="M24 15l-5 15h10z" />
      {/* jambes */}
      <path d="M22 30l-1 6M26 30l1 6" />
      {/* bras + baguette + étoile rouge */}
      <path d="M26 20l9-5" />
      <EtoileRouge cx={36} cy={14} r={3} />
    </Svg>
  );
}

export function Magicienne({ size, className }: { size?: number; className?: string }) {
  return (
    <Svg size={size} className={className} title="La magicienne">
      {/* chapeau pointu */}
      <path d="M24 5l7 13H17z" />
      <path d="M14 18h20" />
      {/* visage */}
      <circle cx="24" cy="25.5" r="4" />
      {/* cape */}
      <path d="M24 29.5c-6 1-9 6-9 13h18c0-7-3-12-9-13z" />
      {/* lune/étoile rouge sur le chapeau */}
      <EtoileRouge cx={24} cy={13} r={2.6} />
    </Svg>
  );
}

export function Troll({ size, className }: { size?: number; className?: string }) {
  return (
    <Svg size={size} className={className} title="Le troll">
      {/* oreilles/cornes */}
      <path d="M15 14l-3-5M33 14l3-5" />
      {/* tête ronde */}
      <path d="M14 18a10 9 0 0 1 20 0c0 5-4 8-10 8s-10-3-10-8z" />
      {/* yeux + nez rouge */}
      <circle cx="20" cy="18" r="1" fill="currentColor" stroke="none" />
      <circle cx="28" cy="18" r="1" fill="currentColor" stroke="none" />
      <circle cx="24" cy="21.5" r="1.8" fill={PRUNE} stroke="none" />
      {/* corps trapu + massue */}
      <path d="M18 26c-1 5-1 9 0 13h12c1-4 1-8 0-13" />
      <path d="M33 30l5 6" />
      <circle cx="39" cy="37" r="2.4" />
    </Svg>
  );
}

export function Lutin({ size, className }: { size?: number; className?: string }) {
  return (
    <Svg size={size} className={className} title="Le lutin">
      {/* bonnet pointu + grelot rouge */}
      <path d="M18 15c1-7 11-7 12 0z" />
      <path d="M24 9c2-4 6-3 6 1" />
      <circle cx="30" cy="10.5" r="1.8" fill={PRUNE} stroke="none" />
      {/* visage */}
      <circle cx="24" cy="19" r="3.4" />
      {/* tunique */}
      <path d="M24 22l-6 12h12z" />
      {/* bras */}
      <path d="M20 26l-3 3M28 26l3 3" />
      {/* souliers pointus */}
      <path d="M21 34l-3 2M27 34l3 2" />
    </Svg>
  );
}

export function Chouette({ size, className }: { size?: number; className?: string }) {
  return (
    <Svg size={size} className={className} title="La chouette">
      {/* aigrettes */}
      <path d="M17 11l2 4M31 11l-2 4" />
      {/* corps */}
      <path d="M24 12c-7 0-11 6-11 13 0 7 5 11 11 11s11-4 11-11c0-7-4-13-11-13z" />
      {/* yeux (un rouge = regard-signal) */}
      <circle cx="19.5" cy="22" r="3" />
      <circle cx="28.5" cy="22" r="3" />
      <circle cx="19.5" cy="22" r="1" fill="currentColor" stroke="none" />
      <circle cx="28.5" cy="22" r="1.1" fill={PRUNE} stroke="none" />
      {/* bec */}
      <path d="M24 25l-1.5 2.5h3z" />
      {/* plumes ventre */}
      <path d="M20 31c1.5 1.5 6.5 1.5 8 0" />
    </Svg>
  );
}

export function Dragon({ size, className }: { size?: number; className?: string }) {
  return (
    <Svg size={size} className={className} title="Le dragon">
      {/* corps + queue qui s'enroule */}
      <path d="M10 37c6 0 7-5 7-9 0-5 4-8 9-8" />
      {/* tête + museau */}
      <path d="M26 11c4 0 7 2 7 5 0 2-2 4-5 4-2 0-4-1-4-3" />
      {/* corne + œil */}
      <path d="M28 11l1-3" />
      <circle cx="29" cy="16.5" r="0.9" fill="currentColor" stroke="none" />
      {/* petites pattes */}
      <path d="M16 32v4M22 32v4" />
      {/* aile */}
      <path d="M19 25c4-4 9-3 11 1-3 0-5 2-6 5-2-2-3-4-5-6z" />
      {/* souffle de feu rouge */}
      <path d="M33 17c3 0 4-1 6-1" stroke={PRUNE} />
      <EtoileRouge cx={41} cy={16} r={2.6} />
    </Svg>
  );
}

export function Gnome({ size, className }: { size?: number; className?: string }) {
  return (
    <Svg size={size} className={className} title="Le gnome">
      {/* long bonnet */}
      <path d="M16 20c0-9 16-9 16 0z" />
      <path d="M24 6c-3 4-6 9-8 14M24 6c3 4 6 9 8 14" />
      {/* nez rond */}
      <circle cx="24" cy="23" r="2.2" />
      {/* barbe */}
      <path d="M18 22c0 8 3 13 6 14 3-1 6-6 6-14" />
      {/* lanterne à lumière rouge */}
      <path d="M34 26v8" />
      <rect x="32" y="29" width="4" height="4.5" rx="0.6" fill={PRUNE} stroke="none" />
    </Svg>
  );
}

export const PERSONNAGE_COMPOSANT: Record<
  PersonnageKey,
  (p: { size?: number; className?: string }) => React.ReactElement
> = {
  fee: Fee,
  magicienne: Magicienne,
  troll: Troll,
  lutin: Lutin,
  chouette: Chouette,
  dragon: Dragon,
  gnome: Gnome,
};

export function Personnage({
  who,
  size,
  className,
}: {
  who: PersonnageKey;
  size?: number;
  className?: string;
}) {
  const C = PERSONNAGE_COMPOSANT[who];
  return <C size={size} className={className} />;
}
