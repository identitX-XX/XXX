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
    lens: "Regarde comment tu cherches à comprendre avant d'agir, et où le savoir te met à l'abri.",
    hue: 265,
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
    lens: "Vois ce que tu refuses de suivre, et ce que ton « non » cherche à protéger.",
    hue: 5,
  },
  {
    key: "protecteur",
    name: "Le·la Protecteur·rice",
    lens: "Repère qui et quoi tu veux mettre à l'abri, et ce que tu portes sans le dire.",
    hue: 150,
  },
  {
    key: "amoureux",
    name: "L'Amoureux·se",
    lens: "Regarde ce qui t'attache, ce que tu chéris, et ce que la proximité fait remonter.",
    hue: 345,
  },
  {
    key: "batisseur",
    name: "Le·la Bâtisseur·se",
    lens: "Observe où tu prends en charge la durée, l'ordre et le cap — pour toi et pour les autres.",
    hue: 210,
  },
  {
    key: "guerisseur",
    name: "Le·la Guérisseur·se",
    lens: "Remarque où tu transformes la douleur — la tienne, celle d'autrui — en apaisement.",
    hue: 175,
  },
  {
    key: "joueur",
    name: "Le·la Joueur·se",
    lens: "Observe où le jeu, la légèreté et l'humour te rendent à toi-même.",
    hue: 48,
  },
  {
    key: "passeur",
    name: "Le·la Passeur·se",
    lens: "Vois ce que tu te sens appelé·e à transmettre, et à qui tu ouvres un passage.",
    hue: 95,
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
