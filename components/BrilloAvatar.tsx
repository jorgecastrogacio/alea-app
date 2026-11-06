"use client";

import React from "react";
import Image from "next/image";

interface BrilloAvatarProps {
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  expression?: "happy" | "curious" | "reading" | "celebrating" | "standing";
  showSparkles?: boolean;
  className?: string;
  name?: string;
}

export function BrilloAvatar({
  size = "md",
  expression = "happy",
  showSparkles = true,
  className = "",
  name = "Brillo",
}: BrilloAvatarProps) {
  const sizeClasses = {
    xs: "w-8 h-8 text-xs",
    sm: "w-11 h-11 text-sm",
    md: "w-16 h-16 text-base",
    lg: "w-24 h-24 text-lg",
    xl: "w-32 h-32 sm:w-36 sm:h-36 text-xl",
  };

  const imageMap: Record<string, string> = {
    happy: "/assets/mascot/mascot_flying.jpg",
    curious: "/assets/mascot/mascot_standing.jpg",
    reading: "/assets/mascot/mascot_reading.jpg",
    celebrating: "/assets/mascot/mascot_celebrate.jpg",
    standing: "/assets/mascot/mascot_standing.jpg",
  };

  const imageSrc = imageMap[expression] || "/assets/mascot/mascot_flying.jpg";

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      {/* Ambient Pulsing Glow */}
      <div
        className="absolute inset-0 rounded-full bg-gradient-to-tr from-amber-400 via-rose-300 to-indigo-400 blur-md opacity-40 animate-pulse pointer-events-none"
      />

      {/* Main Avatar Bubble */}
      <div
        className={`relative ${sizeClasses[size]} rounded-full overflow-hidden border-2 border-amber-300/80 shadow-lg shadow-amber-500/20 bg-gradient-to-b from-amber-100 to-orange-100 flex items-center justify-center transition-transform hover:scale-105`}
      >
        <Image
          src={imageSrc}
          alt={name}
          fill
          className="object-cover scale-110"
          sizes="150px"
          priority
        />
      </div>

      {/* Floating Sparkles for Magic Aura */}
      {showSparkles && (size === "lg" || size === "xl") && (
        <>
          <span className="absolute -top-1 -right-1 text-amber-400 text-lg animate-bounce select-none">
            ✨
          </span>
          <span className="absolute -bottom-1 -left-1 text-rose-400 text-sm animate-pulse select-none delay-150">
            🌟
          </span>
        </>
      )}
    </div>
  );
}
