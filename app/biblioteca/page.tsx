"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getBooks, Book } from "@/lib/api";
import { useLibraryStore } from "@/store/useLibraryStore";
import BookCover from "@/components/BookCover";
import {
  Bookmark,
  BookOpen,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Library as LibraryIcon,
  Trash2,
} from "lucide-react";

export default function BibliotecaPage() {
  const [activeTab, setActiveTab] = useState<"want_to_read" | "reading" | "finished">("want_to_read");
  const [allBooks, setAllBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  const { library, loadLibrary, setBookStatus, removeBookStatus } = useLibraryStore();

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

  const currentList =
    activeTab === "want_to_read"
      ? wantToReadBooks
      : activeTab === "reading"
      ? readingBooks
      : finishedBooks;

  const tabLabels = [
    {
      id: "want_to_read" as const,
      label: "Quiero leer",
      count: wantToReadBooks.length,
      icon: Bookmark,
      activeClass: "bg-[#4F46E5] text-white shadow-magical",
    },
    {
      id: "reading" as const,
      label: "Estoy leyendo",
      count: readingBooks.length,
      icon: BookOpen,
      activeClass: "bg-[#4F46E5] text-white shadow-magical",
    },
    {
      id: "finished" as const,
      label: "Leído",
      count: finishedBooks.length,
      icon: CheckCircle2,
      activeClass: "bg-[#4F46E5] text-white shadow-magical",
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

        {/* 3 Tabs */}
        <div className="grid grid-cols-3 gap-2 mt-4 bg-white/80 p-1.5 rounded-2xl border border-indigo-100/80 shadow-sm">
          {tabLabels.map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-2 rounded-xl text-xs font-black flex flex-col items-center justify-center transition-all ${
                  isActive
                    ? tab.activeClass
                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center gap-1">
                  <Icon size={14} />
                  <span>{tab.label}</span>
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
      </div>

      {/* List content */}
      <div className="space-y-3">
        {currentList.length === 0 ? (
          <div className="alea-card p-8 text-center space-y-3 my-4">
            <div className="w-14 h-14 mx-auto bg-[#ECEEFC] text-[#474AB6] rounded-2xl flex items-center justify-center">
              <LibraryIcon size={28} />
            </div>
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
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {currentList.map((book) => (
              <div
                key={book.id}
                className="alea-card p-3.5 flex items-center justify-between gap-3.5 hover:border-indigo-300 transition-all"
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
                    <span className="text-[10px] font-bold text-[#4345B5] bg-[#ECEEFC] px-2 py-0.5 rounded-md inline-block mb-1">
                      {book.audienceAge} años
                    </span>
                    <h3 className="text-sm font-bold text-[#202154] truncate">
                      {book.title}
                    </h3>
                    <p className="text-xs text-slate-500 truncate mb-1">
                      {book.author}
                    </p>
                    <p className="text-[10px] text-slate-400 truncate">
                      ISBN: {book.isbn}
                    </p>
                  </div>
                </Link>

                <div className="flex flex-col gap-1 shrink-0">
                  <Link
                    href={`/book/${book.id}`}
                    className="p-2 rounded-xl text-indigo-600 hover:bg-indigo-50 transition-colors"
                    title="Ver ficha"
                  >
                    <ArrowRight size={18} />
                  </Link>

                  <button
                    type="button"
                    onClick={() => removeBookStatus(book.id)}
                    className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    title="Quitar de mi biblioteca"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
