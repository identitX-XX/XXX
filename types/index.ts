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
