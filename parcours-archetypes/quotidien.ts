// parcours-archetypes/quotidien.ts
// « Le fil du jour » — de quoi avoir envie de revenir chaque jour. Trois piliers :
//   · la NOUVEAUTÉ  : puisée dans l'archétype du jour (sa question, son défi,
//                      son éclairage), la facette tournant chaque jour ;
//   · la RÉVÉLATION : gérée ailleurs (genererRevelations, sourcée) ;
//   · la RESSOURCE  : une pratique / lecture / réflexion courte, choisie de
//                      façon déterministe selon le jour et l'archétype.
// Pur et déterministe : mêmes entrées → mêmes sorties.
//
// La bibliothèque est désormais organisée par THÈMES DE VIE (le `theme` ci-
// dessous), pas seulement par type : Relationnel · Parentalité · Santé · Corps ·
// Style & présence · Soi & esprit. Le `type` (pratique/lecture/réflexion) reste,
// car il pilote la « ressource du jour » (le climat corporel l'oriente).

import { Archetype } from "./types";
import { defiDuJour } from "./defis";

export type FacetKind = "eclairage" | "question" | "defi";

export interface Nouveaute {
  kind: FacetKind;
  label: string;
  texte: string;
}

// Thèmes de vie — l'axe de lecture principal de la bibliothèque.
export type RessourceTheme =
  | "relationnel"
  | "parentalite"
  | "sante"
  | "corps"
  | "style"
  | "soi";

