"use client";

import React from "react";
import { ChartCard } from "@/components/molecules/ChartCard";
import type {
  AdminDashboardBarPoint,
  AdminDashboardPlanPoint,
  AdminDashboardRevenuePoint,
} from "@/lib/adminDashboard";
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

interface AdminChartsSectionProps {
  companiesSeries?: AdminDashboardBarPoint[];
  revenueSeries?: AdminDashboardRevenuePoint[];
  plansSeries?: AdminDashboardPlanPoint[];
}

const formatPlanName = (name: string) =>
  name ? name.charAt(0).toUpperCase() + name.slice(1).toLowerCase() : name;

const emptyMessage = "No data found yet";

export const AdminChartsSection = ({
  companiesSeries = [],
  revenueSeries = [],
  plansSeries = [],
}: AdminChartsSectionProps) => {
  const currentYear = new Date().getFullYear().toString();
  const hasCompanyData = companiesSeries.some((point) => point.value > 0);
  const hasRevenueData = revenueSeries.some((point) => point.value > 0);
  const hasPlanData = plansSeries.some((point) => point.value > 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6 mb-6">
      <ChartCard
        title="Companies"
        dropdownLabel="This Week"
        className="lg:col-span-3"
      >
        <div className="h-[250px] w-full mt-4 flex flex-col">
          {hasCompanyData ? (
            <>
              <div className="flex-1 min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={companiesSeries}
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
                    <Bar dataKey="value" radius={[4, 4, 4, 4]} fill="#FFDC72">
                      {companiesSeries.map((entry, index) => (
                        <Cell
                          key={`company-cell-${entry.name}-${index}`}
                          fill={entry.isHighlighted ? "#FF5269" : "#FFDC72"}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="flex items-center gap-2 mt-4 pb-2 text-[13px] text-text-secondary">
                <span className="px-2 py-0.5 rounded-[4px] bg-[#22C55E] text-white font-bold text-[11px]">
                  Live
                </span>
                New registrations by day
              </div>
            </>
          ) : (
            <div className="flex h-full items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-4 text-center text-sm text-text-secondary">
              {emptyMessage}
            </div>
          )}
        </div>
      </ChartCard>

      <ChartCard
        title="Revenue"
        dropdownLabel={currentYear}
        className="lg:col-span-6"
      >
        <div className="h-[250px] w-full mt-4 flex flex-col">
          {hasRevenueData ? (
            <>
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-[24px] font-bold text-[#2D2D2D] leading-none">
                    Revenue by Month
                  </h2>
                  <p className="text-[13px] text-text-secondary mt-1">
                    Based on paid orders in the database
                  </p>
                </div>
                <div className="flex items-center gap-1.5 text-[13px] text-text-secondary">
                  <span className="w-2 h-2 rounded-full bg-[#F28C50]" />
                  Revenue
                </div>
              </div>
              <div className="flex-grow min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={revenueSeries}
                    margin={{ top: 0, right: 0, left: -20, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                        <stop
                          offset="5%"
                          stopColor="#F28C50"
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor="#F28C50"
                          stopOpacity={0}
                        />
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
                      tickFormatter={(val) => `${Number(val) / 1000}k`}
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
            </>
          ) : (
            <div className="flex h-full items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-4 text-center text-sm text-text-secondary">
              {emptyMessage}
            </div>
          )}
        </div>
      </ChartCard>

      <ChartCard
        title="Plans"
        dropdownLabel="This Month"
        className="lg:col-span-3"
      >
        <div className="h-[250px] w-full flex flex-col relative mt-4">
          {hasPlanData ? (
            <>
              <div className="flex-grow flex items-center justify-center -mt-6 min-h-0">
                <ResponsiveContainer width="100%" height={160}>
                  <PieChart>
                    <Pie
                      data={plansSeries}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={75}
                      paddingAngle={2}
                      dataKey="value"
                      stroke="none"
                    >
                      {plansSeries.map((entry, index) => (
                        <Cell
                          key={`plan-cell-${entry.name}-${index}`}
                          fill={entry.color}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-col gap-2 mt-auto pb-2">
                {plansSeries.map((plan) => (
                  <div
                    key={plan.name}
                    className="flex justify-between items-center text-[13px]"
                  >
                    <div className="flex items-center gap-2 text-text-secondary">
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: plan.color }}
                      />
                      {formatPlanName(plan.name)}
                    </div>
                    <span className="font-bold text-[#2D2D2D]">
                      {plan.value}%
                    </span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex h-full items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-4 text-center text-sm text-text-secondary">
              {emptyMessage}
            </div>
          )}
        </div>
      </ChartCard>
    </div>
  );
};
