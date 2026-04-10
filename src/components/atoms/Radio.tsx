"use client";

import React, { useId } from "react";
import { cn } from "@/lib/utils";

export type radioVariant = "primary" | "accent";

export interface RadioProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  variant?: radioVariant;
}

export const Radio = ({
  label,
  className,
  id,
  variant = "primary",
  ...props
}: RadioProps) => {
  const generatedId = id || useId();

  const variantStyles = {
    primary: {
      border: "border-text-secondary",
      checkedBorder: "peer-checked:border-brand-primary",
      dot: "bg-brand-primary",
      focus: "peer-focus-visible:ring-brand-primary",
      text: "peer-checked:text-brand-primary",
    },
    accent: {
      border: "border-text-secondary",
      checkedBorder: "peer-checked:border-brand-accent",
      dot: "bg-brand-accent",
      focus: "peer-focus-visible:ring-brand-accent",
      text: "peer-checked:text-brand-accent",
    },
  };

  const styles = variantStyles[variant];

  return (
    <div className={cn("inline-flex items-center", className)}>
      <label
        htmlFor={generatedId}
        className="group flex items-center gap-2.5 cursor-pointer"
      >
        <input
          type="radio"
          id={generatedId}
          className="peer sr-only"
          {...props}
        />

        {/* Outer circle */}
        <span
          className={cn(
            "flex items-center justify-center h-5 w-5 rounded-full border transition-all",

            styles.border,
            styles.checkedBorder,

            "group-hover:bg-text-secondary/10",
            "peer-checked:bg-transparent",

            "peer-focus-visible:ring-2",
            styles.focus,

            "group-active:scale-90",
            "peer-checked:[&>span]:scale-100",
          )}
        >
          {/* Inner dot */}
          <span
            className={cn(
              "h-2.5 w-2.5 rounded-full scale-0 transition-transform",
              styles.dot,
            )}
          />
        </span>

        {/* Label */}
        {label && (
          <span
            className={cn("b1 text-text-secondary transition-all", styles.text)}
          >
            {label}
          </span>
        )}
      </label>
    </div>
  );
};

/*
example usage
<Radio name="demo" label="Selected" defaultChecked />
<Radio name="demo" label="Unselected" />
<Radio name="plan" label="Basic" />
 */
