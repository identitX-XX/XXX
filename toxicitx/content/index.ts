import type { Question, Remedy, ToxicityProfile } from "@/types";
import questionsData from "./questions.json";
import profilesData from "./profiles.json";
import remediesData from "./remedies.json";

export const QUESTIONS = questionsData as Question[];
export const PROFILES = profilesData as ToxicityProfile[];
export const REMEDIES = remediesData as Remedy[];

/** Remèdes d'un profil, triés par priorité puis par type. */
export function remediesForProfile(profileId: string): Remedy[] {
  return REMEDIES.filter((r) => r.profileId === profileId).sort(
    (a, b) => a.priority - b.priority
  );
}
