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

  // --- Renouvellement de la bibliothèque : pratiques, réflexions et savoirs
  // neufs, dont les piliers Love & Santé. Même registre premium et sourcé. ---
  {
    id: "coherence-cardiaque",
    type: "pratique",
    titre: "La cohérence cardiaque",
    duree: "5 min",
    corps:
      "Respire à un rythme régulier — environ six respirations par minute, inspiration et expiration de même durée. Ce tempo synchronise le cœur et la respiration et fait basculer le système nerveux vers le calme. Cinq minutes suffisent pour sentir la vague retomber ; l'effet se prolonge plusieurs heures.",
    source: "David Servan-Schreiber, « Guérir » (2003)",
  },
  {
    id: "plus-petit-pas",
    type: "pratique",
    titre: "Le plus petit pas possible",
    duree: "2 min",
    corps:
      "Prends ce que tu repousses et réduis-le à une action de deux minutes : pas « ranger ma vie », mais « ouvrir le document ». On ne change pas par la volonté mais en abaissant la marche jusqu'à ce qu'elle devienne évidente. Le petit pas fait, l'élan suit souvent tout seul.",
    source: "BJ Fogg, « Tiny Habits » (2019)",
  },
  {
    id: "main-sur-le-coeur",
    type: "pratique",
    titre: "La main sur le cœur",
    duree: "2 min",
    corps:
      "Dans un moment dur, pose une main sur ton cœur et parle-toi comme à une amie qui traverse la même chose. Ce geste et ce ton activent le système d'apaisement plutôt que l'autocritique. Se traiter avec bienveillance n'est pas se complaire : c'est ce qui redonne la force d'agir.",
    source: "Kristin Neff, « Self-Compassion » (2011)",
  },
  {
    id: "marche-debloque",
    type: "pratique",
    titre: "La marche qui débloque",
    duree: "10 min",
    corps:
      "Bloquée sur une question ? Lève-toi et marche, dehors si possible. Marcher augmente nettement la pensée divergente — celle qui fait surgir des idées neuves. Ce n'est pas une pause DANS la réflexion : c'est une façon de réfléchir autrement, avec le corps.",
    source: "Oppezzo & Schwartz, Stanford (2014)",
  },
  {
    id: "se-parler-amie",
    type: "reflexion",
    titre: "Se parler à la troisième personne",
    duree: "3 min",
    corps:
      "Face à une émotion forte, décris-la en t'appelant par ton prénom : « [toi] ressent… parce que… ». Cette petite distance dans le langage calme la réactivité et éclaircit la pensée, comme si tu conseillais quelqu'un que tu aimes. On se donne rarement à soi la sagesse qu'on offre aux autres.",
    source: "Ethan Kross, « Chatter » (2021)",
  },
  {
    id: "oui-trop-vite",
    type: "reflexion",
    titre: "À qui tu dis oui trop vite",
    duree: "3 min",
    corps:
      "Repère un « oui » récent que tu as regretté. Une limite claire n'est pas un rejet de l'autre : c'est ce qui rend la relation vivable dans la durée. Dire non à ce qui t'épuise, c'est dire oui à ce que tu peux vraiment donner.",
    source: "Henry Cloud & John Townsend, « Boundaries » (1992)",
  },
  {
    id: "comparaison-vole",
    type: "reflexion",
    titre: "Ce que la comparaison te vole",
    duree: "3 min",
    corps:
      "On s'évalue en se comparant — c'est automatique, surtout devant des vies mises en scène. Mais comparer ton intérieur au dehors des autres est un jeu truqué. Remplace « est-ce que je fais mieux que… » par « est-ce que je vais vers ce qui compte pour moi ? ».",
    source: "Leon Festinger, théorie de la comparaison sociale (1954)",
  },
  {
    id: "meilleure-version-demain",
    type: "reflexion",
    titre: "Ta meilleure version, demain",
    duree: "4 min",
    corps:
      "Écris quelques lignes sur toi dans un futur où les choses ont bien tourné, où tu as tenu tes directions. Imaginer concrètement ce « meilleur soi possible » augmente l'optimisme et l'énergie d'agir — pas comme un rêve, mais comme un cap qu'on précise assez pour s'en approcher.",
    source: "Laura King, recherche sur le « best possible self » (2001)",
  },
  {
    id: "amour-securise",
    type: "lecture",
    titre: "L'amour sécurise, il ne teste pas",
    duree: "4 min",
    corps:
      "Les liens amoureux fonctionnent comme un attachement : on a besoin de savoir que l'autre est là, joignable, fiable. Beaucoup de disputes ne parlent pas du sujet apparent mais d'une seule question — « est-ce que je compte pour toi ? ». Nommer ce besoin, plutôt que le déguiser en reproche, désamorce le conflit.",
    source: "Sue Johnson, « Hold Me Tight » (2008)",
  },
  {
    id: "petits-gestes-couple",
    type: "lecture",
    titre: "Les petits gestes font les grands couples",
    duree: "4 min",
    corps:
      "Ce qui tient un couple n'est pas les grands moments, mais la façon de répondre aux minuscules appels du quotidien — un regard, une phrase, une attention. Les couples qui durent se tournent l'un vers l'autre dans ces micro-instants. L'amour se joue là, plus que dans les déclarations.",
    source: "John Gottman, « The Seven Principles for Making Marriage Work » (1999)",
  },
  {
    id: "sommeil-repare",
    type: "lecture",
    titre: "Le sommeil répare ton identité",
    duree: "4 min",
    corps:
      "Le sommeil n'est pas du temps perdu : c'est là que le cerveau trie les émotions de la journée et consolide ce qu'on apprend. Manquer de sommeil, c'est réagir à fleur de peau et se sentir « moins soi ». Protéger tes nuits est l'un des gestes les plus profonds pour ton équilibre.",
    source: "Matthew Walker, « Why We Sleep » (2017)",
  },
  {
    id: "repos-pas-recompense",
    type: "lecture",
    titre: "Le repos n'est pas une récompense",
    duree: "3 min",
    corps:
      "On attend souvent d'avoir « mérité » le repos pour se le permettre. Mais le repos n'est pas la prime de la performance : c'en est la condition. Il en existe plusieurs formes — physique, mentale, sensorielle, sociale — et on a rarement besoin de celle qu'on s'accorde par défaut.",
    source: "Saundra Dalton-Smith, « Sacred Rest » (2017)",
  },
  {
    id: "sens-plutot-bonheur",
    type: "lecture",
    titre: "Chercher le sens, pas le bonheur",
    duree: "4 min",
    corps:
      "Viser directement le bonheur le fait fuir ; il arrive de surcroît, quand on est engagé dans quelque chose qui nous dépasse. Même dans l'épreuve, garder un « pourquoi » rend le « comment » tenable. Le sens ne se trouve pas une fois pour toutes : il se choisit, situation après situation.",
    source: "Viktor Frankl, « Découvrir un sens à sa vie » (1946)",
  },
  {
    id: "lien-qui-compte",
    type: "reflexion",
    titre: "Le lien qui te manque",
    duree: "3 min",
    corps:
      "La plus longue étude sur une vie d'adulte tient en une phrase : ce sont la qualité de nos relations qui nous gardent en bonne santé et heureux, bien plus que l'argent ou la réussite. Demande-toi quel lien tu laisses se distendre — et envoie, aujourd'hui, un signe à cette personne.",
    source: "Robert Waldinger, étude de Harvard sur le développement adulte (2015)",
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
