"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Search, SlidersHorizontal } from "lucide-react";
import { FormField } from "@/components/molecules/FormField";

interface SearchFilterBarProps {
  onSearch?: (value: string) => void;
  onFilterClick?: () => void;
  className?: string;
}

export const SearchFilterBar = ({
  onSearch,
  onFilterClick,
  className,
}: SearchFilterBarProps) => {
  return (
    <div
      className={cn(
        "w-full flex flex-col md:flex-row items-start gap-3",
        className,
      )}
    >
      {/* 1. Search Field */}
      <div className="flex-grow w-full">
        <FormField
          label=""
          placeholder="Search tenants by name, ID, or owner..."
          supportiveText="Ex: Juan Dela Cruz, ORD-123..."
          leftIcon={<Search size={20} />}
          onChange={(e) => onSearch?.(e.target.value)}
          className="max-w-none mt-[17px]"
        />
      </div>

      {/* 2. Filter Action Button */}
      <button
        onClick={onFilterClick}
        className={cn(
          "md:mt-[22px] h-[52px] px-6 flex items-center gap-2 bg-white border-2 border-[#E5E5E5] rounded-2xl",
          "hover:bg-slate-50 active:scale-95 transition-all group",
          "w-full md:w-auto justify-center shrink-0",
        )}
      >
        <SlidersHorizontal
          size={18}
          className="text-text-secondary group-hover:text-brand-primary"
        />
        <span className="b2 font-bold text-text-secondary group-hover:text-text-primary">
          Filters
        </span>
      </button>
    </div>
  );
};
