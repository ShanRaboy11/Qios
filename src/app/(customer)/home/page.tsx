"use client";

import React, { useState } from "react";

import { CustomerHeader } from "@/components/organisms/CustomerHeader";
import { CategoryToggle } from "@/components/molecules/CategoryToggle";
import { MenuItemCard } from "@/components/molecules/MenuItemCard";
import { PromoBanner } from "@/components/organisms/PromoBanner";
import { InventoryRecipeMatrix } from "@/components/organisms/InventoryRecipeMatrix";
import { ChevronRight } from "lucide-react";

export default function CustomerHomePage() {
  const [activeCategory, setActiveCategory] = useState("Meal");

  return (
    <main className="flex flex-col min-h-screen bg-[#FFDC72] w-full overflow-x-hidden relative">


      <div className="w-full max-w-[500px] md:max-w-none mx-auto flex-grow flex flex-col relative pb-0 md:pb-10">
        
        {/* Mobile/Tablet Header (Yellow Block) */}
        <CustomerHeader />

        {/* Main White Canvas Board */}
        <div className="flex-grow bg-white w-full rounded-t-[40px] px-6 pt-8 pb-32 flex flex-col items-center relative -mt-8 z-40 shadow-[0_-4px_24px_rgba(0,0,0,0.05)] md:-mt-12">
          
          <div className="w-full max-w-[500px] md:max-w-[1024px]">
            {/* Category Swiper */}
            <div className="flex justify-between items-center gap-2 mb-10 w-full overflow-x-auto pb-4 no-scrollbar">
              <CategoryToggle 
                label="Drinks" 
                iconSrc="/svg/drinks.svg" 
                isActive={activeCategory === "Drinks"} 
                onClick={() => setActiveCategory("Drinks")}
                size="sm" 
              />
              <CategoryToggle 
                label="Snacks" 
                iconSrc="/svg/snacks.svg" 
                isActive={activeCategory === "Snacks"} 
                onClick={() => setActiveCategory("Snacks")}
                size="sm" 
              />
              <CategoryToggle 
                label="Vegan" 
                iconSrc="/svg/vegan.svg" 
                isActive={activeCategory === "Vegan"} 
                onClick={() => setActiveCategory("Vegan")}
                size="sm" 
              />
              <CategoryToggle 
                label="Meal" 
                iconSrc="/svg/meal.svg" 
                isActive={activeCategory === "Meal"} 
                onClick={() => setActiveCategory("Meal")}
                size="sm" 
              />
              <CategoryToggle 
                label="Dessert" 
                iconSrc="/svg/dessert.svg" 
                isActive={activeCategory === "Dessert"} 
                onClick={() => setActiveCategory("Dessert")}
                size="sm" 
              />
            </div>

            {/* Best Seller Section */}
            <div className="mb-10 w-full">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-[#2D2D2D] font-inter font-bold text-[22px]">Best Seller</h3>
                <button className="flex items-center gap-1 text-brand-accent font-inter text-[14px]">
                  View All <ChevronRight size={16} />
                </button>
              </div>
              
              <div className="flex flex-nowrap w-full justify-between sm:justify-start gap-4 pb-4">
                <MenuItemCard
                  variant="bestseller"
                  price={105.50}
                  imageSrc="/images/sushi.png"
                  title="Sushi"
                />
                <MenuItemCard
                  variant="bestseller"
                  price={250.50}
                  imageSrc="/images/steak.png"
                  title="Steak"
                />
                <MenuItemCard
                  variant="bestseller"
                  price={80.50}
                  imageSrc="/images/pasta.png"
                  title="Pasta"
                />
                <MenuItemCard
                  variant="bestseller"
                  price={100.50}
                  imageSrc="/images/cupcake.png"
                  title="Cupcake"
                />
                <MenuItemCard
                  variant="bestseller"
                  price={120.00}
                  imageSrc="/images/noodles.png"
                  title="Noodles"
                />
              </div>
            </div>

            {/* Promo Banner Section */}
            <div className="mb-10 w-full">
               <PromoBanner />
            </div>

            {/* === New Inventory Matrix Section === */}
            <div className="mb-10 w-full -mx-4 md:mx-0 lg:-ml-12 overflow-hidden rounded-[24px]">
               <InventoryRecipeMatrix />
            </div>

            {/* Recommended For You Section */}
            <div className="w-full">
              <h3 className="text-[#2D2D2D] font-inter font-bold text-[22px] mb-6">Recommended For You</h3>
              
              <div className="flex flex-col gap-6 w-full">
                <MenuItemCard 
                  variant="horizontal" 
                  title="Spicy seasoned seafood noodles" 
                  price={2.29} 
                  availability="20 Bowls available"
                  imageSrc="/images/noodles.png"
                />
                <MenuItemCard 
                  variant="horizontal" 
                  title="Spicy seasoned seafood noodles" 
                  price={2.29} 
                  availability="20 Bowls available"
                  imageSrc="/images/noodles.png" /* Just repeating to match the design grid */
                />
              </div>
            </div>

          </div>
        </div>
      </div>

    </main>
  );
}
