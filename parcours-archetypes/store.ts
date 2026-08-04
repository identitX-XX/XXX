// parcours-archetypes/store.ts
// Store Zustand persisté (localStorage). Rien ne sort du device : local-first.
// Contient le parcours (30 jours), les réponses, et l'état d'évolution.

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import parcoursData from "./parcours.json";
import {
  ClimatJour,
  Diagnostic,
  EtatEvolution,
  Objectifs,
  Parcours,
  ReponseJour,
} from "./types";
import { clotureJour, initialiser, matriceVide } from "./evolution";
import { generateParcours, DIAGNOSTIC_DEFAUT } from "./generateParcours";
import { ARCHETYPE_KEYS } from "./archetypes";
import { track } from "@/lib/metrics";

const parcoursBase = parcoursData as unknown as Parcours;

function etatDepart(): EtatEvolution {
  return { matrice: matriceVide(), historique: [], jourCourant: 1 };
}

// Assainissement de l'état persisté À L'HYDRATATION. Racine des « client-side
// exception » : un localStorage d'ANCIENNE version (clés de signature disparues,
// snapshots d'historique d'une autre forme…) faisait planter le rendu. Ici, on
// garantit un état TOUJOURS valide — on répare ou on écarte, jamais on ne casse.
const KEYS = new Set(ARCHETYPE_KEYS as unknown as string[]);
const estObjet = (v: unknown): v is Record<string, unknown> =>
  Boolean(v) && typeof v === "object";
// Un snapshot d'historique exploitable : la segmentation (detecterChapitres) et
// les indicateurs lisent `radar` et `jour` — s'ils manquent, on écarte l'entrée.
const snapshotValide = (h: unknown): boolean =>
  estObjet(h) && estObjet((h as Record<string, unknown>).radar) &&
  typeof (h as Record<string, unknown>).jour === "number";

function assainir(
  persisted: unknown,
  current: StoreParcours
): StoreParcours {
  const p = estObjet(persisted) ? persisted : {};

  // diagnostic : dominant/secondaire doivent être des clés connues, sinon on
  // repart proprement au diagnostic (mieux qu'un écran mort).
  const d = p.diagnostic as Diagnostic | null | undefined;
  const diagOk =
    d && KEYS.has(d.dominant as string) && KEYS.has(d.secondaire as string);
  const diagnostic = diagOk ? (d as Diagnostic) : null;

  // parcours : doit avoir un tableau `jours` non vide, sinon on régénère.
  const pp = p.parcours as Parcours | undefined;
  const parcours =
    pp && Array.isArray(pp.jours) && pp.jours.length ? pp : current.parcours;

  // etat : structure garantie + historique filtré aux snapshots valides.
  const es = estObjet(p.etat) ? (p.etat as Record<string, unknown>) : {};
  const etat: EtatEvolution = {
    matrice: estObjet(es.matrice)
      ? (es.matrice as unknown as EtatEvolution["matrice"])
      : matriceVide(),
    historique: Array.isArray(es.historique)
      ? (es.historique.filter(snapshotValide) as unknown as EtatEvolution["historique"])
      : [],
    jourCourant:
      typeof es.jourCourant === "number" && es.jourCourant >= 1 ? es.jourCourant : 1,
  };

  const obj = <T,>(v: unknown, def: T): T => (estObjet(v) ? (v as unknown as T) : def);

  const base: StoreParcours = {
    ...current, // garde les actions (non persistées)
    diagnostic,
    parcours,
    etat,
    objectifs: estObjet(p.objectifs) ? (p.objectifs as unknown as Objectifs) : null,
    reponses: obj(p.reponses, {} as StoreParcours["reponses"]),
    revelationsFeedback: obj(p.revelationsFeedback, {} as StoreParcours["revelationsFeedback"]),
    climat: obj(p.climat, {} as StoreParcours["climat"]),
    queteExercices: obj(p.queteExercices, {} as StoreParcours["queteExercices"]),
    quetePaliers: obj(p.quetePaliers, {} as StoreParcours["quetePaliers"]),
    filVu: typeof p.filVu === "number" ? p.filVu : 0,
    mondeChoisi: typeof p.mondeChoisi === "string" ? (p.mondeChoisi as string) : null,
  };

  // Diagnostic invalidé → on nettoie ce qui en dépend (parcours + progression),
  // pour ne pas rester avec un historique orphelin.
  if (!diagnostic) {
    return { ...base, parcours: current.parcours, etat: etatDepart(), reponses: {}, objectifs: null };
  }
  return base;
}

interface StoreParcours {
  parcours: Parcours;
  diagnostic: Diagnostic | null;
  objectifs: Objectifs | null;
  reponses: Record<number, ReponseJour>;
  etat: EtatEvolution;
  // Retour de l'utilisatrice sur les révélations (anti-Barnum) : « oui, ça me
  // parle » ou « non » → une révélation infirmée est écartée et pénalisée.
  revelationsFeedback: Record<string, "oui" | "non">;
  // Couche climat & corps (optionnelle), un relevé par jour de parcours.
  climat: Record<number, ClimatJour>;
  // Dernier jour dont le « fil du jour » a été vu — pilote le badge « nouveau »
  // dans le menu. 0 = jamais vu.
  filVu: number;
  // La Quête : le monde visuel choisi, et les exercices accomplis (clé
  // `${archetype}:${exercice}` → true).
  mondeChoisi: string | null;
  queteExercices: Record<string, boolean>;
  // Progression mesurable de la Quête : nombre de boucles complètes accomplies
  // PAR archétype (`archetype` → paliers). Un palier = les trois exercices
  // bouclés, puis « reparcourir un cran plus haut ». Suit la mue : chaque
  // archétype garde sa propre maîtrise.
  quetePaliers: Record<string, number>;

