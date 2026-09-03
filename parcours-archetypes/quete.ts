// parcours-archetypes/quete.ts
// La Quête — pour chaque archétype, CE DONT IL DOIT SE DÉBARRASSER pour atteindre
// sa performance optimale. Un « lest » (ce qui le plombe, tiré de son ombre) et
// trois exercices gamifiés :
//   1. LE DÉLESTAGE — relâcher, un à un, cinq poids ;
//   2. LE CARREFOUR — choisir la réponse qui fait grandir, dans une situation ;
//   3. LE PACTE     — s'engager sur un geste concret.
// Contenu déterministe et typé. Premier jet, à réécrire.

import { ArchetypeKey } from "./types";

export interface Carrefour {
  situation: string;
  choix: { texte: string; bon: boolean; retour: string }[];
}

export interface Quete {
  lest: string; // ce dont il faut se débarrasser, en une formule
  pourquoi: string; // pourquoi ça bride la performance
  poids: string[]; // cinq poids à relâcher (exercice 1)
  carrefour: Carrefour; // exercice 2
  geste: string; // exercice 3 : le pacte
}

// Partial : contenu Quête hérité, remappé sur les signatures proches (12/20).
// Les signatures sans Quête dédiée dégradent proprement (voir /quete).
export const QUETES: Partial<Record<ArchetypeKey, Quete>> = {
  visionnaire: {
    lest: "la dispersion",
    pourquoi:
      "Tu cours toujours vers la nouveauté suivante. Résultat : rien n'a le temps de mûrir, et ton énergie se dilue au lieu de porter.",
    poids: [
      "commencer une chose de plus avant d'avoir fini la précédente",
      "confondre mouvement et progrès",
      "fuir dès que ça devient familier",
      "collectionner les débuts",
      "croire que l'ailleurs vaut mieux que l'ici",
    ],
    carrefour: {
      situation:
        "Un projet t'ennuie soudain, pile au moment où il devient exigeant. Une idée neuve, plus séduisante, t'appelle.",
      choix: [
        { texte: "Je saute sur l'idée neuve", bon: false, retour: "L'excitation revient — et le projet reste inachevé, comme les autres." },
        { texte: "Je reste, et je cherche la profondeur ici", bon: true, retour: "C'est là que l'exploration devient transformation. Tu tiens." },
        { texte: "Je mène les deux de front", bon: false, retour: "Tu te disperses un peu plus. L'énergie se dilue." },
      ],
    },
    geste: "Aujourd'hui, finis une seule chose que tu avais laissée en suspens.",
  },
  sage: {
    lest: "le sur-contrôle par la pensée",
    pourquoi:
      "Tu veux tout comprendre avant d'agir. Mais à trop analyser, tu restes au bord de ta vie au lieu d'y entrer.",
    poids: [
      "vouloir tout comprendre avant d'oser",
      "remplacer l'émotion par le raisonnement",
      "avoir raison plutôt que rencontrer",
      "reporter la décision faute de certitude",
      "observer ta vie plutôt que la traverser",
    ],
    carrefour: {
      situation:
        "Tu ressens quelque chose de fort mais confus. Ta tête réclame de l'analyser avant d'en parler.",
      choix: [
        { texte: "J'attends d'y voir clair pour en parler", bon: false, retour: "Le moment passe, l'émotion se refroidit, et le lien avec l'autre aussi." },
        { texte: "Je le dis, même maladroitement", bon: true, retour: "La compréhension viendra APRÈS l'expérience. Tu as osé traverser." },
        { texte: "Je l'écris pour moi seul", bon: false, retour: "Utile, mais tu restes en retrait de la rencontre." },
      ],
    },
    geste: "Aujourd'hui, prends une décision sans être sûr — et observe ce qui arrive.",
  },
  creatrice: {
    lest: "le perfectionnisme",
    pourquoi:
      "La peur d'être jugé fait de chaque création un test sur ta valeur. Alors tu peaufines en secret ce que personne ne verra.",
    poids: [
      "attendre que ce soit parfait pour montrer",
      "confondre ta valeur et ton œuvre",
      "recommencer au lieu de finir",
      "ne créer que pour être validé",
      "garder tes idées à l'abri du réel",
    ],
    carrefour: {
      situation:
        "Ton travail est à 80 %. Il pourrait sortir. Une voix te dit qu'il n'est « pas encore prêt ».",
      choix: [
        { texte: "Je peaufine encore, en secret", bon: false, retour: "Le 80 % ne verra jamais le jour. Le perfectionnisme a gagné." },
        { texte: "Je le montre tel quel", bon: true, retour: "Une œuvre partagée imparfaite vaut mille chefs-d'œuvre cachés." },
        { texte: "Je demande dix avis d'abord", bon: false, retour: "Tu dilues ta voix et diffères encore le passage à l'acte." },
      ],
    },
    geste: "Aujourd'hui, montre une chose inachevée à une personne.",
  },
  rebelle: {
    lest: "le réflexe de t'opposer",
    pourquoi:
      "Te définir contre quelque chose te rend prisonnier de ce que tu combats. Ta liberté n'est plus un choix, juste une réaction.",
    poids: [
      "dire non par principe, pas par conviction",
      "avoir besoin d'un adversaire pour exister",
      "confondre liberté et opposition",
      "rejeter une bonne idée parce qu'elle vient d'en haut",
      "te braquer avant d'avoir écouté",
    ],
    carrefour: {
      situation:
        "Ton responsable propose une méthode qui, au fond, est bonne. Mais elle vient de lui.",
      choix: [
        { texte: "Je la refuse par principe", bon: false, retour: "Tu perds une bonne idée juste pour ne pas obéir. C'est lui qui te dirige encore." },
        { texte: "Je l'adopte, et je la fais mienne", bon: true, retour: "La vraie liberté, c'est choisir — même quand ça vient d'un autre." },
        { texte: "Je la sabote discrètement", bon: false, retour: "Ton énergie sert à détruire, pas à construire ce que tu veux." },
      ],
    },
    geste: "Aujourd'hui, dis oui à une bonne idée qui ne vient pas de toi.",
  },
  protectrice: {
    lest: "la sur-responsabilité",
    pourquoi:
      "Tu portes tout le monde, jusqu'à disparaître sous la charge. À force de protéger les autres, tu t'oublies.",
    poids: [
      "porter des fardeaux qui ne sont pas les tiens",
      "te sentir coupable de te reposer",
      "anticiper les besoins de tous, sauf les tiens",
      "confondre aimer et sauver",
      "dire oui quand ton corps dit non",
    ],
    carrefour: {
      situation:
        "Un proche traverse une difficulté qu'il peut gérer seul. Tu es épuisé, mais l'envie de tout régler pour lui te démange.",
      choix: [
        { texte: "Je prends tout en charge", bon: false, retour: "Tu t'épuises et tu le prives de sa propre force. Personne ne grandit." },
        { texte: "Je le soutiens sans faire à sa place", bon: true, retour: "Protéger, ce n'est pas porter. Tu tiens ta place, et la sienne." },
        { texte: "Je m'efface complètement", bon: false, retour: "L'excès inverse : la fuite. L'équilibre est entre les deux." },
      ],
    },
    geste: "Aujourd'hui, laisse quelqu'un se débrouiller — et occupe-toi de toi.",
  },
  amante: {
    lest: "le besoin d'approbation",
    pourquoi:
      "À vouloir plaire à tout prix, tu te fonds dans l'autre. Ton élan vers le lien se transforme en peur de déplaire.",
    poids: [
      "te modeler sur ce que l'autre attend",
      "taire ton avis pour garder la paix",
      "mesurer ta valeur à l'amour reçu",
      "avoir peur du vide plus que du mauvais lien",
      "confondre fusion et intimité",
    ],
    carrefour: {
      situation:
        "Ton groupe d'amis choisit une soirée qui ne te tente pas du tout. Tu sens l'envie de suivre pour ne pas décevoir.",
      choix: [
        { texte: "Je suis, pour ne pas gâcher l'ambiance", bon: false, retour: "Tu disparais un peu plus. L'approbation coûte cher." },
        { texte: "Je dis ce que je préfère, calmement", bon: true, retour: "Le vrai lien supporte ta différence. Tu existes dedans." },
        { texte: "J'annule sans explication", bon: false, retour: "L'évitement, autre face de la peur. Nommer vaut mieux que fuir." },
      ],
    },
    geste: "Aujourd'hui, exprime une préférence qui te distingue du groupe.",
  },
  batisseuse: {
    lest: "la rigidité",
    pourquoi:
      "Tu bâtis des certitudes pour te rassurer face à l'imprévu. Mais ce qui devait te stabiliser finit par t'enfermer.",
    poids: [
      "vouloir tout contrôler pour te rassurer",
      "confondre solidité et immobilité",
      "défendre le plan contre la réalité",
      "voir le changement comme une menace",
      "construire des murs et les appeler des fondations",
    ],
    carrefour: {
      situation:
        "En cours de projet, un imprévu rend ton plan initial obsolète. Une meilleure voie apparaît, mais elle bouscule tout.",
      choix: [
        { texte: "Je m'accroche au plan d'origine", bon: false, retour: "Tu bâtis solide… sur un terrain qui a bougé. La rigidité coûte." },
        { texte: "J'adapte la structure à la réalité", bon: true, retour: "Une fondation vivante tient mieux qu'un mur figé. Tu construis vraiment." },
        { texte: "Je jette tout et j'improvise", bon: false, retour: "L'excès inverse. Garde ce qui tient, change ce qui doit." },
      ],
    },
    geste: "Aujourd'hui, change une seule habitude que tu défendais comme une règle.",
  },
  altruiste: {
    lest: "l'oubli de toi",
    pourquoi:
      "Tu prends soin de tout le monde, sauf de toi. Soigner les autres devient une façon d'éviter tes propres blessures.",
    poids: [
      "passer toujours en dernier",
      "soigner les autres pour éviter tes plaies",
      "te sentir égoïste dès que tu prends soin de toi",
      "absorber les émotions de tous",
      "confondre te vider et te donner",
    ],
    carrefour: {
      situation:
        "Tu es à bout, et une personne te demande encore de l'aide. Ton premier réflexe est de dire oui.",
      choix: [
        { texte: "Je dis oui, comme toujours", bon: false, retour: "Le puits se vide. On ne verse pas d'un verre déjà vide." },
        { texte: "Je réponds : pas maintenant, je me recharge", bon: true, retour: "Prendre soin de toi n'est pas un abandon des autres. C'est la source." },
        { texte: "Je coupe tout contact", bon: false, retour: "L'épuisement pousse à l'excès. La juste distance, pas la rupture." },
      ],
    },
    geste: "Aujourd'hui, offre-toi le soin que tu donnerais à quelqu'un d'autre.",
  },
  libre: {
    lest: "l'évitement par la légèreté",
    pourquoi:
      "L'humour et le jeu te servent à esquiver ce qui compte. Ta légèreté, si précieuse, devient parfois une fuite.",
    poids: [
      "désamorcer par l'humour ce qui te touche",
      "fuir l'engagement pour rester libre",
      "confondre insouciance et évitement",
      "ne jamais laisser voir ce qui est grave",
      "changer de sujet dès que ça devient sérieux",
    ],
    carrefour: {
      situation:
        "Une conversation devient soudain sérieuse et sincère. Une vanne toute prête te chatouille les lèvres.",
      choix: [
        { texte: "Je lance la vanne, on rigole", bon: false, retour: "Le moment de vérité s'échappe. La légèreté a servi de fuite." },
        { texte: "Je reste sérieux, et je réponds vrai", bon: true, retour: "Ton jeu vaut plus quand tu sais aussi être là pour de vrai." },
        { texte: "Je me tais et je m'éclipse", bon: false, retour: "Autre forme d'évitement. Rester demande plus de courage." },
      ],
    },
    geste: "Aujourd'hui, tiens une conversation sérieuse jusqu'au bout, sans blague.",
  },
  passeuse: {
    lest: "l'effacement de toi",
    pourquoi:
      "Tu relies, tu transmets, tu mets les autres en lumière — jusqu'à t'effacer. Ton rôle finit par t'empêcher d'exister.",
    poids: [
      "briller à travers les autres, jamais pour toi",
      "donner le crédit, garder l'effort",
      "te rendre indispensable pour te sentir légitime",
      "servir le projet des autres avant le tien",
      "confondre transmettre et disparaître",
    ],
    carrefour: {
      situation:
        "Un projet que tu as porté en coulisses est salué. On oublie de te citer. Tu peux le rappeler, ou laisser filer.",
      choix: [
        { texte: "Je laisse filer, ça n'est pas grave", bon: false, retour: "Tu t'effaces encore. Passer, ce n'est pas s'annuler." },
        { texte: "Je nomme ma part, simplement", bon: true, retour: "Exister ne trahit pas ta générosité. Ça la rend visible." },
        { texte: "Je m'en veux d'y penser", bon: false, retour: "La culpabilité te remet en retrait. Ta place est légitime." },
      ],
    },
    geste: "Aujourd'hui, revendique une chose que tu as faite, sans la minimiser.",
  },
  artiste: {
    lest: "rester dans le rêve",
    pourquoi:
      "Un rêve reste parfait tant qu'il n'est pas réalisé. À force d'idéaliser, tu n'incarnes rien, et le réel te déçoit toujours.",
    poids: [
      "préférer l'idée à sa réalisation",
      "attendre le moment parfait pour te lancer",
      "idéaliser jusqu'à ne jamais commencer",
      "fuir le réel parce qu'il abîme le rêve",
      "confondre imaginer et faire",
    ],
    carrefour: {
      situation:
        "Tu as un rêve précis depuis des mois. Un premier pas minuscule et concret est possible aujourd'hui — imparfait, modeste.",
      choix: [
        { texte: "J'attends d'avoir la vision complète", bon: false, retour: "Le rêve reste intact… et irréel. Rien ne s'incarne." },
        { texte: "Je fais le petit pas imparfait", bon: true, retour: "Un rêve touché du doigt vaut mieux que mille rêves parfaits. Tu incarnes." },
        { texte: "Je change de rêve, plus beau", bon: false, retour: "La fuite en avant de l'idéal. Reviens au geste minuscule." },
      ],
    },
    geste: "Aujourd'hui, fais le plus petit pas réel vers un rêve.",
  },
  presence: {
    lest: "la peur de te fixer",
    pourquoi:
      "Rester insaisissable te met à l'abri de l'engagement. Mais tu ne restes jamais assez longtemps pour devenir vraiment toi.",
    poids: [
      "fuir dès qu'une identité se dessine",
      "confondre liberté et absence d'ancrage",
      "changer pour ne pas être saisi",
      "craindre l'engagement plus que l'ennui",
      "ne jamais rester assez pour récolter",
    ],
    carrefour: {
      situation:
        "Une voie te réussit et commence à te définir. Une part de toi veut déjà tout changer pour rester libre.",
      choix: [
        { texte: "Je change avant qu'on me fixe", bon: false, retour: "Tu restes libre… et jamais tu ne récoltes. La métamorphose devient fuite." },
        { texte: "Je reste, et je m'y déploie", bon: true, retour: "On peut se transformer SANS fuir. C'est là que tu deviens vraiment toi." },
        { texte: "Je me fige pour prouver que je peux", bon: false, retour: "L'excès inverse. Ni fuite, ni raideur : la présence." },
      ],
    },
    geste: "Aujourd'hui, engage-toi sur une chose pour les trente prochains jours.",
  },
  stratege: {
    lest: "le sur-contrôle",
    pourquoi:
      "Tu calcules tout pour ne rien laisser au hasard. Mais à trop vouloir maîtriser, tu te coupes de ce que seuls l'imprévu — et le ressenti — pouvaient t'apprendre.",
    poids: [
      "tout planifier avant d'oser bouger",
      "tenir les autres à distance pour garder la main",
      "confondre gagner et relier",
      "refuser de montrer une faille",
      "remplacer le ressenti par le calcul",
    ],
    carrefour: {
      situation:
        "Une décision importante se joue. Les données ne tranchent pas — il reste une part d'intuition, et une conversation franche à avoir.",
      choix: [
        { texte: "J'attends d'avoir toutes les données", bon: false, retour: "La certitude ne viendra pas, et le moment stratégique passe. Le contrôle t'immobilise." },
        { texte: "Je décide avec ce que j'ai, et je parle vrai", bon: true, retour: "La meilleure stratégie intègre l'humain et l'incertain. Tu avances." },
        { texte: "Je garde mon plan et je l'impose", bon: false, retour: "Tu gagnes le point, tu perds l'adhésion. Le calcul seul coûte cher." },
      ],
    },
    geste: "Aujourd'hui, tranche à l'intuition sur un sujet, et dis à quelqu'un ce que tu ressens vraiment.",
  },
  mere: {
    lest: "l'oubli de toi",
    pourquoi:
      "Tu captes les besoins de tous avant les tiens. À force d'abriter, tu t'effaces — et tu attends en silence une reconnaissance qui ne vient pas.",
    poids: [
      "faire passer tes besoins après ceux de tous",
      "étouffer l'autre sous le « pour ton bien »",
      "attendre en silence qu'on te reconnaisse",
      "te sentir coupable de recevoir",
      "confondre aimer et te sacrifier",
    ],
    carrefour: {
      situation:
        "Ton entourage compte sur toi, comme toujours. Tu es fatiguée, et une envie à toi — un moment rien que pour toi — passe au second plan.",
      choix: [
        { texte: "Je m'oublie encore, ils ont besoin de moi", bon: false, retour: "Le don sans retour t'épuise, et prive l'autre de grandir seul." },
        { texte: "Je pose mon besoin, sans culpabilité", bon: true, retour: "Prendre soin de toi n'abandonne personne : ça remplit la source." },
        { texte: "Je m'efface et je le vis mal", bon: false, retour: "Le sacrifice silencieux nourrit la rancœur. Nomme, plutôt que d'attendre." },
      ],
    },
    geste: "Aujourd'hui, demande — ou offre-toi — ce que tu donnes si facilement aux autres.",
  },
  multiple: {
    lest: "la peur de choisir",
    pourquoi:
      "Tu contiens plusieurs mondes, mais la peur de trancher te les fait tous garder ouverts. Résultat : tu te vis comme « trop » ou « jamais assez », dispersée au lieu d'être plurielle.",
    poids: [
      "tout garder ouvert pour ne rien perdre",
      "te croire imposteur dans chacun de tes mondes",
      "confondre choisir et te mutiler",
      "changer de registre pour fuir l'engagement",
      "te juger « trop » ou « pas assez »",
    ],
    carrefour: {
      situation:
        "Plusieurs voies te tentent, toutes légitimes. Il faudrait en engager une vraiment — mais choisir, c'est renoncer aux autres, pour un temps.",
      choix: [
        { texte: "Je les garde toutes ouvertes", bon: false, retour: "Tout reste possible… et rien ne prend corps. La dispersion gagne." },
        { texte: "J'en engage une, sans renier les autres", bon: true, retour: "Choisir n'est pas t'amputer : c'est donner un sol à ta pluralité." },
        { texte: "J'attends de savoir laquelle est LA bonne", bon: false, retour: "La bonne se révèle en la vivant, pas avant. Tu diffères encore." },
      ],
    },
    geste: "Aujourd'hui, engage-toi pleinement sur une seule de tes voies, le temps d'une journée.",
  },
  gardienne: {
    lest: "la peur du changement",
    pourquoi:
      "Tu veilles sur ce qui compte, mais tu confonds parfois protéger l'essentiel et figer la forme. Ce que tu gardes finit par t'empêcher d'accueillir ce qui vient.",
    poids: [
      "défendre la forme en croyant sauver le fond",
      "juger le neuf au nom du « bien »",
      "confondre fidélité et immobilité",
      "voir toute évolution comme une perte",
      "garder par peur, plus par amour",
    ],
    carrefour: {
      situation:
        "Un proche, ou une équipe, veut faire évoluer une manière de faire à laquelle tu tiens. Le fond resterait, mais la forme, elle, changerait.",
      choix: [
        { texte: "Je défends la tradition telle quelle", bon: false, retour: "Tu sauves la forme et tu perds le vivant. Le fond, lui, aurait survécu au changement." },
        { texte: "Je garde l'essentiel et je laisse la forme bouger", bon: true, retour: "Transmettre, c'est faire passer le feu, pas garder les cendres. Tu veilles vraiment." },
        { texte: "Je cède tout pour avoir la paix", bon: false, retour: "L'excès inverse : tu lâches ce qui comptait. Discerne le fond de la forme." },
      ],
    },
    geste: "Aujourd'hui, laisse évoluer une habitude à laquelle tu tiens — en n'en gardant que le sens.",
  },
  activiste: {
    lest: "la fusion avec la cause",
    pourquoi:
      "Tu transformes l'indignation en action, jusqu'à ne plus faire qu'un avec le combat. À t'y fondre entièrement, tu t'épuises, et tu perds la personne derrière la cause : toi.",
    poids: [
      "mesurer ta valeur à ton combat",
      "culpabiliser dès que tu te reposes",
      "confondre ton identité et la cause",
      "te radicaliser pour ne pas « trahir »",
      "brûler ton énergie sans jamais la recharger",
    ],
    carrefour: {
      situation:
        "La cause réclame encore, toujours. Tu es à bout. Une pause t'aiderait, mais l'urgence te souffle que t'arrêter serait abandonner.",
      choix: [
        { texte: "Je continue, m'arrêter c'est trahir", bon: false, retour: "Le militant épuisé ne sert plus la cause : il s'y consume. Rien ne tient." },
        { texte: "Je me recharge pour tenir dans la durée", bon: true, retour: "On sert mieux le juste sur cent jours que sur un feu de paille. Tu tiens." },
        { texte: "Je claque la porte, écœurée", bon: false, retour: "L'épuisement pousse à tout quitter. La juste distance, pas la rupture." },
      ],
    },
    geste: "Aujourd'hui, fais une chose pour toi seule, sans aucun rapport avec une cause.",
  },
  mediatrice: {
    lest: "l'évitement du conflit",
    pourquoi:
      "Tu cherches l'accord juste, mais tu fuis parfois le conflit qui, lui, était nécessaire. À vouloir contenter tout le monde, ta voix se dilue jusqu'à la tiédeur.",
    poids: [
      "lisser un désaccord qui devait avoir lieu",
      "te diluer dans l'avis de chacun",
      "confondre paix et absence de tension",
      "taire ta position pour rester « neutre »",
      "apaiser pour être aimée, plus pour être juste",
    ],
    carrefour: {
      situation:
        "Deux camps s'opposent, et tu vois clair : l'un a tort sur le fond. Le nommer romprait l'harmonie de façade.",
      choix: [
        { texte: "Je renvoie tout le monde dos à dos", bon: false, retour: "La fausse neutralité protège l'injuste. L'harmonie de façade ne tient pas." },
        { texte: "Je nomme ce que je vois, avec tact", bon: true, retour: "La vraie médiation dit le vrai, elle ne l'endort pas. Tu relies pour de bon." },
        { texte: "Je change de sujet pour apaiser", bon: false, retour: "Le conflit évité revient plus tard, plus dur. Traverse-le." },
      ],
    },
    geste: "Aujourd'hui, exprime clairement ta position dans un désaccord, au lieu de chercher le milieu.",
  },
  sorciere: {
    lest: "te tenir à part",
    pourquoi:
      "Tu sens ce qui se joue sous la surface, mais tu te vis en marge. À force de cacher ton pouvoir, tu ne l'assumes jamais au grand jour, et il tourne en rond.",
    poids: [
      "te croire trop différente pour être comprise",
      "cacher ce que tu perçois",
      "jouer d'un pouvoir que tu n'assumes pas",
      "te marginaliser avant qu'on t'écarte",
      "confondre singularité et isolement",
    ],
    carrefour: {
      situation:
        "Tu perçois nettement quelque chose que personne ne dit — une tension, un non-dit. Le partager, c'est te dévoiler, et risquer de passer pour « trop ».",
      choix: [
        { texte: "Je garde ça pour moi, on ne comprendrait pas", bon: false, retour: "Ton intuition reste stérile dans l'ombre. À part, tu ne transformes rien." },
        { texte: "Je le nomme, simplement, au grand jour", bon: true, retour: "Assumé, ton regard devient un don pour le groupe, plus un secret. Tu transmutes." },
        { texte: "Je le distille en sous-entendus", bon: false, retour: "Le pouvoir joué en coulisse se retourne. Assume-le en pleine lumière." },
      ],
    },
    geste: "Aujourd'hui, partage ouvertement une intuition que tu aurais d'ordinaire gardée pour toi.",
  },
  souveraine: {
    lest: "la solitude du sommet",
    pourquoi:
      "Tu assumes l'autorité sans t'en excuser, mais tu portes tout seule, sans déléguer ni te montrer faillible. L'orgueil te tient droite — et t'isole au sommet.",
    poids: [
      "tout porter pour ne dépendre de personne",
      "confondre autorité et invulnérabilité",
      "refuser de déléguer par peur du relâchement",
      "taire tes doutes pour tenir ton rang",
      "confondre régner et être seule",
    ],
    carrefour: {
      situation:
        "Une charge te dépasse. Déléguer une partie, ou avouer que tu doutes, allègerait tout — mais entamerait l'image de celle qui maîtrise.",
      choix: [
        { texte: "Je porte tout, seule, comme d'habitude", bon: false, retour: "Le sommet devient une prison. Tu tiens le rang et tu t'épuises." },
        { texte: "Je délègue, et je dis mon doute", bon: true, retour: "L'autorité vraie sait s'appuyer. Ta vulnérabilité assumée renforce ton cap." },
        { texte: "J'impose plus fort pour masquer", bon: false, retour: "L'orgueil redouble la solitude. Régner n'est pas être seule." },
      ],
    },
    geste: "Aujourd'hui, délègue une chose qui compte, ou avoue un doute à quelqu'un.",
  },
};

