"use client";

import React, { useState } from "react";
import { useOnboardingStore } from "@/store/useOnboardingStore";
import { BrilloAvatar } from "@/components/BrilloAvatar";
import { X, Check, Sparkles } from "lucide-react";

interface EditPreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved?: () => void;
}

const OFFICIAL_WORLDS = [
  { id: "Bosques encantados", title: "Bosques encantados", icon: "🌲" },
  { id: "Castillos y secretos", title: "Castillos y secretos", icon: "🏰" },
  { id: "Mundos submarinos", title: "Mundos submarinos", icon: "🌊" },
  { id: "Planetas y galaxias", title: "Planetas y galaxias", icon: "🚀" },
  { id: "Islas y aventuras", title: "Islas y aventuras", icon: "🏝️" },
  { id: "Lugares como el nuestro", title: "Lugares como el nuestro", icon: "🏙️" },
];

const STORY_INTERESTS = [
  { id: "Resolver un misterio", label: "Resolver un misterio", icon: "🗺️" },
  { id: "Vivir una gran aventura", label: "Vivir una gran aventura", icon: "🏔️" },
  { id: "Reírme muchísimo", label: "Reírme muchísimo", icon: "☀️" },
  { id: "Encontrar algo inesperado", label: "Encontrar algo inesperado", icon: "🚪" },
  { id: "Conocer personajes extraordinarios", label: "Conocer personajes extraordinarios", icon: "🦊" },
  { id: "Superar un reto o un peligro", label: "Superar un reto o un peligro", icon: "🛡️" },
];

export function EditPreferencesModal({ isOpen, onClose, onSaved }: EditPreferencesModalProps) {
  const store = useOnboardingStore();
  const [localWorlds, setLocalWorlds] = useState<string[]>(store.worlds || []);
  const [localInterests, setLocalInterests] = useState<string[]>(store.interests || []);
  const [localMascotName, setLocalMascotName] = useState(store.mascotName || "Brillo");

  if (!isOpen) return null;

  const toggleWorld = (worldId: string) => {
    if (localWorlds.includes(worldId)) {
      setLocalWorlds(localWorlds.filter((w) => w !== worldId));
    } else {
      if (localWorlds.length < 3) {
        setLocalWorlds([...localWorlds, worldId]);
      }
    }
  };

  const toggleInterest = (interestId: string) => {
    if (localInterests.includes(interestId)) {
      setLocalInterests(localInterests.filter((i) => i !== interestId));
    } else {
      if (localInterests.length < 3) {
        setLocalInterests([...localInterests, interestId]);
      }
    }
  };

  const handleSave = () => {
    store.updatePreferences({
      worlds: localWorlds.length > 0 ? localWorlds : ["Bosques encantados"],
      interests: localInterests.length > 0 ? localInterests : ["Vivir una gran aventura"],
      mascotName: localMascotName.trim() || "Brillo",
    });
    if (onSaved) onSaved();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-3xl p-6 space-y-4 shadow-2xl border border-indigo-100 max-h-[90vh] overflow-y-auto relative animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100"
          aria-label="Cerrar modal"
        >
          <X size={18} />
        </button>

        <div className="flex items-center gap-3 pt-1">
          <BrilloAvatar size="sm" expression="curious" name={localMascotName} />
          <div>
            <h3 className="text-base font-black text-[#26245C]">
              Editar preferencias de lectura
            </h3>
            <p className="text-xs text-slate-500">
              Modifica tus mundos e intereses cuando quieras
            </p>
          </div>
        </div>

        {/* Mascot Name */}
        <div className="p-3 bg-indigo-50/60 rounded-2xl border border-indigo-100 space-y-1.5">
          <label className="text-xs font-bold text-[#30337E] block">
            Nombre de tu acompañante:
          </label>
          <input
            type="text"
            value={localMascotName}
            onChange={(e) => setLocalMascotName(e.target.value)}
            className="w-full px-3 py-2 bg-white border border-indigo-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            placeholder="Brillo"
            maxLength={20}
          />
        </div>

        {/* Worlds Selection */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#30337E] uppercase tracking-wider">
              Tus Mundos favoritos ({localWorlds.length}/3)
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {OFFICIAL_WORLDS.map((w) => {
              const isSelected = localWorlds.includes(w.id);
              const isMax = localWorlds.length >= 3 && !isSelected;

              return (
                <button
                  key={w.id}
                  type="button"
                  disabled={isMax}
                  onClick={() => toggleWorld(w.id)}
                  className={`p-2.5 rounded-2xl text-left border transition-all flex items-center justify-between text-xs font-bold ${
                    isSelected
                      ? "bg-indigo-50 border-indigo-600 text-indigo-950 ring-1 ring-indigo-500"
                      : isMax
                      ? "opacity-40 cursor-not-allowed bg-slate-50 border-slate-200 text-slate-400"
                      : "bg-white border-slate-200 text-slate-700 hover:border-indigo-300"
                  }`}
                >
                  <span className="flex items-center gap-1.5 truncate">
                    <span>{w.icon}</span>
                    <span className="truncate">{w.title}</span>
                  </span>
                  {isSelected && <Check size={14} className="text-indigo-600 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Story Interests */}
        <div className="space-y-2">
          <span className="text-xs font-bold text-[#30337E] uppercase tracking-wider block">
            Qué buscas en las historias ({localInterests.length}/3)
          </span>

          <div className="grid grid-cols-2 gap-2">
            {STORY_INTERESTS.map((item) => {
              const isSelected = localInterests.includes(item.id);
              const isMax = localInterests.length >= 3 && !isSelected;

              return (
                <button
                  key={item.id}
                  type="button"
                  disabled={isMax}
                  onClick={() => toggleInterest(item.id)}
                  className={`p-2 rounded-2xl text-left border transition-all flex items-center justify-between text-[11px] font-bold ${
                    isSelected
                      ? "bg-indigo-50 border-indigo-600 text-indigo-950 ring-1 ring-indigo-500"
                      : isMax
                      ? "opacity-40 cursor-not-allowed bg-slate-50 border-slate-200 text-slate-400"
                      : "bg-white border-slate-200 text-slate-700 hover:border-indigo-300"
                  }`}
                >
                  <span className="flex items-center gap-1.5 truncate">
                    <span>{item.icon}</span>
                    <span className="truncate">{item.label}</span>
                  </span>
                  {isSelected && <Check size={13} className="text-indigo-600 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="pt-2 flex gap-2">
          <button
            type="button"
            onClick={onClose}
            className="w-1/2 py-2.5 rounded-full border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="w-1/2 py-2.5 rounded-full bg-[#4F46E5] hover:bg-indigo-700 text-white font-bold text-xs shadow-magical transition-colors flex items-center justify-center gap-1.5"
          >
            <Sparkles size={14} />
            <span>Guardar cambios</span>
          </button>
        </div>
      </div>
    </div>
  );
}
