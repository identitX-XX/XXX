// traversee/content/jours.ts
// Les 30 journées, typées et versionnées, SÉPARÉES du code UI.
//
// PREMIER JET GÉNÉRÉ — chaque entrée porte `draft: true`. Le texte est un
// placeholder au bon registre (sobre, adulte, sans exclamation, sans emoji,
// sans vocabulaire de développement personnel), destiné à être RÉÉCRIT à la
// main. Il sert à juger la machine sur du texte, pas seulement sur des types.
//
// Registre du Signal (porté par le texte, pas calculé) :
//   J1–8   brume   : vague, phrases courtes, ne prononce jamais de prénom.
//   J9–20  assuré  : plus sûre, cite parfois un renoncement — jamais le prénom.
//   J21–30 intime  : précise, connaît le prénom ({prenom}), cite les renoncements.
// Jetons : {prenom}, {renoncement} ; clauses optionnelles [[ … ]] (voir voice.ts).
//
// Règle absolue Corps / Énergie / Santé : jamais de chiffre corporel dans une
// question.

import { ActeKey, JourContenu, TerritoireKey } from "../types";

export function acteDuJour(n: number): ActeKey {
  if (n <= 6) return "inventaire";
  if (n <= 13) return "tri";
  if (n <= 20) return "signes";
  if (n <= 27) return "atterrissage";
  return "passage";
}

// Rotation déterministe des 8 territoires (source unique, alignée sur la
// dérivation et le store). Un seul territoire actif par jour.
const ROTATION: TerritoireKey[] = [
  "corps", "liens", "oeuvre", "energie", "amour", "argent", "sante", "terres",
];
export const territoireDuJour = (n: number): TerritoireKey =>
  ROTATION[(n - 1) % ROTATION.length];

