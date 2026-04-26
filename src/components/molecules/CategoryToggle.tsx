import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export type CategoryToggleSize = "sm" | "md" | "lg";

export interface CategoryToggleProps {
  label: string;
  iconSrc: string;
  isActive?: boolean;
  isCategoryView?: boolean;
  size?: CategoryToggleSize;
  onClick?: () => void;
  className?: string;
}

export const CategoryToggle = ({
  label,
  iconSrc,
  isActive = false,
  isCategoryView = false,
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
    <motion.button
      layout
      onClick={onClick}
      className={cn(
        "flex flex-col items-center justify-center group outline-none mt-15",
        className,
      )}
    >
      <motion.div
        layout
        className={cn(
          "flex items-center justify-center transition-all duration-300",
          container,
          isCategoryView
            ? isActive
              ? "bg-white rounded-t-[30px] rounded-b-none pb-4 scale-110 shadow-sm z-10"
              : "bg-transparent scale-90"
            : isActive
              ? "bg-[#FFDC72] rounded-[30px] shadow-sm transform scale-100"
              : "bg-[#FEF5E7] rounded-[30px] group-hover:bg-[#FFDC72]/60 group-hover:scale-105",
        )}
      >
        <motion.img
          layout
          src={iconSrc}
          alt={label}
          className={cn(
            "object-contain transition-transform duration-300",
            icon,
            isActive ? "scale-110" : "group-hover:scale-110",
          )}
        />
      </motion.div>

      <motion.span
        layout
        className={cn(
          "font-inter font-semibold transition-colors duration-300 z-20",
          text,
          isCategoryView && !isActive ? "-mt-2 text-[#2D2D2D] text-[13px]" : "",
          isCategoryView && isActive
            ? "mt-4 text-[#2D2D2D] text-[13px] bg-white"
            : "",
          !isCategoryView && isActive ? "text-text-primary" : "",
          !isCategoryView && !isActive
            ? "text-text-primary/70 group-hover:text-text-primary"
            : "",
        )}
      >
        {label}
      </motion.span>
    </motion.button>
  );
};
