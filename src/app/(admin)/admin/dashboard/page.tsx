"use client";

import React, { useEffect, useState } from "react";
import { AdminDashboardHeader } from "@/components/organisms/AdminDashboardHeader";
import { AdminMetricsRow } from "@/components/organisms/AdminMetricsRow";
import { AdminChartsSection } from "@/components/organisms/AdminChartsSection";
import { AdminListsSection } from "@/components/organisms/AdminListsSection";
import { useRouter } from "next/navigation";

const AdminDashboardSkeleton = () => (
  <div className="space-y-6 pb-10">
    <div className="rounded-[24px] p-6 md:p-8 bg-white border border-gray-100 space-y-3">
      <div className="h-8 w-72 max-w-full rounded-md skeleton-shimmer" />
      <div className="h-4 w-96 max-w-full rounded-md skeleton-shimmer" />
    </div>
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      {Array.from({ length: 4 }).map((_, idx) => (
        <div
          key={`admin-kpi-skeleton-${idx}`}
          className="rounded-[20px] bg-white border border-gray-100 p-4 space-y-3"
        >
          <div className="h-4 w-24 rounded-md skeleton-shimmer" />
          <div className="h-8 w-20 rounded-md skeleton-shimmer" />
          <div className="h-12 w-full rounded-xl skeleton-shimmer" />
        </div>
      ))}
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6">
      <div className="lg:col-span-3 rounded-[24px] bg-white border border-gray-100 p-6 h-[320px] skeleton-shimmer" />
      <div className="lg:col-span-6 rounded-[24px] bg-white border border-gray-100 p-6 h-[320px] skeleton-shimmer" />
      <div className="lg:col-span-3 rounded-[24px] bg-white border border-gray-100 p-6 h-[320px] skeleton-shimmer" />
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
      {Array.from({ length: 3 }).map((_, idx) => (
        <div
          key={`admin-list-skeleton-${idx}`}
          className="rounded-[24px] bg-white border border-gray-100 p-6 space-y-3"
        >
          <div className="h-6 w-44 rounded-md skeleton-shimmer" />
          {Array.from({ length: 4 }).map((__, rowIdx) => (
            <div
              key={`admin-list-row-skeleton-${idx}-${rowIdx}`}
              className="h-12 w-full rounded-xl skeleton-shimmer"
            />
          ))}
        </div>
      ))}
    </div>
  </div>
);

export default function AdminDashboardPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(timeout);
  }, []);

  if (isLoading) {
    return <AdminDashboardSkeleton />;
  }

  return (
    <>
      <AdminDashboardHeader
        onCompaniesClick={() => router.push("/admin/tenant_directory")}
        isCompaniesActive={false}
      />
      <AdminMetricsRow />
      <AdminChartsSection />
      <AdminListsSection
        onViewSystemActivity={() => router.push("/admin/system_activity")}
        onViewPendingTenants={() =>
          router.push("/admin/tenant_directory?filter=Pending")
        }
      />
    </>
  );
}
