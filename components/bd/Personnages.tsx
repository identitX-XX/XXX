"use client";

// « La troupe » — bestiaire folk-fantasy en trait affirmé, registre ADO / edgy
// (pas « mignon petite section ») : postures, rictus, capuches, lunettes, éclairs.
// Chacun garde UN accent rouge (règle rouge). SVG purs, viewBox 48×48, trait =
// couleur courante (var(--ink) via le parent), accents en var(--prune).

import type { CSSProperties } from "react";

export type PersonnageKey =
  | "lutin"
  | "sorciere"
  | "troll"
  | "magicienne"
  | "gargouille"
  | "fee"
  | "oracle"
  | "dragon"
  | "chouette"
  | "gnome"
  | "farfadet"
  | "sirene"
  | "golem"
  | "phenix"
  | "loupgarou"
  | "elfe"
  | "korrigan"
  | "fantome"
  | "demon"
  | "vampire";

export const PERSONNAGES: PersonnageKey[] = [
  "lutin", "sorciere", "troll", "magicienne", "gargouille",
  "fee", "oracle", "dragon", "chouette", "gnome",
  "farfadet", "sirene", "golem", "phenix", "loupgarou",
  "elfe", "korrigan", "fantome", "demon", "vampire",
];

export const PERSONNAGE_NOM: Record<PersonnageKey, string> = {
  lutin: "Le lutin",
  sorciere: "La sorcière",
  troll: "Le troll",
  magicienne: "La magicienne",
  gargouille: "La gargouille",
  fee: "La fée",
  oracle: "L'oracle",
  dragon: "Le dragon",
  chouette: "La chouette",
  gnome: "Le gnome",
  farfadet: "Le farfadet",
  sirene: "La sirène",
  golem: "Le golem",
  phenix: "Le phénix",
  loupgarou: "Le loup-garou",
  elfe: "L'elfe",
  korrigan: "Le korrigan",
  fantome: "Le fantôme",
  demon: "Le petit démon",
  vampire: "Le vampire",
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
  const base: CSSProperties = { color: "var(--ink)", display: "block" };
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.9}
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

function EtoileRouge({ cx, cy, r = 3 }: { cx: number; cy: number; r?: number }) {
  const pts = [];
  for (let i = 0; i < 10; i++) {
    const ang = (Math.PI / 5) * i - Math.PI / 2;
    const rad = i % 2 === 0 ? r : r * 0.44;
    pts.push(`${(cx + Math.cos(ang) * rad).toFixed(2)},${(cy + Math.sin(ang) * rad).toFixed(2)}`);
  }
  return <polygon points={pts.join(" ")} fill={PRUNE} stroke="none" />;
}

// Rictus en coin (attitude ado), part de gauche vers le haut à droite.
function Rictus({ x = 20, y = 24, w = 8 }: { x?: number; y?: number; w?: number }) {
  return <path d={`M${x} ${y}q${w * 0.6} ${w * 0.5} ${w} -1`} />;
}

type P = { size?: number; className?: string };

export function Lutin({ size, className }: P) {
  return (
    <Svg size={size} className={className} title="Le lutin">
      {/* capuche pointue rabattue */}
      <path d="M14 20c0-9 20-9 20 0" />
      <path d="M34 20c3-2 5-6 4-11-6 1-9 4-10 8" />
      {/* visage anguleux */}
      <path d="M16 20c0 6 4 9 8 9s8-3 8-9" />
      {/* yeux mi-clos + rictus */}
      <path d="M19 20h3M26 20h3" />
      <Rictus x={21} y={25} w={6} />
      {/* grelot rouge au bout de la capuche */}
      <circle cx="38" cy="9" r="2" fill={PRUNE} stroke="none" />
      {/* épaules / hoodie */}
      <path d="M15 30c-2 3-3 6-3 9M33 30c2 3 3 6 3 9M18 31v8M30 31v8" />
    </Svg>
  );
}

