/**
 * Jeu 4 — Opération 19 °C : règles pures.
 * Le foyer choisit ses engagements chauffage, puis coche chaque jour ceux qu'il a tenus.
 */

export const ENGAGEMENTS = [
  { id: "thermostat-19", emoji: "🌡️", titre: "19 °C dans les pièces de vie", aide: "Le thermostat ou les robinets des radiateurs sur 3 (≈ 19 °C)." },
  { id: "nuit-17", emoji: "🌙", titre: "16 à 17 °C la nuit dans les chambres", aide: "On dort mieux au frais, sous une bonne couette." },
  { id: "volets", emoji: "🪟", titre: "Volets et rideaux fermés le soir", aide: "Ils gardent la chaleur à l'intérieur." },
  { id: "aerer", emoji: "💨", titre: "Aérer 5 à 10 minutes, chauffage coupé", aide: "Fenêtre grande ouverte, pas entrouverte toute la journée." },
  { id: "radiateurs-libres", emoji: "🛋️", titre: "Rien devant ni sur les radiateurs", aide: "Pas de linge, de meuble ni de rideau qui bloque la chaleur." },
  { id: "absence", emoji: "🧳", titre: "Baisser le chauffage en cas d'absence", aide: "Hors-gel ou 16 °C si vous partez plus de 24 heures." },
  { id: "portes", emoji: "🚪", titre: "Portes fermées entre pièces chauffées et non chauffées", aide: "Le chaud reste là où on vit." },
  { id: "pull", emoji: "🧶", titre: "Un pull plutôt qu'un degré de plus", aide: "Le geste le plus simple de l'hiver !" },
] as const;

export type IdEngagement = (typeof ENGAGEMENTS)[number]["id"];

export const ENGAGEMENTS_MIN = 3;
export const JOURS_ARGENT_19 = 7;
export const JOURS_OR_19 = 21;
/** ADEME : chaque degré en moins ≈ 7 % de consommation de chauffage en moins. */
export const ECONOMIE_PAR_DEGRE = 0.07;

const IDS = new Set<string>(ENGAGEMENTS.map((e) => e.id));
export const estEngagement = (v: unknown): v is IdEngagement => typeof v === "string" && IDS.has(v);

/** Valide une sélection d'engagements (sans doublon, au moins 3). */
export function verifierEngagements(choisis: string[]): string | null {
  const uniques = new Set(choisis);
  if ([...uniques].some((c) => !IDS.has(c))) return "Engagement inconnu.";
  if (uniques.size < ENGAGEMENTS_MIN) return `Choisissez au moins ${ENGAGEMENTS_MIN} engagements.`;
  return null;
}

/** Une journée est « tenue » si au moins la moitié des engagements choisis ont été respectés. */
export function journeeTenue(faits: string[], choisis: string[]): boolean {
  if (choisis.length === 0) return false;
  const tenus = new Set(faits.filter((f) => choisis.includes(f)));
  return tenus.size >= Math.ceil(choisis.length / 2);
}

/**
 * Médailles d'Opération 19 °C :
 * Bronze : une première journée tenue ; Argent : 7 journées tenues ; Or : 21 journées tenues (3 semaines).
 */
export function niveau19(joursTenus: number): number {
  if (joursTenus >= JOURS_OR_19) return 3;
  if (joursTenus >= JOURS_ARGENT_19) return 2;
  if (joursTenus >= 1) return 1;
  return 0;
}

/** Saison de chauffe (indicative) : d'octobre à avril. */
export function saisonDeChauffe(mois: number): boolean {
  return mois >= 10 || mois <= 4;
}
