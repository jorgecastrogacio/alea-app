import { z } from "zod";

export const BookSchema = z.object({
  id: z.string().regex(/^alea-[a-z0-9-]+$/),
  isbn: z.string().regex(/^97[89]\d{10}$/, "ISBN-13 español inválido"),
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
