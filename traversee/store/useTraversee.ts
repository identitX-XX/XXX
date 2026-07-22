// traversee/store/useTraversee.ts
// L'état de La Traversée. Zustand + persist (localStorage, clé neuve, isolée de
// l'ancien produit). Incarne les règles non négociables :
//   · pas de streak, pas de reset, pas de rattrapage forcé — le chemin ne se
//     perd jamais ; l'absence est enregistrée sans reproche ;
//   · une seule action par jour, idempotente ; l'ordre des actes est immuable ;
//   · LAISSER dépose (jamais n'efface), réversible 24 h ; EMPORTER intensifie ;
//   · la seule progression visible est la netteté et la simplification.

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { EtatTraversee, Etoile, ReponseJour, Verbe } from "../types";
import { TERRITOIRE_KEYS } from "../content/territoires";
import { acteDuJour, jourN } from "../content/jours";
import { fragmentsParTheme, FRAGMENTS } from "../content/fragments";
import { voiceClarity } from "../lib/voice";
import { deriverDestinations } from "../lib/derivation";

const H24 = 24 * 60 * 60 * 1000;

// Stockage mémoire de secours hors navigateur (SSR / tests) — évite d'accéder à
// un localStorage inexistant. En navigateur, on utilise le vrai localStorage.
const memoire: Record<string, string> = {};
const stockageMemoire: Storage = {
  getItem: (k) => (k in memoire ? memoire[k] : null),
  setItem: (k, v) => { memoire[k] = String(v); },
  removeItem: (k) => { delete memoire[k]; },
  clear: () => { for (const k of Object.keys(memoire)) delete memoire[k]; },
  key: () => null,
  get length() { return Object.keys(memoire).length; },
};

function etoilesDepart(): Etoile[] {
  const out: Etoile[] = [];
  for (const t of TERRITOIRE_KEYS)
    for (let i = 0; i < 3; i++) out.push({ id: `${t}-${i}`, territoire: t, etat: "diffuse" });
  return out;
}

function etatDepart(): EtatTraversee {
  return {
    profil: { prenom: null, heureRituel: null },
    journey: { startDate: null, currentDay: 1, acte: "inventaire", absences: [], lastVisit: null },
    portrait: { clarity: 0, fragmentsReveles: [] },
    etoiles: etoilesDepart(),
    vestiaire: [],
    destinations: { candidates: [], eliminees: [], choisie: null },
    voice: { clarity: 0 },
    reponses: {},
    nomFutur: null,
  };
}

// Jours calendaires entre deux dates ISO (0 si même jour).
function joursEntre(aISO: string, bISO: string): number {
  const a = new Date(aISO); a.setHours(0, 0, 0, 0);
  const b = new Date(bISO); b.setHours(0, 0, 0, 0);
  return Math.round((b.getTime() - a.getTime()) / H24);
}

interface Store extends EtatTraversee {
  demarrer: (prenom: string, heureRituel: string) => void;
  // Enregistre une visite : si une absence a eu lieu, on la NOTE (sans punir).
  noterVisite: () => void;
  // Vivre la journée : une seule action, idempotente. Ordre immuable.
  vivreJour: (jour: number, choixId: string, verbe: Verbe | undefined, cible: string) => void;
  // Reprendre un dépôt (réversible 24 h) : rallume l'étoile.
  reprendre: (depotId: string) => void;
  // Acte IV.
  genererDestinations: () => void;
  eliminerDestination: (id: string) => void; // irréversible
  choisirDestination: (id: string) => void;
  // Acte V.
  nommer: (nom: string) => void;
  // Dev only : ?day=N.
  devSetDay: (n: number) => void;
  reinitialiser: () => void;
}

