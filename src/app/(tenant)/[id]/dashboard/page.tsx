"use client";

import React from "react";
import { TenantDashboardHeader } from "@/components/organisms/TenantDashboardHeader";
import { TenantMetricsSection } from "@/components/organisms/TenantMetricsSection";
import { SalesAndPurchaseChart } from "@/components/organisms/SalesAndPurchaseChart";
import { OverallInformation } from "@/components/organisms/OverallInformation";
import { DashboardListsSection } from "@/components/organisms/DashboardListsSection";
import { AlertBanner } from "@/components/molecules/AlertBanner";
import Link from "next/link";

export default function TenantDashboardPage() {
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

      <TenantMetricsSection />

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="w-full lg:w-[65%]">
          <SalesAndPurchaseChart />
        </div>
        <div className="w-full lg:w-[35%]">
          <OverallInformation />
        </div>
      </div>

      <DashboardListsSection />
    </>
  );
}
