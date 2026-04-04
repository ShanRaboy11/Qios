"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Radio } from "@/components/atoms/Radio";
import { Checkbox } from "@/components/atoms/Checkbox";

interface ModifierRowProps {
  type: "radio" | "checkbox";
  title: string;
  description?: string;
  priceTag?: string;
  name?: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  className?: string;
}

export const ModifierRow = ({
  type,
  title,
  description,
  priceTag,
  name,
  checked,
  onChange,
  className,
}: ModifierRowProps) => {
  const Component = type === "radio" ? Radio : Checkbox;

  return (
    <div
      className={cn(
        "w-full p-4 flex items-center justify-between gap-4 transition-all duration-200",
        "bg-[#FAF1D6]/50 hover:bg-[#FAF1D6] rounded-xl border-2 border-transparent",
        "group cursor-pointer",
        checked && "bg-[#FAF1D6] border-brand-primary/20",
        className,
      )}
      onClick={() => onChange?.(!checked)}
    >
      <div className="flex items-center gap-4 flex-1">
        <Component
          name={name}
          checked={checked}
          onChange={(e) => onChange?.(e.target.checked)}
          onClick={(e) => e.stopPropagation()}
        />

        <div className="flex flex-col">
          <span className="b2 font-bold text-text-primary">{title}</span>
          {description && (
            <span className="b5 text-text-secondary">{description}</span>
          )}
        </div>
      </div>

      {/* Price / Status Tag */}
      {priceTag && (
        <span
          className={cn(
            "b2 font-bold shrink-0",
            priceTag === "Free" ? "text-success-primary" : "text-brand-accent",
          )}
        >
          {priceTag}
        </span>
      )}
    </div>
  );
};
