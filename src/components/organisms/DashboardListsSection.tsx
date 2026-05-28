"use client";

import React, { useState } from "react";
import { Trophy, AlertTriangle, ShoppingBag } from "lucide-react";
import { Dropdown } from "@/components/molecules/Dropdown";
import { ListCardItem } from "@/components/molecules/ListCardItem";
import Link from "next/link";
import { Badge } from "@/components/atoms/Badge";

export const DashboardListsSection = () => {
  const [topSellingFilter, setTopSellingFilter] = useState("Today");
  const [recentOrdersFilter, setRecentOrdersFilter] = useState("Today");

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
      {/* top Selling Products */}
      <div className="bg-white rounded-[24px] p-6 shadow-[0px_4px_20px_rgba(0,0,0,0.03)] border border-gray-100 flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
              <Trophy className="w-5 h-5 text-[#ffc670]" />
            </div>
            <h2 className="text-[18px] font-bold text-text-primary">
              Top Selling Products
            </h2>
          </div>
          <div className="w-[130px]">
            <Dropdown
              label=""
              options={[
                { label: "Today", value: "Today" },
                { label: "This Week", value: "This Week" },
              ]}
              value={topSellingFilter}
              onSelect={(opt) => setTopSellingFilter(opt.value)}
              size="sm"
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <ListCardItem
            imageSlot={
              <div className="w-full h-full bg-orange-100 rounded-xl" />
            } // replace with image
            title="Chicken McDo"
            subtitle="$187 • 247+ Sales"
            rightSlot={
              <div className="text-[#22C55E] border border-[#22C55E] rounded px-2 py-0.5 text-[11px] font-bold flex items-center gap-1">
                ↗ 25%
              </div>
            }
          />
          <ListCardItem
            imageSlot={<div className="w-full h-full bg-red-100 rounded-xl" />}
            title="McFloat"
            subtitle="$145 • 289+ Sales"
            rightSlot={
              <div className="text-[#22C55E] border border-[#22C55E] rounded px-2 py-0.5 text-[11px] font-bold flex items-center gap-1">
                ↗ 25%
              </div>
            }
          />
          <ListCardItem
            imageSlot={
              <div className="w-full h-full bg-green-100 rounded-xl" />
            }
            title="Ala King"
            subtitle="$458 • 300+ Sales"
            rightSlot={
              <div className="text-[#22C55E] border border-[#22C55E] rounded px-2 py-0.5 text-[11px] font-bold flex items-center gap-1">
                ↗ 25%
              </div>
            }
          />
          <ListCardItem
            imageSlot={
              <div className="w-full h-full bg-yellow-100 rounded-xl" />
            }
            title="Fries"
            subtitle="$139 • 225+ Sales"
            rightSlot={
              <div className="text-[#EF4444] border border-[#EF4444] rounded px-2 py-0.5 text-[11px] font-bold flex items-center gap-1">
                ↘ 21%
              </div>
            }
          />
          <ListCardItem
            imageSlot={
              <div className="w-full h-full bg-purple-100 rounded-xl" />
            }
            title="Burger"
            subtitle="$898 • 365+ Sales"
            rightSlot={
              <div className="text-[#22C55E] border border-[#22C55E] rounded px-2 py-0.5 text-[11px] font-bold flex items-center gap-1">
                ↗ 25%
              </div>
            }
          />
        </div>
      </div>

      {/* low Stock Products */}
      <div className="bg-white rounded-[24px] p-6 shadow-[0px_4px_20px_rgba(0,0,0,0.03)] border border-gray-100 flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-[#EF4444]" />
            </div>
            <h2 className="text-[18px] font-bold text-text-primary">
              Low Stock Products
            </h2>
          </div>
          <Link
            href="#"
            className="text-[14px] font-semibold text-[#2D2D2D] underline underline-offset-4 decoration-2 decoration-gray-300 hover:decoration-[#EF4444] transition-colors"
          >
            View All
          </Link>
        </div>

        <div className="flex flex-col gap-2">
          <ListCardItem
            imageSlot={<div className="w-full h-full bg-gray-200 rounded-xl" />}
            title="Salt"
            subtitle="ID : #940004"
            rightSlot={
              <div className="text-right">
                <div className="text-[12px] text-text-secondary">Instock</div>
                <div className="text-[14px] font-bold text-[#EF4444]">21g</div>
              </div>
            }
          />
          <ListCardItem
            imageSlot={<div className="w-full h-full bg-gray-200 rounded-xl" />}
            title="Ketchup"
            subtitle="ID : #665814"
            rightSlot={
              <div className="text-right">
                <div className="text-[12px] text-text-secondary">Instock</div>
                <div className="text-[14px] font-bold text-[#EF4444]">08</div>
              </div>
            }
          />
          <ListCardItem
            imageSlot={<div className="w-full h-full bg-gray-200 rounded-xl" />}
            title="Sugar"
            subtitle="ID : #325569"
            rightSlot={
              <div className="text-right">
                <div className="text-[12px] text-text-secondary">Instock</div>
                <div className="text-[14px] font-bold text-[#EF4444]">14g</div>
              </div>
            }
          />
          <ListCardItem
            imageSlot={<div className="w-full h-full bg-gray-200 rounded-xl" />}
            title="Bread"
            subtitle="ID : #124588"
            rightSlot={
              <div className="text-right">
                <div className="text-[12px] text-text-secondary">Instock</div>
                <div className="text-[14px] font-bold text-[#EF4444]">12</div>
              </div>
            }
          />
          <ListCardItem
            imageSlot={<div className="w-full h-full bg-gray-200 rounded-xl" />}
            title="Mayonnaise"
            subtitle="ID : #365586"
            rightSlot={
              <div className="text-right">
                <div className="text-[12px] text-text-secondary">Instock</div>
                <div className="text-[14px] font-bold text-[#EF4444]">10</div>
              </div>
            }
          />
        </div>
      </div>

      {/* recent Orders */}
      <div className="bg-white rounded-[24px] p-6 shadow-[0px_4px_20px_rgba(0,0,0,0.03)] border border-gray-100 flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-[#ffc670]" />
            </div>
            <h2 className="text-[18px] font-bold text-text-primary">
              Recent Orders
            </h2>
          </div>
          <div className="w-[130px]">
            <Dropdown
              label=""
              options={[
                { label: "Today", value: "Today" },
                { label: "This Week", value: "This Week" },
              ]}
              value={recentOrdersFilter}
              onSelect={(opt) => setRecentOrdersFilter(opt.value)}
              size="sm"
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <ListCardItem
            imageSlot={
              <div className="w-full h-full bg-green-100 rounded-xl" />
            }
            title="Chicken McDo"
            subtitle="Meal • $640"
            rightSlot={
              <div className="text-right flex flex-col gap-1 items-end">
                <div className="text-[12px] text-text-secondary">Today</div>
                <Badge
                  variant="outline"
                  color="warning"
                  className="text-[10px] py-0 px-2 rounded-full h-5"
                >
                  Pending
                </Badge>
              </div>
            }
          />
          <ListCardItem
            imageSlot={<div className="w-full h-full bg-blue-100 rounded-xl" />}
            title="McFloat"
            subtitle="Dessert • $126"
            rightSlot={
              <div className="text-right flex flex-col gap-1 items-end">
                <div className="text-[12px] text-text-secondary">Today</div>
                <Badge
                  variant="outline"
                  color="error"
                  className="text-[10px] py-0 px-2 rounded-full h-5"
                >
                  Cancelled
                </Badge>
              </div>
            }
          />
          <ListCardItem
            imageSlot={
              <div className="w-full h-full bg-yellow-100 rounded-xl" />
            }
            title="Ala King"
            subtitle="Meal • $89"
            rightSlot={
              <div className="text-right flex flex-col gap-1 items-end">
                <div className="text-[12px] text-text-secondary">
                  15 Jan 2025
                </div>
                <Badge
                  variant="outline"
                  color="warning"
                  className="text-[10px] py-0 px-2 rounded-full h-5"
                >
                  Pending
                </Badge>
              </div>
            }
          />
          <ListCardItem
            imageSlot={
              <div className="w-full h-full bg-orange-100 rounded-xl" />
            }
            title="Fries"
            subtitle="Snacks • $65"
            rightSlot={
              <div className="text-right flex flex-col gap-1 items-end">
                <div className="text-[12px] text-text-secondary">
                  12 Jan 2025
                </div>
                <Badge
                  variant="outline"
                  color="success"
                  className="text-[10px] py-0 px-2 rounded-full h-5"
                >
                  Completed
                </Badge>
              </div>
            }
          />
          <ListCardItem
            imageSlot={
              <div className="w-full h-full bg-purple-100 rounded-xl" />
            }
            title="Burger"
            subtitle="Snacks • $87.56"
            rightSlot={
              <div className="text-right flex flex-col gap-1 items-end">
                <div className="text-[12px] text-text-secondary">
                  11 Jan 2025
                </div>
                <Badge
                  variant="outline"
                  color="success"
                  className="text-[10px] py-0 px-2 rounded-full h-5"
                >
                  Completed
                </Badge>
              </div>
            }
          />
        </div>
      </div>
    </div>
  );
};
