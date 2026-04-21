"use client";

import React from "react";
import { cn } from "@/lib/utils";

export type StatCardVariant = "pink" | "coral" | "yellow" | "green";

interface StatCardProps {
  title: string;
  value: string | number;
  subtext?: string;
  variant: StatCardVariant;
  className?: string;
}

export const StatCard = ({
  title,
  value,
  subtext,
  variant,
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
        "rounded-2xl p-6 border transition-transform hover:scale-[1.02] flex flex-col justify-between min-h-[140px]",
        variantStyles[variant],
        className
      )}
    >
      <h3 className="b3 font-bold text-text-primary uppercase tracking-wider">
        {title}
      </h3>
      <div className="flex flex-col gap-1 mt-4">
        <span className="text-4xl font-extrabold text-text-primary leading-none">
          {value}
        </span>
        {subtext && (
          <span className="b5 font-medium text-text-secondary flex items-center gap-1.5 mt-2">
            {subtext.includes("Needs reorder") && (
              <span className="w-1.5 h-1.5 rounded-full bg-warning-primary" />
            )}
            {subtext}
          </span>
        )}
      </div>
    </div>
  );
};
