"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { getBooks, Book } from "@/lib/api";
import { getRecommendedBooks, ScoredBook } from "@/lib/recommendation";
import { UserProfile, useOnboardingStore } from "@/store/useOnboardingStore";
import { useLibraryStore } from "@/store/useLibraryStore";
import BookCover from "@/components/BookCover";
import { BrilloAvatar } from "@/components/BrilloAvatar";
import { EditPreferencesModal } from "@/components/EditPreferencesModal";
import { LibraryLocator } from "@/components/LibraryLocator";
import { sounds } from "@/lib/soundEffects";
import { triggerMagicConfetti } from "@/lib/confetti";
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

const OFFICIAL_WORLDS_DICT: Record<string, { icon: string; image: string }> = {
  "Bosques encantados": { icon: "🌲", image: "/assets/worlds/naturaleza_animales.jpg" },
  "Castillos y secretos": { icon: "🏰", image: "/assets/worlds/aventuras_fantasia.jpg" },
  "Mundos submarinos": { icon: "🌊", image: "/assets/worlds/naturaleza_animales.jpg" },
  "Planetas y galaxias": { icon: "🚀", image: "/assets/worlds/planetas_galaxias.jpg" },
  "Islas y aventuras": { icon: "🏝️", image: "/assets/worlds/aventuras_fantasia.jpg" },
  "Lugares como el nuestro": { icon: "🏙️", image: "/assets/worlds/naturaleza_animales.jpg" },
  // Backwards compat
  "Aventuras y fantasía": { icon: "🏰", image: "/assets/worlds/aventuras_fantasia.jpg" },
  "Naturaleza y animales": { icon: "🌲", image: "/assets/worlds/naturaleza_animales.jpg" },
};