export interface Ressource {
  id: string;
  type: "pratique" | "lecture" | "reflexion";
  theme: RessourceTheme;
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

// La bibliothèque de ressources — registre premium et chaleureux, chaque fiche
// adossée à une source et rattachée à un thème de vie.
export const RESSOURCES: Ressource[] = [
  {
    id: "trois-souffles",
    type: "pratique",
    theme: "sante",
    titre: "Le scan des trois souffles",
    duree: "2 min",
    corps:
      "Trois respirations lentes, l'expiration plus longue que l'inspiration : c'est ce ratio qui active le système parasympathique et fait retomber la tension physiologique. À la première, relâche les épaules ; à la deuxième, la mâchoire ; à la troisième, demande-toi ce dont ton corps a besoin, là, maintenant.",
    source: "Herbert Benson, « The Relaxation Response » (1975)",
  },
  {
    id: "question-du-soir",
    type: "reflexion",
    theme: "soi",
    titre: "La question du soir",
    duree: "3 min",
    corps:
      "Avant de fermer la journée, écris en une phrase le moment — même minuscule — où tu t'es sentie toi-même. Mettre des mots sur le vécu, et pas seulement le ressentir, réorganise l'expérience et fait baisser la charge : c'est le mécanisme démontré de l'écriture expressive. Sur trente jours, ces phrases dessinent un motif.",
    source: "James Pennebaker, recherche sur l'écriture expressive (1997)",
  },
  {
    id: "identite-non-fixe",
    type: "lecture",
    theme: "soi",
    titre: "Pourquoi tu n'as pas une identité fixe",
    duree: "4 min",
    corps:
      "On croit devoir « se trouver », comme si un moi définitif nous attendait. La psychologie du développement adulte décrit l'inverse : l'identité n'est pas un objet à découvrir mais une structure qui évolue par paliers, toute la vie. Tu n'es pas en retard sur toi-même — tu es en cours de construction.",
    source: "Robert Kegan, « The Evolving Self » (1982)",
  },
  {
    id: "cinq-appuis",
    type: "pratique",
    theme: "corps",
    titre: "Ancrage : cinq appuis",
    duree: "2 min",
    corps:
      "Nomme cinq choses que tu vois, quatre que tu entends, trois que tu touches, deux que tu sens, une que tu goûtes. Ramener l'attention aux cinq sens interrompt la rumination en occupant le circuit qui l'alimente — une compétence d'ancrage documentée pour redescendre d'un pic d'anxiété.",
    source: "Marsha Linehan, thérapie comportementale dialectique — ancrage (1993)",
  },
  {
    id: "ce-que-tu-repetes",
    type: "reflexion",
    theme: "soi",
    titre: "Ce que tu répètes",
    duree: "3 min",
    corps:
      "Repère une phrase que tu te répètes sur toi : « je suis quelqu'un qui… ». La thérapie cognitive appelle ça une croyance centrale — une pensée automatique si familière qu'on la prend pour un fait. La repérer, c'est la rendre discutable ; et ce qui est discutable peut changer.",
    source: "Aaron T. Beck, « Cognitive Therapy of Depression » (1979)",
  },
  {
    id: "version-finale",
    type: "lecture",
    theme: "soi",
    titre: "Le mythe de la version finale de toi",
    duree: "4 min",
    corps:
      "Il n'y a pas de ligne d'arrivée où tout serait enfin « accompli ». Les psychologues nomment ce mirage l'illusion d'arrivée : on croit que le prochain palier apportera le contentement, et il se dérobe à chaque fois. Le sens ne vient pas d'arriver, mais d'avancer vers ce qui compte.",
    source: "Tal Ben-Shahar, « Happier » (2007)",
  },
  {
    id: "besoin-non-nomme",
    type: "reflexion",
    theme: "relationnel",
    titre: "Ton besoin non nommé",
    duree: "3 min",
    corps:
      "Derrière une contrariété récente, cherche le besoin qu'elle protège : être vue, en sécurité, avoir de l'espace, compter. La communication non violente montre qu'une émotion forte signale presque toujours un besoin non satisfait — le nommer, c'est déjà commencer à en prendre soin.",
    source: "Marshall Rosenberg, « Les mots sont des fenêtres » (2003)",
  },
  {
    id: "frontiere-une-phrase",
    type: "pratique",
    theme: "relationnel",
    titre: "Poser une frontière, en une phrase",
    duree: "2 min",
    corps:
      "Prépare une phrase claire pour un « non » que tu ajournes : courte, sans justification. « Je ne suis pas disponible pour ça. » L'affirmation de soi n'est ni l'agression ni l'effacement — c'est énoncer sa position sans la plaider. Tu n'as pas à la dire aujourd'hui, juste à la rendre prête.",
    source: "Alberti & Emmons, « Your Perfect Right » (1970)",
  },
  {
    id: "valeurs-journees",
    type: "lecture",
    theme: "soi",
    titre: "L'écart entre tes valeurs et tes journées",
    duree: "4 min",
    corps:
      "Tes valeurs se lisent moins dans ce que tu dis que dans où va ton temps. La thérapie d'acceptation et d'engagement (ACT) traite les valeurs comme des directions choisies, pas des idéaux : l'écart entre elles et tes journées n'est pas une faute, c'est l'information qui indique où réengager un pas concret.",
    source: "Steven C. Hayes, « Acceptance and Commitment Therapy » (1999)",
  },
  {
    id: "a-qui-ce-cap",
    type: "reflexion",
    theme: "soi",
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
    theme: "soi",
    titre: "Tu n'as pas « un seul vrai but »",
    duree: "4 min",
    corps:
      "Certaines personnes ne sont pas faites pour une seule vocation, mais pour en explorer plusieurs. Ce n'est ni de l'indécision ni de la dispersion — c'est un mode de fonctionnement, avec ses forces propres : apprentissage rapide, synthèse entre domaines, adaptabilité.",
    source: "Emilie Wapnick, « How to Be Everything » (2017) · TED (2015)",
  },
  {
    id: "multi-scanner",
    type: "lecture",
    theme: "soi",
    titre: "Scanner, pas dispersé",
    duree: "4 min",
    corps:
      "Les esprits attirés par de nombreux sujets à la fois — les « scanners ». Le constat clé : le problème n'est pas d'avoir trop d'intérêts, mais de croire qu'il faudrait n'en garder qu'un. On peut organiser sa vie AUTOUR de cette pluralité, au lieu de la combattre.",
    source: "Barbara Sher, « Refuse to Choose! » (2006)",
  },
  {
    id: "multi-range",
    type: "lecture",
    theme: "soi",
    titre: "Pourquoi les généralistes gagnent",
    duree: "5 min",
    corps:
      "Dans les environnements complexes et changeants, les profils généralistes — qui échantillonnent large avant de se spécialiser — surpassent souvent les hyper-spécialistes précoces. La diversité des expériences nourrit la créativité et la capacité à relier des domaines éloignés.",
    source: "David Epstein, « Range » (2019)",
  },
  {
    id: "multi-intelligences",
    type: "lecture",
    theme: "soi",
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
    theme: "soi",
    titre: "Ton cerveau n'est pas figé",
    duree: "5 min",
    corps:
      "La neuroplasticité, c'est la capacité du cerveau à se réorganiser tout au long de la vie : les connexions se renforcent avec ce qu'on répète, s'affaiblissent avec ce qu'on délaisse. Autrement dit, un schéma installé n'est pas une fatalité gravée — c'est un chemin très fréquenté, qu'une pratique régulière peut détourner.",
    source: "Norman Doidge, « The Brain That Changes Itself » (2007)",
  },
  {
    id: "neuro-possibles",
    type: "lecture",
    theme: "soi",
    titre: "Les « moi possibles » tirent l'action",
    duree: "4 min",
    corps:
      "En psychologie, les « possible selves » désignent les versions de soi qu'on se projette — celle qu'on espère devenir, celle qu'on craint de devenir. Ces images ne sont pas décoratives : elles orientent concrètement la motivation et les choix. Rendre vivace un moi possible, c'est déjà commencer à s'y diriger.",
    source: "Hazel Markus & Paula Nurius, « Possible Selves », American Psychologist (1986)",
  },
  {
    id: "neuro-narratif",
    type: "lecture",
    theme: "soi",
    titre: "Tu deviens l'histoire que tu te racontes",
    duree: "5 min",
    corps:
      "La recherche sur l'identité narrative montre que nous construisons un « moi » cohérent en reliant notre passé, notre présent et notre futur dans un récit. Ce récit n'est pas figé : réécrire les épisodes-clés — leur sens, leur place — modifie réellement le rapport à soi. Ton narratif est un matériau, pas une sentence.",
    source: "Dan P. McAdams, travaux sur la narrative identity (1993–)",
  },
  {
    id: "neuro-habitudes",
    type: "lecture",
    theme: "soi",
    titre: "Le changement passe par le contexte, pas la volonté",
    duree: "5 min",
    corps:
      "Une large part de nos actions quotidiennes est automatique, déclenchée par le contexte plus que par une décision consciente. Conséquence pratique : la transformation durable se joue moins dans l'effort de volonté que dans l'aménagement de l'environnement et la répétition — jusqu'à ce que le nouveau geste devienne le geste par défaut.",
    source: "Wendy Wood, « Good Habits, Bad Habits » (2019)",
  },
  {
    id: "neuro-mindset",
    type: "lecture",
    theme: "soi",
    titre: "Croire que ça peut bouger change tout",
    duree: "4 min",
    corps:
      "Le regard qu'on porte sur ses propres capacités — figées ou perfectibles — modifie la façon dont on affronte l'effort et l'échec. Voir une aptitude comme développable transforme un revers en information plutôt qu'en verdict. Le plafond n'est pas seulement réel : il est en partie une croyance qu'on peut interroger.",
    source: "Carol Dweck, « Mindset » (2006)",
  },

  // — Santé : souffle, sommeil, repos, apaisement émotionnel —
  {
    id: "coherence-cardiaque",
    type: "pratique",
    theme: "sante",
    titre: "La cohérence cardiaque",
    duree: "5 min",
    corps:
      "Respire à un rythme régulier — environ six respirations par minute, inspiration et expiration de même durée. Ce tempo synchronise le cœur et la respiration et fait basculer le système nerveux vers le calme. Cinq minutes suffisent pour sentir la vague retomber ; l'effet se prolonge plusieurs heures.",
    source: "David Servan-Schreiber, « Guérir » (2003)",
  },
  {
    id: "plus-petit-pas",
    type: "pratique",
    theme: "soi",
    titre: "Le plus petit pas possible",
    duree: "2 min",
    corps:
      "Prends ce que tu repousses et réduis-le à une action de deux minutes : pas « ranger ma vie », mais « ouvrir le document ». On ne change pas par la volonté mais en abaissant la marche jusqu'à ce qu'elle devienne évidente. Le petit pas fait, l'élan suit souvent tout seul.",
    source: "BJ Fogg, « Tiny Habits » (2019)",
  },
  {
    id: "main-sur-le-coeur",
    type: "pratique",
    theme: "sante",
    titre: "La main sur le cœur",
    duree: "2 min",
    corps:
      "Dans un moment dur, pose une main sur ton cœur et parle-toi comme à une amie qui traverse la même chose. Ce geste et ce ton activent le système d'apaisement plutôt que l'autocritique. Se traiter avec bienveillance n'est pas se complaire : c'est ce qui redonne la force d'agir.",
    source: "Kristin Neff, « Self-Compassion » (2011)",
  },
  {
    id: "marche-debloque",
    type: "pratique",
    theme: "corps",
    titre: "La marche qui débloque",
    duree: "10 min",
    corps:
      "Bloquée sur une question ? Lève-toi et marche, dehors si possible. Marcher augmente nettement la pensée divergente — celle qui fait surgir des idées neuves. Ce n'est pas une pause DANS la réflexion : c'est une façon de réfléchir autrement, avec le corps.",
    source: "Oppezzo & Schwartz, Stanford (2014)",
  },
  {
    id: "se-parler-amie",
    type: "reflexion",
    theme: "sante",
    titre: "Se parler à la troisième personne",
    duree: "3 min",
    corps:
      "Face à une émotion forte, décris-la en t'appelant par ton prénom : « [toi] ressent… parce que… ». Cette petite distance dans le langage calme la réactivité et éclaircit la pensée, comme si tu conseillais quelqu'un que tu aimes. On se donne rarement à soi la sagesse qu'on offre aux autres.",
    source: "Ethan Kross, « Chatter » (2021)",
  },
  {
    id: "oui-trop-vite",
    type: "reflexion",
    theme: "relationnel",
    titre: "À qui tu dis oui trop vite",
    duree: "3 min",
    corps:
      "Repère un « oui » récent que tu as regretté. Une limite claire n'est pas un rejet de l'autre : c'est ce qui rend la relation vivable dans la durée. Dire non à ce qui t'épuise, c'est dire oui à ce que tu peux vraiment donner.",
    source: "Henry Cloud & John Townsend, « Boundaries » (1992)",
  },
  {
    id: "comparaison-vole",
    type: "reflexion",
    theme: "style",
    titre: "Ce que la comparaison te vole",
    duree: "3 min",
    corps:
      "On s'évalue en se comparant — c'est automatique, surtout devant des vies mises en scène. Mais comparer ton intérieur au dehors des autres est un jeu truqué. Remplace « est-ce que je fais mieux que… » par « est-ce que je vais vers ce qui compte pour moi ? ».",
    source: "Leon Festinger, théorie de la comparaison sociale (1954)",
  },
  {
    id: "meilleure-version-demain",
    type: "reflexion",
    theme: "soi",
    titre: "Ta meilleure version, demain",
    duree: "4 min",
    corps:
      "Écris quelques lignes sur toi dans un futur où les choses ont bien tourné, où tu as tenu tes directions. Imaginer concrètement ce « meilleur soi possible » augmente l'optimisme et l'énergie d'agir — pas comme un rêve, mais comme un cap qu'on précise assez pour s'en approcher.",
    source: "Laura King, recherche sur le « best possible self » (2001)",
  },
  {
    id: "amour-securise",
    type: "lecture",
    theme: "relationnel",
    titre: "L'amour sécurise, il ne teste pas",
    duree: "4 min",
    corps:
      "Les liens amoureux fonctionnent comme un attachement : on a besoin de savoir que l'autre est là, joignable, fiable. Beaucoup de disputes ne parlent pas du sujet apparent mais d'une seule question — « est-ce que je compte pour toi ? ». Nommer ce besoin, plutôt que le déguiser en reproche, désamorce le conflit.",
    source: "Sue Johnson, « Hold Me Tight » (2008)",
  },
  {
    id: "petits-gestes-couple",
    type: "lecture",
    theme: "relationnel",
    titre: "Les petits gestes font les grands couples",
    duree: "4 min",
    corps:
      "Ce qui tient un couple n'est pas les grands moments, mais la façon de répondre aux minuscules appels du quotidien — un regard, une phrase, une attention. Les couples qui durent se tournent l'un vers l'autre dans ces micro-instants. L'amour se joue là, plus que dans les déclarations.",
    source: "John Gottman, « The Seven Principles for Making Marriage Work » (1999)",
  },
  {
    id: "sommeil-repare",
    type: "lecture",
    theme: "sante",
    titre: "Le sommeil répare ton identité",
    duree: "4 min",
    corps:
      "Le sommeil n'est pas du temps perdu : c'est là que le cerveau trie les émotions de la journée et consolide ce qu'on apprend. Manquer de sommeil, c'est réagir à fleur de peau et se sentir « moins soi ». Protéger tes nuits est l'un des gestes les plus profonds pour ton équilibre.",
    source: "Matthew Walker, « Why We Sleep » (2017)",
  },
  {
    id: "repos-pas-recompense",
    type: "lecture",
    theme: "sante",
    titre: "Le repos n'est pas une récompense",
    duree: "3 min",
    corps:
      "On attend souvent d'avoir « mérité » le repos pour se le permettre. Mais le repos n'est pas la prime de la performance : c'en est la condition. Il en existe plusieurs formes — physique, mentale, sensorielle, sociale — et on a rarement besoin de celle qu'on s'accorde par défaut.",
    source: "Saundra Dalton-Smith, « Sacred Rest » (2017)",
  },
  {
    id: "sens-plutot-bonheur",
    type: "lecture",
    theme: "soi",
    titre: "Chercher le sens, pas le bonheur",
    duree: "4 min",
    corps:
      "Viser directement le bonheur le fait fuir ; il arrive de surcroît, quand on est engagé dans quelque chose qui nous dépasse. Même dans l'épreuve, garder un « pourquoi » rend le « comment » tenable. Le sens ne se trouve pas une fois pour toutes : il se choisit, situation après situation.",
    source: "Viktor Frankl, « Découvrir un sens à sa vie » (1946)",
  },
  {
    id: "lien-qui-compte",
    type: "reflexion",
    theme: "relationnel",
    titre: "Le lien qui te manque",
    duree: "3 min",
    corps:
      "La plus longue étude sur une vie d'adulte tient en une phrase : ce sont la qualité de nos relations qui nous gardent en bonne santé et heureux, bien plus que l'argent ou la réussite. Demande-toi quel lien tu laisses se distendre — et envoie, aujourd'hui, un signe à cette personne.",
    source: "Robert Waldinger, étude de Harvard sur le développement adulte (2015)",
  },

  // — Parentalité : accompagner un enfant sans se perdre —
  {
    id: "connecter-avant-corriger",
    type: "reflexion",
    theme: "parentalite",
    titre: "Relier avant de corriger",
    duree: "3 min",
    corps:
      "Face à un enfant débordé, l'apaisement précède l'explication : on ne raisonne pas un cerveau en crise. Se relier d'abord — se mettre à sa hauteur, nommer ce qu'il ressent — avant de poser la limite. Le lien ouvre la porte que la leçon, seule, trouve fermée.",
    source: "Daniel Siegel & Tina Payne Bryson, « Le cerveau de votre enfant » (2011)",
  },
  {
    id: "parent-suffisamment-bon",
    type: "lecture",
    theme: "parentalite",
    titre: "Le parent « suffisamment bon »",
    duree: "4 min",
    corps:
      "Un enfant n'a pas besoin d'un parent parfait, mais d'un parent fiable qui répare ses ratés. Les micro-déceptions, réparées, lui apprennent justement que le lien résiste à l'imperfection. Viser la perfection épuise le parent et prive l'enfant de cet apprentissage essentiel.",
    source: "Donald Winnicott, « La mère suffisamment bonne » (1953)",
  },
  {
    id: "decrire-pas-juger-enfant",
    type: "pratique",
    theme: "parentalite",
    titre: "Décrire plutôt que juger",
    duree: "2 min",
    corps:
      "Au lieu de « bravo, tu es génial », décris ce que tu vois : « tu as rangé tes cubes tout seul ». L'enfant intègre alors un fait sur lui-même, pas un verdict à défendre. Même principe pour reprendre : décrire le problème — « je vois des manteaux par terre » — invite à agir mieux qu'un reproche.",
    source: "Adele Faber & Elaine Mazlish, « Parler pour que les enfants écoutent » (1980)",
  },
  {
    id: "accueillir-emotion-enfant",
    type: "lecture",
    theme: "parentalite",
    titre: "Consoler ne rend pas capricieux",
    duree: "4 min",
    corps:
      "On a longtemps cru qu'accueillir « trop » les pleurs rendait l'enfant tyrannique. Les neurosciences affectives montrent l'inverse : accueillir une émotion aide le cerveau immature à la réguler et à mûrir les circuits qui, plus tard, permettront de se calmer seul. La sécurité donnée tôt rend l'autonomie possible.",
    source: "Catherine Gueguen, « Pour une enfance heureuse » (2014)",
  },
  {
    id: "feliciter-effort-enfant",
    type: "pratique",
    theme: "parentalite",
    titre: "Féliciter l'effort, pas le don",
    duree: "2 min",
    corps:
      "Dire à un enfant « tu es intelligent » le rend prudent : il évite ensuite ce qui pourrait démentir l'étiquette. Féliciter la démarche — « tu as cherché plusieurs façons » — nourrit au contraire le goût de l'effort et la capacité à encaisser un échec. On renforce ce qu'on nomme.",
    source: "Mueller & Dweck, Columbia University (1998)",
  },
  {
    id: "rester-la-boussole",
    type: "reflexion",
    theme: "parentalite",
    titre: "Rester le point d'ancrage",
    duree: "3 min",
    corps:
      "Quand les pairs deviennent la référence principale, l'enfant perd sa boussole. Le lien d'attachement au parent n'est pas un acquis : il s'entretient par la présence et par l'invitation à exister tel qu'il est. Rester accueillant, même devant le rejet, garde la porte ouverte pour quand il en aura besoin.",
    source: "Gordon Neufeld & Gabor Maté, « Retrouver son rôle de parent » (2004)",
  },

  // — Corps : bouger, ressentir, habiter —
  {
    id: "corps-garde-score",
    type: "lecture",
    theme: "corps",
    titre: "Le corps retient ce que la tête oublie",
    duree: "5 min",
    corps:
      "Les émotions fortes ne restent pas que dans les pensées : elles s'inscrivent dans le corps — tensions, souffle court, gorge serrée. Prendre soin de soi passe donc aussi par le corps : bouger, respirer, être touché avec sécurité. On ne raisonne pas toujours une détresse ; parfois, il faut la laisser se décharger par le corps.",
    source: "Bessel van der Kolk, « Le corps n'oublie rien » (2014)",
  },
  {
    id: "relacher-par-etages",
    type: "pratique",
    theme: "corps",
    titre: "Relâcher, muscle par muscle",
    duree: "5 min",
    corps:
      "Contracte un groupe de muscles cinq secondes — poings, épaules, visage — puis relâche d'un coup, et observe la différence. Parcourir le corps ainsi apprend à reconnaître la tension pour mieux la dénouer. Le relâchement n'est pas l'absence d'effort : c'est une compétence qui s'exerce.",
    source: "Edmund Jacobson, relaxation musculaire progressive (1938)",
  },
  {
    id: "bouger-humeur",
    type: "lecture",
    theme: "corps",
    titre: "Bouger change l'humeur avant la silhouette",
    duree: "4 min",
    corps:
      "L'activité physique agit comme un régulateur d'humeur immédiat : elle libère les facteurs qui apaisent l'anxiété et nourrissent la concentration, bien avant tout effet esthétique. Certains jours, vingt minutes de marche vive valent mieux qu'une heure à ruminer.",
    source: "John Ratey, « Spark » (2008)",
  },
  {
    id: "souffle-nerf-vague",
    type: "pratique",
    theme: "corps",
    titre: "Le double soupir qui calme",
    duree: "2 min",
    corps:
      "Inspire par le nez, ajoute une petite inspiration par-dessus, puis expire longuement par la bouche. Ce « double soupir » stimule le nerf vague et fait retomber l'alerte en quelques cycles. Le corps possède un frein intégré — ce geste l'actionne.",
    source: "Stephen Porges, théorie polyvagale (2011)",
  },

  // — Style & présence : image de soi et art de vivre —
  {
    id: "congruence-rogers",
    type: "lecture",
    theme: "style",
    titre: "Être soi, ça se voit",
    duree: "4 min",
    corps:
      "La congruence, c'est l'accord entre ce que tu ressens, ce que tu montres et ce que tu dis. Les autres la perçoivent sans pouvoir la nommer : une présence « vraie » met en confiance, une façade fatigue. Se présenter au monde aligné sur soi n'est pas un style — c'est une cohérence qui, elle, en devient un.",
    source: "Carl Rogers, « Le développement de la personne » (1961)",
  },
  {
    id: "tenue-qui-change",
    type: "lecture",
    theme: "style",
    titre: "Ce que tu portes te change",
    duree: "3 min",
    corps:
      "Les vêtements n'agissent pas que sur le regard des autres : ils modifient ta propre posture mentale. Endosser une tenue associée à un rôle améliore mesurablement l'attention et l'assurance — c'est la « cognition vestimentaire ». S'habiller devient alors un levier, pas une simple surface.",
    source: "Adam & Galinsky, « Enclothed Cognition » (2012)",
  },
  {
    id: "presence-posture",
    type: "pratique",
    theme: "style",
    titre: "Prendre sa place, deux minutes",
    duree: "2 min",
    corps:
      "Avant un moment qui compte, tiens-toi deux minutes en position ouverte : dos droit, épaules déployées, pieds ancrés. Occuper l'espace avec son corps aide à se sentir plus présent et moins sur la défensive. La présence ne se décrète pas dans la tête — elle s'installe d'abord dans la posture.",
    source: "Amy Cuddy, « Présence » (2015)",
  },
  {
    id: "garder-ce-qui-compte",
    type: "pratique",
    theme: "style",
    titre: "Ne garder que ce qui te parle",
    duree: "5 min",
    corps:
      "Prends une catégorie d'objets et tiens chaque chose en main : te met-elle en joie, ou la gardes-tu par habitude ou culpabilité ? Ne conserver que ce qui résonne allège l'espace et clarifie le regard — ton environnement finit par ressembler à qui tu veux être.",
    source: "Marie Kondo, « La magie du rangement » (2011)",
  },
  {
    id: "art-simplicite",
    type: "reflexion",
    theme: "style",
    titre: "L'élégance du peu",
    duree: "3 min",
    corps:
      "L'art de vivre ne tient pas à l'accumulation mais au choix : moins d'objets, mais justes ; moins d'engagements, mais tenus. Épurer son cadre et son emploi du temps n'est pas se priver — c'est faire de la place à ce qui a du goût. Le raffinement commence où s'arrête le superflu.",
    source: "Dominique Loreau, « L'art de la simplicité » (2005)",
  },
  {
    id: "presentation-de-soi",
    type: "lecture",
    theme: "style",
    titre: "Tu joues un rôle — autant le choisir",
    duree: "4 min",
    corps:
      "En société, nous nous présentons toujours un peu en scène : nous ajustons notre image selon le public. Loin d'être de l'hypocrisie, c'est le fonctionnement normal du lien social. En avoir conscience permet de choisir ce qu'on met en avant, au lieu de le subir.",
    source: "Erving Goffman, « La mise en scène de la vie quotidienne » (1959)",
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

// Métadonnées des thèmes de vie — l'ordre et le texte d'accroche de la
// bibliothèque. Les icônes (JSX) vivent dans la page, par clé.
export interface ThemeMeta {
  key: RessourceTheme;
  label: string;
  intro: string;
}

export const THEME_META: ThemeMeta[] = [
  {
    key: "relationnel",
    label: "Relationnel",
    intro:
      "Les liens, le couple, les limites : ce qui se joue entre toi et les autres, et comment le rendre vivable dans la durée.",
  },
  {
    key: "parentalite",
    label: "Parentalité",
    intro:
      "Accompagner un enfant sans se perdre — présence, limites justes, réparation. Des appuis, pas des recettes de perfection.",
  },
  {
    key: "sante",
    label: "Santé",
    intro:
      "Le souffle, le sommeil, le repos, l'apaisement : les gestes simples qui tiennent ton équilibre debout.",
  },
  {
    key: "corps",
    label: "Corps",
    intro:
      "Bouger, ressentir, habiter ton corps — il pense et se souvient avec toi, bien avant les mots.",
  },
  {
    key: "style",
    label: "Style & présence",
    intro:
      "Comment tu te présentes au monde et composes ton quotidien : image de soi, congruence, art de vivre.",
  },
  {
    key: "soi",
    label: "Soi & esprit",
    intro:
      "Identité, récit, changement : ce que la recherche dit de qui tu deviens — et de ta liberté d'y travailler.",
  },
];

export const THEME_LABEL: Record<RessourceTheme, string> = THEME_META.reduce(
  (acc, t) => ((acc[t.key] = t.label), acc),
  {} as Record<RessourceTheme, string>
);
