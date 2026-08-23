// Source de vérité UNIQUE de « la prochaine étape » du parcours. Utilisée à la
// fois par la barre de tête (JourneyBar → action visible sans scroller) et par
// la carte de pied (NextStep → la même action, détaillée). Les deux pointent
// donc toujours vers le MÊME geste : impossible de se perdre, où qu'on soit.

import { progression } from "@/parcours-archetypes/indicateurs";

// `cta` = libellé complet (carte de pied) ; `ctaCourt` = version compacte pour
// la barre de tête, qui doit tenir à côté de la jauge sur petit écran.
export type Etape = {
  titre: string;
  pourquoi: string;
  cta: string;
  ctaCourt: string;
  href: string;
};

export function prochaineEtape(
  diagnostic: unknown,
  objectifs: unknown,
  etat: Parameters<typeof progression>[0],
  reponses: Record<number, unknown>
): Etape {
  if (!diagnostic)
    return {
      titre: "Révèle ta signature",
      pourquoi: "Tout part de là : douze questions, et ton point de départ.",
      cta: "Commencer",
      ctaCourt: "Commencer",
      href: "/parcours-signatures",
    };
  if (!objectifs)
    return {
      titre: "Pose ton cap",
      pourquoi: "Un objectif par périmètre — ta boussole des 30 jours.",
      cta: "Poser mon cap",
      ctaCourt: "Mon cap",
      href: "/parcours-signatures",
    };

  const prog = progression(etat);
  if (prog.jourCourant > 30)
    return {
      titre: "Ton bilan t'attend",
      pourquoi: "Tes 30 jours sont accomplis — recueille ce qui ressort.",
      cta: "Voir mon bilan",
      ctaCourt: "Mon bilan",
      href: "/parcours-signatures/rapport",
    };

  const n = Math.min(prog.jourCourant, 30);
  if (!reponses[n])
    return {
      titre: `Ta journée du jour ${n}`,
      pourquoi:
        "≈ 5 min : un geste, un exercice, un bilan. La terminer débloque le jour suivant.",
      cta: "Terminer ma journée",
      ctaCourt: "Terminer",
      href: "/parcours-signatures",
    };

  return {
    titre: `Jour ${n} terminé ✓`,
    pourquoi: "Reviens quand tu veux pour le jour suivant — ou observe ton évolution.",
    cta: "Voir ma progression",
    ctaCourt: "Progression",
    href: "/progression",
  };
}
