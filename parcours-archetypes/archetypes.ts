// parcours-archetypes/archetypes.ts
// LE SEUL FICHIER DE CONTENU. Le moteur (évolution, indicateurs, charts) est
// agnostique : réécrire ici ne casse rien tant que les `key` restent stables.
//
// Voix « capsule identitaire » : une invitation à regarder (« observe… », « repère… »),
// jamais un verdict « tu es X ». La 12e — La Métamorphe — clôt le parcours
// (J30) : la capsule identitaire qui refuse toute étiquette.

import { Archetype, Emotion, Phase, Sphere } from "./types";

export const ARCHETYPES: Archetype[] = [
  {
    key: "explorateur",
    name: "L'Explorateur·rice",
    lens: "Observe ce qui s'ouvre quand tu oses l'inconnu — et ce que rester en place te coûte.",
    hue: 28,
  },
  {
    key: "sage",
    name: "Le·la Sage",
    lens: "Observe la manière dont tu donnes sens à ce que tu vis. Entre l'événement et ce que tu en conclus s'interpose toujours un regard, souvent si familier qu'il devient invisible. Aujourd'hui, porte moins ton attention sur tes réponses que sur la façon dont naissent tes questions.",
    hue: 265,
    essence:
      "Le Sage ne cherche pas à accumuler des certitudes ; il cultive une disponibilité à ce qui les transforme. Son mouvement profond consiste à laisser le réel élargir progressivement les formes par lesquelles il le comprend. Il sait que toute perception est déjà une interprétation et que l'expérience précède toujours les récits que nous en faisons. Sa quête n'est donc pas celle d'une vérité définitive, mais d'un regard suffisamment souple pour accueillir la complexité sans la réduire. Plus sa compréhension s'affine, moins il éprouve le besoin de conclure. Il découvre qu'une conscience mature ne possède pas davantage de réponses : elle entretient avec l'incertitude une relation plus paisible.",
    force:
      "Lorsque cette dynamique circule librement, elle transforme profondément ta manière d'habiter le monde. Tu deviens moins réactif aux apparences immédiates et davantage attentif aux liens qui relient les événements entre eux. Les situations cessent d'être isolées ; elles s'inscrivent dans un ensemble plus vaste où chaque expérience éclaire discrètement les autres. Cette qualité de regard ralentit le jugement sans affaiblir la décision. Au contraire, elle permet d'agir avec davantage de justesse parce que l'action ne naît plus uniquement de l'émotion du moment, mais d'une compréhension progressivement intégrée. Tu découvres alors que la lucidité n'est pas une distance prise avec la vie. Elle est une manière plus profonde d'y participer, sans être continuellement gouverné par l'urgence de réagir.",
    ombre:
      "Toute recherche de compréhension peut, à son tour, devenir une stratégie de protection. Il arrive que l'analyse remplace l'expérience, que la réflexion diffère la rencontre ou que la quête de cohérence cherche, sans le dire, à préserver une ancienne représentation de soi. L'esprit affine alors ses raisonnements avec une remarquable précision, tandis que certaines émotions demeurent à l'abri de cette intelligence. La pensée cesse d'éclairer le vécu ; elle l'organise suffisamment pour ne plus avoir à le traverser. Peu à peu, le besoin de comprendre chaque chose peut masquer une difficulté plus discrète : accepter que certaines dimensions de l'existence ne se laissent ni maîtriser ni résoudre. Le savoir devient alors une protection contre l'inconnu, alors qu'il aurait pu devenir une manière de mieux l'habiter.",
    question:
      "Quelle certitude continues-tu de défendre avec le plus de conviction… simplement parce qu'elle t'évite encore de regarder le monde depuis un lieu qui te transformerait ?",
    defi:
      "Aujourd'hui, choisis une situation sur laquelle ton opinion te semble parfaitement établie. Pendant deux minutes, suspends-la sans chercher à la remplacer. Observe ce qui devient perceptible lorsque ton regard cesse, un instant, d'exiger d'avoir raison avant de comprendre.",
  },
  {
    key: "createur",
    name: "Le·la Créateur·rice",
    lens: "Remarque ce qui, en toi, cherche moins à produire qu'à révéler. Certaines idées n'apparaissent pas parce que tu les inventes ; elles émergent lorsque ton attention devient suffisamment disponible pour les accueillir. Observe également ce que tu diffères, non par manque de talent, mais parce que toute création authentique transforme toujours celui qui lui donne naissance.",
    hue: 330,
    essence:
      "Le Créateur ne poursuit pas l'originalité ; il répond à une nécessité intérieure qui cherche une forme juste. Son mouvement profond consiste à rendre visible ce qui n'existait encore qu'à l'état de pressentiment. Il habite cet espace singulier où l'intuition précède le langage, où l'imaginaire rencontre la matière et où le possible commence lentement à modifier le réel. Créer n'est pas ajouter quelque chose au monde : c'est permettre à une réalité latente d'accéder à l'existence. Toute œuvre véritable, quelle qu'en soit la forme, porte ainsi la trace d'une double naissance : celle de ce qui est créé et celle de celui ou celle qui, en créant, devient imperceptiblement autre.",
    force:
      "Lorsque cette dynamique circule librement, elle transforme ta manière de percevoir avant même de transformer ce que tu accomplis. Là où d'autres rencontrent des objets, tu distingues des relations ; là où certains voient des contraintes, tu pressens des combinaisons encore inexplorées. Ton regard devient moins captif des habitudes et davantage sensible aux formes émergentes. Tu acceptes que l'incertitude fasse partie du processus, non comme une faiblesse, mais comme la condition même de toute invention. Peu à peu, créer cesse d'être un acte ponctuel pour devenir une manière d'habiter le monde : une disponibilité à ce qui cherche à apparaître, une confiance discrète dans ce qui n'est pas encore visible et une capacité à accompagner l'inachevé jusqu'à ce qu'il trouve sa propre cohérence. Tu découvres alors que l'œuvre la plus profonde n'est peut-être pas celle que tu produis, mais la transformation silencieuse qu'elle opère en toi.",
    ombre:
      "Toute puissance créatrice porte en elle une forme de vulnérabilité. Lorsque la création devient le principal lieu où tu cherches ta légitimité, elle peut se transformer en exigence permanente. L'élan d'inventer laisse alors place au besoin de prouver, de surprendre ou d'être reconnu. À d'autres moments, c'est l'inverse : l'œuvre demeure à l'état d'ébauche parce qu'une possibilité intacte paraît moins risquée qu'une réalité imparfaite. Derrière le perfectionnisme se cache parfois une stratégie plus ancienne : préserver une image de soi que le réel pourrait contredire. L'imagination devient alors un refuge d'une richesse infinie, mais dont aucune porte ne s'ouvre sur le monde. Ce n'est plus la création qui protège la vie ; c'est la peur qui emprunte le langage de la création pour éviter l'épreuve de l'incarnation.",
    question:
      "Quelle part de toi attends-tu encore de rendre irréprochable avant de lui accorder le droit d'exister… et que deviendrait ton regard si tu considérais que l'imperfection n'est pas le contraire de la création, mais son premier langage ?",
    defi:
      "Pendant deux minutes, donne une forme à une intuition qui ne possède encore ni objectif, ni utilité, ni promesse de réussite. Écris une phrase, trace une ligne, compose une image ou invente un geste. Puis oublie le résultat. Observe simplement ce qui s'est déplacé en toi lorsque le possible a accepté de devenir réel, même de façon fragile.",
  },
  {
    key: "rebelle",
    name: "Le·la Rebelle",
    lens: "Observe ce qui, en toi, résiste lorsque quelque chose ne sonne plus juste. Toutes les résistances ne naissent pas d'un refus ; certaines expriment une fidélité silencieuse à ce qui demande encore à vivre. Aujourd'hui, porte moins ton attention sur ce à quoi tu t'opposes que sur ce que cette opposition cherche, peut-être, à préserver.",
    hue: 5,
    essence:
      "Le Rebelle ne poursuit pas la rupture pour elle-même. Il apparaît lorsqu'une manière d'être, de penser ou de vivre ne peut plus contenir ce qui cherche à émerger. Son mouvement profond consiste à desserrer les formes devenues trop étroites afin que la vie retrouve sa capacité d'évolution. Il rappelle que toute structure, aussi protectrice soit-elle, finit un jour par demander à être réinterrogée. Son intelligence n'est pas celle de la destruction, mais de la différenciation : reconnaître ce qui mérite d'être conservé, ce qui demande à être quitté et ce qui attend encore d'être inventé. Il ouvre un passage lorsque la fidélité à soi devient plus exigeante que la fidélité aux habitudes.",
    force:
      "Lorsque cette dynamique circule librement, elle restaure une liberté intérieure qui ne dépend plus de l'approbation extérieure. Tu développes la capacité de reconnaître les récits qui ont façonné ton identité sans les confondre avec ce que tu es devenu. Les règles cessent d'être des évidences ; elles redeviennent des choix, parfois utiles, parfois dépassés. Cette lucidité ne produit pas une opposition permanente. Elle rend possible une adhésion plus consciente. Tu n'agis plus contre un système pour le simple plaisir de le contredire ; tu discernes les moments où une transformation devient nécessaire parce que le vivant réclame davantage d'espace que les cadres existants ne peuvent désormais lui offrir. Le courage ne consiste plus à rompre, mais à demeurer fidèle à une cohérence intérieure qui continue d'évoluer.",
    ombre:
      "Toute énergie de libération peut se transformer en prison lorsqu'elle fait de l'opposition sa principale manière d'exister. Le refus devient alors une identité plus qu'un passage. Tu peux rejeter avant d'avoir rencontré, quitter avant d'avoir compris ou combattre des limites qui ne sont plus réellement présentes. Il arrive aussi que la colère protège une vulnérabilité ancienne à laquelle aucune place n'a encore été donnée. Dans ce cas, l'adversaire extérieur occupe progressivement tout l'espace, tandis que le conflit intérieur demeure intact. Ce qui devait ouvrir un chemin vers davantage de liberté finit par maintenir un lien invisible avec ce dont tu cherches précisément à t'affranchir. La révolte continue, mais le mouvement de transformation s'interrompt.",
    question:
      "À quoi demeures-tu encore lié précisément parce que tu continues à t'y opposer… et quelle part de toi deviendrait enfin disponible si cette lutte cessait d'organiser silencieusement ton identité ?",
    defi:
      "Aujourd'hui, remarque un automatisme auquel tu obéis sans même le questionner. Pendant deux minutes, suspends-le volontairement, sans chercher à le remplacer. Observe ce qui apparaît lorsque tu cesses simplement de reproduire ce qui semblait aller de soi.",
  },
  {
    key: "protecteur",
    name: "Le·la Protecteur·rice",
    lens: "Repère ce que tu cherches spontanément à préserver lorsque quelque chose te semble précieux, fragile ou vivant. Observe ce qui, en toi, s'avance pour soutenir, contenir ou rassurer. Puis interroge la frontière subtile entre protéger ce qui peut grandir… et retenir ce qui aurait désormais besoin d'espace.",
    hue: 150,
    essence:
      "Le Protecteur ne cherche pas à empêcher les blessures ; il veille à ce que la vie puisse continuer à circuler malgré elles. Son mouvement profond consiste à offrir un espace suffisamment stable pour que ce qui est vulnérable puisse se développer sans être constamment menacé. Il comprend que toute croissance exige à la fois une ouverture au monde et un sentiment de sécurité intérieure. Protéger ne signifie donc ni contrôler, ni anticiper chaque risque, mais discerner ce qui mérite d'être soutenu jusqu'à ce qu'il puisse trouver sa propre autonomie. Sa présence rappelle qu'aucune transformation durable ne s'épanouit dans la peur permanente.",
    force:
      "Lorsque cette dynamique circule librement, elle fait naître autour de toi un climat où chacun peut progressivement devenir davantage lui-même. Tu n'imposes pas la sécurité ; tu la rends possible. Tu accueilles sans envahir, tu soutiens sans diriger, tu accompagnes sans confisquer le chemin de l'autre. Cette qualité de présence apaise moins parce qu'elle apporte des réponses que parce qu'elle rend de nouveau pensable ce qui semblait menaçant. Tu développes également une capacité essentielle envers toi-même : reconnaître tes propres limites sans les vivre comme un échec. Tu découvres alors que protéger le vivant ne consiste pas à le maintenir sous surveillance, mais à lui offrir des conditions suffisamment fiables pour qu'il déploie librement ses propres ressources. La confiance cesse d'être une promesse ; elle devient un environnement.",
    ombre:
      "Toute énergie de protection peut, lorsqu'elle est gouvernée par la peur, se transformer en contrôle. Le souci de préserver devient progressivement le besoin de prévenir, d'anticiper ou de porter ce qui n'appartient plus à ta responsabilité. Tu peux alors confondre l'amour avec la vigilance permanente, ou croire que ta présence est indispensable à l'équilibre des autres. Derrière cette disponibilité sans limite se cache parfois une inquiétude plus ancienne : celle que le lien ne survive pas à la liberté. À vouloir épargner toute difficulté, tu risques involontairement de priver l'autre de l'expérience par laquelle il découvre sa propre solidité. Ce qui devait protéger la croissance peut alors ralentir son élan. L'excès de protection ne naît pas d'un manque d'amour ; il naît souvent de la difficulté à faire confiance au vivant lorsqu'il échappe à notre regard.",
    question:
      "Que cherches-tu réellement à préserver lorsque tu protèges quelqu'un… son intégrité, la relation qui vous unit, ou la part de toi qui redoute encore ce qui pourrait advenir si tu desserrais doucement ton étreinte ?",
    defi:
      "Aujourd'hui, remarque un moment où ton premier réflexe est d'intervenir, de conseiller ou de prévenir une difficulté. Pendant deux minutes, choisis plutôt d'être pleinement présent sans orienter ce qui se passe. Observe ce qui devient possible lorsque le soutien remplace le contrôle, et que la confiance prend discrètement la place de la maîtrise.",
  },
  {
    key: "amoureux",
    name: "L'Amoureux·se",
    lens: "Observe ce qui attire profondément ton attention, jusqu'à modifier la qualité de ta présence. Remarque les êtres, les lieux, les idées ou les instants auprès desquels tu te sens davantage vivant. Puis interroge ce qui, dans cet élan, relève d'une rencontre authentique… et ce qui cherche peut-être à combler une absence plus ancienne.",
    hue: 345,
    essence:
      "L'Amoureux ne cherche pas seulement à être aimé ; il cherche à rencontrer pleinement. Son mouvement profond consiste à reconnaître ce qui mérite une présence entière, sans précipitation ni appropriation. Il sait, parfois intuitivement, que l'existence prend une densité nouvelle lorsque nous cessons de traverser le monde comme des observateurs pour accepter d'être touchés par lui. Aimer devient alors une manière d'habiter la réalité avec une intensité paisible. Il ne s'agit pas de fusionner avec ce qui nous attire, mais de demeurer suffisamment présent pour laisser la rencontre nous transformer sans nous perdre. Toute relation véritable modifie silencieusement celui qui accepte de s'y engager.",
    force:
      "Lorsque cette dynamique circule librement, elle affine profondément ta qualité de présence. Tu n'entres plus en relation pour obtenir, convaincre ou te rassurer, mais pour découvrir ce qui devient possible entre toi et ce qui te fait face. Les personnes cessent d'être les supports de tes attentes ; elles retrouvent leur altérité. Tu apprends à écouter sans préparer ta réponse, à regarder sans immédiatement interpréter, à aimer sans réduire l'autre à la fonction qu'il occupe dans ton histoire. Cette disponibilité transforme également le lien que tu entretiens avec toi-même. Tu découvres qu'une relation vivante ne repose ni sur la possession ni sur la dépendance, mais sur une capacité renouvelée à demeurer présent à ce qui est, même lorsque cela échappe à ton contrôle. L'amour cesse alors d'être une émotion ; il devient une qualité d'attention.",
    ombre:
      "Toute capacité d'attachement porte en elle le risque de la confusion. Lorsque la relation devient le lieu principal où tu cherches ton sentiment d'exister, l'autre peut progressivement recevoir la mission impossible de réparer ce qui ne lui appartient pas. Tu peux alors confondre proximité et fusion, disponibilité et effacement, engagement et dépendance. Il arrive aussi que tu t'attaches davantage à ce que représente une personne qu'à la personne elle-même. L'amour devient alors le support d'un récit intérieur plus ancien que la rencontre présente. Peu à peu, la peur de perdre remplace la joie de rencontrer. Ce qui devait ouvrir l'existence se met à la contracter. L'attachement ne nourrit plus la relation ; il tente de la préserver contre le mouvement même de la vie.",
    question:
      "Lorsque tu dis « j'aime », rencontres-tu pleinement ce qui est devant toi… ou cherches-tu parfois, sans t'en apercevoir, à retrouver une part de toi que tu crois perdue ?",
    defi:
      "Aujourd'hui, choisis une personne, un lieu ou un moment de ton quotidien. Pendant deux minutes, accorde-lui une attention totale, sans téléphone, sans anticipation, sans commentaire intérieur. Observe ce qui apparaît lorsque tu cesses de vouloir vivre l'instant autrement qu'il ne se présente.",
  },
  {
    key: "batisseur",
    name: "Le·la Bâtisseur·se",
    lens: "Observe ce à quoi tu consacres durablement ton énergie. Remarque ce qui résiste au temps parce que tu choisis, jour après jour, de lui offrir une place dans ta vie. Puis interroge ce qui, en toi, construit véritablement… et ce qui cherche parfois à édifier des certitudes pour se protéger de l'imprévisible.",
    hue: 210,
    essence:
      "Le Bâtisseur ne cherche pas seulement à accomplir ; il cherche à inscrire dans la durée ce qui possède une valeur suffisamment profonde pour mériter son engagement. Son mouvement consiste à transformer une intention en réalité vivante, non par la force, mais par la constance. Il comprend que toute œuvre durable naît moins de l'intensité d'un élan que de la fidélité quotidienne qui lui permet de prendre forme. Il ne confond pas vitesse et progression. Il accepte que certaines constructions exigent du temps parce qu'elles transforment progressivement celui qui les porte. Bâtir, c'est consentir à devenir la personne capable de soutenir ce que l'on souhaite voir exister.",
    force:
      "Lorsque cette dynamique circule librement, tu développes une relation apaisée au temps. Tu n'es plus gouverné par l'urgence de réussir ni par l'impatience de voir les résultats apparaître immédiatement. Tu discernes les gestes qui produisent des effets durables et tu leur accordes une attention régulière, même lorsqu'ils demeurent invisibles aux yeux des autres. Cette stabilité ne réduit pas ta créativité ; elle lui offre un terrain où s'incarner. Les idées cessent d'être de simples possibilités pour devenir des expériences vécues, capables de transformer ton existence et parfois celle des autres. Tu découvres que la véritable solidité n'est pas la rigidité. Elle réside dans une structure suffisamment vivante pour évoluer sans perdre sa cohérence. Les fondations ne sont pas des limites : elles rendent la croissance possible.",
    ombre:
      "Toute capacité à construire peut se transformer en besoin de contrôler. À force de rechercher la stabilité, tu peux finir par préférer ce qui est prévisible à ce qui est vivant. Les habitudes deviennent des forteresses, les responsabilités se multiplient et chaque changement semble menacer un équilibre patiemment construit. Il arrive aussi que tu mesures ta valeur à ce que tu produis ou à ce que tu maintiens debout. Le repos devient difficile, l'imperfection inquiétante et le lâcher-prise presque impensable. Peu à peu, l'œuvre que tu avais bâtie pour soutenir la vie risque d'exiger toute ton énergie afin d'être préservée. Ce qui devait offrir une assise devient alors une structure dont tu te sens prisonnier. Les murs continuent de tenir, mais ils empêchent parfois les fenêtres de s'ouvrir.",
    question:
      "Qu'es-tu en train de construire avec le plus de constance… et cette construction agrandit-elle encore ta vie, ou lui demandes-tu désormais de préserver une version de toi qui a déjà commencé à changer ?",
    defi:
      "Choisis aujourd'hui une action simple que tu repousses depuis plusieurs jours parce qu'elle te paraît trop modeste pour faire une différence. Consacre-lui deux minutes, sans chercher à la terminer. Observe ce qui se transforme lorsque tu cesses d'attendre un grand élan pour honorer une direction qui compte réellement.",
  },
  {
    key: "guerisseur",
    name: "Le·la Guérisseur·se",
    lens: "Remarque ce qui, en toi, cherche moins à effacer les blessures qu'à leur donner une place où elles ne gouvernent plus silencieusement ton existence. Observe ce que tu apaises spontanément, chez toi comme chez les autres. Puis demande-toi si ce mouvement naît d'une présence véritable… ou du besoin que la douleur disparaisse au plus vite.",
    hue: 175,
    essence:
      "Le Guérisseur ne poursuit ni la perfection ni le retour à un état antérieur. Son mouvement profond consiste à permettre au vivant de retrouver sa capacité d'intégration lorsque l'expérience l'a fragmenté. Il sait que certaines blessures ne disparaissent pas ; elles changent de fonction lorsqu'elles cessent d'être le centre autour duquel toute l'identité s'organise. Guérir n'est pas oublier, encore moins effacer. C'est retrouver une continuité intérieure suffisamment vaste pour que la douleur ne soit plus le seul langage disponible. La transformation commence lorsque ce qui était figé retrouve la possibilité de circuler, d'être ressenti, compris puis doucement intégré à l'histoire de soi.",
    force:
      "Lorsque cette dynamique circule librement, tu développes une présence qui transforme davantage par sa qualité que par ses réponses. Tu ne cherches plus immédiatement à expliquer, réparer ou soulager. Tu offres un espace où ce qui semblait insupportable peut progressivement retrouver une forme de mouvement. Cette disponibilité agit d'abord sur toi. Tu apprends à accueillir tes propres émotions sans les considérer comme des défaillances à corriger. Tu découvres que la vulnérabilité n'est pas l'opposé de la solidité, mais l'une des conditions de sa construction. Peu à peu, les expériences cessent d'être divisées entre celles qu'il faudrait conserver et celles qu'il faudrait oublier. Elles deviennent les différentes expressions d'une même vie en transformation. La guérison apparaît alors moins comme un résultat que comme une manière nouvelle d'entrer en relation avec soi, avec les autres et avec le temps.",
    ombre:
      "Toute capacité à apaiser peut devenir une manière subtile d'éviter sa propre vulnérabilité. À force d'accompagner les blessures des autres, tu peux différer la rencontre avec les tiennes. Le soin devient alors une identité, parfois même une condition pour te sentir légitime ou indispensable. Tu peux également croire que toute souffrance appelle une intervention, alors que certaines expériences demandent avant tout une présence capable de supporter qu'elles suivent leur propre rythme. Peu à peu, réparer remplace rencontrer. Tu portes ce qui ne t'appartient plus, tu anticipes ce qui n'est pas encore advenu et tu t'épuises à maintenir des équilibres qui ne dépendent pas de toi. Ce qui devait libérer le vivant risque alors de le maintenir dans une dépendance discrète. La compassion se transforme en responsabilité excessive, et la générosité oublie parfois de revenir jusqu'à toi.",
    question:
      "Lorsque tu cherches à réparer ce qui souffre, quelle part de toi espère secrètement que, si tout autour de toi retrouve enfin son équilibre, certaines de tes propres blessures n'auront plus besoin d'être entendues ?",
    defi:
      "Aujourd'hui, lorsqu'une émotion inconfortable apparaît, résiste pendant deux minutes à l'envie de l'expliquer, de la résoudre ou de la faire disparaître. Accorde-lui simplement une présence calme. Observe ce qui change lorsque tu cesses de considérer ce qui est ressenti comme un problème à corriger et commences à l'accueillir comme une information sur ton expérience.",
  },
  {
    key: "joueur",
    name: "Le·la Joueur·se",
    lens: "Observe les moments où tu cesses de vouloir maîtriser chaque chose. Remarque ce qui devient possible lorsque la curiosité prend, même brièvement, la place du contrôle. Puis interroge ce que le sérieux protège parfois en toi… et ce que le jeu pourrait discrètement remettre en mouvement.",
    hue: 48,
    essence:
      "Le Joueur ne cherche pas à fuir la réalité ; il en explore les possibilités avec une liberté que la peur ignore souvent. Son mouvement profond consiste à créer un espace où l'erreur cesse d'être une menace pour redevenir une source de découverte. Il comprend que le vivant n'évolue pas seulement par l'effort, mais aussi par l'expérimentation. Jouer, ce n'est pas prendre les choses à la légère ; c'est accepter qu'elles puissent être approchées autrement. Dans cet espace où rien n'est encore définitivement fixé, l'imagination dialogue avec l'expérience, les habitudes perdent un instant leur évidence et de nouvelles manières d'être deviennent envisageables. Le jeu rappelle que toute transformation commence par une permission intérieure : celle d'essayer sans avoir déjà besoin de réussir.",
    force:
      "Lorsque cette dynamique circule librement, tu développes une souplesse qui transforme ta relation au monde. Les imprévus deviennent moins menaçants parce qu'ils cessent d'être immédiatement interprétés comme des obstacles. Tu explores avant de conclure, tu expérimentes avant de juger, tu accueilles l'incertitude comme un espace d'apprentissage plutôt que comme une faille à combler. Cette disposition nourrit également ta créativité et tes relations. Les échanges gagnent en spontanéité, les idées circulent plus librement et les solutions apparaissent souvent là où la rigidité ne voyait qu'une impasse. Tu découvres que la légèreté n'est pas l'absence de profondeur ; elle est parfois la forme la plus subtile de l'intelligence. En relâchant momentanément la nécessité d'avoir raison, tu retrouves la capacité de découvrir.",
    ombre:
      "Toute liberté peut cependant devenir une manière d'éviter l'engagement. Le jeu perd alors sa fonction d'exploration pour devenir une stratégie d'évitement. Tu passes d'une possibilité à une autre sans leur laisser le temps de mûrir. L'humour masque ce qui demanderait à être nommé, l'ironie protège d'une implication plus profonde et la légèreté devient un refuge contre le risque d'être réellement touché. Il arrive aussi que tu recherches sans cesse la nouveauté afin de ne jamais rencontrer l'inconfort de la répétition, alors que certaines transformations exigent précisément de demeurer assez longtemps au même endroit. Ce qui devait ouvrir le champ des possibles peut alors disperser ton énergie. Le mouvement demeure, mais la profondeur se dérobe.",
    question:
      "À quel moment as-tu commencé à croire que grandir exigeait de devenir plus sérieux… et que perdrais-tu réellement si tu t'autorisais de nouveau à explorer avant de maîtriser ?",
    defi:
      "Aujourd'hui, choisis une action ordinaire que tu accomplis chaque jour. Pendant deux minutes, réalise-la autrement : change ton rythme, ton ordre, ton regard ou ta manière de faire. N'essaie pas d'être plus efficace. Observe simplement ce que cette variation révèle de tes automatismes et de la liberté qui existe encore à l'intérieur d'eux.",
  },
  {
    key: "passeur",
    name: "Le·la Passeur·se",
    lens: "Observe ce que tu transmets sans toujours en avoir conscience. Remarque les expériences, les idées, les gestes ou les silences qui continuent leur chemin à travers toi. Puis interroge-toi : ce que tu donnes naît-il d'un désir d'être reconnu… ou de la conviction intime que certaines richesses ne prennent tout leur sens qu'en étant partagées ?",
    hue: 95,
    essence:
      "Le Passeur ne cherche pas à laisser une empreinte ; il veille à ce que ce qui l'a profondément transformé puisse continuer de vivre au-delà de lui. Son mouvement profond consiste à relier ce qui semblait séparé : les générations, les savoirs, les expériences, les sensibilités, les mondes intérieurs. Il comprend que toute connaissance demeure inachevée tant qu'elle ne devient pas relation. Transmettre n'est pas reproduire. C'est accueillir un héritage, le laisser se transformer au contact de sa propre existence, puis l'offrir à nouveau sous une forme capable d'éclairer quelqu'un d'autre. Le Passeur ne conserve pas le vivant ; il accompagne sa circulation.",
    force:
      "Lorsque cette dynamique circule librement, tu développes une capacité rare : celle de rendre les choses complexes profondément accessibles sans les appauvrir. Tu écoutes avant de parler, tu cherches moins à convaincre qu'à faire émerger une compréhension chez l'autre. Ce que tu transmets ne s'impose jamais ; cela ouvre un espace où chacun peut construire son propre sens. Tu découvres que la véritable transmission ne consiste pas à reproduire fidèlement ce que tu sais, mais à éveiller chez l'autre une intelligence qui lui appartient déjà. Tu deviens alors un lien plutôt qu'un centre, un seuil plutôt qu'une destination. Ce qui circule à travers toi continue d'évoluer sans avoir besoin de te ressembler.",
    ombre:
      "Toute vocation à transmettre peut discrètement se transformer en besoin d'être indispensable. Tu peux finir par croire que les autres ont besoin de toi pour avancer, ou mesurer la valeur de ce que tu apportes à la reconnaissance que tu reçois en retour. Il arrive également que tu transmettes davantage des réponses que des questions, des certitudes que des chemins, des héritages que tu n'as pas encore pleinement examinés. La transmission cesse alors d'être un passage ; elle devient une répétition. Ce qui devait faire circuler le vivant risque de le figer. Tu portes un flambeau sans toujours remarquer que la lumière demande parfois à changer de direction pour continuer d'éclairer.",
    question:
      "Que souhaites-tu réellement transmettre… un savoir, une manière de regarder le monde, ou la liberté pour chacun de découvrir un chemin qui ne ressemblera peut-être jamais au tien ?",
    defi:
      "Aujourd'hui, partage avec une personne une expérience qui t'a profondément transformé, sans lui dire ce qu'elle devrait en faire. Contente-toi de raconter ce qui a changé ton regard. Puis observe ce qui naît lorsque tu transmets sans chercher à orienter la manière dont l'autre recevra ce que tu lui offres.",
  },
  {
    key: "reveur",
    name: "Le·la Rêveur·se",
    lens: "Regarde ce qui, en toi, continue de pressentir des possibles que ton quotidien ne confirme pas encore. Observe ces images, ces intuitions ou ces élans que tu repousses parfois sous prétexte qu'ils ne sont pas immédiatement utiles. Puis demande-toi si le réalisme auquel tu te réfères décrit fidèlement le monde… ou seulement les limites de tes représentations actuelles.",
    hue: 300,
    essence:
      "Le Rêveur ne s'évade pas du réel ; il en explore les potentialités encore invisibles. Il pressent que toute transformation durable apparaît d'abord sous la forme d'une possibilité fragile, presque imperceptible, avant de devenir une évidence. Son intelligence n'est pas tournée vers ce qui est, mais vers ce qui cherche à advenir. Il entretient avec l'avenir une relation de dialogue plutôt que de prédiction. Là où d'autres ne perçoivent qu'une continuité, il distingue les premières lignes d'une configuration nouvelle. Son mouvement profond consiste à préserver la capacité d'imaginer sans rompre le lien avec le réel, car toute existence s'appauvrit lorsque l'horizon cesse d'être plus vaste que l'expérience présente.",
    force:
      "Lorsque cette dynamique circule librement, elle élargit progressivement le champ du pensable. Tu développes une aptitude singulière à reconnaître les possibles avant qu'ils ne disposent encore d'une forme stable. Les contraintes cessent d'être uniquement des limites ; elles deviennent aussi des surfaces de transformation. Cette qualité d'imagination ne consiste pas à inventer un autre monde, mais à percevoir autrement celui qui existe déjà. Elle assouplit les modèles par lesquels tu interprètes ton histoire et ouvre des espaces où de nouvelles décisions deviennent envisageables. Tu découvres alors que l'imagination n'est pas l'opposé de la lucidité : elle en constitue souvent l'avant-garde. Toute création humaine, individuelle ou collective, commence par cette discrète capacité à accueillir ce qui n'a pas encore trouvé sa place dans le langage.",
    ombre:
      "Toute imagination possède cependant son envers. Lorsqu'elle perd le contact avec l'expérience, elle peut transformer le possible en refuge. Les projets se multiplient tandis que les commencements se raréfient. L'idéal devient alors suffisamment vaste pour rendre toute réalité décevante. Il arrive également que tu protèges certaines visions parce qu'elles demeurent intactes tant qu'elles ne rencontrent pas le monde. Ce qui semblait préserver l'espérance retarde alors l'incarnation. L'avenir devient une demeure plus confortable que le présent. Peu à peu, l'imaginaire cesse d'élargir la vie ; il l'ajourne. Ce n'est plus le rêve qui ouvre le réel, mais le réel qui semble menacer le rêve.",
    question:
      "Quelle possibilité continues-tu de considérer comme irréaliste… simplement parce qu'aucune version actuelle de toi-même ne sait encore comment l'habiter ?",
    defi:
      "Pendant deux minutes, choisis une conviction que tu tiens pour immuable à propos de ton avenir. Suspends-la volontairement. Imagine, sans chercher à convaincre ni à planifier, qu'une issue radicalement différente soit déjà en train de prendre forme. Observe moins ce que tu imagines que ce qui change, presque imperceptiblement, dans la manière dont tu regardes le présent.",
  },
  {
    key: "metamorphe",
    name: "La Métamorphe",
    lens: "Observe ce qui, en toi, ne cesse de se transformer — et se refuse à toute étiquette.",
    hue: 190,
  },
];

