"use client";

import React, { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { Plus, Utensils, Pizza, Leaf, Cake, Coffee } from "lucide-react";
import { SearchFilterBar } from "../molecules/SearchFilterBar";

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
  { label: "Snacks", icon: <Pizza size={20} /> },
  { label: "Meal", icon: <Utensils size={20} /> },
  { label: "Vegan", icon: <Leaf size={20} /> },
  { label: "Dessert", icon: <Cake size={20} /> },
  { label: "Drinks", icon: <Coffee size={20} /> },
];

/**
 * NAMED EXPORT: MenuItem
 * Updated with Hover Effects
 */
export const MenuItem = ({ item }: { item: MenuItemData }) => {
  return (
    <div className="relative group pt-12 w-full cursor-pointer">
      {/* Floating Circular Image - Hovers up on group hover */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 z-20 transition-transform duration-300 group-hover:-translate-y-2">
        <div className="w-28 h-28 rounded-full border-4 border-white shadow-lg overflow-hidden bg-stone-200">
          <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
        </div>
      </div>

      {/* Card Body - Glows and lifts on hover */}
      <div className="bg-[#FDE68A] rounded-[24px] pt-20 pb-5 px-5 flex flex-col h-full transition-all duration-300 border border-orange-300/30 group-hover:shadow-xl group-hover:bg-[#fde047] group-hover:border-orange-400">
        <h3 className="text-zinc-800 text-[14px] font-bold leading-tight mb-1 min-h-[35px] line-clamp-2">
          {item.name}
        </h3>
        <p className="text-[#F43F5E] font-extrabold text-base">Php {item.price.toFixed(2)}</p>
        
        <div className="flex justify-between items-center mt-3">
          <span className="text-[10px] text-neutral-500 font-semibold uppercase tracking-tighter">
            {item.available ? "Available" : "Sold Out"}
          </span>
          {/* Button also reacts to card hover */}
          <button className="w-8 h-8 bg-[#F43F5E] rounded-lg text-white flex items-center justify-center shadow-md transition-all group-hover:scale-110 active:scale-95">
            <Plus size={18} strokeWidth={3} />
          </button>
        </div>
      </div>
    </div>
  );
};

/**
 * DEFAULT EXPORT: MenuCatalog
 */
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
    <div className="w-full min-h-screen bg-[#FFF7ED] flex flex-col font-['Inter']">
      
      {/* 1. FIXED TOP SEARCH SECTION */}
      <div className="px-6 md:px-24 pt-10 pb-6 bg-[#FFF7ED]">
        <SearchFilterBar onSearch={setQuery} />
      </div>

      {/* 2. MAIN CATALOG AREA */}
      <div className="px-6 md:px-24 pb-12">
        <div className="w-full bg-white rounded-[40px] shadow-sm border border-orange-100 overflow-hidden">
          
          {/* Header Section (Amber Area with Tabs) */}
          <div className="bg-[#FDE68A] p-8 pb-14">
            <div className="flex gap-6 overflow-x-auto pb-2 scrollbar-hide">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.label}
                  onClick={() => setActiveCategory(cat.label)}
                  className="flex flex-col items-center gap-2 shrink-0 transition-transform active:scale-95"
                >
                  <div className={cn(
                    "w-16 h-16 rounded-2xl flex items-center justify-center transition-all border-2",
                    activeCategory === cat.label 
                      ? "bg-white border-orange-400 text-rose-500 shadow-lg scale-110" 
                      : "bg-white/40 border-transparent text-rose-400 hover:bg-white/80"
                  )}>
                    {cat.icon}
                  </div>
                  <span className={cn(
                    "text-[12px] font-bold tracking-tight",
                    activeCategory === cat.label ? "text-zinc-800" : "text-zinc-500"
                  )}>
                    {cat.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* List Section (White area that overlaps the amber) */}
          <div className="p-8 md:p-12 -mt-10 bg-white rounded-t-[40px] min-h-[600px] border-t border-orange-100">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-x-6 gap-y-12">
              {filteredItems.map((item) => (
                <MenuItem key={item.id} item={item} />
              ))}
            </div>

            {/* Empty State */}
            {filteredItems.length === 0 && (
              <div className="flex flex-col items-center justify-center h-80 text-orange-900/30">
                <p className="text-xl font-bold uppercase">No {activeCategory} found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}