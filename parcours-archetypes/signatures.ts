// parcours-archetypes/signatures.ts
// LE NOUVEAU SOCLE DE CONTENU — les 20 Signatures IdentitX, appelées à remplacer
// les 12 anciens archétypes (Phase A : données seules, encore non branchées).
//
// Chaque signature porte : les 8 champs de fiche (valeur, forces, schéma, ombres,
// conseil de communication, version mature, phrase intérieure, question de
// coaching) ET les champs que consomme le moteur du parcours :
//   · lens     → le « regard » court du jour (invitation à observer)
//   · question → la « question à porter » du jour  (= la question de coaching)
//   · defi     → le micro-défi du jour             (PROVISOIRE — à valider par Marina)
//   · hue      → teinte data-viz (HSL 0..360)
//
// « La Multiple » est une méta-signature (elle orchestre les autres).
// « La Présence » est le socle (l'ancrage habité).

export type SignatureKey =
  | "stratege"
  | "visionnaire"
  | "rebelle"
  | "mere"
  | "multiple"
  | "batisseuse"
  | "gardienne"
  | "activiste"
  | "mediatrice"
  | "passeuse"
  | "artiste"
  | "sage"
  | "altruiste"
  | "amante"
  | "sorciere"
  | "protectrice"
  | "souveraine"
  | "creatrice"
  | "libre"
  | "presence";

export interface Signature {
  key: SignatureKey;
  name: string;
  hue: number;
  role?: "meta" | "socle";
  // Les 8 champs de la fiche.
  valeur: string;
  forces: string;
  schema: string;
  ombres: string;
  communication: string;
  mature: string;
  phrase: string; // phrase intérieure
  coaching: string; // question de coaching
  // Champs consommés par le parcours quotidien.
  lens: string; // regard court du jour
  question: string; // question à porter (= coaching)
  defi: string; // micro-défi PROVISOIRE — à valider
}

