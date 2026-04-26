import React from "react";
import { AdminDashboardHeader } from "@/components/organisms/AdminDashboardHeader";
import { AdminMetricsRow } from "@/components/organisms/AdminMetricsRow";
import { AdminChartsSection } from "@/components/organisms/AdminChartsSection";
import { AdminListsSection } from "@/components/organisms/AdminListsSection";
import TenantManagement from "@/components/organisms/TenantManagement";

export default function AdminDashboardPage() {
  return (
    <div className="min-h-screen bg-[#FFF9EF] p-4 md:p-8 lg:p-12">
      <div className="max-w-[1440px] mx-auto flex flex-col">
        <AdminDashboardHeader />
        <AdminMetricsRow />
        <AdminChartsSection />
        <AdminListsSection />
      </div>
    </div>
  );
}
