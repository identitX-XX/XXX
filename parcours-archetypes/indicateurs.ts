// parcours-archetypes/indicateurs.ts
// Lectures dérivées de l'état d'évolution, pour le tableau de bord.
// Tout est pur (aucun effet de bord) : mêmes entrées → mêmes sorties.

import {
  ArchetypeKey,
  EmotionKey,
  EtatEvolution,
  SnapshotJour,
  SphereKey,
} from "./types";
import {
  ARCHETYPE_KEYS,
  EMOTION_KEYS,
  SPHERE_KEYS,
  archetypeByKey,
  emotionByKey,
} from "./archetypes";
import { dominant, radarDepuisMatrice, spheresDepuisMatrice } from "./evolution";

export interface PointRadar {
  key: ArchetypeKey;
  name: string;
  valeur: number;
}

export interface PartSphere {
  key: SphereKey;
  label: string;
  valeur: number; // 0..100 brut
  part: number; // 0..100 en % de l'énergie totale
}

export interface RangArchetype {
  key: ArchetypeKey;
  name: string;
  valeur: number;
}

// Radar courant (12 archétypes).
export function radarCourant(etat: EtatEvolution): PointRadar[] {
  const r = radarDepuisMatrice(etat.matrice);
  return ARCHETYPE_KEYS.map((k) => ({
    key: k,
    name: archetypeByKey[k].name,
    valeur: Math.round(r[k]),
  }));
}

// Top N capsules identitaires actives.
export function topArchetypes(etat: EtatEvolution, n = 3): RangArchetype[] {
  return radarCourant(etat)
    .slice()
    .sort((a, b) => b.valeur - a.valeur)
    .slice(0, n)
    .map((p) => ({ key: p.key, name: p.name, valeur: p.valeur }));
}

// Capsule identitaire dominante du moment.
export function archetypeDominant(etat: EtatEvolution): RangArchetype | null {
  if (!etat.historique.length && moyenneNulle(etat)) return null;
  const k = dominant(radarDepuisMatrice(etat.matrice));
  return {
    key: k,
    name: archetypeByKey[k].name,
    valeur: Math.round(radarDepuisMatrice(etat.matrice)[k]),
  };
}

function moyenneNulle(etat: EtatEvolution): boolean {
  return ARCHETYPE_KEYS.every((a) =>
    SPHERE_KEYS.every((s) => etat.matrice[a][s] === etat.matrice[ARCHETYPE_KEYS[0]][SPHERE_KEYS[0]])
  );
}

// Équilibre des sphères (parts en %).
export function equilibreSpheres(etat: EtatEvolution): PartSphere[] {
  const sph = spheresDepuisMatrice(etat.matrice);
  const total = SPHERE_KEYS.reduce((s, k) => s + sph[k], 0) || 1;
  return SPHERE_KEYS.map((k) => ({
    key: k,
    label: labelSphere(k),
    valeur: Math.round(sph[k]),
    part: Math.round((sph[k] / total) * 100),
  }));
}

function labelSphere(k: SphereKey): string {
  return { travail: "Travail", relations: "Relations", creation: "Création", corps: "Corps & énergie", sens: "Sens & intériorité" }[k];
}

// Courbe d'évolution : cohérence + respiration par jour.
export interface PointEvolution {
  jour: number;
  coherence: number;
  respiration: number;
  dominant: ArchetypeKey;
}
export function courbeEvolution(etat: EtatEvolution): PointEvolution[] {
  return etat.historique.map((h: SnapshotJour) => ({
    jour: h.jour,
    coherence: Math.round(h.coherence),
    respiration: Math.round(h.respiration),
    dominant: dominant(h.radar),
  }));
}

// Cohérence courante (dernier snapshot) ou neutre.
export function coherenceCourante(etat: EtatEvolution): number {
  const last = etat.historique[etat.historique.length - 1];
  return last ? Math.round(last.coherence) : 0;
}

// Heatmap émotions : fréquence par émotion sur les jours vécus.
export interface CelluleEmotion {
  key: EmotionKey;
  label: string;
  valence: number;
  frequence: number; // 0..1
  compte: number;
}
export function heatmapEmotions(etat: EtatEvolution): CelluleEmotion[] {
  const jours = etat.historique.length || 1;
  const compte: Record<EmotionKey, number> = Object.fromEntries(
    EMOTION_KEYS.map((k) => [k, 0])
  ) as Record<EmotionKey, number>;
  for (const h of etat.historique)
    for (const e of h.emotions) compte[e] = (compte[e] ?? 0) + 1;
  return EMOTION_KEYS.map((k) => ({
    key: k,
    label: emotionByKey[k].label,
    valence: emotionByKey[k].valence,
    compte: compte[k],
    frequence: compte[k] / jours,
  }));
}

// Progression sur 30 jours.
export interface Progression {
  faits: number;
  total: number;
  part: number; // 0..100
  jourCourant: number;
}
export function progression(etat: EtatEvolution, total = 30): Progression {
  const faits = etat.historique.length;
  return {
    faits,
    total,
    part: Math.round((faits / total) * 100),
    jourCourant: etat.jourCourant,
  };
}
