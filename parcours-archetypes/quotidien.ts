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
import { defiDuJour } from "./defis";

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
  // Présent sur les ressources adossées à la recherche : la référence (auteur,
  // ouvrage, année). Sert à distinguer « Les savoirs » du reste.
  source?: string;
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
  if (kind === "defi")
    return { kind, label: "Ton micro-défi", texte: defiDuJour(n, arch.key, arch.defi) };
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
      "Trois respirations lentes, l'expiration plus longue que l'inspiration : c'est ce ratio qui active le système parasympathique et fait retomber la tension physiologique. À la première, relâche les épaules ; à la deuxième, la mâchoire ; à la troisième, demande-toi ce dont ton corps a besoin, là, maintenant.",
    source: "Herbert Benson, « The Relaxation Response » (1975)",
  },
  {
    id: "question-du-soir",
    type: "reflexion",
    titre: "La question du soir",
    duree: "3 min",
    corps:
      "Avant de fermer la journée, écris en une phrase le moment — même minuscule — où tu t'es sentie toi-même. Mettre des mots sur le vécu, et pas seulement le ressentir, réorganise l'expérience et fait baisser la charge : c'est le mécanisme démontré de l'écriture expressive. Sur trente jours, ces phrases dessinent un motif.",
    source: "James Pennebaker, recherche sur l'écriture expressive (1997)",
  },
  {
    id: "identite-non-fixe",
    type: "lecture",
    titre: "Pourquoi tu n'as pas une identité fixe",
    duree: "4 min",
    corps:
      "On croit devoir « se trouver », comme si un moi définitif nous attendait. La psychologie du développement adulte décrit l'inverse : l'identité n'est pas un objet à découvrir mais une structure qui évolue par paliers, toute la vie. Tu n'es pas en retard sur toi-même — tu es en cours de construction.",
    source: "Robert Kegan, « The Evolving Self » (1982)",
  },
  {
    id: "cinq-appuis",
    type: "pratique",
    titre: "Ancrage : cinq appuis",
    duree: "2 min",
    corps:
      "Nomme cinq choses que tu vois, quatre que tu entends, trois que tu touches, deux que tu sens, une que tu goûtes. Ramener l'attention aux cinq sens interrompt la rumination en occupant le circuit qui l'alimente — une compétence d'ancrage documentée pour redescendre d'un pic d'anxiété.",
    source: "Marsha Linehan, thérapie comportementale dialectique — ancrage (1993)",
  },
  {
    id: "ce-que-tu-repetes",
    type: "reflexion",
    titre: "Ce que tu répètes",
    duree: "3 min",
    corps:
      "Repère une phrase que tu te répètes sur toi : « je suis quelqu'un qui… ». La thérapie cognitive appelle ça une croyance centrale — une pensée automatique si familière qu'on la prend pour un fait. La repérer, c'est la rendre discutable ; et ce qui est discutable peut changer.",
    source: "Aaron T. Beck, « Cognitive Therapy of Depression » (1979)",
  },
  {
    id: "version-finale",
    type: "lecture",
    titre: "Le mythe de la version finale de toi",
    duree: "4 min",
    corps:
      "Il n'y a pas de ligne d'arrivée où tout serait enfin « accompli ». Les psychologues nomment ce mirage l'illusion d'arrivée : on croit que le prochain palier apportera le contentement, et il se dérobe à chaque fois. Le sens ne vient pas d'arriver, mais d'avancer vers ce qui compte.",
    source: "Tal Ben-Shahar, « Happier » (2007)",
  },
  {
    id: "besoin-non-nomme",
    type: "reflexion",
    titre: "Ton besoin non nommé",
    duree: "3 min",
    corps:
      "Derrière une contrariété récente, cherche le besoin qu'elle protège : être vue, en sécurité, avoir de l'espace, compter. La communication non violente montre qu'une émotion forte signale presque toujours un besoin non satisfait — le nommer, c'est déjà commencer à en prendre soin.",
    source: "Marshall Rosenberg, « Les mots sont des fenêtres » (2003)",
  },
  {
    id: "frontiere-une-phrase",
    type: "pratique",
    titre: "Poser une frontière, en une phrase",
    duree: "2 min",
    corps:
      "Prépare une phrase claire pour un « non » que tu ajournes : courte, sans justification. « Je ne suis pas disponible pour ça. » L'affirmation de soi n'est ni l'agression ni l'effacement — c'est énoncer sa position sans la plaider. Tu n'as pas à la dire aujourd'hui, juste à la rendre prête.",
    source: "Alberti & Emmons, « Your Perfect Right » (1970)",
  },
  {
    id: "valeurs-journees",
    type: "lecture",
    titre: "L'écart entre tes valeurs et tes journées",
    duree: "4 min",
    corps:
      "Tes valeurs se lisent moins dans ce que tu dis que dans où va ton temps. La thérapie d'acceptation et d'engagement (ACT) traite les valeurs comme des directions choisies, pas des idéaux : l'écart entre elles et tes journées n'est pas une faute, c'est l'information qui indique où réengager un pas concret.",
    source: "Steven C. Hayes, « Acceptance and Commitment Therapy » (1999)",
  },
  {
    id: "a-qui-ce-cap",
    type: "reflexion",
    titre: "À qui appartient ce cap ?",
    duree: "3 min",
    corps:
      "Prends un objectif que tu portes : est-il vraiment de toi, ou hérité d'un regard — parent, milieu, époque ? La théorie de l'autodétermination distingue les buts autonomes (choisis) des buts introjectés (subis) : on tient bien plus longtemps un cap qu'on a réellement fait sien.",
    source: "Deci & Ryan, théorie de l'autodétermination (1985)",
  },

  // — Multipotentialité : ressources adossées à la recherche —
  {
    id: "multi-vrai-but",
    type: "lecture",
    titre: "Tu n'as pas « un seul vrai but »",
    duree: "4 min",
    corps:
      "Certaines personnes ne sont pas faites pour une seule vocation, mais pour en explorer plusieurs. Ce n'est ni de l'indécision ni de la dispersion — c'est un mode de fonctionnement, avec ses forces propres : apprentissage rapide, synthèse entre domaines, adaptabilité.",
    source: "Emilie Wapnick, « How to Be Everything » (2017) · TED (2015)",
  },
  {
    id: "multi-scanner",
    type: "lecture",
    titre: "Scanner, pas dispersé",
    duree: "4 min",
    corps:
      "Les esprits attirés par de nombreux sujets à la fois — les « scanners ». Le constat clé : le problème n'est pas d'avoir trop d'intérêts, mais de croire qu'il faudrait n'en garder qu'un. On peut organiser sa vie AUTOUR de cette pluralité, au lieu de la combattre.",
    source: "Barbara Sher, « Refuse to Choose! » (2006)",
  },
  {
    id: "multi-range",
    type: "lecture",
    titre: "Pourquoi les généralistes gagnent",
    duree: "5 min",
    corps:
      "Dans les environnements complexes et changeants, les profils généralistes — qui échantillonnent large avant de se spécialiser — surpassent souvent les hyper-spécialistes précoces. La diversité des expériences nourrit la créativité et la capacité à relier des domaines éloignés.",
    source: "David Epstein, « Range » (2019)",
  },
  {
    id: "multi-intelligences",
    type: "lecture",
    titre: "Plusieurs intelligences, pas un seul QI",
    duree: "4 min",
    corps:
      "La théorie des intelligences multiples (linguistique, logico-mathématique, spatiale, corporelle, musicale, interpersonnelle, intrapersonnelle, naturaliste) opère un déplacement : la valeur d'un esprit ne se réduit pas à une seule mesure. Tes talents pluriels ne sont pas un défaut de focalisation.",
    source: "Howard Gardner, « Frames of Mind » (1983)",
  },

  // — Neurosciences & transformation : ce que la recherche dit du changement
  //   profond. Le champ lexical de l'app (schéma, narratif, plasticité) trouve
  //   ici ses appuis scientifiques.
  {
    id: "neuro-plasticite",
    type: "lecture",
    titre: "Ton cerveau n'est pas figé",
    duree: "5 min",
    corps:
      "La neuroplasticité, c'est la capacité du cerveau à se réorganiser tout au long de la vie : les connexions se renforcent avec ce qu'on répète, s'affaiblissent avec ce qu'on délaisse. Autrement dit, un schéma installé n'est pas une fatalité gravée — c'est un chemin très fréquenté, qu'une pratique régulière peut détourner.",
    source: "Norman Doidge, « The Brain That Changes Itself » (2007)",
  },
  {
    id: "neuro-possibles",
    type: "lecture",
    titre: "Les « moi possibles » tirent l'action",
    duree: "4 min",
    corps:
      "En psychologie, les « possible selves » désignent les versions de soi qu'on se projette — celle qu'on espère devenir, celle qu'on craint de devenir. Ces images ne sont pas décoratives : elles orientent concrètement la motivation et les choix. Rendre vivace un moi possible, c'est déjà commencer à s'y diriger.",
    source: "Hazel Markus & Paula Nurius, « Possible Selves », American Psychologist (1986)",
  },
  {
    id: "neuro-narratif",
    type: "lecture",
    titre: "Tu deviens l'histoire que tu te racontes",
    duree: "5 min",
    corps:
      "La recherche sur l'identité narrative montre que nous construisons un « moi » cohérent en reliant notre passé, notre présent et notre futur dans un récit. Ce récit n'est pas figé : réécrire les épisodes-clés — leur sens, leur place — modifie réellement le rapport à soi. Ton narratif est un matériau, pas une sentence.",
    source: "Dan P. McAdams, travaux sur la narrative identity (1993–)",
  },
  {
    id: "neuro-habitudes",
    type: "lecture",
    titre: "Le changement passe par le contexte, pas la volonté",
    duree: "5 min",
    corps:
      "Une large part de nos actions quotidiennes est automatique, déclenchée par le contexte plus que par une décision consciente. Conséquence pratique : la transformation durable se joue moins dans l'effort de volonté que dans l'aménagement de l'environnement et la répétition — jusqu'à ce que le nouveau geste devienne le geste par défaut.",
    source: "Wendy Wood, « Good Habits, Bad Habits » (2019)",
  },
  {
    id: "neuro-mindset",
    type: "lecture",
    titre: "Croire que ça peut bouger change tout",
    duree: "4 min",
    corps:
      "Le regard qu'on porte sur ses propres capacités — figées ou perfectibles — modifie la façon dont on affronte l'effort et l'échec. Voir une aptitude comme développable transforme un revers en information plutôt qu'en verdict. Le plafond n'est pas seulement réel : il est en partie une croyance qu'on peut interroger.",
    source: "Carol Dweck, « Mindset » (2006)",
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
  // Multiplicateur premier (13) volontairement : gardé coprime aux tailles de
  // pool réalistes (jamais un facteur commun), sinon la rotation par jour se
  // replierait sur trop peu de ressources et perdrait sa diversité.
  const seed = n * 13 + hash(archKey);
  return pool[seed % pool.length];
}

export const TYPE_LABEL: Record<Ressource["type"], string> = {
  pratique: "Pratique",
  lecture: "Lecture",
  reflexion: "Réflexion",
};
