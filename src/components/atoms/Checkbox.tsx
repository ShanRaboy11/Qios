"use client";

import React, { useId } from "react";
import { cn } from "@/lib/utils";
import { Check, Minus } from "lucide-react";

export type checkboxVariant = "primary" | "accent";

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  indeterminate?: boolean;
  variant?: checkboxVariant;
}

export const Checkbox = ({
  label,
  indeterminate,
  className,
  id,
  variant = "primary",
  ...props
}: CheckboxProps) => {
  const generatedId = id || useId();

  const variantStyles = {
    primary: {
      checked:
        "peer-checked:bg-brand-primary peer-checked:border-brand-primary",
      indeterminate:
        "peer-indeterminate:bg-brand-primary peer-indeterminate:border-brand-primary",
      focus: "peer-focus-visible:ring-brand-primary/80",
      text: "peer-checked:text-brand-primary",
    },
    accent: {
      checked: "peer-checked:bg-brand-accent peer-checked:border-brand-accent",
      indeterminate:
        "peer-indeterminate:bg-brand-accent peer-indeterminate:border-brand-accent",
      focus: "peer-focus-visible:ring-brand-accent/80",
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
          type="checkbox"
          id={generatedId}
          className="peer sr-only"
          {...props}
        />

        {/* Box */}
        <span
          className={cn(
            "flex items-center justify-center h-5 w-5 shrink-0 rounded-[4px] border bg-white transition-all duration-200",

            // default border
            "border-text-secondary",

            // ✅ hover (only when not checked)
            "group-hover:bg-text-secondary/10",
            "peer-checked:group-hover:bg-transparent",
            "peer-indeterminate:group-hover:bg-transparent",

            // ✅ checked + indeterminate
            styles.checked,
            styles.indeterminate,
            "peer-checked:[&>svg]:opacity-100",
            "peer-indeterminate:[&>svg]:opacity-100",

            // focus
            "peer-focus-visible:ring-2 peer-focus-visible:ring-offset-1 peer-focus-visible:ring-offset-white",
            styles.focus,

            // press animation
            "group-active:scale-90",
          )}
        >
          {indeterminate ? (
            <Minus className="w-3.5 h-3.5 text-white stroke-[3px] opacity-0 transition-opacity pointer-events-none" />
          ) : (
            <Check className="w-3.5 h-3.5 text-white stroke-[3px] opacity-0 transition-opacity pointer-events-none" />
          )}
        </span>

        {/* Label */}
        {label && (
          <span
            className={cn(
              "b1 text-text-secondary transition-colors",
              styles.text,
            )}
          >
            {label}
          </span>
        )}
      </label>
    </div>
  );
};

/*example usage
 <Checkbox label="Accept terms" />
 <Checkbox label="Subscribe" variant="accent" />
 <Checkbox label="Partial" indeterminate /> 
 */
