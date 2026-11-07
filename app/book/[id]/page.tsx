"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getBookById, Book } from "@/lib/api";
import { useLibraryStore } from "@/store/useLibraryStore";
import { useOnboardingStore } from "@/store/useOnboardingStore";
import { getBookRecommendationReason } from "@/lib/recommendation";
import BookCover from "@/components/BookCover";
import { BrilloAvatar } from "@/components/BrilloAvatar";
import { LibraryLocator } from "@/components/LibraryLocator";
import { BookCover3D } from "@/components/BookCover3D";
import { sounds } from "@/lib/soundEffects";
import { triggerMagicConfetti } from "@/lib/confetti";
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
  Heart,
  Star,
  CheckCircle,
} from "lucide-react";

interface PageProps {
  params: Promise<{ id: string }>;
}

const OPINION_TAGS = [
  "Engancha desde el principio",
  "Personajes increíbles",
  "Final inesperado",
  "Fácil de leer",
  "Muy divertido",
  "Me hizo pensar",
];

export default function BookDetailPage({ params }: PageProps) {
  const router = useRouter();
  const unwrappedParams = use(params);
  const bookId = unwrappedParams.id;

  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [showLibraryModal, setShowLibraryModal] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [copiedIsbn, setCopiedIsbn] = useState(false);

  // Rating modal form state
  const [selectedStars, setSelectedStars] = useState(5);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showThankYou, setShowThankYou] = useState(false);

  const {
    loadLibrary,
    setBookStatus,
    getBookStatus,
    toggleFavorite,
    isFavorite,
    toggleLoan,
    isLoan,
    setRating,
    getRating,
  } = useLibraryStore();

  const userProfile = useOnboardingStore();
  const [activeProfile, setActiveProfile] = useState<{ nickname: string; mascotName: string }>({
    nickname: userProfile.nickname || "Lector",
    mascotName: userProfile.mascotName || "Chispa",
  });

  useEffect(() => {
    try {
      const saved = localStorage.getItem("alea_user_profile");
      if (saved) {
        const parsed = JSON.parse(saved);
        setActiveProfile({
          nickname: parsed.nickname || userProfile.nickname || "Lector",
          mascotName: parsed.mascotName || userProfile.mascotName || "Chispa",
        });
        return;
      }
    } catch {}
    setActiveProfile({
      nickname: userProfile.nickname || "Lector",
      mascotName: userProfile.mascotName || "Chispa",
    });
  }, [userProfile.nickname, userProfile.mascotName]);

  const mascotName = activeProfile.mascotName;
  const readerName = activeProfile.nickname;

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

  useEffect(() => {
    if (book) {
      const currentRating = getRating(book.id);
      if (currentRating) {
        setSelectedStars(currentRating.stars);
        setSelectedTags(currentRating.likedTags);
      }
    }
  }, [book, getRating]);

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
  const bookIsFavorite = isFavorite(book.id);
  const bookIsLoan = isLoan(book.id);
  const existingRating = getRating(book.id);
  const recommendationReason = getBookRecommendationReason(book, userProfile);

  const handleCopyIsbn = () => {
    if (typeof navigator !== "undefined") {
      navigator.clipboard.writeText(book.isbn);
      setCopiedIsbn(true);
      setTimeout(() => setCopiedIsbn(false), 2500);
    }
  };

  const toggleOpinionTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleToggleFavorite = () => {
    sounds.playPop();
    toggleFavorite(book.id);
  };

  const handleSetStatus = (status: "want_to_read" | "reading" | "finished") => {
    if (status === "finished") {
      sounds.playCelebration();
      triggerMagicConfetti();
    } else {
      sounds.playPop();
    }
    setBookStatus(book.id, status);
  };

  const handleSaveRating = () => {
    setRating(book.id, selectedStars, selectedTags);
    sounds.playCelebration();
    triggerMagicConfetti();
    setShowThankYou(true);
    setTimeout(() => {
      setShowThankYou(false);
      setShowRatingModal(false);
    }, 1800);
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

        <div className="flex items-center gap-2">
          {/* Favorite button */}
          <button
            onClick={handleToggleFavorite}
            className={`w-10 h-10 rounded-full bg-white shadow-sm border transition-all flex items-center justify-center ${
              bookIsFavorite
                ? "border-rose-300 text-rose-500 bg-rose-50/50 scale-105"
                : "border-indigo-100 text-slate-400 hover:text-rose-500 hover:border-rose-200"
            }`}
            title={bookIsFavorite ? "Quitar de favoritos" : "Guardar en favoritos"}
          >
            <Heart
              size={18}
              className={`transition-all ${bookIsFavorite ? "fill-rose-500 scale-110" : ""}`}
            />
          </button>

          <button
            onClick={handleCopyIsbn}
            className="w-10 h-10 rounded-full bg-white shadow-sm border border-indigo-100 flex items-center justify-center text-slate-600 hover:text-indigo-600 transition-colors"
            title="Copiar ISBN"
          >
            {copiedIsbn ? <Check size={18} className="text-emerald-600" /> : <Copy size={18} />}
          </button>
        </div>
      </div>

      {/* Book Hero Presentation */}
      <div className="alea-card p-6 md:p-8 flex flex-col items-center text-center space-y-5">
        {/* Protagonist Cover 3D with Gyroscope tilt and glare */}
        <div className="py-2">
          <BookCover3D
            title={book.title}
            author={book.author}
            coverUrl={book.coverUrl}
            color={book.color}
            size="lg"
            enableTilt={true}
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
        <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-slate-600 font-medium py-1.5 px-4 bg-[#F4F5FD] rounded-2xl border border-indigo-100/60 max-w-md">
          <span>ISBN: {book.isbn}</span>
          {book.pages && <span>• {book.pages} págs.</span>}
          {book.language && <span>• {book.language}</span>}
          {book.difficulty && (
            <span className="px-2 py-0.5 rounded-full bg-white text-indigo-700 font-bold border border-indigo-100">
              Lectura {book.difficulty}
            </span>
          )}
          {book.edition && <span>• {book.edition}</span>}
        </div>

        {/* Aviso de divulgación cultural y derecho de cita (Hito de Rigor Editorial) */}
        <p className="text-[10px] text-slate-400 max-w-md text-center leading-normal">
          Carátula de referencia y datos bibliográficos mostrados con fines de prescripción lectora y derecho de cita cultural (art. 32 LPI). Los derechos pertenecen a sus autores y editoriales.
        </p>

        {/* 3 Status Selector Buttons (Exclusive toggle) */}
        <div className="w-full max-w-sm pt-2 space-y-2">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Estado en Mi Biblioteca
          </span>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleSetStatus("want_to_read")}
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
              onClick={() => handleSetStatus("reading")}
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
              onClick={() => handleSetStatus("finished")}
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

        {/* Loan toggle (HITO 5, Punto 35) */}
        <div className="w-full max-w-sm">
          <button
            type="button"
            onClick={() => {
              sounds.playPop();
              toggleLoan(book.id);
            }}
            className={`w-full py-2.5 px-3.5 rounded-2xl text-xs font-bold flex items-center justify-between border transition-all ${
              bookIsLoan
                ? "bg-emerald-50 border-emerald-300 text-emerald-800 shadow-sm"
                : "bg-white border-indigo-100/80 text-slate-600 hover:border-emerald-200 hover:bg-emerald-50/30"
            }`}
          >
            <div className="flex items-center gap-2">
              <div
                className={`w-6 h-6 rounded-lg flex items-center justify-center ${
                  bookIsLoan ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-500"
                }`}
              >
                <Library size={13} />
              </div>
              <span className="text-left font-bold">
                {bookIsLoan ? "En préstamo de biblioteca pública" : "¿Prestado de la biblioteca?"}
              </span>
            </div>
            <span
              className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                bookIsLoan ? "bg-emerald-200/80 text-emerald-900" : "bg-slate-100 text-slate-500"
              }`}
            >
              {bookIsLoan ? "Activo" : "Marcar"}
            </span>
          </button>
        </div>

        {/* Valoración / Review card when Read or Rated (HITO 4, Bug #5) */}
        {(currentStatus === "finished" || existingRating) && (
          <div className="w-full max-w-sm pt-2">
            <div className="p-3.5 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl flex items-center justify-between">
              <div className="text-left space-y-0.5">
                <span className="text-xs font-bold text-amber-900 block">
                  {existingRating ? "Tu valoración:" : "¿Qué te pareció?"}
                </span>
                {existingRating ? (
                  <div className="flex items-center gap-1 text-amber-500">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        className={i < existingRating.stars ? "fill-amber-400 text-amber-400" : "text-slate-300"}
                      />
                    ))}
                    <span className="text-[11px] font-bold text-slate-600 ml-1">
                      {existingRating.stars}/5
                    </span>
                  </div>
                ) : (
                  <span className="text-[11px] text-amber-800">
                    Cuéntale a {mascotName} cómo fue tu viaje.
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={() => setShowRatingModal(true)}
                className="py-1.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-sm transition-all"
              >
                {existingRating ? "Editar opinión" : "Valorar ahora"}
              </button>
            </div>
          </div>
        )}

        {/* Public Library Button (HITO 5, Bug #8) */}
        <div className="w-full max-w-sm pt-2">
          <button
            type="button"
            onClick={() => setShowLibraryModal(true)}
            className="w-full py-3.5 px-5 rounded-full bg-[#343788] hover:bg-[#282B70] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-magical transition-all active:scale-[0.98]"
          >
            <Library size={16} />
            <span>Buscar en Biblioteca Pública Local</span>
          </button>
        </div>
      </div>

      {/* Mascot Recommendation Reason (HITO 3, Bug #7) */}
      <div className="alea-card p-4 sm:p-5 flex items-start gap-3.5 bg-gradient-to-r from-indigo-50/80 via-white to-amber-50/40 border border-indigo-100">
        <BrilloAvatar size="sm" expression="reading" name={mascotName} className="shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="text-xs font-black text-[#26245C] flex items-center gap-1.5">
            <Sparkles size={13} className="text-amber-500" />
            Por qué se lo recomiendo a {readerName}:
          </span>
          <p className="text-xs text-slate-700 leading-relaxed font-medium">
            {recommendationReason}
          </p>
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

      {/* Rating Modal (HITO 4, Bug #5) */}
      {showRatingModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-3xl p-6 space-y-4 shadow-2xl border border-indigo-100 relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setShowRatingModal(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100"
              aria-label="Cerrar modal"
            >
              <X size={18} />
            </button>

            {showThankYou ? (
              <div className="py-8 text-center space-y-3">
                <BrilloAvatar size="lg" expression="celebrating" name={mascotName} />
                <h3 className="text-base font-black text-[#26245C]">
                  ¡Gracias, {readerName}! ✨
                </h3>
                <p className="text-xs text-slate-600">
                  Esto ayuda a {mascotName} a afinar tus próximas lecturas recomendadas.
                </p>
              </div>
            ) : (
              <>
                <div className="text-center space-y-1.5 pt-1">
                  <BrilloAvatar size="md" expression="reading" name={mascotName} />
                  <h3 className="text-base font-black text-[#26245C]">
                    ¿Qué te pareció este libro?
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    {book.title}
                  </p>
                </div>

                {/* Stars selector (Accesible WCAG 2.1 AA) */}
                <div
                  role="radiogroup"
                  aria-label="Puntuación con estrellas para este libro"
                  className="flex items-center justify-center gap-2 py-2"
                >
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      role="radio"
                      aria-checked={selectedStars === star}
                      aria-label={`Valorar con ${star} de 5 estrellas`}
                      onClick={() => setSelectedStars(star)}
                      className="p-1.5 rounded-full hover:scale-125 focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all"
                    >
                      <Star
                        size={28}
                        className={
                          star <= selectedStars
                            ? "fill-amber-400 text-amber-400"
                            : "text-slate-200 hover:text-amber-200"
                        }
                      />
                    </button>
                  ))}
                </div>

                {/* Opinion chips */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold text-slate-500 block">
                    ¿Qué destacarías? (opcional)
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {OPINION_TAGS.map((tag) => {
                      const isSelected = selectedTags.includes(tag);
                      return (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => toggleOpinionTag(tag)}
                          className={`py-1 px-2.5 rounded-full text-xs font-bold transition-all border ${
                            isSelected
                              ? "bg-indigo-600 text-white border-indigo-600"
                              : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                          }`}
                        >
                          {tag}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleSaveRating}
                    className="w-full py-3 px-4 rounded-full bg-[#4F46E5] hover:bg-indigo-700 text-white font-bold text-xs shadow-magical transition-all"
                  >
                    Guardar valoración privada
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Library Locator Modal with CCAA Router & Counter Card */}
      <LibraryLocator
        isOpen={showLibraryModal}
        onClose={() => setShowLibraryModal(false)}
        book={book}
        mascotName={mascotName}
      />
    </div>
  );
}
