// parcours-archetypes/sens.ts
// L'écran-miroir : 12 questions à choix forcé qui calculent la SIGNATURE
// dominante (et sa secondaire), laquelle ouvre le parcours (J1 = dominante,
// J15 = secondaire, J30 = La Présence).
//
// Scoring : chaque réponse marque une signature (+1), NORMALISÉ par le nombre
// d'apparitions de la signature dans les options (pour ne pas favoriser celles
// qui reviennent souvent). 1re = dominante, 2e = secondaire.
//
// Règle spéciale — La Multiple (méta) : quand les réponses sont très dispersées
// (8 signatures distinctes ou plus sur 12 réponses), la dominante devient
// La Multiple : la pluralité se révèle par le motif, pas par une case.

import { ArchetypeKey, Diagnostic } from "./types";

export interface OptionDiag {
  label: string;
  archetype: ArchetypeKey;
}
export interface QuestionDiag {
  id: string;
  question: string;
  options: OptionDiag[];
}

export const QUESTIONS: QuestionDiag[] = [
  {
    id: "q1",
    question: "Pourquoi te lèves-tu le matin ?",
    options: [
      { label: "Faire exister quelque chose de neuf", archetype: "creatrice" },
      { label: "Y voir clair, comprendre", archetype: "sage" },
      { label: "M'occuper de ceux qui comptent", archetype: "mere" },
      { label: "Avancer sur ce que je construis", archetype: "batisseuse" },
      { label: "Défendre ce qui est juste", archetype: "activiste" },
    ],
  },
  {
    id: "q2",
    question: "Face à un problème inédit, ton premier réflexe ?",
    options: [
      { label: "Poser un plan, anticiper", archetype: "stratege" },
      { label: "Sentir ce qui se joue en dessous", archetype: "sorciere" },
      { label: "Remettre en cause la règle", archetype: "rebelle" },
      { label: "Trouver le terrain d'entente", archetype: "mediatrice" },
      { label: "Imaginer ce qui pourrait naître", archetype: "visionnaire" },
    ],
  },
  {
    id: "q3",
    question: "Ce qu'on vient chercher chez toi ?",
    options: [
      { label: "Un refuge, du réconfort", archetype: "mere" },
      { label: "Un avis lucide", archetype: "sage" },
      { label: "De l'intensité, de la tendresse", archetype: "amante" },
      { label: "Quelqu'un qui décide", archetype: "souveraine" },
      { label: "Un déclic, un passage", archetype: "passeuse" },
    ],
  },
  {
    id: "q4",
    question: "Ce qui te met vraiment en mouvement ?",
    options: [
      { label: "Un horizon à atteindre", archetype: "visionnaire" },
      { label: "Une cause à défendre", archetype: "activiste" },
      { label: "Une œuvre à faire naître", archetype: "creatrice" },
      { label: "Une liberté à préserver", archetype: "libre" },
      { label: "Un lien à approfondir", archetype: "amante" },
    ],
  },
  {
    id: "q5",
    question: "Ce qui te manque le plus quand tu ne l'as pas ?",
    options: [
      { label: "La liberté de mouvement", archetype: "libre" },
      { label: "Le sens, la compréhension", archetype: "sage" },
      { label: "L'intensité du lien", archetype: "amante" },
      { label: "Prendre soin des miens", archetype: "mere" },
      { label: "Le calme, l'ancrage", archetype: "presence" },
    ],
  },
  {
    id: "q6",
    question: "Ta façon de te ressourcer ?",
    options: [
      { label: "Le silence, être simplement là", archetype: "presence" },
      { label: "Réfléchir, prendre du recul", archetype: "sage" },
      { label: "Créer, donner forme", archetype: "artiste" },
      { label: "Partir, changer d'air", archetype: "libre" },
      { label: "Retrouver les miens", archetype: "mere" },
    ],
  },
  {
    id: "q7",
    question: "Ce que tu ne supportes pas ?",
    options: [
      { label: "L'injustice", archetype: "activiste" },
      { label: "Les faux-semblants", archetype: "rebelle" },
      { label: "L'inachevé, le gâchis", archetype: "batisseuse" },
      { label: "Qu'on touche à ceux que j'aime", archetype: "protectrice" },
      { label: "La superficialité", archetype: "sage" },
    ],
  },
  {
    id: "q8",
    question: "Dans un groupe, ta place naturelle ?",
    options: [
      { label: "Celle qui décide et assume", archetype: "souveraine" },
      { label: "Celle qui relie et apaise", archetype: "mediatrice" },
      { label: "Celle qui protège les plus fragiles", archetype: "protectrice" },
      { label: "Celle qui transmet, fait grandir", archetype: "passeuse" },
      { label: "Celle qui garde le cap et les valeurs", archetype: "gardienne" },
    ],
  },
  {
    id: "q9",
    question: "Ce que tu crains le plus, au fond ?",
    options: [
      { label: "Être enfermée", archetype: "libre" },
      { label: "Ne rien créer, être ordinaire", archetype: "creatrice" },
      { label: "Perdre le lien", archetype: "amante" },
      { label: "Perdre le contrôle", archetype: "stratege" },
      { label: "Ne pas être à la hauteur", archetype: "souveraine" },
    ],
  },
  {
    id: "q10",
    question: "Ce qui te définit le mieux ?",
    options: [
      { label: "Je sens ce que les autres ne voient pas", archetype: "sorciere" },
      { label: "Je vois loin", archetype: "visionnaire" },
      { label: "Je tiens dans la durée", archetype: "batisseuse" },
      { label: "Je donne beaucoup", archetype: "altruiste" },
      { label: "Je garde ce qui compte", archetype: "gardienne" },
    ],
  },
  {
    id: "q11",
    question: "Ta manière d'être là pour l'autre ?",
    options: [
      { label: "Me rendre utile, donner", archetype: "altruiste" },
      { label: "Protéger, sécuriser", archetype: "protectrice" },
      { label: "Ressentir pleinement, être présente au lien", archetype: "amante" },
      { label: "Faire grandir", archetype: "passeuse" },
      { label: "Être présente, sans rien forcer", archetype: "presence" },
    ],
  },
  {
    id: "q12",
    question: "Ce que tu veux laisser derrière toi ?",
    options: [
      { label: "Quelque chose de solide", archetype: "batisseuse" },
      { label: "Des gens grandis", archetype: "passeuse" },
      { label: "Une œuvre", archetype: "artiste" },
      { label: "Un monde un peu plus juste", archetype: "activiste" },
      { label: "Des valeurs préservées", archetype: "gardienne" },
    ],
  },
];

