import {
  AXES,
  type Answers,
  type Axis,
  type AxisScore,
  type Question,
  type ScoringResult,
  type ToxicityProfile,
} from "@/types";
import {
  AXIS_WEIGHTS,
  LEVELS,
  MAX_DOMINANT_PROFILES,
  type ToxicityLevel,
} from "./scoring.config";

/** Convertit un score 0–100 en niveau 1–6. */
export function scoreToLevel(score: number): number {
  const clamped = clamp(score, 0, 100);
  // LEVELS est trié du plus grave (6) au plus léger (1).
  for (const lvl of LEVELS) {
    if (clamped >= lvl.minScore) return lvl.level;
  }
  return 1;
}

/** Métadonnées d'un niveau (nom, emoji, résumé, couleur). */
export function levelInfo(level: number): ToxicityLevel {
  const found = LEVELS.find((l) => l.level === level);
  if (!found) throw new Error(`Niveau inconnu : ${level}`);
  return found;
}

/**
 * Score d'un axe sur 0–100.
 * Ne compte que les questions effectivement répondues.
 * Les questions `reverse` sont inversées (une réponse "Toujours" y est saine).
 */
export function computeAxisScore(
  axis: Axis,
  answers: Answers,
  questions: Question[]
): number {
  const axisQuestions = questions.filter((q) => q.axis === axis);
  let weightedSum = 0;
  let maxWeighted = 0;

  for (const q of axisQuestions) {
    const raw = answers[q.id];
    if (raw === undefined) continue; // question non répondue : ignorée
    const weight = q.weight ?? 1;
    const value = q.reverse ? 4 - raw : raw;
    weightedSum += value * weight;
    maxWeighted += 4 * weight;
  }

  if (maxWeighted === 0) return 0;
  return round1((weightedSum / maxWeighted) * 100);
}

/** Scores + niveaux pour les 3 axes. */
export function computeAxisScores(
  answers: Answers,
  questions: Question[]
): AxisScore[] {
  return AXES.map((axis) => {
    const score = computeAxisScore(axis, answers, questions);
    return { axis, score, level: scoreToLevel(score) };
  });
}

/** Score global 0–100 : moyenne des axes pondérée par AXIS_WEIGHTS. */
export function computeGlobalScore(axisScores: AxisScore[]): number {
  let sum = 0;
  let weightTotal = 0;
  for (const a of axisScores) {
    const w = AXIS_WEIGHTS[a.axis] ?? 0;
    sum += a.score * w;
    weightTotal += w;
  }
  if (weightTotal === 0) return 0;
  return round1(sum / weightTotal);
}

/**
 * Détermine 1–3 profils dominants.
 * Un profil matche si TOUS ses critères sont satisfaits (niveau d'axe atteint).
 * On privilégie les profils les plus "spécifiques" (combinant plusieurs axes),
 * puis leur spécificité déclarée, puis l'intensité des axes concernés.
 * Le profil "baseline" (sans critère) ne sort que si rien d'autre ne matche.
 */
export function findDominantProfiles(
  axisScores: AxisScore[],
  profiles: ToxicityProfile[]
): ToxicityProfile[] {
  const levelByAxis = new Map<Axis, number>(
    axisScores.map((a) => [a.axis, a.level])
  );

  const matches = profiles.filter((p) =>
    p.criteria.every((c) => (levelByAxis.get(c.axis) ?? 0) >= c.minLevel)
  );

  const specific = matches.filter((p) => p.criteria.length > 0);
  const pool = specific.length > 0 ? specific : matches;

  const intensity = (p: ToxicityProfile) =>
    p.criteria.reduce((s, c) => s + (levelByAxis.get(c.axis) ?? 0), 0);

  pool.sort((a, b) => {
    if (b.criteria.length !== a.criteria.length)
      return b.criteria.length - a.criteria.length;
    if (b.specificity !== a.specificity) return b.specificity - a.specificity;
    return intensity(b) - intensity(a);
  });

  return pool.slice(0, MAX_DOMINANT_PROFILES);
}

/** Pipeline complet : réponses -> résultat. */
export function score(
  answers: Answers,
  questions: Question[],
  profiles: ToxicityProfile[]
): ScoringResult {
  const axes = computeAxisScores(answers, questions);
  const global = computeGlobalScore(axes);
  return {
    global,
    level: scoreToLevel(global),
    axes,
    profiles: findDominantProfiles(axes, profiles),
  };
}

/**
 * Filet de sécurité : renvoie true si au moins un item « grave » a été
 * répondu Souvent (3) ou Toujours (4). Sert à afficher le message de
 * ressources quel que soit le score global.
 */
export function graveTriggered(answers: Answers, questions: Question[]): boolean {
  return questions.some((q) => q.grave && (answers[q.id] ?? 0) >= 3);
}

// --- utils ---
function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n));
}
function round1(n: number): number {
  return Math.round(n * 10) / 10;
}