export function Sorciere({ size, className }: P) {
  return (
    <Svg size={size} className={className} title="La sorcière">
      {/* chapeau cabossé incliné */}
      <path d="M12 19l10-11 4 2-2 9z" />
      <path d="M9 19h20" />
      {/* mèche */}
      <path d="M26 19c4 0 6 2 7 5" />
      {/* visage */}
      <path d="M14 19c0 6 4 10 8 10s7-3 8-8" />
      <path d="M17 22h2.5M23 22h2.5" />
      <Rictus x={19} y={26} w={6} />
      {/* étoile rouge sur le chapeau */}
      <EtoileRouge cx={18} cy={13} r={2.4} />
      {/* col/cape */}
      <path d="M15 30c-2 2-3 5-3 9M30 30c2 2 3 5 3 9" />
    </Svg>
  );
}

export function Troll({ size, className }: P) {
  return (
    <Svg size={size} className={className} title="Le troll">
      {/* casque audio (ado) */}
      <path d="M13 20a11 9 0 0 1 22 0" />
      <rect x="10" y="19" width="4" height="7" rx="2" />
      <rect x="34" y="19" width="4" height="7" rx="2" />
      {/* tête large + mâchoire */}
      <path d="M14 20c0 7 4 11 10 11s10-4 10-11" />
      {/* sourcils froncés + yeux */}
      <path d="M18 19l3 1M30 19l-3 1" />
      <circle cx="20" cy="22" r="1" fill="currentColor" stroke="none" />
      <circle cx="28" cy="22" r="1" fill="currentColor" stroke="none" />
      {/* croc + petite dent rouge */}
      <path d="M21 27l1 2 2-2" />
      <path d="M26 27v2" stroke={PRUNE} />
    </Svg>
  );
}

export function Magicienne({ size, className }: P) {
  return (
    <Svg size={size} className={className} title="La magicienne">
      {/* capuche */}
      <path d="M15 20c0-8 18-8 18 0" />
      <path d="M24 10v-4" />
      {/* visage dans l'ombre de la capuche */}
      <path d="M17 20c0 6 3 9 7 9s7-3 7-9" />
      <path d="M20 21h2.5M25.5 21h2.5" />
      {/* éclair rouge dans la main levée */}
      <path d="M33 31l3-4" />
      <path d="M37 20l-3 5h3l-4 6" stroke={PRUNE} />
      {/* corps */}
      <path d="M17 30c-2 2-3 5-3 9M31 30c1 1 2 2 2 4" />
    </Svg>
  );
}

export function Gargouille({ size, className }: P) {
  return (
    <Svg size={size} className={className} title="La gargouille">
      {/* cornes */}
      <path d="M16 15l-3-6M32 15l3-6" />
      {/* tête angulaire */}
      <path d="M15 16l9-4 9 4-3 10-6 3-6-3z" />
      {/* yeux fendus (un rouge) */}
      <path d="M19 19l3 1" />
      <path d="M29 19l-3 1" stroke={PRUNE} />
      {/* grimace crocs */}
      <path d="M20 25l2 2 2-2 2 2 2-2" />
      {/* ailes repliées */}
      <path d="M14 27c-4 0-6 3-6 7 3-1 5-1 7 1M34 27c4 0 6 3 6 7-3-1-5-1-7 1" />
    </Svg>
  );
}

export function Fee({ size, className }: P) {
  return (
    <Svg size={size} className={className} title="La fée">
      {/* ailes nettes (deux feuilles) */}
      <path d="M23 24c-6-6-12-3-11 3 5 3 9 1 11-3z" />
      <path d="M25 24c6-6 12-3 11 3-5 3-9 1-11-3z" />
      {/* tête + couettes */}
      <circle cx="24" cy="13" r="3" />
      <path d="M21 11l-3-2M27 11l3-2" />
      {/* robe courte */}
      <path d="M24 16l-5 11h10z" />
      <path d="M22 27l-1 4M26 27l1 4" />
      {/* baguette tendue + étoile rouge */}
      <path d="M27 19l8-3" />
      <EtoileRouge cx={36} cy={15} r={3} />
    </Svg>
  );
}

