import React from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

export interface ChartCardProps {
  title: string;
  dropdownLabel?: string;
  children: React.ReactNode;
  className?: string;
}

export const ChartCard = ({
  title,
  dropdownLabel,
  children,
  className,
}: ChartCardProps) => {
  return (
    <div
      className={cn(
        "bg-white rounded-[24px] p-6 shadow-sm border border-transparent",
        className,
      )}
    >
      <div className="flex justify-between items-center mb-6">
        <span className="h4 font-semibold text-text-primary">{title}</span>
        {dropdownLabel && (
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] border border-[#E5E5E5] text-[13px] text-text-secondary hover:bg-gray-50 transition-colors">
            {dropdownLabel}
            <ChevronDown size={14} />
          </button>
        )}
      </div>
      <div className="w-full h-full min-h-[250px] relative">{children}</div>
    </div>
  );
};
