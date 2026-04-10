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
  isError?: boolean;
  className?: string;
}

export const Dropdown = ({
  label,
  options,
  placeholder = "Select Option",
  supportiveText,
  onSelect,
  isError,
  className,
}: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<DropdownOption | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

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
    setSelected(option);
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
          value={selected?.label || ""}
          isError={isError}
          className={cn(
            "cursor-pointer pr-12",
            isOpen &&
              !isError &&
              "border-brand-primary shadow-[0_0_0_2px_rgba(255,198,112,0.15)]",
          )}
        />
        <ChevronDown
          size={20}
          className={cn(
            "absolute right-5 top-1/2 -translate-y-1/2 text-text-secondary transition-transform duration-300",
            isOpen && "rotate-180 text-brand-primary",
          )}
        />
      </div>

      {/* Flexible Dropdown List */}
      {isOpen && (
        <div className="absolute top-[calc(85%)] left-0 w-full z-50 bg-white border-2 border-[#E5E5E5] rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
          <ul className="max-h-[240px] overflow-y-auto">
            {options.map((option, index) => (
              <li
                key={option.value}
                onClick={() => handleSelect(option)}
                className={cn(
                  "px-6 py-4 b2 cursor-pointer transition-colors",
                  "hover:bg-slate-50",
                  index === 0 && "rounded-t-[14px]",
                  index === options.length - 1 && "rounded-b-[14px]",
                  selected?.value === option.value
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
