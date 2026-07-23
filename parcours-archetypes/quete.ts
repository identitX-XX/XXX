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

export const QUETES: Record<ArchetypeKey, Quete> = {
  explorateur: {
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
  createur: {
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
  protecteur: {
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
  amoureux: {
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
  batisseur: {
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
  guerisseur: {
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
  joueur: {
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
  passeur: {
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
  reveur: {
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
  metamorphe: {
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
};

export const queteDe = (k: ArchetypeKey): Quete => QUETES[k];

// Le Futur Moi — là où l'on atterrit au bout de la quête. La meilleure version,
// multipotentielle, une fois le lest posé, ET le pourquoi. Adossé à la force de
// l'archétype et à la recherche sur la multipotentialité (voir /ressources).
export interface FuturMoi {
  nom: string; // le nom de cette version haute de toi
  pourquoi: string; // pourquoi tu atteins ton meilleur, le lest posé
  multipotentiel: string; // comment ta multipotentialité devient une force
}

export const FUTURS_MOI: Record<ArchetypeKey, FuturMoi> = {
  explorateur: {
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
  createur: {
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
  protecteur: {
    nom: "Le Protecteur qui tient sa place",
    pourquoi:
      "La sur-responsabilité posée, tu protèges sans porter. Ta force soutient, elle n'écrase plus — toi compris.",
    multipotentiel:
      "Tu deviens le pilier qui relie les gens ET les domaines, sans t'y dissoudre.",
  },
  amoureux: {
    nom: "Celui qui aime sans se perdre",
    pourquoi:
      "Le besoin d'approbation posé, tu entres en lien entier — présent, pas dilué. On t'aime pour ce que tu es, pas pour ce que tu plies.",
    multipotentiel:
      "Ta sensibilité aux autres, alliée à tes multiples facettes, fait de toi un tisseur de liens rare.",
  },
  batisseur: {
    nom: "Le Bâtisseur vivant",
    pourquoi:
      "La rigidité posée, tes fondations respirent. Tu construis solide ET souple — ça tient parce que ça s'adapte.",
    multipotentiel:
      "Tu deviens celui qui structure le foisonnement : donner forme à mille idées sans les figer.",
  },
  guerisseur: {
    nom: "Le Guérisseur qui se soigne aussi",
    pourquoi:
      "L'oubli de toi posé, ta source se remplit. Tu soignes depuis l'abondance, plus depuis le manque.",
    multipotentiel:
      "Ta capacité à sentir les êtres, croisée à tes savoirs multiples, fait de toi un soin qui n'existe nulle part ailleurs.",
  },
  joueur: {
    nom: "Le Joueur présent",
    pourquoi:
      "L'évitement posé, ta légèreté devient un cadeau, plus une fuite. Tu joues ET tu es là quand ça compte.",
    multipotentiel:
      "Ton goût du jeu relie tes domaines par l'expérimentation : tu transformes le sérieux en terrain d'essai.",
  },
  passeur: {
    nom: "Le Passeur qui existe",
    pourquoi:
      "L'effacement posé, tu transmets en étant vu. Ta lumière éclaire les autres sans t'éteindre.",
    multipotentiel:
      "Tu deviens le pont entre les mondes — et cette fois, on sait que le pont a un nom : le tien.",
  },
  reveur: {
    nom: "Le Rêveur qui incarne",
    pourquoi:
      "Le rêve posé dans le réel, ton imaginaire devient matière. Tu ne fuis plus le monde, tu le redessines.",
    multipotentiel:
      "Tes visions multiples cessent de rester en l'air : tu fais atterrir l'impossible, un pas à la fois.",
  },
  metamorphe: {
    nom: "La Métamorphe enracinée",
    pourquoi:
      "La peur de te fixer posée, tu te déposes assez pour récolter. Tu changes sans fuir — tu deviens, vraiment.",
    multipotentiel:
      "Ta capacité à te réinventer devient une force stable : tu es plusieurs, et tu le tiens, sans te disperser.",
  },
};

export const futurMoiDe = (k: ArchetypeKey): FuturMoi => FUTURS_MOI[k];
