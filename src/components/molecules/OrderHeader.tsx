"use client";

import React from "react";
import { cn } from "@/lib/utils";

export type OrderStatus = "validated" | "voided" | "pending" | "processing";

interface OrderHeaderProps {
  orderId: string;
  tableName: string;
  timestamp: string;
  status: OrderStatus;
  statusLabel: string;
  className?: string;
}

export const OrderHeader = ({
  orderId,
  tableName,
  timestamp,
  status,
  statusLabel,
  className,
}: OrderHeaderProps) => {
  const statusStyles = {
    validated: "bg-[#10B981] text-white",
    voided: "bg-[#EF4444] text-white",
    pending: "bg-[#F59E0B] text-white",
    processing: "bg-brand-primary text-text-primary",
  };

  return (
    <div
      className={cn(
        "w-full bg-[#FFD68A] p-4 md:p-6 transition-all flex flex-col md:flex-row gap-4 cursor-default",
        "items-start justify-between",
        "rounded-t-2xl rounded-b-none",
        className,
      )}
    >
      {/* Left Section: Info Stack */}
      <div className="flex flex-col gap-2">
        <h3 className="h3 font-bold text-text-primary leading-tight">
          Order #{orderId}
        </h3>

        <div className="flex items-center gap-3">
          <div className="px-4 py-1 bg-white/40 backdrop-blur-sm border border-white/20 rounded-full shadow-sm">
            <span className="b5 font-bold text-[#8B5CF6]">{tableName}</span>
          </div>

          <span className="b4 text-text-secondary font-medium">
            {timestamp}
          </span>
        </div>
      </div>

      {/* Right Section: Status Badge */}
      <div
        className={cn(
          "px-4 py-1.5 md:px-6 md:py-2 rounded-full text-center",
          "b5 md:b4 font-bold tracking-wide shadow-sm shrink-0",
          statusStyles[status],
        )}
      >
        {statusLabel}
      </div>
    </div>
  );
};
