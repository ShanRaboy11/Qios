"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { X, TrendingUp, BarChart3, BadgePercent, Trophy } from "lucide-react";
import { formatMoney, type TopSellingItem } from "@/lib/salesDashboard";
import { cn } from "@/lib/utils";

interface TopSellingItemsProps {
  items: TopSellingItem[];
  isLoading?: boolean;
}

export const TopSellingItems = ({
  items,
  isLoading = false,
}: TopSellingItemsProps) => {
  const [mounted, setMounted] = useState(false);
  const [selectedItem, setSelectedItem] = useState<TopSellingItem | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (isLoading) {
    return (
      <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full w-full">
        <div className="p-6 border-b border-gray-50 flex justify-between items-center">
          <div>
            <div className="h-6 w-40 rounded skeleton-shimmer" />
            <div className="h-4 w-56 rounded skeleton-shimmer mt-3" />
          </div>
        </div>
        <div className="p-4 space-y-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={`top-item-skeleton-${index}`}
              className="h-14 rounded-2xl skeleton-shimmer"
            />
          ))}
        </div>
      </div>
    );
  }

  const hasItems = items.length > 0;

  const selectedRank = selectedItem
    ? items.findIndex((item) => item.id === selectedItem.id) + 1
    : 0;

  const closeModal = () => setSelectedItem(null);

  const modal = mounted
    ? createPortal(
        <AnimatePresence>
          {selectedItem ? (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={closeModal}
                className="fixed inset-0 z-[150] bg-black/40 backdrop-blur-sm"
              />
              <div className="fixed inset-0 z-[160] flex items-center justify-center p-4 sm:p-6 pointer-events-none">
                <motion.div
                  initial={{ opacity: 0, scale: 0.96, y: 18 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96, y: 18 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-[28px] bg-white shadow-2xl pointer-events-auto flex flex-col"
                >
                  <div className="flex items-start justify-between gap-4 border-b border-gray-100 bg-gray-50/60 p-6">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-accent">
                        Top Selling Item Details
                      </p>
                      <h3 className="mt-2 text-2xl font-bold text-text-primary">
                        {selectedItem.name}
                      </h3>
                      <p className="mt-1 text-sm text-text-secondary">
                        Ranked #{selectedRank || 1} in the selected period
                      </p>
                    </div>
                    <button
                      onClick={closeModal}
                      className="flex h-11 w-11 items-center justify-center rounded-full border border-gray-100 bg-white text-text-secondary shadow-sm transition-colors hover:bg-gray-50 hover:text-text-primary"
                    >
                      <X size={20} />
                    </button>
                  </div>

                  <div className="overflow-y-auto p-6 space-y-6">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                      {[
                        {
                          label: "Category",
                          value: selectedItem.category,
                          icon: Trophy,
                        },
                        {
                          label: "Sales",
                          value: String(selectedItem.sales),
                          icon: BarChart3,
                        },
                        {
                          label: "Revenue",
                          value: formatMoney(selectedItem.revenue),
                          icon: BadgePercent,
                        },
                        {
                          label: "Trend",
                          value: `${selectedItem.trend >= 0 ? "+" : ""}${selectedItem.trend.toFixed(1)}%`,
                          icon: TrendingUp,
                        },
                      ].map((field) => (
                        <div
                          key={field.label}
                          className="rounded-2xl border border-gray-100 bg-gray-50/60 p-4"
                        >
                          <div className="flex items-center gap-2 text-text-secondary text-[11px] font-bold uppercase tracking-[0.16em]">
                            <field.icon size={14} />
                            {field.label}
                          </div>
                          <p className="mt-2 text-sm font-semibold text-text-primary break-words">
                            {field.value}
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.2fr_0.8fr]">
                      <div className="rounded-[24px] border border-gray-100 bg-white shadow-sm overflow-hidden">
                        <div className="border-b border-gray-100 px-5 py-4">
                          <h4 className="text-sm font-bold text-text-primary">
                            Performance Summary
                          </h4>
                          <p className="mt-1 text-xs text-text-secondary">
                            A quick look at how this item is performing.
                          </p>
                        </div>
                        <div className="space-y-3 p-5 text-sm">
                          <div className="flex items-center justify-between gap-4">
                            <span className="text-text-secondary">
                              Top rank
                            </span>
                            <span className="font-medium text-text-primary">
                              #{selectedRank || 1}
                            </span>
                          </div>
                          <div className="flex items-center justify-between gap-4">
                            <span className="text-text-secondary">
                              Category
                            </span>
                            <span className="font-medium text-text-primary">
                              {selectedItem.category}
                            </span>
                          </div>
                          <div className="flex items-center justify-between gap-4">
                            <span className="text-text-secondary">
                              Trend direction
                            </span>
                            <span
                              className={cn(
                                "font-medium",
                                selectedItem.trend >= 0
                                  ? "text-success-primary"
                                  : "text-error-primary",
                              )}
                            >
                              {selectedItem.trend >= 0
                                ? "Growing"
                                : "Declining"}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="rounded-[24px] border border-gray-100 bg-brand-primary/5 p-5">
                        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-brand-accent">
                          Revenue Impact
                        </p>
                        <p className="mt-3 text-3xl font-bold text-text-primary">
                          {formatMoney(selectedItem.revenue)}
                        </p>
                        <p className="mt-2 text-sm text-text-secondary">
                          This item is currently one of the strongest
                          contributors in the selected sales period.
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </>
          ) : null}
        </AnimatePresence>,
        document.body,
      )
    : null;

  return (
    <>
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
                {hasItems ? (
                  items.map((item, idx) => (
                    <tr
                      key={item.id}
                      onClick={() => setSelectedItem(item)}
                      className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors cursor-pointer"
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
                          {item.trend >= 0 ? "+" : ""}
                          {item.trend.toFixed(0)}%
                        </p>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={3}
                      className="py-12 text-center text-sm text-text-secondary"
                    >
                      No sales data available for the selected period.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {modal}
    </>
  );
};
