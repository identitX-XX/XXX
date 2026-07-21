// parcours-archetypes/sens.ts
// Le mini-diagnostic « écran-miroir » : 8 questions à choix forcé qui
// calculent le DOMINANT (et son secondaire), lequel ouvre le parcours
// (J1 = dominant, J15 = secondaire). La Métamorphe est exclue des résultats :
// c'est le dominant de clôture, universel, réservé au J30.
//
// Scoring : chaque réponse marque un archétype (+1). Comme certains archétypes
// apparaissent plus souvent dans les options, le score est NORMALISÉ par le
// nombre d'apparitions — sinon l'Explorateur, très présent, sortirait trop
// souvent. 1er = dominant, 2e = secondaire.

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
    question: "Le matin, ce qui te lève ?",
    options: [
      { label: "Découvrir, bouger, voir ce qui s'ouvre", archetype: "explorateur" },
      { label: "Y voir clair, comprendre", archetype: "sage" },
      { label: "Faire exister quelque chose de neuf", archetype: "createur" },
      { label: "M'occuper de ceux qui comptent", archetype: "protecteur" },
      { label: "Avancer sur ce que je construis", archetype: "batisseur" },
    ],
  },
  {
    id: "q2",
    question: "Un problème inédit — ton premier réflexe ?",
    options: [
      { label: "Explorer plusieurs pistes", archetype: "explorateur" },
      { label: "Comprendre la cause", archetype: "sage" },
      { label: "Inventer une solution à moi", archetype: "createur" },
      { label: "Remettre en cause la règle", archetype: "rebelle" },
      { label: "Structurer un plan", archetype: "batisseur" },
    ],
  },
  {
    id: "q3",
    question: "Ce qu'on vient chercher chez toi ?",
    options: [
      { label: "Un abri, du réconfort", archetype: "guerisseur" },
      { label: "Un avis lucide", archetype: "sage" },
      { label: "De la tendresse, du lien", archetype: "amoureux" },
      { label: "De la légèreté, du rire", archetype: "joueur" },
      { label: "Un conseil qui fait grandir", archetype: "passeur" },
    ],
  },
  {
    id: "q4",
    question: "Au travail, ce qui te donne de l'énergie ?",
    options: [
      { label: "Un terrain neuf, un défi inédit", archetype: "explorateur" },
      { label: "Concevoir, créer", archetype: "createur" },
      { label: "Faire durer, livrer", archetype: "batisseur" },
      { label: "Faire grandir les gens", archetype: "passeur" },
      { label: "Bousculer ce qui cloche", archetype: "rebelle" },
    ],
  },
  {
    id: "q5",
    question: "Ce qui te manque le plus quand tu ne l'as pas ?",
    options: [
      { label: "La liberté de mouvement", archetype: "explorateur" },
      { label: "Le sens, la compréhension", archetype: "sage" },
      { label: "L'intimité, le lien profond", archetype: "amoureux" },
      { label: "Prendre soin des miens", archetype: "protecteur" },
      { label: "L'émerveillement, le rêve", archetype: "reveur" },
    ],
  },
  {
    id: "q6",
    question: "Ta façon de te ressourcer ?",
    options: [
      { label: "Partir, changer d'air", archetype: "explorateur" },
      { label: "Réfléchir seul·e", archetype: "sage" },
      { label: "Créer, écrire, bricoler", archetype: "createur" },
      { label: "Jouer, rire, l'instant présent", archetype: "joueur" },
      { label: "Apaiser, réparer (toi/les autres)", archetype: "guerisseur" },
    ],
  },
  {
    id: "q7",
    question: "Ce que tu ne supportes pas ?",
    options: [
      { label: "L'injustice, l'hypocrisie", archetype: "rebelle" },
      { label: "La confusion, la bêtise", archetype: "sage" },
      { label: "Qu'on lâche les plus fragiles", archetype: "protecteur" },
      { label: "La routine qui étouffe", archetype: "explorateur" },
      { label: "Le cynisme, la lourdeur", archetype: "reveur" },
    ],
  },
  {
    id: "q8",
    question: "Dans 5 ans, ta plus grande fierté ?",
    options: [
      { label: "Avoir osé, vécu large", archetype: "explorateur" },
      { label: "M'être compris·e en profondeur", archetype: "sage" },
      { label: "Avoir créé une œuvre à moi", archetype: "createur" },
      { label: "Avoir bâti quelque chose qui dure", archetype: "batisseur" },
      { label: "Avoir transmis à d'autres", archetype: "passeur" },
      { label: "Avoir aimé et été aimé·e pleinement", archetype: "amoureux" },
    ],
  },
];

// Combien de fois chaque archétype apparaît dans les options (pour normaliser).
function apparitions(): Record<string, number> {
  const c: Record<string, number> = {};
  for (const q of QUESTIONS)
    for (const o of q.options) c[o.archetype] = (c[o.archetype] ?? 0) + 1;
  return c;
}

// reponses : { [questionId]: archetypeKey choisi }
export function calculerDiagnostic(
  reponses: Record<string, ArchetypeKey>
): Diagnostic {
  const app = apparitions();
  const brut: Record<string, number> = {};
  for (const a of Object.values(reponses)) brut[a] = (brut[a] ?? 0) + 1;

  const scores = Object.keys(app)
    .filter((a) => a !== "metamorphe")
    .map((a) => ({ a: a as ArchetypeKey, score: (brut[a] ?? 0) / app[a] }))
    .sort((x, y) => y.score - x.score);

  const dominant = scores[0]?.a ?? "explorateur";
  const secondaire =
    scores.find((s) => s.a !== dominant)?.a ?? "sage";
  return { dominant, secondaire };
}
