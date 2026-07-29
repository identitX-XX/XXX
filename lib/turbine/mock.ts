import { TurbineInput, TurbineOutput } from "./types";

// Mode maquette : ce que la Turbine renvoie tant qu'aucune clé Mistral n'est
// branchée (ou en repli si l'appel échoue). Les scénarios sont DÉRIVÉS des
// directions réelles de l'utilisatrice — jamais un profil codé en dur — pour
// que l'écran vive sans jamais afficher le vécu de quelqu'un d'autre.
export function mockOutput(input: TurbineInput): TurbineOutput {
  const dirs = input.directions.map((d) => d.nom).filter(Boolean);
  const arch = input.archetype.actuel || "On";
  const d0 = dirs[0] ?? "ta direction";
  const d1 = dirs[1];
  const tension = input.tensions.filter(Boolean)[0];

  const scenarios: TurbineOutput["scenarios"] = [];

  if (d1) {
    scenarios.push({
      titre: `Fais dialoguer ${d0} et ${d1} au lieu de choisir`,
      multiples_en_dialogue: [d0, d1],
      mouvement: `Tu n'as pas à trancher entre ${d0} et ${d1}. Mets-les à la même table : ce que l'une sait, l'autre peut l'emprunter — la question n'est pas « laquelle », mais « qu'est-ce qu'elles fabriquent ensemble ? ».`,
      pourquoi_maintenant: `Tu explores ${dirs.join(", ")} en même temps : c'est le moment de tester leur combinaison plutôt que d'en amputer une.`,
      premier_pas: `Cette semaine, une seule action qui emprunte à ${d0} ET à ${d1} — même minuscule.`,
      risque_ou_lest: `L'idée qu'il faut choisir une seule voie pour être prise au sérieux.`,
    });
  }

  scenarios.push({
    titre: `Teste ${d0} en petit, pour de vrai`,
    multiples_en_dialogue: [d0],
    mouvement: `Avant d'en faire un projet de vie, réduis ${d0} à une expérience de sept jours : assez petite pour être faite, assez réelle pour t'apprendre quelque chose sur toi.`,
    pourquoi_maintenant: `${arch} avance par l'expérience, pas par la certitude préalable. Une preuve concrète vaut mieux qu'un mois d'hésitation.`,
    premier_pas: `Définis la plus petite version de ${d0} que tu peux tenter avant dimanche, et écris-la en une phrase.`,
    risque_ou_lest: tension
      ? `Ce qui te freine : « ${tension} ». Le nommer, c'est commencer à le désamorcer.`
      : `L'attente d'être « prête » avant de commencer.`,
  });

  return {
    scenarios,
    note_de_bascule:
      "Ces pistes partent de tes directions — à toi de repérer celle qui te met en mouvement.",
  };
}
