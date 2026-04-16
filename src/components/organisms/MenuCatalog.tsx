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
  { label: "Snacks", icon: <Pizza size={24} /> },
  { label: "Meal", icon: <Utensils size={24} /> },
  { label: "Vegan", icon: <Leaf size={24} /> },
  { label: "Dessert", icon: <Cake size={24} /> },
  { label: "Drinks", icon: <Coffee size={24} /> },
];

export const MenuItem = ({ item }: { item: MenuItemData }) => {
  return (
    <div className="w-48 h-64 relative group transition-all duration-300 ease-out hover:-translate-y-2">
      {/* The Card Body */}
      <div className="w-48 h-56 px-4 pt-24 pb-5 left-0 top-[34px] absolute bg-[#ffd77a] rounded-2xl inline-flex flex-col justify-start items-start gap-2.5 shadow-sm group-hover:shadow-xl transition-shadow border border-[#ffc670]/20">
        <div className="w-40 h-24 relative">
          <div className="w-40 left-0 top-[0.50px] absolute inline-flex flex-col justify-start items-start gap-1.5">
            <div className="self-stretch justify-start b3 text-[#2d2d2d] line-clamp-2 min-h-[40px]">
              {item.name}
            </div>
            
            <div className="self-stretch flex flex-col justify-center items-start gap-1">
              <div className="text-center justify-start text-[#ff5269] b2 font-bold">
                Php {item.price.toFixed(2)}
              </div>
              <div className="text-center justify-start text-[#707070] b5 font-medium uppercase">
                {item.available ? "Available" : "Sold Out"}
              </div>
            </div>
          </div>

          {/* Action Button*/}
          <div className="w-6 h-6 left-[132px] top-[68px] absolute">
            <button 
              disabled={!item.available}
              className="w-6 h-6 left-0 top-0 absolute bg-[#ff5269] rounded-[5px] flex items-center justify-center text-white hover:opacity-90 transition-all active:scale-90 disabled:bg-gray-400"
            >
              <Plus size={14} strokeWidth={3} />
            </button>
          </div>
        </div>
      </div>

      {/*The Image Circle */}
      <div className="w-32 h-32 left-[32px] top-0 absolute bg-stone-300 rounded-full border-4 border-white shadow-md overflow-hidden z-10">
        <img 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
          src={item.imageUrl} 
          alt={item.name} 
        />
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
    <div className="w-full min-h-screen bg-[#FFF7ED] flex flex-col font-['Inter']">
      
      <div className="px-6 md:px-24 pt-10 pb-6 bg-[#FFF7ED]">
        <SearchFilterBar onSearch={setQuery} />
      </div>

      <div className="px-6 md:px-24 pb-12">
        <div className="w-full bg-white rounded-[40px] shadow-sm border border-orange-100 overflow-hidden">
          
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

          <div className="p-8 md:p-12 -mt-10 bg-white rounded-t-[40px] min-h-[600px] border-t border-orange-100">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-x-6 gap-y-12">
              {filteredItems.map((item) => (
                <MenuItem key={item.id} item={item} />
              ))}
            </div>

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
