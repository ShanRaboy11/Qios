"use client";

import React, { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { time: "08:00", sales: 1200 },
  { time: "10:00", sales: 3000 },
  { time: "12:00", sales: 8500 },
  { time: "14:00", sales: 5200 },
  { time: "16:00", sales: 4100 },
  { time: "18:00", sales: 9800 },
  { time: "20:00", sales: 11000 },
  { time: "22:00", sales: 4500 },
];

export const RevenueChart = () => {
  const [filter, setFilter] = useState("Today");

  return (
    <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 p-6 flex flex-col h-full w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <div>
          <h3 className="font-bold text-xl text-text-primary">Revenue Trend</h3>
          <p className="text-sm text-text-secondary mt-1">
            Sales performance over time
          </p>
        </div>
        <div className="flex bg-gray-50 p-1 rounded-xl w-fit border border-gray-100">
          {["Today", "Week", "Month"].map((item) => (
            <button
              key={item}
              onClick={() => setFilter(item)}
              className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                filter === item
                  ? "bg-white text-brand-accent shadow-sm"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className="w-full h-[300px] mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#FFC670" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#FFC670" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E5E5" />
            <XAxis
              dataKey="time"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#A1A1AA", fontSize: 12 }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#A1A1AA", fontSize: 12 }}
              tickFormatter={(value) => `₱${value / 1000}k`}
            />
            <Tooltip
              contentStyle={{
                borderRadius: "16px",
                border: "none",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
              }}
              formatter={(value: any) => [`₱${Number(value).toLocaleString()}`, "Sales"]}
            />
            <Area
              type="monotone"
              dataKey="sales"
              stroke="#FFC670"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorSales)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
