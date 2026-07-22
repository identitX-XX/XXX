// traversee/lib/voice.ts
// La voix du MOI DU FUTUR. Floue au début, nette à la fin — c'est la récompense
// variable du produit. La netteté (voiceClarity 0..1) pilote le registre :
//   J1–8   brume   : vague, hésitante, phrases courtes, ne connaît pas ton nom.
//   J9–20  assuré  : plus sûre, commence à utiliser tes mots.
//   J21–30 intime  : précise, cite tes renoncements, connaît ton prénom.
// Isolée et testable. Déterministe : mêmes entrées → même sortie.

import { JourContenu } from "../types";

export type Registre = "brume" | "assure" | "intime";

// Netteté 0..1 en fonction du jour (1..30).
export function voiceClarity(jour: number): number {
  const j = Math.max(1, Math.min(30, jour));
  return (j - 1) / 29;
}

export function registre(clarity: number): Registre {
  if (clarity < 0.25) return "brume"; // J1–8
  if (clarity < 0.67) return "assure"; // J9–20
  return "intime"; // J21–30
}

export interface ContexteVoix {
  prenom?: string | null;
  renoncements?: string[]; // ce qu'elle a laissé, dans ses mots
}

// Sélection déterministe dans une liste (pas de hasard).
function pick<T>(arr: T[], seed: number): T {
  return arr[((seed % arr.length) + arr.length) % arr.length];
}

// Compose le Signal du jour. Si le contenu fournit un signal écrit, il prime.
// Sinon on compose selon le registre. C'est un échafaudage : le vrai contenu
// remplacera ces gabarits, mais la mécanique de netteté est réelle.
export function composerSignal(
  contenu: JourContenu,
  ctx: ContexteVoix = {}
): string {
  if (contenu.signal && !contenu.aEcrire) return contenu.signal;

  const reg = registre(voiceClarity(contenu.jour));
  const prenom = ctx.prenom?.trim();
  const dernierRenoncement = ctx.renoncements?.[ctx.renoncements.length - 1];

  if (reg === "brume") {
    const brume = [
      "Je ne te vois pas encore bien. Quelque chose bouge, de ton côté.",
      "Il y a de la brume entre nous. Mais tu es là. Je le sens.",
      "Je ne sais pas encore qui tu deviens. Reste. On y voit un peu plus chaque jour.",
    ];
    return pick(brume, contenu.jour);
  }

  if (reg === "assure") {
    const base = [
      "Je commence à te distinguer. Ce que tu poses ne se perd pas — ça s'allège.",
      "Tu te dégages, doucement. Ce que tu portes de moins, je le vois de plus.",
      "Je te reconnais mieux. Continue à trancher ; c'est comme ça que tu approches.",
    ];
    const s = pick(base, contenu.jour);
    return dernierRenoncement ? `${s} Ce que tu as laissé — « ${dernierRenoncement} » — comptait.` : s;
  }

  // intime
  const ouverture = prenom ? `${prenom}. ` : "";
  const corps = [
    "Je te vois, maintenant. Ce que tu as laissé t'a rendue plus nette que jamais.",
    "Nous y sommes presque. Tu n'as gardé que ce qui te ressemble.",
    "Je t'attends de ce côté. Tu sais déjà ce que tu emportes.",
  ];
  const s = ouverture + pick(corps, contenu.jour);
  return dernierRenoncement ? `${s} Et « ${dernierRenoncement} », tu l'as bien posé.` : s;
}
