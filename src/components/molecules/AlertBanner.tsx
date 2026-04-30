"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Info, X } from "lucide-react";

export interface AlertBannerProps {
  message: React.ReactNode;
  className?: string;
  icon?: React.ReactNode;
  onClose?: () => void;
}

export const AlertBanner = ({ message, className, icon, onClose }: AlertBannerProps) => {
  return (
    <div
      className={cn(
        "w-full flex items-center justify-between p-3 rounded-xl bg-[#FFF6F8] gap-3 border border-[#ec1313]",
        className,
      )}
    >
      <div className="flex items-center gap-3">
        {icon ? (
          icon
        ) : (
          <Info size={16} className="text-warning-primary shrink-0" />
        )}
        <span className="b4 font-semibold text-text-primary">{message}</span>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="p-1 hover:bg-[#ffe0e0] rounded-lg transition-colors"
        >
          <X size={16} className="text-text-primary shrink-0" />
        </button>
      )}
    </div>
  );
};
