import { TurbineInput, TurbineOutput, TurbineScenario } from "./types";

// Mode maquette : ce que la Turbine renvoie tant qu'aucune clé Mistral n'est
// branchée (ou en repli si l'appel échoue). Les scénarios sont DÉRIVÉS des
// directions réelles de l'utilisatrice — jamais un profil codé en dur.
//
// Variété : au lieu de deux scénarios figés (« ça me dit toujours la même
// chose »), on pioche dans un ÉVENTAIL d'angles (dialogue, petite forme,
// contrainte, tension-boussole, retrait, horizon, preuve publique). La graine
// (`seed`) fait tourner la sélection à chaque relance, et les titres déjà vus
// (`scenariosPrecedents`) sont écartés. Déterministe à graine égale → testable.
export function mockOutput(input: TurbineInput): TurbineOutput {
  const dirs = input.directions.map((d) => d.nom).filter(Boolean);
  const arch = input.archetype.actuel || "On";
  const d0 = dirs[0] ?? "ta direction";
  const d1 = dirs[1];
  const tension = input.tensions.filter(Boolean)[0];
  const seed = Number.isFinite(input.seed) ? (input.seed as number) : 0;
  const precedents = new Set((input.scenariosPrecedents ?? []).filter(Boolean));
  const aRecharger = input.moment?.aRecharger;

  // L'éventail d'angles. Chaque angle est un scénario complet, ancré sur les
  // directions réelles. L'ordre place le dialogue en tête quand il est possible.
  const pool: TurbineScenario[] = [];

  if (d1) {
    pool.push({
      titre: `Fais dialoguer ${d0} et ${d1} au lieu de choisir`,
      multiples_en_dialogue: [d0, d1],
      mouvement: `Tu n'as pas à trancher entre ${d0} et ${d1}. Mets-les à la même table : ce que l'une sait, l'autre peut l'emprunter — la question n'est pas « laquelle », mais « qu'est-ce qu'elles fabriquent ensemble ? ».`,
      pourquoi_maintenant: `Tu explores ${dirs.join(", ")} en même temps : c'est le moment de tester leur combinaison plutôt que d'en amputer une.`,
      premier_pas: `Aujourd'hui, note une seule action qui emprunte à ${d0} ET à ${d1} — même minuscule.`,
      risque_ou_lest: `L'idée qu'il faut choisir une seule voie pour être prise au sérieux.`,
    });
  }

  // Angle « du moment » : branché sur l'énergie la plus basse de l'instant. Il
  // fait que les possibles BOUGENT quand ton énergie bouge (placé en tête).
  if (aRecharger) {
    pool.push({
      titre: `Recharge « ${aRecharger} » en t'appuyant sur ${d0}`,
      multiples_en_dialogue: [d0, aRecharger],
      mouvement: `Ton énergie « ${aRecharger} » est au plus bas en ce moment. Plutôt que de forcer ailleurs, sers-toi de ${d0} comme d'un levier pour la relever — un petit geste orienté là où ça manque.`,
      pourquoi_maintenant: `C'est « ${aRecharger} » qui te coûte le plus là, maintenant : agir dessus via ${d0} remet de l'élan au bon endroit.`,
      premier_pas: `Note un geste de 10 minutes qui relie ${d0} à « ${aRecharger} », à faire aujourd'hui.`,
      risque_ou_lest: `Continuer à alimenter ce qui est déjà plein en laissant la réserve basse se vider.`,
    });
  }

  pool.push({
    titre: `Donne à ${d0} une première forme réelle`,
    multiples_en_dialogue: [d0],
    mouvement: `Avant d'en faire un projet de vie, réduis ${d0} à une expérience de sept jours : assez petite pour être faite, assez réelle pour t'apprendre quelque chose sur toi.`,
    pourquoi_maintenant: `${arch} avance par l'expérience, pas par la certitude préalable. Une preuve concrète vaut mieux qu'un mois d'hésitation.`,
    premier_pas: `Écris en une phrase la plus petite version de ${d0} que tu peux tenter avant dimanche.`,
    risque_ou_lest: `L'attente d'être « prête » avant de commencer.`,
  });

  pool.push({
    titre: `Impose une contrainte serrée à ${d0}`,
    multiples_en_dialogue: [d0],
    mouvement: `La liberté totale paralyse. Donne-toi une règle étroite sur ${d0} cette semaine — un format unique, un temps limité, un seul outil — et vois ce que la contrainte fait émerger.`,
    pourquoi_maintenant: `Tu tournes autour de ${d0} sans l'attraper : une contrainte transforme l'intention en geste.`,
    premier_pas: `Choisis maintenant UNE contrainte pour ${d0} (ex. « 20 min, un seul endroit ») et écris-la.`,
    risque_ou_lest: `Croire qu'il te faut toutes les options ouvertes pour bien faire.`,
  });

  if (tension) {
    pool.push({
      titre: `Fais de « ${tension} » une boussole, pas un frein`,
      multiples_en_dialogue: [d0, tension],
      mouvement: `« ${tension} » n'est pas qu'un obstacle à ${d0} : c'est une information. Écoute ce qu'elle protège, puis avance d'un pas qui en tient compte au lieu de la nier.`,
      pourquoi_maintenant: `Tu portes « ${tension} » en même temps que ${d0} : la nommer la rend maniable.`,
      premier_pas: `En une phrase : « ${tension} me dit que j'ai besoin de… ». Complète-la aujourd'hui.`,
      risque_ou_lest: `Vouloir supprimer la tension avant d'agir, au lieu d'avancer avec elle.`,
    });
  }

  pool.push({
    titre: `Retire tout sauf ${d0}, 48 heures`,
    multiples_en_dialogue: [d0, d1 ?? arch],
    mouvement: `Mets en pause tes autres directions deux jours et ne laisse de la place qu'à ${d0}. Non pour choisir — pour sentir ce qui te manque vraiment quand le reste se tait.`,
    pourquoi_maintenant: `Difficile de savoir ce qui compte quand tout tire en même temps. Le retrait temporaire rend l'essentiel audible.`,
    premier_pas: `Bloque deux créneaux « ${d0} seulement » dans les 48 h — et protège-les.`,
    risque_ou_lest: `La peur que mettre une chose en pause revienne à l'abandonner.`,
  });

  pool.push({
    titre: `Demande à ton toi d'ici un an`,
    multiples_en_dialogue: [d0, d1 ?? arch],
    mouvement: `Projette-toi dans un an, une fois que ${d0}${d1 ? ` et ${d1}` : ""} ont trouvé leur place. De là-bas, quel conseil te donnerais-tu pour aujourd'hui ? Écoute la réponse, puis fais ce premier geste.`,
    pourquoi_maintenant: `Tu décides depuis l'incertitude du présent ; ton toi futur, lui, a déjà traversé — il voit plus clair.`,
    premier_pas: `Écris trois lignes à la première personne : « Dans un an, je suis contente d'avoir… ».`,
    risque_ou_lest: `Confondre planifier et agir : la lettre ne vaut que suivie d'un pas réel.`,
  });

  pool.push({
    titre: `Montre ${d0} à une personne cette semaine`,
    multiples_en_dialogue: [d0, arch],
    mouvement: `${d0} grandit plus vite au contact d'un regard qu'en vase clos. Choisis une personne de confiance et expose-lui une version imparfaite — pour la rendre réelle, pas pour la valider.`,
    pourquoi_maintenant: `Tant que ${d0} reste dans ta tête, elle reste négociable à l'infini. La sortir l'engage.`,
    premier_pas: `Identifie la personne et envoie-lui aujourd'hui un message qui annonce que tu lui montreras ${d0}.`,
    risque_ou_lest: `Attendre que ce soit parfait avant d'oser le montrer.`,
  });

  // On écarte les angles déjà vus ; si tout a été vu, on repart de l'éventail.
  let dispo = pool.filter((s) => !precedents.has(s.titre));
  if (dispo.length === 0) dispo = pool;

  // Rotation par graine → une sélection différente à chaque relance.
  const start = ((seed % dispo.length) + dispo.length) % dispo.length;
  const n = Math.min(3, dispo.length);
  const scenarios: TurbineScenario[] = [];
  for (let i = 0; i < n; i++) scenarios.push(dispo[(start + i) % dispo.length]);

  const notes = [
    "Ces pistes partent de tes directions — à toi de repérer celle qui te met en mouvement.",
    "Aucune de ces voies n'est « la bonne » : la bonne est celle qui te donne envie d'agir aujourd'hui.",
    "Trois angles pour la même matière : choisis celui qui te dérange un peu, c'est souvent le vivant.",
  ];

  return { scenarios, note_de_bascule: notes[start % notes.length] };
}
