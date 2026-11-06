"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useOnboardingStore } from "@/store/useOnboardingStore";
import { BrilloAvatar } from "@/components/BrilloAvatar";
import {
  ArrowLeft,
  Check,
  Sparkles,
  ArrowRight,
  Shield,
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
    mascotName,
    setMascotName,
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
    saveToStorage,
  } = useOnboardingStore();

  useEffect(() => {
    setMounted(true);
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

  // PANTALLA 3: Mundos oficiales (Máximo 3)
  const officialWorlds = [
    { id: "Bosques encantados", title: "Bosques encantados", icon: "🌲", desc: "Naturaleza mística y seres ocultos" },
    { id: "Castillos y secretos", title: "Castillos y secretos", icon: "🏰", desc: "Pasajes secretos y misterios antiguos" },
    { id: "Mundos submarinos", title: "Mundos submarinos", icon: "🌊", desc: "Profundidades y criaturas oceánicas" },
    { id: "Planetas y galaxias", title: "Planetas y galaxias", icon: "🚀", desc: "Estrellas, naves y el cosmos" },
    { id: "Islas y aventuras", title: "Islas y aventuras", icon: "🏝️", desc: "Tesoros, mapas y expediciones" },
    { id: "Lugares como el nuestro", title: "Lugares como el nuestro", icon: "🏙️", desc: "Historias reales, coles y barrios" },
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
    },
    {
      id: "Que me atrapen poco a poco.",
      title: "Que me atrapen poco a poco.",
      desc: "Personajes, emociones y mundos que explorar.",
      icon: "📖",
    },
    {
      id: "Depende de la historia.",
      title: "Depende de la historia.",
      desc: "Me gustan las dos.",
      icon: "🧭",
    },
  ];

  // PANTALLA 7: ¿Qué tipo de libros te llaman más la atención? (Máx 3, con exclusión quirúrgica)
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

  const totalSteps = 9;
  const currentMascotName = mascotName || "Brillo";

  return (
    <div className="flex-1 flex flex-col justify-between p-4 sm:p-6 min-h-screen bg-gradient-to-b from-[#E7E9FB] via-[#F4F4FD] to-[#EAE9F8] relative overflow-hidden select-none">
      
      {/* Enchanted background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-200/40 rounded-full blur-3xl pointer-events-none" />

      {/* TOP HEADER: Back button, step progress dots */}
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

          {/* Step indicator */}
          <div className="flex flex-col items-center">
            <span className="text-xs font-bold text-[#30337E] tracking-tight mb-1.5">
              Paso {currentStep} de {totalSteps}
            </span>
            <div className="flex items-center gap-1.5">
              {Array.from({ length: totalSteps }, (_, i) => i + 1).map((s) => (
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
                toggleWorld("Bosques encantados");
                toggleWorld("Castillos y secretos");
                toggleWorld("Planetas y galaxias");
              }
              if (formats.length === 0) toggleFormat("Me da igual el formato si la historia es buena");
              if (!rhythm) setRhythm("¡Que pasen cosas!");
              setStep(9);
            }}
            className="text-xs font-bold text-slate-400 hover:text-[#4F46E5] px-2 py-1"
          >
            Saltar
          </button>
        </div>
      </div>

      {/* WIZARD CONTENT CONTAINER */}
      <div className="flex-1 flex flex-col justify-center py-2 relative z-10">

        {/* PASO 1: Presentación de la Mascota y su nombre (HITO 2, Bug #3 y #11) */}
        {currentStep === 1 && (
          <div className="space-y-5 text-center">
            <BrilloAvatar size="xl" expression="happy" name={currentMascotName} />

            <div>
              <h1 className="text-2xl font-black text-[#26245C] tracking-tight">
                ¡Hola! Soy tu acompañante de lectura ✨
              </h1>
              <p className="text-xs text-slate-600 mt-2 max-w-sm mx-auto leading-relaxed">
                Por defecto me llamo <strong className="text-indigo-600">{currentMascotName}</strong>, pero puedes darme el nombre que más te guste:
              </p>
            </div>

            <div className="alea-card p-5 max-w-xs mx-auto space-y-3 text-left">
              <label htmlFor="mascotName" className="text-xs font-bold text-[#30337E] uppercase tracking-wider block">
                Nombre de tu acompañante:
              </label>
              <input
                id="mascotName"
                type="text"
                value={mascotName}
                onChange={(e) => setMascotName(e.target.value)}
                placeholder="Brillo"
                maxLength={20}
                className="w-full px-4 py-3 bg-[#F4F5FD] border border-indigo-100 rounded-2xl text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              <p className="text-[11px] text-slate-500">
                Escribe &quot;Brillo&quot;, &quot;Chispa&quot;, &quot;Lumi&quot;, o lo que tú quieras.
              </p>
            </div>
          </div>
        )}

        {/* PASO 2: Nombre del Lector y Edad */}
        {currentStep === 2 && (
          <div className="space-y-4 text-center">
            <BrilloAvatar size="lg" expression="curious" name={currentMascotName} />

            <div>
              <h1 className="text-2xl font-black text-[#26245C] tracking-tight">
                ¿Cómo te gustaría que te llamemos a ti?
              </h1>
              <p className="text-xs text-slate-600 mt-1 max-w-xs mx-auto">
                Para que {currentMascotName} se dirija a ti como en casa.
              </p>
            </div>

            <div className="alea-card p-4 max-w-xs mx-auto space-y-3 text-left">
              <input
                id="nickname"
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="Ej. Daniela, Lucas..."
                maxLength={20}
                className="w-full px-4 py-2.5 bg-[#F4F5FD] border border-indigo-100 rounded-2xl text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />

              <div className="pt-1">
                <span className="text-xs font-bold text-[#30337E] block mb-2">
                  ¿Cuántos años tienes? ({age} años)
                </span>
                <div className="grid grid-cols-5 gap-1.5">
                  {["7", "8", "9", "10", "11", "12", "13", "14", "15", "16"].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setAge(num)}
                      className={`py-2 rounded-xl font-black text-xs transition-all border ${
                        age === num
                          ? "bg-[#4F46E5] text-white border-indigo-600 shadow-sm scale-105"
                          : "bg-white text-slate-700 border-indigo-100 hover:bg-indigo-50/50"
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>

              <p className="text-[10px] text-slate-500 flex items-center gap-1 pt-1">
                <Shield size={12} className="text-emerald-600 shrink-0" />
                100% Privado: no te pedimos correos ni datos personales.
              </p>
            </div>
          </div>
        )}

        {/* PASO 3: Tus Mundos (HITO 1, Bug #2) */}
        {currentStep === 3 && (
          <div className="space-y-4">
            <div className="text-center space-y-1">
              <h1 className="text-xl sm:text-2xl font-black text-[#26245C] tracking-tight">
                Tus Mundos
              </h1>
              <p className="text-xs text-slate-500 font-medium">
                Elige hasta 3 mundos que despierten tu curiosidad ({worlds.length}/3)
              </p>
            </div>

            <div className="flex justify-center">
              <BrilloAvatar size="sm" expression="curious" name={currentMascotName} />
            </div>

            {/* 6 Official Worlds */}
            <div className="grid grid-cols-2 gap-2.5 max-h-[46vh] overflow-y-auto no-scrollbar pt-1">
              {officialWorlds.map((item) => {
                const isSelected = worlds.includes(item.id);
                const isMax = worlds.length >= 3 && !isSelected;

                return (
                  <button
                    key={item.id}
                    type="button"
                    disabled={isMax}
                    onClick={() => toggleWorld(item.id)}
                    className={`alea-card p-3 rounded-2xl text-left transition-all relative flex flex-col justify-between min-h-[96px] ${
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
                    <div>
                      <span className="text-xs font-bold text-[#202154] block mt-1 leading-snug">
                        {item.title}
                      </span>
                      <span className="text-[10px] text-slate-500 block leading-tight line-clamp-1">
                        {item.desc}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* PASO 4: ¿Qué te gustaría encontrar en una historia? (Máx 3) */}
        {currentStep === 4 && (
          <div className="space-y-4">
            <div className="text-center space-y-1">
              <h1 className="text-xl sm:text-2xl font-black text-[#26245C] tracking-tight">
                ¿Qué te gustaría encontrar en una historia?
              </h1>
              <p className="text-xs text-slate-500 font-medium">
                Puedes elegir <strong className="text-indigo-600">hasta 3 opciones</strong> ({interests.length}/3)
              </p>
            </div>

            <div className="flex justify-center">
              <BrilloAvatar size="sm" expression="reading" name={currentMascotName} />
            </div>

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

        {/* PASO 5: ¿Qué protagonistas te gustan? (Máx 3) */}
        {currentStep === 5 && (
          <div className="space-y-4">
            <div className="text-center space-y-1">
              <h1 className="text-xl sm:text-2xl font-black text-[#26245C] tracking-tight">
                ¿Qué protagonistas te gustan?
              </h1>
              <p className="text-xs text-slate-500 font-medium">
                Puedes elegir <strong className="text-indigo-600">hasta 3</strong> ({protagonists.length}/3)
              </p>
            </div>

            <div className="flex justify-center">
              <BrilloAvatar size="sm" expression="standing" name={currentMascotName} />
            </div>

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

        {/* PASO 6: ¿Cómo te gustan las historias? (Selección Única) */}
        {currentStep === 6 && (
          <div className="space-y-4">
            <div className="text-center space-y-1">
              <h1 className="text-xl sm:text-2xl font-black text-[#26245C] tracking-tight">
                ¿Cómo te gustan las historias?
              </h1>
              <p className="text-xs text-slate-500 font-medium">
                Elige una opción
              </p>
            </div>

            <div className="flex justify-center">
              <BrilloAvatar size="sm" expression="happy" name={currentMascotName} />
            </div>

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

        {/* PASO 7: Formato con Exclusión Quirúrgica (HITO 1, Bug #1) */}
        {currentStep === 7 && (
          <div className="space-y-4">
            <div className="text-center space-y-1">
              <h1 className="text-xl sm:text-2xl font-black text-[#26245C] tracking-tight">
                ¿Qué tipo de libros te llaman más la atención?
              </h1>
              <p className="text-xs text-slate-500 font-medium">
                Puedes elegir <strong className="text-indigo-600">hasta 3 opciones</strong>
              </p>
            </div>

            <div className="flex justify-center">
              <BrilloAvatar size="sm" expression="reading" name={currentMascotName} />
            </div>

            <div className="grid grid-cols-2 gap-2.5 max-h-[46vh] overflow-y-auto no-scrollbar pt-1">
              {formatOptions.map((item) => {
                const isSelected = formats.includes(item.id);
                const isAnyFormat = item.id.toLowerCase().includes("me da igual");
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

        {/* PASO 8: Libros conocidos */}
        {currentStep === 8 && (
          <div className="space-y-3">
            <div className="text-center space-y-1">
              <h1 className="text-xl sm:text-2xl font-black text-[#26245C] tracking-tight">
                ¿Hay algún libro que te haya gustado especialmente?
              </h1>
              <p className="text-xs text-slate-500 font-medium">
                Puedes seleccionar varios, o decir que no conoces ninguno
              </p>
            </div>

            <div className="flex justify-center">
              <BrilloAvatar size="sm" expression="curious" name={currentMascotName} />
            </div>

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

        {/* PASO 9: ¡Tu universo está preparado! (Con mundos REALES) */}
        {currentStep === 9 && (
          <div className="space-y-4">
            <div className="text-center space-y-1">
              <h1 className="text-2xl font-black text-[#26245C] tracking-tight">
                ¡Tu universo está preparado, {nickname}!
              </h1>
              <p className="text-xs text-slate-600 max-w-xs mx-auto">
                Con {currentMascotName} hemos preparado lecturas hechas a tu medida.
              </p>
            </div>

            <div className="flex justify-center">
              <BrilloAvatar size="lg" expression="celebrating" name={currentMascotName} />
            </div>

            {/* Tus mundos reales elegidos */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-[#30337E] block text-center">
                Tus mundos elegidos:
              </span>
              <div className="flex items-center justify-center gap-2 flex-wrap">
                {(worlds.length > 0 ? worlds : ["Bosques encantados", "Castillos y secretos"]).map((worldTitle) => {
                  const found = officialWorlds.find((w) => w.id === worldTitle);
                  return (
                    <div
                      key={worldTitle}
                      className="alea-card py-2 px-3 rounded-2xl flex items-center gap-2 border border-indigo-100 bg-white shadow-sm"
                    >
                      <span className="text-xl">{found?.icon || "✨"}</span>
                      <span className="text-xs font-black text-[#202154]">{worldTitle}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Te recomiendo */}
            <div className="space-y-2 pt-1">
              <span className="text-xs font-bold text-[#30337E] block text-center">
                Primeras lecturas para ti:
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

      {/* BOTTOM ACTION BUTTON */}
      <div className="pt-3 relative z-10">
        {currentStep < 9 ? (
          <button
            type="button"
            onClick={nextStep}
            className="w-full py-3.5 px-6 rounded-full font-black text-sm bg-[#5457D0] hover:bg-[#4346B8] active:scale-[0.98] text-white shadow-magical flex items-center justify-center gap-2 transition-all"
          >
            <span>
              {currentStep === 1
                ? `¡Encantado, ${currentMascotName}!`
                : "Continuar"}
            </span>
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
