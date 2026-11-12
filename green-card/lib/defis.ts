/** Les 10 défis du parcours Green Card = les 10 cases de la carte. */
export type Univers = "energie" | "mode-de-vie" | "dechets" | "astuces" | "circulaire" | "collectif";

export interface DefiDef {
  id: string;
  ordre: number;
  titre: string;
  univers: Univers;
  emoji: string;
  accroche: string;
  pointsBronze: number;
  pointsArgent: number;
  pointsOr: number;
}

export const UNIVERS_LIBELLES: Record<Univers, string> = {
  energie: "Énergie",
  "mode-de-vie": "Mode de vie",
  dechets: "Déchets",
  astuces: "Astuces",
  circulaire: "Seconde main",
  collectif: "Collectif",
};

export const DEFIS: DefiDef[] = [
  { id: "compteur-malin", ordre: 1, titre: "Le Compteur Malin", univers: "energie", emoji: "⚡", accroche: "Relevez vos compteurs et faites baisser la facture.", pointsBronze: 50, pointsArgent: 120, pointsOr: 250 },
  { id: "chasse-au-gaspi", ordre: 2, titre: "Chasse au Gaspi", univers: "energie", emoji: "🔍", accroche: "Trouvez les 10 gaspillages cachés dans l'appartement.", pointsBronze: 30, pointsArgent: 60, pointsOr: 100 },
  { id: "douche-chrono", ordre: 3, titre: "Douche Chrono", univers: "energie", emoji: "💧", accroche: "5 minutes sous la douche, 7 jours de suite.", pointsBronze: 40, pointsArgent: 90, pointsOr: 160 },
  { id: "operation-19", ordre: 4, titre: "Opération 19 °C", univers: "energie", emoji: "🌡️", accroche: "Chauffer juste, sans avoir froid.", pointsBronze: 40, pointsArgent: 90, pointsOr: 160 },
  { id: "trajets-verts", ordre: 5, titre: "Mes Trajets Verts", univers: "mode-de-vie", emoji: "🚲", accroche: "À pied, à vélo, en bus : comptez le CO₂ évité.", pointsBronze: 40, pointsArgent: 100, pointsOr: 200 },
  { id: "tri-master", ordre: 6, titre: "Tri Master", univers: "dechets", emoji: "♻️", accroche: "Triez vite et bien, selon les consignes de votre ville.", pointsBronze: 30, pointsArgent: 60, pointsOr: 100 },
  { id: "zero-gaspi-frigo", ordre: 7, titre: "Zéro Gaspi Frigo", univers: "dechets", emoji: "🥕", accroche: "Rien ne se perd, tout se cuisine.", pointsBronze: 30, pointsArgent: 70, pointsOr: 130 },
  { id: "seconde-vie", ordre: 8, titre: "Seconde Vie", univers: "circulaire", emoji: "👕", accroche: "Achetez d'occasion, donnez, échangez entre voisins.", pointsBronze: 40, pointsArgent: 90, pointsOr: 180 },
  { id: "boite-a-astuces", ordre: 9, titre: "La Boîte à Astuces", univers: "astuces", emoji: "💡", accroche: "Partagez vos astuces, votez pour celles des voisins.", pointsBronze: 20, pointsArgent: 50, pointsOr: 100 },
  { id: "defi-immeuble", ordre: 10, titre: "Le Défi Immeuble", univers: "collectif", emoji: "🏢", accroche: "Tous ensemble contre les autres résidences !", pointsBronze: 60, pointsArgent: 140, pointsOr: 300 },
];

/** Défis jouables dès l'activation de la carte (un par grand univers). */
export const DEFIS_OUVERTURE = ["compteur-malin", "tri-master", "boite-a-astuces"];

/** Défis dont le jeu est déjà développé (les autres s'affichent « Bientôt »). */
export const JEUX_DISPONIBLES = new Set(["compteur-malin", "tri-master", "boite-a-astuces"]);

export const defiParId = (id: string) => DEFIS.find((d) => d.id === id);

/** Points cumulés correspondant à une médaille (0 = aucune). */
export function pointsPourNiveau(d: DefiDef, niveau: number): number {
  return [0, d.pointsBronze, d.pointsArgent, d.pointsOr][niveau] ?? 0;
}
