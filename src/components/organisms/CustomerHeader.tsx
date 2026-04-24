import React from 'react';
import { Search, User } from 'lucide-react';

export const CustomerHeader = () => {
  return (
    <div className="bg-[#FFDC72] w-full px-6 pt-12 pb-16 sticky top-0 z-30">
      {/* Top action row */}
      <div className="flex items-center gap-4 mb-8">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="text-text-secondary" size={20} />
          </div>
          <input 
            type="text" 
            placeholder="Search" 
            className="w-full bg-transparent border-2 border-text-secondary/20 placeholder:text-text-secondary/70 text-text-primary rounded-full py-3 pl-12 pr-6 outline-none focus:border-brand-accent/50 focus:bg-white/40 transition-colors"
          />
        </div>
        
        <button className="w-12 h-12 bg-white rounded-full flex items-center justify-center shrink-0 shadow-sm hover:shadow-md transition-shadow">
          <User className="text-[#2D2D2D]" size={24} />
        </button>
      </div>

      {/* Greeting text */}
      <div className="flex flex-col gap-1">
        <h1 className="text-[32px] md:text-[40px] font-inter font-bold text-[#2D2D2D] leading-tight">
          Good Morning
        </h1>
        <p className="text-[#2D2D2D]/80 font-inter text-[15px] md:text-[16px]">
          Rise and Shine! It's Breakfast Time
        </p>
      </div>
    </div>
  );
};