export const useTraversee = create<Store>()(
  persist(
    (set, get) => ({
      ...etatDepart(),

      demarrer: (prenom, heureRituel) => {
        const now = new Date().toISOString();
        set((s) => ({
          profil: { prenom: prenom.trim() || null, heureRituel },
          journey: { ...s.journey, startDate: s.journey.startDate ?? now, lastVisit: now },
        }));
      },

      noterVisite: () => {
        const now = new Date().toISOString();
        const { lastVisit, absences } = get().journey;
        if (!lastVisit) {
          set((s) => ({ journey: { ...s.journey, lastVisit: now } }));
          return;
        }
        const gap = joursEntre(lastVisit, now);
        // On note les jours d'absence (pour le message sans reproche). Jamais de
        // reset, jamais de pénalité, jamais d'avancement forcé.
        const nouvelles = gap > 1 ? [...absences, ...Array(gap - 1).fill(lastVisit)] : absences;
        set((s) => ({ journey: { ...s.journey, absences: nouvelles, lastVisit: now } }));
      },

      vivreJour: (jour, choixId, verbe, cible) => {
        const s = get();
        if (s.reponses[jour]) return; // idempotent, ordre immuable : on ne rejoue pas
        const now = new Date().toISOString();
        const reponse: ReponseJour = { jour, choixId, verbe, cible: cible.trim(), date: now };

        // Territoire du jour : TOUJOURS depuis le contenu (source unique), pour
        // rester cohérent avec la dérivation.
        const territoire = jourN(jour)?.territoire ?? TERRITOIRE_KEYS[(jour - 1) % TERRITOIRE_KEYS.length];

        // Étoiles : LAISSER éteint, EMPORTER intensifie. La constellation se simplifie.
        const etoiles = s.etoiles.map((e) => ({ ...e }));
        if (verbe === "laisser") {
          const cible2 = etoiles.find((e) => e.territoire === territoire && e.etat === "diffuse");
          if (cible2) cible2.etat = "eteinte";
        } else if (verbe === "emporter") {
          const cible2 = etoiles.find((e) => e.territoire === territoire && e.etat === "diffuse")
            ?? etoiles.find((e) => e.territoire === territoire);
          if (cible2) cible2.etat = "intense";
        }

        // LAISSER → dépôt au Vestiaire (jamais d'effacement), réversible 24 h.
        const vestiaire = [...s.vestiaire];
        if (verbe === "laisser" && cible.trim()) {
          vestiaire.push({
            id: `d-${jour}-${Date.now()}`,
            label: cible.trim(),
            territoire,
            date: now,
            reversibleJusqua: new Date(Date.now() + H24).toISOString(),
          });
        }

        // Un fragment se révèle (matière, pas étiquette).
        const dispo = fragmentsParTheme("renoncement").concat(FRAGMENTS)
          .find((f) => f.territoireHint === territoire && !s.portrait.fragmentsReveles.includes(f.id))
          ?? FRAGMENTS.find((f) => !s.portrait.fragmentsReveles.includes(f.id));
        const fragmentsReveles = dispo
          ? [...s.portrait.fragmentsReveles, dispo.id]
          : s.portrait.fragmentsReveles;

        const reponses = { ...s.reponses, [jour]: reponse };
        const faits = Object.keys(reponses).length;
        const prochain = Math.min(30, jour + 1);

        set({
          reponses,
          etoiles,
          vestiaire,
          portrait: { clarity: Math.round((faits / 30) * 100), fragmentsReveles },
          voice: { clarity: voiceClarity(prochain) },
          journey: { ...s.journey, currentDay: prochain, acte: acteDuJour(prochain), lastVisit: now },
        });
      },

      reprendre: (depotId) => {
        const s = get();
        const d = s.vestiaire.find((x) => x.id === depotId);
        if (!d) return;
        if (Date.now() > new Date(d.reversibleJusqua).getTime()) return; // fenêtre 24 h passée
        // Rallume une étoile éteinte du territoire, retire le dépôt.
        const etoiles = s.etoiles.map((e) => ({ ...e }));
        const rall = etoiles.find((e) => e.territoire === d.territoire && e.etat === "eteinte");
        if (rall) rall.etat = "diffuse";
        set({ vestiaire: s.vestiaire.filter((x) => x.id !== depotId), etoiles });
      },

      genererDestinations: () =>
        set((s) => ({ destinations: { ...s.destinations, candidates: deriverDestinations(s.reponses) } })),

      eliminerDestination: (id) =>
        set((s) =>
          s.destinations.eliminees.includes(id)
            ? s
            : { destinations: { ...s.destinations, eliminees: [...s.destinations.eliminees, id] } }
        ),

      choisirDestination: (id) =>
        set((s) => ({ destinations: { ...s.destinations, choisie: id } })),

      nommer: (nom) =>
        set((s) => ({ nomFutur: nom.trim() || null, portrait: { ...s.portrait, clarity: 100 } })),

      devSetDay: (n) => {
        const d = Math.max(1, Math.min(30, Math.round(n)));
        set((s) => ({ journey: { ...s.journey, currentDay: d, acte: acteDuJour(d) }, voice: { clarity: voiceClarity(d) } }));
      },

      reinitialiser: () => set(etatDepart()),
    }),
    {
      name: "traversee-v1",
      version: 1,
      // SSR/test-safe : localStorage en navigateur, stockage mémoire ailleurs.
      storage: createJSONStorage(() =>
        typeof window !== "undefined" ? window.localStorage : stockageMemoire
      ),
    }
  )
);
