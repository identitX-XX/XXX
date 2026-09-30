// Calcul de l'élan : la synthèse du jour du Compagnon.
//
// Principe : chaque signal disponible est ramené sur 0–100, puis on fait une
// moyenne pondérée des SEULS signaux présents (poids renormalisés). Un point du
// matin sans montre donne donc un élan valide, calculé sur ce que l'on sait.
//
// ⚠️ Pondérations et seuils à valider avec Maï Diaw : c'est un choix éditorial,
// pas une vérité médicale. Le Compagnon n'est pas un dispositif médical.

export type Echelle = 1 | 2 | 3 | 4 | 5;

export type Signaux = {
  humeur?: Echelle | null;
  energie?: Echelle | null;
  ambition?: Echelle | null;
  /** Durée de sommeil de la nuit, en minutes. */
  sommeilMinutes?: number | null;
  /** Fréquence cardiaque au repos, en battements par minute. */
  cardioRepos?: number | null;
};

export type NomSignal = keyof Signaux;

export const POIDS: Record<NomSignal, number> = {
  humeur: 0.25,
  energie: 0.2,
  ambition: 0.2,
  sommeilMinutes: 0.2,
  cardioRepos: 0.15,
};

const borne = (v: number, min = 0, max = 100) => Math.min(max, Math.max(min, v));

/** Échelle 1–5 → 0–100 (1 → 0, 3 → 50, 5 → 100). */
export function scoreEchelle(v: number): number {
  return borne(((v - 1) / 4) * 100);
}

/**
 * Sommeil → 0–100. Plein score entre 7 h et 9 h ; la note baisse de façon
 * linéaire jusqu'à 0 à 4 h de sommeil (et à 12 h dans l'autre sens).
 */
export function scoreSommeil(minutes: number): number {
  const h = minutes / 60;
  if (h >= 7 && h <= 9) return 100;
  if (h < 7) return borne(((h - 4) / 3) * 100);
  return borne(((12 - h) / 3) * 100);
}

/**
 * Cardio au repos → 0–100. Sans historique personnel, on s'appuie sur une
 * zone de référence adulte : plein score de 50 à 70 bpm, 0 à 40 et à 100 bpm.
 * Avec une référence personnelle (moyenne des 14 derniers jours), c'est
 * l'écart à SA normale qui compte : +10 bpm au-dessus = score 0.
 */
export function scoreCardio(bpm: number, referencePersonnelle?: number | null): number {
  if (referencePersonnelle && referencePersonnelle > 0) {
    const ecart = bpm - referencePersonnelle;
    if (ecart <= 0) return 100;
    return borne(100 - ecart * 10);
  }
  if (bpm >= 50 && bpm <= 70) return 100;
  if (bpm < 50) return borne(((bpm - 40) / 10) * 100);
  return borne(((100 - bpm) / 30) * 100);
}

export type Elan = {
  /** 0–100, arrondi ; null si aucun signal. */
  valeur: number | null;
  /** Score 0–100 de chaque signal présent. */
  detail: Partial<Record<NomSignal, number>>;
  /** Part (0–1) des poids couverts par des signaux présents. */
  completude: number;
};

export function calculerElan(s: Signaux, referenceCardio?: number | null): Elan {
  const detail: Partial<Record<NomSignal, number>> = {};
  if (s.humeur != null) detail.humeur = scoreEchelle(s.humeur);
  if (s.energie != null) detail.energie = scoreEchelle(s.energie);
  if (s.ambition != null) detail.ambition = scoreEchelle(s.ambition);
  if (s.sommeilMinutes != null && s.sommeilMinutes > 0) detail.sommeilMinutes = scoreSommeil(s.sommeilMinutes);
  if (s.cardioRepos != null && s.cardioRepos > 0) detail.cardioRepos = scoreCardio(s.cardioRepos, referenceCardio);

  const presents = Object.keys(detail) as NomSignal[];
  const poidsTotal = presents.reduce((t, n) => t + POIDS[n], 0);
  if (poidsTotal === 0) return { valeur: null, detail, completude: 0 };

  const somme = presents.reduce((t, n) => t + POIDS[n] * (detail[n] as number), 0);
  return { valeur: Math.round(somme / poidsTotal), detail, completude: Math.round(poidsTotal * 100) / 100 };
}

/** Moyenne des cardios au repos connus (référence personnelle), si au moins 5 mesures. */
export function referenceCardio(mesures: (number | null | undefined)[]): number | null {
  const v = mesures.filter((m): m is number => typeof m === "number" && m > 0);
  if (v.length < 5) return null;
  return Math.round(v.reduce((a, b) => a + b, 0) / v.length);
}

/**
 * La lecture du Compagnon : une phrase, jamais un diagnostic. On part du
 * signal le plus fort et du plus faible pour dire quelque chose d'utile.
 */
export function lectureElan(e: Elan): string {
  if (e.valeur == null) return "Faites votre point du matin : le Compagnon a besoin de vous entendre pour lire votre élan.";
  const noms: Record<NomSignal, string> = {
    humeur: "votre humeur",
    energie: "votre énergie",
    ambition: "votre ambition",
    sommeilMinutes: "votre sommeil",
    cardioRepos: "votre cœur au repos",
  };
  const tries = (Object.entries(e.detail) as [NomSignal, number][]).sort((a, b) => b[1] - a[1]);
  const fort = tries[0];
  const faible = tries[tries.length - 1];

  if (e.valeur >= 75) return `${majuscule(noms[fort[0]])} vous porte : votre élan est prêt pour une rencontre.`;
  if (e.valeur >= 50) {
    return faible && faible[1] < 50
      ? `Belle base, mais ${noms[faible[0]]} demande de l'attention aujourd'hui. Avancez sans vous disperser.`
      : "Un élan stable : une journée pour tenir le cap plutôt que pour tout changer.";
  }
  return faible ? `Journée de recharge : prenez soin de ${noms[faible[0]]} avant de vous exposer.` : "Journée de recharge.";
}

const majuscule = (t: string) => t.charAt(0).toUpperCase() + t.slice(1);
