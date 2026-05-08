"use client";

import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceArea,
  Legend,
} from "recharts";
import { DateRangePicker } from "@/components/molecules/DateRangePicker";

export interface AnalyticsDataPoint {
  time: string;
  prepTime: number;
  orderVolume: number;
}

interface StaffAnalyticsChartProps {
  data: AnalyticsDataPoint[];
}

export const StaffAnalyticsChart = ({ data }: StaffAnalyticsChartProps) => {
  return (
    <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h3 className="font-bold text-xl text-text-primary">
          Prep Time Trends vs. Order Volume
        </h3>
        <DateRangePicker startDate="01 Jan 2026" endDate="07 Jan 2026" />
      </div>
      <div className="p-6 h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#F3F4F6"
            />
            <XAxis
              dataKey="time"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "#9CA3AF" }}
              dy={10}
            />
            <YAxis
              yAxisId="left"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "#9CA3AF" }}
              label={{
                value: "Prep Time (mins)",
                angle: -90,
                position: "insideLeft",
                style: { fill: "#9CA3AF", fontSize: 11 },
              }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "#9CA3AF" }}
              label={{
                value: "Order Count",
                angle: 90,
                position: "insideRight",
                style: { fill: "#9CA3AF", fontSize: 11 },
              }}
            />
            <Tooltip
              contentStyle={{
                borderRadius: "12px",
                border: "1px solid #F3F4F6",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
              }}
            />
            <Legend
              verticalAlign="bottom"
              height={36}
              iconType="circle"
              wrapperStyle={{ fontSize: 12, paddingTop: 20 }}
            />

            {/* The active area highlighted in the image */}
            <ReferenceArea
              yAxisId="left"
              x1="11:30"
              x2="13:00"
              fill="#FEF3C7"
              fillOpacity={0.3}
              strokeDasharray="3 3"
              stroke="#FBBF24"
            />

            <Line
              yAxisId="left"
              type="monotone"
              dataKey="prepTime"
              name="Avg Prep Time (mins)"
              stroke="#FF5269"
              strokeWidth={2}
              dot={{ r: 3, fill: "#FF5269", strokeWidth: 0 }}
              activeDot={{ r: 6 }}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="orderVolume"
              name="Order Volume"
              stroke="#3B82F6"
              strokeWidth={2}
              dot={{ r: 3, fill: "#3B82F6", strokeWidth: 0 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