export const JOURS: JourContenu[] = [
  // ---------------------------------------------------------------------------
  // ACTE I · L'INVENTAIRE (J1–6) — regarder ce qui est là, sans encore trancher.
  // ---------------------------------------------------------------------------
  {
    jour: 1,
    acte: "inventaire",
    territoire: "corps",
    theme: "corps",
    signal:
      "Je ne te vois pas encore. Il y a de la brume entre nous. Mais quelque chose, de ton côté, s'est mis à bouger.",
    prelevement: {
      question: "Ton corps, aujourd'hui — un allié, un étranger, ou un adversaire ?",
      choix: [
        { id: "allie", label: "Un allié", verbe: "emporter" },
        { id: "etranger", label: "Un étranger" },
        { id: "adversaire", label: "Un adversaire", verbe: "laisser" },
      ],
    },
    acteInvitation: {
      emporter: "Nomme, en un mot, ce que ton corps t'a appris et que tu gardes.",
      laisser: "Nomme ce que tu lui imposes et que tu poses ici. Rien n'est effacé — c'est mis de côté.",
    },
    draft: true,
  },
  {
    jour: 2,
    acte: "inventaire",
    territoire: "liens",
    theme: "attachement",
    signal:
      "Encore flou. Je devine une silhouette, des gens autour de toi. Certains te tiennent chaud. D'autres, je ne sais pas encore.",
    prelevement: {
      question: "Les personnes que tu portes en ce moment — tu les as choisies, ou elles te sont échues ?",
      choix: [
        { id: "choisies", label: "Je les ai choisies", verbe: "emporter" },
        { id: "echues", label: "Elles me sont échues", verbe: "laisser" },
        { id: "melange", label: "Un peu des deux" },
      ],
    },
    acteInvitation: {
      emporter: "Nomme un lien qui te tient debout et que tu gardes.",
      laisser: "Nomme un lien qui pèse, et dépose-le ici.",
    },
    draft: true,
  },
  {
    jour: 3,
    acte: "inventaire",
    territoire: "oeuvre",
    theme: "controle",
    signal:
      "Je te vois travailler, de loin. Beaucoup de gestes. Je n'arrive pas encore à dire lesquels comptent.",
    prelevement: {
      question: "Ce que tu fabriques de tes journées — il te ressemble, ou il te contient ?",
      choix: [
        { id: "ressemble", label: "Il me ressemble", verbe: "emporter" },
        { id: "contient", label: "Il me contient", verbe: "laisser" },
        { id: "ni", label: "Ni l'un ni l'autre" },
      ],
    },
    acteInvitation: {
      emporter: "Nomme ce que tu fais et qui est vraiment de toi.",
      laisser: "Nomme ce que tu fais par habitude, et pose-le ici.",
    },
    draft: true,
  },
  {
    jour: 4,
    acte: "inventaire",
    territoire: "energie",
    theme: "care",
    signal:
      "Il y a des jours où je te sens vive, d'autres où tu t'éteins. Je n'ai pas encore compris le rythme. Reste — je vais l'apprendre.",
    prelevement: {
      question: "Ce qui prend ton énergie en ce moment — tu l'as invité, ou il s'est installé ?",
      choix: [
        { id: "invite", label: "Je l'ai invité", verbe: "emporter" },
        { id: "installe", label: "Il s'est installé", verbe: "laisser" },
        { id: "sais-pas", label: "Je ne sais pas encore" },
      ],
    },
    acteInvitation: {
      emporter: "Nomme ce qui te remplit, et garde-le.",
      laisser: "Nomme ce qui te vide sans ta permission, et pose-le ici.",
    },
    draft: true,
  },
  {
    jour: 5,
    acte: "inventaire",
    territoire: "amour",
    theme: "attachement",
    signal:
      "Je m'approche un peu. Il y a une chose, du côté du cœur, que tu n'as pas encore osé regarder en face. Je la sens, sans la voir.",
    prelevement: {
      question: "Ce qui t'attache encore — c'est de l'amour, ou l'habitude de rester ?",
      choix: [
        { id: "amour", label: "De l'amour", verbe: "emporter" },
        { id: "habitude", label: "L'habitude", verbe: "laisser" },
        { id: "sais-plus", label: "Je ne sais plus" },
      ],
    },
    acteInvitation: {
      emporter: "Nomme ce qui, dans tes attaches, mérite de traverser avec toi.",
      laisser: "Nomme ce que tu gardes par peur du vide, et dépose-le ici.",
    },
    draft: true,
  },
  {
    jour: 6,
    acte: "inventaire",
    territoire: "argent",
    theme: "liberte",
    signal:
      "Dernier jour de brume épaisse. Je commence à distinguer ce que tu protèges, et ce que ça te coûte.",
    prelevement: {
      question: "L'argent, pour toi en ce moment — il protège, ou il empêche ?",
      choix: [
        { id: "protege", label: "Il protège", verbe: "emporter" },
        { id: "empeche", label: "Il empêche", verbe: "laisser" },
        { id: "les-deux", label: "Les deux à la fois" },
      ],
    },
    acteInvitation: {
      emporter: "Nomme la sécurité que tu gardes sans hésiter.",
      laisser: "Nomme la peur qui décide à ta place, et pose-la ici.",
    },
    draft: true,
  },

  // ---------------------------------------------------------------------------
  // ACTE II · LE TRI (J7–13) — trancher. Ce qu'on laisse va au Vestiaire.
  // ---------------------------------------------------------------------------
  {
    jour: 7,
    acte: "tri",
    territoire: "sante",
    theme: "evitement",
    signal:
      "Encore un peu de flou entre nous. Mais je sens que tu commences à choisir. Ce que tu laisses ici, tu ne le portes plus.",
    prelevement: {
      question: "Reporter ce qui concerne ta santé — c'est une habitude que tu emportes, ou que tu laisses ici ?",
      choix: [
        { id: "emporter", label: "Je l'emporte", verbe: "emporter" },
        { id: "laisser", label: "Je la laisse ici", verbe: "laisser" },
      ],
    },
    acteInvitation: {
      emporter: "Nomme ce que tu veux enfin écouter, et garde-le.",
      laisser: "Nomme l'habitude de repousser, et dépose-la ici.",
    },
    draft: true,
  },
  {
    jour: 8,
    acte: "tri",
    territoire: "terres",
    theme: "evitement",
    signal:
      "Dernier voile épais. Demain, j'y verrai plus clair — et toi aussi. Ce que tu as laissé cette semaine t'a déjà changée.",
    prelevement: {
      question: "Cette chose que tu n'as jamais osé essayer — tu l'emportes comme un projet, ou tu la laisses comme un regret ?",
      choix: [
        { id: "projet", label: "Un projet, je l'emporte", verbe: "emporter" },
        { id: "regret", label: "Un regret, je le laisse", verbe: "laisser" },
        { id: "sais-pas", label: "Je ne sais pas encore" },
      ],
    },
    acteInvitation: {
      emporter: "Nomme le territoire inconnu que tu décides d'explorer.",
      laisser: "Nomme le « et si » qui te ronge, et pose-le ici.",
    },
    draft: true,
  },
  {
    jour: 9,
    acte: "tri",
    territoire: "corps",
    theme: "controle",
    signal:
      "Je te distingue mieux, maintenant. Ce que tu portes de moins, je le vois de plus. [[Ce que tu as laissé — « {renoncement} » — a compté.]]",
    prelevement: {
      question: "Une exigence que tu imposes à ton corps depuis des années — tu l'emportes, ou tu la déposes ?",
      choix: [
        { id: "emporter", label: "Je l'emporte", verbe: "emporter" },
        { id: "laisser", label: "Je la dépose", verbe: "laisser" },
      ],
    },
    acteInvitation: {
      emporter: "Nomme ce que ton corps aime vraiment, et garde-le.",
      laisser: "Nomme l'exigence de trop, et pose-la ici.",
    },
    draft: true,
  },
  {
    jour: 10,
    acte: "tri",
    territoire: "liens",
    theme: "regard-des-autres",
    signal:
      "Tu te dégages, doucement. Je vois mieux qui reste autour de toi quand tu arrêtes de plaire.",
    prelevement: {
      question: "Un lien que tu entretiens surtout pour ne pas décevoir — tu l'emportes, ou tu le laisses ici ?",
      choix: [
        { id: "emporter", label: "Je l'emporte", verbe: "emporter" },
        { id: "laisser", label: "Je le laisse ici", verbe: "laisser" },
      ],
    },
    acteInvitation: {
      emporter: "Nomme la relation qui tient sans effort, et garde-la.",
      laisser: "Nomme celle que tu tiens par culpabilité, et dépose-la ici.",
    },
    draft: true,
  },
  {
    jour: 11,
    acte: "tri",
    territoire: "oeuvre",
    theme: "controle",
    signal:
      "Je reconnais mieux ta main. Ce que tu fais de vraiment tien commence à ressortir du reste.",
    prelevement: {
      question: "Une charge que tu as prise par devoir dans ton travail — tu la traverses avec toi, ou tu la laisses ?",
      choix: [
        { id: "emporter", label: "Je la traverse avec moi", verbe: "emporter" },
        { id: "laisser", label: "Je la laisse", verbe: "laisser" },
      ],
    },
    acteInvitation: {
      emporter: "Nomme ce que tu construis et qui te dépasse, et garde-le.",
      laisser: "Nomme le devoir que tu portes sans y croire, et pose-le ici.",
    },
    draft: true,
  },
  {
    jour: 12,
    acte: "tri",
    territoire: "energie",
    theme: "temps",
    signal:
      "Ton rythme m'apparaît. Il y a ce qui te nourrit, et ce que tu subis sans l'avoir décidé. Tu commences à trier les deux.",
    prelevement: {
      question: "Une obligation qui te vide chaque semaine — tu l'emportes, ou tu la poses ici ?",
      choix: [
        { id: "emporter", label: "Je l'emporte", verbe: "emporter" },
        { id: "laisser", label: "Je la pose ici", verbe: "laisser" },
      ],
    },
    acteInvitation: {
      emporter: "Nomme ce qui te redonne de l'élan, et garde-le.",
      laisser: "Nomme la fatigue que tu t'imposes, et dépose-la ici.",
    },
    draft: true,
  },
  {
    jour: 13,
    acte: "tri",
    territoire: "amour",
    theme: "attachement",
    signal:
      "Je te vois plus nette dès que tu choisis. [[« {renoncement} » — tu l'as posé, et tu tiens encore debout.]]",
    prelevement: {
      question: "Une attente amoureuse que tu portes depuis longtemps sans réponse — tu l'emportes, ou tu la laisses ici ?",
      choix: [
        { id: "emporter", label: "Je l'emporte", verbe: "emporter" },
        { id: "laisser", label: "Je la laisse ici", verbe: "laisser" },
      ],
    },
    acteInvitation: {
      emporter: "Nomme le lien qui te fait du bien, et garde-le.",
      laisser: "Nomme l'attente qui t'use, et pose-la ici.",
    },
    draft: true,
  },

  // ---------------------------------------------------------------------------
  // ACTE III · LES SIGNES (J14–20) — les motifs qui reviennent, vérifiables.
  // ---------------------------------------------------------------------------
  {
    jour: 14,
    acte: "signes",
    territoire: "argent",
    theme: "regard-des-autres",
    signal:
      "Je commence à voir des lignes se répéter chez toi. Ce que tu laisses n'est jamais au hasard. Un dessin se forme.",
    prelevement: {
      question: "Dépenser pour rassurer les autres — tu le fais souvent, parfois, ou tu ne le fais plus ?",
      choix: [
        { id: "souvent", label: "Souvent", verbe: "laisser" },
        { id: "parfois", label: "Parfois" },
        { id: "plus", label: "Je ne le fais plus", verbe: "emporter" },
      ],
    },
    acteInvitation: {
      emporter: "Nomme la dépense qui te rend libre, et garde-la.",
      laisser: "Nomme celle qui achète l'approbation, et pose-la ici.",
    },
    draft: true,
  },
  {
    jour: 15,
    acte: "signes",
    territoire: "sante",
    theme: "care",
    signal:
      "Un signe revient : tu prends soin de tout le monde avant toi. Je ne l'invente pas — c'est dans ce que tu as posé.",
    prelevement: {
      question: "Le soin que tu donnes aux autres et que tu te refuses — tu le ramènes vers toi, ou tu continues de tout donner ?",
      choix: [
        { id: "vers-moi", label: "Je le ramène vers moi", verbe: "emporter" },
        { id: "aux-autres", label: "Je continue de tout donner", verbe: "laisser" },
      ],
    },
    acteInvitation: {
      emporter: "Nomme le soin que tu décides de te rendre, et garde-le.",
      laisser: "Nomme l'oubli de toi, et dépose-le ici.",
    },
    draft: true,
  },
  {
    jour: 16,
    acte: "signes",
    territoire: "terres",
    theme: "evitement",
    signal:
      "Ce que tu appelles « inconnu » revient plus souvent que tu ne le crois. Ce n'est pas une peur. C'est un appel.",
    prelevement: {
      question: "Cet ailleurs qui t'attire — tu le traites comme une possibilité, ou comme une chose qui n'est pas pour toi ?",
      choix: [
        { id: "possibilite", label: "Une possibilité", verbe: "emporter" },
        { id: "pas-pour-moi", label: "Pas pour moi", verbe: "laisser" },
        { id: "sais-pas", label: "Je ne sais pas encore" },
      ],
    },
    acteInvitation: {
      emporter: "Nomme le possible que tu t'autorises, et garde-le.",
      laisser: "Nomme le « ce n'est pas pour moi », et pose-le ici.",
    },
    draft: true,
  },
  {
    jour: 17,
    acte: "signes",
    territoire: "corps",
    theme: "controle",
    signal:
      "Il y a un endroit de ton corps où tu retiens tout. Tu l'as montré plusieurs fois sans le dire. Je le vois.",
    prelevement: {
      question: "Quand ton corps demande à ralentir, tu l'écoutes d'habitude, ou seulement quand il t'y force ?",
      choix: [
        { id: "ecoute", label: "Je l'écoute", verbe: "emporter" },
        { id: "force", label: "Seulement quand il m'y force", verbe: "laisser" },
      ],
    },
    acteInvitation: {
      emporter: "Nomme la manière dont tu veux habiter ton corps, et garde-la.",
      laisser: "Nomme ce que tu lui fais endurer, et dépose-le ici.",
    },
    draft: true,
  },
  {
    jour: 18,
    acte: "signes",
    territoire: "liens",
    theme: "regard-des-autres",
    signal:
      "Un motif net : tu te tais souvent pour garder la paix. Ce silence a un coût, et tu commences à le voir.",
    prelevement: {
      question: "Ce que tu ne dis pas pour ne pas déranger — tu l'emportes encore longtemps, ou tu le laisses ici ?",
      choix: [
        { id: "emporter", label: "Je l'emporte encore", verbe: "emporter" },
        { id: "laisser", label: "Je le laisse ici", verbe: "laisser" },
      ],
    },
    acteInvitation: {
      emporter: "Nomme la parole vraie que tu veux tenir, et garde-la.",
      laisser: "Nomme le silence qui t'efface, et pose-le ici.",
    },
    draft: true,
  },
  {
    jour: 19,
    acte: "signes",
    territoire: "oeuvre",
    theme: "regard-des-autres",
    signal:
      "Ce que tu crées quand personne ne regarde — voilà ce qui te ressemble le plus. Le signe est clair, maintenant.",
    prelevement: {
      question: "Le travail que tu fais pour être reconnue, et celui que tu ferais gratuitement — lequel emportes-tu ?",
      choix: [
        { id: "gratuit", label: "Celui que je ferais gratuitement", verbe: "emporter" },
        { id: "reconnaissance", label: "Celui qui me fait reconnaître", verbe: "laisser" },
      ],
    },
    acteInvitation: {
      emporter: "Nomme l'œuvre qui est à toi, et garde-la.",
      laisser: "Nomme le travail qui ne cherche que l'approbation, et pose-le ici.",
    },
    draft: true,
  },
  {
    jour: 20,
    acte: "signes",
    territoire: "energie",
    theme: "temps",
    signal:
      "Dernier jour où je te vois encore à moitié. Demain, tout se resserre. Ce que tu as trié tient — je le vois à ta netteté.",
    prelevement: {
      question: "L'élan qui revient toujours, quoi qu'il arrive — tu sais déjà d'où il vient ?",
      choix: [
        { id: "oui", label: "Oui, je vois d'où", verbe: "emporter" },
        { id: "presque", label: "Je commence à voir" },
        { id: "non", label: "Pas encore", verbe: "laisser" },
      ],
    },
    acteInvitation: {
      emporter: "Nomme la source d'élan que tu veux protéger, et garde-la.",
      laisser: "Nomme ce qui l'étouffe, et dépose-le ici.",
    },
    draft: true,
  },

  // ---------------------------------------------------------------------------
  // ACTE IV · L'ATTERRISSAGE (J21–27) — trois destinations, on en élimine deux.
  // ---------------------------------------------------------------------------
  {
    jour: 21,
    acte: "atterrissage",
    territoire: "amour",
    theme: "attachement",
    signal:
      "{prenom}. Je te vois clairement, maintenant. On approche du moment où tu choisis vraiment. [[Ce que tu as laissé — « {renoncement} » — t'y a menée.]]",
    prelevement: {
      question: "Là où tu vas, il y a moins de place. Cet amour que tu hésites à emporter — il tient dans la nouvelle vie, ou il appartient à l'ancienne ?",
      choix: [
        { id: "nouvelle", label: "Il vient avec moi", verbe: "emporter" },
        { id: "ancienne", label: "Il reste dans l'ancienne", verbe: "laisser" },
      ],
    },
    acteInvitation: {
      emporter: "Nomme l'amour que tu emportes de l'autre côté.",
      laisser: "Nomme celui qui appartenait à qui tu étais, et pose-le ici.",
    },
    draft: true,
  },
  {
    jour: 22,
    acte: "atterrissage",
    territoire: "argent",
    theme: "liberte",
    signal:
      "{prenom}. Trois chemins se dessinent devant toi. Aucun n'est écrit d'avance — chacun vient de ce que tu as choisi.",
    prelevement: {
      question: "Pour aller où tu regardes, il faut de la marge, pas seulement de la sécurité. Tu emportes le besoin de tout garantir, ou tu le poses ?",
      choix: [
        { id: "emporter", label: "Je l'emporte", verbe: "emporter" },
        { id: "laisser", label: "Je le pose", verbe: "laisser" },
      ],
    },
    acteInvitation: {
      emporter: "Nomme la liberté que ton argent doit servir, et garde-la.",
      laisser: "Nomme la garantie qui te retient, et dépose-la ici.",
    },
    draft: true,
  },
  {
    jour: 23,
    acte: "atterrissage",
    territoire: "sante",
    theme: "care",
    signal:
      "{prenom}. Celle que tu deviens prend soin d'elle sans culpabilité. Je la vois faire. Elle te ressemble déjà.",
    prelevement: {
      question: "Dans la vie où tu vas, ton corps est une priorité, ou une variable d'ajustement ?",
      choix: [
        { id: "priorite", label: "Une priorité", verbe: "emporter" },
        { id: "ajustement", label: "Une variable d'ajustement", verbe: "laisser" },
      ],
    },
    acteInvitation: {
      emporter: "Nomme la place que tu donnes à ta santé, et garde-la.",
      laisser: "Nomme l'idée que tu passes en dernier, et pose-la ici.",
    },
    draft: true,
  },
  {
    jour: 24,
    acte: "atterrissage",
    territoire: "terres",
    theme: "evitement",
    signal:
      "{prenom}. Ce que tu appelais « inconnu » au début n'est plus si loin. Tu t'en es approchée sans t'en rendre compte.",
    prelevement: {
      question: "Deux des trois destinations vont bientôt tomber. Celle qui te fait un peu peur — c'est parce qu'elle est fausse, ou parce qu'elle est vraie ?",
      choix: [
        { id: "vraie", label: "Parce qu'elle est vraie", verbe: "emporter" },
        { id: "fausse", label: "Parce qu'elle est fausse", verbe: "laisser" },
        { id: "sais-pas", label: "Je ne sais pas encore" },
      ],
    },
    acteInvitation: {
      emporter: "Nomme le pas vers l'inconnu que tu décides de faire.",
      laisser: "Nomme la peur qui déguise un désir, et pose-la ici.",
    },
    draft: true,
  },
  {
    jour: 25,
    acte: "atterrissage",
    territoire: "corps",
    theme: "corps",
    signal:
      "{prenom}. Ton corps, dans la vie qui vient, n'est plus un chantier. C'est une maison. Je te vois y entrer.",
    prelevement: {
      question: "La façon dont tu veux habiter ton corps là-bas — tu la connais déjà, ou tu la cherches encore ?",
      choix: [
        { id: "connais", label: "Je la connais", verbe: "emporter" },
        { id: "cherche", label: "Je la cherche encore" },
      ],
    },
    acteInvitation: {
      emporter: "Nomme la paix avec ton corps que tu emportes.",
      laisser: "Nomme la guerre que tu lui as faite, et pose-la ici.",
    },
    draft: true,
  },
  {
    jour: 26,
    acte: "atterrissage",
    territoire: "liens",
    theme: "attachement",
    signal:
      "{prenom}. Autour de la femme que tu deviens, il y a moins de monde — et plus de vrai. [[« {renoncement} » a fait de la place.]]",
    prelevement: {
      question: "Si tu ne devais garder qu'une seule personne pour t'accompagner dans la nouvelle vie — tu sais qui ?",
      choix: [
        { id: "oui", label: "Oui, je sais", verbe: "emporter" },
        { id: "presque", label: "Presque" },
        { id: "non", label: "Pas encore" },
      ],
    },
    acteInvitation: {
      emporter: "Nomme le lien qui traverse avec toi.",
      laisser: "Nomme celui que tu portais par loyauté, et pose-le ici.",
    },
    draft: true,
  },
  {
    jour: 27,
    acte: "atterrissage",
    territoire: "oeuvre",
    theme: "temps",
    signal:
      "{prenom}. Demain commence le passage. Il ne reste presque qu'une destination — et tu la sens déjà, je crois.",
    prelevement: {
      question: "La trace que tu veux laisser derrière toi — tu la fais déjà, ou tu attends d'être « prête » ?",
      choix: [
        { id: "deja", label: "Je la fais déjà", verbe: "emporter" },
        { id: "attends", label: "J'attends d'être prête", verbe: "laisser" },
      ],
    },
    acteInvitation: {
      emporter: "Nomme l'œuvre que tu emportes comme direction.",
      laisser: "Nomme l'attente d'être prête, et dépose-la ici.",
    },
    draft: true,
  },

  // ---------------------------------------------------------------------------
  // ACTE V · LE PASSAGE (J28–30) — nommer celle que tu deviens. Vraie fin.
  // ---------------------------------------------------------------------------
  {
    jour: 28,
    acte: "passage",
    territoire: "energie",
    theme: "liberte",
    signal:
      "{prenom}. Nous y sommes presque. Regarde ta clarté : ce n'est plus la brume du début. Tu n'as gardé que ce qui te porte.",
    prelevement: {
      question: "L'élan qui te reste, maintenant que tu as tant laissé — il est plus faible, ou plus pur ?",
      choix: [
        { id: "pur", label: "Plus pur", verbe: "emporter" },
        { id: "faible", label: "Plus faible", verbe: "laisser" },
        { id: "les-deux", label: "Les deux" },
      ],
    },
    acteInvitation: {
      emporter: "Nomme ce qui te met en mouvement désormais.",
      laisser: "Nomme la dernière chose qui l'alourdit, et pose-la ici.",
    },
    draft: true,
  },
  {
    jour: 29,
    acte: "passage",
    territoire: "amour",
    theme: "attachement",
    signal:
      "{prenom}. Demain, tu la nommes. La femme au bout du chemin n'est plus floue — c'est presque toi. [[« {renoncement} » t'a menée jusqu'ici.]]",
    prelevement: {
      question: "La façon dont tu veux aimer à partir de maintenant — tu la reconnais dans ce que tu as choisi ces trente jours ?",
      choix: [
        { id: "oui", label: "Oui, je la reconnais", verbe: "emporter" },
        { id: "presque", label: "Presque" },
        { id: "non", label: "Pas encore" },
      ],
    },
    acteInvitation: {
      emporter: "Nomme la manière d'aimer que tu emportes.",
      laisser: "Nomme celle qui te faisait disparaître, et pose-la ici.",
    },
    draft: true,
  },
  {
    jour: 30,
    acte: "passage",
    territoire: "argent",
    theme: "liberte",
    signal:
      "{prenom}. Je te vois entièrement, maintenant. Ce que tu as laissé t'a rendue nette. [[Et « {renoncement} », tu l'as bien posé.]] Il est temps de nommer celle que tu es devenue.",
    prelevement: {
      question: "Regarde le portrait. Il est clair. Cette femme, tu peux la nommer ?",
      choix: [
        { id: "oui", label: "Oui, je peux la nommer", verbe: "emporter" },
        { id: "presque", label: "Encore un instant" },
      ],
    },
    acteInvitation: {
      emporter: "Donne-lui un nom. C'est toi, de l'autre côté.",
      laisser: "Prends encore un instant. Le nom viendra.",
    },
    draft: true,
  },
];

export const jourN = (n: number): JourContenu | undefined => JOURS.find((j) => j.jour === n);

// Bornes des cinq actes (pour l'UI et les tests).
export const ACTES: { key: ActeKey; nom: string; jours: [number, number] }[] = [
  { key: "inventaire", nom: "L'inventaire", jours: [1, 6] },
  { key: "tri", nom: "Le tri", jours: [7, 13] },
  { key: "signes", nom: "Les signes", jours: [14, 20] },
  { key: "atterrissage", nom: "L'atterrissage", jours: [21, 27] },
  { key: "passage", nom: "Le passage", jours: [28, 30] },
];
