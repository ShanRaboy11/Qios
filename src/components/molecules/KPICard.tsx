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
        "w-full rounded-2xl transition-all duration-200 ",
        isFilled
          ? [
              colorStyles[color],
              "p-4 sm:p-6 hover:scale-[1.02] active:scale-[0.98] cursor-pointer text-text-tertiary",
            ]
          : "bg-white border-2 border-[#E5E5E5] hover:border-text-secondary/20 cursor-default",
        className,
      )}
    >
      <div
        className={cn(
          "flex gap-3 sm:gap-4 items-start w-full",
          !isFilled
            ? "flex-row-reverse justify-between p-4 pb-2 sm:p-6 sm:pb-2"
            : "flex-row p-0",
        )}
      >
        {/* Icon Container */}
        <div
          className={cn(
            "h-10 w-10 sm:h-12 sm:w-12 rounded-xl flex items-center justify-center shrink-0 border transition-all",
            isFilled
              ? cn("bg-white border-transparent", iconcolorStyles[color])
              : "bg-brand-primary/10 text-brand-primary border-brand-primary/20",
          )}
        >
          {/* We can force the icon to scale using CSS, or rely on its own size. Assuming it has a default size, scaling the container might be enough, but let's add [&>svg]:w-5 [&>svg]:h-5 sm:[&>svg]:w-6 sm:[&>svg]:h-6 */}
          <div className="flex items-center justify-center [&>svg]:w-5 [&>svg]:h-5 sm:[&>svg]:w-6 sm:[&>svg]:h-6">
            {displayIcon}
          </div>
        </div>

        {/* Text Area */}
        <div className="flex flex-col flex-grow min-w-0">
          <div className="flex flex-col sm:flex-row sm:justify-between items-start w-full gap-2">
            <div className="flex flex-col min-w-0 w-full">
              {isFilled ? (
                <>
                  <span className="text-[11px] sm:text-[13px] font-medium truncate uppercase tracking-wider text-inherit">
                    {title}
                  </span>
                  <span className="mt-0.5 sm:mt-1 text-[20px] sm:text-[20px] font-medium truncate text-inherit leading-tight">
                    {value}
                  </span>
                </>
              ) : (
                <>
                  <span className="text-[20px] sm:text-[20px] font-medium text-text-primary leading-tight">
                    {value}
                  </span>
                  <span className="text-[12px] sm:text-[14px] font-medium text-text-secondary truncate mt-1">
                    {title}
                  </span>
                </>
              )}
            </div>

            {isFilled && percentageChange !== undefined && (
              <div
                className={cn(
                  "px-2 py-0.5 sm:py-1 rounded-md sm:rounded-lg text-[10px] sm:text-[12px] font-bold flex items-center gap-1 shrink-0 mt-1 sm:mt-0",
                  "bg-text-tertiary w-fit",
                  isPositive ? "text-success-primary" : "text-warning-primary",
                )}
              >
                {isPositive ? (
                  <TrendingUp size={12} className="sm:w-3.5 sm:h-3.5" />
                ) : (
                  <TrendingDown size={12} className="sm:w-3.5 sm:h-3.5" />
                )}
                {isPositive ? "+" : ""}
                {percentageChange}%
              </div>
            )}
          </div>
        </div>
      </div>

      {!isFilled && description && (
        <div className="w-full flex flex-col p-4 pt-0 sm:p-6 sm:pt-0 mt-2 sm:mt-3">
          <div className="w-full h-[1px] bg-[#E5E5E5] mb-3 sm:mb-4" />
          <div className="flex flex-col xl:flex-row xl:items-center justify-between w-full gap-2">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span
                className={cn(
                  "text-[12px] sm:text-[14px] font-black",
                  isPositive ? "text-success-primary" : "text-warning-primary",
                )}
              >
                {isPositive ? "+" : ""}
                {percentageChange}%
              </span>
              <span className="text-[12px] sm:text-[13px] text-text-secondary truncate">
                {description}
              </span>
            </div>

            {onViewAll && (
              <button
                onClick={onViewAll}
                className="text-[11px] sm:text-[13px] font-bold text-text-secondary hover:text-text-primary underline shrink-0 text-left xl:text-right"
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
