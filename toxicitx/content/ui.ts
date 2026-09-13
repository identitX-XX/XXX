import type { Axis } from "@/types";

// Textes d'interface propres au « bestiaire » — éditables sans toucher au code.

export const AXIS_TITLE: Record<Axis, string> = {
  ascendante: "Vers la direction",
  descendante: "Vers votre manager",
  laterale: "Entre collègues",
};

export const AXIS_TAG: Record<Axis, string> = {
  ascendante: "⬆️ Direction",
  descendante: "⬇️ Management",
  laterale: "↔️ Collègues",
};

/** Le monstre-mascotte qui illustre chaque section du quiz. */
export const AXIS_MASCOT: Record<Axis, string> = {
  ascendante: "forteresse",
  descendante: "petit-chef",
  laterale: "cour-recre",
};

export const AXIS_WIT: Record<Axis, string> = {
  ascendante:
    "On commence par regarder vers le haut : la direction, les décisions, l'info qui remonte (ou pas).",
  descendante:
    "Maintenant vers le bas : votre manager au quotidien. Respirez, ça va bien se passer.",
  laterale:
    "Et enfin l'open space : vos chers collègues et l'art subtil du couloir.",
};

/** Message de ressources (filet de sécurité). */
export const RESSOURCES =
  "Ce test n'est ni un diagnostic médical ni un avis juridique. Si votre situation affecte votre santé, vous n'êtes pas seul·e : parlez-en à la médecine du travail, à un représentant du personnel (CSE) ou à votre médecin traitant. En cas de détresse, contactez un professionnel de santé sans attendre.";
