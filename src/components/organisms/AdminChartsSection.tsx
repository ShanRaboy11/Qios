"use client";

import React from "react";
import { ChartCard } from "@/components/molecules/ChartCard";
import {
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  YAxis,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const companiesData = [
  { name: "M", value: 40 },
  { name: "T", value: 30 },
  { name: "W", value: 20 },
  { name: "T", value: 80 },
  { name: "F", value: 60, isHighlighted: true }, // The red one
  { name: "S", value: 50 },
  { name: "S", value: 50 },
];

const revenueData = [
  { name: "Jan", value: 18000 },
  { name: "Feb", value: 25000 },
  { name: "Mar", value: 12000 },
  { name: "Apr", value: 15000 },
  { name: "May", value: 15000 },
  { name: "Jun", value: 14000 },
  { name: "Jul", value: 25000 },
  { name: "Aug", value: 15000 },
  { name: "Sep", value: 16000 },
  { name: "Oct", value: 12000 },
  { name: "Nov", value: 11000 },
  { name: "Dec", value: 15000 },
];

const plansData = [
  { name: "Basic", value: 60, color: "#FF5269" },
  { name: "Premium", value: 20, color: "#FFDC72" },
  { name: "Enterprise", value: 20, color: "#F28C50" },
];

export const AdminChartsSection = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6 mb-6">
      {/* Companies Bar Chart */}
      <ChartCard
        title="Companies"
        dropdownLabel="This Week"
        className="lg:col-span-3"
      >
        <div className="h-[250px] w-full mt-4 flex flex-col justify-end">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={companiesData}
              margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
            >
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#A3A3A3" }}
                dy={10}
              />
              <Tooltip
                cursor={{ fill: "transparent" }}
                contentStyle={{
                  borderRadius: "8px",
                  border: "none",
                  boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                }}
              />
              <Bar dataKey="value" radius={[4, 4, 4, 4]}>
                {companiesData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.isHighlighted ? "#FF5269" : "#FFDC72"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="flex items-center gap-2 mt-4 pb-2 text-[13px] text-text-secondary">
            <span className="px-2 py-0.5 rounded-[4px] bg-[#22C55E] text-white font-bold text-[11px]">
              +6%
            </span>
            5 Companies from last month
          </div>
        </div>
      </ChartCard>

      {/* Revenue Area Chart */}
      <ChartCard title="Revenue" dropdownLabel="2026" className="lg:col-span-6">
        <div className="h-[250px] w-full mt-4 flex flex-col">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-[24px] font-bold text-[#2D2D2D] leading-none">
                $45787
              </h2>
              <p className="text-[13px] text-text-secondary mt-1">
                <span className="text-[#22C55E] font-bold">+40%</span> increased
                from last year
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-[13px] text-text-secondary">
              <span className="w-2 h-2 rounded-full bg-[#F28C50]" />
              Revenue
            </div>
          </div>
          <div className="flex-grow">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={revenueData}
                margin={{ top: 0, right: 0, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F28C50" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#F28C50" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="#F2F2F2" />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#A3A3A3" }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#A3A3A3" }}
                  tickFormatter={(val) => `${val / 1000}k`}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "8px",
                    border: "none",
                    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#F28C50"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorRev)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </ChartCard>

      {/* Plans Donut Chart */}
      <ChartCard
        title="Plans"
        dropdownLabel="This Month"
        className="lg:col-span-3"
      >
        <div className="h-[250px] w-full flex flex-col relative mt-4">
          <div className="flex-grow flex items-center justify-center -mt-6">
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie
                  data={plansData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={2}
                  dataKey="value"
                  stroke="none"
                >
                  {plansData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-col gap-2 mt-auto pb-2">
            {plansData.map((plan) => (
              <div
                key={plan.name}
                className="flex justify-between items-center text-[13px]"
              >
                <div className="flex items-center gap-2 text-text-secondary">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: plan.color }}
                  />
                  {plan.name}
                </div>
                <span className="font-bold text-[#2D2D2D]">{plan.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </ChartCard>
    </div>
  );
};