export function Oracle({ size, className }: P) {
  return (
    <Svg size={size} className={className} title="L'oracle">
      {/* grande capuche */}
      <path d="M13 24c0-10 22-10 22 0" />
      <path d="M13 24c0 3 2 5 4 6M35 24c0 3-2 5-4 6" />
      {/* visage masqué, un seul œil visible */}
      <path d="M20 23h3M26 23h2" />
      {/* boule de cristal à lueur rouge */}
      <circle cx="24" cy="35" r="5" />
      <circle cx="24" cy="35" r="1.6" fill={PRUNE} stroke="none" />
      <path d="M20 40h8" />
    </Svg>
  );
}

export function Dragon({ size, className }: P) {
  return (
    <Svg size={size} className={className} title="Le dragon">
      {/* corps en S */}
      <path d="M10 37c6 1 7-5 7-9 0-4 3-7 8-7" />
      {/* tête + gueule */}
      <path d="M25 13h5a4 4 0 0 1 0 8h-2" />
      <path d="M28 13l1-4" />
      <circle cx="29" cy="17" r="0.9" fill="currentColor" stroke="none" />
      {/* aile triangulaire */}
      <path d="M17 26l11-3-3 7z" />
      {/* pattes */}
      <path d="M14 33v4M20 33v4" />
      {/* feu rouge */}
      <path d="M30 17h4" stroke={PRUNE} />
      <EtoileRouge cx={38} cy={17} r={2.6} />
    </Svg>
  );
}

export function Chouette({ size, className }: P) {
  return (
    <Svg size={size} className={className} title="La chouette">
      {/* aigrettes dressées */}
      <path d="M16 12l3 5M32 12l-3 5" />
      {/* corps */}
      <path d="M24 12c-7 0-11 6-11 13 0 7 5 11 11 11s11-4 11-11c0-7-4-13-11-13z" />
      {/* sourcils + yeux (un rouge), air blasé */}
      <path d="M16 19l6 1M32 19l-6 1" />
      <circle cx="19.5" cy="23" r="2.6" />
      <circle cx="28.5" cy="23" r="2.6" />
      <circle cx="19.5" cy="23.5" r="0.9" fill="currentColor" stroke="none" />
      <circle cx="28.5" cy="23.5" r="1" fill={PRUNE} stroke="none" />
      <path d="M24 26l-1.5 2.5h3z" />
    </Svg>
  );
}

export function Gnome({ size, className }: P) {
  return (
    <Svg size={size} className={className} title="Le gnome">
      {/* long bonnet tombant */}
      <path d="M16 20c0-9 16-9 16 0z" />
      <path d="M24 6c-4 3-6 9-8 14" />
      <circle cx="16" cy="20.5" r="2" fill={PRUNE} stroke="none" />
      {/* sourcils froncés + nez */}
      <path d="M19 21l3 1M29 21l-3 1" />
      <circle cx="24" cy="24" r="2.2" />
      {/* barbe en pointe */}
      <path d="M18 23c0 8 3 13 6 15 3-2 6-7 6-15" />
      <path d="M22 27h4" />
    </Svg>
  );
}

export function Farfadet({ size, className }: P) {
  return (
    <Svg size={size} className={className} title="Le farfadet">
      {/* chapeau haut-de-forme incliné + trèfle rouge */}
      <path d="M17 16l1-9h9l1 9z" />
      <path d="M14 16h20" />
      <circle cx="22" cy="10" r="1.6" fill={PRUNE} stroke="none" />
      {/* visage malin */}
      <path d="M17 16c0 6 3 9 7 9s7-3 7-9" />
      <path d="M20 19h2.5M26 19h2.5" />
      <Rictus x={21} y={22} w={6} />
      {/* barbichette + bras croisés */}
      <path d="M23 25l1 2 1-2" />
      <path d="M16 30c3 1 5 3 8 3s5-2 8-3" />
    </Svg>
  );
}

