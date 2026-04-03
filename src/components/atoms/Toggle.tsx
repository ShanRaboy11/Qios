"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";

export type ToggleVariant = "primary" | "accent";

export interface ToggleProps {
  isOn?: boolean;
  defaultIsOn?: boolean;
  onChange?: (isOn: boolean) => void;
  variant?: ToggleVariant;
  icon?: React.ReactNode;
  showText?: boolean;
  className?: string;
  disabled?: boolean;
}

/*example usage
<Toggle variant="accent" defaultIsOn={true} />
<Toggle defaultIsOn={true} icon={<Lock className="w-3 h-3" strokeWidth={3} />} />
<Toggle variant="accent" defaultIsOn={true} showText />
*/

export const Toggle = ({
  isOn: controlledIsOn,
  defaultIsOn = false,
  onChange,
  variant = "primary",
  icon,
  showText = false,
  className,
  disabled = false,
}: ToggleProps) => {
  const isControlled = controlledIsOn !== undefined;
  const [internalIsOn, setInternalIsOn] = useState(defaultIsOn);

  const isOn = isControlled ? controlledIsOn : internalIsOn;

  const handleToggle = () => {
    if (disabled) return;
    const newState = !isOn;
    if (!isControlled) {
      setInternalIsOn(newState);
    }
    onChange?.(newState);
  };

  const trackColors = {
    primary: "bg-brand-primary/20",
    accent: "bg-brand-accent/20",
  };

  const thumbColors = {
    primary: {
      on: "bg-brand-primary",
      off: "bg-brand-primary/50",
    },
    accent: {
      on: "bg-brand-accent",
      off: "bg-brand-accent/50",
    },
  };

  const textColors = {
    primary: "text-brand-primary",
    accent: "text-brand-accent",
  };

  const ringColors = {
    primary:
      "ring-transparent ring-offset-transparent focus:ring-brand-primary/80 focus:ring-offset-white",
    accent:
      "ring-transparent ring-offset-transparent focus:ring-brand-accent/80 focus:ring-offset-white",
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isOn}
      disabled={disabled}
      onClick={handleToggle}
      className={cn(
        "relative inline-flex h-8 w-16 items-center rounded-full outline-none ring-0 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 cursor-pointer hover:shadow-sm",
        trackColors[variant],
        ringColors[variant],
        disabled && "opacity-50 cursor-not-allowed",
        className,
      )}
    >
      <span className="sr-only">Toggle switch</span>

      {/* Background Text */}
      {showText && (
        <span
          className={cn(
            "absolute flex w-full justify-between px-2 text-[10px] font-bold tracking-wider",
            textColors[variant],
          )}
        >
          <span
            className={cn(
              "transition-opacity",
              isOn ? "opacity-100" : "opacity-0",
            )}
          >
            ON
          </span>
          <span
            className={cn(
              "transition-opacity",
              !isOn ? "opacity-100" : "opacity-0",
            )}
          >
            OFF
          </span>
        </span>
      )}

      {/* Thumb */}
      <span
        className={cn(
          "absolute flex items-center justify-center h-6 w-6 rounded-full transition-all duration-300 transform shadow-sm",
          isOn ? "translate-x-9" : "translate-x-1",
          isOn ? thumbColors[variant].on : thumbColors[variant].off,
        )}
      >
        {icon && (
          <span className="text-white flex items-center justify-center">
            {icon}
          </span>
        )}
      </span>
    </button>
  );
};
