import { Book } from "./api";
import { UserProfile } from "@/store/useOnboardingStore";

export interface ScoredBook {
  book: Book;
  score: number;
  reason: string;
  matchedTags: string[];
}

/**
 * Comprueba si la edad del usuario encaja dentro del rango 'min-max' del libro.
 */
function isAgeInRange(userAgeStr: string, rangeStr: string): boolean {
  const userAge = parseInt(userAgeStr, 10);
  if (isNaN(userAge)) return true;

  const parts = rangeStr.split("-").map((p) => parseInt(p.trim(), 10));
  if (parts.length === 2) {
    return userAge >= parts[0] && userAge <= parts[1];
  }
  return true;
}

/**
 * Motor de recomendación 100% local (Coste 0€, Privacidad total en el navegador).
 * Calcula afinidad algorítmica entre los tags del libro y el perfil del lector.
 */
export function getRecommendedBooks(
  books: Book[],
  profile: UserProfile | null
): ScoredBook[] {
  // Perfil por defecto amigable en caso de no haberse completado el onboarding
  const activeProfile: UserProfile = profile || {
    nickname: "Lector",
    age: "11",
    worlds: ["Fantasía", "Misterio e Investigación"],
    interests: ["Aventuras épicas", "Magia y poderes"],
    protagonists: ["Valiente y líder", "Rebelde y curioso"],
    rhythm: "Ritmo trepidante y sin respiro",
    formats: ["Me da igual el formato"],
    readingHabit: "Leo de vez en cuando y busco algo especial",
  };

  const userPrefTags = [
    ...(activeProfile.worlds || []),
    ...(activeProfile.interests || []),
    ...(activeProfile.protagonists || []),
    ...(activeProfile.rhythm ? [activeProfile.rhythm] : []),
  ];

  const scored: ScoredBook[] = books.map((book) => {
    let score = 0;
    const matchedTags: string[] = [];

    // 1. Coincidencia por Rango de Edad (+3 puntos)
    const ageMatch = isAgeInRange(activeProfile.age, book.audienceAge);
    if (ageMatch) {
      score += 3;
    }

    // 2. Coincidencia por Tags de Intereses, Mundos y Protagonistas (+2 por cada match)
    book.tags.forEach((tag) => {
      if (userPrefTags.includes(tag)) {
        score += 2;
        matchedTags.push(tag);
      }
    });

    // 3. Coincidencia por Ritmo (+2 puntos si coincide exactamente)
    if (activeProfile.rhythm && book.tags.includes(activeProfile.rhythm)) {
      score += 2;
    }

    // 4. Coincidencia por Formato
    const formats = activeProfile.formats || [];
    if (formats.includes("Me da igual el formato")) {
      score += 1;
    } else {
      formats.forEach((fmt) => {
        if (book.tags.includes(fmt)) {
          score += 2;
          if (!matchedTags.includes(fmt)) matchedTags.push(fmt);
        }
      });
    }

    // Generar motivo transparente y humano de la recomendación
    let reason = "";
    if (matchedTags.length >= 2) {
      reason = `Te lo recomendamos porque te gusta ${matchedTags[0]} y esta historia destaca por ${matchedTags[1]}.`;
    } else if (matchedTags.length === 1) {
      reason = `Te lo recomendamos porque encaja con tu interés en ${matchedTags[0]} y tus ${activeProfile.age} años.`;
    } else if (ageMatch) {
      reason = `Seleccionado especialmente para lectores de ${activeProfile.age} años con ganas de una gran lectura.`;
    } else {
      reason = `Una joya imprescindible de nuestro catálogo físico recomendada por libreros.`;
    }

    return {
      book,
      score,
      reason,
      matchedTags,
    };
  });

  // Ordenar por afinidad descendente
  return scored.sort((a, b) => b.score - a.score);
}