export function Sirene({ size, className }: P) {
  return (
    <Svg size={size} className={className} title="La sirène">
      {/* tête + cheveux longs */}
      <circle cx="24" cy="12" r="3.4" />
      <path d="M20 12c-3 3-4 8-3 13M28 12c3 3 4 8 3 13" />
      <path d="M21 13h2M25 13h2" />
      {/* buste */}
      <path d="M24 16v8" />
      <path d="M20 20h8" />
      {/* queue de poisson sinueuse */}
      <path d="M24 24c-4 3-4 8-2 11" />
      <path d="M22 35l-5 2 3-4M22 35l4 3-1-5" />
      {/* écaille rouge */}
      <EtoileRouge cx={27} cy={28} r={2.2} />
    </Svg>
  );
}

export function Golem({ size, className }: P) {
  return (
    <Svg size={size} className={className} title="Le golem">
      {/* tête de pierre carrée */}
      <path d="M15 12h18v12H15z" />
      <path d="M15 17h18" />
      {/* yeux (une lueur rouge) + bouche fissure */}
      <rect x="19" y="19" width="2.4" height="2.4" />
      <rect x="26.6" y="19" width="2.4" height="2.4" fill={PRUNE} stroke="none" />
      <path d="M20 23h8" />
      {/* épaules massives + fissures */}
      <path d="M13 26h22v10H13z" />
      <path d="M20 26v10M28 26v10M24 29l-2 3 2 2" />
    </Svg>
  );
}

export function Phenix({ size, className }: P) {
  return (
    <Svg size={size} className={className} title="Le phénix">
      {/* corps d'oiseau */}
      <path d="M24 16c-3 0-5 2-5 6 0 5 3 9 5 12 2-3 5-7 5-12 0-4-2-6-5-6z" />
      {/* crête de flammes rouges */}
      <path d="M24 16l-1-5 2 2 1-4 1 4 2-2-1 5" stroke={PRUNE} />
      {/* bec + œil */}
      <path d="M24 20l-2-2M24 20l2-2" />
      <circle cx="24" cy="22" r="0.9" fill="currentColor" stroke="none" />
      {/* grandes ailes déployées, anguleuses */}
      <path d="M19 22l-11-2 4 4-5 2 9 2M29 22l11-2-4 4 5 2-9 2" />
    </Svg>
  );
}

export function Loupgarou({ size, className }: P) {
  return (
    <Svg size={size} className={className} title="Le loup-garou">
      {/* oreilles pointues */}
      <path d="M16 15l-2-7 6 4M32 15l2-7-6 4" />
      {/* tête anguleuse + museau */}
      <path d="M15 16l9-3 9 3-2 8-7 6-7-6z" />
      {/* yeux fendus (un rouge) */}
      <path d="M18 19l3 1" />
      <path d="M30 19l-3 1" stroke={PRUNE} />
      {/* museau + crocs */}
      <path d="M22 24h4l-2 2z" />
      <path d="M20 26l1 2M28 26l-1 2" />
      {/* poil hérissé nuque */}
      <path d="M17 24l-2 2M31 24l2 2" />
    </Svg>
  );
}

export function Elfe({ size, className }: P) {
  return (
    <Svg size={size} className={className} title="L'elfe">
      {/* cheveux + bandeau à gemme rouge */}
      <path d="M17 15c1-4 13-4 14 0" />
      <path d="M16 16h16" />
      <EtoileRouge cx={24} cy={13} r={2} />
      {/* visage fin */}
      <path d="M18 16c0 7 3 11 6 11s6-4 6-11" />
      <path d="M20 20h2.5M25.5 20h2.5" />
      <Rictus x={21} y={23} w={6} />
      {/* oreilles pointues */}
      <path d="M18 18l-3-2 2 4M30 18l3-2-2 4" />
      {/* épaules */}
      <path d="M18 28c-2 2-3 5-3 8M30 28c2 2 3 5 3 8" />
    </Svg>
  );
}

