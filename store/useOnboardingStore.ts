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
  nickname: "Daniela",
  mascotName: "Brillo",
  age: "11",
  worlds: ["Bosques encantados", "Castillos y secretos"],
  interests: ["Vivir una gran aventura", "Resolver un misterio"],
  protagonists: ["Niños y niñas como yo"],
  rhythm: "¡Que pasen cosas!",
  formats: ["Me da igual el formato si la historia es buena"],
  readingHabit: "Lector habitual",

  setStep: (step) => set({ currentStep: step }),
  nextStep: () => set((state) => ({ currentStep: Math.min(state.currentStep + 1, 9) })),
  prevStep: () => set((state) => ({ currentStep: Math.max(state.currentStep - 1, 1) })),

  setNickname: (nickname) => set({ nickname }),
  setMascotName: (mascotName) => set({ mascotName: mascotName.trim() || "Brillo" }),
  setAge: (age) => set({ age }),

  // HITO 1: Mundos (Máximo 3 opciones)
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

  // Qué encontrar (Máximo 3 opciones)
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

  // Protagonistas (Máximo 3 opciones)
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

  // Ritmo (Selección Única obligatoria)
  setRhythm: (rhythm) => set({ rhythm }),

  // HITO 1: Formato con REGLA EXCLUYENTE ESTRICTA (Bug #1)
  // Al hacer clic en "Me da igual el formato", las otras opciones pasan forzosamente a false (desmarcadas).
  // Y si se selecciona otra opción específica, "Me da igual el formato" se retira de inmediato.
  toggleFormat: (format) => {
    const { formats } = get();

    if (isAnyFormatOption(format)) {
      if (formats.some(isAnyFormatOption)) {
        set({ formats: [] });
      } else {
        // Se queda FORZOSAMENTE ÚNICO
        set({ formats: [format] });
      }
      return;
    }

    // Si se pulsa cualquier formato específico, se purga cualquier "Me da igual..."
    const cleaned = formats.filter((f) => !isAnyFormatOption(f));

    if (cleaned.includes(format)) {
      set({ formats: cleaned.filter((f) => f !== format) });
    } else {
      if (cleaned.length < 3) {
        set({ formats: [...cleaned, format] });
      }
    }
  },

  setReadingHabit: (readingHabit) => set({ readingHabit }),

  // HITO 6: Edición directa de intereses sin reiniciar onboarding (Bug #10)
  updatePreferences: (partial) => {
    set((state) => {
      const updated = { ...state, ...partial };
      if (typeof window !== "undefined") {
        try {
          const profile: UserProfile = {
            nickname: updated.nickname || "Daniela",
            mascotName: updated.mascotName || "Brillo",
            age: updated.age || "11",
            worlds: updated.worlds || [],
            interests: updated.interests || [],
            protagonists: updated.protagonists || [],
            rhythm: updated.rhythm || "¡Que pasen cosas!",
            formats: updated.formats || [],
            readingHabit: updated.readingHabit || "",
            completedAt: updated.completedAt || new Date().toISOString(),
          };
          localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
        } catch (e) {
          console.error("Error updating profile in localStorage:", e);
        }
      }
      return partial;
    });
  },

  resetOnboarding: () => {
    set({
      currentStep: 1,
      nickname: "",
      mascotName: "Brillo",
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
          nickname: parsed.nickname || "Daniela",
          mascotName: parsed.mascotName || "Brillo",
          age: parsed.age || "11",
          worlds: parsed.worlds || ["Bosques encantados", "Castillos y secretos"],
          interests: parsed.interests || ["Vivir una gran aventura"],
          protagonists: parsed.protagonists || ["Niños y niñas como yo"],
          rhythm: parsed.rhythm || "¡Que pasen cosas!",
          formats: parsed.formats || ["Me da igual el formato si la historia es buena"],
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
    const { nickname, mascotName, age, worlds, interests, protagonists, rhythm, formats, readingHabit } = get();
    const profile: UserProfile = {
      nickname: nickname.trim() || "Daniela",
      mascotName: mascotName?.trim() || "Brillo",
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
