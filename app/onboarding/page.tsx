"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useOnboardingStore } from "@/store/useOnboardingStore";
import {
  ArrowLeft,
  Check,
  Sparkles,
  BookOpen,
  ArrowRight,
  Shield,
  Heart,
  Star,
  Search,
  CheckCircle2,
} from "lucide-react";

export default function OnboardingPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [favoriteBooks, setFavoriteBooks] = useState<string[]>([]);
  const [noKnownBooks, setNoKnownBooks] = useState(false);

  const {
    currentStep,
    setStep,
    nextStep,
    prevStep,
    nickname,
    setNickname,
    age,
    setAge,
    worlds,
    toggleWorld,
    interests,
    toggleInterest,
    protagonists,
    toggleProtagonist,
    rhythm,
    setRhythm,
    formats,
    toggleFormat,
    readingHabit,
    setReadingHabit,
    saveToStorage,
  } = useOnboardingStore();

  useEffect(() => {
    setMounted(true);
    // Asignar Daniela por defecto si está vacío para reflejar el prototipo fielmente
    if (!nickname) {
      setNickname("Daniela");
    }
  }, [nickname, setNickname]);

  if (!mounted) {
    return (
      <div className="flex-1 flex items-center justify-center p-6 text-indigo-400">
        Iniciando universo ALEA...
      </div>
    );
  }

  // PANTALLA 3 (Mundos de inicio)
  const defaultWorlds = [
    { id: "Aventuras y fantasía", title: "Aventuras y fantasía", image: "/assets/worlds/aventuras_fantasia.jpg" },
    { id: "Naturaleza y animales", title: "Naturaleza y animales", image: "/assets/worlds/naturaleza_animales.jpg" },
    { id: "Planetas y galaxias", title: "Planetas y galaxias", image: "/assets/worlds/planetas_galaxias.jpg" },
  ];

  // PANTALLA 4: ¿Qué te gustaría encontrar en una historia? (Máx 3)
  const storyInterests = [
    { id: "Resolver un misterio", label: "Resolver un misterio", icon: "🗺️" },
    { id: "Vivir una gran aventura", label: "Vivir una gran aventura", icon: "🏔️" },
    { id: "Reírme muchísimo", label: "Reírme muchísimo", icon: "☀️" },
    { id: "Encontrar algo inesperado", label: "Encontrar algo inesperado", icon: "🚪" },
    { id: "Conocer personajes extraordinarios", label: "Conocer personajes extraordinarios", icon: "🦊" },
    { id: "Superar un reto o un peligro", label: "Superar un reto o un peligro", icon: "🛡️" },
  ];

  // PANTALLA 5: ¿Qué protagonistas te gustan? (Máx 3)
  const protagonistTypes = [
    { id: "Niños y niñas como yo", label: "Niños y niñas como yo", icon: "👫" },
    { id: "Animales con personalidad", label: "Animales con personalidad", icon: "🐶" },
    { id: "Seres fantásticos", label: "Seres fantásticos", icon: "🐉" },
    { id: "Detectives y exploradores", label: "Detectives y exploradores", icon: "🕵️" },
    { id: "Grupos de amigos", label: "Grupos de amigos", icon: "🛹" },
    { id: "Personas normales que viven cosas extraordinarias", label: "Personas normales que viven cosas extraordinarias", icon: "🎒" },
  ];

  // PANTALLA 6: ¿Cómo te gustan las historias? (Selección Única)
  const rhythmStoryTypes = [
    {
      id: "¡Que pasen cosas!",
      title: "¡Que pasen cosas!",
      desc: "Acción, ritmo y sorpresas.",
      icon: "⚡",
      badgeColor: "from-amber-400 to-rose-400",
    },
    {
      id: "Que me atrapen poco a poco.",
      title: "Que me atrapen poco a poco.",
      desc: "Personajes, emociones y mundos que explorar.",
      icon: "📖",
      badgeColor: "from-indigo-400 to-teal-400",
    },
    {
      id: "Depende de la historia.",
      title: "Depende de la historia.",
      desc: "Me gustan las dos.",
      icon: "🧭",
      badgeColor: "from-blue-400 to-purple-400",
    },
  ];

  // PANTALLA 7: ¿Qué tipo de libros te llaman más la atención? (Máx 3, con excepción quirúrgica)
  const formatOptions = [
    { id: "Libros con muchas ilustraciones", label: "Libros con muchas ilustraciones", icon: "🌳" },
    { id: "Cómics y novelas gráficas", label: "Cómics y novelas gráficas", icon: "🎨" },
    { id: "Historias con capítulos cortos", label: "Historias con capítulos cortos", icon: "⭐" },
    { id: "Novelas largas", label: "Novelas largas", icon: "🌙" },
    { id: "Me da igual el formato si la historia es buena", label: "Me da igual el formato si la historia es buena", icon: "✨" },
  ];

  // PANTALLA 8: Libros conocidos
  const knownBooks = [
    { id: "harry_potter", title: "Harry Potter", cover: "/assets/books/harry_potter.jpg" },
    { id: "matilda", title: "Matilda", cover: "/assets/books/matilda.jpg" },
    { id: "el_principito", title: "El Principito", cover: "/assets/books/el_principito.jpg" },
    { id: "wonder", title: "Wonder", cover: "/assets/books/wonder.jpg" },
    { id: "tintin", title: "Las aventuras de Tintín", cover: "/assets/books/tintin.jpg" },
    { id: "greg", title: "El diario de Greg", cover: "/assets/books/greg.jpg" },
  ];

  const toggleFavoriteBook = (bookId: string) => {
    setNoKnownBooks(false);
    if (favoriteBooks.includes(bookId)) {
      setFavoriteBooks(favoriteBooks.filter((id) => id !== bookId));
    } else {
      setFavoriteBooks([...favoriteBooks, bookId]);
    }
  };

  const handleFinish = () => {
    saveToStorage();
    router.push("/descubre");
  };

  const totalSteps = 8;

  return (
    <div className="flex-1 flex flex-col justify-between p-4 sm:p-6 min-h-screen bg-gradient-to-b from-[#E7E9FB] via-[#F4F4FD] to-[#EAE9F8] relative overflow-hidden select-none">
      
      {/* Enchanted background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-200/40 rounded-full blur-3xl pointer-events-none" />

      {/* TOP HEADER: Back button, step progress dots (Matching mockups) */}
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-3">
          {currentStep > 1 ? (
            <button
              onClick={prevStep}
              className="w-10 h-10 rounded-full bg-white/95 shadow-sm border border-indigo-100 flex items-center justify-center text-slate-600 hover:text-slate-900 transition-colors"
              aria-label="Volver atrás"
            >
              <ArrowLeft size={18} />
            </button>
          ) : (
            <div className="w-10" />
          )}

          {/* Step indicator: e.g. "4 de 6" */}
          <div className="flex flex-col items-center">
            <span className="text-xs font-bold text-[#30337E] tracking-tight mb-1.5">
              {currentStep <= 2 ? `Inicio ${currentStep}` : `${currentStep - 2} de 6`}
            </span>
            {/* Dots bar matching mockups */}
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                <div
                  key={s}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    s === currentStep
                      ? "w-6 bg-[#4F46E5]"
                      : s < currentStep
                      ? "w-2 bg-[#696DE4]"
                      : "w-2 bg-indigo-200/80"
                  }`}
                />
              ))}
            </div>
          </div>

          <button
            onClick={() => {
              if (worlds.length === 0) {
                toggleWorld("Aventuras y fantasía");
                toggleWorld("Naturaleza y animales");
                toggleWorld("Planetas y galaxias");
              }
              if (formats.length === 0) toggleFormat("Me da igual el formato si la historia es buena");
              if (!rhythm) setRhythm("¡Que pasen cosas!");
              setStep(8);
            }}
            className="text-xs font-bold text-slate-400 hover:text-[#4F46E5] px-2 py-1"
          >
            Saltar
          </button>
        </div>
      </div>

      {/* WIZARD CONTENT CONTAINER */}
      <div className="flex-1 flex flex-col justify-center py-2 relative z-10">

        {/* PASO 1: Nombre / Apodo Lector */}
        {currentStep === 1 && (
          <div className="space-y-5 text-center">
            <div className="w-24 h-24 mx-auto rounded-3xl overflow-hidden shadow-magical ring-4 ring-white/80 bg-white">
              <img
                src="/assets/mascot/banner_mascot.jpg"
                alt="Mascota ALEA"
                className="w-full h-full object-cover"
              />
            </div>

            <div>
              <h1 className="text-2xl font-black text-[#26245C] tracking-tight">
                ¡Te damos la bienvenida a ALEA!
              </h1>
              <p className="text-xs text-slate-600 mt-1.5 max-w-xs mx-auto leading-relaxed">
                Tu rincón mágico para descubrir los mejores libros físicos sin pantallas ni publicidad.
              </p>
            </div>

            <div className="alea-card p-5 max-w-xs mx-auto space-y-3 text-left">
              <label htmlFor="nickname" className="text-xs font-bold text-[#30337E] uppercase tracking-wider block">
                ¿Cómo te gustaría que te llamemos?
              </label>
              <input
                id="nickname"
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="Ej. Daniela, Leo..."
                maxLength={20}
                className="w-full px-4 py-3 bg-[#F4F5FD] border border-indigo-100 rounded-2xl text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              <p className="text-[11px] text-slate-500 flex items-center gap-1">
                <Shield size={13} className="text-emerald-600 shrink-0" />
                100% Privado: no te pedimos correos ni datos personales.
              </p>
            </div>
          </div>
        )}

        {/* PASO 2: Edad del lector */}
        {currentStep === 2 && (
          <div className="space-y-5 text-center">
            <div className="w-24 h-24 mx-auto rounded-3xl overflow-hidden shadow-magical ring-4 ring-white/80 bg-white">
              <img
                src="/assets/mascot/mascot_standing.jpg"
                alt="Mascota ALEA"
                className="w-full h-full object-cover"
              />
            </div>

            <div>
              <h1 className="text-2xl font-black text-[#26245C] tracking-tight">
                ¿Cuántos años tienes?
              </h1>
              <p className="text-xs text-slate-600 mt-1 max-w-xs mx-auto">
                Para calibrar los temas e historias ideales para ti.
              </p>
            </div>

            <div className="grid grid-cols-5 gap-2 max-w-xs mx-auto">
              {["7", "8", "9", "10", "11", "12", "13", "14", "15", "16"].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setAge(num)}
                  className={`py-3 rounded-2xl font-black text-sm transition-all border ${
                    age === num
                      ? "bg-[#4F46E5] text-white border-indigo-600 shadow-magical scale-105"
                      : "bg-white text-slate-700 border-indigo-100 hover:border-indigo-300 hover:bg-indigo-50/50"
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>

            <p className="text-xs font-bold text-[#30337E]">
              Edad seleccionada: <span className="text-indigo-600">{age} años</span>
            </p>
          </div>
        )}

        {/* PASO 3 (Mockup Screen 4): ¿Qué te gustaría encontrar en una historia? (Máx 3) */}
        {currentStep === 3 && (
          <div className="space-y-4">
            <div className="text-center space-y-1">
              <h1 className="text-xl sm:text-2xl font-black text-[#26245C] tracking-tight">
                ¿Qué te gustaría encontrar en una historia?
              </h1>
              <p className="text-xs text-slate-500 font-medium">
                Puedes elegir <strong className="text-indigo-600">hasta 3 opciones</strong> ({interests.length}/3)
              </p>
            </div>

            {/* Mascot in Center (Standing with Glowing Book) */}
            <div className="w-24 h-24 mx-auto rounded-3xl overflow-hidden shadow-magical ring-4 ring-white/90 bg-white">
              <img
                src="/assets/mascot/banner_mascot.jpg"
                alt="Mascota mágica ALEA"
                className="w-full h-full object-cover"
              />
            </div>

            {/* 6 Cards in 2 columns */}
            <div className="grid grid-cols-2 gap-2.5 max-h-[46vh] overflow-y-auto no-scrollbar pt-1">
              {storyInterests.map((item) => {
                const isSelected = interests.includes(item.id);
                const isMax = interests.length >= 3 && !isSelected;

                return (
                  <button
                    key={item.id}
                    type="button"
                    disabled={isMax}
                    onClick={() => toggleInterest(item.id)}
                    className={`alea-card p-3 rounded-2xl text-left transition-all relative flex flex-col justify-between min-h-[92px] ${
                      isSelected
                        ? "bg-[#ECEEFC] border-indigo-500 shadow-magical ring-1 ring-indigo-400"
                        : isMax
                        ? "opacity-40 cursor-not-allowed bg-white/70"
                        : "bg-white hover:border-indigo-300"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-2xl">{item.icon}</span>
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center border transition-all ${
                          isSelected
                            ? "bg-[#4F46E5] border-indigo-600 text-white"
                            : "border-slate-300 bg-white"
                        }`}
                      >
                        {isSelected && <Check size={12} strokeWidth={3} />}
                      </div>
                    </div>
                    <span className="text-xs font-bold text-[#202154] mt-2 leading-snug">
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* PASO 4 (Mockup Screen 5): ¿Qué protagonistas te gustan? (Máx 3) */}
        {currentStep === 4 && (
          <div className="space-y-4">
            <div className="text-center space-y-1">
              <h1 className="text-xl sm:text-2xl font-black text-[#26245C] tracking-tight">
                ¿Qué protagonistas te gustan?
              </h1>
              <p className="text-xs text-slate-500 font-medium">
                Puedes elegir <strong className="text-indigo-600">hasta 3</strong> ({protagonists.length}/3)
              </p>
            </div>

            {/* Mascot in Center: Resting on Books */}
            <div className="w-24 h-24 mx-auto rounded-3xl overflow-hidden shadow-magical ring-4 ring-white/90 bg-white">
              <img
                src="/assets/mascot/mascot_reading.jpg"
                alt="Mascota leyendo en libros"
                className="w-full h-full object-cover"
              />
            </div>

            {/* 6 Protagonist Cards */}
            <div className="grid grid-cols-2 gap-2.5 max-h-[46vh] overflow-y-auto no-scrollbar pt-1">
              {protagonistTypes.map((item) => {
                const isSelected = protagonists.includes(item.id);
                const isMax = protagonists.length >= 3 && !isSelected;

                return (
                  <button
                    key={item.id}
                    type="button"
                    disabled={isMax}
                    onClick={() => toggleProtagonist(item.id)}
                    className={`alea-card p-3 rounded-2xl text-left transition-all relative flex flex-col justify-between min-h-[92px] ${
                      isSelected
                        ? "bg-[#ECEEFC] border-indigo-500 shadow-magical ring-1 ring-indigo-400"
                        : isMax
                        ? "opacity-40 cursor-not-allowed bg-white/70"
                        : "bg-white hover:border-indigo-300"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-2xl">{item.icon}</span>
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center border transition-all ${
                          isSelected
                            ? "bg-[#4F46E5] border-indigo-600 text-white"
                            : "border-slate-300 bg-white"
                        }`}
                      >
                        {isSelected && <Check size={12} strokeWidth={3} />}
                      </div>
                    </div>
                    <span className="text-xs font-bold text-[#202154] mt-2 leading-snug">
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* PASO 5 (Mockup Screen 6): ¿Cómo te gustan las historias? (Selección Única) */}
        {currentStep === 5 && (
          <div className="space-y-4">
            <div className="text-center space-y-1">
              <h1 className="text-xl sm:text-2xl font-black text-[#26245C] tracking-tight">
                ¿Cómo te gustan las historias?
              </h1>
              <p className="text-xs text-slate-500 font-medium">
                Elige una opción
              </p>
            </div>

            {/* Mascot in Center: Flying Happily */}
            <div className="w-24 h-24 mx-auto rounded-3xl overflow-hidden shadow-magical ring-4 ring-white/90 bg-white">
              <img
                src="/assets/mascot/mascot_flying.jpg"
                alt="Mascota volando con halo"
                className="w-full h-full object-cover"
              />
            </div>

            {/* 3 Tall Option Cards (Mockup format) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {rhythmStoryTypes.map((item) => {
                const isSelected = rhythm === item.id;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setRhythm(item.id)}
                    className={`alea-card p-4 rounded-3xl text-left transition-all relative flex flex-col justify-between ${
                      isSelected
                        ? "bg-[#ECEEFC] border-indigo-500 shadow-magical ring-2 ring-indigo-400"
                        : "bg-white hover:border-indigo-300"
                    }`}
                  >
                    <div>
                      <div className="w-10 h-10 rounded-2xl bg-[#F0F2FD] flex items-center justify-center text-xl mb-3 shadow-inner">
                        {item.icon}
                      </div>
                      <h3 className="text-sm font-black text-[#202154] leading-tight">
                        {item.title}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>

                    <div className="mt-3 flex justify-end">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center border transition-all ${
                          isSelected
                            ? "bg-[#4F46E5] border-indigo-600 text-white"
                            : "border-slate-300 bg-white"
                        }`}
                      >
                        {isSelected && <Check size={14} strokeWidth={3} />}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* PASO 6 (Mockup Screen 7): ¿Qué tipo de libros te llaman más la atención? (Máx 3) */}
        {currentStep === 6 && (
          <div className="space-y-4">
            <div className="text-center space-y-1">
              <h1 className="text-xl sm:text-2xl font-black text-[#26245C] tracking-tight">
                ¿Qué tipo de libros te llaman más la atención?
              </h1>
              <p className="text-xs text-slate-500 font-medium">
                Puedes elegir <strong className="text-indigo-600">hasta 3 opciones</strong>
              </p>
            </div>

            {/* Mascot in Center */}
            <div className="w-24 h-24 mx-auto rounded-3xl overflow-hidden shadow-magical ring-4 ring-white/90 bg-white">
              <img
                src="/assets/mascot/banner_mascot.jpg"
                alt="Mascota con libro"
                className="w-full h-full object-cover"
              />
            </div>

            {/* 5 Format Cards */}
            <div className="grid grid-cols-2 gap-2.5 max-h-[46vh] overflow-y-auto no-scrollbar pt-1">
              {formatOptions.map((item) => {
                const isSelected = formats.includes(item.id);
                const isAnyFormat = item.id === "Me da igual el formato si la historia es buena";
                const isMax = formats.length >= 3 && !isSelected && !isAnyFormat;

                return (
                  <button
                    key={item.id}
                    type="button"
                    disabled={isMax}
                    onClick={() => toggleFormat(item.id)}
                    className={`alea-card p-3 rounded-2xl text-left transition-all relative flex flex-col justify-between min-h-[96px] ${
                      isAnyFormat ? "col-span-2" : ""
                    } ${
                      isSelected
                        ? "bg-[#ECEEFC] border-indigo-500 shadow-magical ring-1 ring-indigo-400"
                        : isMax
                        ? "opacity-40 cursor-not-allowed bg-white/70"
                        : "bg-white hover:border-indigo-300"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-2xl">{item.icon}</span>
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center border transition-all ${
                          isSelected
                            ? "bg-[#4F46E5] border-indigo-600 text-white"
                            : "border-slate-300 bg-white"
                        }`}
                      >
                        {isSelected && <Check size={12} strokeWidth={3} />}
                      </div>
                    </div>
                    <span className="text-xs font-bold text-[#202154] mt-2 leading-snug">
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* PASO 7 (Mockup Screen 8): ¿Hay algún libro que te haya gustado especialmente? */}
        {currentStep === 7 && (
          <div className="space-y-3">
            <div className="text-center space-y-1">
              <h1 className="text-xl sm:text-2xl font-black text-[#26245C] tracking-tight">
                ¿Hay algún libro que te haya gustado especialmente?
              </h1>
              <p className="text-xs text-slate-500 font-medium">
                Puedes seleccionar varios, o decir que no conoces ninguno
              </p>
            </div>

            {/* Mascot Hugging Star Book (Mockup exact) */}
            <div className="w-24 h-24 mx-auto rounded-3xl overflow-hidden shadow-magical ring-4 ring-white/90 bg-white">
              <img
                src="/assets/mascot/mascot_hugging.jpg"
                alt="Mascota abrazando libro con estrella"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Grid of 6 Iconic Books from mockup */}
            <div className="grid grid-cols-3 gap-2.5 max-h-[36vh] overflow-y-auto no-scrollbar pt-1">
              {knownBooks.map((book) => {
                const isSelected = favoriteBooks.includes(book.id);

                return (
                  <button
                    key={book.id}
                    type="button"
                    onClick={() => toggleFavoriteBook(book.id)}
                    className={`alea-card p-2 rounded-2xl flex flex-col items-center text-center transition-all relative ${
                      isSelected
                        ? "bg-[#ECEEFC] border-indigo-500 shadow-magical ring-2 ring-indigo-400 scale-[1.02]"
                        : "bg-white hover:border-indigo-300"
                    }`}
                  >
                    <div className="w-16 h-22 rounded-lg overflow-hidden shadow-sm mb-1.5 bg-slate-100">
                      <img
                        src={book.cover}
                        alt={book.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="text-[11px] font-bold text-[#202154] line-clamp-1 leading-tight">
                      {book.title}
                    </span>

                    <div
                      className={`absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center border shadow-sm ${
                        isSelected
                          ? "bg-[#4F46E5] border-indigo-600 text-white"
                          : "border-slate-300 bg-white/90"
                      }`}
                    >
                      {isSelected && <Check size={12} strokeWidth={3} />}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Two Helper Options at Bottom */}
            <div className="flex gap-2 pt-1 justify-center">
              <button
                type="button"
                onClick={() => {
                  setFavoriteBooks([]);
                  setNoKnownBooks(true);
                }}
                className={`py-2 px-3 rounded-full text-xs font-bold transition-all ${
                  noKnownBooks
                    ? "bg-[#4F46E5] text-white"
                    : "bg-white border border-indigo-100 text-slate-600 hover:bg-slate-50"
                }`}
              >
                No conozco ninguno de estos
              </button>
              <button
                type="button"
                onClick={() => {
                  setFavoriteBooks([]);
                  setNoKnownBooks(true);
                }}
                className="py-2 px-3 rounded-full text-xs font-bold bg-white border border-indigo-100 text-slate-600 hover:bg-slate-50 transition-all"
              >
                Prefiero descubrir algo nuevo
              </button>
            </div>
          </div>
        )}

        {/* PASO 8 (Mockup Screen 9): ¡Tu universo está preparado! */}
        {currentStep === 8 && (
          <div className="space-y-4">
            <div className="text-center space-y-1">
              <h1 className="text-2xl font-black text-[#26245C] tracking-tight">
                ¡Tu universo está preparado!
              </h1>
              <p className="text-xs text-slate-600 max-w-xs mx-auto">
                Con toda esta información, ya sé qué historias podrían gustarte.
              </p>
            </div>

            {/* Mascot in Celebration Flight */}
            <div className="w-24 h-24 mx-auto rounded-3xl overflow-hidden shadow-magical ring-4 ring-white/90 bg-white">
              <img
                src="/assets/mascot/mascot_celebrate.jpg"
                alt="Mascota celebrando vuelo"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Tus primeros mundos */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-[#30337E] block text-center">
                Tus primeros mundos:
              </span>
              <div className="flex items-center justify-center gap-2 overflow-x-auto no-scrollbar">
                {defaultWorlds.map((w) => (
                  <div
                    key={w.id}
                    className="alea-card p-1.5 flex flex-col items-center w-24 text-center shrink-0"
                  >
                    <div className="w-20 h-14 rounded-xl overflow-hidden mb-1">
                      <img src={w.image} alt={w.title} className="w-full h-full object-cover" />
                    </div>
                    <span className="text-[10px] font-bold text-[#202154] line-clamp-1">
                      {w.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Te recomiendo */}
            <div className="space-y-2 pt-1">
              <span className="text-xs font-bold text-[#30337E] block text-center">
                Te recomiendo:
              </span>
              <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto">
                <div className="alea-card p-2 flex flex-col items-center text-center">
                  <div className="w-14 h-18 rounded-md overflow-hidden mb-1 bg-slate-100">
                    <img src="/assets/books/matilda.jpg" alt="Matilda" className="w-full h-full object-cover" />
                  </div>
                  <span className="text-[10px] font-bold text-[#202154] truncate w-full">Matilda</span>
                </div>
                <div className="alea-card p-2 flex flex-col items-center text-center">
                  <div className="w-14 h-18 rounded-md overflow-hidden mb-1 bg-slate-100">
                    <img src="/assets/books/wonder.jpg" alt="Wonder" className="w-full h-full object-cover" />
                  </div>
                  <span className="text-[10px] font-bold text-[#202154] truncate w-full">Wonder</span>
                </div>
                <div className="alea-card p-2 flex flex-col items-center text-center">
                  <div className="w-14 h-18 rounded-md overflow-hidden mb-1 bg-slate-100">
                    <img src="/assets/books/el_principito.jpg" alt="El Principito" className="w-full h-full object-cover" />
                  </div>
                  <span className="text-[10px] font-bold text-[#202154] truncate w-full">El Principito</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* BOTTOM ACTION BUTTON: "Continuar" / "Explorar mi universo" (Matching mockup button) */}
      <div className="pt-3 relative z-10">
        {currentStep < 8 ? (
          <button
            type="button"
            onClick={nextStep}
            className="w-full py-3.5 px-6 rounded-full font-black text-sm bg-[#5457D0] hover:bg-[#4346B8] active:scale-[0.98] text-white shadow-magical flex items-center justify-center gap-2 transition-all"
          >
            <span>Continuar</span>
            <ArrowRight size={16} />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleFinish}
            className="w-full py-4 px-6 rounded-full font-black text-base bg-gradient-to-r from-[#4F46E5] to-[#6366F1] hover:from-[#4338CA] hover:to-[#4F46E5] active:scale-[0.98] text-white shadow-magical flex items-center justify-center gap-2 transition-all"
          >
            <span>Explorar mi universo</span>
            <Sparkles size={18} className="text-amber-300" />
          </button>
        )}
      </div>
    </div>
  );
}