export function Korrigan({ size, className }: P) {
  return (
    <Svg size={size} className={className} title="Le korrigan">
      {/* grandes oreilles de lutin facétieux */}
      <path d="M16 20l-6-2 4 6M32 20l6-2-4 6" />
      {/* tête ronde-anguleuse */}
      <path d="M16 20c0-6 16-6 16 0 0 6-4 10-8 10s-8-4-8-10z" />
      {/* gros sourcils + petits yeux rapprochés */}
      <path d="M20 19l2 1M28 19l-2 1" />
      <circle cx="22" cy="22" r="0.9" fill="currentColor" stroke="none" />
      <circle cx="26" cy="22" r="0.9" fill="currentColor" stroke="none" />
      {/* large rictus de malice + dent rouge */}
      <path d="M20 25q4 4 8 0" />
      <path d="M24 25v2.5" stroke={PRUNE} />
    </Svg>
  );
}

export function Fantome({ size, className }: P) {
  return (
    <Svg size={size} className={className} title="Le fantôme">
      {/* drap flottant festonné */}
      <path d="M14 36V22c0-7 5-11 10-11s10 4 10 11v14l-3-3-3 3-4-3-4 3-3-3z" />
      {/* yeux vides (un rouge) + rictus */}
      <path d="M19 21v3" />
      <path d="M29 21v3" stroke={PRUNE} />
      <Rictus x={21} y={27} w={6} />
    </Svg>
  );
}

export function Demon({ size, className }: P) {
  return (
    <Svg size={size} className={className} title="Le petit démon">
      {/* cornes rouges */}
      <path d="M17 13l-2-5c3 1 4 3 4 5M31 13l2-5c-3 1-4 3-4 5" stroke={PRUNE} />
      {/* tête */}
      <path d="M16 15c0-5 16-5 16 0 0 7-4 11-8 11s-8-4-8-11z" />
      {/* yeux en amande + rictus narquois */}
      <path d="M19 18l3 1M29 18l-3 1" />
      <path d="M20 23q4 3 8 0" />
      {/* petit corps + queue fourchue */}
      <path d="M18 27c-1 4-1 8 0 11M30 27c1 4 1 8 0 11" />
      <path d="M31 33c3 1 4 3 4 5l-2-1 1 2" />
    </Svg>
  );
}

export function Vampire({ size, className }: P) {
  return (
    <Svg size={size} className={className} title="Le vampire">
      {/* cheveux en pic (widow's peak) */}
      <path d="M16 16c0-6 16-6 16 0" />
      <path d="M24 16v-3" />
      {/* visage */}
      <path d="M17 16c0 6 3 10 7 10s7-4 7-10" />
      {/* sourcils + yeux */}
      <path d="M19 18l3 1M29 18l-3 1" />
      {/* crocs rouges */}
      <path d="M22 23l1 2M26 23l-1 2" stroke={PRUNE} />
      {/* col de cape dressé */}
      <path d="M17 26l-4 3 5 2M31 26l4 3-5 2" />
      <path d="M20 28c2 2 6 2 8 0" />
    </Svg>
  );
}

export const PERSONNAGE_COMPOSANT: Record<PersonnageKey, (p: P) => React.ReactElement> = {
  lutin: Lutin,
  sorciere: Sorciere,
  troll: Troll,
  magicienne: Magicienne,
  gargouille: Gargouille,
  fee: Fee,
  oracle: Oracle,
  dragon: Dragon,
  chouette: Chouette,
  gnome: Gnome,
  farfadet: Farfadet,
  sirene: Sirene,
  golem: Golem,
  phenix: Phenix,
  loupgarou: Loupgarou,
  elfe: Elfe,
  korrigan: Korrigan,
  fantome: Fantome,
  demon: Demon,
  vampire: Vampire,
};

export function Personnage({ who, size, className }: { who: PersonnageKey } & P) {
  const C = PERSONNAGE_COMPOSANT[who];
  return <C size={size} className={className} />;
}
