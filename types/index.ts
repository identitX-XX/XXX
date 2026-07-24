export interface Profile {
  name: string;
  age: string;
  situation: string;
  goal: string;
  energy: number; // 0-100
  clarity: number; // 0-100
  blocker: string;
  understand: string;
  values: string[];
  strengths: string[];
  fear: string;
  ambition: string;
  keyword: string;
}

export interface IdentityCard {
  id: string;
  category: string;
  text: string;
  level: number; // 0-100 self-rated
  tags: string[];
  // true = complété par l'utilisatrice (issu de ses réponses ou édité par elle).
  // false = amorce générique, encore à compléter.
  rempli?: boolean;
}

export interface TimelineEvent {
  id: string;
  date: string; // YYYY or free text
  title: string;
  importance: number; // 0-100
  emotion: string;
  lesson: string;
  impact: string;
}

export interface JournalEntry {
  id: string;
  date: string; // ISO date
  mood: number; // 0-100
  energy: number;
  stress: number;
  confidence: number;
  gratitude: string;
  thoughts: string;
  tags: string[];
}

export interface RadarPoint {
  axis: string;
  value: number; // 0-100
}

export interface CoachMessage {
  id: string;
  role: "user" | "coach";
  content: string;
}

export interface Scores {
  selfKnowledge: number;
  clarity: number;
  energy: number;
  alignment: number;
}

export type Theme = "dark" | "light";

// ---- Constellation slices (journal d'expansion, cartographie, chat coach) ----

/** Une entrée du journal d'expansion (4 dimensions notées /10). */
export interface FusionEntry {
  date: string; // "YYYY-MM-DD"
  etatInterne: number | null;
  clarte: number | null;
  actionRelationnelle: number | null;
  exposition: number | null;
  poidsJour?: number;
  gratitude?: string;
  pensees?: string;
}

/** Une identité de la cartographie cognitive (énergie donnée / reçue /10). */
export interface Identity {
  id: string;
  name: string;
  given: number;
  received: number;
}

/** Un message du chat Coach IA (distinct de l'ancien CoachMessage). */
export interface ChatMsg {
  role: "user" | "assistant";
  content: string;
}
