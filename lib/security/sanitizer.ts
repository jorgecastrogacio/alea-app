/**
 * Módulo de Sanitización y Seguridad Infantil para ALEA (Coste $0).
 * Valida longitud, caracteres y aplica lista negra de palabras malsonantes en español.
 */

const SPANISH_PROFANITY_ROOTS = [
  "put",
  "mierd",
  "cabron",
  "tont",
  "gilipoll",
  "maric",
  "foll",
  "cojon",
  "pene",
  "vagina",
  "caca",
  "culo",
  "pedo",
  "pis",
  "zorra",
  "polla",
  "chupa",
  "subnormal",
  "imbecil",
  "bastard",
  "joder",
  "coño",
  "idiota",
];

export interface NicknameValidationResult {
  isValid: boolean;
  sanitized: string;
  error?: string;
}

/**
 * Normaliza texto eliminando acentos, caracteres especiales y leet-speak básico.
 */
function normalizeLeetSpeak(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Quitar tildes y diéresis
    .replace(/0/g, "o")
    .replace(/1/g, "i")
    .replace(/3/g, "e")
    .replace(/4/g, "a")
    .replace(/5/g, "s")
    .replace(/7/g, "t")
    .replace(/8/g, "b")
    .replace(/@/g, "a")
    .replace(/\$/g, "s");
}

/**
 * Sanitiza y valida el apodo o nombre del lector/mascota.
 */
export function sanitizeNickname(input: string): NicknameValidationResult {
  const trimmed = (input || "").trim();

  if (trimmed.length === 0) {
    return {
      isValid: false,
      sanitized: "",
      error: "Por favor, introduce un nombre o apodo.",
    };
  }

  if (trimmed.length < 2) {
    return {
      isValid: false,
      sanitized: trimmed,
      error: "El nombre debe tener al menos 2 letras.",
    };
  }

  if (trimmed.length > 16) {
    return {
      isValid: false,
      sanitized: trimmed.slice(0, 16),
      error: "El nombre no puede tener más de 16 letras.",
    };
  }

  // Permitir letras del español (con tildes, ñ, ü) y espacios simples
  const lettersRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/;
  if (!lettersRegex.test(trimmed)) {
    return {
      isValid: false,
      sanitized: trimmed.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]/g, ""),
      error: "Solo se admiten letras sin números ni símbolos raros.",
    };
  }

  const normalized = normalizeLeetSpeak(trimmed);

  const matchedBadWord = SPANISH_PROFANITY_ROOTS.some((badRoot) => {
    // Coincidencia por raíz o palabra contenida
    return normalized.includes(badRoot);
  });

  if (matchedBadWord) {
    return {
      isValid: false,
      sanitized: "",
      error: "Elige un nombre amigable y bonito para tu universo lector.",
    };
  }

  // Capitalizar la primera letra de cada palabra de forma elegante
  const formatted = trimmed
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");

  return {
    isValid: true,
    sanitized: formatted,
  };
}
