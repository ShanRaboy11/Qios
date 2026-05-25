import React from "react";
import { Button } from "../atoms/Button";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
// import Image from 'next/image'; // can be added later if needed

import { useCart } from "@/contexts/CartContext";

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
  const { currency } = useCart();

  if (variant === "bestseller") {
    return (
      <div
        className={cn(
          "relative w-full h-[160px] sm:h-[180px] md:h-[220px] rounded-[24px] overflow-hidden shadow-sm group hover:shadow-md transition-shadow cursor-pointer",
          className,
        )}
        onClick={onAdd}
      >
        {/* background Image */}
        <div className="absolute inset-0 bg-black/5 z-10 group-hover:bg-transparent transition-colors" />
        <img
          src={imageSrc}
          alt={title || "Best seller"}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />

        {/* price Tag Overlay */}
        <div className="absolute bottom-4 right-0 bg-brand-primary py-1.5 pl-3 pr-2 rounded-l-[16px] shadow-sm transform translate-x-1 group-hover:translate-x-0 transition-transform z-20">
          <span className="text-[#2D2D2D] font-brand-secondary font-bold text-[12px] sm:text-[14px] md:text-[16px] tracking-tight">
            {typeof price === "number" ? `${currency} ${price.toFixed(2)}` : price}
          </span>
        </div>
      </div>
    );
  }

  if (variant === "horizontal") {
    return (
      <div
        className={cn(
          "relative flex items-center w-full max-w-[450px] min-h-[150px] sm:min-h-[170px] group cursor-pointer",
          className,
        )}
        onClick={onAdd}
      >
        {/* card Background Shifted Right */}
        <div className="absolute top-0 bottom-0 right-0 left-12 sm:left-16 bg-brand-primary/20 rounded-[32px] shadow-sm transition-all duration-300 group-hover:shadow-md z-0" />

        {/* protruding Image on the Left */}
        <div className="relative z-10 flex-shrink-0 transition-transform duration-300 group-hover:-translate-x-1 ml-2 sm:ml-0">
          <div className="w-[130px] h-[130px] sm:w-[160px] sm:h-[160px] rounded-full overflow-hidden shadow-lg border-[3px] border-white/10">
            <img
              src={imageSrc}
              alt={title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* content Area */}
        <div className="relative z-10 flex flex-col justify-center flex-grow py-5 pr-6 sm:pr-8 pl-4 sm:pl-5">
          {/* title - Left Aligned */}
          <h3 className="text-text-primary font-brand font-medium text-[20px] sm:text-[22px] leading-[1.25] tracking-tight text-left">
            {title}
          </h3>

          {/* price & Availability - Right Aligned block below */}
          <div className="-mt-1 sm:mt-5 text-right w-full">
            <p className="text-brand-accent font-brand-secondary font-bold text-[22px] sm:text-[26px]">
              {typeof price === "number" ? `${currency} ${price.toFixed(2)}` : price}
            </p>
            {availability && (
              <p className="text-text-secondary font-brand-secondary text-[14px] sm:text-[16px] mt-1 font-medium">
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
      {/* card Background */}
      <div className="bg-brand-primary/20 rounded-[32px] px-5 pb-5 pt-[76px] h-full flex flex-col justify-between shadow-sm hover:shadow-md transition-all duration-300">
        {/* protruding Image */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 transition-transform duration-300 group-hover:-translate-y-2 z-10">
          <div className="w-[140px] h-[140px] rounded-full overflow-hidden shadow-lg border-[4px] border-white/5">
            {/* standard img tag is used here to avoid next.config.js domain issues with external image URLs */}
            <img
              src={imageSrc}
              alt={title}
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        {/* content Area */}
        <div className="text-center mt-2 flex-grow flex flex-col justify-end z-0 pb-4">
          <h3 className="b3 text-[#2D2D2D] font-brand text-left font-bold text-[18px] sm:text-[20px] leading-[1.25] tracking-tight line-clamp-2">
            {title}
          </h3>
          <p className="b2 text-brand-accent font-brand-secondary text-left font-semibold text-[17px] mt-2.5">
            {typeof price === "number" ? `${currency} ${price.toFixed(2)}` : price}
          </p>
          {availability && (
            <p className="text-text-secondary font-brand-secondary text-left text-[12px] mt-1 font-medium">
              {availability}
            </p>
          )}
        </div>

        {/* action Button */}
        <div className="absolute right-5 bottom-5 z-20">
          <Button
            variant="accent"
            shape="rounded"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              onAdd?.();
            }}
            className="w-8 h-8 !rounded-[8px] !p-0 shadow-md hover:scale-105 transition-transform bg-brand-accent"
          >
            <Plus className="text-white" size={18} strokeWidth={3} />
          </Button>
        </div>
      </div>
    </div>
  );
};
