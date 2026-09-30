// lib/xsens/xsens.ts
// « X-sens » — agent de transition de vie et d'identité. Logique PURE (types,
// questions, repli maquette sans clé, assemblage du résumé exportable), isolée
// pour être testée. L'UI (app/x-sens) et l'API (app/api/x-sens) s'appuient dessus.

export type ChampId =
  | "pro"
  | "perso"
  | "lieu"
  | "contrainte"
  | "energie"
  | "valeurs"
  | "envie"
  | "peur"
  | "reussite"
  | "horizon";

export type Reponses = Partial<Record<ChampId, string>>;

export interface Question {
  id: ChampId;
  etape: 1 | 2;
  etapeLabel: string;
  question: string;
  aide: string;
  placeholder: string;
  lignes: number;
}

// Les questions que l'agent POSE, en deux temps : l'état des lieux, puis la
// boussole intérieure. Concises, ciblées, non intrusives.
export const QUESTIONS: Question[] = [
  {
    id: "pro",
    etape: 1,
    etapeLabel: "État des lieux",
    question: "Où en es-tu côté pro, aujourd'hui ?",
    aide: "Ton travail, tes projets, ce que tu fais de tes journées.",
    placeholder: "Ex. Salariée en marketing depuis 8 ans, l'envie n'y est plus…",
    lignes: 3,
  },
  {
    id: "perso",
    etape: 1,
    etapeLabel: "État des lieux",
    question: "Et côté perso & relations ?",
    aide: "Ta vie personnelle, tes proches, ce qui compte autour de toi.",
    placeholder: "Ex. En couple, un enfant, une famille présente…",
    lignes: 3,
  },
  {
    id: "lieu",
    etape: 1,
    etapeLabel: "État des lieux",
    question: "Où vis-tu, et est-ce que ça peut bouger ?",
    aide: "Lieu de vie, logement, mobilité possible.",
    placeholder: "Ex. Lyon, propriétaire, ouverte à un départ en région…",
    lignes: 2,
  },
  {
    id: "contrainte",
    etape: 1,
    etapeLabel: "État des lieux",
    question: "Quelle est ta contrainte la plus lourde en ce moment ?",
    aide: "Ce qui limite ou complique tes choix (argent, temps, santé, engagements…).",
    placeholder: "Ex. Un crédit à assumer, peu de temps libre…",
    lignes: 2,
  },
  {
    id: "energie",
    etape: 1,
    etapeLabel: "État des lieux",
    question: "Qu'est-ce qui te pèse, et qu'est-ce qui te donne de l'énergie ?",
    aide: "Les sources de stress d'un côté, ce qui te recharge de l'autre.",
    placeholder: "Ex. Les réunions me vident ; créer et transmettre me nourrit…",
    lignes: 3,
  },
  {
    id: "valeurs",
    etape: 2,
    etapeLabel: "Boussole intérieure",
    question: "Quelles sont tes 3 valeurs clés ?",
    aide: "Ce qui est non négociable pour toi, ce qui te fait te sentir aligné·e.",
    placeholder: "Ex. Liberté, transmission, honnêteté",
    lignes: 2,
  },
  {
    id: "envie",
    etape: 2,
    etapeLabel: "Boussole intérieure",
    question: "Quelle est l'envie profonde que tu n'oses pas trop nommer ?",
    aide: "Ce vers quoi tu es tirée, même si ça fait un peu peur.",
    placeholder: "Ex. Lancer mon propre atelier, écrire, changer de métier…",
    lignes: 2,
  },
  {
    id: "peur",
    etape: 2,
    etapeLabel: "Boussole intérieure",
    question: "Quelle peur ou quel blocage revient le plus ?",
    aide: "Ce qui t'empêche d'avancer, la petite voix qui freine.",
    placeholder: "Ex. Peur de manquer d'argent, de me tromper, du regard des autres…",
    lignes: 2,
  },
  {
    id: "reussite",
    etape: 2,
    etapeLabel: "Boussole intérieure",
    question: "Dans un an, à quoi tu sauras que tu as avancé ?",
    aide: "Ton critère de réussite à toi — pas celui des autres.",
    placeholder: "Ex. Je me lève avec envie, j'ai testé une piste concrète…",
    lignes: 2,
  },
  {
    id: "horizon",
    etape: 2,
    etapeLabel: "Boussole intérieure",
    question: "En 3 mots : où tu es aujourd'hui → où tu veux être dans 3 ans.",
    aide: "Mini-exercice : trois mots pour maintenant, trois pour plus tard.",
    placeholder: "Ex. Coincée, lasse, prête → libre, utile, créative",
    lignes: 2,
  },
];

export interface Scenario {
  titre: string;
  horizon: string; // ex. « 6 mois », « 2 ans »
  description: string;
  avantages: string[];
  vigilance: string[]; // inconvénients / risques + comment réduire
  ressources: string[]; // temps, argent, compétences, réseau
}

export interface Plan {
  sept: string[]; // 7 jours
  trente: string[]; // 30 jours
  indicateurs: string[];
}

export interface Bilan {
  boussole: string; // 1-2 phrases de synthèse
  scenarios: Scenario[];
  plan: Plan;
}

const v = (s?: string) => (s ?? "").trim();

// Combien de champs sont renseignés (pour activer la génération).
export function champsRemplis(r: Reponses): number {
  return QUESTIONS.reduce((n, q) => (v(r[q.id]) ? n + 1 : n), 0);
}

// Prêt à générer : au moins l'essentiel de l'état des lieux + une envie.
export function pretAGenerer(r: Reponses): boolean {
  return Boolean(v(r.pro) || v(r.perso)) && Boolean(v(r.envie) || v(r.valeurs));
}

