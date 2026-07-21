// parcours-archetypes/revelations.ts
// Le moteur de révélations : lit l'historique + les réponses et fait remonter
// des liens SOURCÉS et FALSIFIABLES — jamais du Barnum. Chaque révélation cite
// des chiffres réels (« sur N jours »), n'est émise que si le signal dépasse un
// seuil, et peut être infirmée par l'utilisatrice (feedback « non » → écartée).
// Tout est pur : mêmes entrées → mêmes sorties.

import {
  ArchetypeKey,
  EmotionKey,
  EtatEvolution,
  ReponseJour,
  SphereKey,
} from "./types";
import {
  ARCHETYPE_KEYS,
  SPHERE_KEYS,
  archetypeByKey,
  emotionByKey,
} from "./archetypes";

export interface Revelation {
  id: string; // stable : sert au feedback persistant
  kind: string;
  titre: string; // l'insight, spécifique
  preuve: string; // « pourquoi je te dis ça » — la trace de données
  force: number; // 0..1, saillance / confiance
}

const SEUIL = 0.42; // en-dessous, on préfère le silence
const MIN_JOURS = 5; // pas de révélation sans matière suffisante

const LABEL_SPHERE: Record<SphereKey, string> = {
  travail: "le travail",
  relations: "les relations",
  creation: "la création",
  corps: "le corps & l'énergie",
  sens: "le sens & l'intériorité",
};

function moyenne(xs: number[]): number {
  return xs.length ? xs.reduce((s, x) => s + x, 0) / xs.length : 0;
}
function estPositive(e: EmotionKey): boolean {
  return emotionByKey[e].valence > 0;
}

