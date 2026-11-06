"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BrilloAvatar } from "@/components/BrilloAvatar";
import {
  Sparkles,
  ArrowRight,
  Library,
  Shield,
  Compass,
} from "lucide-react";

export default function HomePage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("alea_user_profile");
      if (saved) {
        router.replace("/descubre");
        return;
      }
    } catch (e) {
      console.error(e);
    }
    setChecking(false);
  }, [router]);

  if (checking) {
    return (
      <div className="flex-1 flex items-center justify-center p-8 text-indigo-400">
        Iniciando ALEA...
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col justify-between p-6 bg-gradient-to-b from-[#E7EAFB] via-[#F4F4FD] to-[#ECEBFA] text-slate-800">
      {/* Top Brand with Luminous Mascot (HITO 2 & HITO 6, Bug #14) */}
      <div className="pt-6 text-center space-y-4">
        <BrilloAvatar size="xl" expression="celebrating" name="Brillo" className="mx-auto" />

        <div>
          <span className="text-[11px] font-bold tracking-widest text-[#474AB6] uppercase">
            Literatura Infantil y Juvenil · 7 a 16 años
          </span>
          <h1 className="text-3xl font-black text-[#26245C] tracking-tight mt-1">
            ALEA <span className="text-indigo-500 font-bold text-xl">✦</span>
          </h1>
          <p className="text-sm font-bold text-indigo-900 mt-2 max-w-xs mx-auto leading-relaxed">
            Descubre tu próxima gran historia
          </p>
          <p className="text-xs text-slate-600 mt-1 max-w-xs mx-auto leading-relaxed">
            Recomendaciones de libros físicos en papel, sin pantallas adictivas ni publicidad.
          </p>
        </div>
      </div>

      {/* Feature Highlights with Lavender Cards */}
      <div className="space-y-3 py-6">
        <div className="alea-card p-4 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-[#ECEEFC] text-[#474AB6] flex items-center justify-center shrink-0">
            <Sparkles size={20} />
          </div>
          <div>
            <h2 className="text-xs font-bold text-[#202154]">Recomendaciones Transparentes</h2>
            <p className="text-[11px] text-slate-500">
              Te explicamos con palabras claras por qué cada libro encaja contigo.
            </p>
          </div>
        </div>

        <div className="alea-card p-4 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Library size={20} />
          </div>
          <div>
            <h2 className="text-xs font-bold text-[#202154]">Gratis en tu Biblioteca Pública</h2>
            <p className="text-[11px] text-slate-500">
              Encuentra el ISBN de cada libro para pedirlo en préstamo en tu barrio.
            </p>
          </div>
        </div>

        <div className="alea-card p-4 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <Shield size={20} />
          </div>
          <div>
            <h2 className="text-xs font-bold text-[#202154]">Privacidad y Calma Absoluta</h2>
            <p className="text-[11px] text-slate-500">
              Sin correos ni contraseñas. Sin rachas ni mecánicas de enganche tóxico.
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3 pt-2">
        <Link
          href="/onboarding"
          className="w-full py-4 px-6 rounded-full font-black text-sm bg-gradient-to-r from-[#4F46E5] to-[#6366F1] hover:from-[#4338CA] hover:to-[#4F46E5] text-white flex items-center justify-center gap-2 shadow-magical transition-all active:scale-[0.98]"
        >
          <span>Comenzar mi Universo Lector</span>
          <ArrowRight size={18} />
        </Link>

        <Link
          href="/descubre"
          className="w-full py-3 px-6 rounded-full font-bold text-xs text-[#30337E] hover:bg-white/80 flex items-center justify-center gap-1.5 transition-colors border border-indigo-100"
        >
          <span>Entrar directamente al catálogo</span>
          <Compass size={14} />
        </Link>
      </div>
    </div>
  );
}
