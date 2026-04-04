"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { FileText, Coins, Box, TrendingUp, TrendingDown } from "lucide-react";

export type KPICardVariant = "filled" | "outlined";
export type KPICardColor = "primary" | "secondary" | "accent";

const presetIcons = {
  sales: <FileText size={24} />,
  profit: <Coins size={24} />,
  product: <Box size={24} />,
};

interface KPICardProps {
  // Now supports either a preset key or a custom React element
  type?: keyof typeof presetIcons;
  icon?: React.ReactNode;
  title: string;
  value: string;
  percentageChange?: number;
  variant?: KPICardVariant;
  color?: KPICardColor;
  description?: string;
  onViewAll?: () => void;
  className?: string;
}

export const KPICard = ({
  type,
  icon,
  title,
  value,
  percentageChange,
  variant = "filled",
  color = "primary",
  description,
  onViewAll,
  className,
}: KPICardProps) => {
  const isFilled = variant === "filled";
  const isPositive = percentageChange && percentageChange > 0;

  // Prioritize the custom icon prop, then fallback to preset icons
  const displayIcon = icon || (type ? presetIcons[type] : null);

  const colorStyles = {
    primary: "bg-brand-primary border-brand-primary/10",
    secondary: "bg-brand-secondary border-brand-secondary/10",
    accent: "bg-brand-accent border-brand-accent/10",
  };

  const iconcolorStyles = {
    primary: "text-brand-primary",
    secondary: "text-brand-secondary",
    accent: "text-brand-accent",
  };

  return (
    <div
      className={cn(
        "w-full rounded-2xl transition-all duration-200",
        isFilled
          ? [
              colorStyles[color],
              "p-6 hover:scale-[1.02] active:scale-[0.98] cursor-pointer text-text-tertiary",
            ]
          : "bg-white border-2 border-[#E5E5E5] hover:border-text-secondary/20",
        className,
      )}
    >
      <div
        className={cn(
          "flex gap-4 items-start w-full",
          !isFilled
            ? "flex-row-reverse justify-between p-6 pb-2"
            : "flex-row p-0",
        )}
      >
        {/* Icon Container */}
        <div
          className={cn(
            "h-12 w-12 rounded-xl flex items-center justify-center shrink-0 border transition-all",
            isFilled
              ? cn("bg-white border-transparent", iconcolorStyles[color])
              : "bg-brand-primary/10 text-brand-primary border-brand-primary/20",
          )}
        >
          {displayIcon}
        </div>

        {/* Text Area */}
        <div className="flex flex-col flex-grow min-w-0">
          <div className="flex justify-between items-start w-full gap-2">
            <div className="flex flex-col">
              {isFilled ? (
                <>
                  <span className="b4 font-medium truncate uppercase tracking-wider text-inherit">
                    {title}
                  </span>
                  <span className="mt-1 h4 font-bold truncate text-inherit">
                    {value}
                  </span>
                </>
              ) : (
                <>
                  <span className="h4 font-bold text-text-primary leading-tight">
                    {value}
                  </span>
                  <span className="b1 font-medium text-text-secondary truncate mt-1.5">
                    {title}
                  </span>
                </>
              )}
            </div>

            {isFilled && percentageChange !== undefined && (
              <div
                className={cn(
                  "px-2 py-1 rounded-lg b5 font-bold flex items-center gap-1 shrink-0 mt-1",
                  "bg-text-tertiary",
                  isPositive ? "text-success-primary" : "text-warning-primary",
                )}
              >
                {isPositive ? (
                  <TrendingUp size={14} />
                ) : (
                  <TrendingDown size={14} />
                )}
                {isPositive ? "+" : ""}
                {percentageChange}%
              </div>
            )}
          </div>
        </div>
      </div>

      {!isFilled && description && (
        <div className="w-full flex flex-col p-6 pt-0 mt-3">
          <div className="w-full h-[1px] bg-[#E5E5E5] mb-5" />
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "b2 font-black",
                  isPositive ? "text-success-primary" : "text-warning-primary",
                )}
              >
                {isPositive ? "+" : ""}
                {percentageChange}%
              </span>
              <span className="b2 text-text-secondary">{description}</span>
            </div>

            {onViewAll && (
              <button
                onClick={onViewAll}
                className="b5 font-bold text-text-secondary hover:text-text-primary underline shrink-0"
              >
                View All
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
