import React from "react";
import { cn } from "@/lib/utils";

export interface DashboardListItemProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  rightContent: React.ReactNode;
  className?: string;
  isLast?: boolean;
}

export const DashboardListItem = ({
  icon,
  title,
  subtitle,
  rightContent,
  className,
  isLast = false,
}: DashboardListItemProps) => {
  return (
    <div
      className={cn(
        "w-full flex items-center justify-between py-4",
        !isLast && "border-b border-[#F2F2F2]",
        className,
      )}
    >
      <div className="flex items-center gap-4">
        {/* Icon/Avatar Container */}
        <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0">
          {icon}
        </div>

        {/* Text Content */}
        <div className="flex flex-col">
          <span className="b3 leading-tight">{title}</span>
          <span className="b4 text-text-secondary mt-1">{subtitle}</span>
        </div>
      </div>

      {/* Right Content */}
      <div className="flex flex-col items-end shrink-0">{rightContent}</div>
    </div>
  );
};
