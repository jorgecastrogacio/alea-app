import { create } from "zustand";

export interface UserProfile {
  nickname: string;
  age: string;
  worlds: string[];
  interests: string[];
  protagonists: string[];
  rhythm: string;
  formats: string[];
  readingHabit: string;
  completedAt?: string;
}

interface OnboardingState extends UserProfile {
  currentStep: number;
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  setNickname: (name: string) => void;
  setAge: (age: string) => void;
  toggleWorld: (world: string) => void;
  toggleInterest: (interest: string) => void;
  toggleProtagonist: (protagonist: string) => void;
  setRhythm: (rhythm: string) => void;
  toggleFormat: (format: string) => void;
  setReadingHabit: (habit: string) => void;
  resetOnboarding: () => void;
  loadFromStorage: () => boolean;
  saveToStorage: () => void;
}

const STORAGE_KEY = "alea_user_profile";

export const useOnboardingStore = create<OnboardingState>((set, get) => ({
  currentStep: 1,
  nickname: "",
  age: "11",
  worlds: [],
  interests: [],
  protagonists: [],
  rhythm: "",
  formats: [],
  readingHabit: "",

  setStep: (step) => set({ currentStep: step }),
  nextStep: () => set((state) => ({ currentStep: Math.min(state.currentStep + 1, 9) })),
  prevStep: () => set((state) => ({ currentStep: Math.max(state.currentStep - 1, 1) })),

  setNickname: (nickname) => set({ nickname }),
  setAge: (age) => set({ age }),

  // Pantalla 3: Mundos (Máximo 3 opciones)
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

  // Pantalla 4: Qué encontrar (Máximo 3 opciones)
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

  // Pantalla 5: Protagonistas (Máximo 3 opciones)
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

  // Pantalla 6: Ritmo (Selección ÚNICA obligatoria)
  setRhythm: (rhythm) => set({ rhythm }),

  // Pantalla 7: Formato (Máximo 3 opciones)
  // EXCEPCIÓN QUIRÚRGICA: Si se marca "Me da igual el formato", el resto se desmarcan automáticamente.
  // Y si se selecciona otra opción teniendo "Me da igual el formato", este último se retira.
  toggleFormat: (format) => {
    const { formats } = get();
    const ANY_FORMAT = "Me da igual el formato";

    if (format === ANY_FORMAT) {
      // Si se pulsa "Me da igual el formato", si ya estaba marcado se desmarca, si no, se queda SOLO este
      if (formats.includes(ANY_FORMAT)) {
        set({ formats: [] });
      } else {
        set({ formats: [ANY_FORMAT] });
      }
      return;
    }

    // Si se pulsa cualquier otro formato y estaba "Me da igual el formato", se remueve primero
    const cleanedFormats = formats.filter((f) => f !== ANY_FORMAT);

    if (cleanedFormats.includes(format)) {
      set({ formats: cleanedFormats.filter((f) => f !== format) });
    } else {
      if (cleanedFormats.length < 3) {
        set({ formats: [...cleanedFormats, format] });
      }
    }
  },

  // Pantalla 8: Hábito o experiencia de lectura
  setReadingHabit: (readingHabit) => set({ readingHabit }),

  resetOnboarding: () => {
    set({
      currentStep: 1,
      nickname: "",
      age: "11",
      worlds: [],
      interests: [],
      protagonists: [],
      rhythm: "",
      formats: [],
      readingHabit: "",
    });
  },

  loadFromStorage: () => {
    if (typeof window === "undefined") return false;
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        set({
          nickname: parsed.nickname || "Lector",
          age: parsed.age || "11",
          worlds: parsed.worlds || [],
          interests: parsed.interests || [],
          protagonists: parsed.protagonists || [],
          rhythm: parsed.rhythm || "",
          formats: parsed.formats || [],
          readingHabit: parsed.readingHabit || "",
        });
        return true;
      }
    } catch (e) {
      console.error("Error reading localStorage:", e);
    }
    return false;
  },

  saveToStorage: () => {
    if (typeof window === "undefined") return;
    const { nickname, age, worlds, interests, protagonists, rhythm, formats, readingHabit } = get();
    const profile: UserProfile = {
      nickname: nickname.trim() || "Explorador",
      age,
      worlds,
      interests,
      protagonists,
      rhythm,
      formats,
      readingHabit,
      completedAt: new Date().toISOString(),
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    } catch (e) {
      console.error("Error saving to localStorage:", e);
    }
  },
}));
