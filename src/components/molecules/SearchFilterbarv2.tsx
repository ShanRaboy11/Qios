"use client";

import React, { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Calendar, Search, Users, ChevronLeft, ChevronRight } from "lucide-react";
import { FormField } from "@/components/molecules/FormField";

export interface SearchFilterbarv2Props {
  onSearch?: (value: string) => void;
  onRoleFilter?: (role: string) => void;
  onDateFilter?: (date: number | null) => void;
  onCalendarClick?: () => void;
  onUsersClick?: () => void;
  className?: string;
}

export const SearchFilterbarv2 = ({
  onSearch,
  onRoleFilter,
  onDateFilter,
  onCalendarClick,
  onUsersClick,
  className,
}: SearchFilterbarv2Props) => {
  const [activeDropdown, setActiveDropdown] = useState<"calendar" | "users" | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedDate, setSelectedDate] = useState<number | null>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCalendarClick = () => {
    setActiveDropdown(activeDropdown === "calendar" ? null : "calendar");
    onCalendarClick?.();
  };

  const handleUsersClick = () => {
    setActiveDropdown(activeDropdown === "users" ? null : "users");
    onUsersClick?.();
  };

  const ROLES = ["All Roles", "Super Admin", "Tenant Admin", "Employee", "Customer"];
  const [selectedRole, setSelectedRole] = useState(ROLES[0]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "w-full flex p-3 bg-white border-2 border-[#E5E5E5] rounded-2xl items-center gap-3 relative",
        className,
      )}
    >
      {/* 1. Action Buttons */}
      <div className="relative h-[52px]">
        <button
          onClick={handleCalendarClick}
          className={cn(
            "h-full w-[52px] flex items-center justify-center bg-white border-2 border-[#E5E5E5] rounded-xl",
            "hover:bg-slate-50 active:scale-95 transition-all group shrink-0",
            activeDropdown === "calendar" && "border-brand-accent shadow-[0_0_0_2px_rgba(255,82,105,0.15)]"
          )}
        >
          <Calendar
            size={20}
            className={cn(
              "text-text-secondary group-hover:text-brand-accent transition-colors",
              activeDropdown === "calendar" && "text-brand-accent"
            )}
          />
        </button>

        {/* Calendar Dropdown UI */}
        {activeDropdown === "calendar" && (
          <div className="absolute top-[110%] left-0 w-[300px] z-50 bg-white border-2 border-[#E5E5E5] rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 p-4">
            <div className="flex items-center justify-between mb-4">
              <button className="p-1 hover:bg-slate-100 rounded-lg text-text-secondary transition-colors"><ChevronLeft size={20} /></button>
              <span className="b3 font-bold text-text-primary">October 2024</span>
              <button className="p-1 hover:bg-slate-100 rounded-lg text-text-secondary transition-colors"><ChevronRight size={20} /></button>
            </div>
            
            {/* Minimal Calendar mock grid */}
            <div className="grid grid-cols-7 gap-1 text-center mb-2">
              {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                <div key={day} className="b5 font-semibold text-text-secondary">{day}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1 text-center">
              {/* Dummy month days to visualize a calendar structure */}
              {Array.from({ length: 31 }).map((_, i) => {
                const day = i + 1;
                const isSelected = selectedDate === day;
                const isToday = day === 31;
                return (
                  <button
                    key={i}
                    onClick={() => {
                      const newDate = isSelected ? null : day;
                      setSelectedDate(newDate);
                      onDateFilter?.(newDate);
                    }}
                    className={cn(
                      "h-8 w-8 mx-auto rounded-full flex items-center justify-center b4 transition-all",
                      isSelected
                        ? "bg-brand-accent text-white font-bold"
                        : isToday
                        ? "bg-brand-primary/20 text-brand-primary font-bold hover:bg-brand-primary/30"
                        : "text-text-primary hover:bg-slate-100"
                    )}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <div className="relative h-[52px]">
        <button
          onClick={handleUsersClick}
          className={cn(
            "h-full w-[52px] flex items-center justify-center bg-white border-2 border-[#E5E5E5] rounded-xl",
            "hover:bg-slate-50 active:scale-95 transition-all group shrink-0",
            activeDropdown === "users" && "border-brand-accent shadow-[0_0_0_2px_rgba(255,82,105,0.15)]"
          )}
        >
          <Users
            size={20}
            className={cn(
              "text-text-secondary group-hover:text-brand-accent transition-colors",
              activeDropdown === "users" && "text-brand-accent"
            )}
          />
        </button>

        {/* Users / Roles Dropdown UI */}
        {activeDropdown === "users" && (
          <div className="absolute top-[110%] left-0 w-[240px] z-50 bg-white border-2 border-[#E5E5E5] rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-5 py-3 border-b border-[#E5E5E5] bg-slate-50">
              <span className="b4 font-bold text-text-primary uppercase tracking-wider">Filter by Role</span>
            </div>
            <ul className="max-h-[280px] overflow-y-auto py-2">
              {ROLES.map((role) => (
                <li
                  key={role}
                  onClick={() => {
                    setSelectedRole(role);
                    onRoleFilter?.(role);
                    setActiveDropdown(null);
                  }}
                  className={cn(
                    "px-5 py-3 b3 cursor-pointer transition-colors hover:bg-slate-50",
                    selectedRole === role ? "text-brand-accent font-semibold bg-red-50/50" : "text-text-primary"
                  )}
                >
                  {role}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* 2. Search Field identical to SearchFilterBar style */}
      <div className="flex-grow w-full h-[52px]">
        <FormField
          label=""
          placeholder="Search User ID, Tenant Name..."
          leftIcon={<Search size={18} />}
          onChange={(e) => onSearch?.(e.target.value)}
          className="max-w-none h-full [&_input]:h-full [&_input]:bg-[#FAF7F2] [&_input]:border-2 [&_input]:border-transparent [&_input]:focus:border-brand-accent [&_input]:focus:shadow-[0_0_0_2px_rgba(255,82,105,0.15)]"
        />
      </div>
    </div>
  );
};