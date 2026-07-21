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

// Momentum : le moteur de rétention. Série de jours calendaires consécutifs
// (« ne casse pas la chaîne »), record, et jalons (7/14/21/30). Tout dérivé des
// dates ISO de l'historique — pur, déterministe.
export interface Momentum {
  serie: number; // jours calendaires consécutifs jusqu'à aujourd'hui (ou hier)
  record: number; // meilleure série jamais atteinte
  actifAujourdhui: boolean; // une journée a-t-elle été close aujourd'hui
  jalonAtteint: number | null; // un cap (7/14/21/30) est-il pile franchi
  prochainJalon: number | null; // prochain cap à viser
  resteAvantJalon: number; // journées restantes avant ce cap
}

const JALONS = [7, 14, 21, 30];

// Index de jour calendaire local (minuit local), stable et comparable.
function jourCal(iso: string): number {
  const d = new Date(iso);
  return Math.floor((d.getTime() - d.getTimezoneOffset() * 60000) / 86400000);
}

export function momentum(etat: EtatEvolution): Momentum {
  const faits = etat.historique.length;
  const jours = Array.from(
    new Set(etat.historique.map((h) => jourCal(h.date)))
  ).sort((a, b) => a - b);

  // Record : plus longue suite de jours calendaires consécutifs.
  let record = 0;
  let run = 0;
  let prev: number | null = null;
  for (const j of jours) {
    run = prev !== null && j === prev + 1 ? run + 1 : 1;
    if (run > record) record = run;
    prev = j;
  }

  // Série courante : suite se terminant aujourd'hui — ou hier (grâce : la
  // journée du jour n'est pas encore forcément close).
  const today = jourCal(new Date().toISOString());
  let serie = 0;
  if (jours.length) {
    const last = jours[jours.length - 1];
    if (last === today || last === today - 1) {
      serie = 1;
      for (let i = jours.length - 2; i >= 0; i--) {
        if (jours[i] === jours[i + 1] - 1) serie++;
        else break;
      }
    }
  }

  const prochainJalon = JALONS.find((j) => j > faits) ?? null;

  return {
    serie,
    record,
    actifAujourdhui: jours.length ? jours[jours.length - 1] === today : false,
    jalonAtteint: JALONS.includes(faits) ? faits : null,
    prochainJalon,
    resteAvantJalon: prochainJalon ? prochainJalon - faits : 0,
  };
}
