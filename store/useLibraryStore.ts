import { create } from "zustand";

export type BookStatus = "want_to_read" | "reading" | "finished" | null;

interface LibraryState {
  library: Record<string, "want_to_read" | "reading" | "finished">;
  loadLibrary: () => void;
  setBookStatus: (bookId: string, status: "want_to_read" | "reading" | "finished") => void;
  removeBookStatus: (bookId: string) => void;
  getBookStatus: (bookId: string) => BookStatus;
}

const STORAGE_KEY = "alea_library_state";

export const useLibraryStore = create<LibraryState>((set, get) => ({
  library: {},

  loadLibrary: () => {
    if (typeof window === "undefined") return;
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        set({ library: JSON.parse(saved) });
      }
    } catch (e) {
      console.error("Error reading library from localStorage:", e);
    }
  },

  setBookStatus: (bookId, status) => {
    const current = get().library[bookId];
    // Si se pulsa el mismo estado que ya tenía, se desactiva (toggle)
    const newLibrary = { ...get().library };
    if (current === status) {
      delete newLibrary[bookId];
    } else {
      // Regla de negocio: solo puede estar en un estado a la vez
      newLibrary[bookId] = status;
    }

    set({ library: newLibrary });
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newLibrary));
      } catch (e) {
        console.error("Error saving library to localStorage:", e);
      }
    }
  },

  removeBookStatus: (bookId) => {
    const newLibrary = { ...get().library };
    delete newLibrary[bookId];
    set({ library: newLibrary });
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newLibrary));
      } catch (e) {
        console.error("Error saving library to localStorage:", e);
      }
    }
  },

  getBookStatus: (bookId) => {
    return get().library[bookId] || null;
  },
}));
