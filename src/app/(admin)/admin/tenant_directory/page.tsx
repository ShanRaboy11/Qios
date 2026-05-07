"use client";

import React, { Suspense } from "react";
import TenantManagement from "@/components/organisms/TenantManagement";
import { useSearchParams } from "next/navigation";

function TenantDirectoryContent() {
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

export default function TenantDirectoryPage() {
  return (
    <Suspense fallback={null}>
      <TenantDirectoryContent />
    </Suspense>
  );
}
