// Contenu des offres premium 1 et 3.
//   · Offre 1 — approfondir un PÉRIMÈTRE (perso / pro / relationnel) — 4,50 €.
//   · Offre 3 — panel de 10 QUESTIONS par périmètre (perso / pro / identitaire
//     / relationnel) — 2,50 €.
// Contenu déterministe (authoré + composé sur les données de l'utilisatrice) :
// fiable, sans IA. Logique pure et testée.

export type PerimetreQ = "perso" | "pro" | "identitaire" | "relationnel";
export type PerimetreA = "perso" | "pro" | "relationnel";

export const LABEL_PERIMETRE: Record<PerimetreQ, string> = {
  perso: "Perso",
  pro: "Pro",
  identitaire: "Identitaire",
  relationnel: "Relationnel",
};

// --- Offre 3 : 10 questions par périmètre -----------------------------------
export const PANELS_QUESTIONS: Record<PerimetreQ, string[]> = {
  perso: [
    "Qu'est-ce qui, dans ta semaine, te vide vraiment — et qu'est-ce qui te recharge ?",
    "Quel besoin fais-tu passer en dernier, systématiquement ?",
    "À quel moment de la journée es-tu le plus toi-même ?",
    "Quelle habitude tiens-tu par devoir, plus par envie ?",
    "Qu'est-ce que ton corps essaie de te dire que tu n'écoutes pas ?",
    "Si tu t'accordais une heure rien qu'à toi demain, qu'en ferais-tu ?",
    "Quelle part de toi mets-tu en veille pour « tenir » ?",
    "Qu'est-ce qui te ferait dire, ce soir, que ta journée t'a nourrie ?",
    "De quoi as-tu besoin de te reposer, au-delà du sommeil ?",
    "Quel plaisir simple as-tu cessé de t'autoriser ?",
  ],
  pro: [
    "Qu'est-ce qui te ferait sentir à ta juste place dans ton travail ?",
    "Quelle tâche repousses-tu, et qu'est-ce qu'elle touche en toi ?",
    "Où mets-tu de l'énergie qui ne te revient jamais ?",
    "Quelle compétence n'oses-tu pas encore revendiquer ?",
    "Si tu n'avais pas peur du regard, quel projet lancerais-tu ?",
    "Qu'est-ce qui, dans ta façon de travailler, ne te ressemble plus ?",
    "Quelle décision pro évites-tu de trancher — et pourquoi ?",
    "À quoi ressemblerait un « assez » qui te suffirait vraiment ?",
    "Quelle réussite minimises-tu quand on t'en parle ?",
    "Qu'est-ce que tu construirais si l'échec n'était qu'une étape ?",
  ],
  identitaire: [
    "Quelle facette de toi montres-tu le moins, et pourquoi ?",
    "Qu'est-ce qui reste vrai de toi, quel que soit le contexte ?",
    "Quelle étiquette qu'on t'a collée ne te va plus ?",
    "Entre qui tu crois être et qui tu montres, où est l'écart ?",
    "Qu'est-ce que tu protèges en te contenant ?",
    "Quelle contradiction en toi as-tu cessé de vouloir « résoudre » ?",
    "De quoi es-tu le plus fière et que tu dis le moins ?",
    "Quelle version de toi commence à émerger ces temps-ci ?",
    "Qu'est-ce que tu ferais si tu t'autorisais à être « trop » ?",
    "Qui étais-tu avant d'apprendre à te modérer ?",
  ],
  relationnel: [
    "À qui n'oses-tu pas dire ce que tu penses vraiment ?",
    "Quelle limite aurais-tu besoin de poser, et à qui ?",
    "Dans quelle relation te sens-tu le plus toi-même ?",
    "Qu'est-ce que tu donnes sans jamais le demander en retour ?",
    "Quel non-dit pèse en ce moment sur un lien qui compte ?",
    "Qui te tire vers le haut — et le sait-il ?",
    "Quel rôle joues-tu dans ta famille que tu n'as pas choisi ?",
    "Qu'est-ce que tu attends que les autres devinent ?",
    "À qui aurais-tu besoin de dire merci, vraiment ?",
    "Quelle relation te coûte plus qu'elle ne t'apporte ?",
  ],
};

// --- Offre 1 : approfondissement d'un périmètre -----------------------------
const ANGLE: Record<PerimetreA, string> = {
  perso: "ton équilibre, ton corps, ton énergie",
  pro: "ton travail, tes projets, ta façon d'agir",
  relationnel: "tes proches, ton couple, ta famille, tes amis",
};

// 3 pistes concrètes par périmètre (le nom de la signature s'y glisse).
const PISTES: Record<PerimetreA, ((sig: string) => string)[]> = {
  perso: [
    (s) => `Repère UN moment de ta journée où « ${s} » n'a aucune place — et rends-lui-en un peu.`,
    () => `Choisis une habitude qui t'épuise et allège-la d'un cran, sans la supprimer.`,
    () => `Note ce soir la sensation corporelle la plus forte de ta journée : elle te renseigne sur ton vrai niveau d'énergie.`,
  ],
  pro: [
    (s) => `Formule à voix haute ce que « ${s} » voudrait construire ici — puis fais-en le plus petit pas dès demain.`,
    () => `Identifie la tâche que tu repousses le plus : nomme précisément ce qu'elle touche (peur, ennui, sens).`,
    () => `Ose une prise de parole que tu retiens d'habitude, et observe ce que ça déplace.`,
  ],
  relationnel: [
    (s) => `Choisis une personne à qui « ${s} » aurait quelque chose de vrai à dire — et dis-le, simplement.`,
    () => `Pose une petite limite avec douceur, là où tu dis « oui » de trop.`,
    () => `Offre une attention gratuite à quelqu'un, sans rien attendre en retour — et vois l'effet sur toi.`,
  ],
};

export interface Approfondissement {
  titre: string;
  lecture: string;
  pistes: string[];
}

export function approfondissementPerimetre(
  perimetre: PerimetreA,
  direction: string,
  sigName: string,
  sigForce: string,
  sigOmbre: string
): Approfondissement {
  const angle = ANGLE[perimetre];
  const cap = direction && direction.trim() ? `« ${direction.trim()} »` : "ce qui compte pour toi";
  const lecture =
    `Sur ${angle}, ton cap est ${cap}. ` +
    `Ta signature « ${sigName} » y apporte une force nette — ${sigForce.toLowerCase()} — ` +
    `mais guette aussi sa zone d'ombre : ${sigOmbre.toLowerCase()} ` +
    `L'enjeu ici n'est pas d'en faire plus, mais de laisser ta force servir ton cap sans que l'ombre ne prenne la barre.`;
  return {
    titre: `Ton ${LABEL_PERIMETRE[perimetre].toLowerCase()} en profondeur`,
    lecture,
    pistes: PISTES[perimetre].map((f) => f(sigName)),
  };
}
