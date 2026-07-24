// traversee/lib/artefact.ts
// L'artefact du J30 — ce qu'elle emporte de la traversée. Composé, jamais
// pré-écrit : la lettre cite SES renoncements et SES emportés, la destination
// est DÉRIVÉE de ses choix (elle doit pouvoir la surprendre). Déterministe et
// testable ; aucun serveur.

import { DestinationCandidate, ReponseJour } from "../types";
import { deriverDestinations } from "./derivation";

export interface Artefact {
  nom: string; // le nom qu'elle a donné à celle qu'elle devient
  destination: DestinationCandidate | null;
  lettre: string[]; // paragraphes, du moi du futur, dans son registre
  pacte: string[]; // trois lignes : ce que je garde, ce que je laisse, où je vais
}

interface Entree {
  prenom: string | null;
  nomFutur: string | null;
  reponses: Record<number, ReponseJour>;
  destination?: DestinationCandidate | null;
}

const dernier = (xs: string[]): string | undefined => xs[xs.length - 1];

export function composerArtefact(e: Entree): Artefact {
  const R = Object.values(e.reponses);
  const emportes = R.filter((r) => r.verbe === "emporter" && r.cible).map((r) => r.cible as string);
  const renoncements = R.filter((r) => r.verbe === "laisser" && r.cible).map((r) => r.cible as string);

  const destination =
    e.destination ?? deriverDestinations(e.reponses)[0] ?? null;

  const nom = e.nomFutur?.trim() || "Celle que tu deviens";
  const ouverture = e.prenom?.trim() ? `${e.prenom.trim()}. ` : "";

  const dernierRenoncement = dernier(renoncements);
  const dernierEmporte = dernier(emportes);

  const lettre: string[] = [];
  lettre.push(
    `${ouverture}Nous y voilà. Trente jours que tu tailles. Je te vois, maintenant — nette.`
  );

  if (renoncements.length > 0) {
    const cite = dernierRenoncement ? ` La dernière : « ${dernierRenoncement} ».` : "";
    lettre.push(
      `Tu as laissé ${renoncements.length} chose${renoncements.length > 1 ? "s" : ""}.${cite} Rien de tout ça ne t'a manqué.`
    );
  }

  if (emportes.length > 0) {
    const cite = dernierEmporte ? ` Dont « ${dernierEmporte} ».` : "";
    lettre.push(
      `Tu n'as gardé que ce qui te ressemble.${cite} C'est avec ça que tu arrives.`
    );
  }

  if (destination) {
    lettre.push(
      `Là où tu vas, tu ne seras pas une autre. Tu y seras plus toi. ${destination.fondement}`
    );
  }

  lettre.push(`Je t'attends de ce côté.`);
  lettre.push(`— ${nom}`);

  const pacte: string[] = [];
  pacte.push(dernierEmporte ? `Je garde « ${dernierEmporte} ».` : `Je garde ce qui me ressemble.`);
  pacte.push(dernierRenoncement ? `Je laisse « ${dernierRenoncement} ».` : `Je laisse ce qui pesait.`);
  pacte.push(
    destination ? `Je vais vers ${bas(destination.nom)}` : `Je vais vers ce que j'ai choisi.`
  );

  return { nom, destination, lettre, pacte };
}

// Met la première lettre en minuscule et garde le point final éventuel — pour
// enchaîner « Je vais vers … » proprement.
function bas(s: string): string {
  const t = s.trim();
  const sansPoint = t.replace(/\.$/, "");
  return sansPoint.charAt(0).toLowerCase() + sansPoint.slice(1) + ".";
}
