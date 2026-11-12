/**
 * Jeu 9 — La Boîte à Astuces : règles pures.
 * La modération est ici un filtre simple ; l'agent IA « Modérateur d'astuces » prendra le relais à l'étape 4.
 */

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

// Liste volontairement courte : un filtre de premier niveau, pas une modération complète.
const MOTS_INTERDITS = ["connard", "connasse", "salope", "enculé", "encule", "pute", "nique", "batard", "bâtard", "pd", "fdp", "ntm"];

function normaliser(s: string) {
  return s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

/** Nettoie une astuce et renvoie un message d'erreur s'il y a un problème. */
export function verifierAstuce(titreBrut: string, texteBrut: string): { titre: string; texte: string; erreur?: string } {
  const titre = titreBrut.trim().replace(/\s+/g, " ");
  const texte = texteBrut.trim().replace(/[ \t]+/g, " ").replace(/\n{3,}/g, "\n\n");
  if (titre.length < 5 || titre.length > 80) return { titre, texte, erreur: "Le titre doit faire entre 5 et 80 caractères." };
  if (texte.length < 20 || texte.length > 500) return { titre, texte, erreur: "L'astuce doit faire entre 20 et 500 caractères." };
  const tout = `${titre} ${texte}`;
  if (/[\w.+-]+@[\w-]+\.[\w.]+/.test(tout) || /(\+33|\b0)[1-9](?:[ .-]?\d{2}){4}\b/.test(tout))
    return { titre, texte, erreur: "Pour votre sécurité, ne partagez pas d'e-mail ni de numéro de téléphone." };
  if (/(https?:\/\/|www\.|\b[\w.-]+\.(com|fr|net|org|io)\b)/i.test(tout))
    return { titre, texte, erreur: "Les liens ne sont pas autorisés dans les astuces." };
  const mots = normaliser(tout).split(/[^a-z0-9]+/);
  if (mots.some((m) => MOTS_INTERDITS.includes(m))) return { titre, texte, erreur: "Merci de rester courtois avec vos voisins." };
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
