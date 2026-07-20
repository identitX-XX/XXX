// parcours-archetypes/generateParcours.ts
// Génère les 30 journées (10 sections chacune) par templates. Le contenu passe
// par des gabarits DRY : tu peux remplacer une journée à la main dans
// parcours.json sans toucher au moteur.
//
// Rotation par défaut : le dominant ouvre J1, le secondaire arrive à la
// charnière J15, La Métamorphe clôt J30, et les 12 lentilles sont vues ~2 fois.

import {
  ArchetypeKey,
  Diagnostic,
  Jour,
  Parcours,
  Section,
  SphereKey,
} from "./types";
import {
  ARCHETYPE_KEYS,
  SPHERE_KEYS,
  archetypeByKey,
  phaseDuJour,
  sphereByKey,
} from "./archetypes";

const JOURS = 30;

// Construit l'ordre des lentilles sur 30 jours.
export function rotationArchetypes(diag: Diagnostic): ArchetypeKey[] {
  // On veut ~2 passages par lentille. Base = deux fois la liste des 12 (24),
  // complétée pour atteindre 30, puis on impose les ancres.
  const autres = ARCHETYPE_KEYS.filter((a) => a !== "metamorphe");
  const pool: ArchetypeKey[] = [];
  // deux tours des 11 (hors métamorphe) = 22, + quelques rappels = 29, + J30.
  pool.push(...autres, ...autres);
  let i = 0;
  while (pool.length < JOURS - 1) {
    pool.push(autres[i % autres.length]);
    i++;
  }
  // Mélange déterministe léger pour éviter les répétitions collées.
  const seq = etaler(pool).slice(0, JOURS - 1);

  // Ancres : J1 = dominant, J15 = secondaire, J30 = métamorphe.
  seq[0] = diag.dominant;
  seq[14] = diag.secondaire;
  const jours = [...seq, "metamorphe" as ArchetypeKey];
  return jours;
}

// Espace les doublons consécutifs sans hasard non déterministe.
function etaler(items: ArchetypeKey[]): ArchetypeKey[] {
  const out: ArchetypeKey[] = [];
  const restants = [...items];
  while (restants.length) {
    let idx = restants.findIndex((a) => a !== out[out.length - 1]);
    if (idx === -1) idx = 0;
    out.push(restants.splice(idx, 1)[0]);
  }
  return out;
}

function sphereDuJour(n: number): SphereKey {
  // Rotation régulière des 5 sphères.
  return SPHERE_KEYS[(n - 1) % SPHERE_KEYS.length];
}

function sections(n: number, aKey: ArchetypeKey, sKey: SphereKey): Section[] {
  const a = archetypeByKey[aKey];
  const s = sphereByKey[sKey];
  const p = phaseDuJour(n);
  const mk = (kind: Section["kind"], titre: string, texte: string): Section => ({
    id: `j${n}-${kind}`,
    kind,
    titre,
    texte,
  });

  return [
    mk(
      "intention",
      "Intention du jour",
      `Jour ${n} · phase « ${p.label} ». ${p.intention}`
    ),
    mk("lentille", "La lentille", `${a.name} — ${a.lens}`),
    mk(
      "observation",
      "Observation guidée",
      `Aujourd'hui, porte cette lentille sur ta sphère « ${s.label} ». Que remarques-tu que tu ne voyais pas hier ?`
    ),
    mk(
      "defi",
      "Micro-défi",
      `Un geste concret, tout petit, inspiré par « ${a.name} » dans « ${s.label} ». Rien d'héroïque : quelque chose de faisable avant ce soir.`
    ),
    mk(
      "question",
      "Question ouverte",
      `Quand cette lentille s'active en toi, qu'est-ce qu'elle cherche à protéger ou à faire grandir ?`
    ),
    mk(
      "curseurs",
      "Où ça vibre",
      `Règle, sphère par sphère, l'intensité de cette lentille aujourd'hui. Elle peut être forte au travail et absente ailleurs — c'est normal.`
    ),
    mk(
      "emotions",
      "Émotions du jour",
      `Coche ce qui a traversé ta journée. Sans te juger, à l'instant T.`
    ),
    mk(
      "note",
      "Note libre",
      `Un mot, une image, une phrase. Ce que la lentille a fait remonter.`
    ),
    mk(
      "echo",
      "Écho",
      n > 1
        ? `Relis ta note d'il y a quelques jours. Qu'est-ce qui a bougé depuis ?`
        : `Premier jour : rien à relire encore. Reviens-y demain.`
    ),
    mk(
      "cloture",
      "Clôture",
      `La journée se ferme, la matrice respire : ce que tu n'as pas réactivé retombe doucement. Rien ne se fige. À demain.`
    ),
  ];
}

export function generateParcours(diag: Diagnostic): Parcours {
  const rotation = rotationArchetypes(diag);
  const jours: Jour[] = [];
  for (let n = 1; n <= JOURS; n++) {
    const aKey = rotation[n - 1];
    const sKey = sphereDuJour(n);
    const a = archetypeByKey[aKey];
    jours.push({
      n,
      phase: phaseDuJour(n).key,
      archetype: aKey,
      sphereFocus: sKey,
      titre: `Jour ${n} — ${a.name}`,
      sections: sections(n, aKey, sKey),
    });
  }
  return { version: 1, jours };
}

// Diagnostic par défaut pour la génération de base (build.ts).
export const DIAGNOSTIC_DEFAUT: Diagnostic = {
  dominant: "explorateur",
  secondaire: "sage",
};
