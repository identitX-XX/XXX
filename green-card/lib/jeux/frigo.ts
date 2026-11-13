/**
 * Jeu 7 — Zéro Gaspi Frigo : règles pures.
 * « Mon frigo » propose des recettes de restes ; on déclare ses actions anti-gaspi ; un quiz sur les dates.
 * (À l'étape 4, l'agent IA proposera des recettes sur mesure.)
 */

export const INGREDIENTS = [
  { id: "pain", nom: "Pain rassis", emoji: "🥖" },
  { id: "bananes", nom: "Bananes trop mûres", emoji: "🍌" },
  { id: "pommes", nom: "Pommes abîmées", emoji: "🍎" },
  { id: "legumes", nom: "Légumes fatigués", emoji: "🥕" },
  { id: "riz", nom: "Riz cuit", emoji: "🍚" },
  { id: "pates", nom: "Pâtes cuites", emoji: "🍝" },
  { id: "pommes-de-terre", nom: "Pommes de terre", emoji: "🥔" },
  { id: "oeufs", nom: "Œufs", emoji: "🥚" },
  { id: "lait", nom: "Lait", emoji: "🥛" },
  { id: "fromage", nom: "Bouts de fromage", emoji: "🧀" },
  { id: "yaourts", nom: "Yaourts", emoji: "🍶" },
  { id: "poulet", nom: "Restes de poulet", emoji: "🍗" },
  { id: "tomates", nom: "Tomates molles", emoji: "🍅" },
  { id: "herbes", nom: "Herbes fanées", emoji: "🌿" },
] as const;

export type IdIngredient = (typeof INGREDIENTS)[number]["id"];

export interface Recette {
  id: string;
  titre: string;
  emoji: string;
  minutes: number;
  ingredients: IdIngredient[];
  etapes: string[];
}

export const RECETTES: Recette[] = [
  { id: "pain-perdu", titre: "Pain perdu", emoji: "🍞", minutes: 15, ingredients: ["pain", "oeufs", "lait"], etapes: ["Battez 2 œufs avec 25 cl de lait et un peu de sucre.", "Trempez les tranches de pain rassis.", "Dorez-les à la poêle avec un peu de beurre."] },
  { id: "banana-bread", titre: "Gâteau aux bananes", emoji: "🍰", minutes: 50, ingredients: ["bananes", "oeufs"], etapes: ["Écrasez 3 bananes avec 2 œufs, 50 g de sucre et 50 g de beurre fondu.", "Ajoutez 200 g de farine et un sachet de levure.", "Enfournez 40 minutes à 180 °C."] },
  { id: "compote", titre: "Compote maison", emoji: "🥣", minutes: 20, ingredients: ["pommes"], etapes: ["Coupez les pommes en morceaux en retirant les parties abîmées.", "Faites cuire à feu doux avec un fond d'eau, 15 minutes.", "Écrasez à la fourchette. Pas besoin de sucre !"] },
  { id: "soupe", titre: "Soupe de légumes", emoji: "🍲", minutes: 30, ingredients: ["legumes", "pommes-de-terre"], etapes: ["Coupez les légumes et une pomme de terre en morceaux.", "Couvrez d'eau, salez, cuisez 25 minutes.", "Mixez. Se congèle très bien en portions."] },
  { id: "riz-saute", titre: "Riz sauté", emoji: "🍳", minutes: 15, ingredients: ["riz", "oeufs", "legumes"], etapes: ["Faites revenir les légumes coupés fin.", "Ajoutez le riz froid, puis 2 œufs battus.", "Mélangez jusqu'à ce que les œufs soient cuits. Un peu de sauce soja !"] },
  { id: "gratin-pates", titre: "Gratin de pâtes", emoji: "🧀", minutes: 25, ingredients: ["pates", "fromage", "lait"], etapes: ["Mettez les pâtes cuites dans un plat.", "Versez un peu de lait et couvrez de fromage râpé.", "Gratinez 15 minutes à 200 °C."] },
  { id: "omelette", titre: "Omelette du frigo", emoji: "🍳", minutes: 10, ingredients: ["oeufs", "fromage", "herbes", "pommes-de-terre"], etapes: ["Battez 3 œufs, ajoutez les herbes ciselées.", "Ajoutez les restes : pommes de terre, fromage…", "Cuisez à la poêle à feu moyen."] },
  { id: "croquettes", titre: "Croquettes de pommes de terre", emoji: "🥔", minutes: 20, ingredients: ["pommes-de-terre", "oeufs", "fromage"], etapes: ["Écrasez les pommes de terre cuites avec un œuf et du fromage.", "Formez des galettes.", "Dorez-les à la poêle, 3 minutes de chaque côté."] },
  { id: "sauce-tomate", titre: "Sauce tomate", emoji: "🍅", minutes: 25, ingredients: ["tomates", "herbes"], etapes: ["Coupez les tomates molles, retirez les parties abîmées.", "Faites mijoter 20 minutes avec un oignon et les herbes.", "Pour les pâtes, ou à congeler en bocal."] },
  { id: "salade-poulet", titre: "Salade de poulet", emoji: "🥗", minutes: 10, ingredients: ["poulet", "riz", "tomates", "pates"], etapes: ["Effilochez le poulet.", "Mélangez avec le riz ou les pâtes froides et des tomates.", "Une vinaigrette, et c'est prêt."] },
  { id: "smoothie", titre: "Smoothie", emoji: "🥤", minutes: 5, ingredients: ["bananes", "yaourts", "lait", "pommes"], etapes: ["Mettez les fruits coupés dans un blender.", "Ajoutez un yaourt ou du lait.", "Mixez et buvez aussitôt."] },
  { id: "chapelure", titre: "Chapelure et croûtons", emoji: "🥖", minutes: 15, ingredients: ["pain", "herbes"], etapes: ["Coupez le pain rassis en cubes ou mixez-le.", "Faites dorer au four 10 minutes avec les herbes.", "Croûtons pour la soupe, chapelure pour les gratins."] },
];

