// Bibliothèque d'exercices — au-delà de l'écart croire/penser/faire, d'autres
// pratiques identitaires. Chaque jour, deux d'entre elles sont proposées (en
// plus de l'écart), en rotation, teintées par la signature du moment. Elles
// nourrissent, elles aussi, l'éclairage quotidien.

export interface TypeExercice {
  id: string;
  nom: string;
  prompt: string; // rendu avec {sig} = signature du moment
}

export const LIB_EXERCICES: TypeExercice[] = [
  {
    id: "delestage",
    nom: "Le délestage",
    prompt: "Qu'est-ce que tu portes encore, et que tu voudrais déposer aujourd'hui ?",
  },
  {
    id: "experimentation",
    nom: "L'expérimentation",
    prompt: "Un micro-geste inhabituel, teinté de « {sig} », à tenter avant ce soir ?",
  },
  {
    id: "recadrage",
    nom: "Le recadrage",
    prompt: "Une croyance qui te limite — et si l'inverse était aussi vrai ? Retourne-la.",
  },
  {
    id: "projection",
    nom: "La projection",
    prompt: "La version de toi alignée sur ta direction : que ferait-elle, là, maintenant ?",
  },
  {
    id: "ancrage",
    nom: "L'ancrage",
    prompt: "Où, dans ton corps, sens-tu « {sig} » aujourd'hui ? Décris la sensation.",
  },
  {
    id: "confrontation",
    nom: "La confrontation douce",
    prompt: "La conversation ou la décision que tu évites — nomme-la, sans t'obliger à agir.",
  },
  {
    id: "celebration",
    nom: "La célébration",
    prompt: "Une chose, même minuscule, que tu peux célébrer aujourd'hui ?",
  },
  {
    id: "temoin",
    nom: "Le témoin",
    prompt: "Quel schéma t'as-tu vu rejouer aujourd'hui, sans le juger, juste en le remarquant ?",
  },
];

// Deux exercices du jour (en plus de l'écart), en rotation déterministe.
export function pratiquesDuJour(jour: number): TypeExercice[] {
  const n = LIB_EXERCICES.length;
  const i = ((jour - 1) % n + n) % n;
  return [LIB_EXERCICES[i], LIB_EXERCICES[(i + 3) % n]];
}

export function promptRendu(t: TypeExercice, signature: string): string {
  return t.prompt.replace(/\{sig\}/g, signature || "ta signature");
}
