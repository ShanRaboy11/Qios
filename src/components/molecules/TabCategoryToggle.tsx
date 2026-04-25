import React from "react";
import { cn } from "@/lib/utils";

export type TabCategoryToggleSize = "sm" | "md" | "lg";

export interface TabCategoryToggleProps {
  label: string;
  iconSrc: string;
  isActive?: boolean;
  size?: TabCategoryToggleSize;
  onClick?: () => void;
  className?: string;
}

export const TabCategoryToggle = ({
  label,
  iconSrc,
  isActive = false,
  size = "md",
  onClick,
  className,
}: TabCategoryToggleProps) => {
  const sizeStyles = {
    sm: {
      container: "w-14 h-14 p-1",
      icon: "w-8 h-8",
      text: "text-[12px] mt-1",
    },
    md: {
      container: "w-16 h-16 p-2",
      icon: "w-10 h-10",
      text: "text-[13px] mt-2",
    },
    lg: {
      container: "w-20 h-20 p-3",
      icon: "w-14 h-14",
      text: "text-[14px] mt-2",
    },
  };

  const { container, icon, text } = sizeStyles[size];

  return (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-col items-center justify-start group outline-none transition-all duration-300 relative",
        isActive
          ? "bg-white pt-3 pb-12 -mb-8 px-1 sm:px-2 rounded-t-[40px] z-30 translate-y-3"
          : "pt-4 pb-2 z-10",
        className,
      )}
    >
      <div
        className={cn(
          "rounded-full flex items-center justify-center transition-all duration-300",
          container,
          isActive
            ? "bg-white border border-[#FF4D6D]/10 shadow-sm"
            : "bg-white group-hover:bg-[#FFDC72]/60 group-hover:scale-105",
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
          "font-inter font-bold transition-colors duration-300",
          text,
          isActive ? "text-[#2D2D2D]" : "text-[#2D2D2D] group-hover:text-black",
        )}
      >
        {label}
      </span>
    </button>
  );
};
