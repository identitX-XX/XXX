import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import {
  CoachMessage,
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
  importAll: (data: Partial<AppState>) => void;
  reset: () => void;
}

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
        }),
    }),
    {
      name: "identitx",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export { computeScores };
