"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Zap, TriangleAlert, Info, ChevronRight, Calendar } from "lucide-react";

export type InsightLinkColor = "primary" | "secondary" | "accent";

const presetIcons = {
  selling: <Zap size={20} />,
  stock: <TriangleAlert size={20} />,
  info: <Info size={20} />,
};

interface InsightLinkProps {
  // Now optional to allow for custom icons
  type?: keyof typeof presetIcons;
  icon?: React.ReactNode;
  title: string;
  onViewAll?: () => void;
  onClick?: () => void;
  color?: InsightLinkColor;
  className?: string;
  // Dropdown Props
  options?: string[];
  selectedOption?: string;
  onOptionChange?: (value: string) => void;
}

export const InsightLink = ({
  type,
  icon,
  title,
  onViewAll,
  onClick,
  color = "primary",
  className,
  options,
  selectedOption,
  onOptionChange,
}: InsightLinkProps) => {
  // Resolve icon: Custom icon prop takes priority, then preset types
  const displayIcon = icon || (type ? presetIcons[type] : null);

  const colorStyles = {
    primary: {
      icon: "bg-brand-primary/10 text-brand-primary border-brand-primary/20",
      hover: "hover:border-brand-primary/50",
    },
    secondary: {
      icon: "bg-brand-secondary/10 text-brand-secondary border-brand-secondary/20",
      hover: "hover:border-brand-secondary/50",
    },
    accent: {
      icon: "bg-brand-accent/10 text-brand-accent border-brand-accent/20",
      hover: "hover:border-brand-accent/80",
    },
  };

  const styles = colorStyles[color];

  return (
    <div
      onClick={onClick}
      className={cn(
        "w-full bg-white border-2 border-[#E5E5E5] rounded-2xl p-5 flex items-center justify-between gap-4 transition-all duration-200",
        "cursor-pointer group",
        styles.hover,
        className,
      )}
    >
      <div className="flex items-center gap-4 flex-grow min-w-0">
        {/* 1. Flexible Icon Container */}
        <div
          className={cn(
            "h-10 w-10 rounded-xl flex items-center justify-center shrink-0 border",
            styles.icon,
          )}
        >
          {displayIcon}
        </div>

        {/* 2. Title */}
        <span className="b2 font-bold text-text-primary truncate">{title}</span>
      </div>

      {/* 3. Action Area (Dropdown OR View All OR Chevron) */}
      <div className="flex items-center gap-3 shrink-0">
        {options ? (
          <div
            className="relative flex items-center px-3 py-2 bg-white border border-text-secondary/50 rounded-lg hover:border-text-secondary transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            <Calendar size={16} className="text-text-secondary mr-2" />
            <select
              value={selectedOption}
              onChange={(e) => onOptionChange?.(e.target.value)}
              className="b4 font-medium text-text-primary bg-transparent outline-none cursor-pointer pr-1 appearance-none"
            >
              {options.map((opt) => (
                <option
                  key={opt}
                  value={opt}
                  className="bg-white text-text-primary py-2"
                >
                  {opt}
                </option>
              ))}
            </select>
            <div className="pointer-events-none ml-1">
              <svg
                width="10"
                height="6"
                viewBox="0 0 10 6"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1 1L5 5L9 1"
                  stroke="#1A1A1A"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        ) : onViewAll ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onViewAll();
            }}
            className="b4 font-bold text-text-secondary hover:text-text-primary underline transition-colors"
          >
            View All
          </button>
        ) : (
          <ChevronRight
            size={20}
            className="text-text-tertiary group-hover:text-text-primary group-hover:translate-x-1 transition-all"
          />
        )}
      </div>
    </div>
  );
};
