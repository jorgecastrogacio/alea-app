"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { BookOpen } from "lucide-react";
import { sounds } from "@/lib/soundEffects";

interface BookCover3DProps {
  title: string;
  author: string;
  coverUrl?: string;
  color?: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  enableTilt?: boolean;
}

export function BookCover3D({
  title,
  author,
  coverUrl,
  color = "#3b82f6",
  size = "md",
  className = "",
  enableTilt = true,
}: BookCover3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glarePosition, setGlarePosition] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);

  const sizeClasses = {
    sm: "w-24 h-36 text-[10px]",
    md: "w-36 h-52 text-xs",
    lg: "w-48 h-72 text-sm",
    xl: "w-60 h-88 text-base",
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!enableTilt || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotX = -((y - centerY) / centerY) * 12; // Inclinación vertical
    const rotY = ((x - centerX) / centerX) * 14;  // Inclinación horizontal

    setRotateX(rotX);
    setRotateY(rotY);
    setGlarePosition({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
    });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    sounds.playPageTurn();
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative select-none shrink-0 cursor-pointer ${sizeClasses[size]} ${className}`}
      style={{
        perspective: "1000px",
      }}
    >
      {/* Sombra 3D Dinámica sobre la mesa/estantería */}
      <div
        className="absolute inset-x-2 -bottom-3 h-5 bg-black/30 rounded-full blur-md transition-all duration-300"
        style={{
          transform: isHovered
            ? `scale(1.1) translateY(4px) rotate(${rotateY * 0.4}deg)`
            : "scale(0.95)",
          opacity: isHovered ? 0.45 : 0.25,
        }}
      />

      {/* Contenedor del Libro con Física 3D */}
      <div
        className="w-full h-full relative rounded-r-xl rounded-l-sm overflow-hidden transition-transform duration-200 ease-out"
        style={{
          transformStyle: "preserve-3d",
          transform: isHovered
            ? `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.04)`
            : "rotateX(0deg) rotateY(0deg) scale(1)",
          backgroundColor: color,
          boxShadow: isHovered
            ? "-12px 16px 28px -6px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1) inset"
            : "-6px 8px 16px -4px rgba(0, 0, 0, 0.25)",
        }}
      >
        {/* Efecto de Grosor de Páginas (Corte Derecho) */}
        <div className="absolute top-1 bottom-1 right-0 w-1.5 bg-gradient-to-r from-slate-200 via-amber-50 to-slate-300 shadow-inner z-20 pointer-events-none" />

        {/* Efecto de Lomo Físico con hendidura y sombras */}
        <div className="absolute top-0 bottom-0 left-0 w-3 bg-gradient-to-r from-black/50 via-black/20 to-transparent z-20 pointer-events-none" />
        <div className="absolute top-0 bottom-0 left-2.5 w-[1px] bg-white/30 z-20 pointer-events-none" />

        {/* Portada Real o Fallback de Lujo */}
        {coverUrl && !imageError ? (
          <img
            src={coverUrl}
            alt={`Carátula de referencia de la edición física: ${title}, por ${author}`}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover rounded-r-xl"
            loading="lazy"
          />
        ) : (
          <div
            className="w-full h-full p-4 flex flex-col justify-between text-white relative z-10"
            style={{
              background: `linear-gradient(135deg, ${color}ee 0%, ${color} 100%)`,
            }}
          >
            {/* Marco dorado editorial */}
            <div className="absolute inset-2 border border-white/25 rounded-lg pointer-events-none" />

            <div className="pt-2 relative z-10">
              <span className="text-[9px] tracking-widest uppercase font-bold text-amber-200 block">
                ✦ ALEA LIBROS ✦
              </span>
              <h3 className="font-black leading-tight mt-1 line-clamp-3 text-white drop-shadow-md">
                {title}
              </h3>
            </div>

            <div className="my-auto self-center opacity-30 relative z-10">
              <BookOpen size={size === "sm" ? 28 : size === "md" ? 40 : 52} />
            </div>

            <div className="border-t border-white/20 pt-2 pb-1 relative z-10">
              <p className="text-[10px] text-white/95 font-bold line-clamp-1">
                {author}
              </p>
            </div>
          </div>
        )}

        {/* Brillo Especular de Barniz Dinámico (Sigue el ángulo de la luz) */}
        {isHovered && (
          <div
            className="absolute inset-0 z-30 pointer-events-none transition-opacity duration-200"
            style={{
              background: `radial-gradient(circle at ${glarePosition.x}% ${glarePosition.y}%, rgba(255, 255, 255, 0.45) 0%, rgba(255, 255, 255, 0) 65%)`,
              mixBlendMode: "overlay",
            }}
          />
        )}
      </div>
    </div>
  );
}
