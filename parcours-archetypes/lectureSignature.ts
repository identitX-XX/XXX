// Offre premium n°2 — la « lecture approfondie » d'une signature (2,50 €).
// Compose, à partir des données déjà riches des 20 Signatures, une lecture qui
// relie : la signature PRINCIPALE, la SECONDAIRE, et celle qui pourrait ÉMERGER
// (la montante dans la matrice). Pure et testée ; aucun contenu inventé.

import { SIGNATURES, Signature, SignatureKey } from "./signatures";

const parCle: Record<string, Signature> = Object.fromEntries(
  SIGNATURES.map((s) => [s.key, s])
);

export interface FicheLecture {
  name: string;
  valeur: string;
  forces: string;
  schema: string;
  ombres: string;
  communication: string;
  mature: string;
  phrase: string;
  coaching: string;
}

function fiche(k: string | null | undefined): FicheLecture | null {
  const s = k ? parCle[k] : undefined;
  if (!s) return null;
  return {
    name: s.name,
    valeur: s.valeur,
    forces: s.forces,
    schema: s.schema,
    ombres: s.ombres,
    communication: s.communication,
    mature: s.mature,
    phrase: s.phrase,
    coaching: s.coaching,
  };
}

export interface LectureApprofondie {
  principale: FicheLecture;
  secondaire: FicheLecture | null;
  emergente: FicheLecture | null;
  synthese: string; // comment ces facettes se combinent et se tempèrent
}

// `emergente` est ignorée si elle est vide ou égale à la principale/secondaire.
export function lectureApprofondie(
  dominant: SignatureKey,
  secondaire: SignatureKey | null,
  emergente: SignatureKey | null
): LectureApprofondie | null {
  const principale = fiche(dominant);
  if (!principale) return null;
  const sec = fiche(secondaire);
  const emg =
    emergente && emergente !== dominant && emergente !== secondaire
      ? fiche(emergente)
      : null;

  const nomP = principale.name;
  const nomS = sec?.name;
  const nomE = emg?.name;
  const synthese =
    `Au cœur, ${nomP} : ${principale.valeur.toLowerCase()}` +
    (nomS
      ? ` En appui, ${nomS} nuance cette force — les deux se tempèrent au lieu de se concurrencer.`
      : "") +
    (nomE
      ? ` Et une troisième voix monte, ${nomE} : une facette à accueillir, signe que tu n'es pas figée dans un seul rôle.`
      : "");

  return { principale, secondaire: sec, emergente: emg, synthese };
}
