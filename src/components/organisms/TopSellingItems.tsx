"use client";

import React from "react";
import { formatMoney, type TopSellingItem } from "@/lib/salesDashboard";

interface TopSellingItemsProps {
  items: TopSellingItem[];
  isLoading?: boolean;
}

export const TopSellingItems = ({ items, isLoading = false }: TopSellingItemsProps) => {
  if (isLoading) {
    return (
      <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full w-full">
        <div className="p-6 border-b border-gray-50 flex justify-between items-center">
          <div>
            <div className="h-6 w-40 rounded bg-gray-100 animate-pulse" />
            <div className="h-4 w-56 rounded bg-gray-100 animate-pulse mt-3" />
          </div>
        </div>
        <div className="p-4 space-y-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={`top-item-skeleton-${index}`}
              className="h-14 rounded-2xl bg-gray-50 animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  const hasItems = items.length > 0;

  return (
    <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full w-full">
      <div className="p-6 border-b border-gray-50 flex justify-between items-center">
        <div>
          <h3 className="font-bold text-xl text-text-primary">
            Top Selling Items
          </h3>
          <p className="text-sm text-text-secondary mt-1">
            Highest performing menu items
          </p>
        </div>
        <button className="text-sm font-medium text-brand-accent hover:underline">
          View All
        </button>
      </div>

      <div className="p-2 sm:p-4">
        <div className="overflow-x-hidden">
          <table className="w-full text-left border-collapse table-fixed">
            <thead>
              <tr className="text-text-secondary text-[11px] font-bold uppercase tracking-wider border-b border-gray-100">
                <th className="py-3 px-2 sm:px-4">Item Name</th>
                <th className="py-3 px-2 sm:px-4 w-20 text-center">Sales</th>
                <th className="py-3 px-2 sm:px-4 w-28 text-right">Revenue</th>
              </tr>
            </thead>
            <tbody>
              {hasItems ? items.map((item, idx) => (
                <tr
                  key={item.id}
                  className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors"
                >
                  <td className="py-4 px-2 sm:px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-brand-primary/10 flex items-center justify-center font-bold text-brand-accent text-xs shrink-0">
                        #{idx + 1}
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-text-primary text-[13px] sm:text-sm truncate">
                          {item.name}
                        </p>
                        <p className="text-[11px] text-text-secondary">
                          {item.category}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-2 sm:px-4 font-bold text-text-primary text-center text-sm">
                    {item.sales}
                  </td>
                  <td className="py-4 px-2 sm:px-4 text-right">
                    <p className="font-bold text-text-primary text-sm">
                      {formatMoney(item.revenue)}
                    </p>
                    <p
                      className={`text-[11px] font-medium ${item.trend >= 0 ? "text-success-primary" : "text-error-primary"}`}
                    >
                      {item.trend >= 0 ? "+" : ""}{item.trend.toFixed(0)}%
                    </p>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={3} className="py-12 text-center text-sm text-text-secondary">
                    No sales data available for the selected period.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
