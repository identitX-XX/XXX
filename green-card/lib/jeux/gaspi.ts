/**
 * Jeu 2 — Chasse au Gaspi : règles pures.
 * Un appartement en 4 pièces : 10 gaspillages sont cachés parmi de bons gestes. Il faut trouver les gaspillages.
 * Les objets sont décrits (texte et emoji) : le jeu se joue aussi au lecteur d'écran.
 */

export type Piece = "cuisine" | "salon" | "chambre" | "sdb";

export const PIECES: { id: Piece; nom: string; emoji: string }[] = [
  { id: "cuisine", nom: "Cuisine", emoji: "🍳" },
  { id: "salon", nom: "Salon", emoji: "🛋️" },
  { id: "chambre", nom: "Chambre", emoji: "🛏️" },
  { id: "sdb", nom: "Salle de bains", emoji: "🛁" },
];

export interface ObjetScene {
  id: string;
  piece: Piece;
  emoji: string;
  /** Ce qu'on voit, en mots simples (affiché et lu par le lecteur d'écran). */
  description: string;
  gaspi: boolean;
  /** Pourquoi c'est un gaspillage, ou pourquoi c'est un bon geste. */
  explication: string;
}

export const OBJETS: ObjetScene[] = [
  // Gaspillages
  { id: "frigo-ouvert", piece: "cuisine", emoji: "🧊", description: "Frigo resté entrouvert", gaspi: true, explication: "Un frigo ouvert se réchauffe et le moteur tourne sans arrêt. Refermez bien la porte." },
  { id: "four-ouvert", piece: "cuisine", emoji: "🔥", description: "Four allumé, porte ouverte pour vérifier la cuisson", gaspi: true, explication: "Chaque ouverture fait perdre de la chaleur. Regardez à travers la vitre." },
  { id: "congel-givre", piece: "cuisine", emoji: "❄️", description: "Congélateur avec 1 cm de givre", gaspi: true, explication: "Au-delà de 3 mm de givre, le congélateur consomme jusqu'à 30 % de plus. Dégivrez-le." },
  { id: "tv-veille", piece: "salon", emoji: "📺", description: "Télé éteinte, voyant rouge de veille allumé toute la nuit", gaspi: true, explication: "Les appareils en veille consomment jour et nuit. Une multiprise à interrupteur coupe tout d'un geste." },
  { id: "fenetre-chauffage", piece: "salon", emoji: "🪟", description: "Fenêtre entrouverte tout l'après-midi, radiateur allumé dessous", gaspi: true, explication: "On chauffe la rue ! Aérez 5 à 10 minutes fenêtre grande ouverte, radiateur coupé." },
  { id: "radiateur-linge", piece: "salon", emoji: "👕", description: "Linge qui sèche sur le radiateur", gaspi: true, explication: "Le linge bloque la chaleur et ajoute de l'humidité. Utilisez un étendoir à côté." },
  { id: "lampe-vide", piece: "chambre", emoji: "💡", description: "Lumière allumée dans la chambre vide", gaspi: true, explication: "Le réflexe simple : on éteint en quittant la pièce." },
  { id: "chargeur", piece: "chambre", emoji: "🔌", description: "Chargeur branché au mur, sans téléphone", gaspi: true, explication: "Un chargeur branché à vide consomme un peu, tout le temps. Débranchez-le." },
  { id: "robinet-goutte", piece: "sdb", emoji: "🚰", description: "Robinet qui goutte", gaspi: true, explication: "Un robinet qui goutte, c'est jusqu'à 35 000 litres par an. Signalez-le au gardien." },
  { id: "machine-90", piece: "sdb", emoji: "🧺", description: "Machine à laver à 90 °C, à moitié vide", gaspi: true, explication: "Lavez à 30 °C et à pleine charge : presque 3 fois moins d'électricité qu'à 90 °C." },
  // Bons gestes (pièges)
  { id: "couvercle", piece: "cuisine", emoji: "🍲", description: "Casserole qui chauffe avec un couvercle", gaspi: false, explication: "Bon geste ! Le couvercle divise par 4 l'énergie pour faire bouillir l'eau." },
  { id: "bouilloire", piece: "cuisine", emoji: "🫖", description: "Bouilloire remplie juste pour 2 tasses", gaspi: false, explication: "Bon geste ! On ne chauffe que l'eau dont on a besoin." },
  { id: "multiprise", piece: "salon", emoji: "🎛️", description: "Multiprise à interrupteur éteinte derrière la box", gaspi: false, explication: "Bon geste ! La box et la télé sont vraiment coupées la nuit." },
  { id: "thermostat", piece: "salon", emoji: "🌡️", description: "Thermostat réglé sur 19 °C", gaspi: false, explication: "Bon geste ! 19 °C le jour, c'est la température conseillée." },
  { id: "volets", piece: "chambre", emoji: "🌙", description: "Volets fermés la nuit", gaspi: false, explication: "Bon geste ! Les volets fermés gardent la chaleur à l'intérieur." },
  { id: "led", piece: "chambre", emoji: "🔆", description: "Ampoule LED dans la lampe de chevet", gaspi: false, explication: "Bon geste ! Une LED consomme jusqu'à 8 fois moins qu'une ampoule classique." },
  { id: "pommeau", piece: "sdb", emoji: "🚿", description: "Pommeau de douche économe", gaspi: false, explication: "Bon geste ! Un pommeau économe divise le débit par deux, sans perdre en confort." },
  { id: "etendoir", piece: "sdb", emoji: "🧦", description: "Linge sur un étendoir près de la fenêtre", gaspi: false, explication: "Bon geste ! Le séchage à l'air libre ne coûte rien." },
];

export const NB_GASPI = OBJETS.filter((o) => o.gaspi).length;
export const DUREE_MAX_GASPI_MS = 180_000;
export const DUREE_OR_GASPI_MS = 60_000;
export const ERREURS_MAX_OR = 2;
export const PARTIES_GASPI_MAX_PAR_JOUR = 10;

const PAR_ID = new Map(OBJETS.map((o) => [o.id, o]));
export const objetScene = (id: string) => PAR_ID.get(id);

/** Mélange l'ordre des objets dans chaque pièce (les pièces gardent leur ordre). */
export function melangerScene(alea: () => number = Math.random): string[] {
  return PIECES.flatMap((p) => {
    const ids = OBJETS.filter((o) => o.piece === p.id).map((o) => o.id);
    for (let i = ids.length - 1; i > 0; i--) {
      const j = Math.floor(alea() * (i + 1));
      [ids[i], ids[j]] = [ids[j], ids[i]];
    }
    return ids;
  });
}

/**
 * Médailles de Chasse au Gaspi (3 minutes maximum) :
 * Bronze : 6 gaspillages trouvés ; Argent : les 10 ; Or : les 10 en moins d'une minute, avec 2 erreurs au plus.
 */
export function niveauGaspi(trouves: number, erreurs: number, dureeMs: number): number {
  if (dureeMs > DUREE_MAX_GASPI_MS) return 0;
  if (trouves >= NB_GASPI && dureeMs <= DUREE_OR_GASPI_MS && erreurs <= ERREURS_MAX_OR) return 3;
  if (trouves >= NB_GASPI) return 2;
  if (trouves >= 6) return 1;
  return 0;
}
