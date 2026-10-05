// parcours-archetypes/capsuleAdaptive.ts
// « La capsule réagit à ton état » — au lieu d'une rotation fixe, le geste et la
// question du jour s'adaptent à CE QUI A BOUGÉ récemment : une bascule de
// signature, une émotion difficile, un élan, ou une sphère laissée en retrait.
// Pur et déterministe (mêmes entrées → mêmes sorties), donc testable. Quand rien
// ne se détache, on retombe sur la rotation neutre existante (variateJour).

import type { Archetype, ArchetypeKey, EmotionKey, EtatEvolution, SphereKey } from "./types";
import { EMOTIONS, SPHERE_KEYS, SPHERES, archetypeByKey, emotionByKey } from "./archetypes";
import { dominant } from "./evolution";
import { gesteDuJour, questionDuJour } from "./variateJour";

export type SignalType = "bascule" | "emotion" | "elan" | "sphere" | "neutre";

export interface SignalCapsule {
  type: SignalType;
  label: string; // « pourquoi cette capsule » (vide si neutre)
  emotion?: EmotionKey;
  sphere?: SphereKey;
  vers?: ArchetypeKey;
}

const labelSphere = (k: SphereKey) => SPHERES.find((s) => s.key === k)?.label ?? k;
const labelEmotion = (k: EmotionKey) => EMOTIONS.find((e) => e.key === k)?.label ?? k;

// Détecte le signal dominant du moment à partir de l'historique vécu. Ordre de
// priorité : bascule (gros changement) > émotion difficile (besoin de soin) >
// élan (à amplifier) > sphère en retrait (à nourrir) > neutre.
export function signalCapsule(etat: EtatEvolution): SignalCapsule {
  const h = etat.historique;
  const last = h[h.length - 1];
  const prev = h[h.length - 2];

  // 1) Bascule : le dominant vient de changer d'un jour à l'autre.
  if (last && prev) {
    const dLast = dominant(last.radar);
    const dPrev = dominant(prev.radar);
    if (dLast !== dPrev) {
      return { type: "bascule", vers: dLast, label: `Ta signature a bougé vers « ${archetypeByKey[dLast].name} »` };
    }
  }

  // 2) Émotion difficile dans la dernière capsule.
  if (last?.emotions?.length) {
    let pire: EmotionKey | null = null;
    let min = 0;
    for (const e of last.emotions) {
      const v = emotionByKey[e]?.valence ?? 0;
      if (v < min) {
        min = v;
        pire = e;
      }
    }
    if (pire && min <= -0.3) {
      return { type: "emotion", emotion: pire, label: `« ${labelEmotion(pire)} » a marqué ta dernière capsule` };
    }
  }

  // 3) Élan : la cohérence monte nettement, ou la dernière capsule est toute positive.
  if (last && prev && last.coherence - prev.coherence >= 6) {
    return { type: "elan", label: "Tu es dans un élan" };
  }
  if (last?.emotions?.length && last.emotions.every((e) => (emotionByKey[e]?.valence ?? 0) > 0)) {
    return { type: "elan", label: "Tu es dans un élan" };
  }

  // 4) Sphère en retrait : la plus forte baisse récente, sinon la plus basse.
  if (last) {
    let cible: SphereKey | null = null;
    if (prev) {
      let drop = 0;
      for (const s of SPHERE_KEYS) {
        const d = (prev.spheres[s] ?? 0) - (last.spheres[s] ?? 0);
        if (d > drop) {
          drop = d;
          cible = s;
        }
      }
    }
    if (!cible) {
      let minv = Infinity;
      for (const s of SPHERE_KEYS) {
        const v = last.spheres[s] ?? 0;
        if (v < minv) {
          minv = v;
          cible = s;
        }
      }
    }
    if (cible) return { type: "sphere", sphere: cible, label: `« ${labelSphere(cible)} » est en retrait` };
  }

  return { type: "neutre", label: "" };
}

// Le geste adapté au signal (deux variantes alternées par jour pour ne pas
// radoter). Neutre → la rotation existante (variateJour), inchangée.
export function gesteCapsule(arch: Archetype, jour: number, sig: SignalCapsule): string {
  const i = (((jour - 1) % 2) + 2) % 2;
  switch (sig.type) {
    case "bascule": {
      const v = archetypeByKey[sig.vers!].name;
      return [
        `Ta signature penche vers « ${v} » en ce moment. Aujourd'hui, laisse-la agir une fois, consciemment, et vois si ça te ressemble.`,
        `« ${v} » monte en toi ces temps-ci. Offre-lui une occasion concrète de s'exprimer aujourd'hui — et observe l'effet.`,
      ][i];
    }
    case "emotion": {
      const e = labelEmotion(sig.emotion!);
      return [
        `« ${e} » a traversé ta dernière capsule. Aujourd'hui, accorde-lui deux minutes sans la juger — juste pour voir ce qu'elle protège.`,
        `Quand « ${e} » revient, tente aujourd'hui un petit geste qui t'apaise, au lieu de lutter contre elle.`,
      ][i];
    }
    case "elan":
      return [
        `Tu es dans un élan. Aujourd'hui, ose un cran de plus là où ça avance — profite de la vague tant qu'elle porte.`,
        `Quelque chose avance en toi. Capitalise : pose aujourd'hui une action un peu plus grande que d'habitude.`,
      ][i];
    case "sphere": {
      const s = labelSphere(sig.sphere!);
      return [
        `« ${s} » est en retrait ces derniers temps. Pose aujourd'hui un geste minuscule qui la nourrit — un seul.`,
        `Redonne un peu de place à « ${s} » aujourd'hui : une attention, un pas, même petit.`,
      ][i];
    }
    default:
      return gesteDuJour(arch, jour);
  }
}

export function questionCapsule(arch: Archetype, jour: number, sig: SignalCapsule): string {
  const i = (((jour - 1) % 2) + 2) % 2;
  switch (sig.type) {
    case "bascule": {
      const v = archetypeByKey[sig.vers!].name;
      return [
        `Qu'est-ce qui, dans ta vie récente, fait monter « ${v} » — et qu'est-ce que ça dit de là où tu vas ?`,
        `Si « ${v} » prend plus de place en toi, qu'est-ce que tu as envie d'en faire ?`,
      ][i];
    }
    case "emotion": {
      const e = labelEmotion(sig.emotion!);
      return [
        `Quand « ${e} » revient, de quoi essaie-t-elle de prendre soin chez toi ?`,
        `Qu'est-ce que « ${e} » cherche à te dire, sous ce qu'elle te fait sentir ?`,
      ][i];
    }
    case "elan":
      return [
        `Qu'est-ce qui crée cet élan en ce moment — et comment lui donner encore un peu plus d'air ?`,
        `Dans quel domaine cet élan a-t-il le plus envie de se prolonger ?`,
      ][i];
    case "sphere": {
      const s = labelSphere(sig.sphere!);
      return [
        `Qu'est-ce qui, en ce moment, laisse « ${s} » de côté — et qu'est-ce qui lui redonnerait de la place ?`,
        `De quoi « ${s} » aurait-elle besoin, là, pour ne plus être la grande oubliée ?`,
      ][i];
    }
    default:
      return questionDuJour(arch, jour);
  }
}
