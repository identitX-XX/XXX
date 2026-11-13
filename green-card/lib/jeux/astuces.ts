/**
 * Jeu 9 — La Boîte à Astuces : règles pures.
 * La modération est ici un filtre simple ; l'agent IA « Modérateur d'astuces » prendra le relais à l'étape 4.
 */

import { nettoyerLigne, nettoyerTexte, problemeContenu } from "./moderation";

export const ASTUCES_MAX_PAR_JOUR = 3;
export const SIGNALEMENTS_MASQUAGE = 3;
export const VOTES_POUR_OR = 5;
export const VOTES_DONNES_ARGENT = 5;

export const UNIVERS_ASTUCE = [
  { id: "energie", nom: "Énergie", emoji: "⚡" },
  { id: "eau", nom: "Eau", emoji: "💧" },
  { id: "dechets", nom: "Déchets", emoji: "♻️" },
  { id: "mobilite", nom: "Mobilité", emoji: "🚲" },
  { id: "seconde-main", nom: "Seconde main", emoji: "👕" },
  { id: "cuisine", nom: "Cuisine", emoji: "🥕" },
] as const;

export type UniversAstuce = (typeof UNIVERS_ASTUCE)[number]["id"];

export function estUniversAstuce(v: unknown): v is UniversAstuce {
  return UNIVERS_ASTUCE.some((u) => u.id === v);
}

/** Nettoie une astuce et renvoie un message d'erreur s'il y a un problème. */
export function verifierAstuce(titreBrut: string, texteBrut: string): { titre: string; texte: string; erreur?: string } {
  const titre = nettoyerLigne(titreBrut);
  const texte = nettoyerTexte(texteBrut);
  if (titre.length < 5 || titre.length > 80) return { titre, texte, erreur: "Le titre doit faire entre 5 et 80 caractères." };
  if (texte.length < 20 || texte.length > 500) return { titre, texte, erreur: "L'astuce doit faire entre 20 et 500 caractères." };
  const erreur = problemeContenu(`${titre} ${texte}`);
  if (erreur) return { titre, texte, erreur };
  return { titre, texte };
}

/**
 * Médailles de la Boîte à Astuces :
 * Bronze : publier une astuce ; Argent : une astuce publiée + 5 votes donnés aux voisins ;
 * Or : une de ses astuces reçoit au moins 5 votes.
 */
export function niveauAstuces(p: { publiees: number; votesDonnes: number; meilleurScore: number }): number {
  if (p.publiees < 1) return 0;
  if (p.meilleurScore >= VOTES_POUR_OR) return 3;
  if (p.votesDonnes >= VOTES_DONNES_ARGENT) return 2;
  return 1;
}
