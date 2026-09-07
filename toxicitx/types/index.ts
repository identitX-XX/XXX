// ============================================================================
// ToxicitX — Modèle de données
// ============================================================================

/** Les 3 axes de toxicité mesurés par le quiz. */
export type Axis = "ascendante" | "descendante" | "laterale";

export const AXES: Axis[] = ["ascendante", "descendante", "laterale"];

export const AXIS_LABELS: Record<Axis, string> = {
  ascendante: "Toxicité ascendante (vers la direction / le N+1)",
  descendante: "Toxicité descendante (du management vers l'équipe)",
  laterale: "Toxicité latérale (entre collègues)",
};

export const AXIS_SHORT: Record<Axis, string> = {
  ascendante: "Vers le haut",
  descendante: "Vers le bas",
  laterale: "Entre collègues",
};

/** Échelle de réponse : Jamais(0) → Toujours(4). */
export type ScaleValue = 0 | 1 | 2 | 3 | 4;

export const SCALE: { value: ScaleValue; label: string }[] = [
  { value: 0, label: "Jamais" },
  { value: 1, label: "Rarement" },
  { value: 2, label: "Parfois" },
  { value: 3, label: "Souvent" },
  { value: 4, label: "Toujours" },
];

/** Une question du quiz (mini-scénario concret). */
export interface Question {
  id: string;
  axis: Axis;
  /** Sous-thème lisible (ex. "Décisions", "Feedback", "Favoritisme"). */
  theme: string;
  /** Énoncé, ton crédible mais un peu drôle. */
  text: string;
  /** Poids relatif de la question dans son axe (défaut 1). */
  weight?: number;
  /**
   * Si true, un score ÉLEVÉ (souvent/toujours) est SAIN et non toxique :
   * la valeur est inversée au scoring. Sert aux formulations positives.
   */
  reverse?: boolean;
  /**
   * Item « grave » (humiliation, bouc émissaire, propos rabaissants…).
   * Répondu Souvent/Toujours, il déclenche le message de ressources,
   * quel que soit le score global (filet de sécurité / devoir de vigilance).
   */
  grave?: boolean;
}

// ---------------------------------------------------------------------------
// Onboarding (contexte non identifiant)
// ---------------------------------------------------------------------------

export type Genre = "H" | "F" | "NSP"; // NSP = ne souhaite pas le dire

export interface OnboardingContext {
  genre: Genre | null;
  secteur: string | null;
  tailleEntreprise: string | null; // tranche (ex. "50-249")
  niveauPoste: string | null; // ex. "Opérationnel", "Manager", "Direction"
  anciennete: string | null; // tranche (ex. "1-3 ans")
  encadrement: boolean | null; // manage-t-il une équipe ?
}

// ---------------------------------------------------------------------------
// Profils de toxicité
// ---------------------------------------------------------------------------

/** Un critère de déclenchement d'un profil sur un axe. */
export interface ProfileCriterion {
  axis: Axis;
  /** Niveau minimum (1–6) atteint sur cet axe pour valider le critère. */
  minLevel: number;
}

export interface ToxicityProfile {
  id: string;
  /** Nom mémorable / "monstre de bureau". */
  name: string;
  emoji: string;
  tagline: string;
  description: string;
  /** Tous les critères doivent être satisfaits pour que le profil matche. */
  criteria: ProfileCriterion[];
  /** Départage les ex æquo : un profil plus spécifique gagne (plus haut = prioritaire). */
  specificity: number;
}

// ---------------------------------------------------------------------------
// Remèdes ("ordonnance")
// ---------------------------------------------------------------------------

export type RemedyType = "individuel" | "collectif";

export interface Remedy {
  id: string;
  profileId: string;
  type: RemedyType;
  /** Titre "posologie" court et drôle. */
  title: string;
  /** Action concrète et pertinente. */
  text: string;
  /** 1 = prioritaire. */
  priority: number;
}

// ---------------------------------------------------------------------------
// Résultat de scoring
// ---------------------------------------------------------------------------

export interface AxisScore {
  axis: Axis;
  /** Score 0–100. */
  score: number;
  /** Niveau 1–6. */
  level: number;
}

export interface ScoringResult {
  /** Score global 0–100. */
  global: number;
  /** Niveau global 1–6. */
  level: number;
  /** Détail par axe. */
  axes: AxisScore[];
  /** 1–3 profils dominants, du plus fort au plus faible. */
  profiles: ToxicityProfile[];
}

/** Réponses de l'utilisateur : questionId -> valeur choisie. */
export type Answers = Record<string, ScaleValue>;
