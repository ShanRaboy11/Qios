"use client";

import React from "react";
import { cn } from "@/lib/utils";

export type StatCardVariant = "pink" | "coral" | "yellow" | "green";

interface StatCardProps {
  title: string;
  value: string | number;
  subtext?: string;
  variant: StatCardVariant;
  icon?: React.ReactNode;
  className?: string;
}

export const StatCard = ({
  title,
  value,
  subtext,
  variant,
  icon,
  className,
}: StatCardProps) => {
  const variantStyles = {
    pink: "bg-[#FFEDED] border-[#FFCACA]",
    coral: "bg-[#FFD4D4] border-[#FFB3B3]",
    yellow: "bg-[#FFF8DF] border-[#FDE397]",
    green: "bg-[#E6FFE6] border-[#A2E9A2]",
  };

  return (
    <div
      className={cn(
        "rounded-2xl p-4 md:p-6 border transition-transform hover:scale-[1.02] flex flex-col justify-between min-h-[120px] md:min-h-[140px]",
        variantStyles[variant],
        className
      )}
    >
      <div className="flex items-center justify-between">
        <h3 className="b4 md:b3 font-bold text-text-primary uppercase tracking-wider line-clamp-1">
          {title}
        </h3>
        {icon && <div className="shrink-0">{icon}</div>}
      </div>
      <div className="flex flex-col gap-1 mt-3 md:mt-4">
        <span className="text-3xl md:text-4xl font-extrabold text-text-primary leading-none">
          {value}
        </span>
        {subtext && (
          <span className="b6 md:b5 font-medium text-text-secondary flex items-center gap-1.5 mt-1 md:mt-2 line-clamp-1">
            {subtext.includes("Needs reorder") && (
              <span className="w-1.5 h-1.5 rounded-full bg-warning-primary shrink-0" />
            )}
            {subtext}
          </span>
        )}
      </div>
    </div>
  );
};
