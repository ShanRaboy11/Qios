"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Rectangle,
} from "recharts";
import { type RevenuePoint, type SalesPeriod } from "@/lib/salesDashboard";

type StackedBarShapeProps = React.ComponentProps<typeof Rectangle> & {
  payload?: RevenuePointWithPurchase;
  dataKey?: string;
};

function StackedBarShape({
  payload,
  dataKey,
  ...props
}: StackedBarShapeProps) {
  const isPurchase = dataKey === "purchase";
  const salesValue = payload?.sales ?? 0;
  const purchaseValue = payload?.purchase ?? 0;

  let isTopmost = false;
  if (isPurchase) {
    isTopmost = purchaseValue > 0 && salesValue === 0;
  } else {
    isTopmost = salesValue > 0;
  }

  const radius: [number, number, number, number] = isTopmost
    ? [4, 4, 0, 0]
    : [0, 0, 0, 0];

  if ((isPurchase && purchaseValue === 0) || (!isPurchase && salesValue === 0)) {
    return null;
  }

  return <Rectangle {...props} radius={radius} />;
}

interface RevenuePointWithPurchase extends RevenuePoint {
  purchase?: number;
}

interface RevenueChartProps {
  data: RevenuePointWithPurchase[];
  period: SalesPeriod;
  onPeriodChange: (period: SalesPeriod) => void;
  isLoading?: boolean;
}

export const RevenueChart = ({
  data,
  period,
  onPeriodChange,
  isLoading = false,
}: RevenueChartProps) => {
  const chartData = data.map((point) => ({
    time: point.label,
    sales: point.sales,
    purchase: point.purchase ?? 0,
  }));

  return (
    <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 p-6 flex flex-col h-full w-full font-brand-secondary">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <div>
          <h3 className="font-brand font-bold text-xl text-text-primary">
            Sales & Purchases
          </h3>
          <p className="font-brand-secondary text-sm text-text-secondary mt-1">
            Revenue and inventory cost over time
          </p>
        </div>
        <div className="flex bg-gray-50 p-1 rounded-xl w-fit border border-gray-100 font-brand-secondary">
          {[
            { label: "Today", value: "today" as SalesPeriod },
            { label: "Week", value: "week" as SalesPeriod },
            { label: "Month", value: "month" as SalesPeriod },
          ].map((item) => (
            <button
              key={item.label}
              onClick={() => onPeriodChange(item.value)}
              className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                period === item.value
                  ? "bg-white text-brand-accent shadow-sm"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="w-full h-[300px] mt-4 font-brand-secondary">
        {isLoading ? (
          <div className="h-full w-full rounded-[20px] skeleton-shimmer" />
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
              barSize={24}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#E5E5E5"
              />
              <XAxis
                dataKey="time"
                axisLine={false}
                tickLine={false}
                tick={{
                  fill: "#A1A1AA",
                  fontSize: 12,
                  fontFamily: "var(--font-brand-secondary, sans-serif)",
                }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{
                  fill: "#A1A1AA",
                  fontSize: 12,
                  fontFamily: "var(--font-brand-secondary, sans-serif)",
                }}
                tickFormatter={(value) => `₱${value / 1000}k`}
                width={50}
              />
              <Tooltip
                shared={false}
                contentStyle={{
                  borderRadius: "16px",
                  border: "none",
                  fontFamily: "var(--font-brand-secondary, sans-serif)",
                  boxShadow:
                    "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
                }}
                formatter={(value: any, name: any) => [
                  `₱${Number(value).toLocaleString()}`,
                  name === "sales" ? "Sales" : "Purchases",
                ]}
              />
              <Bar
                dataKey="purchase"
                stackId="a"
                fill="var(--brand-accent, #FF5269)"
                shape={<StackedBarShape />}
              />
              <Bar
                dataKey="sales"
                stackId="a"
                fill="var(--brand-primary, #FFC670)"
                shape={<StackedBarShape />}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};
