"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { QuantityStepper } from "@/components/molecules/QuantityStepper";
import { Badge, BadgeColor } from "@/components/atoms/Badge";
import { PlusCircle } from "lucide-react";

interface Item {
  id: string;
  name: string;
  customization: string;
  price: number;
  quantity: number;
  badgeColorType: BadgeColor;
}

interface EditableItemListProps {
  items: Item[];
  className?: string;
}

export const EditableItemList = ({
  items,
  className,
}: EditableItemListProps) => {
  return (
    <div
      className={cn(
        "w-full bg-[#FAF7F0] border-x-2 border-b-2 border-[#E5E5E5] cursor-default overflow-hidden",
        className,
      )}
    >
      <div className="px-6 pt-6 pb-2">
        <span className="b4 font-bold text-text-secondary uppercase tracking-[0.15em]">
          Items
        </span>
      </div>

      <div className="flex flex-col">
        {items.map((item, index) => (
          <div
            key={item.id}
            className={cn(
              "flex flex-col sm:flex-row sm:items-center p-6 gap-4 sm:gap-6 transition-colors",
              index !== items.length - 1 && "border-b border-[#E5E5E5]",
            )}
          >
            {/* 1. Left Section: Added flex-1 and items-start to fix badge width */}
            <div className="flex flex-col gap-2.5 items-start flex-1">
              <span className="b2 font-bold text-text-primary">
                {item.name}
              </span>
              <Badge
                color={item.badgeColorType}
                variant="subtle"
                shape="pill"
                className="b5 px-2.5 py-0.5 tracking-wider"
              >
                {item.customization}
              </Badge>
            </div>

            {/* 2. Right Section: Action Group (Stepper + Price) */}
            {/* gap-8 brings the stepper closer to the price than the name */}
            <div className="flex items-center justify-between sm:justify-end gap-8">
              <QuantityStepper initialValue={item.quantity} />

              {/* 3. Price Alignment: Fixed width + text-right + tabular-nums */}
              <span className="b2 font-bold text-text-primary min-w-[90px] text-right tabular-nums">
                ₱{" "}
                {item.price.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                })}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="p-6 border-t border-[#E5E5E5] cursor-pointer hover:bg-black/[0.02] transition-colors group">
        <div className="flex items-center gap-3">
          <PlusCircle className="w-6 h-6 text-text-secondary group-hover:text-brand-primary transition-colors" />
          <span className="b2 font-medium text-text-primary">Add item</span>
        </div>
      </div>
    </div>
  );
};
