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

// Remplit les jetons du signal écrit :
//   {prenom}       → son prénom (vide si inconnu)
//   {renoncement}  → son dernier renoncement (vide si aucun)
// Les clauses optionnelles [[ … ]] sont supprimées entièrement si un jeton
// qu'elles contiennent n'a pas de valeur — la brume ne prononce donc jamais un
// prénom absent, et aucune phrase ne cite un renoncement inexistant.
function remplirJetons(signal: string, prenom?: string, renoncement?: string): string {
  const s = signal.replace(/\[\[(.*?)\]\]/gs, (_, inner: string) => {
    if (inner.includes("{prenom}") && !prenom) return "";
    if (inner.includes("{renoncement}") && !renoncement) return "";
    return inner;
  });
  return s
    .replaceAll("{prenom}", prenom ?? "")
    .replaceAll("{renoncement}", renoncement ?? "")
    .replace(/\s{2,}/g, " ")
    .trim();
}

// Compose le Signal du jour à partir du texte écrit (registre déjà porté par le
// texte : brume J1–8, assuré J9–20, intime J21–30), en remplissant ses jetons.
// Déterministe : mêmes entrées → même sortie.
export function composerSignal(
  contenu: JourContenu,
  ctx: ContexteVoix = {}
): string {
  const prenom = ctx.prenom?.trim() || undefined;
  const dernierRenoncement = ctx.renoncements?.[ctx.renoncements.length - 1];
  return remplirJetons(contenu.signal, prenom, dernierRenoncement);
}
