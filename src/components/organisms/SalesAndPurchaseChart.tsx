"use client";

import React, { useState } from "react";
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
  Legend,
} from "recharts";

const data = [
  { name: "Jan", purchase: 11000, sales: 40000 },
  { name: "Feb", purchase: 21000, sales: 15000 },
  { name: "Mar", purchase: 8000, sales: 14000 },
  { name: "Apr", purchase: 12000, sales: 38000 },
  { name: "May", purchase: 24000, sales: 16000 },
  { name: "Jun", purchase: 12000, sales: 38000 },
  { name: "July", purchase: 8000, sales: 14000 },
  { name: "Aug", purchase: 15000, sales: 12000 },
  { name: "Sep", purchase: 40000, sales: 10000 },
  { name: "Oct", purchase: 3000, sales: 28000 },
  { name: "Nov", purchase: 28000, sales: 14000 },
  { name: "Dec", purchase: 12000, sales: 16000 },
];

export const SalesAndPurchaseChart = () => {
  const [activePeriod, setActivePeriod] = useState("1Y");

  return (
    <div className="bg-white rounded-[24px] p-6 shadow-[0px_4px_20px_rgba(0,0,0,0.03)] border border-gray-100 flex flex-col w-full h-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
            <Package className="w-5 h-5 text-brand-primary" />
          </div>
          <h2 className="text-[18px] font-bold text-text-primary">
            Sales & Purchase
          </h2>
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
            onChange={setActivePeriod}
            className="h-10"
          />
        </div>
      </div>

      {/* custom Legend / Value Display */}
      <div className="w-full h-[1px] bg-[#E5E5E5] mb-3 sm:mb-4" />
      <div className="flex items-center gap-6 mb-8 mt-2">
        <div className="flex flex-col border border-gray-100 rounded-xl px-4 py-2">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2.5 h-2.5 rounded-full bg-brand-primary" />
            <span className="text-[14px] text-text-secondary">
              Total Purchase
            </span>
          </div>
          <span className="text-[20px] font-bold text-text-primary">49K</span>
        </div>
        <div className="flex flex-col border border-gray-100 rounded-xl px-4 py-2">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2.5 h-2.5 rounded-full bg-brand-secondary" />
            <span className="text-[14px] text-text-secondary">Total Sales</span>
          </div>
          <span className="text-[20px] font-bold text-text-primary">38K</span>
        </div>
      </div>

      <div className="h-[300px] w-full mt-auto">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 0, right: 0, left: -20, bottom: 0 }}
            barSize={32}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#F5F5F5"
            />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#9CA3AF", fontSize: 13 }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#9CA3AF", fontSize: 13 }}
              tickFormatter={(value) => `${value / 1000}K`}
              dx={-10}
            />
            <Tooltip
              cursor={{ fill: "transparent" }}
              contentStyle={{
                borderRadius: "12px",
                border: "none",
                boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
              }}
            />
            <Bar
              dataKey="purchase"
              stackId="a"
              fill="var(--brand-primary, #FFDC72)"
              radius={[0, 0, 4, 4]}
            />
            <Bar
              dataKey="sales"
              stackId="a"
              fill="var(--brand-accent, #FFEDBA)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
