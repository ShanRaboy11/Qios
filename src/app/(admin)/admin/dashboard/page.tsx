"use client";

import React, { useEffect, useState } from "react";
import { AdminDashboardHeader } from "@/components/organisms/AdminDashboardHeader";
import { AdminMetricsRow } from "@/components/organisms/AdminMetricsRow";
import { AdminChartsSection } from "@/components/organisms/AdminChartsSection";
import { AdminListsSection } from "@/components/organisms/AdminListsSection";
import { useRouter } from "next/navigation";
import {
  createEmptyAdminDashboard,
  type AdminDashboardData,
} from "@/lib/adminDashboard";

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
  const [error, setError] = useState<string | null>(null);
  const [dashboard, setDashboard] = useState<AdminDashboardData>(
    createEmptyAdminDashboard(),
  );

  useEffect(() => {
    const controller = new AbortController();

    const loadDashboard = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch("/api/admin/dashboard", {
          signal: controller.signal,
        });
        const payload = (await response.json()) as AdminDashboardData & {
          error?: string;
        };

        if (!response.ok) {
          throw new Error(payload.error || "Failed to load dashboard");
        }

        setDashboard(payload);
      } catch (fetchError) {
        if (controller.signal.aborted) {
          return;
        }

        setDashboard(createEmptyAdminDashboard());
        setError(
          fetchError instanceof Error
            ? fetchError.message
            : "Failed to load dashboard",
        );
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    void loadDashboard();

    return () => controller.abort();
  }, []);

  if (isLoading) {
    return <AdminDashboardSkeleton />;
  }

  return (
    <>
      {error ? (
        <div className="mb-4 rounded-[20px] border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          {error}
        </div>
      ) : null}
      <AdminDashboardHeader
        onCompaniesClick={() => router.push("/admin/tenant_directory")}
        isCompaniesActive={false}
      />
      <AdminMetricsRow metrics={dashboard.metrics} />
      <AdminChartsSection
        companiesSeries={dashboard.companiesSeries}
        revenueSeries={dashboard.revenueSeries}
        plansSeries={dashboard.plansSeries}
      />
      <AdminListsSection
        onViewSystemActivity={() => router.push("/admin/system_activity")}
        onViewPendingTenants={() =>
          router.push("/admin/tenant_directory?filter=Pending")
        }
        recentTransactions={dashboard.recentTransactions}
        recentTenants={dashboard.recentTenants}
        recentActivities={dashboard.recentActivities}
      />
    </>
  );
}