/** Recettes qui utilisent le plus d'ingrédients choisis (au moins un), les plus utiles d'abord. */
export function recettesPour(choisis: string[], max = 4): Recette[] {
  const set = new Set(choisis);
  return RECETTES.map((r) => ({ r, n: r.ingredients.filter((i) => set.has(i)).length }))
    .filter((x) => x.n > 0)
    .sort((a, b) => b.n - a.n || a.r.minutes - b.r.minutes)
    .slice(0, max)
    .map((x) => x.r);
}

export const ACTIONS_ANTIGASPI = [
  { id: "recette", nom: "J'ai cuisiné des restes", emoji: "👩‍🍳" },
  { id: "congele", nom: "J'ai congelé avant la date", emoji: "🧊" },
  { id: "partage", nom: "J'ai donné ou partagé", emoji: "🤲" },
  { id: "liste", nom: "J'ai fait mes courses avec une liste", emoji: "📝" },
  { id: "compost", nom: "J'ai composté mes épluchures", emoji: "🌱" },
] as const;

export type IdActionAntiGaspi = (typeof ACTIONS_ANTIGASPI)[number]["id"];
export const estActionAntiGaspi = (v: unknown): v is IdActionAntiGaspi => ACTIONS_ANTIGASPI.some((a) => a.id === v);

/** ADEME : environ 30 kg de nourriture jetée par personne et par an ; on estime 0,3 kg et 1,5 € sauvés par action. */
export const KG_PAR_ACTION = 0.3;
export const EURO_PAR_ACTION = 1.5;
export const ACTIONS_FRIGO_MAX_PAR_JOUR = 3;
export const JOURS_OR_FRIGO = 7;

// ---------------------------------------------------------------------------
// Quiz « DLC ou DDM ? »
// ---------------------------------------------------------------------------
export interface QuestionQuiz {
  id: string;
  question: string;
  choix: string[];
  bonne: number;
  explication: string;
}

export const QUIZ: QuestionQuiz[] = [
  {
    id: "dlc",
    question: "« À consommer jusqu'au… » (DLC), ça veut dire :",
    choix: ["Une date limite à respecter : après, il y a un risque pour la santé", "Une date indicative : on peut dépasser sans souci"],
    bonne: 0,
    explication: "La DLC concerne les produits frais (viande, poisson, laitages) : on la respecte.",
  },
  {
    id: "ddm",
    question: "« À consommer de préférence avant… » (DDM), ça veut dire :",
    choix: ["Il faut jeter le produit après la date", "Le produit peut perdre un peu de goût, mais se mange sans risque après"],
    bonne: 1,
    explication: "Pâtes, riz, biscuits, conserves : bien conservés, ils se mangent après la DDM.",
  },
  {
    id: "yaourt",
    question: "Un yaourt nature, fermé, au frigo, 3 jours après sa date :",
    choix: ["Il se mange sans problème s'il a l'air et le goût normaux", "Il faut absolument le jeter"],
    bonne: 0,
    explication: "Depuis 2022, les yaourts peuvent porter une DDM : fermé et bien conservé, il se mange encore.",
  },
  {
    id: "steak",
    question: "Un steak haché dont la DLC est dépassée d'un jour :",
    choix: ["On le cuit bien et ça passe", "On ne le mange pas"],
    bonne: 1,
    explication: "Viande hachée, poisson, volaille : la DLC est une limite de sécurité. La prochaine fois, congelez-le avant la date !",
  },
  {
    id: "congeler",
    question: "Pour sauver un produit frais qui arrive à sa date, on peut :",
    choix: ["Le congeler avant la date limite", "Le laisser au frigo une semaine de plus"],
    bonne: 0,
    explication: "Congelé avant la DLC, il se garde plusieurs mois. On le décongèle au frigo et on le mange vite.",
  },
  {
    id: "frigo",
    question: "La partie la plus froide du frigo (pour viande et poisson) est en général :",
    choix: ["La porte", "La clayette du haut ou du bas, selon le modèle (souvent indiquée)"],
    bonne: 1,
    explication: "La porte est la zone la moins froide : idéale pour les boissons et les sauces, pas pour la viande.",
  },
];

export function scorerQuiz(reponses: Record<string, number>): number {
  return QUIZ.filter((q) => reponses[q.id] === q.bonne).length;
}

/**
 * Médailles de Zéro Gaspi Frigo :
 * Bronze : une première action anti-gaspi ; Argent : + le quiz « DLC ou DDM ? » sans faute ;
 * Or : + des actions anti-gaspi sur 7 jours différents.
 */
export function niveauFrigo(p: { joursActions: number; quizParfait: boolean }): number {
  if (p.joursActions < 1) return 0;
  if (!p.quizParfait) return 1;
  if (p.joursActions >= JOURS_OR_FRIGO) return 3;
  return 2;
}
