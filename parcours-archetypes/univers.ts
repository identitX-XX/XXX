// Les 4 UNIVERS — non plus des « peaux de jeu » pour la Quête (supprimées),
// mais des ENTRÉES pour approfondir ta signature : quatre angles de lecture
// (saisons, mouvement, projection, mémoire) qui font regarder la même signature
// autrement. Déterministe, testable, sans IA. Sobre — l'UI reste lin & prune.

export type UniversKey = "nature" | "urbain" | "futuriste" | "retro";

export interface Univers {
  key: UniversKey;
  nom: string;
  lentille: string; // la promesse : sous quel angle on relit la signature
}

export const UNIVERS: Univers[] = [
  { key: "nature", nom: "Nature", lentille: "au fil des saisons — ce qui pousse, ce qui repose" },
  { key: "urbain", nom: "Urbain", lentille: "dans le mouvement — ce qui tient malgré le bruit" },
  { key: "futuriste", nom: "Futuriste", lentille: "projetée — ce qu'elle devient si tu la laisses grandir" },
  { key: "retro", nom: "Rétro", lentille: "et ta mémoire — d'où elle te vient" },
];

export const universByKey: Record<UniversKey, Univers> = Object.fromEntries(
  UNIVERS.map((u) => [u.key, u])
) as Record<UniversKey, Univers>;

export interface LectureUnivers {
  titre: string;
  texte: string;
  question: string; // l'invitation finale — l'« entrée » pour aller plus loin
}

// Chaque univers relit la signature `a` (nom) sous son angle propre. Le texte
// interpole le nom de la signature ; la question clôt sur une entrée concrète.
const LENTILLES: Record<UniversKey, (a: string) => LectureUnivers> = {
  nature: (a) => ({
    titre: `« ${a} » au fil des saisons`,
    texte: `Comme la nature, « ${a} » a ses saisons. En ce moment, est-elle en pleine sève, ou dans un repos qui prépare la suite ? Ce qui pousse en toi demande peut-être plus de lumière — ou plus de patience. La croissance a son rythme : tu n'as pas à la forcer.`,
    question: `Dans quelle saison est ta signature aujourd'hui — et de quoi a-t-elle besoin pour continuer de pousser ?`,
  }),
  urbain: (a) => ({
    titre: `« ${a} » dans le mouvement`,
    texte: `Dans le bruit et la vitesse, « ${a} » se révèle autrement. La ville n'éteint pas ta signature : elle en teste la clarté. Là où tout s'agite, elle tient sa ligne — ou se laisse emporter.`,
    question: `Repère un moment récent, en pleine agitation, où rester « ${a} » t'a demandé un vrai choix. Qu'as-tu appris ?`,
  }),
  futuriste: (a) => ({
    titre: `« ${a} », projetée`,
    texte: `Projette « ${a} » un an plus loin, si tu la laisses grandir sans te freiner. Le futur n'est pas un lieu : c'est une direction que ta signature indique déjà. Elle ouvre des portes que tu n'oses pas encore nommer.`,
    question: `Quelle porte « ${a} » ouvrirait-elle cette année si tu cessais de te retenir ?`,
  }),
  retro: (a) => ({
    titre: `« ${a} » et ta mémoire`,
    texte: `D'où te vient « ${a} » ? Remonte le fil : un moment, une personne, une épreuve l'ont forgée. La reconnaître dans ton passé, c'est cesser de la croire fragile — elle t'accompagne depuis longtemps.`,
    question: `Quelle histoire ancienne « ${a} » raconte-t-elle encore en toi aujourd'hui ?`,
  }),
};

export function lectureUnivers(archName: string, key: UniversKey): LectureUnivers {
  const a = (archName || "ta signature").trim();
  return LENTILLES[key](a);
}
