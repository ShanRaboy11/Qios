"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface TabOption {
  label: string;
  value: string;
}

export interface TabGroupProps {
  options: TabOption[];
  activeValue: string;
  onChange: (value: string) => void;
  className?: string;
}

export const TabGroup = ({
  options,
  activeValue,
  onChange,
  className,
}: TabGroupProps) => {
  return (
    <div className={cn("flex items-center gap-4", className)}>
      {options.map((option) => {
        const isActive = activeValue === option.value;
        return (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            className={cn(
              "px-6 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300",
              isActive
                ? "bg-brand-accent text-white shadow-sm"
                : "bg-brand-accent/10 text-brand-accent hover:bg-brand-accent/20"
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
};
