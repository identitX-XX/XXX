import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import {
  ChatMsg,
  CoachMessage,
  FusionEntry,
  Identity,
  IdentityCard,
  JournalEntry,
  Profile,
  RadarPoint,
  Theme,
  TimelineEvent,
} from "@/types";
import {
  computeScores,
  seedCards,
  seedJournal,
  seedRadar,
  seedTimeline,
} from "@/lib/seed";

const emptyProfile: Profile = {
  name: "",
  age: "",
  situation: "",
  goal: "",
  energy: 60,
  clarity: 50,
  blocker: "",
  understand: "",
  values: ["", "", ""],
  strengths: ["", "", ""],
  fear: "",
  ambition: "",
  keyword: "",
};

interface AppState {
  onboarded: boolean;
  theme: Theme;
  profile: Profile;
  cards: IdentityCard[];
  timeline: TimelineEvent[];
  journal: JournalEntry[];
  radar: RadarPoint[];
  coach: CoachMessage[];

  // Constellation slices (source de vérité unique, ex-localStorage direct)
  journalFusion: FusionEntry[];
  identities: Identity[];
  coachChat: ChatMsg[];

  completeOnboarding: (p: Profile) => void;
  setTheme: (t: Theme) => void;
  updateCard: (id: string, patch: Partial<IdentityCard>) => void;
  addTimelineEvent: (e: TimelineEvent) => void;
  updateTimelineEvent: (id: string, patch: Partial<TimelineEvent>) => void;
  removeTimelineEvent: (id: string) => void;
  addJournalEntry: (e: JournalEntry) => void;
  removeJournalEntry: (id: string) => void;
  setRadar: (r: RadarPoint[]) => void;
  addCoachMessage: (m: CoachMessage) => void;
  setJournalFusion: (entries: FusionEntry[]) => void;
  setIdentities: (identities: Identity[]) => void;
  setCoachChat: (messages: ChatMsg[]) => void;
  importAll: (data: Partial<AppState>) => void;
  reset: () => void;
}

const LEGACY_KEYS = {
  journalFusion: "identitx-journal-fusion",
  identities: "identitx-cognitive-map",
  coachChat: "identitx-coach-chat",
} as const;

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      onboarded: false,
      theme: "dark",
      profile: emptyProfile,
      cards: [],
      timeline: [],
      journal: [],
      radar: [],
      coach: [],
      journalFusion: [],
      identities: [],
      coachChat: [],

      completeOnboarding: (p) =>
        set({
          onboarded: true,
          profile: p,
          cards: seedCards(p),
          timeline: seedTimeline(p),
          journal: seedJournal(p),
          radar: seedRadar(p),
          coach: [
            {
              id: "c0",
              role: "coach",
              content: `Bonjour ${
                p.name || "à toi"
              }. Je suis IDENTITX AI. Je m'appuie sur ton profil pour t'aider à y voir clair. Par quoi commence-t-on ?`,
            },
          ],
        }),

      setTheme: (t) => set({ theme: t }),

      updateCard: (id, patch) =>
        set({
          cards: get().cards.map((c) => (c.id === id ? { ...c, ...patch } : c)),
        }),

      addTimelineEvent: (e) => set({ timeline: [...get().timeline, e] }),
      updateTimelineEvent: (id, patch) =>
        set({
          timeline: get().timeline.map((t) =>
            t.id === id ? { ...t, ...patch } : t
          ),
        }),
      removeTimelineEvent: (id) =>
        set({ timeline: get().timeline.filter((t) => t.id !== id) }),

      addJournalEntry: (e) => set({ journal: [e, ...get().journal] }),
      removeJournalEntry: (id) =>
        set({ journal: get().journal.filter((j) => j.id !== id) }),

      setRadar: (r) => set({ radar: r }),

      addCoachMessage: (m) => set({ coach: [...get().coach, m] }),

      setJournalFusion: (entries) => set({ journalFusion: entries }),
      setIdentities: (identities) => set({ identities }),
      setCoachChat: (messages) => set({ coachChat: messages }),

      importAll: (data) => set({ ...data }),

      reset: () =>
        set({
          onboarded: false,
          profile: emptyProfile,
          cards: [],
          timeline: [],
          journal: [],
          radar: [],
          coach: [],
          journalFusion: [],
          identities: [],
          coachChat: [],
        }),
    }),
    {
      name: "identitx",
      version: 1,
      storage: createJSONStorage(() => localStorage),
      // One-shot migration: absorb the pre-Bloc-3 standalone localStorage keys
      // (journal d'expansion, cartographie, chat coach) into the unified store,
      // then drop the legacy keys. Runs once for existing users (v0 -> v1).
      migrate: (persisted, version) => {
        const s = (persisted ?? {}) as Partial<AppState>;
        if (version < 1) {
          try {
            (Object.keys(LEGACY_KEYS) as (keyof typeof LEGACY_KEYS)[]).forEach(
              (slice) => {
                const current = s[slice] as unknown[] | undefined;
                if (!current || current.length === 0) {
                  const raw = localStorage.getItem(LEGACY_KEYS[slice]);
                  if (raw) (s as Record<string, unknown>)[slice] = JSON.parse(raw);
                }
                localStorage.removeItem(LEGACY_KEYS[slice]);
              }
            );
          } catch {}
        }
        return s as AppState;
      },
    }
  )
);

export { computeScores };
