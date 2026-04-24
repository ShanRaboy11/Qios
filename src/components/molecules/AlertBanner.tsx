"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Info } from "lucide-react";

export interface AlertBannerProps {
  message: string;
  className?: string;
  icon?: React.ReactNode;
}

export const AlertBanner = ({
  message,
  className,
  icon,
}: AlertBannerProps) => {
  return (
    <div
      className={cn(
        "w-full flex items-center justify-center p-3 rounded-xl bg-[#FFF6F8] gap-3 text-center",
        className
      )}
    >
      {icon ? (
        icon
      ) : (
        <Info size={16} className="text-brand-primary shrink-0" />
      )}
      <span className="b4 font-semibold text-text-primary">
        {message}
      </span>
    </div>
  );
};
