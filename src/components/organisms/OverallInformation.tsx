"use client";

import React, { useState } from "react";
import { Info, User, Users, ShoppingCart } from "lucide-react";
import { Dropdown } from "@/components/molecules/Dropdown";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const donutData = [
  { name: "First Time", value: 5500 },
  { name: "Return", value: 3500 },
];
const COLORS = ["var(--brand-accent, #FF5269)", "var(--brand-primary, #FFD77A)"];

export const OverallInformation = () => {
  const [customerFilter, setCustomerFilter] = useState("Today");

  return (
    <div className="bg-white rounded-[24px] p-6 shadow-[0px_4px_20px_rgba(0,0,0,0.03)] border border-gray-100 flex flex-col h-full w-full">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
          <Info className="w-5 h-5 text-brand-primary" />
        </div>
        <h2 className="text-[18px] font-bold text-text-primary">
          Overall Information
        </h2>
      </div>

      {/* top 3 Stat Cards */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        <div className="flex flex-col bg-gray-50 items-center justify-center border border-gray-100 rounded-2xl py-4 hover:border-orange-100 transition-colors">
          <User className="w-6 h-6 text-brand-primary mb-2" />
          <span className="text-[14px] text-text-secondary">Suppliers</span>
          <span className="text-[18px] font-bold text-text-primary mt-1">
            6987
          </span>
        </div>
        <div className="flex flex-col bg-gray-50 items-center justify-center border border-gray-100 rounded-2xl py-4 hover:border-orange-100 transition-colors">
          <Users className="w-6 h-6 text-brand-accent mb-2" />
          <span className="text-[14px] text-text-secondary">Customer</span>
          <span className="text-[18px] font-bold text-text-primary mt-1">
            4896
          </span>
        </div>
        <div className="flex flex-col bg-gray-50 items-center justify-center border border-gray-100 rounded-2xl py-4 hover:border-orange-100 transition-colors">
          <ShoppingCart className="w-6 h-6 text-brand-primary mb-2" />
          <span className="text-[14px] text-text-secondary">Orders</span>
          <span className="text-[18px] font-bold text-text-primary mt-1">
            487
          </span>
        </div>
      </div>

      <div className="w-full h-[1px] bg-gray-100 mb-6" />

      {/* customers Overview Donut Chart */}
      <div className="flex flex-col flex-1">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[16px] font-bold text-text-primary">
            Customers Overview
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
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            {/* donut Hole Placeholder / Icon could go here */}
          </div>
          <div className="flex flex-row gap-10 sm:gap-10 flex-1 justify-center sm:justify-center flex-wrap">
            <div className="flex flex-col gap-1">
              <span className="text-[20px] font-bold text-text-primary leading-none">
                5.5K
              </span>
              <span className="text-[13px] text-brand-accent font-medium">
                First Time
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
                25%
              </div>
            </div>
            <div className="w-[1px] h-[90px] bg-gray-200" />
            <div className="flex flex-col gap-1">
              <span className="text-[20px] font-bold text-text-primary leading-none">
                3.5K
              </span>
              <span className="text-[13px] text-brand-primary font-medium">
                Return
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
                21%
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
