"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { UserProfile, useOnboardingStore } from "@/store/useOnboardingStore";
import { useLibraryStore } from "@/store/useLibraryStore";
import {
  Sparkles,
  Shield,
  Heart,
  BookOpen,
  RotateCcw,
  Library,
  Feather,
  Trophy,
} from "lucide-react";

export default function UniversoPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [mounted, setMounted] = useState(false);

  const { library, loadLibrary } = useLibraryStore();
  const { resetOnboarding } = useOnboardingStore();

  useEffect(() => {
    setMounted(true);
    loadLibrary();
    try {
      const saved = localStorage.getItem("alea_user_profile");
      if (saved) {
        setProfile(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Error reading profile:", e);
    }
  }, [loadLibrary]);

  const libraryCount = Object.keys(library).length;
  const readingCount = Object.values(library).filter((v) => v === "reading").length;
  const finishedCount = Object.values(library).filter((v) => v === "finished").length;

  const handleResetProfile = () => {
    if (confirm("¿Quieres repetir el test para recalibrar tus preferencias de lectura?")) {
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

  const nickname = profile?.nickname || "Daniela";
  const age = profile?.age || "11";

  return (
    <div className="flex-1 flex flex-col p-4 md:p-7 space-y-6">
      {/* Header */}
      <div>
        <span className="text-[11px] font-bold tracking-widest text-[#474AB6] uppercase">
          Perfil & Logros Serenos
        </span>
        <h1 className="text-2xl font-black text-[#26245C] tracking-tight">
          Mi Universo Lector
        </h1>
      </div>

      {/* User Hero Card */}
      <div className="rounded-3xl p-6 bg-gradient-to-br from-[#4F46E5] via-[#4338CA] to-[#312E81] text-white shadow-magical relative overflow-hidden">
        <div className="flex items-center gap-4 relative z-10">
          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white/60 shadow-md shrink-0">
            <img
              src="/assets/avatar_daniela.jpg"
              alt="Avatar Daniela"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/assets/mascot/banner_mascot.jpg";
              }}
            />
          </div>
          <div>
            <span className="text-[11px] font-bold text-indigo-200 uppercase tracking-wider block">
              {age} años
            </span>
            <h2 className="text-xl font-black text-white">
              {nickname}
            </h2>
            <p className="text-xs text-indigo-200 mt-0.5">
              Lector/a en el universo mágico de ALEA
            </p>
          </div>
        </div>

        {/* Peaceful Reading Stats (No Streaks, Zero Toxic Gamification) */}
        <div className="grid grid-cols-3 gap-2 mt-5 pt-4 border-t border-white/15 text-center relative z-10">
          <div className="bg-white/10 rounded-2xl p-2.5">
            <span className="text-xl font-black block">{libraryCount}</span>
            <span className="text-[10px] text-indigo-200 font-medium">En estantería</span>
          </div>
          <div className="bg-white/10 rounded-2xl p-2.5">
            <span className="text-xl font-black block">{readingCount}</span>
            <span className="text-[10px] text-indigo-200 font-medium">Leyendo</span>
          </div>
          <div className="bg-white/10 rounded-2xl p-2.5">
            <span className="text-xl font-black block">{finishedCount}</span>
            <span className="text-[10px] text-indigo-200 font-medium">Leídos</span>
          </div>
        </div>
      </div>

      {/* Mis Logros Serenos (Insignias de amor a la lectura, no de adicción) */}
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
    </div>
  );
}
