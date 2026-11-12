/**
 * Jeu 6 — Tri Master : règles pures.
 * Consignes nationales par défaut (extension des consignes de tri 2023 : tous les emballages
 * vont dans le bac jaune ; tri à la source des biodéchets depuis 2024).
 * À terme : consignes propres à la commune de chaque résidence.
 */

export type Bac = "jaune" | "verre" | "biodechets" | "ordures" | "collecte";

export const BACS: { id: Bac; nom: string; emoji: string; couleur: string }[] = [
  { id: "jaune", nom: "Bac jaune", emoji: "🟨", couleur: "#f5c400" },
  { id: "verre", nom: "Verre", emoji: "🟩", couleur: "#2e8b57" },
  { id: "biodechets", nom: "Biodéchets", emoji: "🟫", couleur: "#8b5a2b" },
  { id: "ordures", nom: "Ordures ménagères", emoji: "⬛", couleur: "#4a4a48" },
  { id: "collecte", nom: "Point de collecte", emoji: "📍", couleur: "#2f6fb5" },
];

export interface Dechet {
  id: string;
  nom: string;
  emoji: string;
  bac: Bac;
  explication: string;
}

export const DECHETS: Dechet[] = [
  { id: "bouteille-plastique", nom: "Bouteille d'eau en plastique", emoji: "🧴", bac: "jaune", explication: "Tous les emballages en plastique vont dans le bac jaune, bouchon compris." },
  { id: "pot-yaourt", nom: "Pot de yaourt", emoji: "🥛", bac: "jaune", explication: "Depuis 2023, tous les emballages se trient : pots, barquettes et films aussi." },
  { id: "canette", nom: "Canette de soda", emoji: "🥫", bac: "jaune", explication: "Le métal se recycle à l'infini : bac jaune." },
  { id: "carton-pizza", nom: "Carton de pizza", emoji: "🍕", bac: "jaune", explication: "Bac jaune, même un peu gras. Retirez seulement les restes de pizza." },
  { id: "journal", nom: "Journal", emoji: "📰", bac: "jaune", explication: "Papiers et journaux vont avec les emballages dans le bac jaune." },
  { id: "brique-lait", nom: "Brique de lait", emoji: "🧃", bac: "jaune", explication: "Les briques sont des emballages : bac jaune, bien vidées." },
  { id: "film-plastique", nom: "Film plastique alimentaire", emoji: "🎞️", bac: "jaune", explication: "Les films et sachets plastique se trient aussi désormais." },
  { id: "bocal", nom: "Bocal de confiture", emoji: "🫙", bac: "verre", explication: "Bocal au verre, sans le couvercle (qui va au bac jaune)." },
  { id: "bouteille-vin", nom: "Bouteille de vin", emoji: "🍾", bac: "verre", explication: "Le verre se recycle à l'infini dans la colonne à verre." },
  { id: "verre-boire", nom: "Verre à boire cassé", emoji: "🥃", bac: "ordures", explication: "Piège ! Le verre de table n'a pas la même composition : ordures ménagères." },
  { id: "vaisselle", nom: "Assiette en porcelaine", emoji: "🍽️", bac: "ordures", explication: "La vaisselle ne se recycle pas avec le verre : ordures ménagères (ou réemploi si elle est intacte)." },
  { id: "epluchures", nom: "Épluchures de légumes", emoji: "🥕", bac: "biodechets", explication: "Les restes alimentaires vont aux biodéchets ou au compost." },
  { id: "marc-cafe", nom: "Marc de café", emoji: "☕", bac: "biodechets", explication: "Marc de café et filtres papier : biodéchets." },
  { id: "coquilles-oeufs", nom: "Coquilles d'œufs", emoji: "🥚", bac: "biodechets", explication: "Les coquilles vont aux biodéchets." },
  { id: "restes-repas", nom: "Restes de repas", emoji: "🍝", bac: "biodechets", explication: "Depuis 2024, les restes alimentaires se trient à part : biodéchets." },
  { id: "mouchoir", nom: "Mouchoir usagé", emoji: "🤧", bac: "ordures", explication: "Les mouchoirs et essuie-tout sales vont aux ordures ménagères." },
  { id: "couche", nom: "Couche jetable", emoji: "🍼", bac: "ordures", explication: "Ordures ménagères." },
  { id: "masque", nom: "Masque jetable", emoji: "😷", bac: "ordures", explication: "Ordures ménagères, jamais au bac jaune." },
  { id: "pile", nom: "Pile usagée", emoji: "🔋", bac: "collecte", explication: "Piles et batteries : bornes en magasin ou en déchèterie. Jamais à la poubelle !" },
  { id: "ampoule", nom: "Ampoule LED", emoji: "💡", bac: "collecte", explication: "Les ampoules LED et basse consommation se rapportent en magasin." },
  { id: "telephone", nom: "Vieux téléphone", emoji: "📱", bac: "collecte", explication: "Point de collecte ou reprise en magasin : ses métaux se recyclent." },
  { id: "vetements", nom: "Vêtements usés", emoji: "👕", bac: "collecte", explication: "Textiles, même abîmés : borne textile. Ils seront réemployés ou recyclés." },
  { id: "medicaments", nom: "Médicaments périmés", emoji: "💊", bac: "collecte", explication: "À rapporter en pharmacie." },
  { id: "peinture", nom: "Pot de peinture entamé", emoji: "🎨", bac: "collecte", explication: "Déchet dangereux : déchèterie." },
];

export const NB_DECHETS_PARTIE = 12;
export const DUREE_MAX_MS = 120_000;
export const DUREE_OR_MS = 60_000;
export const PARTIES_MAX_PAR_JOUR = 10;

const PAR_ID = new Map(DECHETS.map((d) => [d.id, d]));
export const dechet = (id: string) => PAR_ID.get(id);

/** Tire n déchets distincts, en mélangeant les bacs. */
export function tirerDechets(n = NB_DECHETS_PARTIE, alea: () => number = Math.random): string[] {
  const ids = DECHETS.map((d) => d.id);
  for (let i = ids.length - 1; i > 0; i--) {
    const j = Math.floor(alea() * (i + 1));
    [ids[i], ids[j]] = [ids[j], ids[i]];
  }
  return ids.slice(0, n);
}

export function scorer(ids: string[], reponses: Record<string, Bac>): number {
  return ids.filter((id) => reponses[id] && dechet(id)?.bac === reponses[id]).length;
}

/**
 * Médailles de Tri Master (partie de 12 déchets, 2 minutes maximum) :
 * Bronze ≥ 8 bonnes réponses ; Argent ≥ 10 ; Or : 12 sur 12 en moins d'une minute.
 */
export function niveauTri(score: number, total: number, dureeMs: number): number {
  if (dureeMs > DUREE_MAX_MS) return 0;
  if (score === total && dureeMs <= DUREE_OR_MS) return 3;
  if (score >= Math.ceil(total * (10 / 12))) return 2;
  if (score >= Math.ceil(total * (8 / 12))) return 1;
  return 0;
}

export function estBac(v: unknown): v is Bac {
  return typeof v === "string" && BACS.some((b) => b.id === v);
}
