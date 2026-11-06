import { Book } from "./api";
import { UserProfile } from "@/store/useOnboardingStore";

export interface ScoredBook {
  book: Book;
  score: number;
  reason: string;
  matchedTags: string[];
}

const TAG_NATURAL_PREF: Record<string, string> = {
  "Bosques encantados": "los bosques mágicos y de cuento",
  "Castillos y secretos": "los castillos antiguos y los enigmas ocultos",
  "Mundos submarinos": "explorar las profundidades de los océanos",
  "Planetas y galaxias": "el espacio exterior y los planetas lejanos",
  "Islas y aventuras": "las expediciones en islas secretas",
  "Lugares como el nuestro": "las historias ambientadas en la vida real",
  "Resolver un misterio": "investigar misterios y seguir pistas",
  "Vivir una gran aventura": "embarcarte en viajes épicos y aventuras",
  "Reírme muchísimo": "el humor inteligente y las historias divertidas",
  "Encontrar algo inesperado": "las sorpresas y los giros inesperados",
  "Conocer personajes extraordinarios": "conocer a personajes con una chispa única",
  "Superar un reto o un peligro": "las historias de valentía y superación",
  "Niños y niñas como yo": "acompañar a personajes de tu misma edad",
  "Animales con personalidad": "las historias con compañeros animales carismáticos",
  "Seres fantásticos": "las criaturas mágicas y mitológicas",
  "Detectives y exploradores": "acompañar a detectives audaces",
  "Grupos de amigos": "las pandillas de amigos inseparables",
  "Personas normales que viven cosas extraordinarias": "descubrir a personas comunes viviendo cosas asombrosas",
  "¡Que pasen cosas!": "la acción continua, el ritmo ágil y las sorpresas",
  "Que me atrapen poco a poco.": "las historias envolventes que se disfrutan con calma",
  "Depende de la historia.": "las lecturas con buen equilibrio de ritmo",
  "Libros con muchas ilustraciones": "disfrutar de hermosos dibujos en las páginas",
  "Cómics y novelas gráficas": "el dinamismo del cómic y la novela gráfica",
  "Historias con capítulos cortos": "los capítulos cortos y directos al grano",
  "Novelas largas": "sumergirte en lecturas largas y detalladas",
};

const TAG_NATURAL_QUALITY: Record<string, string> = {
  "Bosques encantados": "su mágica atmósfera de bosque de cuento",
  "Castillos y secretos": "sus pasadizos secretos y misterios históricos",
  "Mundos submarinos": "su emocionante exploración marina",
  "Planetas y galaxias": "su fascinante recorrido por el cosmos",
  "Islas y aventuras": "sus trepidantes aventuras en tierras lejanas",
  "Lugares como el nuestro": "su enorme cercanía y personajes auténticos",
  "Resolver un misterio": "un enigma brillante que querrás descifrar",
  "Vivir una gran aventura": "un viaje inolvidable lleno de emoción",
  "Reírme muchísimo": "situaciones cómicas con las que reír a carcajadas",
  "Encontrar algo inesperado": "giros ingeniosos que te dejarán con ganas de más",
  "Conocer personajes extraordinarios": "personajes entrañables que se quedan contigo",
  "Superar un reto o un peligro": "su inspirador mensaje de coraje y empatía",
  "Niños y niñas como yo": "situaciones cotidianas con las que te sentirás en casa",
  "Animales con personalidad": "un vínculo leal y divertido con animales inolvidables",
  "Seres fantásticos": "un universo habitado por criaturas legendarias",
  "Detectives y exploradores": "una investigación apasionante llena de pistas",
  "Grupos de amigos": "un grupo de amigos leales que lo dan todo el uno por el otro",
  "Personas normales que viven cosas extraordinarias": "una historia sobre el extraordinario valor de ser diferente",
  "¡Que pasen cosas!": "un ritmo trepidante que atrapa desde el primer capítulo",
  "Que me atrapen poco a poco.": "una historia cálida que te sumerge en su mundo página a página",
  "Depende de la historia.": "un balance perfecto entre acción y reflexión",
  "Libros con muchas ilustraciones": "un apartado visual lleno de encanto y color",
  "Cómics y novelas gráficas": "viñetas dinámicas y expresivas",
  "Historias con capítulos cortos": "capítulos breves ideales para leer a tu ritmo",
  "Novelas largas": "una trama absorbente para disfrutar sin prisas",
};

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
 * Formatea en lenguaje natural el motivo por el cual un libro encaja con el perfil.
 */