  // Reçoit le résultat de l'écran-miroir amont, régénère le parcours sur mesure
  // (J1 = dominant, J30 = La Métamorphe) et amorce la matrice.
  initialiserParcours: (diag: Diagnostic) => void;

  // Pose les objectifs de départ (un par périmètre : perso / pro / relationnel).
  definirObjectifs: (o: Objectifs) => void;

  // Clôt une journée : enregistre la réponse et fait avancer le moteur.
  repondreJour: (r: ReponseJour) => void;

  // Note une révélation (« oui » / « non ») — boucle de recalibration.
  noterRevelation: (id: string, v: "oui" | "non") => void;

  // Enregistre le climat & corps du jour.
  noterClimat: (c: ClimatJour) => void;

  // Marque le fil du jour `n` comme vu (éteint le badge « nouveau »).
  marquerFilVu: (n: number) => void;

  // La Quête : choisir le monde visuel, marquer un exercice accompli, rejouer la
  // boucle (efface les trois exercices d'un archétype pour la reparcourir).
  choisirMonde: (key: string) => void;
  marquerExercice: (id: string) => void;
  rejouerQuete: (archKey: string) => void;

  // Réinitialise tout (garde le parcours de base généré).
  reinitialiser: () => void;
}

export const useParcoursStore = create<StoreParcours>()(
  persist(
    (set, get) => ({
      parcours: parcoursBase,
      diagnostic: null,
      objectifs: null,
      reponses: {},
      etat: etatDepart(),
      revelationsFeedback: {},
      climat: {},
      filVu: 0,
      mondeChoisi: null,
      queteExercices: {},
      quetePaliers: {},

      initialiserParcours: (diag) => {
        track("archetype_revealed", { dominant: diag.dominant });
        set({
          diagnostic: diag,
          parcours: generateParcours(diag),
          reponses: {},
          etat: initialiser(diag),
          revelationsFeedback: {},
          climat: {},
        });
      },

      definirObjectifs: (o) => {
        track("objectifs_set");
        set({ objectifs: o });
      },

      repondreJour: (r) => {
        const { etat, reponses } = get();
        // Idempotent : re-répondre à un jour déjà clos ne le rejoue pas.
        if (reponses[r.jour]) return;
        set({
          reponses: { ...reponses, [r.jour]: r },
          etat: clotureJour(etat, r),
        });
      },

      noterRevelation: (id, v) =>
        set({ revelationsFeedback: { ...get().revelationsFeedback, [id]: v } }),

      noterClimat: (c) => set({ climat: { ...get().climat, [c.jour]: c } }),

      marquerFilVu: (n) => set({ filVu: Math.max(get().filVu, n) }),

      choisirMonde: (key) => set({ mondeChoisi: key }),
      marquerExercice: (id) =>
        set({ queteExercices: { ...get().queteExercices, [id]: true } }),
      rejouerQuete: (archKey) => {
        const q = { ...get().queteExercices };
        delete q[`${archKey}:delestage`];
        delete q[`${archKey}:carrefour`];
        delete q[`${archKey}:pacte`];
        // La boucle qu'on vient de terminer compte : +1 palier de maîtrise
        // pour cet archétype (progression mesurable, persistée).
        const paliers = { ...get().quetePaliers };
        paliers[archKey] = (paliers[archKey] ?? 0) + 1;
        set({ queteExercices: q, quetePaliers: paliers });
      },

      reinitialiser: () =>
        set({
          diagnostic: null,
          objectifs: null,
          parcours: get().diagnostic
            ? generateParcours(DIAGNOSTIC_DEFAUT)
            : parcoursBase,
          reponses: {},
          etat: etatDepart(),
          revelationsFeedback: {},
          climat: {},
          filVu: 0,
          mondeChoisi: null,
          queteExercices: {},
          quetePaliers: {},
        }),
    }),
    {
      name: "parcours-archetypes",
      version: 2,
      storage: createJSONStorage(() => localStorage),
      // v1 -> v2 : la version précédente amorçait un diagnostic PAR DÉFAUT
      // automatiquement (explorateur/sage), ce qui faisait sauter l'écran des
      // 8 questions. On repart à zéro pour que le vrai diagnostic s'affiche.
      migrate: (persisted, version) => {
        if (version < 2) {
          return {
            parcours: parcoursBase,
            diagnostic: null,
            reponses: {},
            etat: etatDepart(),
          } as Partial<StoreParcours>;
        }
        return persisted as StoreParcours;
      },
      // Filet racine : à CHAQUE hydratation, on assainit l'état persisté →
      // toujours valide, jamais de crash sur un vieux localStorage.
      merge: (persisted, current) => assainir(persisted, current as StoreParcours),
    }
  )
);
