"use client";

import React, { useEffect, useState } from "react";
import { TenantDashboardHeader } from "@/components/organisms/TenantDashboardHeader";
import { TenantMetricsSection } from "@/components/organisms/TenantMetricsSection";
import { SalesAndPurchaseChart } from "@/components/organisms/SalesAndPurchaseChart";
import { OverallInformation } from "@/components/organisms/OverallInformation";
import { DashboardListsSection } from "@/components/organisms/DashboardListsSection";
import { AlertBanner } from "@/components/molecules/AlertBanner";
import Link from "next/link";

const TenantDashboardSkeleton = () => (
  <div className="space-y-6 pb-10">
    <div className="rounded-[24px] p-6 md:p-8 bg-white border border-gray-100 space-y-3">
      <div className="h-8 w-72 max-w-full rounded-md skeleton-shimmer" />
      <div className="h-4 w-80 max-w-full rounded-md skeleton-shimmer" />
    </div>
    <div className="rounded-2xl h-14 w-full skeleton-shimmer" />
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      {Array.from({ length: 8 }).map((_, idx) => (
        <div
          key={`tenant-kpi-skeleton-${idx}`}
          className="rounded-[20px] bg-white border border-gray-100 p-4 space-y-3"
        >
          <div className="h-4 w-24 rounded-md skeleton-shimmer" />
          <div className="h-8 w-20 rounded-md skeleton-shimmer" />
          <div className="h-4 w-28 rounded-md skeleton-shimmer" />
        </div>
      ))}
    </div>
    <div className="flex flex-col lg:flex-row gap-6">
      <div className="w-full lg:w-[65%] rounded-[24px] h-[360px] skeleton-shimmer" />
      <div className="w-full lg:w-[35%] rounded-[24px] h-[360px] skeleton-shimmer" />
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {Array.from({ length: 3 }).map((_, idx) => (
        <div
          key={`tenant-list-skeleton-${idx}`}
          className="rounded-[24px] bg-white border border-gray-100 p-6 space-y-3"
        >
          <div className="h-6 w-44 rounded-md skeleton-shimmer" />
          {Array.from({ length: 4 }).map((__, rowIdx) => (
            <div
              key={`tenant-list-row-skeleton-${idx}-${rowIdx}`}
              className="h-12 w-full rounded-xl skeleton-shimmer"
            />
          ))}
        </div>
      ))}
    </div>
  </div>
);

export default function TenantDashboardPage() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(timeout);
  }, []);

  if (isLoading) {
    return <TenantDashboardSkeleton />;
  }

  return (
    <>
      <TenantDashboardHeader />
      <AlertBanner
        message={
          <>
            Your Ingredient{" "}
            <span className="text-[#EF4444]">Salt is running low.</span>{" "}
            <Link
              href="#"
              className="underline decoration-[#EF4444] text-[#EF4444]"
            >
              Add Stock
            </Link>
          </>
        }
        onClose={() => {}}
      />

      <div id="tutorial-metrics">
        <TenantMetricsSection />
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div id="tutorial-charts" className="w-full lg:w-[65%]">
          <SalesAndPurchaseChart />
        </div>
        <div id="tutorial-overall" className="w-full lg:w-[35%]">
          <OverallInformation />
        </div>
      </div>

      <DashboardListsSection />
    </>
  );
}
