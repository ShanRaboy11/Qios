import React from "react";
import { Button } from "../atoms/Button";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
// import Image from 'next/image'; // Can be added later if needed

export interface MenuItemCardProps {
  title?: string;
  price?: string | number;
  imageSrc?: string;
  onAdd?: () => void;
  className?: string;
}

export const MenuItemCard = ({
  title = "Spicy seasoned seafood noodles",
  price = "Php 2.29",
  imageSrc = "/images/noodles.png",
  onAdd,
  className,
}: MenuItemCardProps) => {
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
