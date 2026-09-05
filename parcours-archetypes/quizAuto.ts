// Quiz d'auto-évaluation — un exercice ludique : où en es-tu, en ce moment, sur
// chacun des 4 piliers ? Tu notes quelques énoncés, tu obtiens un petit bilan +
// une piste d'action. Pur, déterministe, sans progression ni notion de jour.

import { Perimetre } from "@/parcours-gap/perimetres";

export interface QuizPilier {
  key: Perimetre;
  intro: string;
  enonces: string[]; // notés de 0 (rarement) à 3 (très souvent). Haut = solide.
}

// 4 énoncés par pilier, formulés en positif (score haut = appui).
export const QUIZ: QuizPilier[] = [
  {
    key: "relationnel",
    intro: "Tes liens : famille, amis, entourage.",
    enonces: [
      "Je me sens à ma place dans mes relations proches.",
      "J'ose dire ce que je pense, même quand c'est délicat.",
      "Je me sens soutenu·e quand j'en ai besoin.",
      "Je consacre vraiment du temps aux liens qui comptent.",
    ],
  },
  {
    key: "love",
    intro: "Le cœur : couple, amour, intimité.",
    enonces: [
      "Je me sens libre d'être moi-même en amour.",
      "J'ose demander ce dont j'ai besoin dans le couple (ou face à l'amour).",
      "Je me sens en sécurité affective.",
      "Je laisse entrer la tendresse sans la minimiser.",
    ],
  },
  {
    key: "pro",
    intro: "Le travail : tes projets, ta façon d'agir.",
    enonces: [
      "Ce que je fais a du sens pour moi.",
      "J'ose prendre ma place et parler.",
      "Je décide selon ce qui compte pour moi, pas seulement les attentes.",
      "J'avance vers quelque chose qui me tient à cœur.",
    ],
  },
  {
    key: "perso",
    intro: "La santé : ton corps, ton énergie, ton équilibre.",
    enonces: [
      "Je prends soin de mon corps et de mon énergie.",
      "Je m'accorde du repos sans culpabiliser.",
      "Je reconnais quand j'ai atteint ma limite.",
      "Mon quotidien respecte mes besoins de base (sommeil, calme).",
    ],
  },
];

export const quizByKey: Record<Perimetre, QuizPilier> = Object.fromEntries(
  QUIZ.map((q) => [q.key, q])
) as Record<Perimetre, QuizPilier>;

export interface BilanQuiz {
  niveau: "solide" | "mixte" | "fragile";
  titre: string;
  texte: string;
  action: string;
}

// Score = somme des 4 énoncés (0..12). Bilan + une piste d'action concrète.
export function bilanQuiz(score: number, total: number): BilanQuiz {
  const ratio = total > 0 ? score / total : 0;
  if (ratio >= 0.72) {
    return {
      niveau: "solide",
      titre: "Un appui pour toi",
      texte:
        "Ce pilier est plutôt solide en ce moment. C'est une ressource sur laquelle tu peux t'appuyer.",
      action:
        "Sers-t'en comme point d'ancrage : qu'est-ce que tu peux y puiser pour soutenir un pilier plus fragile ?",
    };
  }
  if (ratio >= 0.42) {
    return {
      niveau: "mixte",
      titre: "Des appuis, et des tensions",
      texte:
        "Ce pilier oscille : certaines choses tiennent, d'autres demandent du soin. C'est normal — rien n'est figé.",
      action:
        "Repère l'énoncé où tu as mis le score le plus bas. Un seul petit geste cette semaine, rien que pour celui-là.",
    };
  }
  return {
    niveau: "fragile",
    titre: "Ce pilier demande de l'attention",
    texte:
      "En ce moment, ce pilier te coûte. Ce n'est pas un verdict : c'est une photo de maintenant, et une photo, ça se change.",
    action:
      "Pas de grand chantier. Un tout petit pas aujourd'hui, sur ce qui te pèse le plus — juste un.",
  };
}
