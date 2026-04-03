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

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  shape?: ButtonShape;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      shape = "pill",
      leftIcon,
      rightIcon,
      children,
      ...props
    },
    ref,
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-inter font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none text-sm md:text-[16px] px-4 py-2.5 md:px-6 md:py-3 border border-transparent";

    const shapeStyles = {
      pill: "rounded-full",
      rounded: "rounded-[8px]",
    };

    const variantStyles = {
      primary:
        "bg-brand-secondary text-text-tertiary hover:bg-brand-secondary hover:text-text-tertiary transition-all duration-300 transform hover:scale-105 shadow-lg cursor-pointer active:scale-[0.98] active:opacity-80",
      accent:
        "bg-brand-accent text-white hover:text-white transition-all duration-300 transform hover:scale-105 shadow-lg cursor-pointer active:text-black active:scale-[0.98]",
      outline:
        "border-brand-primary border-2 text-brand-primary hover:bg-brand-secondary hover:border-brand-secondary hover:text-white transition-all duration-300 transform hover:scale-105 shadow-lg cursor-pointer active:bg-brand-secondary active:border-brand-secondary active:text-white active:scale-[0.98]",
      dark: "bg-text-primary text-white hover:bg-text-primary/90 transition-all duration-300 transform hover:scale-105 shadow-lg cursor-pointer active:bg-[#1A1A1A] active:scale-[0.98]",
      warning:
        "bg-warning-secondary text-warning-primary border-2 hover:border-warning-primary hover:text-warning-primary transition-all duration-300 transform hover:scale-105 shadow-lg cursor-pointer active:bg-warning-primary active:border-warning-primary active:text-white active:scale-[0.98]",
      ghost:
        "bg-transparent text-text-primary hover:opacity-80 transition-all duration-300 transform hover:scale-105 shadow-lg cursor-pointer active:opacity-60 active:scale-[0.98]",
    };

    return (
      <button
        ref={ref}
        className={cn(
          baseStyles,
          shapeStyles[shape],
          variantStyles[variant],
          className,
        )}
        {...props}
      >
        {leftIcon && (
          <span className="mr-2 flex items-center justify-center">
            {leftIcon}
          </span>
        )}
        {children}
        {rightIcon && (
          <span className="ml-2 flex items-center justify-center">
            {rightIcon}
          </span>
        )}
      </button>
    );
  },
);

Button.displayName = "Button";

/*example usage
  <Button
    variant="primary"
    shape="rounded"
    leftIcon={icon}
    rightIcon={icon}
  >
  <Button
    variant="accent"
    shape="pill"
    leftIcon={icon}
    rightIcon={icon}
  >
*/
