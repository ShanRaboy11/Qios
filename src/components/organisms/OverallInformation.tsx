"use client";

import React, { useState } from "react";
import { Info, User, Users, ShoppingCart } from "lucide-react";
import { Dropdown } from "@/components/molecules/Dropdown";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

type OverviewStatCard = {
  label: string;
  value: string;
  icon: React.ReactNode;
  iconClassName: string;
};

type OverviewSlice = {
  name: string;
  value: number;
  color: string;
};

type OverviewDetail = {
  value: string;
  label: string;
  trend: string;
  trendPositive: boolean;
};

export interface OverallInformationProps {
  heading?: string;
  stats?: OverviewStatCard[];
  donutTitle?: string;
  donutData?: OverviewSlice[];
  details?: [OverviewDetail, OverviewDetail];
  fallbackNote?: string;
}

const fallbackStats: OverviewStatCard[] = [
  {
    label: "Suppliers",
    value: "6987",
    icon: <User className="w-6 h-6 text-brand-primary mb-2" />,
    iconClassName: "bg-gray-50 border border-gray-100 hover:border-orange-100",
  },
  {
    label: "Customer",
    value: "4896",
    icon: <Users className="w-6 h-6 text-brand-accent mb-2" />,
    iconClassName: "bg-gray-50 border border-gray-100 hover:border-orange-100",
  },
  {
    label: "Orders",
    value: "487",
    icon: <ShoppingCart className="w-6 h-6 text-brand-primary mb-2" />,
    iconClassName: "bg-gray-50 border border-gray-100 hover:border-orange-100",
  },
];

const fallbackDonutData: OverviewSlice[] = [
  { name: "First Time", value: 5500, color: "var(--brand-accent, #FF5269)" },
  { name: "Return", value: 3500, color: "var(--brand-primary, #FFD77A)" },
];

const fallbackDetails: [OverviewDetail, OverviewDetail] = [
  { value: "5.5K", label: "First Time", trend: "25%", trendPositive: true },
  { value: "3.5K", label: "Return", trend: "21%", trendPositive: true },
];

export const OverallInformation = ({
  heading = "Overall Information",
  stats = fallbackStats,
  donutTitle = "Customers Overview",
  donutData = fallbackDonutData,
  details = fallbackDetails,
  fallbackNote,
}: OverallInformationProps) => {
  const [customerFilter, setCustomerFilter] = useState("Today");
  const colors = donutData.map((entry) => entry.color);

  return (
    <div className="bg-white rounded-[24px] p-6 shadow-[0px_4px_20px_rgba(0,0,0,0.03)] border border-gray-100 flex flex-col h-full w-full">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
          <Info className="w-5 h-5 text-brand-primary" />
        </div>
        <h2 className="text-[18px] font-bold text-text-primary">{heading}</h2>
      </div>

      {/* top 3 Stat Cards */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        {stats.slice(0, 3).map((stat) => (
          <div
            key={stat.label}
            className={`flex flex-col items-center justify-center rounded-2xl py-4 transition-colors ${stat.iconClassName}`}
          >
            {stat.icon}
            <span className="text-[14px] text-text-secondary">
              {stat.label}
            </span>
            <span className="text-[18px] font-bold text-text-primary mt-1">
              {stat.value}
            </span>
          </div>
        ))}
      </div>

      <div className="w-full h-[1px] bg-gray-100 mb-6" />

      {/* customers Overview Donut Chart */}
      <div className="flex flex-col flex-1">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[16px] font-bold text-text-primary">
            {donutTitle}
          </h3>
          <div className="w-[150px]">
            <Dropdown
              label=""
              options={[
                { label: "Today", value: "Today" },
                { label: "This Week", value: "This Week" },
                { label: "This Month", value: "This Month" },
              ]}
              value={customerFilter}
              onSelect={(opt) => setCustomerFilter(opt.value)}
              size="sm"
            />
          </div>
        </div>

        <div className="flex items-center gap-6 flex-1 min-h-[140px]">
          <div className="w-[140px] h-[140px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={donutData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={65}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                  cornerRadius={4}
                >
                  {donutData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={colors[index % colors.length]}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            {fallbackNote ? (
              <div className="absolute inset-0 flex items-center justify-center text-center px-4 text-[12px] text-text-secondary">
                {fallbackNote}
              </div>
            ) : null}
          </div>
          <div className="flex flex-row gap-10 sm:gap-10 flex-1 justify-center sm:justify-center flex-wrap">
            <div className="flex flex-col gap-1">
              <span className="text-[20px] font-bold text-text-primary leading-none">
                {details[0].value}
              </span>
              <span className="text-[13px] text-brand-accent font-medium">
                {details[0].label}
              </span>
              <div className="bg-[#22C55E] text-white text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1 w-fit mt-1">
                <svg
                  width="8"
                  height="8"
                  viewBox="0 0 10 10"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M5 2V8M5 2L2 5M5 2L8 5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                {details[0].trend}
              </div>
            </div>
            <div className="w-[1px] h-[90px] bg-gray-200" />
            <div className="flex flex-col gap-1">
              <span className="text-[20px] font-bold text-text-primary leading-none">
                {details[1].value}
              </span>
              <span className="text-[13px] text-brand-primary font-medium">
                {details[1].label}
              </span>
              <div className="bg-[#22C55E] text-white text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1 w-fit mt-1">
                <svg
                  width="8"
                  height="8"
                  viewBox="0 0 10 10"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M5 2V8M5 2L2 5M5 2L8 5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                {details[1].trend}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
