"use client";

import React, { useState, useRef, useEffect } from "react";
import { Input } from "@/components/atoms/Input";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface DropdownOption {
  label: string;
  value: string;
}

interface DropdownProps {
  label: string;
  options: DropdownOption[];
  placeholder?: string;
  supportiveText?: string;
  onSelect?: (option: DropdownOption) => void;
  value?: string;
  isError?: boolean;
  className?: string;
  size?: "default" | "sm";
}

export const Dropdown = ({
  label,
  options,
  placeholder = "Select Option",
  supportiveText,
  onSelect,
  value,
  isError,
  className,
  size = "default",
}: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Compute selected option based on controlled value
  const selectedOption = React.useMemo(() => {
    return options.find(opt => opt.value === value) || null;
  }, [value, options]);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (option: DropdownOption) => {
    setIsOpen(false);
    onSelect?.(option);
  };

  return (
    <div
      ref={dropdownRef}
      className={cn(
        "flex flex-col gap-1.5 w-full max-w-sm relative",
        className,
      )}
    >
      {/* Label */}
      <label
        className={cn(
          "b4 ml-1 font-medium transition-colors",
          isError ? "text-warning-primary" : "text-text-secondary",
          isOpen && !isError && "text-brand-primary",
        )}
      >
        {label}
      </label>

      {/* Trigger Button - Reusing Input styles logic */}
      <div
        className="relative group cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Input
          readOnly
          placeholder={placeholder}
          value={selectedOption?.label || ""}
          isError={isError}
          className={cn(
            "cursor-pointer",
            size === "sm"
              ? "px-3 pr-8 text-ellipsis text-xs md:text-sm"
              : "pr-12",
            isOpen &&
              !isError &&
              "border-brand-primary shadow-[0_0_0_2px_rgba(255,198,112,0.15)]",
          )}
        />
        <ChevronDown
          size={size === "sm" ? 16 : 20}
          style={{ right: size === "sm" ? "12px" : "20px" }}
          className={cn(
            "absolute top-1/2 -translate-y-1/2 text-text-secondary transition-transform duration-300",
            isOpen && "rotate-180 text-brand-primary",
            isOpen && "rotate-180 text-brand-primary",
          )}
        />
      </div>

      {/* Flexible Dropdown List */}
      {isOpen && (
        <div
          className={cn(
            "absolute top-[calc(85%)] left-0 z-50 bg-white border-2 border-[#E5E5E5] rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-300",
            size === "sm" ? "min-w-full w-max" : "w-full",
          )}
        >
          <ul className="max-h-[240px] overflow-y-auto">
            {options.map((option, index) => (
              <li
                key={option.value}
                onClick={() => handleSelect(option)}
                className={cn(
                  "cursor-pointer transition-colors",
                  size === "sm"
                    ? "px-4 py-2.5 b4 whitespace-nowrap"
                    : "px-6 py-4 b2",
                  "hover:bg-slate-50",
                  index === 0 && "rounded-t-[14px]",
                  index === options.length - 1 && "rounded-b-[14px]",
                  selectedOption?.value === option.value
                    ? "text-brand-primary bg-orange-50/50 font-semibold"
                    : "text-text-primary",
                )}
              >
                {option.label}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Supportive Text */}
      {supportiveText && (
        <span
          className={cn(
            "b5 ml-1",
            isError ? "text-warning-primary" : "text-text-tertiary",
          )}
        >
          {supportiveText}
        </span>
      )}
    </div>
  );
};
