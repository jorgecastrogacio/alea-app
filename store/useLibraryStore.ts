import { create } from "zustand";

export type BookStatus = "want_to_read" | "reading" | "finished" | null;

export interface BookRating {
  stars: number;
  likedTags: string[];
  ratedAt: string;
}

interface LibraryState {
  library: Record<string, "want_to_read" | "reading" | "finished">;
  favorites: string[];
  ratings: Record<string, BookRating>;
  loadLibrary: () => void;
  setBookStatus: (bookId: string, status: "want_to_read" | "reading" | "finished") => void;
  removeBookStatus: (bookId: string) => void;
  getBookStatus: (bookId: string) => BookStatus;
  toggleFavorite: (bookId: string) => void;
  isFavorite: (bookId: string) => boolean;
  setRating: (bookId: string, stars: number, likedTags: string[]) => void;
  getRating: (bookId: string) => BookRating | null;
}

const STORAGE_KEY = "alea_library_state";
const FAVORITES_KEY = "alea_favorites";
const RATINGS_KEY = "alea_ratings";

export const useLibraryStore = create<LibraryState>((set, get) => ({
  library: {},
  favorites: [],
  ratings: {},

  loadLibrary: () => {
    if (typeof window === "undefined") return;
    try {
      const savedLib = localStorage.getItem(STORAGE_KEY);
      const savedFavs = localStorage.getItem(FAVORITES_KEY);
      const savedRatings = localStorage.getItem(RATINGS_KEY);

      set({
        library: savedLib ? JSON.parse(savedLib) : {},
        favorites: savedFavs ? JSON.parse(savedFavs) : [],
        ratings: savedRatings ? JSON.parse(savedRatings) : {},
      });
    } catch (e) {
      console.error("Error reading library data from localStorage:", e);
    }
  },

  setBookStatus: (bookId, status) => {
    const current = get().library[bookId];
    const newLibrary = { ...get().library };
    if (current === status) {
      delete newLibrary[bookId];
    } else {
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

  toggleFavorite: (bookId) => {
    const currentFavs = get().favorites || [];
    const exists = currentFavs.includes(bookId);
    const newFavs = exists
      ? currentFavs.filter((id) => id !== bookId)
      : [...currentFavs, bookId];

    set({ favorites: newFavs });
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavs));
      } catch (e) {
        console.error("Error saving favorites to localStorage:", e);
      }
    }
  },

  isFavorite: (bookId) => {
    return (get().favorites || []).includes(bookId);
  },

  setRating: (bookId, stars, likedTags) => {
    const newRatings = {
      ...get().ratings,
      [bookId]: {
        stars,
        likedTags,
        ratedAt: new Date().toISOString(),
      },
    };

    set({ ratings: newRatings });
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(RATINGS_KEY, JSON.stringify(newRatings));
      } catch (e) {
        console.error("Error saving ratings to localStorage:", e);
      }
    }
  },

  getRating: (bookId) => {
    return get().ratings[bookId] || null;
  },
}));