export const SPHERES: Sphere[] = [
  { key: "travail", label: "Travail" },
  { key: "relations", label: "Relations" },
  { key: "creation", label: "Création" },
  { key: "corps", label: "Corps & énergie" },
  { key: "sens", label: "Sens & intériorité" },
];

export const EMOTIONS: Emotion[] = [
  { key: "joie", label: "Joie", valence: 1 },
  { key: "elan", label: "Élan", valence: 0.6 },
  { key: "apaisement", label: "Apaisement", valence: 0.4 },
  { key: "peur", label: "Peur", valence: -0.6 },
  { key: "colere", label: "Colère", valence: -0.5 },
  { key: "tristesse", label: "Tristesse", valence: -0.8 },
];

export const PHASES: Phase[] = [
  {
    key: "revelation",
    label: "Révélation",
    jours: [1, 8],
    intention: "Laisser paraître les archétypes qui te viennent le plus naturellement.",
  },
  {
    key: "exploration",
    label: "Exploration",
    jours: [9, 16],
    intention: "Essayer des archétypes moins familiers, dans d'autres sphères que d'habitude.",
  },
  {
    key: "tension",
    label: "Tension",
    jours: [17, 24],
    intention: "Rencontrer les frictions : quand deux archétypes, ou un archétype et un contexte, se contredisent.",
  },
  {
    key: "metamorphose",
    label: "Métamorphose",
    jours: [25, 30],
    intention: "Intégrer ce qui a bougé — sans se refermer sur une identité fixe.",
  },
];

// Index pratiques ------------------------------------------------------------

export const ARCHETYPE_KEYS = ARCHETYPES.map((a) => a.key);
export const SPHERE_KEYS = SPHERES.map((s) => s.key);
export const EMOTION_KEYS = EMOTIONS.map((e) => e.key);

export const archetypeByKey = Object.fromEntries(
  ARCHETYPES.map((a) => [a.key, a])
) as Record<(typeof ARCHETYPES)[number]["key"], Archetype>;

export const sphereByKey = Object.fromEntries(
  SPHERES.map((s) => [s.key, s])
) as Record<(typeof SPHERES)[number]["key"], Sphere>;

export const emotionByKey = Object.fromEntries(
  EMOTIONS.map((e) => [e.key, e])
) as Record<(typeof EMOTIONS)[number]["key"], Emotion>;

export function phaseDuJour(n: number): Phase {
  return PHASES.find((p) => n >= p.jours[0] && n <= p.jours[1]) ?? PHASES[0];
}
