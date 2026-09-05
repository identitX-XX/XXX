// Trois exercices du jour ADOSSÉS à chaque volet de la quête — capsule (habiter
// ta signature), explore (ta signature émergente), construis (ta direction).
// Ils CHANGENT chaque jour : rotation déterministe par blocs de 3 sur le numéro
// du jour. Interpolent la signature (et la direction pour « construis »).
// Pur, sans IA, testé.

export type VoletKey = "capsule" | "explore" | "construis";

// Pools de 10 → le balayage par blocs de 3 fait tourner les consignes jour après
// jour (répétition exacte seulement tous les 10 jours).
const POOLS: Record<VoletKey, ((a: string) => string)[]> = {
  capsule: [
    (a) => `Repère un moment d'aujourd'hui où « ${a} » s'est exprimée sans effort. Note-le.`,
    (a) => `Prends une décision de ta journée exactement à la manière de « ${a} ».`,
    (a) => `Où as-tu bridé « ${a} » aujourd'hui ? Qu'est-ce qui t'a retenue ?`,
    (a) => `Offre à « ${a} » cinq minutes de pleine place aujourd'hui. Qu'est-ce que ça change ?`,
    (a) => `Quelle émotion « ${a} » a-t-elle réveillée aujourd'hui ? Nomme-la précisément.`,
    (a) => `Dans une interaction, laisse « ${a} » parler à ta place, une fois.`,
    (a) => `Repère un automatisme contraire à « ${a} ». Remplace-le une fois aujourd'hui.`,
    (a) => `Qu'est-ce que « ${a} » a besoin que tu oses, là, maintenant ?`,
    (a) => `Ce soir, note un geste où tu t'es pleinement reconnue en « ${a} ».`,
    (a) => `Si « ${a} » tenait le volant une heure aujourd'hui, que ferait-elle en premier ?`,
  ],
  explore: [
    (a) => `« ${a} » monte en toi ces jours-ci. Où l'as-tu sentie pointer aujourd'hui ?`,
    (a) => `Tente une chose que « ${a} » ferait, mais que tu ne fais jamais.`,
    (a) => `Qu'est-ce que « ${a} » t'autorise, que ton habitude t'interdit ?`,
    (a) => `Observe une personne qui incarne « ${a} ». Qu'est-ce que tu lui empruntes ?`,
    (a) => `Où « ${a} » te fait-elle un peu peur ? Approche-toi d'un pas.`,
    (a) => `Donne un petit rôle à « ${a} » dans ta journée de demain.`,
    (a) => `Quelle part de toi « ${a} » vient-elle rééquilibrer ?`,
    (a) => `Si « ${a} » décidait à ta place aujourd'hui, que choisirait-elle ?`,
    (a) => `Note une situation récente où « ${a} » aurait tout changé.`,
    (a) => `Nomme la première petite peur qui t'éloigne de « ${a} ». Regarde-la en face.`,
  ],
  construis: [
    (d) => `Vers ${d} : quel est le plus petit pas possible aujourd'hui ?`,
    (d) => `Qu'est-ce qui te rapproche vraiment de ${d} — et qu'est-ce qui n'est que de l'agitation ?`,
    (d) => `Nomme un obstacle à ${d}. Qu'est-ce que tu peux en retirer aujourd'hui ?`,
    (d) => `À qui pourrais-tu parler de ${d} cette semaine ?`,
    (d) => `Qu'est-ce que ${d} demande que tu arrêtes de faire ?`,
    (d) => `Imagine ${d} atteint : qu'est-ce qui a changé dans tes journées ?`,
    (d) => `Bloque quinze minutes aujourd'hui pour ${d}. Rien d'autre.`,
    (d) => `Quel serait le signe, ce soir, que tu as avancé vers ${d} ?`,
    (d) => `Qu'est-ce que ${d} dit de ce qui compte vraiment pour toi ?`,
    (d) => `Quelle habitude, minuscule, rapprocherait ${d} si tu la tenais chaque jour ?`,
  ],
};

function selection<T>(pool: T[], jour: number, k = 3): T[] {
  const n = pool.length;
  if (!n) return [];
  const taille = Math.min(k, n);
  const start = (((jour - 1) * taille) % n + n) % n;
  const out: T[] = [];
  for (let i = 0; i < taille; i++) out.push(pool[(start + i) % n]);
  return out;
}

// `sujet` = nom de la signature (capsule/explore) ou la direction (construis).
export function exercicesVolet(volet: VoletKey, sujet: string, jour: number): string[] {
  const s = (sujet || (volet === "construis" ? "ce que tu veux faire grandir" : "ta signature")).trim();
  const arg = volet === "construis" ? `« ${s} »` : s;
  return selection(POOLS[volet], jour).map((f) => f(arg));
}
