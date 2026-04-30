"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Calendar } from "lucide-react";

export interface DateRangePickerProps {
  startDate?: string;
  endDate?: string;
  className?: string;
}

export const DateRangePicker = ({
  startDate = "01 Jan 2026",
  endDate = "07 Jan 2026",
  className,
}: DateRangePickerProps) => {
  return (
    <button
      className={cn(
        "flex items-center gap-2 px-4 py-2.5 bg-white border border-[#E5E5E5] rounded-xl text-sm font-medium text-text-secondary hover:border-[#ffc670] transition-colors shadow-sm",
        className,
      )}
    >
      <Calendar size={18} className="text-text-secondary" />
      <span>
        {startDate} - {endDate}
      </span>
    </button>
  );
};
