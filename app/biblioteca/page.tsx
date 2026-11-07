"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getBooks, Book } from "@/lib/api";
import { useLibraryStore } from "@/store/useLibraryStore";
import BookCover from "@/components/BookCover";
import { sounds } from "@/lib/soundEffects";
import {
  Bookmark,
  BookOpen,
  CheckCircle2,
  Heart,
  Star,
  ArrowRight,
  Library as LibraryIcon,
  Trash2,
} from "lucide-react";

export default function BibliotecaPage() {
  const [activeTab, setActiveTab] = useState<"want_to_read" | "reading" | "finished" | "favorites">("want_to_read");
  const [allBooks, setAllBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [onlyLoansFilter, setOnlyLoansFilter] = useState(false);

  const {
    library,
    favorites,
    loans,
    loadLibrary,
    removeBookStatus,
    toggleFavorite,
    toggleLoan,
    isLoan,
    getRating,
  } = useLibraryStore();

  useEffect(() => {
    loadLibrary();
    const fetchBooks = async () => {
      const data = await getBooks();
      setAllBooks(data);
      setLoading(false);
    };
    fetchBooks();
  }, [loadLibrary]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-8 text-indigo-400">
        Abriendo tu biblioteca...
      </div>
    );
  }

  const getBooksForTab = (status: "want_to_read" | "reading" | "finished") => {
    const bookIds = Object.keys(library).filter((id) => library[id] === status);
    return allBooks.filter((book) => bookIds.includes(book.id));
  };

  const wantToReadBooks = getBooksForTab("want_to_read");
  const readingBooks = getBooksForTab("reading");
  const finishedBooks = getBooksForTab("finished");
  const favoriteBooks = allBooks.filter((book) => (favorites || []).includes(book.id));

  const currentListRaw =
    activeTab === "want_to_read"
      ? wantToReadBooks
      : activeTab === "reading"
      ? readingBooks
      : activeTab === "finished"
      ? finishedBooks
      : favoriteBooks;

  const currentList = onlyLoansFilter
    ? currentListRaw.filter((book) => (loans || []).includes(book.id))
    : currentListRaw;

  const currentTabLoansCount = currentListRaw.filter((book) => (loans || []).includes(book.id)).length;

  const tabLabels = [
    {
      id: "want_to_read" as const,
      label: "Quiero leer",
      count: wantToReadBooks.length,
      icon: Bookmark,
    },
    {
      id: "reading" as const,
      label: "Leyendo",
      count: readingBooks.length,
      icon: BookOpen,
    },
    {
      id: "finished" as const,
      label: "Leído",
      count: finishedBooks.length,
      icon: CheckCircle2,
    },
    {
      id: "favorites" as const,
      label: "Favoritos",
      count: favoriteBooks.length,
      icon: Heart,
    },
  ];

  return (
    <div className="flex-1 flex flex-col p-4 md:p-7 space-y-5">
      {/* Header */}
      <div>
        <span className="text-[11px] font-bold tracking-widest text-[#474AB6] uppercase">
          Tu Estantería Personal
        </span>
        <h1 className="text-2xl font-black text-[#26245C] tracking-tight">
          Mi Biblioteca
        </h1>
        <p className="text-xs text-slate-500 mt-0.5 font-medium">
          Tus libros físicos guardados sin prisas ni presiones
        </p>

        {/* 4 Tabs (HITO 4, Bug #4) */}
        <div className="grid grid-cols-4 gap-1.5 sm:gap-2 mt-4 bg-white/80 p-1.5 rounded-2xl border border-indigo-100/80 shadow-sm">
          {tabLabels.map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  sounds.playPop();
                  setActiveTab(tab.id);
                }}
                className={`py-2 px-1.5 rounded-xl text-xs font-black flex flex-col items-center justify-center transition-all ${
                  isActive
                    ? "bg-[#4F46E5] text-white shadow-magical"
                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center gap-1">
                  <Icon size={13} className={isActive && tab.id === "favorites" ? "fill-white" : ""} />
                  <span className="hidden sm:inline">{tab.label}</span>
                  <span className="sm:hidden">{tab.label.slice(0, 7)}</span>
                </div>
                <span
                  className={`text-[10px] mt-0.5 px-2 py-0.2 rounded-full font-bold ${
                    isActive ? "bg-white/20 text-white" : "bg-indigo-50 text-indigo-700"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Loan Filter Chips (HITO 5, Punto 35) */}
        {currentListRaw.length > 0 && (
          <div className="flex items-center gap-2 mt-3 text-xs">
            <span className="text-[11px] font-bold text-slate-400">Filtrar:</span>
            <button
              type="button"
              onClick={() => setOnlyLoansFilter(false)}
              className={`px-3 py-1 rounded-full font-bold transition-all ${
                !onlyLoansFilter
                  ? "bg-[#26245C] text-white shadow-sm"
                  : "bg-white text-slate-500 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              Todos ({currentListRaw.length})
            </button>
            <button
              type="button"
              onClick={() => setOnlyLoansFilter(true)}
              className={`px-3 py-1 rounded-full font-bold flex items-center gap-1.5 transition-all ${
                onlyLoansFilter
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "bg-white text-emerald-700 border border-emerald-200 hover:bg-emerald-50"
              }`}
            >
              <LibraryIcon size={12} />
              <span>En préstamo de biblioteca ({currentTabLoansCount})</span>
            </button>
          </div>
        )}
      </div>

      {/* List content */}
      <div className="space-y-3">
        {currentList.length === 0 ? (
          <div className="alea-card p-8 text-center space-y-3 my-4">
            <div className="w-14 h-14 mx-auto bg-[#ECEEFC] text-[#474AB6] rounded-2xl flex items-center justify-center">
              <LibraryIcon size={28} />
            </div>
            {onlyLoansFilter ? (
              <>
                <h3 className="text-sm font-black text-[#26245C]">
                  No tienes libros marcados en préstamo en &ldquo;{tabLabels.find((t) => t.id === activeTab)?.label}&rdquo;
                </h3>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  Puedes marcar cualquier libro con el icono de biblioteca cuando lo pidas prestado en tu biblioteca pública.
                </p>
                <button
                  type="button"
                  onClick={() => setOnlyLoansFilter(false)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200 transition-colors"
                >
                  Ver todos los libros de esta sección
                </button>
              </>
            ) : (
              <>
                <h3 className="text-sm font-black text-[#26245C]">
                  No tienes libros en &ldquo;{tabLabels.find((t) => t.id === activeTab)?.label}&rdquo;
                </h3>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  Descubre libros físicos recomendados y guárdalos para leer en papel o pedir en tu biblioteca.
                </p>
                <Link
                  href="/descubre"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#4F46E5] text-white text-xs font-bold shadow-magical hover:bg-indigo-700 transition-colors"
                >
                  <span>Explorar recomendaciones</span>
                  <ArrowRight size={14} />
                </Link>
              </>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {currentList.map((book) => {
              const rating = getRating(book.id);
              const isBorrowed = isLoan(book.id);

              return (
                <div
                  key={book.id}
                  className={`alea-card p-3.5 flex items-center justify-between gap-3.5 hover:border-indigo-300 transition-all ${
                    isBorrowed ? "border-emerald-200 bg-gradient-to-r from-emerald-50/30 to-white" : ""
                  }`}
                >
                  <Link
                    href={`/book/${book.id}`}
                    className="flex items-center gap-3.5 flex-1 min-w-0"
                  >
                    <BookCover
                      title={book.title}
                      author={book.author}
                      coverUrl={book.coverUrl}
                      color={book.color}
                      size="sm"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-1.5 mb-1">
                        <span className="text-[10px] font-bold text-[#4345B5] bg-[#ECEEFC] px-2 py-0.5 rounded-md inline-block">
                          {book.audienceAge} años
                        </span>
                        {isBorrowed && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-100/90 px-2 py-0.5 rounded-md border border-emerald-200">
                            <LibraryIcon size={10} />
                            <span>En préstamo</span>
                          </span>
                        )}
                        {rating && (
                          <div className="flex items-center text-amber-500 text-[10px] font-bold bg-amber-50 px-1.5 py-0.5 rounded-md border border-amber-200">
                            <Star size={10} className="fill-amber-400 mr-0.5" />
                            <span>{rating.stars}/5</span>
                          </div>
                        )}
                      </div>
                      <h3 className="text-sm font-bold text-[#202154] truncate">
                        {book.title}
                      </h3>
                      <p className="text-xs text-slate-500 truncate mb-0.5">
                        {book.author}
                      </p>
                      <p className="text-[10px] text-slate-400 truncate">
                        ISBN: {book.isbn}
                      </p>
                    </div>
                  </Link>

                  <div className="flex flex-col gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => toggleLoan(book.id)}
                      className={`p-2 rounded-xl transition-colors ${
                        isBorrowed
                          ? "text-emerald-700 bg-emerald-100/80 hover:bg-emerald-200"
                          : "text-slate-400 hover:text-emerald-600 hover:bg-emerald-50"
                      }`}
                      title={isBorrowed ? "Marcar como devuelto a la biblioteca" : "Marcar como préstamo de biblioteca pública"}
                      aria-label={isBorrowed ? "Marcar como devuelto" : "Marcar como préstamo"}
                    >
                      <LibraryIcon size={16} />
                    </button>

                    <Link
                      href={`/book/${book.id}`}
                      className="p-2 rounded-xl text-indigo-600 hover:bg-indigo-50 transition-colors"
                      title="Ver ficha"
                    >
                      <ArrowRight size={18} />
                    </Link>

                    {activeTab === "favorites" ? (
                      <button
                        type="button"
                        onClick={() => toggleFavorite(book.id)}
                        className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 transition-colors"
                        title="Quitar de favoritos"
                      >
                        <Heart size={16} className="fill-rose-500" />
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => removeBookStatus(book.id)}
                        className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Quitar de mi biblioteca"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
