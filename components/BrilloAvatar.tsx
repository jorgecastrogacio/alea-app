"use client";

import React from "react";
import { LivingMascot } from "./LivingMascot";

interface BrilloAvatarProps {
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  expression?: "happy" | "curious" | "reading" | "celebrating" | "standing" | "idle";
  showSparkles?: boolean;
  className?: string;
  name?: string;
  speechText?: string;
}

export function BrilloAvatar({
  size = "md",
  expression = "happy",
  className = "",
  name = "Chispa",
  speechText,
}: BrilloAvatarProps) {
  // Map expression to LivingMascot mood
  const moodMap: Record<string, "idle" | "happy" | "reading" | "celebrating" | "curious"> = {
    happy: "happy",
    curious: "curious",
    reading: "reading",
    celebrating: "celebrating",
    standing: "happy",
    idle: "idle",
  };

  const livingSize: "sm" | "md" | "lg" | "xl" =
    size === "xs" ? "sm" : size === "sm" ? "sm" : size === "md" ? "md" : size === "lg" ? "lg" : "xl";

  return (
    <LivingMascot
      size={livingSize}
      mood={moodMap[expression] || "idle"}
      name={name}
      className={className}
      speechText={speechText}
      enableInteraction={true}
    />
  );
}
