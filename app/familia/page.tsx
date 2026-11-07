"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useOnboardingStore, UserProfile } from "@/store/useOnboardingStore";
import { useLibraryStore } from "@/store/useLibraryStore";
import { SPANISH_LIBRARY_NETWORKS, getAllSupportedRegions } from "@/lib/libraryCatalogRouter";
import {
  Shield,
  Download,
  Trash2,
  RotateCcw,
  BookOpen,
  MapPin,
  Check,
  ArrowLeft,
} from "lucide-react";

const STORAGE_REGION_KEY = "alea_preferred_library_region";

export default function FamiliaPage() {
  const router = useRouter();
  const store = useOnboardingStore();
  const { library, favorites, clearLibrary } = useLibraryStore();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<string>("nacional_ccb");
  const [copiedExport, setCopiedExport] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [showClearAllModal, setShowClearAllModal] = useState(false);

  useEffect(() => {
    try {
      const savedProfile = localStorage.getItem("alea_user_profile");
      if (savedProfile) {
        setProfile(JSON.parse(savedProfile));
      } else {
        setProfile({
          nickname: store.nickname || "Lector",
          mascotName: store.mascotName || "Chispa",
          age: store.age || "10",
          worlds: store.worlds || [],
          interests: store.interests || [],
          protagonists: store.protagonists || [],
          rhythm: store.rhythm || "Equilibrado",
          formats: store.formats || [],
          readingHabit: store.readingHabit || "Lector habitual",
          isGuest: store.isGuest,
        });
      }

      const savedRegion = localStorage.getItem(STORAGE_REGION_KEY);
      if (savedRegion && SPANISH_LIBRARY_NETWORKS[savedRegion]) {
        setSelectedRegion(savedRegion);
      }
    } catch (e) {
      console.warn("Error leyendo datos familiares:", e);
    }
  }, [store]);

  const handleRegionChange = (newRegion: string) => {
    setSelectedRegion(newRegion);
    try {
      localStorage.setItem(STORAGE_REGION_KEY, newRegion);
    } catch {}
  };

  const handleExportData = () => {
    try {
      const exportObject = {
        app: "ALEA Libros",
        version: "2.0.0",
        exportedAt: new Date().toISOString(),
        profile: profile || store,
        library,
        favorites,
      };
      const jsonString = JSON.stringify(exportObject, null, 2);
      const blob = new Blob([jsonString], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `alea-lecturas-${profile?.nickname || "lector"}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setCopiedExport(true);
      setTimeout(() => setCopiedExport(false), 3000);
    } catch (e) {
      console.error("Error al exportar:", e);
    }
  };

  const handleConfirmRecalibrate = () => {
    store.resetOnboarding();
    setShowResetModal(false);
    router.push("/onboarding");
  };

  const handleConfirmClearAll = () => {
    try {
      localStorage.clear();
      store.resetOnboarding();
      clearLibrary();
      setShowClearAllModal(false);
      window.location.href = "/onboarding";
    } catch {
      window.location.href = "/onboarding";
    }
  };

  const allRegions = getAllSupportedRegions();
  const activeRegion = SPANISH_LIBRARY_NETWORKS[selectedRegion] || SPANISH_LIBRARY_NETWORKS["nacional_ccb"];

  return (
    <div className="flex-1 flex flex-col p-4 md:p-7 space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <Link
            href="/universo"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            <ArrowLeft size={14} />
            <span>Volver a Mi Universo</span>
          </Link>
          <h1 className="text-2xl font-black text-[#26245C] tracking-tight">
            Área Familia & Controles de Confianza
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Supervisión respetuosa, privacidad infantil total y configuración de biblioteca
          </p>
        </div>

        <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 shadow-sm shrink-0">
          <Shield size={20} />
        </div>
      </div>

      {/* Compromisos de Seguridad Ética (AEPD / COPPA) */}
      <div className="alea-card p-5 bg-gradient-to-r from-emerald-50/60 via-white to-indigo-50/40 border border-emerald-100 space-y-3">
        <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs uppercase tracking-wider">
          <Shield size={16} className="text-emerald-600" />
          <span>Garantías Éticas Fundamentales</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-600">
          <div className="p-3 bg-white/80 rounded-2xl border border-emerald-100/70">
            <h4 className="font-bold text-[#202154] mb-1">Sin Rastreo Ni Cuentas</h4>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              No solicitamos correos, contraseñas ni tarjetas bancarias. Los datos residen únicamente en este navegador.
            </p>
          </div>
          <div className="p-3 bg-white/80 rounded-2xl border border-emerald-100/70">
            <h4 className="font-bold text-[#202154] mb-1">Cero Mecánicas Adictivas</h4>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Sin rachas diarias, notificaciones invasivas ni penalizaciones por no entrar. Prescribimos libros en papel.
            </p>
          </div>
          <div className="p-3 bg-white/80 rounded-2xl border border-emerald-100/70">
            <h4 className="font-bold text-[#202154] mb-1">Coste Cero Absoluto</h4>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              ALEA conecta exclusivamente con bibliotecas públicas gratuitas y librerías de barrio sin costes ocultos.
            </p>
          </div>
        </div>
      </div>

      {/* Resumen del Perfil Activo */}
      <div className="alea-card p-5 space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#30337E] flex items-center gap-1.5">
          <BookOpen size={14} className="text-indigo-600" />
          <span>Perfil Lector Activo</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
            <span className="text-[10px] text-slate-400 font-bold block uppercase">Nombre / Apodo</span>
            <span className="text-sm font-black text-[#26245C]">{profile?.nickname || "Lector"}</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
            <span className="text-[10px] text-slate-400 font-bold block uppercase">Edad Declarada</span>
            <span className="text-sm font-black text-[#26245C]">{profile?.age || "10"} años</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
            <span className="text-[10px] text-slate-400 font-bold block uppercase">Mascota Guía</span>
            <span className="text-sm font-black text-[#26245C]">{profile?.mascotName || "Chispa"}</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
            <span className="text-[10px] text-slate-400 font-bold block uppercase">Libros Guardados</span>
            <span className="text-sm font-black text-indigo-600">{Object.keys(library).length} obras</span>
          </div>
        </div>
      </div>

      {/* Red de Biblioteca Familiar Preferida */}
      <div className="alea-card p-5 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#30337E] flex items-center gap-1.5">
            <MapPin size={14} className="text-indigo-600" />
            <span>Biblioteca Pública Familiar de Referencia</span>
          </h3>
          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
            Activa
          </span>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          Esta red será utilizada por defecto cuando el niño o la familia pulse en <em>&quot;Pedir en biblioteca&quot;</em> para consultar ejemplares físicos.
        </p>

        <div className="max-w-md">
          <select
            value={selectedRegion}
            onChange={(e) => handleRegionChange(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-white border border-indigo-200 rounded-2xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 shadow-sm"
          >
            {allRegions.map((reg) => (
              <option key={reg.id} value={reg.id}>
                {reg.name} ({reg.networkName})
              </option>
            ))}
          </select>
        </div>

        <div className="p-3 bg-[#F4F5FD] rounded-xl border border-indigo-100 text-[11px] text-slate-600">
          <strong>Enlace activo:</strong> {activeRegion.networkName}. Al consultar cualquier libro, se copiará el ISBN automáticamente para facilitar la búsqueda en su portal.
        </div>
      </div>

      {/* Exportación y Portabilidad de Datos */}
      <div className="alea-card p-5 space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#30337E] flex items-center gap-1.5">
          <Download size={14} className="text-indigo-600" />
          <span>Portabilidad de Datos (Derecho RGPD)</span>
        </h3>
        <p className="text-xs text-slate-600 leading-relaxed">
          Puedes descargar en un archivo JSON todos los libros guardados, valoraciones y preferencias de lectura de tu hijo/a para guardarlos o usarlos donde quieras.
        </p>
        <button
          type="button"
          onClick={handleExportData}
          className="py-2.5 px-4 rounded-xl bg-white hover:bg-slate-50 border border-indigo-200 text-[#30337E] font-bold text-xs flex items-center gap-2 shadow-sm transition-all"
        >
          {copiedExport ? <Check size={14} className="text-emerald-600" /> : <Download size={14} />}
          <span>{copiedExport ? "¡Archivo descargado con éxito!" : "Exportar historial de lecturas (JSON)"}</span>
        </button>
      </div>

      {/* ZONA DE CONTROL Y RESTABLECIMIENTO AMIGABLE */}
      <div className="alea-card p-5 border-rose-100 bg-rose-50/20 space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-rose-800 flex items-center gap-1.5">
          <Trash2 size={14} className="text-rose-600" />
          <span>Gestión de Datos y Calibración</span>
        </h3>
        <p className="text-xs text-slate-600 leading-relaxed">
          Opciones seguras con explicaciones claras sin mensajes crípticos del navegador.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 pt-1">
          <button
            type="button"
            onClick={() => setShowResetModal(true)}
            className="py-2.5 px-4 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
          >
            <RotateCcw size={14} className="text-indigo-600" />
            <span>Repetir cuestionario (Mantiene libros guardados)</span>
          </button>

          <button
            type="button"
            onClick={() => setShowClearAllModal(true)}
            className="py-2.5 px-4 rounded-xl bg-white hover:bg-rose-50 border border-rose-200 text-rose-600 font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
          >
            <Trash2 size={14} className="text-rose-500" />
            <span>Restablecer todo a cero</span>
          </button>
        </div>
      </div>

      {/* MODAL AMIGABLE 1: REPETIR CUESTIONARIO */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-3xl p-6 space-y-4 shadow-2xl border border-indigo-100 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
              <RotateCcw size={22} />
            </div>
            <div className="text-center space-y-1">
              <h3 className="text-base font-black text-[#26245C]">
                ¿Recalibrar gustos lectores?
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Volverás a realizar las preguntas de mundos y temas. <strong>Tus libros guardados en la biblioteca y tus valoraciones NO se borrarán.</strong>
              </p>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowResetModal(false)}
                className="flex-1 py-2.5 rounded-full border border-slate-200 font-bold text-xs text-slate-600 hover:bg-slate-50"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmRecalibrate}
                className="flex-1 py-2.5 rounded-full bg-indigo-600 hover:bg-indigo-700 font-bold text-xs text-white shadow-magical"
              >
                Sí, recalibrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL AMIGABLE 2: BORRAR TODO */}
      {showClearAllModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-3xl p-6 space-y-4 shadow-2xl border border-rose-100 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 size={22} />
            </div>
            <div className="text-center space-y-1">
              <h3 className="text-base font-black text-[#26245C]">
                ¿Restablecer ALEA por completo?
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Esta acción eliminará todos los libros de la estantería, las opiniones y el perfil en este navegador. Volverás al inicio como usuario nuevo.
              </p>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowClearAllModal(false)}
                className="flex-1 py-2.5 rounded-full border border-slate-200 font-bold text-xs text-slate-600 hover:bg-slate-50"
              >
                Volver atrás
              </button>
              <button
                type="button"
                onClick={handleConfirmClearAll}
                className="flex-1 py-2.5 rounded-full bg-rose-600 hover:bg-rose-700 font-bold text-xs text-white shadow-sm"
              >
                Borrar todo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