export function genererRevelations(
  etat: EtatEvolution,
  reponses: Record<number, ReponseJour>
): Revelation[] {
  const H = etat.historique;
  const R = Object.values(reponses);
  if (H.length < MIN_JOURS) return [];

  const N = H.length;
  const revs: Revelation[] = [];

  // 1) Sphère la plus / la moins vivante (d'après les curseurs vécus).
  if (R.length >= MIN_JOURS) {
    const moyParSphere = SPHERE_KEYS.map((s) => ({
      s,
      m: moyenne(R.map((r) => r.curseurs[s] ?? 0)),
    }));
    const haute = moyParSphere.reduce((a, b) => (b.m > a.m ? b : a));
    const basse = moyParSphere.reduce((a, b) => (b.m < a.m ? b : a));
    const ecart = haute.m - basse.m;
    if (ecart >= 18) {
      revs.push({
        id: `sphere:${haute.s}:${basse.s}`,
        kind: "sphere",
        titre: `C'est dans ${LABEL_SPHERE[haute.s]} que tu te sens le plus intense en ce moment — le moins dans ${LABEL_SPHERE[basse.s]}.`,
        preuve: `Intensité moyenne : ${Math.round(haute.m)}/100 vs ${Math.round(basse.m)}/100, sur tes ${R.length} journées.`,
        force: Math.min(1, 0.4 + ecart / 100),
      });
    }
  }

  // 2) Émotion récurrente (fréquence sur les journées vécues).
  const compte: Record<EmotionKey, number> = {} as Record<EmotionKey, number>;
  for (const h of H) for (const e of h.emotions) compte[e] = (compte[e] ?? 0) + 1;
  const emoTop = (Object.entries(compte) as [EmotionKey, number][])
    .sort((a, b) => b[1] - a[1])[0];
  if (emoTop && emoTop[1] / N >= 0.45) {
    const [e, c] = emoTop;
    revs.push({
      id: `emo-freq:${e}`,
      kind: "emotion",
      titre: `L'émotion « ${emotionByKey[e].label.toLowerCase()} » traverse une grande partie de tes journées.`,
      preuve: `Présente ${c} jours sur ${N}.`,
      force: Math.min(1, 0.4 + emoTop[1] / N / 2),
    });
  }

  // 3) Lien invisible : émotion ↔ cohérence (l'effet « waouh » sourcé).
  for (const [e, c] of Object.entries(compte) as [EmotionKey, number][]) {
    if (c < 3 || c > N - 2) continue; // besoin des deux groupes
    const avec = moyenne(H.filter((h) => h.emotions.includes(e)).map((h) => h.coherence));
    const sans = moyenne(H.filter((h) => !h.emotions.includes(e)).map((h) => h.coherence));
    const delta = avec - sans;
    if (Math.abs(delta) >= 9) {
      const sens = delta > 0 ? "plus claires" : "plus floues";
      revs.push({
        id: `emo-coh:${e}`,
        kind: "lien",
        titre: `Tes journées avec « ${emotionByKey[e].label.toLowerCase()} » sont en moyenne ${sens}.`,
        preuve: `Cohérence moyenne ${Math.round(avec)} les jours avec, ${Math.round(sans)} les jours sans (Δ ${Math.abs(Math.round(delta))} points, sur ${N} jours).`,
        force: Math.min(1, 0.45 + Math.abs(delta) / 100),
      });
      break; // une seule de ce type, la plus parlante
    }
  }

  // 4) Tendance de la clarté (progression / régression).
  if (N >= 6) {
    const moit = Math.floor(N / 2);
    const debut = moyenne(H.slice(0, moit).map((h) => h.coherence));
    const fin = moyenne(H.slice(N - moit).map((h) => h.coherence));
    const delta = fin - debut;
    if (Math.abs(delta) >= 8) {
      const monte = delta > 0;
      revs.push({
        id: "coherence-trend",
        kind: "tendance",
        titre: monte
          ? "Ta clarté progresse à mesure que tu avances."
          : "Ta clarté s'est resserrée récemment — c'est un signal, pas un échec.",
        preuve: `Cohérence moyenne ${Math.round(debut)} sur ta première moitié, ${Math.round(fin)} sur la seconde.`,
        force: Math.min(1, 0.42 + Math.abs(delta) / 100),
      });
    }
  }

  // 5) Archétype qui prend de la place (radar : début vs fin).
  if (N >= 6) {
    const tiers = Math.max(2, Math.floor(N / 3));
    const debut = H.slice(0, tiers);
    const fin = H.slice(N - tiers);
    let best: { k: ArchetypeKey; d: number } | null = null;
    for (const k of ARCHETYPE_KEYS) {
      const d =
        moyenne(fin.map((h) => h.radar[k] ?? 0)) -
        moyenne(debut.map((h) => h.radar[k] ?? 0));
      if (!best || d > best.d) best = { k, d };
    }
    if (best && best.d >= 10) {
      revs.push({
        id: `arch-monte:${best.k}`,
        kind: "archetype",
        titre: `L'archétype « ${archetypeByKey[best.k].name} » prend de la place ces derniers jours.`,
        preuve: `+${Math.round(best.d)} points sur ton radar entre le début et maintenant.`,
        force: Math.min(1, 0.4 + best.d / 100),
      });
    }
  }

  // 6) Oser (intensité du défi) ↔ émotions d'expansion.
  if (R.length >= 6) {
    const seuil = moyenne(R.map((r) => r.intensiteDefi));
    const haut = R.filter((r) => r.intensiteDefi >= seuil);
    const bas = R.filter((r) => r.intensiteDefi < seuil);
    if (haut.length >= 2 && bas.length >= 2) {
      const tauxHaut = moyenne(haut.map((r) => (r.emotions.some(estPositive) ? 1 : 0)));
      const tauxBas = moyenne(bas.map((r) => (r.emotions.some(estPositive) ? 1 : 0)));
      const dpp = Math.round((tauxHaut - tauxBas) * 100);
      if (dpp >= 20) {
        revs.push({
          id: "defi-positif",
          kind: "lien",
          titre: "Quand tu oses davantage, l'élan et la joie reviennent plus souvent.",
          preuve: `Émotions d'expansion présentes ${Math.round(tauxHaut * 100)}% des jours où tu oses le plus, contre ${Math.round(tauxBas * 100)}% les autres.`,
          force: Math.min(1, 0.44 + dpp / 200),
        });
      }
    }
  }

  return revs
    .filter((r) => r.force >= SEUIL)
    .sort((a, b) => b.force - a.force);
}
