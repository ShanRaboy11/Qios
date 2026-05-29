import React from "react";
import SalesManagement from "@/components/organisms/SalesManagement";
import { fetchTenantBranding } from "@/lib/tenantBranding";

export default async function SalesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: tenantId } = await params;
  const { storeName } = await fetchTenantBranding(tenantId);

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <div>
          <h2 className="h2 text-text-primary">Sales and Revenue</h2>
          <p className="b1 text-text-secondary mt-2">
            View detailed sales reports and revenue analytics
          </p>
        </div>
      </div>
      <div id="tutorial-sales-analytics">
        <SalesManagement tenantId={tenantId} storeName={storeName} />
      </div>
    </>
  );
}
