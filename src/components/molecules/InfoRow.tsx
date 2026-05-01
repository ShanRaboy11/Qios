import React from "react";
import { cn } from "@/lib/utils";

interface InfoRowProps {
  label: string;
  value: React.ReactNode;
  className?: string;
  vertical?: boolean;
}

export const InfoRow = ({ label, value, className, vertical = false }: InfoRowProps) => {
  return (
    <div
      className={cn(
        "flex py-3 border-b border-gray-50 last:border-0",
        vertical ? "flex-col items-start gap-1" : "flex-row items-center justify-between gap-4",
        className
      )}
    >
      <span className="text-[14px] text-text-secondary font-medium shrink-0">
        {label}
      </span>
      <div
        className={cn(
          "text-[15px] text-text-primary font-semibold break-words",
          vertical ? "w-full text-left" : "text-right"
        )}
      >
        {value}
      </div>
    </div>
  );
};
