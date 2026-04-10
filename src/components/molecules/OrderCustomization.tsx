"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { X, Plus, Minus } from "lucide-react";

interface OrderItemProps {
  name: string;
  customization?: string;
  price: number;
  initialQuantity?: number;
  badge?: string;
  description?: string;
  image?: string;
}

export const ItemCustomization = ({
  name,
  customization,
  price,
  initialQuantity = 1,
  badge,
  description,
  image,
}: OrderItemProps) => {
  const [quantity, setQuantity] = useState(initialQuantity);

  return (
    <div className="w-full flex flex-col gap-6 overflow-hidden">
      {/* 1. Hero Header (image_8f8c60.png) */}
      <div className="relative w-full p-6 sm:p-10 bg-[#FFD670] rounded-[40px] flex flex-col sm:flex-row items-center justify-between gap-6">
        <button className="absolute top-4 right-4 h-10 w-10 bg-white rounded-full flex items-center justify-center shadow-sm hover:scale-105 active:scale-95 transition-transform">
          <X size={20} className="text-text-primary" />
        </button>

        <div className="flex flex-col items-start text-left max-w-md">
          {badge && (
            <span className="px-3 py-1 bg-[#E11D48] text-white text-[10px] font-bold rounded-lg mb-4 uppercase tracking-wider">
              {badge}
            </span>
          )}
          <h1 className="h1 text-text-primary mb-2">{name}</h1>
          <p className="b2 text-text-primary/80">{description}</p>
        </div>

        {image && (
          <div className="w-40 h-40 sm:w-56 sm:h-56 shrink-0 drop-shadow-2xl">
            <img
              src={image}
              alt={name}
              className="w-full h-full object-contain"
            />
          </div>
        )}
      </div>

      {/* 2. Order Row (image_5bdbf0.png) */}
      <div className="w-full p-4 flex items-center justify-between border-b border-[#E5E5E5] group">
        <div className="flex flex-col gap-1">
          <h3 className="b1 font-bold text-text-primary">{name}</h3>
          {customization && (
            <span
              className={cn(
                "inline-block px-3 py-1 rounded-full text-[12px] font-medium w-fit",
                customization.includes("Spicy")
                  ? "bg-[#FFF1F2] text-[#E11D48]"
                  : customization.includes("Gluten")
                    ? "bg-[#F0FDF4] text-[#16A34A]"
                    : "bg-[#F5F3FF] text-[#7C3AED]",
              )}
            >
              {customization}
            </span>
          )}
        </div>

        <div className="flex items-center gap-8">
          {/* Quantity Controls */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setQuantity(Math.max(0, quantity - 1))}
              className="h-8 w-8 rounded-lg border-2 border-[#FFD670] flex items-center justify-center text-[#FFD670] hover:bg-[#FFD670]/10 transition-colors"
            >
              <Minus size={16} strokeWidth={3} />
            </button>
            <span className="b1 font-bold text-text-primary w-4 text-center">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="h-8 w-8 rounded-lg bg-[#FF5C5C] flex items-center justify-center text-white hover:bg-[#EE4B4B] transition-colors"
            >
              <Plus size={16} strokeWidth={3} />
            </button>
          </div>

          {/* Price */}
          <span className="b1 font-bold text-text-primary shrink-0">
            ₱ {(price * quantity).toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
};
