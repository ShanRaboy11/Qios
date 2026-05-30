import React from "react";
import KitchenPreparationDashboard from "@/components/organisms/KitchenPreparationDashboard";
import { getEmployeeQueueData } from "./actions";

export default async function OrderQueuePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: tenantId } = await params;
  const { orders, totalOrderCount, servedTodayCount, canUpdateStatus } =
    await getEmployeeQueueData(tenantId);

  return (
    <div className="flex flex-col pb-32">
      <header className="mb-6">
        <h2 className="h2 text-text-primary">Order Queue</h2>
        <p className="b1 text-text-secondary mt-2">
          Track pending, preparing, and ready orders in real time
        </p>
      </header>

      <div className="w-full">
        <KitchenPreparationDashboard
          tenantId={tenantId}
          initialOrders={orders}
          totalOrderCount={totalOrderCount}
          servedTodayCount={servedTodayCount}
          queueMode
          canUpdateStatus={canUpdateStatus}
        />
      </div>
    </div>
  );
}
