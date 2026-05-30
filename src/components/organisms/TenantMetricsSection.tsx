"use client";

import React from "react";
import { FileText, Gift, RefreshCcw, Package } from "lucide-react";
import { KPICard } from "@/components/molecules/KPICard";

type TenantMetricCard = {
  title: string;
  value: string;
  percentageChange?: number;
  description?: string;
  icon: React.ReactNode;
  variant: "filled" | "outlined";
  color: "primary" | "secondary" | "accent";
};

const fallbackPrimaryCards: TenantMetricCard[] = [
  {
    title: "Total Sales",
    value: "$48,988,078",
    percentageChange: 35,
    icon: <FileText size={24} />,
    variant: "filled",
    color: "primary",
  },
  {
    title: "Inventory Alerts",
    value: "12",
    percentageChange: -35,
    icon: <Gift size={24} />,
    variant: "filled",
    color: "accent",
  },
  {
    title: "Orders Processed",
    value: "98",
    percentageChange: 35,
    icon: <RefreshCcw size={24} />,
    variant: "filled",
    color: "primary",
  },
  {
    title: "Low Stock Items",
    value: "5",
    percentageChange: -35,
    icon: <Package size={24} />,
    variant: "filled",
    color: "accent",
  },
];

const fallbackSecondaryCards: TenantMetricCard[] = [
  {
    title: "Average Order Value",
    value: "$8,458,798",
    percentageChange: 35,
    description: "No order history yet",
    icon: <FileText size={24} />,
    variant: "outlined",
    color: "primary",
  },
  {
    title: "Active Orders",
    value: "18",
    percentageChange: -35,
    description: "Fallback until live data loads",
    icon: <Gift size={24} />,
    variant: "outlined",
    color: "accent",
  },
  {
    title: "Ready Today",
    value: "24",
    percentageChange: 35,
    description: "Ready items from the queue",
    icon: <RefreshCcw size={24} />,
    variant: "outlined",
    color: "primary",
  },
  {
    title: "Inventory Items",
    value: "0",
    percentageChange: -35,
    description: "Add ingredients in Inventory Configuration",
    icon: <Package size={24} />,
    variant: "outlined",
    color: "accent",
  },
];

export interface TenantMetricsSectionProps {
  primaryCards?: TenantMetricCard[];
  secondaryCards?: TenantMetricCard[];
}

export const TenantMetricsSection = ({
  primaryCards = fallbackPrimaryCards,
  secondaryCards = fallbackSecondaryCards,
}: TenantMetricsSectionProps) => {
  return (
    <div className="flex flex-col gap-6 w-full">
      {/* primary KPIs Row */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {primaryCards.slice(0, 4).map((card) => (
          <KPICard key={card.title} {...card} />
        ))}
      </div>

      {/* secondary KPIs Row */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {secondaryCards.slice(0, 4).map((card) => (
          <KPICard key={card.title} {...card} />
        ))}
      </div>
    </div>
  );
};
