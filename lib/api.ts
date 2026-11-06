import mockBooks from "@/data/books.mock.json";

export interface Book {
  id: string;
  isbn: string;
  title: string;
  author: string;
  coverUrl: string;
  audienceAge: string;
  tags: string[];
  synopsis: string;
  pages?: number;
  editorial?: string;
  language?: string;
  difficulty?: string;
  edition?: string;
  color?: string;
}

/**
 * Obtiene el catálogo completo de libros desde la fuente estática local (Coste 0€).
 */
export async function getBooks(): Promise<Book[]> {
  // Simulamos una respuesta asíncrona estándar para permitir futura migración transparente
  return mockBooks as Book[];
}

/**
 * Obtiene un libro específico por su identificador.
 */
export async function getBookById(id: string): Promise<Book | undefined> {
  const books = await getBooks();
  return books.find((b) => b.id === id);
}

/**
 * MOTOR GRATUITO HEADLESS CMS CON GOOGLE SHEETS (COSTE CERO / ESCALABILIDAD):
 * 
 * Esta función permite al cliente gestionar su catálogo en una hoja de Google Sheets
 * sin pagar base de datos ni CMS externo.
 * 
 * INSTRUCCIONES PARA EL CLIENTE:
 * 1. Crea una hoja de Google Sheets con las columnas:
 *    id, isbn, title, author, coverUrl, audienceAge, tags (separados por coma), synopsis, pages, editorial
 * 2. En Google Sheets ve a: Archivo > Compartir > Publicar en la web.
 * 3. Selecciona formato: "Valores separados por comas (.csv)" y pulsa Publicar.
 * 4. Copia el ID de la hoja de cálculo (el código alfanumérico en la URL).
 * 5. Descomenta la función y úsala en lugar de getBooks().
 */
export async function getBooksFromGoogleSheets(sheetId: string): Promise<Book[]> {
  /*
  try {
    const csvUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv`;
    const response = await fetch(csvUrl, { next: { revalidate: 3600 } }); // Caché gratuita de 1 hora
    if (!response.ok) throw new Error("Error al consultar Google Sheets");

    const text = await response.text();
    const rows = text.split("\n").filter((r) => r.trim() !== "");
    const headers = rows[0].split(",").map((h) => h.trim());

    const books: Book[] = rows.slice(1).map((row) => {
      // Parseador simple de CSV respetando comillas
      const values = row.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || [];
      const cleanValues = values.map((v) => v.replace(/^"|"$/g, "").trim());
      
      const item: any = {};
      headers.forEach((h, index) => {
        item[h] = cleanValues[index] || "";
      });

      return {
        id: item.id || `alea-${Math.random().toString(36).substring(2, 7)}`,
        isbn: item.isbn,
        title: item.title,
        author: item.author,
        coverUrl: item.coverUrl || "https://covers.openlibrary.org/b/isbn/" + item.isbn + "-L.jpg",
        audienceAge: item.audienceAge || "8-12",
        tags: item.tags ? item.tags.split(";").map((t: string) => t.trim()) : [],
        synopsis: item.synopsis || "",
        pages: item.pages ? parseInt(item.pages, 10) : undefined,
        editorial: item.editorial || "",
        color: item.color || "#2563eb",
      };
    });

    return books;
  } catch (error) {
    console.error("Fallo al conectar con Google Sheets, usando mock local como fallback:", error);
    return mockBooks as Book[];
  }
  */
  return mockBooks as Book[];
}