export const queteDe = (k: ArchetypeKey): Quete | undefined => QUETES[k];

// Le Futur Moi — là où l'on atterrit au bout de la quête. La meilleure version,
// multipotentielle, une fois le lest posé, ET le pourquoi. Adossé à la force de
// l'archétype et à la recherche sur la multipotentialité (voir /ressources).
export interface FuturMoi {
  nom: string; // le nom de cette version haute de toi
  pourquoi: string; // pourquoi tu atteins ton meilleur, le lest posé
  multipotentiel: string; // comment ta multipotentialité devient une force
}

export const FUTURS_MOI: Partial<Record<ArchetypeKey, FuturMoi>> = {
  visionnaire: {
    nom: "Celle qui traverse et relie",
    pourquoi:
      "La dispersion posée, ta curiosité cesse de fuir : elle creuse. Chaque exploration devient une racine, plus une escale.",
    multipotentiel:
      "Tes mille intérêts ne te tiraillent plus, ils se relient — tu deviens celle qui parle la langue de plusieurs mondes à la fois.",
  },
  sage: {
    nom: "Le Sage incarné",
    pourquoi:
      "Sans le sur-contrôle, ta lucidité descend dans l'action : tu comprends en vivant, plus avant de vivre.",
    multipotentiel:
      "Relier les savoirs devient ta signature — tu vois les ponts que les spécialistes ne voient pas.",
  },
  creatrice: {
    nom: "Le Créateur qui livre",
    pourquoi:
      "Le perfectionnisme lâché, tes œuvres sortent et rencontrent le monde. Tu crées pour donner, plus pour être validé.",
    multipotentiel:
      "Tes formes multiples cessent de se concurrencer : elles nourrissent une seule voix, reconnaissable entre toutes.",
  },
  rebelle: {
    nom: "Le Rebelle qui bâtit",
    pourquoi:
      "Le réflexe d'opposition posé, ta liberté devient un choix, plus une réaction. Tu construis ce que tu veux, au lieu de combattre ce que tu refuses.",
    multipotentiel:
      "Ton refus des cases devient une force : tu inventes des voies que personne n'avait tracées.",
  },
  protectrice: {
    nom: "Le Protecteur qui tient sa place",
    pourquoi:
      "La sur-responsabilité posée, tu protèges sans porter. Ta force soutient, elle n'écrase plus — toi compris.",
    multipotentiel:
      "Tu deviens le pilier qui relie les gens ET les domaines, sans t'y dissoudre.",
  },
  amante: {
    nom: "Celui qui aime sans se perdre",
    pourquoi:
      "Le besoin d'approbation posé, tu entres en lien entier — présent, pas dilué. On t'aime pour ce que tu es, pas pour ce que tu plies.",
    multipotentiel:
      "Ta sensibilité aux autres, alliée à tes multiples facettes, fait de toi un tisseur de liens rare.",
  },
  batisseuse: {
    nom: "Le Bâtisseur vivant",
    pourquoi:
      "La rigidité posée, tes fondations respirent. Tu construis solide ET souple — ça tient parce que ça s'adapte.",
    multipotentiel:
      "Tu deviens celui qui structure le foisonnement : donner forme à mille idées sans les figer.",
  },
  altruiste: {
    nom: "Le Guérisseur qui se soigne aussi",
    pourquoi:
      "L'oubli de toi posé, ta source se remplit. Tu soignes depuis l'abondance, plus depuis le manque.",
    multipotentiel:
      "Ta capacité à sentir les êtres, croisée à tes savoirs multiples, fait de toi un soin qui n'existe nulle part ailleurs.",
  },
  libre: {
    nom: "Le Joueur présent",
    pourquoi:
      "L'évitement posé, ta légèreté devient un cadeau, plus une fuite. Tu joues ET tu es là quand ça compte.",
    multipotentiel:
      "Ton goût du jeu relie tes domaines par l'expérimentation : tu transformes le sérieux en terrain d'essai.",
  },
  passeuse: {
    nom: "Le Passeur qui existe",
    pourquoi:
      "L'effacement posé, tu transmets en étant vu. Ta lumière éclaire les autres sans t'éteindre.",
    multipotentiel:
      "Tu deviens le pont entre les mondes — et cette fois, on sait que le pont a un nom : le tien.",
  },
  artiste: {
    nom: "Le Rêveur qui incarne",
    pourquoi:
      "Le rêve posé dans le réel, ton imaginaire devient matière. Tu ne fuis plus le monde, tu le redessines.",
    multipotentiel:
      "Tes visions multiples cessent de rester en l'air : tu fais atterrir l'impossible, un pas à la fois.",
  },
  presence: {
    nom: "Présence enracinée",
    pourquoi:
      "La peur de te fixer posée, tu te déposes assez pour récolter. Tu changes sans fuir — tu deviens, vraiment.",
    multipotentiel:
      "Ta capacité à te réinventer devient une force stable : tu es plusieurs, et tu le tiens, sans te disperser.",
  },
  stratege: {
    nom: "La Stratège qui relie",
    pourquoi:
      "Le sur-contrôle posé, ta vision d'ensemble s'ouvre à l'humain. Tu portes l'effort là où il compte, sans écraser ce qui vit.",
    multipotentiel:
      "Tes longueurs d'avance cessent de t'isoler : tu deviens celle qui oriente plusieurs mondes vers un même cap.",
  },
  mere: {
    nom: "Celle qui abrite sans s'oublier",
    pourquoi:
      "L'oubli de toi posé, ton soin devient un choix, plus une dette. Tu fais grandir les autres en restant debout, toi aussi.",
    multipotentiel:
      "Ta capacité à sentir les besoins, alliée à tes facettes multiples, fait de toi un refuge où chacun trouve sa place — toi comprise.",
  },
  multiple: {
    nom: "Multiple, pleinement",
    pourquoi:
      "La peur de choisir posée, ta pluralité cesse de te tirailler : elle se tient. Tu es plusieurs, et tu l'habites sans t'excuser.",
    multipotentiel:
      "Tes mondes cessent de se concurrencer : tu deviens la passeuse entre des langues que personne d'autre ne parle ensemble.",
  },
  gardienne: {
    nom: "Sentinelle qui transmet le feu",
    pourquoi:
      "La peur du changement posée, tu protèges l'essentiel sans figer la forme. Ce que tu gardes se transmet, au lieu de se scléroser.",
    multipotentiel:
      "Ta loyauté au sens, croisée à tes mondes multiples, fait de toi celle qui relie les époques et les gens autour de ce qui ne doit pas se perdre.",
  },
  activiste: {
    nom: "L'Activiste qui dure",
    pourquoi:
      "La fusion posée, ton engagement devient un choix tenu, plus une combustion. Tu portes le juste sans t'y dissoudre.",
    multipotentiel:
      "Ton feu, croisé à tes talents multiples, fait de toi celle qui organise et relie des mondes autour d'un même élan — sans s'y brûler.",
  },
  mediatrice: {
    nom: "Diplomate qui dit vrai",
    pourquoi:
      "L'évitement posé, ton écoute s'arme de franchise. Tu relies les êtres sur du solide, plus sur un accord de façade.",
    multipotentiel:
      "Ton flair des tensions, croisé à ta capacité à parler plusieurs langages, fait de toi celle qui traduit et réconcilie des mondes qui s'ignoraient.",
  },
  sorciere: {
    nom: "Alchimiste au grand jour",
    pourquoi:
      "Le retrait posé, ton intuition s'assume et transforme. Ton lien à l'invisible éclaire les autres au lieu de t'isoler.",
    multipotentiel:
      "Ta lecture du profond, croisée à tes savoirs multiples, fait de toi celle qui transmute la matière brute de plusieurs mondes en or partagé.",
  },
  souveraine: {
    nom: "Souverain·e qui s'entoure",
    pourquoi:
      "La solitude posée, ton autorité s'appuie sur les autres au lieu de tout porter. Tu tiens le cap sans t'y consumer.",
    multipotentiel:
      "Ton leadership, croisé à ta compréhension de plusieurs mondes, fait de toi celle qui fédère des talents divers sous une même vision, sans les écraser.",
  },
};

export const futurMoiDe = (k: ArchetypeKey): FuturMoi | undefined => FUTURS_MOI[k];
