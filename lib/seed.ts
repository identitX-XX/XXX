import {
  IdentityCard,
  JournalEntry,
  Profile,
  RadarPoint,
  Scores,
  TimelineEvent,
} from "@/types";
import { CATEGORIES, RADAR_AXES } from "@/data/constants";

const clamp = (n: number) => Math.max(4, Math.min(100, Math.round(n)));

/** Small deterministic hash so each name/keyword yields a stable variation. */
function seedFrom(str: string): () => number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return () => {
    h += 0x6d2b79f5;
    let t = h;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function computeScores(profile: Profile): Scores {
  const filled =
    (profile.values.filter(Boolean).length +
      profile.strengths.filter(Boolean).length) *
    5;
  return {
    selfKnowledge: clamp(46 + filled + (profile.keyword ? 8 : 0)),
    clarity: clamp(profile.clarity),
    energy: clamp(profile.energy),
    alignment: clamp((profile.clarity + profile.energy) / 2 + filled / 2),
  };
}

export function seedCards(profile: Profile): IdentityCard[] {
  const rnd = seedFrom(profile.name + profile.keyword);
  const v = profile.values.filter(Boolean);
  const s = profile.strengths.filter(Boolean);

  const prefill: Record<string, string> = {
    valeurs: v.length
      ? `Ce qui te guide en premier : ${v.join(", ")}. Tout le reste se négocie, pas ça.`
      : "Nomme les trois principes non négociables qui orientent tes choix.",
    personnalite: `Tu avances par cycles d'expansion puis de recentrage. ${
      profile.keyword ? `Ton mot-clé « ${profile.keyword} » en dit long.` : ""
    }`,
    forces: s.length
      ? `Tes appuis naturels : ${s.join(", ")}. Ceux sur qui tu peux compter même les jours bas.`
      : "Liste ce que les autres viennent chercher chez toi sans que tu forces.",
    talents: "Ce qui te vient sans effort et que tu sous-estimes précisément parce que c'est facile pour toi.",
    competences: "Le savoir-faire acquis, distinct du talent : ce que tu as construit à la main.",
    blessures: "Le point sensible qui, touché, déclenche une réaction disproportionnée. Le connaître, c'est le désarmer.",
    peur: profile.fear
      ? `Ta peur récurrente : ${profile.fear}. On la regarde en face plutôt que de la contourner.`
      : "Nomme la peur qui revient. La nommer réduit déjà son emprise.",
    habitudes: "Les routines qui te portent, et celles qui te coûtent sans que tu t'en rendes compte.",
    relations: "Qui te tire vers le haut, qui te draine. Cartographie honnête, sans jugement.",
    travail: profile.situation
      ? `Situation actuelle : ${profile.situation}. Ce que ça t'apporte, ce que ça te retire.`
      : "Ce que le travail occupe chez toi : sécurité, sens, statut, terrain de jeu ?",
    mission: profile.ambition
      ? `Direction à 12 mois : ${profile.ambition}. Le fil rouge derrière l'objectif.`
      : "La contribution qui donnerait un sens rétrospectif à ton parcours.",
    emotions: "La palette émotionnelle du moment, sans filtre. Ce que tu ressens avant de l'expliquer.",
    energie: `Niveau perçu : ${profile.energy}/100. Ce qui la recharge, ce qui la vide.`,
    motivations: "Ce qui te met en mouvement vraiment, une fois retirée la couche de « il faut ».",
  };

  return CATEGORIES.map((c) => ({
    id: c.key,
    category: c.label,
    text: prefill[c.key] ?? "",
    level: clamp(38 + rnd() * 48),
    tags:
      c.key === "valeurs"
        ? v.slice(0, 3)
        : c.key === "forces"
        ? s.slice(0, 3)
        : [],
  }));
}

export function seedRadar(profile: Profile): RadarPoint[] {
  const rnd = seedFrom(profile.keyword + profile.name);
  const base = 40 + profile.clarity * 0.25 + profile.energy * 0.15;
  return RADAR_AXES.map((axis) => ({
    axis,
    value: clamp(base + rnd() * 42 - 12),
  }));
}

export function seedTimeline(profile: Profile): TimelineEvent[] {
  const rnd = seedFrom(profile.name + "tl");
  const year = new Date().getFullYear();
  const items: Omit<TimelineEvent, "id">[] = [
    {
      date: `${year - 12}`,
      title: "Un choix qui a redéfini la trajectoire",
      importance: clamp(70 + rnd() * 25),
      emotion: "Détermination",
      lesson: "Décider vite quand le contexte est clair.",
      impact: "A ouvert un terrain que tu occupes encore.",
    },
    {
      date: `${year - 6}`,
      title: "Une contraction après une phase d'expansion",
      importance: clamp(55 + rnd() * 25),
      emotion: "Doute",
      lesson: "Le recentrage n'est pas un recul.",
      impact: "A clarifié ce qui compte vraiment.",
    },
    {
      date: `${year - 2}`,
      title: profile.ambition
        ? `Premiers pas vers : ${profile.ambition}`
        : "Un projet posé enfin sur la table",
      importance: clamp(72 + rnd() * 22),
      emotion: "Élan",
      lesson: "Occuper l'espace sans demander la permission.",
      impact: "A relié tes compétences en un seul fil.",
    },
    {
      date: `${year}`,
      title: "Le moment présent : cartographier avant d'accélérer",
      importance: clamp(60 + rnd() * 20),
      emotion: "Clarté",
      lesson: "Voir la structure avant le mouvement.",
      impact: "Point d'appui pour la suite.",
    },
  ];
  return items.map((e, i) => ({ ...e, id: `tl-${i}` }));
}

export function seedJournal(profile: Profile): JournalEntry[] {
  const rnd = seedFrom(profile.name + "jr");
  const today = new Date();
  const entries: JournalEntry[] = [];
  const notes = [
    "Journée dense mais alignée. J'ai tenu ma direction.",
    "Un peu de dispersion. Je repère le pattern avant qu'il s'installe.",
    "Belle énergie ce matin. J'ai avancé sur ce qui compte.",
    "Fatigue en fin de journée, mais une clarté qui reste.",
  ];
  for (let i = 0; i < 4; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i * 2);
    entries.push({
      id: `jr-${i}`,
      date: d.toISOString().slice(0, 10),
      mood: clamp(50 + rnd() * 40),
      energy: clamp(profile.energy - 10 + rnd() * 25),
      stress: clamp(20 + rnd() * 45),
      confidence: clamp(profile.clarity - 5 + rnd() * 25),
      gratitude: i === 0 ? "Le temps pour moi ce matin." : "Un échange qui a fait du bien.",
      thoughts: notes[i % notes.length],
      tags: i === 0 ? profile.values.filter(Boolean).slice(0, 2) : [],
    });
  }
  return entries;
}
