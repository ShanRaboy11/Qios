"use client";

import React from "react";
import { DollarSign, TrendingUp, ShoppingBag, CreditCard } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string;
  trend: number;
  trendLabel?: string;
  icon: React.ReactNode;
  iconBgColor: string;
  iconTextColor: string;
}

const MetricCard = ({
  title,
  value,
  trend,
  trendLabel = "vs last period",
  icon,
  iconBgColor,
  iconTextColor,
}: MetricCardProps) => {
  const isPositive = trend >= 0;

  return (
    <div className="bg-white rounded-[16px] sm:rounded-[24px] shadow-sm border border-gray-100 p-4 sm:p-6 flex flex-col justify-between min-w-0">
      <div className="flex justify-between items-start mb-3 sm:mb-4 gap-2">
        <div className="space-y-0.5 sm:space-y-1 min-w-0">
          <h3 className="text-[11px] sm:text-sm font-medium text-text-secondary leading-tight">
            {title}
          </h3>
          <p className="text-lg sm:text-2xl lg:text-3xl font-bold text-text-primary truncate">
            {value}
          </p>
        </div>
        <div
          className={cn(
            "w-8 h-8 sm:w-12 sm:h-12 rounded-full flex items-center justify-center shrink-0",
            iconBgColor,
            iconTextColor,
          )}
        >
          <div className="scale-75 sm:scale-100 flex items-center justify-center">
            {icon}
          </div>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-auto">
        <span
          className={cn(
            "text-[11px] sm:text-sm font-semibold flex items-center gap-0.5 sm:gap-1",
            isPositive ? "text-success-primary" : "text-error-primary",
          )}
        >
          {isPositive ? "↑" : "↓"} {Math.abs(trend)}%
        </span>
        <span className="text-[10px] sm:text-sm text-text-secondary truncate">{trendLabel}</span>
      </div>
    </div>
  );
};

export const SalesMetricCards = () => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 w-full">
      <MetricCard
        title="Gross Sales"
        value="₱124,500.00"
        trend={12.5}
        icon={<DollarSign size={24} />}
        iconBgColor="bg-green-100"
        iconTextColor="text-green-600"
      />
      <MetricCard
        title="Net Sales"
        value="₱118,250.00"
        trend={11.2}
        icon={<TrendingUp size={24} />}
        iconBgColor="bg-brand-primary/20"
        iconTextColor="text-brand-accent"
      />
      <MetricCard
        title="Total Orders"
        value="1,452"
        trend={8.4}
        icon={<ShoppingBag size={24} />}
        iconBgColor="bg-blue-100"
        iconTextColor="text-blue-600"
      />
      <MetricCard
        title="Average Order Value"
        value="₱85.74"
        trend={-2.1}
        icon={<CreditCard size={24} />}
        iconBgColor="bg-purple-100"
        iconTextColor="text-purple-600"
      />
    </div>
  );
};
