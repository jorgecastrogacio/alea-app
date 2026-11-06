"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getBookById, Book } from "@/lib/api";
import { useLibraryStore, BookStatus } from "@/store/useLibraryStore";
import BookCover from "@/components/BookCover";
import {
  ArrowLeft,
  Bookmark,
  BookOpen,
  CheckCircle2,
  Library,
  Copy,
  ExternalLink,
  Sparkles,
  Check,
  X,
  MapPin,
} from "lucide-react";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function BookDetailPage({ params }: PageProps) {
  const router = useRouter();
  const unwrappedParams = use(params);
  const bookId = unwrappedParams.id;

  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [showLibraryModal, setShowLibraryModal] = useState(false);
  const [copiedIsbn, setCopiedIsbn] = useState(false);

  const { library, loadLibrary, setBookStatus, getBookStatus } = useLibraryStore();

  useEffect(() => {
    loadLibrary();
    const fetchBook = async () => {
      const data = await getBookById(bookId);
      if (data) {
        setBook(data);
      }
      setLoading(false);
    };
    fetchBook();
  }, [bookId, loadLibrary]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-8 text-indigo-400">
        Abriendo libro...
      </div>
    );
  }

  if (!book) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4">
        <h2 className="text-xl font-bold text-[#26245C]">Libro no encontrado</h2>
        <p className="text-sm text-slate-500">
          No pudimos localizar este ejemplar en el catálogo de ALEA.
        </p>
        <Link
          href="/descubre"
          className="px-5 py-2.5 bg-[#4F46E5] text-white rounded-2xl text-xs font-bold"
        >
          Volver al Inicio
        </Link>
      </div>
    );
  }

  const currentStatus = getBookStatus(book.id);

  const handleCopyIsbn = () => {
    if (typeof navigator !== "undefined") {
      navigator.clipboard.writeText(book.isbn);
      setCopiedIsbn(true);
      setTimeout(() => setCopiedIsbn(false), 2500);
    }
  };

  return (
    <div className="flex-1 flex flex-col p-4 md:p-7 space-y-6">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="w-10 h-10 rounded-full bg-white shadow-sm border border-indigo-100 flex items-center justify-center text-slate-600 hover:text-slate-900 transition-colors"
          aria-label="Volver atrás"
        >
          <ArrowLeft size={18} />
        </button>

        <span className="text-xs font-bold text-[#30337E] uppercase tracking-wider">
          Ficha del Libro Físico
        </span>

        <button
          onClick={handleCopyIsbn}
          className="w-10 h-10 rounded-full bg-white shadow-sm border border-indigo-100 flex items-center justify-center text-slate-600 hover:text-indigo-600 transition-colors"
          title="Copiar ISBN"
        >
          {copiedIsbn ? <Check size={18} className="text-emerald-600" /> : <Copy size={18} />}
        </button>
      </div>

      {/* Book Hero Presentation */}
      <div className="alea-card p-6 md:p-8 flex flex-col items-center text-center space-y-5">
        {/* Protagonist Cover */}
        <div className="transform hover:scale-105 transition-transform duration-300">
          <BookCover
            title={book.title}
            author={book.author}
            coverUrl={book.coverUrl}
            color={book.color}
            size="lg"
          />
        </div>

        <div className="space-y-1.5 max-w-sm">
          <span className="text-xs font-bold text-[#4345B5] bg-[#ECEEFC] px-3 py-1 rounded-full inline-block">
            {book.audienceAge} años
          </span>
          <h1 className="text-2xl font-black text-[#26245C] leading-tight">
            {book.title}
          </h1>
          <p className="text-sm font-semibold text-slate-500">
            {book.author}
          </p>
        </div>

        {/* Technical metadata */}
        <div className="flex items-center justify-center gap-3 text-xs text-slate-500 font-medium py-1 px-4 bg-[#F4F5FD] rounded-full border border-indigo-100/60">
          <span>ISBN: {book.isbn}</span>
          {book.pages && <span>· {book.pages} págs.</span>}
          {book.editorial && <span>· {book.editorial}</span>}
        </div>

        {/* 3 Status Selector Buttons (Exclusive toggle) */}
        <div className="w-full max-w-sm pt-2 space-y-2">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Estado en Mi Biblioteca
          </span>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setBookStatus(book.id, "want_to_read")}
              className={`py-2.5 px-2 rounded-2xl text-xs font-bold flex flex-col items-center justify-center gap-1 transition-all ${
                currentStatus === "want_to_read"
                  ? "bg-amber-500 text-white shadow-magical ring-2 ring-amber-300 scale-105"
                  : "bg-white text-slate-600 border border-indigo-100 hover:border-amber-300"
              }`}
            >
              <Bookmark size={16} strokeWidth={currentStatus === "want_to_read" ? 2.5 : 2} />
              <span>Quiero leer</span>
            </button>

            <button
              type="button"
              onClick={() => setBookStatus(book.id, "reading")}
              className={`py-2.5 px-2 rounded-2xl text-xs font-bold flex flex-col items-center justify-center gap-1 transition-all ${
                currentStatus === "reading"
                  ? "bg-[#4F46E5] text-white shadow-magical ring-2 ring-indigo-300 scale-105"
                  : "bg-white text-slate-600 border border-indigo-100 hover:border-indigo-300"
              }`}
            >
              <BookOpen size={16} strokeWidth={currentStatus === "reading" ? 2.5 : 2} />
              <span>Estoy leyendo</span>
            </button>

            <button
              type="button"
              onClick={() => setBookStatus(book.id, "finished")}
              className={`py-2.5 px-2 rounded-2xl text-xs font-bold flex flex-col items-center justify-center gap-1 transition-all ${
                currentStatus === "finished"
                  ? "bg-emerald-600 text-white shadow-magical ring-2 ring-emerald-300 scale-105"
                  : "bg-white text-slate-600 border border-indigo-100 hover:border-emerald-300"
              }`}
            >
              <CheckCircle2 size={16} strokeWidth={currentStatus === "finished" ? 2.5 : 2} />
              <span>Leído</span>
            </button>
          </div>
        </div>

        {/* Public Library Button (Hito 6) */}
        <div className="w-full max-w-sm pt-2">
          <button
            type="button"
            onClick={() => setShowLibraryModal(true)}
            className="w-full py-3.5 px-5 rounded-full bg-[#343788] hover:bg-[#282B70] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-magical transition-all active:scale-[0.98]"
          >
            <Library size={16} />
            <span>Buscar en Biblioteca Pública (Préstamo Gratis)</span>
          </button>
        </div>
      </div>

      {/* Tags and Key themes */}
      <div className="alea-card p-5 space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#30337E] flex items-center gap-1.5">
          <Sparkles size={14} className="text-indigo-500" />
          Temáticas y Claves
        </h3>
        <div className="flex flex-wrap gap-2">
          {book.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 bg-[#ECEEFC] text-[#343788] rounded-xl text-xs font-bold"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* Synopsis */}
      <div className="alea-card p-5 space-y-2">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#30337E]">
          Sinopsis
        </h3>
        <p className="text-xs sm:text-sm leading-relaxed text-slate-600">
          {book.synopsis}
        </p>
      </div>

      {/* Library Modal */}
      {showLibraryModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-3xl p-6 space-y-4 shadow-2xl border border-indigo-100 relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setShowLibraryModal(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100"
              aria-label="Cerrar modal"
            >
              <X size={18} />
            </button>

            <div className="text-center space-y-2 pt-1">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-[#ECEEFC] text-[#474AB6] flex items-center justify-center shadow-sm">
                <Library size={28} />
              </div>
              <h3 className="text-base font-black text-[#26245C]">
                Buscar en Biblioteca Pública
              </h3>
              <p className="text-xs text-slate-500">
                Redirigiendo al catálogo de la biblioteca para buscar el ISBN:
              </p>
            </div>

            <div className="p-3 bg-[#F4F5FD] rounded-2xl border border-indigo-100 text-center font-mono font-bold text-slate-800 text-sm flex items-center justify-center gap-2">
              <span>{book.isbn}</span>
              <button
                onClick={handleCopyIsbn}
                className="text-xs font-sans text-indigo-600 hover:underline font-bold"
              >
                {copiedIsbn ? "¡Copiado!" : "Copiar"}
              </button>
            </div>

            <div className="space-y-2 text-xs text-slate-600 leading-relaxed bg-[#ECEEFC]/70 p-3.5 rounded-2xl border border-indigo-100">
              <p className="font-bold text-[#2A2B68]">
                ¿Cómo pedirlo en persona?
              </p>
              <p className="text-[11px] leading-relaxed">
                Muestra este ISBN en el mostrador de tu biblioteca de barrio o colegio para solicitar el préstamo físico totalmente gratis.
              </p>
            </div>

            <div className="space-y-2 pt-1">
              <a
                href={`https://rebiun.baratz.es/rebiun/search?q=${book.isbn}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 rounded-full bg-[#4F46E5] hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors"
              >
                <span>Abrir catálogo Rebiun / eBiblio</span>
                <ExternalLink size={14} />
              </a>

              <button
                type="button"
                onClick={() => setShowLibraryModal(false)}
                className="w-full py-2.5 px-4 rounded-full text-slate-500 hover:bg-slate-100 font-bold text-xs transition-colors"
              >
                Volver
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
