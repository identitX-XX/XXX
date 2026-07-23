// parcours-archetypes/quotidien.ts
// « Le fil du jour » — de quoi avoir envie de revenir chaque jour. Trois piliers :
//   · la NOUVEAUTÉ  : puisée dans l'archétype du jour (sa question, son défi,
//                      son éclairage), la facette tournant chaque jour ;
//   · la RÉVÉLATION : gérée ailleurs (genererRevelations, sourcée) ;
//   · la RESSOURCE  : une pratique / lecture / réflexion courte, choisie de
//                      façon déterministe selon le jour et l'archétype.
// Pur et déterministe : mêmes entrées → mêmes sorties. Le texte des ressources
// est un premier jet, à réécrire.

import { Archetype } from "./types";

export type FacetKind = "eclairage" | "question" | "defi";

export interface Nouveaute {
  kind: FacetKind;
  label: string;
  texte: string;
}

export interface Ressource {
  id: string;
  type: "pratique" | "lecture" | "reflexion";
  titre: string;
  duree: string;
  corps: string;
}

// Hash déterministe (chaîne → entier positif).
function hash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

// La « lens » de l'archétype est déjà montrée dans la capsule du jour : on ne la
// reprend pas ici. La nouveauté alterne la QUESTION et le DÉFI — et la PHASE
// oriente laquelle domine : les phases d'action (exploration, tension) penchent
// vers le défi ; les phases d'observation (révélation, métamorphose) vers la
// question. Ça reste alterné pour ne jamais devenir monotone.
export function nouveauteDuJour(n: number, arch: Archetype, phaseKey?: string): Nouveaute {
  const lean: FacetKind =
    phaseKey === "exploration" || phaseKey === "tension" ? "defi" : "question";
  const other: FacetKind = lean === "defi" ? "question" : "defi";
  const kind: FacetKind = (n - 1) % 2 === 0 ? lean : other;
  if (kind === "defi") return { kind, label: "Ton micro-défi", texte: arch.defi };
  return { kind, label: "La question du jour", texte: arch.question };
}

