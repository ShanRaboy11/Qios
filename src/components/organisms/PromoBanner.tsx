import React from 'react';
import { cn } from '@/lib/utils';

export interface PromoBannerProps {
  className?: string;
}

export const PromoBanner = ({ className }: PromoBannerProps) => {
  return (
    <div className={cn("w-full flex flex-col items-center", className)}>
      {/* Banner Container */}
      <div className="w-full relative bg-brand-accent rounded-[32px] overflow-hidden flex shadow-sm min-h-[160px] md:min-h-[200px]">
        
        {/* Left Section (Text & Decor) */}
        <div className="w-1/2 relative p-6 flex flex-col justify-center items-center text-center z-10 overflow-hidden">
          {/* Abstract Circular Decors */}
          <div className="absolute -top-10 -left-6 w-24 h-24 rounded-full border-[6px] border-white/20 blur-[1px]" />
          <div className="absolute -bottom-8 -left-4 w-20 h-20 rounded-full border-[8px] border-white/30" />
          <div className="absolute -top-6 right-0 w-16 h-16 rounded-full border-[4px] border-white/20" />
          
          <div className="relative z-20">
            <p className="text-[#2D2D2D] font-inter text-[12px] md:text-[14px] leading-tight opacity-90 max-w-[120px] mx-auto">
              Experience our delicious new dish
            </p>
            <h2 className="text-[#2D2D2D] font-inter font-black text-[22px] md:text-[28px] tracking-tight mt-1">
              30% Discount
            </h2>
          </div>
        </div>

        {/* Right Section (Image) */}
        <div className="w-1/2 relative h-full">
          {/* We'll use the provided lasagna image or fallback */}
          <img 
            src="/images/lasagna.png" 
            alt="Delicious new dish promotion" 
            className="absolute inset-0 w-full h-full object-cover rounded-l-[40px] md:rounded-l-[80px]" 
          />
        </div>
      </div>

      {/* Carousel Dots */}
      <div className="flex gap-2 mt-6">
        <div className="w-6 h-1.5 rounded-full bg-[#FFDC72]" />
        <div className="w-4 h-1.5 rounded-full bg-[#FFDC72]/30" />
        <div className="w-4 h-1.5 rounded-full bg-[#FFDC72]/30" />
        <div className="w-4 h-1.5 rounded-full bg-[#FFDC72]/30" />
      </div>
    </div>
  );
};
