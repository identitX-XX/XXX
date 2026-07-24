// traversee/types.ts
// Le domaine de « La Traversée ». Un seul produit, une seule thèse : on taille.
// Trois verbes, et trois seulement : EMPORTER · LAISSER · CHOISIR.
// Aucune destination n'est écrite d'avance : elle se dérive des données.

// --- Territoires (8) ---------------------------------------------------------
export type TerritoireKey =
  | "corps"
  | "energie"
  | "sante"
  | "amour"
  | "liens"
  | "argent"
  | "oeuvre"
  | "terres"; // Terres inconnues

export interface Territoire {
  key: TerritoireKey;
  nom: string;
  propos: string; // une ligne, sobre — de quoi ce territoire s'occupe
  sansMetrique?: boolean; // Corps & Santé : jamais de chiffre corporel
}

// --- Les cinq actes ----------------------------------------------------------
export type ActeKey =
  | "inventaire" // J1–6
  | "tri" // J7–13
  | "signes" // J14–20
  | "atterrissage" // J21–27
  | "passage"; // J28–30

// --- La grammaire : deux gestes possibles chaque jour ------------------------
export type Verbe = "emporter" | "laisser";

// --- Thèmes (matière transversale, pour la voix et la dérivation) ------------
// Étiquettes internes, jamais montrées telles quelles à l'utilisatrice.
export type ThemeTag =
  | "regard-des-autres"
  | "controle"
  | "renoncement"
  | "care"
  | "evitement"
  | "attachement"
  | "liberte"
  | "corps"
  | "temps"
  | "argent";

// --- Le prélèvement : une seule question, tranchante -------------------------
export interface Choix {
  id: string;
  label: string;
  verbe?: Verbe; // le geste que ce choix engage (facultatif : certains jours n'agissent pas)
}
export interface Prelevement {
  question: string; // jamais « comment te sens-tu ? » — un couteau
  choix: Choix[]; // 2 (binaire) ou 3 (ternaire)
}

// --- Le contenu d'une journée ------------------------------------------------
export interface JourContenu {
  jour: number; // 1..30
  acte: ActeKey;
  territoire: TerritoireKey;
  theme?: ThemeTag; // matière transversale du jour (interne)
  // Signal : message du MOI DU FUTUR, écrit dans le registre du jour.
  // Peut porter des jetons : {prenom} et {renoncement} (remplis par la couche
  // `voice`), et des clauses optionnelles [[ … ]] supprimées si leur jeton est vide.
  signal: string;
  prelevement: Prelevement;
  // L'acte du jour, formulé dans les deux sens possibles.
  acteInvitation: { emporter: string; laisser: string };
  draft: boolean; // true = premier jet généré, en attente de réécriture humaine
}

// --- Le corpus de fragments (ex-archétypes, décomposés) ----------------------
// Ce ne sont pas des étiquettes : ce sont des matériaux. La voix et la
// dérivation y puisent, jamais pour dire « tu es X ».
export interface Fragment {
  id: string;
  texte: string;
  themes: string[]; // ex. "renoncement", "regard-des-autres", "controle", "corps"
  territoireHint?: TerritoireKey;
  source?: string; // trace d'origine (archétype), à titre documentaire
}

// --- État : portrait, constellation, vestiaire, destinations, voix -----------
export type EtoileEtat = "diffuse" | "eteinte" | "intense";
export interface Etoile {
  id: string;
  territoire: TerritoireKey;
  etat: EtoileEtat;
}

export interface Depot {
  id: string;
  label: string; // ce qu'elle dépose, dans ses mots
  territoire: TerritoireKey;
  date: string; // ISO
  reversibleJusqua: string; // ISO — 24 h de réversibilité
}

export interface ReponseJour {
  jour: number;
  choixId: string;
  verbe?: Verbe;
  cible?: string; // ce qui est emporté / laissé, dans ses mots
  date: string; // ISO
}

// Destination candidate — DÉRIVÉE, jamais pré-écrite.
export interface DestinationCandidate {
  id: string;
  nom: string; // composé à partir de ses territoires gardés
  fondement: string; // « pourquoi » vérifiable dans ses données
  territoires: TerritoireKey[]; // les territoires qui la portent
}

// Un « signe » de l'Acte III — un pattern vérifiable dans ses données.
export interface Signe {
  id: string;
  texte: string; // « Tu as laissé six choses. Cinq concernaient le regard des autres. »
  preuve: string; // la trace chiffrée
  force: number; // 0..1
}

export interface EtatTraversee {
  profil: {
    prenom: string | null;
    heureRituel: string | null; // heure fixe choisie à l'onboarding (affichage, pas de push)
  };
  journey: {
    startDate: string | null;
    currentDay: number; // 1..30
    acte: ActeKey;
    absences: string[]; // dates ISO où elle n'est pas venue
    lastVisit: string | null;
  };
  portrait: {
    clarity: number; // 0..100 — la netteté, visible en permanence
    fragmentsReveles: string[]; // ids de fragments dévoilés
  };
  etoiles: Etoile[];
  vestiaire: Depot[];
  destinations: {
    candidates: DestinationCandidate[];
    eliminees: string[];
    choisie: string | null;
  };
  voice: {
    clarity: number; // 0..1 — pilote le registre du Signal
  };
  reponses: Record<number, ReponseJour>;
  nomFutur: string | null; // nommé au J30
}