export default function DescubrePage() {
  const store = useOnboardingStore();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [books, setBooks] = useState<Book[]>([]);
  const [recommendations, setRecommendations] = useState<ScoredBook[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPreferencesModal, setShowPreferencesModal] = useState(false);
  const [showLibraryModal, setShowLibraryModal] = useState(false);
  const [modalBook, setModalBook] = useState<Book | null>(null);

  const { loadLibrary, setBookStatus, getBookStatus } = useLibraryStore();

  const loadData = useCallback(async () => {
    const allBooks = await getBooks();
    setBooks(allBooks);

    let loadedProfile: UserProfile | null = null;
    try {
      const saved = localStorage.getItem("alea_user_profile");
      if (saved) {
        loadedProfile = JSON.parse(saved);
        setProfile(loadedProfile);
      } else {
        loadedProfile = {
          nickname: store.nickname,
          mascotName: store.mascotName,
          age: store.age,
          worlds: store.worlds,
          interests: store.interests,
          protagonists: store.protagonists,
          rhythm: store.rhythm,
          formats: store.formats,
          readingHabit: store.readingHabit,
        };
        setProfile(loadedProfile);
      }
    } catch (e) {
      console.error("Error reading profile:", e);
    }

    const recs = getRecommendedBooks(allBooks, loadedProfile);
    setRecommendations(recs);
    setLoading(false);
  }, [store]);

  useEffect(() => {
    loadLibrary();
    loadData();
  }, [loadLibrary, loadData]);

  const removeWorld = (worldName: string) => {
    const currentWorlds = profile?.worlds || store.worlds;
    const updated = currentWorlds.filter((w) => w !== worldName);
    store.updatePreferences({
      worlds: updated.length > 0 ? updated : ["Bosques encantados"],
    });
    loadData();
  };

  const handleAddBook = (bookId: string, e: React.MouseEvent) => {
    sounds.playPop();
    triggerMagicConfetti(e.clientX, e.clientY);
    setBookStatus(bookId, "want_to_read");
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

  const readerName = profile?.nickname || store.nickname || "Daniela";
  const mascotName = profile?.mascotName || store.mascotName || "Brillo";
  const activeWorlds = (profile?.worlds && profile.worlds.length > 0)
    ? profile.worlds
    : (store.worlds.length > 0 ? store.worlds : ["Bosques encantados", "Castillos y secretos"]);

  return (
    <div className="flex-1 flex flex-col p-4 md:p-7 space-y-6">
      {/* TOP HERO BANNER: Enchanted Library with clean Mascot (HITO 2, Bug #3, #11) */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#DFE6FD] via-[#ECEEFF] to-[#F7EEFA] border border-indigo-100/80 shadow-soft-purple p-5 md:p-7">
        <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#4338ca_1px,transparent_1px)] [background-size:16px_16px]" />

        {/* Top Right Action Icons */}
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

        {/* Banner Content with Interactive Living Mascot */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 relative z-0">
          <div className="flex items-center gap-4 sm:gap-6">
            <BrilloAvatar
              size="lg"
              expression="happy"
              name={mascotName}
              speechText="¡Tócame para hablar conmigo o busca tu libro favorito!"
            />

            {/* Greeting Typography with real names */}
            <div className="text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl font-black text-[#26245C] tracking-tight">
                ¡Hola, {readerName}!
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-sm font-medium leading-relaxed">
                Soy <strong className="text-indigo-600 font-bold">{mascotName}</strong>. Tu universo lector ya está listo.
                <br />
                ¿Qué historia te apetece explorar hoy?
              </p>
            </div>
          </div>

          {recommendations[0] && (
            <div className="hidden lg:flex flex-col items-center justify-center shrink-0 pr-4">
              <Link href={`/book/${recommendations[0].book.id}`} className="group flex flex-col items-center">
                <BookCover
                  title={recommendations[0].book.title}
                  author={recommendations[0].book.author}
                  coverUrl={recommendations[0].book.coverUrl}
                  color={recommendations[0].book.color}
                  size="sm"
                />
                <span className="text-[10px] font-bold text-indigo-700 bg-white/95 px-2.5 py-0.5 rounded-full shadow-sm mt-1.5 block text-center border border-indigo-100 group-hover:scale-105 transition-transform">
                  ✦ Recomendado ✦
                </span>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* SECTION 1: TUS MUNDOS REALES (HITO 1 & 2, Bug #2, #9, #10) */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-indigo-500 font-bold">✦</span>
            <h2 className="text-base font-black text-[#26245C] tracking-tight">
              Tus mundos
            </h2>
          </div>

          <button
            type="button"
            onClick={() => setShowPreferencesModal(true)}
            className="flex items-center gap-1.5 text-xs font-bold text-[#474AB6] hover:text-indigo-800 bg-[#ECEEFC] hover:bg-[#DEE1FA] px-3 py-1.5 rounded-full transition-colors"
          >
            <PenLine size={13} />
            <span>Editar intereses</span>
          </button>
        </div>

        {/* Worlds Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {activeWorlds.map((worldTitle) => {
            const worldMeta = OFFICIAL_WORLDS_DICT[worldTitle] || {
              icon: "✨",
              image: "/assets/worlds/aventuras_fantasia.jpg",
            };

            return (
              <div
                key={worldTitle}
                className="alea-card p-2 flex flex-col justify-between overflow-hidden relative group hover:border-indigo-300 transition-all hover:shadow-magical"
              >
                <div className="relative h-28 sm:h-32 w-full rounded-2xl overflow-hidden bg-slate-100">
                  <img
                    src={worldMeta.image}
                    alt={worldTitle}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-2">
                    <span className="text-xl">{worldMeta.icon}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeWorld(worldTitle)}
                    className="absolute top-2 right-2 w-6 h-6 rounded-full bg-white/90 backdrop-blur-sm text-slate-500 hover:text-rose-600 hover:bg-white flex items-center justify-center shadow-sm transition-all"
                    title={`Quitar ${worldTitle}`}
                  >
                    <X size={12} strokeWidth={2.5} />
                  </button>
                </div>

                <div className="pt-2 pb-1 px-1 text-center">
                  <span className="text-xs font-bold text-[#2A2B68] block truncate">
                    {worldTitle}
                  </span>
                </div>
              </div>
            );
          })}

          {/* Add Interests Card */}
          <button
            type="button"
            onClick={() => setShowPreferencesModal(true)}
            className="alea-card p-4 flex flex-col items-center justify-center text-center bg-[#F3F4FE]/80 hover:bg-[#E9EAFD] border-dashed border-2 border-indigo-200/90 transition-all group min-h-[140px]"
          >
            <div className="w-10 h-10 rounded-full bg-white text-indigo-600 flex items-center justify-center shadow-sm mb-2 group-hover:scale-110 transition-transform">
              <Plus size={20} strokeWidth={2.5} />
            </div>
            <span className="text-xs font-bold text-[#30337E]">
              Añadir mundos
            </span>
          </button>
        </div>
      </section>

      {/* SECTION 2: RECOMENDADO PARA TI (Cards with Bug #13 fix for tablet truncation) */}
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

        {/* Responsive Grid with fixed min-width to avoid ugly truncation on tablet (Bug #13) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recommendations.slice(0, 3).map(({ book, reason }) => {
            const status = getBookStatus(book.id);
            const isAdded = !!status;

            return (
              <div
                key={book.id}
                className="alea-card p-4 flex flex-col justify-between hover:border-indigo-300 hover:shadow-magical transition-all min-w-[260px] whitespace-normal"
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
                    <h3 className="text-sm font-bold text-[#202154] leading-snug line-clamp-2">
                      <Link href={`/book/${book.id}`} className="hover:text-indigo-600">
                        {book.title}
                      </Link>
                    </h3>
                    <p className="text-[11px] font-medium text-slate-500 truncate mb-1">
                      {book.author}
                    </p>
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {book.synopsis}
                    </p>
                  </div>
                </div>

                {/* Motivo explícito de recomendación (HITO 3, Bug #7) */}
                <div className="mt-3 p-2 rounded-xl bg-[#F0F2FD] border border-indigo-100/60 text-[10px] text-[#343788] leading-tight">
                  <span className="font-bold">Motivo: </span>
                  {reason}
                </div>

                {/* Bottom Action: "Añadir" Bookmark Button & Detail Link */}
                <div className="mt-3 pt-2.5 border-t border-indigo-50 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={(e) => handleAddBook(book.id, e)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all active:scale-95 ${
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

      {/* FLOATING PILL BANNER: "Encuentra tu libro cerca de ti" */}
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

      {/* EDIT PREFERENCES MODAL (HITO 1 & 2, Bug #10) */}
      <EditPreferencesModal
        isOpen={showPreferencesModal}
        onClose={() => setShowPreferencesModal(false)}
        onSaved={loadData}
      />

      {/* LIBRARY LOCATOR MODAL (Sprint 0 Router & Counter Card) */}
      {modalBook && (
        <LibraryLocator
          isOpen={showLibraryModal}
          onClose={() => setShowLibraryModal(false)}
          book={modalBook}
          mascotName={mascotName}
        />
      )}
    </div>
  );
}
