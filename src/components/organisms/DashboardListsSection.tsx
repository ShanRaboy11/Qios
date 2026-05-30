"use client";

import React, { useState } from "react";
import { Trophy, AlertTriangle, ShoppingBag } from "lucide-react";
import { Dropdown } from "@/components/molecules/Dropdown";
import { ListCardItem } from "@/components/molecules/ListCardItem";
import Link from "next/link";
import { Badge } from "@/components/atoms/Badge";

export type DashboardTopSeller = {
  id: string;
  name: string;
  revenueLabel: string;
  salesLabel: string;
  trendLabel: string;
  isPositive: boolean;
};

export type DashboardLowStockItem = {
  id: string;
  name: string;
  skuLabel: string;
  stockLabel: string;
  stockTone: "low" | "warning" | "good";
};

export type DashboardRecentOrder = {
  id: string;
  title: string;
  subtitle: string;
  dateLabel: string;
  statusLabel: string;
  statusTone: "warning" | "error" | "success" | "neutral";
};

export interface DashboardListsSectionProps {
  topSellingItems?: DashboardTopSeller[];
  lowStockItems?: DashboardLowStockItem[];
  recentOrders?: DashboardRecentOrder[];
  inventoryConfigHref?: string;
}

const fallbackTopSellingItems: DashboardTopSeller[] = [
  {
    id: "fallback-top-1",
    name: "Chicken McDo",
    revenueLabel: "$187",
    salesLabel: "247+ Sales",
    trendLabel: "↗ 25%",
    isPositive: true,
  },
  {
    id: "fallback-top-2",
    name: "McFloat",
    revenueLabel: "$145",
    salesLabel: "289+ Sales",
    trendLabel: "↗ 25%",
    isPositive: true,
  },
  {
    id: "fallback-top-3",
    name: "Ala King",
    revenueLabel: "$458",
    salesLabel: "300+ Sales",
    trendLabel: "↗ 25%",
    isPositive: true,
  },
];

const fallbackLowStockItems: DashboardLowStockItem[] = [
  {
    id: "fallback-low-1",
    name: "Salt",
    skuLabel: "ID : #940004",
    stockLabel: "21g",
    stockTone: "low",
  },
  {
    id: "fallback-low-2",
    name: "Ketchup",
    skuLabel: "ID : #665814",
    stockLabel: "08",
    stockTone: "low",
  },
  {
    id: "fallback-low-3",
    name: "Sugar",
    skuLabel: "ID : #325569",
    stockLabel: "14g",
    stockTone: "warning",
  },
];

const fallbackRecentOrders: DashboardRecentOrder[] = [
  {
    id: "fallback-order-1",
    title: "Chicken McDo",
    subtitle: "Meal • $640",
    dateLabel: "Today",
    statusLabel: "Pending",
    statusTone: "warning",
  },
  {
    id: "fallback-order-2",
    title: "McFloat",
    subtitle: "Dessert • $126",
    dateLabel: "Today",
    statusLabel: "Cancelled",
    statusTone: "error",
  },
  {
    id: "fallback-order-3",
    title: "Ala King",
    subtitle: "Meal • $89",
    dateLabel: "15 Jan 2025",
    statusLabel: "Pending",
    statusTone: "warning",
  },
];

export const DashboardListsSection = ({
  topSellingItems = fallbackTopSellingItems,
  lowStockItems = fallbackLowStockItems,
  recentOrders = fallbackRecentOrders,
  inventoryConfigHref = "#",
}: DashboardListsSectionProps) => {
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
          {topSellingItems.map((item) => (
            <ListCardItem
              key={item.id}
              imageSlot={
                <div className="w-full h-full bg-orange-100 rounded-xl" />
              }
              title={item.name}
              subtitle={`${item.revenueLabel} • ${item.salesLabel}`}
              rightSlot={
                <div
                  className={`border rounded px-2 py-0.5 text-[11px] font-bold flex items-center gap-1 ${
                    item.isPositive
                      ? "text-[#22C55E] border-[#22C55E]"
                      : "text-[#EF4444] border-[#EF4444]"
                  }`}
                >
                  {item.trendLabel}
                </div>
              }
            />
          ))}
          {topSellingItems.length === 0 && (
            <div className="text-sm text-text-secondary py-4">
              No top-selling product data yet.
            </div>
          )}
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
          {lowStockItems.map((item) => (
            <ListCardItem
              key={item.id}
              imageSlot={
                <div className="w-full h-full bg-gray-200 rounded-xl" />
              }
              title={item.name}
              subtitle={item.skuLabel}
              rightSlot={
                <div className="text-right">
                  <div className="text-[12px] text-text-secondary">Instock</div>
                  <div
                    className={`text-[14px] font-bold ${
                      item.stockTone === "good"
                        ? "text-[#22C55E]"
                        : item.stockTone === "warning"
                          ? "text-[#F59E0B]"
                          : "text-[#EF4444]"
                    }`}
                  >
                    {item.stockLabel}
                  </div>
                </div>
              }
            />
          ))}
          {lowStockItems.length === 0 && (
            <div className="text-sm text-text-secondary py-4">
              No low stock items right now.
            </div>
          )}
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
                {recentOrders.map((item) => (
                  <ListCardItem
                    key={item.id}
                    imageSlot={
                      <div className="w-full h-full bg-green-100 rounded-xl" />
                    }
                    title={item.title}
                    subtitle={item.subtitle}
                    rightSlot={
                      <div className="text-right flex flex-col gap-1 items-end">
                        <div className="text-[12px] text-text-secondary">
                          {item.dateLabel}
                        </div>
                        <Badge
                          variant="outline"
                          color={
                            item.statusTone === "success"
                              ? "success"
                              : item.statusTone === "error"
                                ? "error"
                                : item.statusTone === "neutral"
                                  ? "secondary"
                                  : "warning"
                          }
                          className="text-[10px] py-0 px-2 rounded-full h-5"
                        >
                          {item.statusLabel}
                        </Badge>
                      </div>
                    }
                  />
                ))}
                {recentOrders.length === 0 && (
                  <div className="text-sm text-text-secondary py-4">
                    No recent orders yet.
                  </div>
                )}
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
