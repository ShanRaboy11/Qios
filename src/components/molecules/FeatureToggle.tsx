"use client";

import React, { useState, useEffect } from "react";
import { Toggle } from "@/components/atoms/Toggle";
import { cn } from "@/lib/utils";

interface FeatureToggleProps {
  label: string;
  description?: string;
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
}

export const FeatureToggle = ({
  label,
  description,
  checked: controlledChecked,
  defaultChecked = false,
  onChange,
  disabled,
  className,
}: FeatureToggleProps) => {
  const [internalChecked, setInternalChecked] = useState(defaultChecked);
  const isChecked =
    controlledChecked !== undefined ? controlledChecked : internalChecked;

  const handleToggle = (newChecked: boolean) => {
    setInternalChecked(newChecked);
    onChange?.(newChecked);
  };

  return (
    <div
      className={cn(
        "flex items-center justify-between gap-4 p-4 rounded-xl border border-transparent transition-all duration-300",
        "hover:bg-black/[0.02]",
        disabled && "opacity-40 pointer-events-none",
        className,
      )}
    >
      <div className="flex flex-col gap-0.5 select-none">
        {/* Feature Name */}
        <span
          className={cn(
            "b2 font-bold transition-colors duration-300",
            isChecked ? "text-text-primary" : "text-text-primary/80",
          )}
        >
          {label}
        </span>

        {/* Optional Description */}
        {description && (
          <span
            className={cn(
              "b4 transition-colors duration-300",
              isChecked ? "text-text-secondary" : "text-text-secondary/90",
            )}
          >
            {description}
          </span>
        )}
      </div>

      <Toggle
        isOn={controlledChecked}
        defaultIsOn={defaultChecked}
        onChange={handleToggle}
        disabled={disabled}
      />
    </div>
  );
};
