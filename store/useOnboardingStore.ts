import { create } from "zustand";

export interface UserProfile {
  nickname: string;
  mascotName?: string;
  age: string;
  worlds: string[];
  interests: string[];
  protagonists: string[];
  rhythm: string;
  formats: string[];
  readingHabit: string;
  isGuest?: boolean;
  completedAt?: string;
}

interface OnboardingState extends UserProfile {
  currentStep: number;
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  setNickname: (name: string) => void;
  setMascotName: (name: string) => void;
  setAge: (age: string) => void;
  toggleWorld: (world: string) => void;
  toggleInterest: (interest: string) => void;
  toggleProtagonist: (protagonist: string) => void;
  setRhythm: (rhythm: string) => void;
  toggleFormat: (format: string) => void;
  setReadingHabit: (habit: string) => void;
  skipAsGuest: () => void;
  updatePreferences: (partial: Partial<UserProfile>) => void;
  resetOnboarding: () => void;
  loadFromStorage: () => boolean;
  saveToStorage: () => void;
}

const STORAGE_KEY = "alea_user_profile";

const isAnyFormatOption = (fmt: string) => {
  return fmt.toLowerCase().includes("me da igual");
};

export const useOnboardingStore = create<OnboardingState>((set, get) => ({
  currentStep: 1,
  nickname: "",
  mascotName: "Chispa",
  age: "10",
  worlds: [],
  interests: [],
  protagonists: [],
  rhythm: "",
  formats: [],
  readingHabit: "Lector habitual",
  isGuest: false,

  setStep: (step) => set({ currentStep: step }),
  nextStep: () => set((state) => ({ currentStep: Math.min(state.currentStep + 1, 9) })),
  prevStep: () => set((state) => ({ currentStep: Math.max(state.currentStep - 1, 1) })),

  setNickname: (nickname) => set({ nickname }),
  setMascotName: (mascotName) => set({ mascotName: mascotName.trim() || "Chispa" }),
  setAge: (age) => set({ age }),

  toggleWorld: (world) => {
    const { worlds } = get();
    if (worlds.includes(world)) {
      set({ worlds: worlds.filter((w) => w !== world) });
    } else {
      if (worlds.length < 3) {
        set({ worlds: [...worlds, world] });
      }
    }
  },

  toggleInterest: (interest) => {
    const { interests } = get();
    if (interests.includes(interest)) {
      set({ interests: interests.filter((i) => i !== interest) });
    } else {
      if (interests.length < 3) {
        set({ interests: [...interests, interest] });
      }
    }
  },

  toggleProtagonist: (protagonist) => {
    const { protagonists } = get();
    if (protagonists.includes(protagonist)) {
      set({ protagonists: protagonists.filter((p) => p !== protagonist) });
    } else {
      if (protagonists.length < 3) {
        set({ protagonists: [...protagonists, protagonist] });
      }
    }
  },

  setRhythm: (rhythm) => set({ rhythm }),

  toggleFormat: (format) => {
    const { formats } = get();
    const isTargetAny = isAnyFormatOption(format);

    if (isTargetAny) {
      if (formats.some(isAnyFormatOption)) {
        set({ formats: [] });
      } else {
        set({ formats: [format] });
      }
      return;
    }

    const withoutAny = formats.filter((f) => !isAnyFormatOption(f));
    if (withoutAny.includes(format)) {
      set({ formats: withoutAny.filter((f) => f !== format) });
    } else {
      if (withoutAny.length < 3) {
        set({ formats: [...withoutAny, format] });
      }
    }
  },

  setReadingHabit: (habit) => set({ readingHabit: habit }),

  skipAsGuest: () => {
    const guestProfile: Partial<UserProfile> = {
      nickname: "Explorador",
      mascotName: get().mascotName || "Chispa",
      age: get().age || "10",
      worlds: [],
      interests: [],
      protagonists: [],
      rhythm: "Depende de la historia.",
      formats: ["Me da igual el formato si la historia es buena"],
      readingHabit: "Descubriendo",
      isGuest: true,
      completedAt: new Date().toISOString(),
    };

    set({
      ...guestProfile,
      currentStep: 9,
    });

    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(guestProfile));
      } catch (e) {
        console.error("Error saving guest profile:", e);
      }
    }
  },

  updatePreferences: (partial) => {
    const updated = {
      ...get(),
      ...partial,
      isGuest: false,
    };
    set(updated);
    if (typeof window !== "undefined") {
      try {
        const toSave: UserProfile = {
          nickname: updated.nickname || "Lector",
          mascotName: updated.mascotName || "Chispa",
          age: updated.age || "10",
          worlds: updated.worlds || [],
          interests: updated.interests || [],
          protagonists: updated.protagonists || [],
          rhythm: updated.rhythm || "Depende de la historia.",
          formats: updated.formats || [],
          readingHabit: updated.readingHabit || "Lector",
          isGuest: false,
          completedAt: new Date().toISOString(),
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
      } catch (e) {
        console.error("Error updating preferences in localStorage:", e);
      }
    }
  },

  resetOnboarding: () => {
    const initialState = {
      currentStep: 1,
      nickname: "",
      mascotName: "Chispa",
      age: "10",
      worlds: [],
      interests: [],
      protagonists: [],
      rhythm: "",
      formats: [],
      readingHabit: "Lector habitual",
      isGuest: false,
    };
    set(initialState);
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch (e) {
        console.error("Error clearing profile from localStorage:", e);
      }
    }
  },

  loadFromStorage: () => {
    if (typeof window === "undefined") return false;
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed: UserProfile = JSON.parse(saved);
        set({
          nickname: parsed.nickname || "",
          mascotName: parsed.mascotName || "Chispa",
          age: parsed.age || "10",
          worlds: parsed.worlds || [],
          interests: parsed.interests || [],
          protagonists: parsed.protagonists || [],
          rhythm: parsed.rhythm || "",
          formats: parsed.formats || [],
          readingHabit: parsed.readingHabit || "Lector habitual",
          isGuest: !!parsed.isGuest,
        });
        return true;
      }
    } catch (e) {
      console.error("Error reading profile from localStorage:", e);
    }
    return false;
  },

  saveToStorage: () => {
    if (typeof window === "undefined") return;
    try {
      const state = get();
      const profile: UserProfile = {
        nickname: state.nickname || "Lector",
        mascotName: state.mascotName || "Chispa",
        age: state.age || "10",
        worlds: state.worlds,
        interests: state.interests,
        protagonists: state.protagonists,
        rhythm: state.rhythm,
        formats: state.formats,
        readingHabit: state.readingHabit,
        isGuest: !!state.isGuest,
        completedAt: new Date().toISOString(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    } catch (e) {
      console.error("Error writing profile to localStorage:", e);
    }
  },
}));
