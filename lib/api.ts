import verifiedBooks from "@/data/books.verified.json";
import { Book } from "@/types/book";

export type { Book };

/**
 * Obtiene el catálogo completo de libros desde el JSON verificado oficial (Coste 0€).
 */
export async function getBooks(): Promise<Book[]> {
  return verifiedBooks as Book[];
}

/**
 * Obtiene un libro específico por su identificador único.
 */
export async function getBookById(id: string): Promise<Book | undefined> {
  const books = await getBooks();
  return books.find((b) => b.id === id);
}

/**
 * MOTOR GRATUITO HEADLESS CMS CON GOOGLE SHEETS (COSTE CERO):
 * Permite sincronizar libros editables por el cliente en Google Sheets publicado como CSV.
 */
export async function getBooksFromGoogleSheets(sheetId: string): Promise<Book[]> {
  try {
    const csvUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv`;
    const response = await fetch(csvUrl, { next: { revalidate: 3600 } });
    if (!response.ok) throw new Error("Error al consultar Google Sheets");

    const text = await response.text();
    const rows = text.split("\n").filter((r) => r.trim() !== "");
    const headers = rows[0].split(",").map((h) => h.trim());

    return rows.slice(1).map((row) => {
      const values = row.split(",").map((v) => v.trim());
      const record: Record<string, string> = {};
      headers.forEach((h, i) => {
        record[h] = values[i] || "";
      });

      return {
        id: record.id || `alea-${Math.random().toString(36).substring(7)}`,
        isbn: record.isbn || "9788420482811",
        title: record.title || "Sin título",
        author: record.author || "Autor Desconocido",
        editorial: record.editorial || "Editorial Independiente",
        edition: record.edition || "1ª Edición",
        year: parseInt(record.year, 10) || 2023,
        pages: parseInt(record.pages, 10) || 200,
        language: (record.language as Book["language"]) || "Castellano",
        audienceAge: record.audienceAge || "8-12",
        targetAge: {
          min: parseInt(record.ageMin, 10) || 8,
          max: parseInt(record.ageMax, 10) || 12,
          recommended: parseInt(record.ageRecommended, 10) || 10,
        },
        difficulty: (record.difficulty as Book["difficulty"]) || "Media",
        coverUrl: record.coverUrl || "/assets/books/matilda.jpg",
        coverWebp: record.coverWebp || `/assets/books/${record.id}.webp`,
        color: record.color || "#4f46e5",
        tags: record.tags ? record.tags.split(";").map((t) => t.trim()) : ["Aventura"],
        synopsis: record.synopsis || "Una historia fascinante por descubrir.",
        verifiedSource: "MANUAL_CURATED" as const,
      };
    });
  } catch (error) {
    console.warn("Fallo al conectar con Google Sheets, usando catálogo verificado local:", error);
    return getBooks();
  }
}
