import React from "react";
import { cn } from "@/lib/utils";

export type ButtonVariant =
  | "primary"
  | "accent"
  | "outline"
  | "dark"
  | "warning"
  | "ghost";

export type ButtonShape = "pill" | "rounded";
// 1. Added Size Types
export type ButtonSize = "sm" | "md" | "lg" | "icon";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  shape?: ButtonShape;
  size?: ButtonSize; // Added prop
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      shape = "pill",
      size = "md", // Default size
      leftIcon,
      rightIcon,
      children,
      ...props
    },
    ref,
  ) => {
    // 2. Extracted padding/sizing from baseStyles to sizeStyles
    const baseStyles =
      "inline-flex items-center justify-center font-inter font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none border border-transparent shrink-0";

    const shapeStyles = {
      pill: "rounded-full",
      rounded: "rounded-[8px]",
    };

    // 3. New Size Mapping
    const sizeStyles = {
      sm: "px-3 py-1.5 text-xs md:text-sm",
      md: "px-4 py-2.5 md:px-6 md:py-3 text-sm md:text-[16px]",
      lg: "px-8 py-4 text-lg",
      icon: "p-2 min-h-fit min-w-fit aspect-square",
    };

    const variantStyles = {
      primary:
        "bg-brand-secondary text-text-tertiary hover:bg-brand-secondary/90 transition-all duration-300 transform hover:scale-105 shadow-lg cursor-pointer active:scale-[0.98] active:opacity-80",
      accent:
        "bg-brand-accent text-white hover:bg-brand-accent/90 transition-all duration-300 transform hover:scale-105 shadow-lg cursor-pointer active:scale-[0.98]",
      outline:
        "border-brand-primary border-2 text-brand-primary hover:bg-brand-secondary hover:border-brand-secondary hover:text-white transition-all duration-300 transform hover:scale-105 shadow-lg cursor-pointer active:scale-[0.98]",
      dark: "bg-text-primary text-white hover:bg-text-primary/90 transition-all duration-300 transform hover:scale-105 shadow-lg cursor-pointer active:scale-[0.98]",
      warning:
        "bg-warning-secondary text-warning-primary border-2 border-transparent hover:border-warning-primary transition-all duration-300 transform hover:scale-105 shadow-lg cursor-pointer active:scale-[0.98]",
      ghost:
        "bg-transparent text-text-primary hover:bg-black/5 transition-all duration-300 transform hover:scale-105 cursor-pointer active:scale-[0.98]",
    };

    return (
      <button
        ref={ref}
        className={cn(
          baseStyles,
          shapeStyles[shape],
          sizeStyles[size], // Applied size here
          variantStyles[variant],
          className,
        )}
        {...props}
      >
        {leftIcon && (
          <span
            className={cn(
              "flex items-center justify-center",
              children && "mr-2",
            )}
          >
            {leftIcon}
          </span>
        )}

        {children}

        {rightIcon && (
          <span
            className={cn(
              "flex items-center justify-center",
              children && "ml-2",
            )}
          >
            {rightIcon}
          </span>
        )}
      </button>
    );
  },
);

Button.displayName = "Button";

/*example usage
<Button variant="ghost" shape="rounded" leftIcon={icon} rightIcon={icon}>
  Ghost Button
</Button> 
<div className="flex items-center gap-3">
  <Button variant="warning" shape="rounded" size="icon">
    <Plus size={10} />
  </Button>
  <span className="b1 font-bold">1</span>
  <Button variant="accent" shape="rounded" size="icon">
    <Plus size={10} />
  </Button>
</div>
*/
