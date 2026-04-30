"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface ListCardItemProps {
  imageSlot?: React.ReactNode;
  title: string;
  subtitle: React.ReactNode;
  rightSlot?: React.ReactNode;
  className?: string;
}

export const ListCardItem = ({
  imageSlot,
  title,
  subtitle,
  rightSlot,
  className,
}: ListCardItemProps) => {
  return (
    <div
      className={cn(
        "flex items-center justify-between w-full py-3",
        className,
      )}
    >
      <div className="flex items-center gap-4 min-w-0">
        {imageSlot && (
          <div className="shrink-0 w-12 h-12 rounded-xl overflow-hidden bg-gray-50 flex items-center justify-center border border-gray-100">
            {imageSlot}
          </div>
        )}
        <div className="flex flex-col min-w-0">
          <span className="text-[16px] font-semibold text-[#2D2D2D] truncate">
            {title}
          </span>
          <span className="text-[14px] text-text-secondary truncate mt-0.5">
            {subtitle}
          </span>
        </div>
      </div>
      {rightSlot && (
        <div className="shrink-0 ml-4 flex items-center justify-end">
          {rightSlot}
        </div>
      )}
    </div>
  );
};
