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
      "À force de courir vers la prochaine nouveauté, rien n'a le temps de devenir une vraie transformation. Ton énergie se disperse avant de porter.",
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
      "Analyser devient une manière d'éviter de vivre. À trop vouloir comprendre avant d'agir, tu restes au bord de ta propre expérience.",
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
      "La peur du jugement transforme chaque création en verdict sur ta valeur. Tu peaufines dans l'ombre ce que le monde ne verra jamais.",
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
      "Te définir CONTRE te rend dépendant de ce que tu combats. Ta liberté devient une réaction, plus un choix.",
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
      "Tu portes tout le monde, jusqu'à disparaître sous la charge. À force de protéger les autres, tu ne te protèges plus toi.",
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
      "À vouloir être aimé, tu te dissous dans l'autre. Ton élan vers le lien devient une peur de déplaire.",
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
      "Tu édifies des certitudes pour te protéger de l'imprévisible. Mais ce qui devait te stabiliser finit par t'enfermer.",
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
      "Tu soignes tout le monde, sauf toi. Le soin donné aux autres devient un moyen de ne pas regarder tes propres blessures.",
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
      "La blague et le jeu deviennent une façon d'esquiver ce qui compte. Ta légèreté, si précieuse, sert parfois à fuir la profondeur.",
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
      "Tu transmets, tu relies, tu mets en lumière les autres — au point de t'oublier. Ton rôle devient une manière de ne pas exister pour toi-même.",
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
      "Le potentiel est infini tant qu'il n'est pas incarné. À force d'idéaliser, tu ne réalises pas — et le réel te semble toujours décevant.",
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
      "Rester insaisissable te protège de l'engagement — et t'empêche de te déposer quelque part assez longtemps pour y devenir toi.",
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
