"use client";

import React from "react";
import { Input } from "@/components/atoms/Input";
import { Dropdown } from "@/components/molecules/Dropdown";
import { cn } from "@/lib/utils";

export interface ThresholdRowProps {
  ingredientName: string;
  unitOptions: { label: string; value: string }[];
  onUnitSelect: (option: { label: string; value: string }) => void;
  lowValue: string;
  onLowChange: (value: string) => void;
  criticalValue: string;
  onCriticalChange: (value: string) => void;
  className?: string;
}

export const ThresholdRow = ({
  ingredientName,
  unitOptions,
  onUnitSelect,
  lowValue,
  onLowChange,
  criticalValue,
  onCriticalChange,
  className,
}: ThresholdRowProps) => {
  return (
    <div
      className={cn(
        "grid grid-cols-[2fr_1fr_1fr_1fr] items-center gap-6 py-6 border-b border-[#E5E5E5] last:border-b-0",
        className
      )}
    >
      {/* Ingredient Name */}
      <div className="flex items-center">
        <span className="b3 text-text-primary font-medium">{ingredientName}</span>
      </div>

      {/* Unit Dropdown */}
      <div className="w-full">
        <Dropdown
          label=""
          placeholder="Select Option"
          options={unitOptions}
          onSelect={onUnitSelect}
          className="max-w-[200px]"
        />
      </div>

      {/* Low Threshold */}
      <div className="w-full">
        <Input
          align="center"
          value={lowValue}
          onChange={(e) => onLowChange(e.target.value)}
          placeholder="0"
          className="rounded-2xl border-[#E5E5E5] shadow-sm max-w-[160px] mx-auto font-bold text-text-primary"
        />
      </div>

      {/* Critical Threshold */}
      <div className="w-full">
        <Input
          align="center"
          value={criticalValue}
          onChange={(e) => onCriticalChange(e.target.value)}
          placeholder="0"
          className="rounded-2xl border-brand-accent shadow-[0_0_0_2px_rgba(255,82,105,0.15)] max-w-[160px] mx-auto font-bold text-text-primary"
          isError={true} // using isError to trigger the red brand styling as seen in mockup
        />
      </div>
    </div>
  );
};
