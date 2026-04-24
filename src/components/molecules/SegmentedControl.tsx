"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface SegmentedControlOption {
  label: string;
  value: string;
}

export interface SegmentedControlProps {
  options: SegmentedControlOption[];
  activeValue: string;
  onChange: (value: string) => void;
  className?: string;
}

export const SegmentedControl = ({
  options,
  activeValue,
  onChange,
  className,
}: SegmentedControlProps) => {
  return (
    <div className={cn("flex w-full gap-4", className)}>
      {options.map((option) => {
        const isActive = activeValue === option.value;
        return (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            className={cn(
              "flex-1 py-3 rounded-xl font-bold text-sm transition-all duration-300 border-2",
              isActive
                ? "bg-brand-primary border-brand-primary text-text-primary shadow-sm"
                : "bg-white border-brand-primary/40 text-brand-primary shadow-sm hover:border-brand-primary"
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
};
