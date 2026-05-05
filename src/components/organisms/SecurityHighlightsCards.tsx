"use client";

import React from "react";
import { ShieldAlert, Activity, AlertTriangle, UserX } from "lucide-react";
import { cn } from "@/lib/utils";

interface HighlightCardProps {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
  iconBgColor: string;
  iconTextColor: string;
  isAlert?: boolean;
}

const HighlightCard = ({
  title,
  value,
  description,
  icon,
  iconBgColor,
  iconTextColor,
  isAlert = false,
}: HighlightCardProps) => {
  return (
    <div
      className={cn(
        "bg-white rounded-[16px] sm:rounded-[24px] shadow-sm border p-4 sm:p-6 flex flex-col justify-between min-w-0 transition-all duration-300 hover:-translate-y-1 hover:shadow-md cursor-pointer",
        isAlert ? "border-error-primary/30 bg-error-secondary/10" : "border-gray-100"
      )}
    >
      <div className="flex justify-between items-start mb-3 sm:mb-4 gap-2">
        <div className="space-y-0.5 sm:space-y-1 min-w-0">
          <h3 className="text-[11px] sm:text-sm font-medium text-text-secondary leading-tight">
            {title}
          </h3>
          <p className={cn("text-lg sm:text-2xl lg:text-3xl font-bold truncate", isAlert ? "text-error-primary" : "text-text-primary")}>
            {value}
          </p>
        </div>
        <div
          className={cn(
            "w-8 h-8 sm:w-12 sm:h-12 rounded-full flex items-center justify-center shrink-0",
            iconBgColor,
            iconTextColor
          )}
        >
          <div className="scale-75 sm:scale-100 flex items-center justify-center">
            {icon}
          </div>
        </div>
      </div>
      <div className="flex flex-wrap items-center mt-auto">
        <span className="text-[10px] sm:text-sm text-text-secondary truncate">
          {description}
        </span>
      </div>
    </div>
  );
};

export const SecurityHighlightsCards = () => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 w-full">
      <HighlightCard
        title="Total Actions (24h)"
        value="1,248"
        description="Standard system activity."
        icon={<Activity size={24} />}
        iconBgColor="bg-blue-100"
        iconTextColor="text-blue-600"
      />
      <HighlightCard
        title="Critical Actions"
        value="12"
        description="Refunds, deletions, settings."
        icon={<AlertTriangle size={24} />}
        iconBgColor="bg-warning-secondary"
        iconTextColor="text-warning-primary"
      />
      <HighlightCard
        title="Failed Logins"
        value="3"
        description="Suspicious login attempts."
        icon={<UserX size={24} />}
        iconBgColor="bg-error-secondary"
        iconTextColor="text-error-primary"
        isAlert={true}
      />
      <HighlightCard
        title="Security Alerts"
        value="0"
        description="No active breaches detected."
        icon={<ShieldAlert size={24} />}
        iconBgColor="bg-success-secondary"
        iconTextColor="text-success-primary"
      />
    </div>
  );
};
