"use client";

import React from "react";
import TenantManagement from "@/components/organisms/TenantManagement";
import { useSearchParams } from "next/navigation";

export default function TenantDirectoryPage() {
  const searchParams = useSearchParams();
  const filter = searchParams.get("filter") || undefined;

  return (
    <div className="mt-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="h2 text-text-primary">Tenant Directory</h2>
          <p className="b1 text-text-secondary mt-2">
            Manage all registered tenants and their statuses
          </p>
        </div>
      </div>
      <TenantManagement initialStatusFilter={filter} />
    </div>
  );
}
