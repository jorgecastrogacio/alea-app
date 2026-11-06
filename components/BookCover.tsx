"use client";

import { useState } from "react";
import Image from "next/image";
import { BookOpen } from "lucide-react";

interface BookCoverProps {
  title: string;
  author: string;
  coverUrl?: string;
  color?: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  showSpineEffect?: boolean;
}

export default function BookCover({
  title,
  author,
  coverUrl,
  color = "#2563eb",
  size = "md",
  className = "",
  showSpineEffect = true,
}: BookCoverProps) {
  const [imageError, setImageError] = useState(false);

  // Dimension presets
  const sizeClasses = {
    sm: "w-20 h-28 text-[9px]",
    md: "w-32 h-44 text-xs",
    lg: "w-44 h-64 text-sm",
    xl: "w-56 h-80 text-base",
  };

  return (
    <div
      className={`relative rounded-r-lg rounded-l-sm overflow-hidden select-none shrink-0 transition-transform duration-300 ${
        showSpineEffect ? "book-spine-shadow" : ""
      } ${sizeClasses[size]} ${className}`}
      style={{ backgroundColor: color }}
    >
      {/* Book spine line overlay simulation */}
      <div className="absolute top-0 bottom-0 left-0 w-2.5 bg-gradient-to-r from-black/40 via-black/15 to-transparent z-10 pointer-events-none" />
      <div className="absolute top-0 bottom-0 left-2 w-[1px] bg-white/20 z-10 pointer-events-none" />

      {coverUrl && !imageError ? (
        <img
          src={coverUrl}
          alt={`Portada de ${title}`}
          loading="lazy"
          onError={() => setImageError(true)}
          className="w-full h-full object-cover rounded-r-lg"
        />
      ) : (
        /* Fallback: editorial mockup cover with rich gradient */
        <div
          className="w-full h-full p-3 flex flex-col justify-between text-white relative z-0"
          style={{
            background: `linear-gradient(145deg, ${color}dd 0%, ${color} 100%)`,
          }}
        >
          <div className="pt-2">
            <span className="text-[10px] tracking-widest uppercase font-semibold text-white/80 block line-clamp-1">
              ALEA LIBROS
            </span>
            <h3 className="font-bold leading-tight mt-1 line-clamp-3 text-white drop-shadow-sm">
              {title}
            </h3>
          </div>

          <div className="my-auto self-center opacity-30">
            <BookOpen size={size === "sm" ? 24 : 36} />
          </div>

          <div className="border-t border-white/20 pt-1.5 pb-1">
            <p className="text-[10px] text-white/90 font-medium line-clamp-1">
              {author}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
