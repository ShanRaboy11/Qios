import React from "react";
import { Button } from "../atoms/Button";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
// import Image from 'next/image'; // Can be added later if needed

export interface MenuItemCardProps {
  title?: string;
  price?: string | number;
  imageSrc?: string;
  variant?: "vertical" | "horizontal" | "bestseller";
  availability?: string;
  onAdd?: () => void;
  className?: string;
}

export const MenuItemCard = ({
  title = "Spicy seasoned seafood noodles",
  price = 2.29,
  imageSrc = "/images/noodles.png",
  variant = "vertical",
  availability,
  onAdd,
  className,
}: MenuItemCardProps) => {

  if (variant === "bestseller") {
    return (
      <div 
        className={cn("relative w-[110px] h-[160px] sm:w-[130px] sm:h-[180px] md:w-[150px] md:h-[220px] rounded-[24px] overflow-hidden shadow-sm group hover:shadow-md transition-shadow cursor-pointer flex-shrink-0", className)} 
        onClick={onAdd}
      >
        {/* Background Image */}
        <div className="absolute inset-0 bg-black/5 z-10 group-hover:bg-transparent transition-colors" />
        <img 
          src={imageSrc} 
          alt={title || "Best seller"} 
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
        />
        
        {/* Price Tag Overlay */}
        <div className="absolute bottom-4 right-0 bg-[#FFDC72] py-1.5 pl-3 pr-2 rounded-l-[16px] shadow-sm transform translate-x-1 group-hover:translate-x-0 transition-transform z-20">
          <span className="text-[#2D2D2D] font-inter font-bold text-[12px] sm:text-[14px] md:text-[16px] tracking-tight">
            {typeof price === "number" ? `$${price.toFixed(2)}` : price}
          </span>
        </div>
      </div>
    );
  }

  if (variant === "horizontal") {
    return (
      <div className={cn("relative flex items-center w-full max-w-[450px] min-h-[150px] sm:min-h-[170px] group", className)}>
        {/* Card Background Shifted Right */}
        <div className="absolute top-0 bottom-0 right-0 left-12 sm:left-16 bg-[#FFDC72] rounded-[32px] shadow-sm transition-all duration-300 group-hover:shadow-md z-0" />
        
        {/* Protruding Image on the Left */}
        <div className="relative z-10 flex-shrink-0 transition-transform duration-300 group-hover:-translate-x-1 ml-2 sm:ml-0">
          <div className="w-[130px] h-[130px] sm:w-[160px] sm:h-[160px] rounded-full overflow-hidden shadow-lg border-[3px] border-white/10">
            <img
              src={imageSrc}
              alt={title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Content Area */}
        <div className="relative z-10 flex flex-col justify-center flex-grow py-5 pr-6 sm:pr-8 pl-4 sm:pl-5">
          {/* Title - Left Aligned */}
          <h3 className="text-[#2D2D2D] font-inter font-bold text-[18px] sm:text-[22px] leading-[1.25] tracking-tight text-left">
            {title}
          </h3>
          
          {/* Price & Availability - Right Aligned block below */}
          <div className="mt-4 sm:mt-5 text-right w-full">
            <p className="text-[#FF5269] font-inter font-bold text-[22px] sm:text-[26px]">
              {typeof price === "number" ? `Php ${price.toFixed(2)}` : price}
            </p>
            {availability && (
              <p className="text-text-secondary font-inter text-[14px] sm:text-[16px] mt-1 font-medium">
                {availability}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("relative pt-16 w-full max-w-[220px] group", className)}>
      {/* Card Background */}
      <div className="bg-[#FFDC72] rounded-[32px] px-5 pb-5 pt-[76px] h-full flex flex-col justify-between shadow-sm hover:shadow-md transition-all duration-300">
        {/* Protruding Image */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 transition-transform duration-300 group-hover:-translate-y-2 z-10">
          <div className="w-[140px] h-[140px] rounded-full overflow-hidden shadow-lg border-[4px] border-white/5">
            {/* Standard img tag is used here to avoid next.config.js domain issues with external image URLs */}
            <img
              src={imageSrc}
              alt={title}
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        {/* Content Area */}
        <div className="text-left mt-2 flex-grow flex flex-col justify-end z-0">
          <h3 className="b3 text-[#2D2D2D] font-inter font-bold text-[18px] leading-[1.25] tracking-tight line-clamp-2">
            {title}
          </h3>
          <p className="b2 text-brand-accent font-inter font-semibold text-[17px] mt-2.5">
            {typeof price === "number" ? `Php ${price.toFixed(2)}` : price}
          </p>
        </div>

        {/* Action Button */}
        <div className="flex justify-end mt-4">
          <Button
            variant="accent"
            shape="rounded"
            size="icon"
            onClick={onAdd}
            className="w-10 h-10 !rounded-[12px] !p-0 shadow-md hover:scale-105 transition-transform"
          >
            <Plus className="text-[#FFDC72]" size={22} strokeWidth={3} />
          </Button>
        </div>
      </div>
    </div>
  );
};
