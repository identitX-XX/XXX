// parcours-archetypes/types.ts
// Toutes les interfaces du module. Local-first, aucun backend.
// Un archétype est une CAPSULE IDENTITAIRE d'exploration (jamais « tu es X ») : il se lit
// différemment selon les sphères de vie, et son activation respire dans le temps.

// --- Référentiels -----------------------------------------------------------

export type ArchetypeKey =
  | "explorateur"
  | "sage"
  | "createur"
  | "rebelle"
  | "protecteur"
  | "amoureux"
  | "batisseur"
  | "guerisseur"
  | "joueur"
  | "passeur"
  | "reveur"
  | "metamorphe";

export type SphereKey = "travail" | "relations" | "creation" | "corps" | "sens";

export type EmotionKey =
  | "joie"
  | "elan"
  | "apaisement"
  | "peur"
  | "colere"
  | "tristesse";

export type PhaseKey = "revelation" | "exploration" | "tension" | "metamorphose";

export interface Archetype {
  key: ArchetypeKey;
  name: string;
  // La capsule identitaire : une invitation à regarder, jamais un verdict.
  lens: string;
  // Une teinte pour la data-viz (HSL hue 0..360).
  hue: number;
}

export interface Sphere {
  key: SphereKey;
  label: string;
}

export interface Emotion {
  key: EmotionKey;
  label: string;
  // valence -1 (contraction) .. +1 (expansion), pour la heatmap.
  valence: number;
}

export interface Phase {
  key: PhaseKey;
  label: string;
  jours: [number, number]; // bornes incluses, ex. [1, 8]
  intention: string;
}

// --- Structure d'une journée (10 sections) ----------------------------------

export type SectionKind =
  | "intention"
  | "capsule"
  | "observation"
  | "defi"
  | "question"
  | "curseurs"
  | "emotions"
  | "note"
  | "echo"
  | "cloture";

export interface Section {
  id: string; // ex. "j1-curseurs"
  kind: SectionKind;
  titre: string;
  texte: string;
}

export interface Jour {
  n: number; // 1..30
  phase: PhaseKey;
  archetype: ArchetypeKey; // la capsule identitaire du jour
  sphereFocus: SphereKey;
  titre: string;
  sections: Section[]; // toujours 10
}

export interface Parcours {
  version: number;
  jours: Jour[]; // 30
}

// --- Réponses de l'utilisateur ---------------------------------------------

export interface ReponseJour {
  jour: number;
  archetype: ArchetypeKey;
  sphereFocus: SphereKey;
  // Intensité ressentie de la capsule identitaire dans chaque sphère (0..100).
  curseurs: Record<SphereKey, number>;
  emotions: EmotionKey[];
  intensiteDefi: number; // 0..100
  note: string;
  date: string; // ISO
}

// --- État d'évolution -------------------------------------------------------

// Matrice archétype × sphère (valeurs 0..100), cœur du moteur.
export type Matrice = Record<ArchetypeKey, Record<SphereKey, number>>;

export interface SnapshotJour {
  jour: number;
  date: string;
  radar: Record<ArchetypeKey, number>; // agrégé par archétype
  spheres: Record<SphereKey, number>; // énergie par sphère
  coherence: number; // 0..100 (clarté + stabilité)
  respiration: number; // 0..100 (part relâchée par la respiration ce jour)
  emotions: EmotionKey[];
}

export interface EtatEvolution {
  matrice: Matrice;
  historique: SnapshotJour[];
  jourCourant: number; // prochain jour à vivre (1..31)
}

export interface Diagnostic {
  dominant: ArchetypeKey;
  secondaire: ArchetypeKey;
}

// --- Constantes réglables du moteur ----------------------------------------

export interface ReglagesEvolution {
  // Réactivité de la moyenne mobile exponentielle (EMA) : 0..1.
  ALPHA: number;
  // Respiration anti-figement : fraction de relâchement vers la moyenne, 0..1.
  DECAY: number;
}
