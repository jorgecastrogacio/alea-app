import { z } from "zod";

/**
 * Valida matemáticamente el dígito de control oficial EAN-13 / ISBN-13
 * de acuerdo con el estándar internacional ISO 2108.
 */
export function isValidISBN13(isbn: string): boolean {
  const clean = isbn.replace(/[-\s]/g, "");
  if (!/^97[89]\d{10}$/.test(clean)) return false;
  let sum = 0;
  for (let i = 0; i < 12; i++) {
    sum += parseInt(clean[i], 10) * (i % 2 === 0 ? 1 : 3);
  }
  const checkDigit = (10 - (sum % 10)) % 10;
  return checkDigit === parseInt(clean[12], 10);
}

export const BookSchema = z.object({
  id: z.string().regex(/^alea-[a-z0-9-]+$/),
  isbn: z
    .string()
    .regex(/^97[89]\d{10}$/, "ISBN-13 debe comenzar con 978 o 979 y tener 13 dígitos")
    .refine(isValidISBN13, {
      message: "El dígito de control del ISBN-13 no coincide con el algoritmo matemático oficial EAN-13",
    }),
  title: z.string().min(1).max(180),
  author: z.string().min(1).max(120),
  editorial: z.string().min(1).max(80),
  edition: z.string().max(80),
  year: z.number().int().min(1900).max(new Date().getFullYear()),
  pages: z.number().int().positive(),
  language: z.enum(["Castellano", "Català", "Galego", "Euskara", "Valencià"]),
  audienceAge: z.string(), // ej. "8-12"
  targetAge: z.object({
    min: z.number().int().min(5).max(16),
    max: z.number().int().min(7).max(18),
    recommended: z.number().int().min(6).max(17),
  }),
  difficulty: z.enum(["Fácil", "Media", "Avanzada"]),
  coverUrl: z.string(),
  coverWebp: z.string(),
  color: z.string().regex(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i),
  tags: z.array(z.string()).min(2).max(8),
  synopsis: z.string().min(30).max(600),
  verifiedSource: z.enum(["BNE_DATOS", "MCU_LIBROS", "MANUAL_CURATED"]),
});

export type Book = z.infer<typeof BookSchema>;
