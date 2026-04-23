"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface SectionHeaderProps {
  title: string;
  className?: string;
}

export const SectionHeader = ({ title, className }: SectionHeaderProps) => {
  return (
    <div className={cn("py-4 mb-2 border-b border-[#E5E5E5] flex items-center justify-between", className)}>
      <h3 className="b5 font-bold text-text-secondary uppercase tracking-wider m-0 text-left">
        {title}
      </h3>
    </div>
  );
};
