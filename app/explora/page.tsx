"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getBooks, Book } from "@/lib/api";
import BookCover from "@/components/BookCover";
import {
  Search,
  ArrowRight,
  X,
  BookOpen,
} from "lucide-react";
import { sounds } from "@/lib/soundEffects";

export default function ExploraPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAge, setSelectedAge] = useState<string>("todos");
  const [selectedTag, setSelectedTag] = useState<string>("todos");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      const data = await getBooks();
      setBooks(data);
      setLoading(false);
    };
    fetchBooks();
  }, []);

  const allTags = Array.from(
    new Set(books.flatMap((b) => b.tags))
  ).slice(0, 10);

  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    let matchesAge = true;
    if (selectedAge !== "todos") {
      const [minStr, maxStr] = selectedAge.split("-");
      const filterMin = parseInt(minStr, 10);
      const filterMax = parseInt(maxStr, 10);

      const [bookMin, bookMax] = book.audienceAge
        .split("-")
        .map((p) => parseInt(p, 10));

      matchesAge = !(bookMax < filterMin || bookMin > filterMax);
    }

    let matchesTag = true;
    if (selectedTag !== "todos") {
      matchesTag = book.tags.includes(selectedTag);
    }

    return matchesSearch && matchesAge && matchesTag;
  });

  return (
    <div className="flex-1 flex flex-col p-4 md:p-7 space-y-5">
      {/* Header & Search */}
      <div className="space-y-3">
        <div>
          <span className="text-[11px] font-bold tracking-widest text-[#474AB6] uppercase">
            Catálogo Completo
          </span>
          <h1 className="text-2xl font-black text-[#26245C] tracking-tight">
            Explora Historias Físicas
          </h1>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            placeholder="Buscar por título, autor o temática..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-10 py-3 bg-white border border-indigo-100/90 rounded-2xl text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 shadow-sm"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X size={15} />
            </button>
          )}
        </div>

        {/* Age Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          <span className="text-xs font-bold text-slate-400 shrink-0 mr-1">
            Edad:
          </span>
          {[
            { id: "todos", label: "Todas" },
            { id: "7-9", label: "7-9 años" },
            { id: "10-12", label: "10-12 años" },
            { id: "13-16", label: "13-16 años" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => {
                sounds.playPop();
                setSelectedAge(item.id);
              }}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                selectedAge === item.id
                  ? "bg-[#4F46E5] text-white shadow-sm"
                  : "bg-white text-slate-600 border border-indigo-100 hover:bg-indigo-50/50"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Tag Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          <span className="text-xs font-bold text-slate-400 shrink-0 mr-1">
            Tema:
          </span>
          <button
            onClick={() => {
              sounds.playPop();
              setSelectedTag("todos");
            }}
            className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ${
              selectedTag === "todos"
                ? "bg-[#26245C] text-white"
                : "bg-white text-slate-600 border border-indigo-100 hover:bg-slate-50"
            }`}
          >
            Todos
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => {
                sounds.playPop();
                setSelectedTag(tag);
              }}
              className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ${
                selectedTag === tag
                  ? "bg-[#4F46E5] text-white"
                  : "bg-white text-slate-600 border border-indigo-100 hover:bg-slate-50"
              }`}
            >
              #{tag}
            </button>
          ))}
        </div>
      </div>

      {/* Book Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
          <span>{filteredBooks.length} libros encontrados</span>
          {(selectedAge !== "todos" || selectedTag !== "todos" || searchQuery) && (
            <button
              onClick={() => {
                setSelectedAge("todos");
                setSelectedTag("todos");
                setSearchQuery("");
              }}
              className="text-indigo-600 font-bold hover:underline"
            >
              Limpiar filtros
            </button>
          )}
        </div>

        {loading ? (
          <div className="text-center py-10 text-indigo-400 text-xs">
            Cargando catálogo...
          </div>
        ) : filteredBooks.length === 0 ? (
          <div className="alea-card p-8 text-center space-y-2">
            <BookOpen size={32} className="mx-auto text-slate-300" />
            <h3 className="text-sm font-bold text-slate-800">
              No hay libros con esos filtros
            </h3>
            <p className="text-xs text-slate-500">
              Prueba a cambiar la edad o el término de búsqueda.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filteredBooks.map((book) => (
              <Link
                key={book.id}
                href={`/book/${book.id}`}
                className="alea-card p-3.5 flex items-center gap-3.5 hover:border-indigo-300 transition-all hover:shadow-magical"
              >
                <BookCover
                  title={book.title}
                  author={book.author}
                  coverUrl={book.coverUrl}
                  color={book.color}
                  size="sm"
                />
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-bold text-[#4345B5] bg-[#ECEEFC] px-2 py-0.5 rounded-md inline-block mb-1">
                    {book.audienceAge} años
                  </span>
                  <h3 className="text-sm font-bold text-[#202154] truncate">
                    {book.title}
                  </h3>
                  <p className="text-xs text-slate-500 truncate mb-1.5">
                    {book.author}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {book.tags.slice(0, 2).map((t) => (
                      <span
                        key={t}
                        className="text-[10px] text-slate-500 bg-[#F4F5FD] px-1.5 py-0.5 rounded font-medium"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>
                <ArrowRight size={16} className="text-slate-400 shrink-0" />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
