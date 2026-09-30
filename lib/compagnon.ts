// Les six signaux du Compagnon : cinq sont captés (montre) ou déclarés (vous),
// le sixième, l'élan, en fait la synthèse.
export const SIGNAUX_COMPAGNON = [
  { nom: "Sommeil", detail: "Durée, régularité · montre" },
  { nom: "Cardio", detail: "Rythme au repos · montre" },
  { nom: "Humeur", detail: "Et état d'esprit · vous" },
  { nom: "Énergie", detail: "Ressentie · vous" },
  { nom: "Ambition", detail: "Votre cap du mois · vous" },
  { nom: "Élan", detail: "La synthèse du jour", synthese: true },
] as const;

export const CONNEXIONS_COMPAGNON = "Téléphone et montre connectée · Apple Santé · Health Connect";

import { calculerElan } from "@/lib/compagnon/elan";

/** Le jour d'exemple des aperçus : calculé par la même fonction que l'appli. */
export const EXEMPLE_ELAN = calculerElan({ humeur: 4, energie: 4, ambition: 5, sommeilMinutes: 432, cardioRepos: 58 });
