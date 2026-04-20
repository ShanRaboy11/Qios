"use client";

import React from "react";
import { cn } from "@/lib/utils";

export type AvatarVariant = "primary" | "purple" | "green" | "blue" | "accent";

interface UserItemProps {
  name: string;
  id: string;
  variant?: AvatarVariant;
  className?: string;
}

export const UserItem = ({
  name,
  id,
  variant = "primary",
  className,
}: UserItemProps) => {
  // Extract initials (e.g., "Juan dela Cruz" -> "JD")
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const variantStyles = {
    primary: "border-brand-primary text-brand-primary bg-brand-primary/5",
    accent: "border-white/50 bg-gradient-to-bl from-brand-primary to-brand-accent text-white shadow-sm ring-1 ring-black/5",
    purple: "border-[#8B5CF6] text-[#8B5CF6] bg-[#8B5CF6]/5",
    green: "border-success-primary text-success-primary bg-success-primary/5",
    blue: "border-[#4C84FF] text-[#4C84FF] bg-[#4C84FF]/5",
  };

  return (
    <div
      className={cn(
        "flex items-center gap-3 p-2 group cursor-pointer hover:bg-slate-50 rounded-xl transition-all",
        className,
      )}
    >
      {/* 1. Dynamic Avatar Circle */}
      <div
        className={cn(
          "flex items-center justify-center h-12 w-12 shrink-0 rounded-full border-2 font-bold b3 transition-transform group-active:scale-95",
          variantStyles[variant],
        )}
      >
        {initials}
      </div>

      {/* 2. Identity Text */}
      <div className="flex flex-col min-w-0">
        <span className="b2 font-bold text-text-primary truncate">{name}</span>
        <span className="b5 text-text-secondary font-medium">{id}</span>
      </div>
    </div>
  );
};
