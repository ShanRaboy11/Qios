"use client";

import React, { useEffect, useState } from "react";
import { SalesMetricCards } from "@/components/organisms/SalesMetricCards";
import { RevenueChart } from "@/components/organisms/RevenueChart";
import { TopSellingItems } from "@/components/organisms/TopSellingItems";
import { TransactionTable } from "@/components/organisms/TransactionTable";
import {
  type SalesOverviewResponse,
  type SalesPeriod,
} from "@/lib/salesDashboard";

interface SalesManagementProps {
  tenantId: string;
  storeName: string;
}

export default function SalesManagement({
  tenantId,
  storeName,
}: SalesManagementProps) {
  const [period, setPeriod] = useState<SalesPeriod>("month");
  const [overview, setOverview] = useState<SalesOverviewResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!tenantId) {
      return;
    }

    const controller = new AbortController();

    const loadOverview = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(
          `/api/tenants/${tenantId}/sales?view=overview&period=${period}`,
          {
            signal: controller.signal,
          },
        );
        const payload = (await response.json()) as SalesOverviewResponse & {
          error?: string;
        };

        if (!response.ok) {
          throw new Error(payload.error || "Failed to load sales overview");
        }

        setOverview(payload);
      } catch (fetchError) {
        if (controller.signal.aborted) {
          return;
        }

        setOverview(null);
        setError(
          fetchError instanceof Error
            ? fetchError.message
            : "Failed to load sales overview",
        );
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    void loadOverview();

    return () => controller.abort();
  }, [period, tenantId]);

  return (
    <div className="flex flex-col w-full gap-6 md:gap-8">
      {error ? (
        <div className="rounded-[20px] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      {/* top row: kpis */}
      <SalesMetricCards
        metrics={overview?.metrics ?? null}
        isLoading={isLoading}
      />

      {/* middle row: charts */}
      <div className="w-full">
        <RevenueChart
          period={period}
          onPeriodChange={setPeriod}
          data={overview?.revenueSeries ?? []}
          isLoading={isLoading}
        />
      </div>

      {/* bottom row: top items & transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 w-full">
        <div className="lg:col-span-1">
          <TopSellingItems
            items={overview?.topItems ?? []}
            isLoading={isLoading}
          />
        </div>
        <div className="lg:col-span-2">
          <TransactionTable
            tenantId={tenantId}
            businessName={storeName || overview?.businessName || ""}
          />
        </div>
      </div>
    </div>
  );
}
