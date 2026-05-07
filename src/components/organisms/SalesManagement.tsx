"use client";

import React from "react";
import { SalesMetricCards } from "@/components/organisms/SalesMetricCards";
import { RevenueChart } from "@/components/organisms/RevenueChart";
import { TopSellingItems } from "@/components/organisms/TopSellingItems";
import { TransactionTable } from "@/components/organisms/TransactionTable";

export default function SalesManagement() {
  return (
    <div className="flex flex-col w-full gap-6 md:gap-8">
      {/* top row: kpis */}
      <SalesMetricCards />

      {/* middle row: charts */}
      <div className="w-full">
        <RevenueChart />
      </div>

      {/* bottom row: top items & transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 w-full">
        <div className="lg:col-span-1">
          <TopSellingItems />
        </div>
        <div className="lg:col-span-2">
          <TransactionTable />
        </div>
      </div>
    </div>
  );
}
