"use client";

import React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  formatManilaDateRangeLabel,
  type DashboardDateRangePreset,
} from "@/lib/salesDashboard";

export interface DateRangePickerProps {
  startDate?: string;
  endDate?: string;
  preset?: DashboardDateRangePreset;
  showControls?: boolean;
  className?: string;
}

const rangeOptions: Array<{
  label: string;
  value: DashboardDateRangePreset;
}> = [
  { label: "Week", value: "week" },
  { label: "Month", value: "month" },
  { label: "Year", value: "year" },
  { label: "All Time", value: "all-time" },
];

export const DateRangePicker = ({
  startDate,
  endDate,
  preset = "week",
  showControls = false,
  className,
}: DateRangePickerProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const displayLabel = formatManilaDateRangeLabel(
    startDate ?? null,
    endDate ?? null,
  );

  const handlePresetChange = (nextPreset: DashboardDateRangePreset) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("range", nextPreset);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <div
      className={cn(
        "flex flex-col gap-3 px-4 py-3 bg-white border border-[#E5E5E5] rounded-xl text-sm font-medium text-text-secondary shadow-sm",
        className,
      )}
    >
      <div className="flex items-center gap-2">
        <Calendar size={18} className="text-text-secondary shrink-0" />
        <span className="text-text-primary">{displayLabel}</span>
      </div>

      {showControls ? (
        <div className="flex flex-wrap gap-2">
          {rangeOptions.map((option) => {
            const isActive = preset === option.value;

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => handlePresetChange(option.value)}
                className={cn(
                  "px-3 py-1.5 rounded-full border text-xs font-semibold transition-colors",
                  isActive
                    ? "bg-brand-primary border-brand-primary text-text-primary"
                    : "border-[#E5E5E5] text-text-secondary hover:border-brand-primary/40 hover:text-brand-primary",
                )}
                aria-pressed={isActive}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
};
