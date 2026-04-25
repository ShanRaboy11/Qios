"use client";

import React, { useState } from "react";
import { TabCategoryToggle } from "@/components/molecules/TabCategoryToggle";
import { MenuItemCard } from "@/components/molecules/MenuItemCard";

const CATEGORIES = [
  { label: "Drinks", iconSrc: "/svg/drinks.svg" },
  { label: "Snacks", iconSrc: "/svg/snacks.svg" },
  { label: "Vegan", iconSrc: "/svg/vegan.svg" },
  { label: "Meal", iconSrc: "/svg/meal.svg" },
  { label: "Dessert", iconSrc: "/svg/dessert.svg" },
];

export const CategoryMenuLayout = () => {
  const [activeCategory, setActiveCategory] = useState("Snacks");

  return (
    <div className="relative w-full flex flex-col flex-grow">
      {/* Red Background (Absolute to allow proper z-indexing of tabs over the white canvas) */}
      <div className="absolute top-0 left-0 w-full h-[180px] bg-[#FF4D6D] rounded-t-[40px] z-0 shadow-sm"></div>

      {/* Category Swiper Container (z-30, above white canvas) */}
      <div className="w-full max-w-[500px] md:max-w-[1024px] mx-auto pt-6 relative z-30">
        <div className="flex justify-between items-end w-full overflow-x-auto px-6 no-scrollbar pb-0">
          {CATEGORIES.map((cat) => (
            <TabCategoryToggle
              key={cat.label}
              label={cat.label}
              iconSrc={cat.iconSrc}
              isActive={activeCategory === cat.label}
              onClick={() => setActiveCategory(cat.label)}
              size="sm"
            />
          ))}
        </div>
      </div>

      {/* Main White Canvas Board (z-20) */}
      <div className="flex-grow bg-white w-full rounded-t-[40px] px-6 pt-12 pb-32 flex flex-col items-center relative z-20 shadow-[0_-4px_24px_rgba(0,0,0,0.05)] -mt-8 min-h-[500px]">
        <div className="w-full max-w-[500px] md:max-w-[1024px]">
          <div className="w-full flex flex-col gap-6 animate-in fade-in duration-300">
            <h2 className="text-[#2D2D2D] font-inter font-bold text-[24px]">
              {activeCategory}
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 w-full">
              {/* Mock items for the grid view */}
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex justify-center">
                  <MenuItemCard
                    variant="vertical"
                    title="Spicy seasoned seafood noodles"
                    price={2.29}
                    availability="20 Bowls available"
                    imageSrc="/images/noodles.png"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
