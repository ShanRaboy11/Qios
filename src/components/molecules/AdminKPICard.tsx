import React from "react";
import { cn } from "@/lib/utils";

export type AdminKPIColor = "pink" | "yellow" | "green" | "red";
export type AdminKPIBadgeColor = "green" | "red";

interface AdminKPICardProps {
  title: string;
  value: string | number;
  percentage: string;
  badgeColor?: AdminKPIBadgeColor; // Optional, defaults to green
  icon: React.ReactNode;
  color: AdminKPIColor;
  className?: string;
  chartData?: number[]; // Dummy array to represent heights 1-10
}

export const AdminKPICard = ({
  title,
  value,
  percentage,
  badgeColor = "green",
  icon,
  color,
  className,
  chartData = [4, 7, 5, 8, 3, 6],
}: AdminKPICardProps) => {
  const iconBgStyles = {
    pink: "bg-[#FFEDED] text-[#FF5269]",
    yellow: "bg-[#FFF8DF] text-[#FFB020]",
    green: "bg-[#E6FFE6] text-[#22C55E]",
    red: "bg-[#FFEDED] text-[#EF4444]", // Reuse pink bg for red icon usually
  };

  const chartColorStyles = {
    pink: "bg-[#FF5269]",
    yellow: "bg-[#FFDC72]",
    green: "bg-[#22C55E]",
    red: "bg-[#EF4444]",
  };

  return (
    <div
      className={cn(
        "bg-white rounded-[24px] p-6 shadow-sm border border-transparent hover:border-gray-200 transition-all flex flex-col justify-between h-[160px]",
        className,
      )}
    >
      <div className="flex justify-between items-start">
        <div
          className={cn(
            "w-10 h-10 rounded-[12px] flex items-center justify-center",
            iconBgStyles[color],
          )}
        >
          {icon}
        </div>
        <div
          className="px-2.5 py-1 rounded-[6px] text-[12px] font-semibold text-white"
          style={{
            backgroundColor: badgeColor === "green" ? "#22C55E" : "#EF4444",
          }}
        >
          {percentage}
        </div>
      </div>

      <div className="flex justify-between items-end mt-4">
        <div className="flex flex-col">
          <span className="text-[28px] font-bold text-[#2D2D2D] leading-none">
            {value}
          </span>
          <span className="text-[16px] text-text-secondary font-figtree mt-1">
            {title}
          </span>
        </div>

        {/* Mini Bar Chart */}
        <div className="hidden md:flex items-end gap-1 h-8">
          {chartData.map((height, i) => (
            <div
              key={i}
              className={cn(
                "w-1.5 rounded-full opacity-80",
                chartColorStyles[color],
              )}
              style={{ height: `${(height / 10) * 100}%` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
