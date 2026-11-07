"use client";

import React, { useState, useEffect } from "react";
import {
  SPANISH_LIBRARY_NETWORKS,
  DEFAULT_REGION_KEY,
  getLibraryCatalogUrl,
  getAllSupportedRegions,
} from "@/lib/libraryCatalogRouter";
import { Book } from "@/types/book";
import BookCover from "@/components/BookCover";
import {
  X,
  Library,
  ExternalLink,
  Copy,
  Check,
  MapPin,
  Printer,
  Barcode,
  BookOpen,
} from "lucide-react";

interface LibraryLocatorProps {
  isOpen: boolean;
  onClose: () => void;
  book: Book;
  mascotName?: string;
}

const STORAGE_REGION_KEY = "alea_user_region";

export function LibraryLocator({
  isOpen,
  onClose,
  book,
  mascotName = "Chispa",
}: LibraryLocatorProps) {
  const [selectedRegion, setSelectedRegion] = useState<string>(DEFAULT_REGION_KEY);
  const [copied, setCopied] = useState(false);
  const [showCounterCard, setShowCounterCard] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem(STORAGE_REGION_KEY);
        if (saved && SPANISH_LIBRARY_NETWORKS[saved]) {
          setSelectedRegion(saved);
        }
      } catch (e) {
        console.error("Error reading region from localStorage:", e);
      }
    }
  }, []);

  if (!isOpen) return null;

  const handleRegionChange = (newRegion: string) => {
    setSelectedRegion(newRegion);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(STORAGE_REGION_KEY, newRegion);
      } catch (e) {
        console.error("Error saving region to localStorage:", e);
      }
    }
  };

  const handleCopyIsbn = () => {
    if (typeof navigator !== "undefined") {
      navigator.clipboard.writeText(book.isbn);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    }
  };

  const catalogUrl = getLibraryCatalogUrl(selectedRegion, book.isbn, book.title);
  const activeNetwork = SPANISH_LIBRARY_NETWORKS[selectedRegion] || SPANISH_LIBRARY_NETWORKS[DEFAULT_REGION_KEY];
  const allRegions = getAllSupportedRegions();

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-md rounded-3xl p-5 sm:p-6 space-y-4 shadow-2xl border border-indigo-100 relative animate-in fade-in zoom-in-95 duration-200 max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors"
          aria-label="Cerrar localizador"
        >
          <X size={18} />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 pt-1">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 shadow-sm border border-indigo-100">
            <Library size={24} />
          </div>
          <div className="pr-6">
            <h3 className="text-base font-black text-[#26245C] leading-snug">
              Encuentra este libro físico
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Préstamo 100% gratuito en tu red de bibliotecas públicas
            </p>
          </div>
        </div>

        {/* Selector de Red Autonómica (Zero GPS Tracking) */}
        <div className="p-3.5 bg-[#F8F9FE] rounded-2xl border border-indigo-100/80 space-y-2">
          <label
            htmlFor="regionSelect"
            className="text-[11px] font-bold text-[#30337E] uppercase tracking-wider flex items-center gap-1.5"
          >
            <MapPin size={13} className="text-indigo-600" />
            <span>Tu Comunidad / Red de Bibliotecas:</span>
          </label>
          <select
            id="regionSelect"
            value={selectedRegion}
            onChange={(e) => handleRegionChange(e.target.value)}
            className="w-full px-3 py-2.5 bg-white border border-indigo-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 shadow-sm"
          >
            {allRegions.map((reg) => (
              <option key={reg.id} value={reg.id}>
                {reg.name}
              </option>
            ))}
          </select>
          <p className="text-[10px] text-slate-500 leading-tight">
            Se guarda en este dispositivo sin rastreo ni geolocalización invasiva.
          </p>
        </div>

        {/* Deep Link Oficial al Catálogo OPAC */}
        <div className="space-y-2 pt-1">
          <a
            href={catalogUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#4F46E5] to-[#6366F1] hover:from-[#4338CA] hover:to-[#4F46E5] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-magical transition-all active:scale-[0.98]"
          >
            <BookOpen size={16} />
            <span>Buscar en {activeNetwork.name}</span>
            <ExternalLink size={14} className="opacity-80" />
          </a>

          <p className="text-[11px] text-center text-slate-500 font-medium">
            Abre la búsqueda oficial por ISBN en {activeNetwork.networkName}
          </p>
        </div>

        {/* Bloque ISBN y Copia Rápida */}
        <div className="p-3 bg-[#F4F5FD] rounded-2xl border border-indigo-100 flex items-center justify-between gap-2">
          <div className="min-w-0">
            <span className="text-[10px] font-bold text-slate-400 block uppercase">
              ISBN-13 Oficial España
            </span>
            <span className="font-mono font-bold text-slate-800 text-sm tracking-wider">
              {book.isbn}
            </span>
          </div>

          <button
            type="button"
            onClick={handleCopyIsbn}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm ${
              copied
                ? "bg-emerald-600 text-white"
                : "bg-white text-indigo-700 border border-indigo-200 hover:bg-indigo-50"
            }`}
          >
            {copied ? (
              <>
                <Check size={14} />
                <span>¡Copiado!</span>
              </>
            ) : (
              <>
                <Copy size={14} />
                <span>Copiar ISBN</span>
              </>
            )}
          </button>
        </div>

        {/* Ficha "Para pedir en el mostrador" */}
        <div className="pt-1">
          <button
            type="button"
            onClick={() => setShowCounterCard(!showCounterCard)}
            className="w-full py-2.5 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center justify-center gap-2 transition-colors"
          >
            <Barcode size={16} className="text-indigo-600" />
            <span>
              {showCounterCard ? "Ocultar tarjeta de mostrador" : "Mostrar tarjeta para pedir en mostrador"}
            </span>
          </button>

          {showCounterCard && (
            <div className="mt-3 p-4 bg-gradient-to-b from-white to-slate-50 border-2 border-dashed border-indigo-200 rounded-2xl space-y-3 animate-in fade-in duration-200">
              <div className="flex gap-3 items-center">
                <BookCover
                  title={book.title}
                  author={book.author}
                  coverUrl={book.coverUrl}
                  color={book.color}
                  size="sm"
                />
                <div className="min-w-0 flex-1">
                  <span className="text-[9px] font-bold text-indigo-600 uppercase tracking-widest block">
                    Ficha de Préstamo Infantil
                  </span>
                  <h4 className="text-sm font-black text-[#26245C] leading-snug line-clamp-2">
                    {book.title}
                  </h4>
                  <p className="text-xs text-slate-600 font-semibold truncate">
                    {book.author}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {book.editorial} · {book.pages} páginas
                  </p>
                </div>
              </div>

              {/* Simulación visual limpia de código de barras para el mostrador */}
              <div className="p-2.5 bg-white rounded-xl border border-slate-200 text-center space-y-1">
                <div className="h-9 w-full flex items-center justify-center gap-0.5 opacity-80 overflow-hidden">
                  {book.isbn.split("").map((digit, i) => (
                    <div
                      key={i}
                      className="h-full bg-slate-900"
                      style={{
                        width: (parseInt(digit, 10) % 3) + 1.5,
                        marginRight: (parseInt(digit, 10) % 2) + 0.8,
                      }}
                    />
                  ))}
                </div>
                <div className="font-mono text-xs font-bold text-slate-800 tracking-widest">
                  {book.isbn}
                </div>
              </div>

              <p className="text-[10px] text-slate-500 text-center leading-relaxed">
                Muestra esta pantalla al personal bibliotecario para localizar el ejemplar en papel de inmediato.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