// Combien de fois chaque signature apparaît dans les options (pour normaliser).
function apparitions(): Record<string, number> {
  const c: Record<string, number> = {};
  for (const q of QUESTIONS)
    for (const o of q.options) c[o.archetype] = (c[o.archetype] ?? 0) + 1;
  return c;
}

// Au-delà de ce nombre de signatures DISTINCTES choisies, on considère le profil
// comme pluriel → dominante = La Multiple (méta-signature).
const SEUIL_MULTIPLE = 8;

// reponses : { [questionId]: signatureKey choisie }
export function calculerDiagnostic(
  reponses: Record<string, ArchetypeKey>
): Diagnostic {
  const app = apparitions();
  const brut: Record<string, number> = {};
  for (const a of Object.values(reponses)) brut[a] = (brut[a] ?? 0) + 1;

  const scores = Object.keys(app)
    .map((a) => ({ a: a as ArchetypeKey, score: (brut[a] ?? 0) / app[a] }))
    .sort((x, y) => y.score - x.score);

  const fort = scores[0]?.a ?? "presence";
  const distinctes = new Set(Object.values(reponses)).size;

  // Profil très dispersé → La Multiple orchestre ; sa secondaire est la
  // signature la plus marquée malgré tout.
  if (distinctes >= SEUIL_MULTIPLE) {
    return { dominant: "multiple", secondaire: fort, tally: brut as Diagnostic["tally"] };
  }

  const dominant = fort;
  const secondaire = scores.find((s) => s.a !== dominant)?.a ?? "sage";
  return { dominant, secondaire, tally: brut as Diagnostic["tally"] };
}
