import React from "react";
import { cn } from "@/lib/utils";

interface BentoCardProps {
  title?: React.ReactNode;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  headerAction?: React.ReactNode;
}

export const BentoCard = ({
  title,
  icon,
  children,
  className,
  headerAction,
}: BentoCardProps) => {
  return (
    <div
      className={cn(
        "bg-white rounded-[24px] p-6 shadow-sm border border-gray-100 flex flex-col h-full",
        className
      )}
    >
      {(title || icon || headerAction) && (
        <div className="flex items-center justify-between mb-6 gap-4">
          <div className="flex items-center gap-3">
            {icon && (
              <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center shrink-0">
                {icon}
              </div>
            )}
            {title && (
              <h2 className="text-[18px] font-bold text-text-primary">
                {title}
              </h2>
            )}
          </div>
          {headerAction && <div>{headerAction}</div>}
        </div>
      )}
      <div className="flex-1 flex flex-col">{children}</div>
    </div>
  );
};
