import type { Axis } from "@/types";

// ============================================================================
// Barème ToxicitX — 100 % paramétrable ici, sans toucher à la logique.
// ============================================================================

/** Un niveau de toxicité (1 à 6). */
export interface ToxicityLevel {
  level: number; // 1..6
  /** Score minimum (0–100) pour atteindre ce niveau. */
  minScore: number;
  name: string;
  emoji: string;
  /** Résumé lisible du climat. */
  summary: string;
  /** Clé de couleur Tailwind : text-tox-1 … text-tox-6. */
  colorKey: number;
}

/**
 * 6 niveaux, du plus sain au plus grave. Bornes de score croissantes.
 * L'ordre décroissant (du plus grave au plus léger) simplifie la recherche.
 */
export const LEVELS: ToxicityLevel[] = [
  {
    level: 6,
    minScore: 84,
    name: "Extrême",
    emoji: "☢️",
    summary:
      "Zone de danger. L'organisation abîme les gens. La question n'est plus « est-ce toxique » mais « comment se protéger, vite ».",
    colorKey: 6,
  },
  {
    level: 5,
    minScore: 67,
    name: "Toxique",
    emoji: "🧪",
    summary:
      "Toxicité installée et systémique. Ce n'est plus une mauvaise passe : c'est le fonctionnement normal de la maison.",
    colorKey: 5,
  },
  {
    level: 4,
    minScore: 51,
    name: "Tendue",
    emoji: "🔥",
    summary:
      "Ça chauffe pour de vrai. Les signaux de toxicité sont réguliers et commencent à coûter cher (moral, départs, santé).",
    colorKey: 4,
  },
  {
    level: 3,
    minScore: 34,
    name: "Fragile",
    emoji: "⚠️",
    summary:
      "Une base correcte mais des fissures nettes. Rien d'irréparable, à condition d'agir avant que ça ne s'enkyste.",
    colorKey: 3,
  },
  {
    level: 2,
    minScore: 17,
    name: "Sous tension",
    emoji: "😬",
    summary:
      "Globalement sain, avec du stress ordinaire et quelques irritants. Vigilance, pas panique.",
    colorKey: 2,
  },
  {
    level: 1,
    minScore: 0,
    name: "Saine",
    emoji: "🌿",
    summary:
      "Un environnement franchement sain. Profitez-en (et gardez un œil, la toxicité aime les endroits qui se croient à l'abri).",
    colorKey: 1,
  },
];

/**
 * Poids de chaque axe dans le score global. Doivent sommer à 1.
 * Ajustable si un axe doit peser plus (ex. management descendant).
 */
export const AXIS_WEIGHTS: Record<Axis, number> = {
  ascendante: 1 / 3,
  descendante: 1 / 3,
  laterale: 1 / 3,
};

/**
 * Nombre maximum de profils dominants renvoyés dans les résultats.
 */
export const MAX_DOMINANT_PROFILES = 3;

// ---------------------------------------------------------------------------
// Seuils d'anonymat (agrégation entreprise / équipe)
// ---------------------------------------------------------------------------

/** En dessous, aucun résultat agrégé n'est affiché. */
export const MIN_RESPONSES_ANY = 5;
/** Restitution par équipe / manager : seuil renforcé. */
export const MIN_RESPONSES_TEAM = 10;
