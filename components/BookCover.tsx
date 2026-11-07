"use client";

import React from "react";
import { BookCover3D } from "./BookCover3D";

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
}: BookCoverProps) {
  return (
    <BookCover3D
      title={title}
      author={author}
      coverUrl={coverUrl}
      color={color}
      size={size}
      className={className}
      enableTilt={true}
    />
  );
}
