"use client";

import React from "react";
import Link from "next/link";
import { LivingMascot } from "@/components/LivingMascot";
import { Compass, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-gradient-to-b from-[#EAEBF9] via-[#F4F5FD] to-[#E9EAF8] text-slate-800">
      <div className="w-full max-w-md bg-white/95 rounded-3xl p-6 sm:p-8 text-center space-y-5 shadow-2xl border border-indigo-100">
        <div className="flex justify-center">
          <LivingMascot
            size="lg"
            mood="curious"
            name="Chispa"
            speechText="¡Vaya! Este rincón de la estantería aún no existe..."
            enableInteraction={true}
          />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest bg-indigo-50 px-3 py-1 rounded-full">
            Página no encontrada (404)
          </span>
          <h1 className="text-2xl font-black text-[#26245C]">
            ¿Te has perdido explorando?
          </h1>
          <p className="text-xs text-slate-600 leading-relaxed max-w-xs mx-auto">
            No te preocupes, en el universo de las historias siempre hay un camino de vuelta a tus libros favoritos.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row gap-2.5 justify-center">
          <Link
            href="/descubre"
            className="py-3 px-5 rounded-full bg-[#4F46E5] hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-magical transition-all"
          >
            <Home size={15} />
            <span>Volver al Inicio</span>
          </Link>
          <Link
            href="/explora"
            className="py-3 px-5 rounded-full bg-indigo-50 hover:bg-indigo-100 text-[#30337E] font-bold text-xs flex items-center justify-center gap-2 transition-all border border-indigo-100"
          >
            <Compass size={15} />
            <span>Explorar Catálogo</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
