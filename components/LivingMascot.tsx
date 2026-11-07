"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { sounds } from "@/lib/soundEffects";

interface LivingMascotProps {
  size?: "sm" | "md" | "lg" | "xl";
  mood?: "idle" | "happy" | "reading" | "celebrating" | "curious";
  name?: string;
  className?: string;
  speechText?: string;
  enableInteraction?: boolean;
}

const PLAYFUL_PHRASES = [
  "¡Me encanta curiosear historias contigo!",
  "¡Toca las portadas para verlas en 3D!",
  "¿Sabías que puedes pedir este libro gratis en tu biblioteca?",
  "¡Hoy es un día genial para sumergirse en una aventura!",
  "¡Cada libro leído hace crecer tus alas de lectura!",
  "¡Abre tu imaginación, no hay límites!",
];

export function LivingMascot({
  size = "md",
  mood = "idle",
  name = "Chispa",
  className = "",
  speechText,
  enableInteraction = true,
}: LivingMascotProps) {
  const [activeMood, setActiveMood] = useState(mood);
  const [bubbleText, setBubbleText] = useState<string | null>(speechText || null);
  const [isBouncing, setIsBouncing] = useState(false);
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    setActiveMood(mood);
  }, [mood]);

  useEffect(() => {
    if (speechText) {
      setBubbleText(speechText);
    }
  }, [speechText]);

  // Dimensiones
  const sizeMap = {
    sm: "w-14 h-14",
    md: "w-20 h-20",
    lg: "w-28 h-28 sm:w-32 sm:h-32",
    xl: "w-36 h-36 sm:w-44 sm:h-44",
  };

  const imageMap: Record<string, string> = {
    idle: "/assets/mascot/mascot_flying.jpg",
    happy: "/assets/mascot/mascot_standing.jpg",
    reading: "/assets/mascot/mascot_reading.jpg",
    celebrating: "/assets/mascot/mascot_celebrate.jpg",
    curious: "/assets/mascot/mascot_hugging.jpg",
  };

  const currentImage = imageMap[activeMood] || "/assets/mascot/mascot_flying.jpg";

  const handleMascotTap = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!enableInteraction) return;

    sounds.playChime();
    setIsBouncing(true);
    setRotation((prev) => (prev === 0 ? 12 : prev === 12 ? -12 : 0));

    // Cambiar a frase aleatoria
    const randomPhrase = PLAYFUL_PHRASES[Math.floor(Math.random() * PLAYFUL_PHRASES.length)];
    setBubbleText(randomPhrase);

    setTimeout(() => {
      setIsBouncing(false);
    }, 450);

    // Autoocultar bocadillo tras 4 segundos
    setTimeout(() => {
      if (!speechText) {
        setBubbleText(null);
      }
    }, 4200);
  };

  return (
    <div className={`relative inline-flex items-center justify-center select-none ${className}`}>
      {/* Bocadillo de Diálogo Dinámico (Speech Bubble) */}
      {bubbleText && (
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-48 sm:w-56 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-2xl shadow-xl border border-indigo-100 text-center text-xs font-bold text-[#202154] z-30 animate-in fade-in zoom-in-90 duration-200">
          <p className="leading-snug">{bubbleText}</p>
          {/* Triangulito del bocadillo */}
          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-r border-b border-indigo-100 rotate-45" />
        </div>
      )}

      {/* Halo Pulsante Ambiental de Magia */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-amber-400 via-rose-300 to-indigo-400 blur-lg opacity-40 animate-pulse pointer-events-none" />

      {/* Partículas Estelares Orbitantes */}
      <span className="absolute -top-1.5 -right-1.5 text-amber-400 text-sm animate-bounce pointer-events-none">
        ✨
      </span>
      <span className="absolute -bottom-1 -left-1 text-rose-400 text-xs animate-ping pointer-events-none delay-300">
        🌟
      </span>

      {/* Cuerpo Principal Interactivo con Física Flotante */}
      <button
        type="button"
        onClick={handleMascotTap}
        aria-label={`Interactuar con ${name}`}
        className={`relative ${sizeMap[size]} rounded-full overflow-hidden border-2 border-amber-300/90 shadow-xl shadow-amber-500/25 bg-gradient-to-b from-amber-100 to-orange-100 flex items-center justify-center cursor-pointer transition-all duration-300 active:scale-95 group ${
          isBouncing ? "scale-110" : "hover:scale-105"
        }`}
        style={{
          transform: `rotate(${rotation}deg)`,
          animation: "mascotFloat 3.2s ease-in-out infinite",
        }}
      >
        <Image
          src={currentImage}
          alt={name}
          fill
          className="object-cover scale-110 transition-transform duration-300 group-hover:scale-115"
          sizes="180px"
          priority
        />

        {/* Reflejo de cristal de la burbuja */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/35 via-transparent to-black/10 pointer-events-none" />
      </button>

      <style jsx global>{`
        @keyframes mascotFloat {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-7px) rotate(2deg);
          }
        }
      `}</style>
    </div>
  );
}
