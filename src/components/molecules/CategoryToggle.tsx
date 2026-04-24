import React from "react";
import { cn } from "@/lib/utils";

export type CategoryToggleSize = "sm" | "md" | "lg";

export interface CategoryToggleProps {
  label: string;
  iconSrc: string;
  isActive?: boolean;
  size?: CategoryToggleSize;
  onClick?: () => void;
  className?: string;
}

export const CategoryToggle = ({
  label,
  iconSrc,
  isActive = false,
  size = "md",
  onClick,
  className,
}: CategoryToggleProps) => {
  const sizeStyles = {
    sm: {
      container: "w-20 h-20 p-1",
      icon: "w-10 h-10",
      text: "text-xs mt-1",
    },
    md: {
      container: "w-20 h-24 p-2",
      icon: "w-15 h-15",
      text: "text-sm mt-2",
    },
    lg: {
      container: "w-25 h-25 p-3",
      icon: "w-20 h-20",
      text: "text-base mt-3",
    },
  };

  const { container, icon, text } = sizeStyles[size];

  return (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-col items-center justify-center group outline-none",
        className,
      )}
    >
      <div
        className={cn(
          "rounded-[30px] flex items-center justify-center transition-all duration-300",
          container,
          isActive
            ? "bg-[#FFDC72] shadow-sm transform scale-100"
            : "bg-[#FEF5E7] group-hover:bg-[#FFDC72]/60 group-hover:scale-105",
        )}
      >
        <img
          src={iconSrc}
          alt={label}
          className={cn(
            "object-contain transition-transform duration-300",
            icon,
            isActive ? "scale-110" : "group-hover:scale-110",
          )}
        />
      </div>

      <span
        className={cn(
          "font-inter font-semibold transition-colors duration-300",
          text,
          isActive
            ? "text-text-primary"
            : "text-text-primary/70 group-hover:text-text-primary",
        )}
      >
        {label}
      </span>
    </button>
  );
};