// La bibliothèque de ressources — premier jet, registre premium et chaleureux.
export const RESSOURCES: Ressource[] = [
  {
    id: "trois-souffles",
    type: "pratique",
    titre: "Le scan des trois souffles",
    duree: "2 min",
    corps:
      "Trois respirations, lentes. À la première, relâche les épaules. À la deuxième, desserre la mâchoire. À la troisième, demande-toi : de quoi mon corps a-t-il besoin, là, maintenant ? N'y réponds pas encore — écoute seulement.",
  },
  {
    id: "question-du-soir",
    type: "reflexion",
    titre: "La question du soir",
    duree: "3 min",
    corps:
      "Avant de fermer la journée : quel moment, aussi petit soit-il, t'a fait te sentir toi-même ? Note-le en une phrase. Sur trente jours, ces phrases dessineront quelque chose que tu ne vois pas encore.",
  },
  {
    id: "identite-non-fixe",
    type: "lecture",
    titre: "Pourquoi tu n'as pas une identité fixe",
    duree: "4 min",
    corps:
      "On croit devoir « se trouver », comme si un moi définitif nous attendait quelque part. Mais l'identité n'est pas un objet à découvrir — c'est un mouvement à habiter. Tu n'es pas en retard sur toi-même. Tu es en train de te faire.",
  },
  {
    id: "cinq-appuis",
    type: "pratique",
    titre: "Ancrage : cinq appuis",
    duree: "2 min",
    corps:
      "Nomme cinq choses que tu vois, quatre que tu entends, trois que tu touches, deux que tu sens, une que tu goûtes. Quand l'esprit s'emballe, le corps sait revenir au présent. Utilise-le comme point d'appui.",
  },
  {
    id: "ce-que-tu-repetes",
    type: "reflexion",
    titre: "Ce que tu répètes",
    duree: "3 min",
    corps:
      "Repère une phrase que tu te dis souvent sur toi-même. « Je suis quelqu'un qui… ». D'où vient-elle, vraiment — de toi, ou d'une voix ancienne ? Tu n'as pas à la garder simplement parce qu'elle est familière.",
  },
  {
    id: "gratitude-ciblee",
    type: "pratique",
    titre: "La minute de gratitude ciblée",
    duree: "1 min",
    corps:
      "Pas une liste. Une seule chose, précise, et pourquoi elle compte pour toi aujourd'hui. La gratitude vague glisse ; la gratitude précise s'ancre.",
  },
  {
    id: "version-finale",
    type: "lecture",
    titre: "Le mythe de la version finale de toi",
    duree: "4 min",
    corps:
      "Il n'y a pas de ligne d'arrivée où tu serais enfin « accomplie ». Cette idée épuise plus qu'elle ne guide. Et si le but n'était pas d'arriver, mais de rester en dialogue avec ce qui bouge en toi ?",
  },
  {
    id: "besoin-non-nomme",
    type: "reflexion",
    titre: "Ton besoin non nommé",
    duree: "3 min",
    corps:
      "Derrière une contrariété récente, cherche le besoin qu'elle protège : être vue, être en sécurité, avoir de l'espace, compter. Nommer le besoin, c'est déjà commencer à en prendre soin.",
  },
  {
    id: "frontiere-une-phrase",
    type: "pratique",
    titre: "Poser une frontière, en une phrase",
    duree: "2 min",
    corps:
      "Prépare une phrase claire pour un « non » que tu ajournes. Courte, sans justification. « Je ne suis pas disponible pour ça. » Tu n'as pas à la prononcer aujourd'hui — juste à la rendre disponible.",
  },
  {
    id: "valeurs-journees",
    type: "lecture",
    titre: "L'écart entre tes valeurs et tes journées",
    duree: "4 min",
    corps:
      "Tes valeurs se lisent moins dans ce que tu dis que dans où va ton temps. Regarde ta dernière journée sans juger : qu'est-ce qu'elle révèle de ce qui compte vraiment pour toi ? L'écart n'est pas une faute — c'est une information.",
  },
  {
    id: "geste-symbolique",
    type: "pratique",
    titre: "Le geste symbolique du jour",
    duree: "2 min",
    corps:
      "Choisis un petit geste qui dit qui tu deviens : ranger un espace, envoyer ce message, t'asseoir cinq minutes sans écran. Le changement d'identité passe par le corps avant de passer par la tête.",
  },
  {
    id: "a-qui-ce-cap",
    type: "reflexion",
    titre: "À qui appartient ce cap ?",
    duree: "3 min",
    corps:
      "Prends un objectif que tu portes. Est-il vraiment de toi, ou hérité d'un regard — parent, milieu, époque ? Garder un cap est plus simple quand on sait qu'on l'a choisi.",
  },
];

// La ressource du jour : déterministe, variée selon le jour et l'archétype.
// Le climat corporel l'oriente : un jour agité (turbulence élevée) fait remonter
// une PRATIQUE d'ancrage ; un jour apaisé laisse place à la lecture ou la
// réflexion. Sans climat renseigné, toute la bibliothèque est ouverte.
export function ressourceDuJour(
  n: number,
  archKey: string,
  turbulence?: number
): Ressource {
  let pool = RESSOURCES;
  if (turbulence != null) {
    if (turbulence >= 55) pool = RESSOURCES.filter((r) => r.type === "pratique");
    else if (turbulence < 38) pool = RESSOURCES.filter((r) => r.type !== "pratique");
  }
  if (pool.length === 0) pool = RESSOURCES;
  const seed = n * 7 + hash(archKey);
  return pool[seed % pool.length];
}

export const TYPE_LABEL: Record<Ressource["type"], string> = {
  pratique: "Pratique",
  lecture: "Lecture",
  reflexion: "Réflexion",
};
