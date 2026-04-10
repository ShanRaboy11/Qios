"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface PriceSummaryProps {
  subtotal: number;
  taxRate: number; // e.g., 0.085 for 8.5%
  className?: string;
}

export const PriceSummary = ({
  subtotal,
  taxRate,
  className,
}: PriceSummaryProps) => {
  const taxAmount = subtotal * taxRate;
  const total = subtotal + taxAmount;

  return (
    <div
      className={cn(
        "w-full bg-[#FAF7F0] border-x-2 border-b-2 border-[#E5E5E5] rounded-b-2xl p-6 flex flex-col gap-4 cursor-default",
        className,
      )}
    >
      {/* Top Divider */}
      <div className="w-full border-t border-[#E5E5E5] pt-4" />

      {/* Pricing Breakdown */}
      <div className="flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <span className="b2 text-text-secondary">Subtotal</span>
          <span className="b2 font-bold text-text-primary">
            ₱ {subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center gap-1.5">
            <span className="b2 text-text-secondary">Tax</span>
            <span className="b5 text-text-secondary font-medium">
              ({(taxRate * 100).toFixed(1)}%)
            </span>
          </div>
          <span className="b2 font-bold text-text-primary">
            ₱{" "}
            {taxAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </span>
        </div>
      </div>

      {/* Bottom Divider */}
      <div className="w-full border-t border-[#E5E5E5]" />

      {/* Total Section */}
      <div className="flex justify-between items-center">
        <span className="h4 font-bold text-text-primary">Total</span>
        <span className="h4 font-bold text-text-primary">
          ₱ {total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </span>
      </div>

      {/* Action Divider (Optional if button follows) */}
      <div className="w-full border-t border-[#E5E5E5] mt-2" />
    </div>
  );
};
