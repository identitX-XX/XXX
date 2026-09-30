import { sante } from "../sante";
import { envoyerPoint } from "./api";
import { aujourdhui, fenetreNuit } from "./jour";

export type ResultatSynchro =
  | { etat: "envoye"; sommeilMinutes: number | null; cardioRepos: number | null }
  | { etat: "vide" }
  | { etat: "indisponible" };

/**
 * Lit la dernière nuit sur la montre (via Apple Santé / Health Connect) et
 * l'envoie au Compagnon. Le serveur fusionne avec le point du matin :
 * l'humeur saisie à la main n'est jamais écrasée.
 */
export async function synchroniserMontre(maintenant = new Date()): Promise<ResultatSynchro> {
  if (!(await sante.disponible())) return { etat: "indisponible" };
  const { debut, fin } = fenetreNuit(maintenant);
  const nuit = await sante.lireNuit(debut, fin);
  if (nuit.sommeilMinutes == null && nuit.cardioRepos == null) return { etat: "vide" };
  await envoyerPoint({
    jour: aujourdhui(maintenant),
    source: "montre",
    ...(nuit.sommeilMinutes != null && { sommeilMinutes: nuit.sommeilMinutes }),
    ...(nuit.cardioRepos != null && { cardioRepos: nuit.cardioRepos }),
  });
  return { etat: "envoye", ...nuit };
}
