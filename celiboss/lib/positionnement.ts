// Le positionnement de Maï Diaw, en une source unique : toute page qui le
// présente lit ces textes. Changer la promesse = changer ce fichier.

/** La promesse, en deux temps : la méthode de Maï Diaw, sans un mot de trop. */
export const PROMESSE = { avant: "Aligner d'abord.", apres: "Présenter ensuite." } as const;

/** Ce que la promesse veut dire, en une phrase. */
export const PRECISION =
  "Maï Diaw accorde votre mental, votre cœur et votre vie. Puis elle provoque la rencontre qui compte.";

/** Les trois convergences : un domaine, un mouvement, une destination. */
export const CONVERGENCES = [
  {
    domaine: "Le mindset",
    verbe: "Élevé",
    destination: "à la hauteur de votre ambition.",
    detail: "Confiance, standards, intelligence émotionnelle : penser à la taille de ce que vous visez.",
  },
  {
    domaine: "L'amour",
    verbe: "Révélé",
    destination: "dans sa meilleure version.",
    detail: "Des rencontres choisies avec soin, et des relations qui vous élèvent au lieu de vous freiner.",
  },
  {
    domaine: "Le style de vie",
    verbe: "Aligné",
    destination: "sur qui vous êtes vraiment.",
    detail: "Environnements, entourage, image : une vie cohérente avec la personne que vous êtes devenu·e.",
  },
] as const;
