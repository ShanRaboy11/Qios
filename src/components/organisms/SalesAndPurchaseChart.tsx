"use client";

import React, { useMemo, useState } from "react";
import { SegmentedControl } from "@/components/molecules/SegmentedControl";
import { Package } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { formatMoney } from "@/lib/salesDashboard";

export type SalesAndRevenuePoint = {
  label: string;
  sales: number;
  purchase?: number;
  revenue?: number;
};

export type SalesAndPurchasePeriod = "1D" | "1W" | "1M" | "3M" | "6M" | "1Y";

export type SalesAndPurchaseSeries = Partial<
  Record<SalesAndPurchasePeriod, SalesAndRevenuePoint[]>
>;

export interface SalesAndPurchaseChartProps {
  data?: SalesAndRevenuePoint[];
  seriesByPeriod?: SalesAndPurchaseSeries;
  defaultPeriod?: SalesAndPurchasePeriod;
  emptyNote?: string;
}

function formatCompactAmount(value: number) {
  if (!Number.isFinite(value)) return "0";

  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1)}M`;
  }

  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(1)}K`;
  }

  return `${Math.round(value)}`;
}

const fallbackData: SalesAndRevenuePoint[] = Array.from(
  { length: 24 },
  (_, hour) => {
    const displayHour = hour % 12 === 0 ? 12 : hour % 12;
    const suffix = hour < 12 ? "AM" : "PM";

    return {
      label: `${displayHour} ${suffix}`,
      sales: 0,
      revenue: 0,
    };
  },
);

export const SalesAndPurchaseChart = ({
  data = fallbackData,
  seriesByPeriod,
  defaultPeriod = "1D",
  emptyNote = "No sales recorded for today yet.",
}: SalesAndPurchaseChartProps) => {
  const [activePeriod, setActivePeriod] =
    useState<SalesAndPurchasePeriod>(defaultPeriod);

  const chartData = useMemo(() => {
    const selectedSeries = seriesByPeriod?.[activePeriod];
    if (selectedSeries && selectedSeries.length > 0) {
      return selectedSeries;
    }

    return data;
  }, [activePeriod, data, seriesByPeriod]);

  const totals = useMemo(
    () =>
      chartData.reduce(
        (accumulator, point) => {
          accumulator.sales += point.sales;
          accumulator.purchase += point.purchase ?? 0;
          return accumulator;
        },
        { sales: 0, purchase: 0 },
      ),
    [chartData],
  );

  const hasData = chartData.some(
    (point) => point.sales > 0 || (point.purchase ?? 0) > 0 || (point.revenue ?? 0) > 0,
  );

  return (
    <div className="bg-white rounded-[24px] p-6 shadow-[0px_4px_20px_rgba(0,0,0,0.03)] border border-gray-100 flex flex-col w-full h-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
            <Package className="w-5 h-5 text-brand-primary" />
          </div>
          <h2 className="text-[18px] font-bold text-text-primary">Sales & Purchase</h2>
        </div>
        <div className="w-full sm:w-[320px]">
          <SegmentedControl
            options={[
              { label: "1D", value: "1D" },
              { label: "1W", value: "1W" },
              { label: "1M", value: "1M" },
              { label: "3M", value: "3M" },
              { label: "6M", value: "6M" },
              { label: "1Y", value: "1Y" },
            ]}
            activeValue={activePeriod}
            onChange={(value) =>
              setActivePeriod(value as SalesAndPurchasePeriod)
            }
            className="h-10"
          />
        </div>
      </div>

      <div className="w-full h-[1px] bg-[#E5E5E5] mb-3 sm:mb-4" />
      <div className="flex flex-wrap items-center gap-4 sm:gap-6 mb-6 mt-2">
        <div className="flex flex-col border border-gray-100 rounded-xl px-4 py-2 min-w-[160px]">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2.5 h-2.5 rounded-full bg-brand-primary" />
            <span className="text-[14px] text-text-secondary">Total Sales</span>
          </div>
          <span className="text-[20px] font-bold text-text-primary">
            {formatMoney(totals.sales)}
          </span>
        </div>
        <div className="flex flex-col border border-gray-100 rounded-xl px-4 py-2 min-w-[160px]">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2.5 h-2.5 rounded-full bg-brand-secondary" />
            <span className="text-[14px] text-text-secondary">Total Purchase</span>
          </div>
          <span className="text-[20px] font-bold text-text-primary">
            {formatMoney(totals.purchase)}
          </span>
        </div>
      </div>

      <div className="h-[300px] w-full mt-auto relative">
        {!hasData ? (
          <div className="absolute inset-0 flex items-center justify-center text-center px-6 text-sm text-text-secondary">
            {emptyNote}
          </div>
        ) : null}
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 0, right: 0, left: -20, bottom: 0 }}
            barSize={24}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#F5F5F5"
            />
            <XAxis
              dataKey="label"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#9CA3AF", fontSize: 13 }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#9CA3AF", fontSize: 13 }}
              tickFormatter={(value) => formatCompactAmount(Number(value))}
              dx={-10}
            />
            <Tooltip
              cursor={{ fill: "transparent" }}
              formatter={(value, name) => {
                const numericValue = Number(value ?? 0);

                return [
                  name === "sales"
                    ? `${numericValue}`
                    : `${numericValue}`,
                  name === "sales" ? "Sales" : "Purchase",
                ];
              }}
              labelFormatter={(label) => `Time: ${label}`}
              contentStyle={{
                borderRadius: "12px",
                border: "none",
                boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
              }}
            />
            <Bar
              dataKey="sales"
              fill="var(--brand-primary, #FFDC72)"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="purchase"
              fill="var(--brand-accent, #FFEDBA)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