// Repli maquette (sans clé API) : un bilan dérivé des réponses réelles, jamais un
// texte générique. Volontairement prudent et non prescriptif.
export function mockBilan(r: Reponses): Bilan {
  const envie = v(r.envie) || "l'envie que tu as commencé à nommer";
  const valeurs = v(r.valeurs) || "tes valeurs clés";
  const peur = v(r.peur) || "le principal frein";
  const contrainte = v(r.contrainte) || "ta contrainte actuelle";
  const reussite = v(r.reussite) || "ton propre critère de réussite";

  return {
    boussole: `Ce qui ressort : « ${envie} », porté par ${valeurs}. À garder à l'œil : ${peur}.`,
    scenarios: [
      {
        titre: "Tester sans tout casser",
        horizon: "6 mois",
        description: `Explorer « ${envie} » en parallèle de ta situation actuelle, à petite échelle, pour vérifier l'élan sans te mettre en danger.`,
        avantages: ["Risque limité", "Tu gardes ta sécurité actuelle", "Tu recueilles des preuves concrètes"],
        vigilance: [`Fatigue du double effort — cadre un créneau fixe et protège-le`, `Ne pas rester éternellement en test : fixe une date de bilan`],
        ressources: ["Quelques heures par semaine", "1–2 personnes qui font déjà ça", "De quoi documenter tes essais"],
      },
      {
        titre: "Bascule progressive",
        horizon: "2 ans",
        description: `Réorganiser ta vie pour faire de plus en plus de place à « ${envie} », en tenant compte de ${contrainte}.`,
        avantages: ["Transition maîtrisée", "Le temps d'acquérir ce qui manque", "Moins de choc financier"],
        vigilance: [`${peur} — nomme-la et découpe-la en petites étapes`, `Perte de motivation sur la durée — des jalons visibles aident`],
        ressources: ["Un plan de trésorerie simple", "Une montée en compétences ciblée", "Un soutien (proche, pair, coach)"],
      },
      {
        titre: "Changement franc",
        horizon: "5 ans",
        description: `Faire de « ${envie} » le centre, avec une réorganisation nette. Le plus aligné avec ${valeurs}, le plus exigeant aussi.`,
        avantages: ["Cohérence maximale", "Élan fort", "Un vrai nouveau chapitre"],
        vigilance: [`Exposition plus grande — sécurise un filet (épargne, revenus d'appoint)`, `Isolement possible — construis ton réseau avant de sauter`],
        ressources: ["Une réserve financière", "Un réseau déjà amorcé", "Un cap clair et écrit"],
      },
    ],
    plan: {
      sept: [
        `Écrire noir sur blanc « ${envie} » et pourquoi ça compte`,
        "Parler à 1 personne qui a fait une transition proche",
        "Bloquer 2 créneaux de 30 min pour explorer une piste",
      ],
      trente: [
        "Tester une première action concrète, même minuscule",
        `Chiffrer grossièrement ${contrainte} (ce que ça implique vraiment)`,
        "Faire un point : qu'est-ce qui a bougé, qu'est-ce qui t'a nourri ?",
      ],
      indicateurs: [
        "2 conversations réalisées",
        "1 test concret mené jusqu'au bout",
        `Un pas vers : ${reussite}`,
      ],
    },
  };
}

// Résumé EXPORTABLE (Markdown) : à copier/coller dans Notion, un doc, ou IdentitX.
export function resumeMarkdown(r: Reponses, bilan: Bilan): string {
  const l: string[] = [];
  l.push("# Ma transition — X-sens", "");
  l.push("## Situation actuelle");
  const etatLignes: [string, ChampId][] = [
    ["Pro", "pro"],
    ["Perso & relations", "perso"],
    ["Lieu de vie", "lieu"],
    ["Contrainte majeure", "contrainte"],
    ["Ce qui pèse / ce qui recharge", "energie"],
  ];
  for (const [label, id] of etatLignes) if (v(r[id])) l.push(`- **${label}** : ${v(r[id])}`);
  l.push("");
  l.push("## Boussole intérieure");
  const boussoleLignes: [string, ChampId][] = [
    ["Valeurs clés", "valeurs"],
    ["Envie profonde", "envie"],
    ["Peur / blocage", "peur"],
    ["Critère de réussite", "reussite"],
    ["Aujourd'hui → dans 3 ans", "horizon"],
  ];
  for (const [label, id] of boussoleLignes) if (v(r[id])) l.push(`- **${label}** : ${v(r[id])}`);
  l.push("", `> ${bilan.boussole}`, "");
  l.push("## Scénarios");
  for (const s of bilan.scenarios) {
    l.push(`### ${s.titre} · ${s.horizon}`);
    l.push(s.description);
    if (s.avantages.length) l.push(`- **Avantages** : ${s.avantages.join(" · ")}`);
    if (s.vigilance.length) l.push(`- **Points de vigilance** : ${s.vigilance.join(" · ")}`);
    if (s.ressources.length) l.push(`- **Ressources** : ${s.ressources.join(" · ")}`);
    l.push("");
  }
  l.push("## Plan 30 jours");
  l.push("**Dans les 7 jours**");
  for (const a of bilan.plan.sept) l.push(`- [ ] ${a}`);
  l.push("", "**Dans les 30 jours**");
  for (const a of bilan.plan.trente) l.push(`- [ ] ${a}`);
  l.push("", "**Indicateurs d'avancée**");
  for (const a of bilan.plan.indicateurs) l.push(`- ${a}`);
  l.push("");
  return l.join("\n");
}
