"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Clock } from "lucide-react";

export type ActivityStatus = "completed" | "processing" | "cancelled";

interface ActivityItemProps {
  employeeName: string;
  action: string;
  orderId: string;
  timestamp: string;
  status: ActivityStatus;
  className?: string;
}

export const ActivityItem = ({
  employeeName,
  action,
  orderId,
  timestamp,
  status,
  className,
}: ActivityItemProps) => {
  const statusColors = {
    completed: "bg-success-primary",
    processing: "bg-brand-accent",
    cancelled: "bg-error-primary",
  };

  return (
    <div
      className={cn(
        "flex flex-col gap-1 py-4 border-b border-[#E5E5E5] last:border-0",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-4 w-full">
        <div className="flex items-center gap-2 min-w-0">
          <span
            className={cn(
              "h-2 w-2 rounded-full shrink-0",
              statusColors[status],
            )}
          />
          <span className="b2 font-bold text-text-primary truncate">
            {employeeName}
          </span>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <span className="b2 text-text-secondary">{action}</span>
          <span className="b2 font-medium text-text-secondary">#{orderId}</span>
        </div>
      </div>

      <div className="flex items-center gap-1.5 ml-4 text-text-secondary">
        <Clock size={14} />
        <span className="b5 font-medium">{timestamp}</span>
      </div>
    </div>
  );
};
