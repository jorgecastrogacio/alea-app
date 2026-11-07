"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { UserProfile, useOnboardingStore } from "@/store/useOnboardingStore";
import { useLibraryStore } from "@/store/useLibraryStore";
import { BrilloAvatar } from "@/components/BrilloAvatar";
import { LivingMascot } from "@/components/LivingMascot";
import { EditPreferencesModal } from "@/components/EditPreferencesModal";
import {
  Sparkles,
  Shield,
  Heart,
  BookOpen,
  RotateCcw,
  Feather,
  Trophy,
  PenLine,
  Compass,
} from "lucide-react";

const WORLD_ICONS: Record<string, string> = {
  "Bosques encantados": "🌲",
  "Castillos y secretos": "🏰",
  "Mundos submarinos": "🌊",
  "Planetas y galaxias": "🚀",
  "Islas y aventuras": "🏝️",
  "Lugares como el nuestro": "🏙️",
  "Aventuras y fantasía": "🏰",
  "Naturaleza y animales": "🌲",
};

export default function UniversoPage() {
  const router = useRouter();
  const store = useOnboardingStore();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [mounted, setMounted] = useState(false);
  const [showPreferencesModal, setShowPreferencesModal] = useState(false);

  const { library, favorites, loadLibrary } = useLibraryStore();
  const { resetOnboarding } = useOnboardingStore();

  const loadData = useCallback(() => {
    loadLibrary();
    try {
      const saved = localStorage.getItem("alea_user_profile");
      if (saved) {
        setProfile(JSON.parse(saved));
      } else {
        setProfile({
          nickname: store.nickname,
          mascotName: store.mascotName,
          age: store.age,
          worlds: store.worlds,
          interests: store.interests,
          protagonists: store.protagonists,
          rhythm: store.rhythm,
          formats: store.formats,
          readingHabit: store.readingHabit,
        });
      }
    } catch (e) {
      console.error("Error reading profile:", e);
    }
  }, [loadLibrary, store]);

  useEffect(() => {
    setMounted(true);
    loadData();
  }, [loadData]);

  const libraryCount = Object.keys(library).length;
  const readingCount = Object.values(library).filter((v) => v === "reading").length;
  const finishedCount = Object.values(library).filter((v) => v === "finished").length;
  const favoritesCount = (favorites || []).length;

  const handleResetProfile = () => {
    if (confirm("¿Quieres repetir el cuestionario para recalibrar tus preferencias de lectura?")) {
      resetOnboarding();
      router.push("/onboarding");
    }
  };

  const handleClearAll = () => {
    if (confirm("¿Quieres reiniciar todos los datos de ALEA en este navegador?")) {
      localStorage.clear();
      window.location.href = "/onboarding";
    }
  };

  if (!mounted) {
    return (
      <div className="flex-1 flex items-center justify-center p-8 text-indigo-400">
        Abriendo Mi Universo...
      </div>
    );
  }

  const nickname = profile?.nickname || store.nickname || "Daniela";
  const mascotName = profile?.mascotName || store.mascotName || "Brillo";
  const age = profile?.age || store.age || "11";
  const worlds = (profile?.worlds && profile.worlds.length > 0)
    ? profile.worlds
    : store.worlds;
  const interests = profile?.interests || store.interests;
  const rhythm = profile?.rhythm || store.rhythm;
  const formats = profile?.formats || store.formats;

  return (
    <div className="flex-1 flex flex-col p-4 md:p-7 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[11px] font-bold tracking-widest text-[#474AB6] uppercase">
            Perfil & Acompañante
          </span>
          <h1 className="text-2xl font-black text-[#26245C] tracking-tight">
            Mi Universo Lector
          </h1>
        </div>

        <button
          type="button"
          onClick={() => setShowPreferencesModal(true)}
          className="flex items-center gap-1.5 text-xs font-bold text-white bg-[#4F46E5] hover:bg-indigo-700 px-3.5 py-2 rounded-full transition-all shadow-magical"
        >
          <PenLine size={14} />
          <span>Editar gustos</span>
        </button>
      </div>

      {/* User & Mascot Hero Card */}
      <div className="rounded-3xl p-6 bg-gradient-to-br from-[#4F46E5] via-[#4338CA] to-[#312E81] text-white shadow-magical relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4 relative z-10">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white/60 shadow-md shrink-0 bg-white/20">
              <img
                src="/assets/avatar_daniela.jpg"
                alt={nickname}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/assets/mascot/mascot_reading.jpg";
                }}
              />
            </div>
            <div>
              <span className="text-[11px] font-bold text-indigo-200 uppercase tracking-wider block">
                {age} años
              </span>
              <h2 className="text-2xl font-black text-white">
                {nickname}
              </h2>
              <p className="text-xs text-indigo-200 mt-0.5">
                Acompañada por <strong className="text-amber-300">{mascotName}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm py-2 px-3.5 rounded-2xl border border-white/15">
            <BrilloAvatar size="xs" expression="happy" name={mascotName} />
            <span className="text-xs font-bold text-amber-200">
              Guía: {mascotName}
            </span>
          </div>
        </div>

        {/* Peaceful Reading Stats */}
        <div className="grid grid-cols-4 gap-2 mt-5 pt-4 border-t border-white/15 text-center relative z-10">
          <div className="bg-white/10 rounded-2xl p-2.5">
            <span className="text-xl font-black block">{libraryCount}</span>
            <span className="text-[10px] text-indigo-200 font-medium">Estantería</span>
          </div>
          <div className="bg-white/10 rounded-2xl p-2.5">
            <span className="text-xl font-black block">{readingCount}</span>
            <span className="text-[10px] text-indigo-200 font-medium">Leyendo</span>
          </div>
          <div className="bg-white/10 rounded-2xl p-2.5">
            <span className="text-xl font-black block">{finishedCount}</span>
            <span className="text-[10px] text-indigo-200 font-medium">Leídos</span>
          </div>
          <div className="bg-white/10 rounded-2xl p-2.5">
            <span className="text-xl font-black block text-rose-300">{favoritesCount}</span>
            <span className="text-[10px] text-indigo-200 font-medium">Favoritos</span>
          </div>
        </div>
      </div>

      {/* Mascota Viva Interactiva */}
      <div className="alea-card p-6 bg-gradient-to-r from-amber-50 via-indigo-50/50 to-purple-50 border-2 border-indigo-100/80 flex flex-col sm:flex-row items-center gap-6 shadow-sm">
        <div className="shrink-0">
          <LivingMascot
            size="lg"
            mood="idle"
            name={mascotName}
            speechText={`¡Hola ${nickname}! Tócame para jugar o haz clic en cualquier libro para verlo en 3D.`}
            enableInteraction={true}
          />
        </div>
        <div className="flex-1 text-center sm:text-left space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-100/80 text-amber-800 text-[11px] font-bold">
            <Sparkles size={12} className="text-amber-500" />
            <span>Tu Guía Mágico Interactivo</span>
          </div>
          <h3 className="text-lg font-black text-[#26245C]">
            {mascotName} te acompaña en cada lectura
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Toca a {mascotName} en cualquier momento para escuchar sus consejos y recibir energía lectora mágica.
          </p>
        </div>
      </div>

      {/* Preferencias Detalladas */}
      <div className="alea-card p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#30337E] flex items-center gap-1.5">
            <Compass size={14} className="text-indigo-500" />
            Preferencias de Lectura
          </h3>
          <button
            type="button"
            onClick={() => setShowPreferencesModal(true)}
            className="text-xs text-indigo-600 hover:underline font-bold"
          >
            Modificar
          </button>
        </div>

        {/* Tus mundos */}
        <div className="space-y-1.5">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            Mundos Favoritos:
          </span>
          <div className="flex flex-wrap gap-2">
            {worlds.map((w) => (
              <span
                key={w}
                className="px-3 py-1.5 bg-[#ECEEFC] text-[#2A2B68] rounded-xl text-xs font-bold flex items-center gap-1.5 border border-indigo-100"
              >
                <span>{WORLD_ICONS[w] || "✨"}</span>
                <span>{w}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Intereses */}
        {interests && interests.length > 0 && (
          <div className="space-y-1.5 pt-1 border-t border-indigo-50">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Qué te atrapa:
            </span>
            <div className="flex flex-wrap gap-2">
              {interests.map((int) => (
                <span
                  key={int}
                  className="px-2.5 py-1 bg-slate-50 text-slate-700 rounded-lg text-xs font-medium border border-slate-200"
                >
                  {int}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Ritmo y Formato */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 border-t border-indigo-50 text-xs">
          <div className="p-3 bg-indigo-50/50 rounded-2xl border border-indigo-100">
            <span className="text-[10px] font-bold text-indigo-600 block uppercase tracking-wider mb-0.5">
              Ritmo de lectura preferido:
            </span>
            <span className="font-bold text-slate-800">{rhythm || "¡Que pasen cosas!"}</span>
          </div>

          <div className="p-3 bg-indigo-50/50 rounded-2xl border border-indigo-100">
            <span className="text-[10px] font-bold text-indigo-600 block uppercase tracking-wider mb-0.5">
              Formatos favoritos:
            </span>
            <span className="font-bold text-slate-800">
              {formats && formats.length > 0 ? formats.join(", ") : "Me da igual el formato si la historia es buena"}
            </span>
          </div>
        </div>
      </div>

      {/* Mis Logros Serenos */}
      <div className="alea-card p-5 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#30337E] flex items-center gap-1.5">
            <Trophy size={14} className="text-amber-500" />
            Mis Momentos Lectores
          </h3>
          <span className="text-[10px] text-indigo-600 bg-indigo-50 font-bold px-2 py-0.5 rounded-full">
            Sin presiones
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="p-3 bg-[#F4F5FD] rounded-2xl border border-indigo-100 flex flex-col items-center">
            <span className="text-2xl mb-1">🌿</span>
            <span className="text-xs font-bold text-[#202154]">Lectura en calma</span>
            <span className="text-[9px] text-slate-400 mt-0.5">A tu propio ritmo</span>
          </div>
          <div className="p-3 bg-[#F4F5FD] rounded-2xl border border-indigo-100 flex flex-col items-center">
            <span className="text-2xl mb-1">📚</span>
            <span className="text-xs font-bold text-[#202154]">Amor al papel</span>
            <span className="text-[9px] text-slate-400 mt-0.5">Libros físicos</span>
          </div>
          <div className="p-3 bg-[#F4F5FD] rounded-2xl border border-indigo-100 flex flex-col items-center">
            <span className="text-2xl mb-1">✨</span>
            <span className="text-xs font-bold text-[#202154]">Curiosidad</span>
            <span className="text-[9px] text-slate-400 mt-0.5">Nuevos mundos</span>
          </div>
        </div>
      </div>

      {/* Valores Éticos */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Valores Fundamentales
        </h3>

        <div className="alea-card p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Shield size={20} />
          </div>
          <div className="text-xs">
            <h4 className="font-bold text-[#202154]">Privacidad Infantil 100%</h4>
            <p className="text-slate-500 text-[11px]">
              Tus datos solo residen en este dispositivo. Sin tracking ni venta de datos.
            </p>
          </div>
        </div>

        <div className="alea-card p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Feather size={20} />
          </div>
          <div className="text-xs">
            <h4 className="font-bold text-[#202154]">Cero Mecánicas Adictivas</h4>
            <p className="text-slate-500 text-[11px]">
              Sin rachas diarias ni notificaciones invasivas. Solo el placer de leer.
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="pt-2 space-y-2">
        <button
          type="button"
          onClick={handleResetProfile}
          className="w-full py-3 px-4 rounded-full border border-indigo-200 bg-white hover:bg-indigo-50/50 text-[#343788] font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-sm"
        >
          <RotateCcw size={14} />
          <span>Repetir cuestionario de recomendación</span>
        </button>

        <button
          type="button"
          onClick={handleClearAll}
          className="w-full py-2.5 px-4 rounded-full text-rose-500 hover:bg-rose-50 font-bold text-[11px] transition-colors"
        >
          Borrar datos locales de este dispositivo
        </button>
      </div>

      {/* Edit Preferences Modal */}
      <EditPreferencesModal
        isOpen={showPreferencesModal}
        onClose={() => setShowPreferencesModal(false)}
        onSaved={loadData}
      />
    </div>
  );
}
