"use client";

import React from "react";
import { AdminDashboardHeader } from "@/components/organisms/AdminDashboardHeader";
import { AdminMetricsRow } from "@/components/organisms/AdminMetricsRow";
import { AdminChartsSection } from "@/components/organisms/AdminChartsSection";
import { AdminListsSection } from "@/components/organisms/AdminListsSection";
import { useRouter } from "next/navigation";

export default function AdminDashboardPage() {
  const router = useRouter();

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
