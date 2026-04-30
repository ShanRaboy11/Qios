"use client";

import React from "react";
import { FileText, Gift, RefreshCcw, Package } from "lucide-react";
import { KPICard } from "@/components/molecules/KPICard";

export const TenantMetricsSection = () => {
  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Primary KPIs Row */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <KPICard
          title="Total Sales"
          value="$48,988,078"
          percentageChange={35}
          color="primary"
          icon={<FileText size={24} />}
          variant="filled"
        />
        <KPICard
          title="Total Sales"
          value="$48,988,078"
          percentageChange={-35}
          color="accent"
          icon={<Gift size={24} />}
          variant="filled"
        />
        <KPICard
          title="Total Sales"
          value="$48,988,078"
          percentageChange={35}
          color="primary"
          icon={<RefreshCcw size={24} />}
          variant="filled"
        />
        <KPICard
          title="Total Sales"
          value="$48,988,078"
          percentageChange={-35}
          color="accent"
          icon={<Package size={24} />}
          variant="filled"
        />
      </div>

      {/* Secondary KPIs Row */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <KPICard
          title="Profit"
          value="$8,458,798"
          percentageChange={35}
          description="vs Last Month"
          onViewAll={() => {}}
          icon={<FileText size={24} />}
          variant="outlined"
        />
        <KPICard
          title="Profit"
          value="$8,458,798"
          percentageChange={-35}
          description="vs Last Month"
          onViewAll={() => {}}
          icon={<Gift size={24} />}
          variant="outlined"
        />
        <KPICard
          title="Profit"
          value="$8,458,798"
          percentageChange={35}
          description="vs Last Month"
          onViewAll={() => {}}
          icon={<RefreshCcw size={24} />}
          variant="outlined"
        />
        <KPICard
          title="Profit"
          value="$8,458,798"
          percentageChange={-35}
          description="vs Last Month"
          onViewAll={() => {}}
          icon={<Package size={24} />}
          variant="outlined"
        />
      </div>
    </div>
  );
};
