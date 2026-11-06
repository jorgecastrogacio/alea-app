"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getBooks, Book } from "@/lib/api";
import { getRecommendedBooks, ScoredBook } from "@/lib/recommendation";
import { UserProfile } from "@/store/useOnboardingStore";
import { useLibraryStore } from "@/store/useLibraryStore";
import BookCover from "@/components/BookCover";
import {
  Sparkles,
  ArrowRight,
  Search,
  Bell,
  PenLine,
  Plus,
  X,
  Bookmark,
  Check,
  MapPin,
  BookOpen,
  Library,
  ExternalLink,
} from "lucide-react";

export default function DescubrePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [books, setBooks] = useState<Book[]>([]);
  const [recommendations, setRecommendations] = useState<ScoredBook[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedWorldFilters, setSelectedWorldFilters] = useState<string[]>([
    "Aventuras y fantasía",
    "Naturaleza y animales",
    "Planetas y galaxias",
  ]);
  const [showLibraryModal, setShowLibraryModal] = useState(false);
  const [modalBook, setModalBook] = useState<Book | null>(null);

  const { library, loadLibrary, setBookStatus, getBookStatus } = useLibraryStore();

  useEffect(() => {
    loadLibrary();
    const initData = async () => {
      const allBooks = await getBooks();
      setBooks(allBooks);

      let loadedProfile: UserProfile | null = null;
      try {
        const saved = localStorage.getItem("alea_user_profile");
        if (saved) {
          loadedProfile = JSON.parse(saved);
          setProfile(loadedProfile);
        }
      } catch (e) {
        console.error("Error reading profile:", e);
      }

      const recs = getRecommendedBooks(allBooks, loadedProfile);
      setRecommendations(recs);
      setLoading(false);
    };

    initData();
  }, [loadLibrary]);

  const removeWorld = (worldName: string) => {
    setSelectedWorldFilters((prev) => prev.filter((w) => w !== worldName));
  };

  const handleOpenLibrary = (bookToSearch?: Book) => {
    setModalBook(bookToSearch || books[0] || null);
    setShowLibraryModal(true);
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 space-y-3 text-slate-400">
        <Sparkles className="animate-spin text-indigo-500" size={32} />
        <p className="text-xs font-semibold text-[#30337E]">Abriendo el universo de ALEA...</p>
      </div>
    );
  }

  const readerName = profile?.nickname || "Daniela";

  const worldCards = [
    {
      id: "Aventuras y fantasía",
      title: "Aventuras y fantasía",
      image: "/assets/worlds/aventuras_fantasia.jpg",
    },
    {
      id: "Naturaleza y animales",
      title: "Naturaleza y animales",
      image: "/assets/worlds/naturaleza_animales.jpg",
    },
    {
      id: "Planetas y galaxias",
      title: "Planetas y galaxias",
      image: "/assets/worlds/planetas_galaxias.jpg",
    },
  ];

  return (
    <div className="flex-1 flex flex-col p-4 md:p-7 space-y-6">
      {/* TOP HERO BANNER: Enchanted Library with Mascot (Matches mockup media_1793997219619.jpg) */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#DFE6FD] via-[#ECEEFF] to-[#F7EEFA] border border-indigo-100/80 shadow-soft-purple p-5 md:p-7">
        {/* Subtle magical library background overlay */}
        <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#4338ca_1px,transparent_1px)] [background-size:16px_16px]" />

        {/* Top Right Action Icons (Search & Bell) */}
        <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
          <Link
            href="/explora"
            className="w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm border border-indigo-100/70 shadow-sm flex items-center justify-center text-slate-600 hover:text-indigo-600 hover:scale-105 transition-all"
            aria-label="Buscar libros"
          >
            <Search size={16} />
          </Link>
          <Link
            href="/universo"
            className="w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm border border-indigo-100/70 shadow-sm flex items-center justify-center text-slate-600 hover:text-indigo-600 hover:scale-105 transition-all"
            aria-label="Notificaciones y perfil"
          >
            <Bell size={16} />
          </Link>
        </div>

        {/* Banner Content with Mascot */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 relative z-0">
          <div className="flex items-center gap-4 sm:gap-6">
            {/* Mascot Character with light burst */}
            <div className="relative shrink-0">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden shadow-magical ring-4 ring-white/80 bg-white/40">
                <img
                  src="/assets/mascot/banner_mascot.jpg"
                  alt="Mascota ALEA"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -top-1 -right-1 text-amber-400 animate-pulse text-xs">
                ✨
              </div>
            </div>

            {/* Greeting Typography */}
            <div className="text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl font-black text-[#26245C] tracking-tight">
                ¡Hola, {readerName}!
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-sm font-medium leading-relaxed">
                Tu <strong className="text-[#4345B5] font-bold">universo</strong> lector ya está listo.
                <br />
                ¿Qué quieres hacer hoy?
              </p>
            </div>
          </div>

          {/* Floating Glowing Book on Right */}
          <div className="hidden lg:flex items-center justify-center shrink-0 pr-4">
            <div className="w-28 h-24 rounded-2xl overflow-hidden shadow-magical border border-white/60 bg-white/30">
              <img
                src="/assets/glowing_book.jpg"
                alt="Libro Mágico ALEA"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 1: TUS MUNDOS (Mockup Section) */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-indigo-500 font-bold">✦</span>
            <h2 className="text-base font-black text-[#26245C] tracking-tight">
              Tus mundos
            </h2>
          </div>

          <Link
            href="/onboarding"
            className="flex items-center gap-1.5 text-xs font-bold text-[#474AB6] hover:text-indigo-800 bg-[#ECEEFC] hover:bg-[#DEE1FA] px-3 py-1.5 rounded-full transition-colors"
          >
            <PenLine size={13} />
            <span>Editar intereses</span>
          </Link>
        </div>

        {/* Worlds Cards Grid / Carousel */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {worldCards
            .filter((c) => selectedWorldFilters.includes(c.id))
            .map((world) => (
              <div
                key={world.id}
                className="alea-card p-2 flex flex-col justify-between overflow-hidden relative group hover:border-indigo-300 transition-all hover:shadow-magical"
              >
                {/* World Image with 'x' close button */}
                <div className="relative h-28 sm:h-32 w-full rounded-2xl overflow-hidden bg-slate-100">
                  <img
                    src={world.image}
                    alt={world.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <button
                    type="button"
                    onClick={() => removeWorld(world.id)}
                    className="absolute top-2 right-2 w-6 h-6 rounded-full bg-white/90 backdrop-blur-sm text-slate-500 hover:text-rose-600 hover:bg-white flex items-center justify-center shadow-sm transition-all"
                    title={`Quitar ${world.title}`}
                  >
                    <X size={12} strokeWidth={2.5} />
                  </button>
                </div>

                <div className="pt-2 pb-1 px-1 text-center">
                  <span className="text-xs font-bold text-[#2A2B68] block truncate">
                    {world.title}
                  </span>
                </div>
              </div>
            ))}

          {/* Add Interests Card */}
          <Link
            href="/onboarding"
            className="alea-card p-4 flex flex-col items-center justify-center text-center bg-[#F3F4FE]/80 hover:bg-[#E9EAFD] border-dashed border-2 border-indigo-200/90 transition-all group min-h-[140px]"
          >
            <div className="w-10 h-10 rounded-full bg-white text-indigo-600 flex items-center justify-center shadow-sm mb-2 group-hover:scale-110 transition-transform">
              <Plus size={20} strokeWidth={2.5} />
            </div>
            <span className="text-xs font-bold text-[#30337E]">
              Añadir intereses
            </span>
          </Link>
        </div>
      </section>

      {/* SECTION 2: RECOMENDADO PARA TI (Cards with Covers, Synopsis & "Añadir" button) */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-indigo-500 font-bold">✦</span>
            <h2 className="text-base font-black text-[#26245C] tracking-tight">
              Recomendado para ti
            </h2>
          </div>

          <Link
            href="/explora"
            className="text-xs font-bold text-[#474AB6] hover:text-indigo-800 flex items-center gap-1"
          >
            <span>Ver más</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* Horizontal Scrollable Row / Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {recommendations.slice(0, 3).map(({ book, reason }) => {
            const status = getBookStatus(book.id);
            const isAdded = !!status;

            return (
              <div
                key={book.id}
                className="alea-card p-4 flex flex-col justify-between hover:border-indigo-300 hover:shadow-magical transition-all"
              >
                <div className="flex gap-3.5 items-start">
                  <Link href={`/book/${book.id}`} className="shrink-0 hover:scale-105 transition-transform">
                    <BookCover
                      title={book.title}
                      author={book.author}
                      coverUrl={book.coverUrl}
                      color={book.color}
                      size="sm"
                    />
                  </Link>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold text-[#202154] leading-snug truncate">
                      <Link href={`/book/${book.id}`} className="hover:text-indigo-600">
                        {book.title}
                      </Link>
                    </h3>
                    <p className="text-[11px] font-medium text-slate-500 truncate mb-1.5">
                      {book.author}
                    </p>
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {book.synopsis}
                    </p>
                  </div>
                </div>

                {/* Motivo explícito de recomendación (Hito 4) */}
                <div className="mt-3 p-2 rounded-xl bg-[#F0F2FD] border border-indigo-100/60 text-[10px] text-[#343788] leading-tight">
                  <span className="font-bold">Motivo: </span>
                  {reason}
                </div>

                {/* Bottom Action: "Añadir" Bookmark Button & Detail Link */}
                <div className="mt-3 pt-2.5 border-t border-indigo-50 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setBookStatus(book.id, "want_to_read")}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      isAdded
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : "bg-white text-slate-700 border border-indigo-100 hover:bg-indigo-50/60"
                    }`}
                  >
                    {isAdded ? (
                      <>
                        <Check size={14} className="text-emerald-600" />
                        <span>En biblioteca</span>
                      </>
                    ) : (
                      <>
                        <Bookmark size={14} className="text-slate-400" />
                        <span>Añadir</span>
                      </>
                    )}
                  </button>

                  <Link
                    href={`/book/${book.id}`}
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-800"
                  >
                    Ficha & ISBN →
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* FLOATING / ANCHORED PILL BANNER: "Encuentra tu libro cerca de ti" (Exact from mockup) */}
      <div className="pt-2">
        <button
          type="button"
          onClick={() => handleOpenLibrary()}
          className="w-full max-w-lg mx-auto py-3 px-5 rounded-full bg-white/95 backdrop-blur-md border border-indigo-100 shadow-soft-purple hover:shadow-magical transition-all flex items-center justify-between text-xs text-[#2A2B68] font-bold group"
        >
          <div className="flex items-center gap-2">
            <BookOpen size={16} className="text-indigo-600" />
            <span>Encuentra tu libro cerca de ti</span>
          </div>

          <div className="flex items-center gap-1.5 text-indigo-600 group-hover:translate-x-0.5 transition-transform">
            <MapPin size={14} className="text-indigo-500" />
            <span className="underline decoration-indigo-300">Bibliotecas y librerías</span>
            <ArrowRight size={14} />
          </div>
        </button>
      </div>

      {/* PUBLIC LIBRARY MODAL (Coste Cero) */}
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
                Bibliotecas Públicas de España
              </h3>
              <p className="text-xs text-slate-500">
                Préstamo 100% gratuito de libros físicos en tu biblioteca municipal o escolar.
              </p>
            </div>

            {modalBook && (
              <div className="p-3 bg-[#F4F5FD] rounded-2xl border border-indigo-100/70 text-xs text-slate-700 space-y-1">
                <div className="font-bold text-[#2A2B68]">{modalBook.title}</div>
                <div className="text-[11px] text-slate-500 font-mono">ISBN: {modalBook.isbn}</div>
              </div>
            )}

            <div className="space-y-2 pt-2">
              <a
                href={
                  modalBook
                    ? `https://rebiun.baratz.es/rebiun/search?q=${modalBook.isbn}`
                    : "https://rebiun.baratz.es/rebiun/"
                }
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 rounded-xl bg-[#4F46E5] hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-sm"
              >
                <span>Consultar catálogo oficial Rebiun / eBiblio</span>
                <ExternalLink size={14} />
              </a>

              <button
                type="button"
                onClick={() => setShowLibraryModal(false)}
                className="w-full py-2.5 px-4 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold text-xs transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
