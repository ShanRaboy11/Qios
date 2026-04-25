"use client";

import React, { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { cn } from "@/lib/utils";

export interface Category {
  id: string;
  label: string;
  iconSrc: string;
}

export interface CategoryTabBarProps {
  categories: Category[];
  activeCategory: string | null;
  onSelectCategory: (id: string | null) => void;
  isCategoryView: boolean;
}

export const CategoryTabBar = ({
  categories,
  activeCategory,
  onSelectCategory,
  isCategoryView,
}: CategoryTabBarProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);
  const [indicatorStyle, setIndicatorStyle] = useState({ width: 0, x: 0 });

  // Update target coordinates when activeCategory changes or resizes
  useEffect(() => {
    if (!containerRef.current || !activeCategory || !isCategoryView) return;

    // Small delay to ensure DOM is fully laid out before measuring
    const timeout = setTimeout(() => {
      if (!containerRef.current) return;
      const activeTabEl = containerRef.current.querySelector(
        `[data-tab-id="${activeCategory}"]`,
      ) as HTMLElement;

      if (activeTabEl) {
        const parentRect = containerRef.current.getBoundingClientRect();
        const tabRect = activeTabEl.getBoundingClientRect();

        // Calculate relative position factoring in scroll
        const relativeLeft =
          tabRect.left - parentRect.left + containerRef.current.scrollLeft;

        setIndicatorStyle({
          width: tabRect.width,
          x: relativeLeft,
        });
      }
    }, 50);

    return () => clearTimeout(timeout);
  }, [activeCategory, categories, isCategoryView]);

  useGSAP(
    () => {
      if (indicatorRef.current && isCategoryView && activeCategory) {
        // Set initial visibility if it's the first time
        gsap.set(indicatorRef.current, { opacity: 1 });

        // Slide the pill to the new position
        gsap.to(indicatorRef.current, {
          x: indicatorStyle.x,
          width: indicatorStyle.width,
          duration: 0.5,
          ease: "back.out(1.7)",
        });
      } else if (indicatorRef.current && (!isCategoryView || !activeCategory)) {
        gsap.to(indicatorRef.current, {
          opacity: 0,
          duration: 0.2,
        });
      }
    },
    {
      dependencies: [indicatorStyle, isCategoryView, activeCategory],
      scope: containerRef,
    },
  );

  return (
    <div
      className="relative w-full overflow-x-auto no-scrollbar pb-4 pt-10"
      ref={containerRef}
    >
      <div className="flex justify-between items-end gap-2 w-max min-w-full px-6 relative">
        {/* The sliding white background indicator with inverted corners */}
        <div
          ref={indicatorRef}
          className={cn(
            "absolute -mb-3 h-[140px] bg-white rounded-t-[30px] z-0 pointer-events-none opacity-0",
            // Inverted border-radius pseudo-elements
            "before:content-[''] before:absolute before:-bottom-[1px] before:-left-[20px] before:w-[20px] before:h-[20px] before:bg-transparent before:rounded-br-[20px] before:shadow-[10px_0_0_0_white]",
            "after:content-[''] after:absolute after:-bottom-[1px] after:-right-[20px] after:w-[20px] after:h-[20px] after:bg-transparent after:rounded-bl-[20px] after:shadow-[-10px_0_0_0_white]",
          )}
          style={{
            // Initial position before GSAP takes over (if we wanted to hardcode)
            left: 0,
          }}
        />

        {categories.map((cat) => {
          const isActive = activeCategory === cat.id;

          return (
            <button
              key={cat.id}
              data-tab-id={cat.id}
              onClick={() => onSelectCategory(isActive ? null : cat.id)}
              className="flex flex-col items-center justify-center group outline-none z-10 w-20 relative"
            >
              <div
                className={cn(
                  "w-20 h-24 p-2 flex items-center justify-center transition-all duration-300",
                  isCategoryView
                    ? isActive
                      ? "bg-transparent scale-110" // The white background is provided by the sliding indicator
                      : "bg-[#FFF9EF] rounded-[30px] scale-90"
                    : isActive
                      ? "bg-[#FFDC72] rounded-[30px] shadow-sm transform scale-100"
                      : "bg-[#FEF5E7] rounded-[30px] group-hover:bg-[#FFDC72]/60 group-hover:scale-110",
                )}
              >
                <img
                  src={cat.iconSrc}
                  alt={cat.label}
                  className={cn(
                    "w-12 h-12 object-contain transition-transform duration-300",
                    isActive ? "scale-110" : "group-hover:scale-110",
                  )}
                />
              </div>
              <span
                className={cn(
                  "font-figtree font-semibold text-[15px] transition-colors duration-300",
                  isCategoryView && !isActive ? "text-[#2D2D2D]  " : "",
                  isCategoryView && isActive ? "text-[#2D2D2D]" : "",
                  !isCategoryView && isActive ? "text-text-primary mt-2" : "",
                  !isCategoryView && !isActive
                    ? "text-text-primary/70 group-hover:text-text-primary mt-2"
                    : "",
                )}
              >
                {cat.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