export function buildNaturalReason(
  matchedTags: string[],
  userAge: string,
  ageMatch: boolean
): string {
  if (matchedTags.length >= 2) {
    const prefTag = matchedTags[0];
    const qualityTag = matchedTags[1];
    const prefText = TAG_NATURAL_PREF[prefTag] || prefTag.toLowerCase();
    const qualityText = TAG_NATURAL_QUALITY[qualityTag] || qualityTag.toLowerCase();
    return `Te lo recomendamos porque te gusta ${prefText} y esta historia destaca por ${qualityText}.`;
  } else if (matchedTags.length === 1) {
    const prefTag = matchedTags[0];
    const prefText = TAG_NATURAL_PREF[prefTag] || prefTag.toLowerCase();
    return `Te lo recomendamos porque te gusta ${prefText} y encaja genial con tus ${userAge} años.`;
  } else if (ageMatch) {
    return `Una historia ideal seleccionada por libreros para lectores de ${userAge} años con ganas de una gran lectura física.`;
  }
  return `Una obra maestra de la literatura infantil y juvenil recomendada para descubrir en papel.`;
}

/**
 * Obtiene el motivo de recomendación para un libro concreto y el perfil activo.
 */
export function getBookRecommendationReason(
  book: Book,
  profile: UserProfile | null
): string {
  const activeProfile = profile || {
    nickname: "Daniela",
    age: "11",
    worlds: ["Bosques encantados", "Castillos y secretos"],
    interests: ["Vivir una gran aventura", "Resolver un misterio"],
    protagonists: ["Niños y niñas como yo"],
    rhythm: "¡Que pasen cosas!",
    formats: ["Me da igual el formato si la historia es buena"],
    readingHabit: "Lector habitual",
  };

  const userPrefTags = [
    ...(activeProfile.worlds || []),
    ...(activeProfile.interests || []),
    ...(activeProfile.protagonists || []),
    ...(activeProfile.rhythm ? [activeProfile.rhythm] : []),
  ];

  const matchedTags: string[] = [];
  book.tags.forEach((tag) => {
    if (userPrefTags.includes(tag)) {
      matchedTags.push(tag);
    }
  });

  const ageMatch = isAgeInRange(activeProfile.age, book.audienceAge);
  return buildNaturalReason(matchedTags, activeProfile.age, ageMatch);
}

/**
 * Motor de recomendación local (Coste 0€).
 */
export function getRecommendedBooks(
  books: Book[],
  profile: UserProfile | null
): ScoredBook[] {
  const activeProfile: UserProfile = profile || {
    nickname: "Daniela",
    mascotName: "Brillo",
    age: "11",
    worlds: ["Bosques encantados", "Castillos y secretos", "Lugares como el nuestro"],
    interests: ["Vivir una gran aventura", "Resolver un misterio"],
    protagonists: ["Niños y niñas como yo"],
    rhythm: "¡Que pasen cosas!",
    formats: ["Me da igual el formato si la historia es buena"],
    readingHabit: "Lector habitual",
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

    // 1. Coincidencia por Rango de Edad (+3)
    const ageMatch = isAgeInRange(activeProfile.age, book.audienceAge);
    if (ageMatch) score += 3;

    // 2. Coincidencia por Tags de Intereses, Mundos y Protagonistas (+2 cada uno)
    book.tags.forEach((tag) => {
      if (userPrefTags.includes(tag)) {
        score += 2;
        matchedTags.push(tag);
      }
    });

    // 3. Coincidencia por Ritmo (+2)
    if (activeProfile.rhythm && book.tags.includes(activeProfile.rhythm)) {
      score += 2;
    }

    // 4. Coincidencia por Formato
    const formats = activeProfile.formats || [];
    const isAnyFormat = formats.some((f) => f.startsWith("Me da igual"));
    if (isAnyFormat) {
      score += 1;
    } else {
      formats.forEach((fmt) => {
        if (book.tags.includes(fmt)) {
          score += 2;
          if (!matchedTags.includes(fmt)) matchedTags.push(fmt);
        }
      });
    }

    const reason = buildNaturalReason(matchedTags, activeProfile.age, ageMatch);

    return {
      book,
      score,
      reason,
      matchedTags,
    };
  });

  return scored.sort((a, b) => b.score - a.score);
}
