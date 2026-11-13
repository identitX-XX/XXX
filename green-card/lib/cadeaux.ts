/**
 * Catalogue de cadeaux : règles pures.
 * - Boutique : on échange ses GreenPoints. Le solde disponible = points gagnés − points dépensés ;
 *   le niveau de la carte et les classements gardent les points gagnés (dépenser ne fait pas régresser).
 * - Grand prix : tirage au sort de fin de saison, réservé aux cartes Gold (les 10 cases tamponnées).
 */

export type TypeCadeau = "boutique" | "grand-prix";

export interface CadeauDef {
  id: string;
  ordre: number;
  type: TypeCadeau;
  nom: string;
  description: string;
  prix: number | null;
  stock: number | null;
  tailles: string[] | null;
}

export const CATALOGUE: CadeauDef[] = [
  {
    id: "mug",
    ordre: 1,
    type: "boutique",
    nom: "Mug Green Card",
    description: "Le mug en céramique aux couleurs de Green Card, pour le café du matin… préparé avec une bouilloire bien remplie à moitié.",
    prix: 300,
    stock: 100,
    tailles: null,
  },
  {
    id: "jeu-de-cartes",
    ordre: 2,
    type: "boutique",
    nom: "Jeu de cartes « 52 éco-gestes »",
    description: "Un jeu de 52 cartes illustrées : un éco-geste par carte, pour jouer en famille et apprendre en s'amusant.",
    prix: 450,
    stock: 60,
    tailles: null,
  },
  {
    id: "tee-shirt",
    ordre: 3,
    type: "boutique",
    nom: "Tee-shirt Green Card",
    description: "Tee-shirt en coton biologique, logo Green Card. Fabriqué en Europe.",
    prix: 700,
    stock: 50,
    tailles: ["S", "M", "L", "XL", "XXL"],
  },
  {
    id: "sejour",
    ordre: 4,
    type: "grand-prix",
    nom: "Une semaine dans un appartement CDC Habitat",
    description: "Une semaine de vacances pour votre foyer dans un appartement CDC Habitat, à la mer ou à la montagne. Le grand prix de la saison !",
    prix: null,
    stock: null,
    tailles: null,
  },
];

export const TIRAGE_SAISON = { id: "saison-2026-2027", cadeauId: "sejour", libelle: "Grand tirage de la saison 2026-2027", clotureLe: "2027-04-30T18:00:00+02:00" };

// ---------------------------------------------------------------------------

/** Code de retrait lisible (sans caractères ambigus), à présenter au gardien ou à l'agence. */
const ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
export function genererCodeRetrait(alea: () => number = Math.random): string {
  let c = "GC-";
  for (let i = 0; i < 6; i++) c += ALPHABET[Math.floor(alea() * ALPHABET.length)];
  return c;
}

/** Vérifie qu'une commande est possible. Renvoie un message d'erreur ou null. */
export function verifierCommande(p: {
  type: TypeCadeau;
  actif: boolean;
  prix: number | null;
  stock: number | null;
  solde: number;
  dejaCommande: boolean;
  tailles: string[] | null;
  taille: string | null;
}): string | null {
  if (p.type !== "boutique" || p.prix === null || !p.actif) return "Ce cadeau ne s'échange pas contre des points.";
  if (p.dejaCommande) return "Vous avez déjà ce cadeau : un exemplaire par foyer, pour que tout le monde en profite.";
  if (p.stock !== null && p.stock <= 0) return "Victime de son succès : ce cadeau est épuisé pour le moment.";
  if (p.tailles && (!p.taille || !p.tailles.includes(p.taille))) return "Choisissez une taille.";
  if (p.solde < p.prix) return `Il vous manque ${p.prix - p.solde} GreenPoints. Encore quelques défis !`;
  return null;
}

/** Inscription au grand tirage : carte Gold et tirage pas encore clos. */
export function verifierParticipation(p: { gold: boolean; cloture: Date; maintenant: Date; effectue: boolean }): string | null {
  if (p.effectue || p.maintenant >= p.cloture) return "Les inscriptions à ce tirage sont closes.";
  if (!p.gold) return "Le grand tirage est réservé aux cartes Gold : tamponnez les 10 cases de votre carte !";
  return null;
}

/** Tire un gagnant au hasard, chaque foyer inscrit ayant exactement la même chance. */
export function choisirGagnant<T>(participants: T[], alea: () => number): T | null {
  if (participants.length === 0) return null;
  return participants[Math.min(participants.length - 1, Math.floor(alea() * participants.length))];
}

export const STATUTS_COMMANDE: Record<string, { libelle: string; emoji: string }> = {
  "a-preparer": { libelle: "En préparation", emoji: "📦" },
  prete: { libelle: "Prête à retirer", emoji: "✅" },
  remise: { libelle: "Remise", emoji: "🎁" },
  annulee: { libelle: "Annulée", emoji: "↩️" },
};
