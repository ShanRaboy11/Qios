"use client";

import React, { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { Plus, Utensils, Pizza, Leaf, Cake, Coffee, Search, SlidersHorizontal } from "lucide-react";
import { FormField } from "@/components/molecules/FormField";

export type Category = "Snacks" | "Meal" | "Vegan" | "Dessert" | "Drinks";

export interface MenuItemData {
  id: string;
  name: string;
  price: number;
  available: boolean;
  category: Category;
  imageUrl: string;
}

const CATEGORIES: { label: Category; icon: React.ReactNode }[] = [
  { label: "Snacks", icon: <Pizza size={24} /> },
  { label: "Meal", icon: <Utensils size={24} /> },
  { label: "Vegan", icon: <Leaf size={24} /> },
  { label: "Dessert", icon: <Cake size={24} /> },
  { label: "Drinks", icon: <Coffee size={24} /> },
];

export const MenuItem = ({ item }: { item: MenuItemData }) => {
  return (
    <div className="w-48 h-60 relative group transition-all duration-300 ease-out hover:-translate-y-1">
      <div className="w-48 h-60 px-4 pt-24 pb-5 left-0 top-[50px] absolute bg-[#ffd77a] rounded-2xl inline-flex flex-col justify-start items-start gap-2.5 shadow-sm group-hover:shadow-xl transition-shadow border border-[#ffc670]/20">
        <div className="w-40 h-24 relative">
          <div className="w-40 left-0 top-[10px] absolute inline-flex flex-col justify-start items-start gap-1">
            <div className="self-stretch justify-start b3 text-[#2d2d2d] line-clamp-2 min-h-[40px]">
              {item.name}
            </div>
            <div className="self-stretch flex flex-col justify-center items-start gap-2">
              <div className="text-center justify-start text-[#ff5269] b2 font-bold">
                Php {item.price.toFixed(2)}
              </div>
              <div className="text-center justify-start text-[#707070] b5 font-medium uppercase">
                {item.available ? "Available" : "Sold Out"}
              </div>
            </div>
          </div>
          <div className="w-6 h-6 left-[132px] top-[99px] absolute">
            <button 
              disabled={!item.available}
              className="w-6 h-6 left-0 top-0 absolute bg-[#ff5269] rounded-[5px] flex items-center justify-center text-white hover:opacity-90 transition-all active:scale-90 disabled:bg-gray-400"
            >
              <Plus size={14} strokeWidth={3} />
            </button>
          </div>
        </div>
      </div>
      <div className="w-32 h-32 left-[32px] top-3 absolute bg-stone-300 rounded-full shadow-md overflow-hidden z-10">
        <img className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" src={item.imageUrl} alt={item.name} />
      </div>
    </div>
  );
};

export default function MenuCatalog({ initialItems }: { initialItems: MenuItemData[] }) {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<Category>("Snacks");

  const filteredItems = useMemo(() => {
    return initialItems.filter((item) => {
      const matchesSearch = item.name.toLowerCase().includes(query.toLowerCase());
      const matchesCategory = item.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [initialItems, query, activeCategory]);

  return (
    <div className="w-full min-h-screen bg-[#fff9ef] px-4 md:px-12 lg:px-24 py-12 flex flex-col gap-8 items-center">
      
      <div className="w-full max-w-[1239px] flex flex-row items-center gap-3">
        <div className="flex-grow">
          <FormField
            label=""
            placeholder="Search for food, drinks, etc..."
            leftIcon={<Search size={20} className="text-[#707070]" />}
            onChange={(e) => setQuery(e.target.value)}
            value={query}
            className="max-w-none" 
          />
        </div>
        <button
          type="button"
          onClick={() => console.log("Filter Clicked")}
          className="h-[52px] px-6 flex items-center gap-2 bg-white border-2 border-[#E5E5E5] rounded-2xl hover:bg-slate-50 active:scale-95 transition-all group shrink-0 hidden md:flex"
        >
          <SlidersHorizontal size={18} className="text-[#707070] group-hover:text-[#ffc670]" />
          <span className="b2 font-bold text-[#707070] group-hover:text-[#2d2d2d]">Filters</span>
        </button>
      </div>

      <div className="w-[1239px] h-[800px] bg-[#ffd77a] rounded-tl-[30px] rounded-tr-[30px] border-[1.50px] border-orange-300 relative flex flex-col overflow-hidden">
        
        <div className="pt-6 px-10 flex items-end gap-1 overflow-x-auto scrollbar shrink-0 w-full">
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.label;
            return (
              <button
                key={cat.label}
                onClick={() => setActiveCategory(cat.label)}
                className={cn(
                  "flex flex-col items-center transition-all duration-300 min-w-[100px] shrink-0", 
                  isActive 
                    ? "bg-[#fff9ef] rounded-t-[40px] pt-4 pb-0 z-10" 
                    : "pb-8"
                )}
              >
                <div className={cn(
                  "w-16 h-20 md:w-16 md:h-20 rounded-tl-[35px] rounded-tr-[35px] to rounded-[35px] flex items-center justify-center transition-all duration-300",
                  isActive ? "bg-[#ffd77a] scale-90" : "bg-white shadow-sm"
                )}>
                  <div className="text-[#ff5269]">
                    <div className="scale-90 md:scale-100">{cat.icon}
                    </div>
                  </div>
                </div>

                <span className={cn(
                  "mt-2 b4 font-bold transition-all",
                  isActive ? "text-[#2d2d2d] mb-4" : "text-[#2d2d2d]"
                )}>
                  {cat.label}
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex-1 bg-[#fff9ef] rounded-t-[50px] overflow-y-auto relative -mt-[1px]">
          <div className={cn(
            "absolute inset-0 top-10 bottom-4 overflow-y-auto px-10 md:px-14",
            "scrollbar-thin scrollbar-thumb-orange-200 scrollbar-track-transparent hover:scrollbar-thumb-orange-300"
          )}> 
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-x-8 gap-y-16 justify-items-center">
              {filteredItems.map((item) => (
                <MenuItem key={item.id} item={item} />
              ))}
            </div>
            
            {filteredItems.length === 0 && (
              <div className="h-64 flex items-center justify-center text-[#707070] italic">
                No items available
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}