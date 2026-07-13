import { Profile, Scores } from "@/types";

/**
 * MVP coach: composes empathetic, contextual answers from the profile — no API,
 * no secrets, deploys clean. To upgrade to a real model later, add an API route
 * (app/api/coach/route.ts) that calls your provider and swap `coachReply` for a
 * fetch to it.
 */
export function coachReply(question: string, profile: Profile, scores: Scores): string {
  const q = question.toLowerCase();
  const name = profile.name || "toi";
  const values = profile.values.filter(Boolean);
  const strengths = profile.strengths.filter(Boolean);

  if (q.includes("qui suis")) {
    return `${name}, ce que je lis de ton profil : quelqu'un qui avance par cycles d'expansion puis de recentrage${
      values.length ? `, ancré autour de ${values.join(", ")}` : ""
    }. Ta clarté est à ${scores.clarity}/100 — assez pour agir, assez d'inconnu pour rester curieux. Ton identité ne se résume pas à un rôle : elle se construit dans le mouvement.`;
  }
  if (q.includes("bloque") || q.includes("blocage")) {
    return `Le blocage que tu nommes${
      profile.blocker ? ` — ${profile.blocker}` : ""
    } tient souvent moins à un manque de capacité qu'à une question de légitimité : « ai-je le droit d'occuper cet espace durablement ? ». ${
      profile.fear ? `Ta peur de ${profile.fear} y joue sa partition. ` : ""
    }La sortie n'est pas frontale. Occupe l'espace par glissement, un pas concret à la fois.`;
  }
  if (q.includes("profil")) {
    return `Ton profil combine des forces rarement réunies${
      strengths.length ? ` : ${strengths.join(", ")}` : ""
    }. Connaissance de soi ${scores.selfKnowledge}, clarté ${scores.clarity}, alignement ${scores.alignment}. La marge de progression est du côté de l'ancrage : transformer des élans en structures qui tiennent sans toi.`;
  }
  if (q.includes("schéma") || q.includes("schema") || q.includes("répète") || q.includes("repete")) {
    return `Le schéma le plus visible : expansion puis contraction. Tu déploies large, puis tu resserres — souvent au moment où ça allait devenir permanent. Ce n'est pas un défaut, c'est un mode. La question utile : qu'est-ce qui rendrait l'expansion soutenable, pour que tu n'aies plus à te contracter pour te protéger ?`;
  }
  if (q.includes("évoluer") || q.includes("evoluer") || q.includes("avancer")) {
    return `Pour évoluer sans te trahir : garde ${
      values.length ? values.join(", ") : "tes valeurs"
    } comme boussole, et choisis un seul terrain où tu t'autorises à rester. ${
      profile.ambition ? `Ton ambition — ${profile.ambition} — ` : "Ton ambition "
    }gagne à être découpée en un prochain pas visible cette semaine.`;
  }
  if (q.includes("talent") || q.includes("caché") || q.includes("cache")) {
    return `Tes talents cachés sont ceux qui te viennent sans effort — donc que tu sous-estimes. ${
      strengths.length ? `Regarde du côté de ${strengths.join(", ")} : ` : "Regarde ce que les autres viennent chercher chez toi : "
    }c'est là que se logent des compétences que tu offres sans les facturer, au propre comme au figuré.`;
  }
  return `Je t'écoute, ${name}. Reformule si tu veux, ou pars d'une des questions suggérées — je m'appuie sur ton profil (valeurs, forces, ambition) pour te répondre au plus juste.`;
}

export const COACH_SUGGESTIONS = [
  "Qui suis-je ?",
  "Pourquoi je bloque ?",
  "Quel est mon profil ?",
  "Quels schémas je répète ?",
  "Comment évoluer ?",
  "Quels sont mes talents cachés ?",
];
