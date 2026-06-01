"use client";

import React, { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import {
  Calendar,
  Search,
  Users,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { FormField } from "@/components/molecules/FormField";

export interface SearchFilterbarv2Props {
  onSearch?: (value: string) => void;
  onRoleFilter?: (role: string) => void;
  onDateFilter?: (date: string | null) => void;
  onCalendarClick?: () => void;
  onUsersClick?: () => void;
  className?: string;
}

const ROLES = ["All Roles", "Super Admin", "Admin", "Employee", "Customer"];

const getDaysInMonth = (date: Date) => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1).getDay(); // 0 = Sunday
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  return { firstDay, daysInMonth, year, month };
};

export const SearchFilterbarv2 = ({
  onSearch,
  onRoleFilter,
  onDateFilter,
  onCalendarClick,
  onUsersClick,
  className,
}: SearchFilterbarv2Props) => {
  const [activeDropdown, setActiveDropdown] = useState<
    "calendar" | "users" | null
  >(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Calendar state
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [calendarMonth, setCalendarMonth] = useState(new Date());

  // Role state
  const [selectedRole, setSelectedRole] = useState(ROLES[0]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
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

  const handlePrevMonth = () => {
    const { year, month } = getDaysInMonth(calendarMonth);
    setCalendarMonth(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    const { year, month } = getDaysInMonth(calendarMonth);
    setCalendarMonth(new Date(year, month + 1, 1));
  };

  const handleDayClick = (day: number, year: number, month: number) => {
    const clicked = new Date(year, month, day);
    const isAlreadySelected =
      selectedDate?.toDateString() === clicked.toDateString();

    if (isAlreadySelected) {
      setSelectedDate(null);
      onDateFilter?.(null);
    } else {
      setSelectedDate(clicked);
      // Pass ISO date string "YYYY-MM-DD"
      const iso = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      onDateFilter?.(iso);
    }
  };

  const handleClearDate = () => {
    setSelectedDate(null);
    onDateFilter?.(null);
  };

  // Build calendar grid
  const renderCalendar = () => {
    const { firstDay, daysInMonth, year, month } =
      getDaysInMonth(calendarMonth);
    const today = new Date();
    const monthLabel = calendarMonth.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });

    return (
      <div className="absolute top-[110%] left-0 w-[300px] z-50 bg-white border-2 border-[#E5E5E5] rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 p-4">
        {/* Month Navigation */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={handlePrevMonth}
            className="p-1 hover:bg-slate-100 rounded-lg text-text-secondary transition-colors"
            aria-label="Previous month"
          >
            <ChevronLeft size={20} />
          </button>
          <span className="b3 font-bold text-text-primary">{monthLabel}</span>
          <button
            onClick={handleNextMonth}
            className="p-1 hover:bg-slate-100 rounded-lg text-text-secondary transition-colors"
            aria-label="Next month"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Day-of-week Headers */}
        <div className="grid grid-cols-7 gap-1 text-center mb-2">
          {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
            <div key={d} className="b5 font-semibold text-text-secondary">
              {d}
            </div>
          ))}
        </div>

        {/* Day Grid */}
        <div className="grid grid-cols-7 gap-1 text-center">
          {/* Leading blank slots for correct weekday alignment */}
          {Array.from({ length: firstDay }).map((_, i) => (
            <div key={`blank-${i}`} />
          ))}

          {/* Day buttons */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const thisDate = new Date(year, month, day);
            const isSelected =
              selectedDate?.toDateString() === thisDate.toDateString();
            const isToday = today.toDateString() === thisDate.toDateString();

            return (
              <button
                key={day}
                onClick={() => handleDayClick(day, year, month)}
                className={cn(
                  "h-8 w-8 mx-auto rounded-full flex items-center justify-center b4 transition-all",
                  isSelected
                    ? "bg-brand-accent text-white font-bold"
                    : isToday
                      ? "bg-brand-primary/20 text-brand-primary font-bold hover:bg-brand-primary/30"
                      : "text-text-primary hover:bg-slate-100",
                )}
                aria-label={thisDate.toDateString()}
                aria-pressed={isSelected}
              >
                {day}
              </button>
            );
          })}
        </div>

        {/* Clear Selection */}
        {selectedDate && (
          <button
            onClick={handleClearDate}
            className="mt-3 w-full text-center b5 text-brand-accent hover:underline transition-opacity"
          >
            Clear date
          </button>
        )}
      </div>
    );
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        "w-full flex p-3 bg-white border-2 border-[#E5E5E5] rounded-2xl items-center gap-3 relative",
        className,
      )}
    >
      {/* Calendar Button + Dropdown */}
      <div className="relative h-[52px]">
        <button
          onClick={handleCalendarClick}
          className={cn(
            "h-full w-[52px] flex items-center justify-center bg-white border-2 border-[#E5E5E5] rounded-xl",
            "hover:bg-slate-50 active:scale-95 transition-all group shrink-0",
            activeDropdown === "calendar" &&
              "border-brand-accent shadow-[0_0_0_2px_rgba(255,82,105,0.15)]",
          )}
          aria-label="Toggle calendar filter"
          aria-expanded={activeDropdown === "calendar"}
        >
          <Calendar
            size={20}
            className={cn(
              "text-text-secondary group-hover:text-brand-accent transition-colors",
              activeDropdown === "calendar" && "text-brand-accent",
              // Show accent dot indicator when a date is selected
              selectedDate && "text-brand-accent",
            )}
          />
        </button>

        {/* Selected date indicator dot */}
        {selectedDate && (
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-brand-accent pointer-events-none" />
        )}

        {activeDropdown === "calendar" && renderCalendar()}
      </div>

      {/* Users / Roles Button + Dropdown */}
      <div className="relative h-[52px]">
        <button
          onClick={handleUsersClick}
          className={cn(
            "h-full w-[52px] flex items-center justify-center bg-white border-2 border-[#E5E5E5] rounded-xl",
            "hover:bg-slate-50 active:scale-95 transition-all group shrink-0",
            activeDropdown === "users" &&
              "border-brand-accent shadow-[0_0_0_2px_rgba(255,82,105,0.15)]",
          )}
          aria-label="Toggle role filter"
          aria-expanded={activeDropdown === "users"}
        >
          <Users
            size={20}
            className={cn(
              "text-text-secondary group-hover:text-brand-accent transition-colors",
              activeDropdown === "users" && "text-brand-accent",
              selectedRole !== ROLES[0] && "text-brand-accent",
            )}
          />
        </button>

        {/* Selected role indicator dot */}
        {selectedRole !== ROLES[0] && (
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-brand-accent pointer-events-none" />
        )}

        {activeDropdown === "users" && (
          <div className="absolute top-[110%] left-0 w-[240px] z-50 bg-white border-2 border-[#E5E5E5] rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-5 py-3 border-b border-[#E5E5E5] bg-slate-50">
              <span className="b4 font-bold text-text-primary uppercase tracking-wider">
                Filter by Role
              </span>
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
                    selectedRole === role
                      ? "text-brand-accent font-semibold bg-red-50/50"
                      : "text-text-primary",
                  )}
                >
                  {role}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Search Field */}
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