export const SIGNATURES: Signature[] = [
  {
    key: "stratege",
    name: "Stratège",
    hue: 212,
    valeur: "L'efficacité mise au service d'un dessein plus grand qu'elle.",
    forces: "Vision d'ensemble, anticipation, sang-froid. Sait exactement où porter l'effort pour qu'il compte.",
    schema: "Lit le terrain avant d'agir, hiérarchise, avance par coups calculés — toujours une longueur d'avance.",
    ombres: "Le contrôle. Une froideur perçue, la difficulté à lâcher prise, et le calcul là où il faudrait simplement ressentir.",
    communication: "Parle en cap et en priorités. Montre le chemin, pas seulement le but — et laisse voir l'intention derrière la manœuvre.",
    mature: "La stratégie devient service : elle met sa clairvoyance au profit des autres, sans jamais manipuler.",
    phrase: "« Quel est le meilleur coup à jouer ? »",
    coaching: "Où ta maîtrise t'empêche-t-elle de te laisser surprendre ?",
    lens: "Observe où tu calcules le coup d'après au lieu de vivre celui-ci.",
    question: "Où ta maîtrise t'empêche-t-elle de te laisser surprendre ?",
    defi: "Aujourd'hui, laisse une situation se dérouler sans plan. Pendant deux minutes, observe ce qui arrive quand tu ne prépares pas le coup d'après.",
  },
  {
    key: "visionnaire",
    name: "Visionnaire",
    hue: 265,
    valeur: "Le futur rendu désirable, et l'élan pour y aller.",
    forces: "Intuition du possible, sens du sens, capacité à entraîner derrière une image d'avenir.",
    schema: "Voit ce qui n'existe pas encore et le nomme. Vit trois pas devant tout le monde.",
    ombres: "L'impatience, la déconnexion du présent. Elle brûle les étapes et peut épuiser celles qui la suivent.",
    communication: "Raconte l'horizon en images concrètes, puis ancre la vision dans un premier pas tangible.",
    mature: "Elle relie son horizon au présent : la vision devient feuille de route, non plus fuite en avant.",
    phrase: "« Et si… ? »",
    coaching: "Que refuses-tu de voir du présent parce que tu regardes trop loin ?",
    lens: "Observe ce que ton regard tourné vers l'avenir t'empêche de voir du présent.",
    question: "Que refuses-tu de voir du présent parce que tu regardes trop loin ?",
    defi: "Choisis une chose du présent que tu négliges. Pendant deux minutes, occupe-t'en pleinement, sans penser à la suite.",
  },
  {
    key: "rebelle",
    name: "Rebelle",
    hue: 6,
    valeur: "La liberté arrachée aux conformismes.",
    forces: "Courage, lucidité sur les faux-semblants, énergie de rupture. Ose ce que d'autres taisent.",
    schema: "Sent l'injustice et l'enfermement, et s'y oppose. Se définit souvent contre — un adversaire à combattre.",
    ombres: "L'opposition systématique. Se piéger dans la réaction, brûler les ponts, exister surtout par le refus.",
    communication: "Nomme ce que personne n'ose dire — mais propose l'alternative, pas seulement la colère.",
    mature: "Elle passe du contre au pour : sa révolte fonde quelque chose au lieu de seulement détruire.",
    phrase: "« Je ne me plierai pas. »",
    coaching: "Que construirais-tu s'il n'y avait plus rien contre quoi lutter ?",
    lens: "Observe ce que tu construirais si tu n'avais rien contre quoi lutter.",
    question: "Que construirais-tu s'il n'y avait plus rien contre quoi lutter ?",
    defi: "Repère une chose que tu fais par opposition. Pendant deux minutes, demande-toi ce que tu ferais pour toi — pas contre quelqu'un.",
  },
  {
    key: "mere",
    name: "Pilier",
    hue: 145,
    valeur: "Le soin qui fait grandir l'autre.",
    forces: "Présence inconditionnelle, sécurité qu'elle installe autour d'elle, générosité qui abrite.",
    schema: "Capte les besoins avant qu'ils soient dits. Nourrit, protège, se rend disponible.",
    ombres: "S'oublier. Étouffer à force de bien vouloir, attendre en silence une reconnaissance qui ne vient pas.",
    communication: "Pose sa présence sans se sacrifier. Dit ses limites comme un cadeau, pas comme un reproche.",
    mature: "Elle prend soin sans se dissoudre : le don finit par l'inclure, elle aussi.",
    phrase: "« Je suis là. »",
    coaching: "De qui prends-tu soin pour éviter de t'occuper de toi ?",
    lens: "Observe de qui tu prends soin pour ne pas t'occuper de toi.",
    question: "De qui prends-tu soin pour éviter de t'occuper de toi ?",
    defi: "Aujourd'hui, laisse un besoin de ton entourage sans y répondre aussitôt. Observe ce qui se passe quand tu ne portes pas tout.",
  },
  {
    key: "multiple",
    name: "Multiple",
    hue: 45,
    role: "meta",
    valeur: "La richesse d'une pluralité tenue, et non subie.",
    forces: "Adaptabilité, curiosité multiple, art de relier des mondes qui s'ignorent. Change de registre sans se trahir.",
    schema: "Contient plusieurs signatures et les fait dialoguer. Elle n'est pas dispersée : elle est plusieurs, à la fois.",
    ombres: "La dispersion, le sentiment d'imposture, la peur de choisir. Se vivre comme « trop » ou « jamais assez ».",
    communication: "Assume sa pluralité comme une signature à part entière, pas comme un défaut à excuser.",
    mature: "Elle orchestre au lieu de s'éparpiller : la multiplicité devient une composition, non un chaos.",
    phrase: "« Je suis plusieurs, et c'est cohérent. »",
    coaching: "Quel est le fil qui relie, en secret, toutes tes facettes ?",
    lens: "Observe le fil qui relie, en secret, toutes tes facettes.",
    question: "Quel est le fil qui relie, en secret, toutes tes facettes ?",
    defi: "Nomme trois de tes facettes. Pendant deux minutes, cherche le fil unique qui les relie toutes.",
  },
  {
    key: "batisseuse",
    name: "Architecte",
    hue: 30,
    valeur: "Le durable — ce qui tient quand le reste passe.",
    forces: "Patience, méthode, fiabilité. Sait finir ce qu'elle commence, et le faire solide.",
    schema: "Pose une pierre après l'autre. Préfère le solide au brillant, et construit dans le temps long.",
    ombres: "La rigidité, la lenteur à pivoter. S'attacher à ce qu'elle a bâti même lorsqu'il faudrait le quitter.",
    communication: "Montre les fondations et les preuves. Rassure par la constance plutôt que par la promesse.",
    mature: "Elle bâtit ce qui la dépasse : l'œuvre sert, elle ne cherche plus à se prouver.",
    phrase: "« Ça tiendra. »",
    coaching: "Qu'entretiens-tu encore qui ne mérite plus ton énergie ?",
    lens: "Observe ce que tu entretiens encore qui ne mérite plus ton énergie.",
    question: "Qu'entretiens-tu encore qui ne mérite plus ton énergie ?",
    defi: "Repère une chose que tu maintiens par habitude. Pendant deux minutes, demande-toi si elle mérite encore ce que tu lui donnes.",
  },
  {
    key: "gardienne",
    name: "Sentinelle",
    hue: 188,
    valeur: "La transmission de ce qui compte, et la mémoire des liens.",
    forces: "Loyauté, sens du juste, tenue du cadre et des valeurs. Veille sur l'essentiel.",
    schema: "Protège traditions, principes et fils invisibles. Se porte garante de ce qui ne doit pas se perdre.",
    ombres: "Le conservatisme, la peur du changement. Juger au nom du « bien » et confondre forme et fond.",
    communication: "Incarne des valeurs plutôt que de les prêcher. Relie le passé et l'avenir dans un même geste.",
    mature: "Elle garde l'essentiel tout en laissant la forme muer : fidèle au sens, pas à la lettre.",
    phrase: "« Il faut préserver cela. »",
    coaching: "Que protèges-tu qui demande, en vérité, à évoluer ?",
    lens: "Observe ce que tu protèges qui demande, en vérité, à évoluer.",
    question: "Que protèges-tu qui demande, en vérité, à évoluer ?",
    defi: "Choisis une règle que tu défends. Pendant deux minutes, imagine ce qu'elle deviendrait si tu en gardais l'esprit mais changeais la forme.",
  },
  {
    key: "activiste",
    name: "Activiste",
    hue: 354,
    valeur: "Le changement collectif au nom du juste.",
    forces: "Engagement, capacité à mobiliser, endurance au combat. Transforme l'indignation en action.",
    schema: "Fédère autour d'une cause, organise, tient dans la durée là où d'autres s'essoufflent.",
    ombres: "La radicalité, l'épuisement militant. Fondre son identité entière dans la cause, jusqu'à s'y perdre.",
    communication: "Relie la cause à une histoire humaine. Invite à rejoindre plutôt qu'elle ne culpabilise.",
    mature: "Elle agit sans se consumer : la cause a besoin d'elle vivante, pas martyre.",
    phrase: "« Ça ne peut pas rester ainsi. »",
    coaching: "Qui es-tu quand tu ne te bats pour rien ?",
    lens: "Observe qui tu es quand tu ne te bats pour rien.",
    question: "Qui es-tu quand tu ne te bats pour rien ?",
    defi: "Aujourd'hui, pose le combat un moment. Pendant deux minutes, observe qui tu es quand aucune cause ne réclame ta force.",
  },
  {
    key: "mediatrice",
    name: "Diplomate",
    hue: 170,
    valeur: "Le lien retrouvé, l'accord juste entre les êtres.",
    forces: "Écoute, diplomatie, flair des tensions. Traduit les uns aux autres et apaise ce qui s'échauffe.",
    schema: "Cherche le terrain commun, désamorce, ramène chacun à une part de vérité de l'autre.",
    ombres: "Éviter le conflit nécessaire. Se diluer dans le point de vue de tous, jusqu'à la tiédeur.",
    communication: "Nomme les désaccords au lieu de les fuir : sa neutralité devient une prise de position lucide.",
    mature: "Elle relie sans se renier : l'harmonie n'est plus payée au prix de sa propre voix.",
    phrase: "« Comment nous entendre ? »",
    coaching: "Quel conflit évites-tu qui, réglé, libérerait tout le monde — toi comprise ?",
    lens: "Observe le conflit que tu évites et qui, réglé, libérerait tout le monde.",
    question: "Quel conflit évites-tu qui, réglé, libérerait tout le monde — toi comprise ?",
    defi: "Repère un désaccord que tu lisses. Pendant deux minutes, formule pour toi seule ce que tu penses vraiment.",
  },
  {
    key: "passeuse",
    name: "Passeur·se",
    hue: 285,
    valeur: "Faire traverser — initier l'autre à un seuil.",
    forces: "Pédagogie, générosité du savoir, art d'accompagner un passage sans le forcer.",
    schema: "Prend par la main d'un état à un autre. Révèle aux autres ce qu'ils portent déjà.",
    ombres: "Se rendre indispensable, vivre par procuration, oublier sa propre traversée en guidant celle des autres.",
    communication: "Partage un chemin vécu, pas une théorie. Sait s'effacer au bon moment.",
    mature: "Elle fait passer puis laisse partir : la transmission libère, elle ne retient pas.",
    phrase: "« Viens, je te montre. »",
    coaching: "Quelle traversée remets-tu à plus tard, occupée à faire passer les autres ?",
    lens: "Observe la traversée que tu remets, occupée à faire passer les autres.",
    question: "Quelle traversée remets-tu à plus tard, occupée à faire passer les autres ?",
    defi: "Aujourd'hui, occupe-toi d'une de tes propres traversées. Pendant deux minutes, observe ce qui remonte quand tu t'accompagnes toi.",
  },
  {
    key: "artiste",
    name: "Artiste",
    hue: 322,
    valeur: "La beauté comme façon de dire le vrai.",
    forces: "Sensibilité, singularité du regard, don de mettre en forme l'informe.",
    schema: "Transforme le ressenti en forme. A besoin de créer pour comprendre ce qu'elle traverse.",
    ombres: "L'hypersensibilité, le doute, la dépendance au regard. Des cycles de haut et de bas.",
    communication: "Montre l'œuvre, pas la justification. Assume son regard comme sa marque de fabrique.",
    mature: "Elle crée pour offrir, non plus pour être validée : l'œuvre existe même sans applaudissements.",
    phrase: "« Je dois lui donner forme. »",
    coaching: "Que créerais-tu si personne ne devait jamais le voir ?",
    lens: "Observe ce que tu créerais si personne ne devait jamais le voir.",
    question: "Que créerais-tu si personne ne devait jamais le voir ?",
    defi: "Crée quelque chose en deux minutes que personne ne verra. Observe ce qui change quand le regard des autres disparaît.",
  },
  {
    key: "sage",
    name: "Sage",
    hue: 250,
    valeur: "Le discernement — voir juste avant d'agir.",
    forces: "Recul, profondeur, calme. Sait poser la question qui déplace tout.",
    schema: "Observe avant de juger, cherche le sens sous l'événement, relativise l'urgence.",
    ombres: "Se retirer du jeu. La tiédeur de l'observatrice qui sait, mais n'engage pas.",
    communication: "Dit peu, mais juste. Éclaire sans surplomber, transmet sans sermonner.",
    mature: "Sa sagesse descend dans l'action : elle ne se contente plus de comprendre, elle prend part.",
    phrase: "« Qu'est-ce que cela nous apprend ? »",
    coaching: "Où ta lucidité te sert-elle d'excuse pour ne pas t'engager ?",
    lens: "Observe où ta lucidité te sert d'excuse pour ne pas t'engager.",
    question: "Où ta lucidité te sert-elle d'excuse pour ne pas t'engager ?",
    defi: "Choisis une situation que tu comprends parfaitement. Pendant deux minutes, engage-toi dedans au lieu de l'observer.",
  },
  {
    key: "altruiste",
    name: "Altruiste",
    hue: 128,
    valeur: "Le bien de l'autre comme boussole.",
    forces: "Empathie, dévouement, sens du collectif. Trouve du sens dans l'utilité aux autres.",
    schema: "Se met au service, donne, se rend utile — souvent avant même qu'on le demande.",
    ombres: "L'oubli de soi, le martyre discret, la générosité qui attend, en creux, un retour.",
    communication: "Donne depuis l'abondance, non depuis le manque. Nomme ses propres besoins sans honte.",
    mature: "Elle donne sans se vider : sa générosité finit par l'inclure elle aussi.",
    phrase: "« Que puis-je faire pour toi ? »",
    coaching: "Que t'autoriserais-tu, pour une fois, à recevoir ?",
    lens: "Observe ce que tu t'autoriserais, pour une fois, à recevoir.",
    question: "Que t'autoriserais-tu, pour une fois, à recevoir ?",
    defi: "Aujourd'hui, demande quelque chose pour toi. Observe la gêne — et ce qu'il y a dessous.",
  },
  {
    key: "amante",
    name: "Amoureux·se",
    hue: 340,
    valeur: "L'intensité du lien, la vie pleinement ressentie.",
    forces: "Présence sensuelle, capacité d'attachement profond, art de célébrer l'instant.",
    schema: "Cherche la vibration, la fusion, l'intensité relationnelle. Aime sans demi-mesure.",
    ombres: "La dépendance affective, la peur du vide et de l'abandon, se perdre dans l'autre.",
    communication: "Incarne la chaleur et le désir sans se rendre captive : relie sans s'annuler.",
    mature: "Elle aime depuis sa plénitude : l'intensité n'est plus un besoin de combler un manque.",
    phrase: "« Je veux tout ressentir. »",
    coaching: "Dans ce que tu attends de l'autre, qu'est-ce qui t'appartient déjà ?",
    lens: "Observe, dans ce que tu attends de l'autre, ce qui t'appartient déjà.",
    question: "Dans ce que tu attends de l'autre, qu'est-ce qui t'appartient déjà ?",
    defi: "Repère une attente que tu poses sur l'autre. Pendant deux minutes, demande-toi ce que tu peux t'offrir toi-même.",
  },
  {
    key: "sorciere",
    name: "Alchimiste",
    hue: 300,
    valeur: "Le pouvoir de transformation, l'intelligence de l'invisible.",
    forces: "Intuition puissante, lien au symbolique, capacité à métamorphoser une situation ou une émotion.",
    schema: "Sent ce qui se joue sous la surface. Travaille par cycles, transmute la matière brute en or.",
    ombres: "Se marginaliser, se croire à part, jouer avec un pouvoir qu'on n'assume pas au grand jour.",
    communication: "Assume son intuition comme une expertise. Traduit l'invisible en langage concret et utile.",
    mature: "Elle met son pouvoir au service : la transformation soigne, elle ne cherche plus à fasciner.",
    phrase: "« Je sais des choses qu'on ne m'a pas dites. »",
    coaching: "À quoi renonces-tu vraiment en te tenant à l'écart ?",
    lens: "Observe ce à quoi tu renonces en te tenant à l'écart.",
    question: "À quoi renonces-tu vraiment en te tenant à l'écart ?",
    defi: "Nomme une intuition que tu tais. Pendant deux minutes, traduis-la en une phrase claire, dicible à voix haute.",
  },
  {
    key: "protectrice",
    name: "Rempart",
    hue: 222,
    valeur: "La sécurité des siens et la frontière juste.",
    forces: "Courage, loyauté, fermeté. Sait poser une limite et défendre les plus fragiles.",
    schema: "Se dresse devant le danger, veille aux frontières, garde l'espace de ceux qu'elle aime.",
    ombres: "La méfiance, la surprotection qui enferme, le combat contre des menaces devenues imaginaires.",
    communication: "Protège sans infantiliser : sa force rassure au lieu d'intimider.",
    mature: "Elle protège en rendant l'autre capable : la limite libère, elle n'emmure pas.",
    phrase: "« Personne ne touchera à ça. »",
    coaching: "Qui protèges-tu encore d'un danger qui n'existe plus ?",
    lens: "Observe qui tu protèges encore d'un danger qui n'existe plus.",
    question: "Qui protèges-tu encore d'un danger qui n'existe plus ?",
    defi: "Repère quelqu'un que tu protèges. Pendant deux minutes, demande-toi si cette protection le rend plus fort — ou plus petit.",
  },
  {
    key: "souveraine",
    name: "Souverain·e",
    hue: 40,
    valeur: "L'autorité juste, assumée et responsable.",
    forces: "Leadership naturel, sens de la décision, tenue du cadre et du cap. Ne fuit pas la responsabilité.",
    schema: "Assume, tranche, incarne l'autorité sans s'en excuser. Porte le poids sans le faire peser.",
    ombres: "L'orgueil, la difficulté à déléguer et à se montrer vulnérable, la solitude du sommet.",
    communication: "Incarne l'autorité par l'exemple, pas par le statut. Ose la vulnérabilité comme une force.",
    mature: "Elle règne au service : le pouvoir est une responsabilité tenue, non une possession.",
    phrase: "« C'est moi qui décide, et j'en réponds. »",
    coaching: "Où ta couronne t'empêche-t-elle de demander de l'aide ?",
    lens: "Observe où ta couronne t'empêche de demander de l'aide.",
    question: "Où ta couronne t'empêche-t-elle de demander de l'aide ?",
    defi: "Aujourd'hui, demande de l'aide sur une chose. Observe ce que ça coûte — et ce que ça ouvre.",
  },
  {
    key: "creatrice",
    name: "Créateur·rice",
    hue: 16,
    valeur: "Faire naître — donner corps à ce qui n'existait pas.",
    forces: "Énergie génératrice, imagination fertile, art de transformer une idée en réel.",
    schema: "A besoin de faire advenir : projets, œuvres, mondes. Ne supporte pas le stérile ni l'inerte.",
    ombres: "La dispersion créative, l'inachevé. Fuir dans le projet suivant dès que le premier demande de la constance.",
    communication: "Montre ce qu'elle fait naître, et relie sa fécondité à un fil directeur lisible.",
    mature: "Elle crée ET incarne dans la durée : sa création se déploie au lieu de se disperser.",
    phrase: "« Je veux faire exister ça. »",
    coaching: "Quel projet mérite, cette fois, que tu ailles jusqu'au bout ?",
    lens: "Observe quel projet mérite, cette fois, que tu ailles jusqu'au bout.",
    question: "Quel projet mérite, cette fois, que tu ailles jusqu'au bout ?",
    defi: "Reprends un projet laissé en chemin. Pendant deux minutes, fais le plus petit pas concret vers sa fin.",
  },
  {
    key: "libre",
    name: "Libre",
    hue: 92,
    valeur: "L'autonomie et l'espace pour respirer.",
    forces: "Indépendance, authenticité, refus des cages, légèreté qui allège l'entourage.",
    schema: "Préserve sa liberté de mouvement, fuit l'enfermement, va où elle veut, quand elle veut.",
    ombres: "La fuite de l'engagement, la peur du lien qui attache, le côté insaisissable.",
    communication: "Montre que sa liberté est un choix relationnel, pas une échappée : elle s'engage sans se perdre.",
    mature: "Elle est libre AVEC : l'engagement choisi devient une liberté de plus, non une prison.",
    phrase: "« Je ne veux appartenir à personne. »",
    coaching: "De quel lien as-tu peur qu'il te retire ta liberté — et est-ce vrai ?",
    lens: "Observe le lien dont tu as peur qu'il te retire ta liberté.",
    question: "De quel lien as-tu peur qu'il te retire ta liberté — et est-ce vrai ?",
    defi: "Choisis un lien qui compte. Pendant deux minutes, imagine t'y engager davantage — et vois si ta liberté rétrécit vraiment.",
  },
  {
    key: "presence",
    name: "Présence",
    hue: 200,
    role: "socle",
    valeur: "L'ancrage habité : exister pleinement sans avoir à le prouver.",
    forces: "Calme rayonnant, stabilité qui tient l'espace, présence au corps et à l'instant. Un silence vivant.",
    schema: "N'a pas besoin d'agir pour exister. Sa seule présence apaise et structure ce qui l'entoure.",
    ombres: "La passivité perçue, le retrait, l'immobilité qui glisse vers l'inertie ou l'évitement.",
    communication: "Sa présence parle avant ses mots. Elle incarne au lieu de démontrer.",
    mature: "Sa stabilité devient socle pour les autres : l'ancrage rayonne sans jamais se figer.",
    phrase: "« Je suis là, pleinement. »",
    coaching: "Que se passe-t-il si tu n'as rien à prouver, ni rien à faire ?",
    lens: "Observe ce qui reste quand tu n'as rien à prouver ni à faire.",
    question: "Que se passe-t-il si tu n'as rien à prouver, ni rien à faire ?",
    defi: "Aujourd'hui, reste deux minutes sans rien faire ni prouver. Observe ce qui demeure quand l'agitation retombe.",
  },
];

export const signatureByKey: Record<SignatureKey, Signature> = Object.fromEntries(
  SIGNATURES.map((s) => [s.key, s])
) as Record<SignatureKey, Signature>;

// La question-socle du système (méta) : le mouvement de reliaison porté par La Multiple.
export const QUESTION_SOCLE =
  "Comment les différentes dimensions de ton identité évoluent-elles, et quels futurs deviennent possibles lorsque tu apprends à les relier ?";
