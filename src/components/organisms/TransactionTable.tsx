"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/atoms/Badge";
import { Input } from "@/components/atoms/Input";
import { Button } from "@/components/atoms/Button";
import { ChevronDown, ChevronLeft, ChevronRight, Download, Filter, Search } from "lucide-react";
import { jsPDF } from "jspdf";
import {
  formatMoney,
  type SalesTransactionRecord,
  type SalesTransactionResponse,
} from "@/lib/salesDashboard";

interface TransactionTableProps {
  tenantId: string;
  businessName: string;
}

const STATUS_OPTIONS = ["all", "pending", "preparing", "ready", "served", "cancelled", "voided"] as const;
const PAYMENT_STATUS_OPTIONS = ["all", "unpaid", "paid", "refunded"] as const;
const METHOD_OPTIONS = ["all", "cash", "gcash", "card", "other"] as const;

function capitalize(value: string) {
  if (!value) return value;
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function buildFilterSummary(
  status: (typeof STATUS_OPTIONS)[number],
  paymentStatus: (typeof PAYMENT_STATUS_OPTIONS)[number],
  method: (typeof METHOD_OPTIONS)[number],
) {
  return [status, paymentStatus, method].filter((value) => value !== "all").length;
}

export const TransactionTable = ({ tenantId, businessName }: TransactionTableProps) => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<(typeof STATUS_OPTIONS)[number]>("all");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<(typeof PAYMENT_STATUS_OPTIONS)[number]>("all");
  const [methodFilter, setMethodFilter] = useState<(typeof METHOD_OPTIONS)[number]>("all");
  const [page, setPage] = useState(1);
  const [limit] = useState(8);
  const [transactions, setTransactions] = useState<SalesTransactionRecord[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    if (!tenantId) {
      return;
    }

    const controller = new AbortController();

    const loadTransactions = async () => {
      try {
        setIsLoading(true);

        const params = new URLSearchParams({
          view: "transactions",
          page: String(page),
          limit: String(limit),
          search: search.trim(),
          status: statusFilter,
          paymentStatus: paymentStatusFilter,
          method: methodFilter,
        });

        const response = await fetch(`/api/tenants/${tenantId}/sales?${params.toString()}`, {
          signal: controller.signal,
        });
        const payload = (await response.json()) as SalesTransactionResponse & { error?: string };

        if (!response.ok) {
          throw new Error(payload.error || "Failed to load transactions");
        }

        setTransactions(payload.data ?? []);
        setTotal(payload.total ?? 0);
      } catch (fetchError) {
        if (controller.signal.aborted) {
          return;
        }

        setTransactions([]);
        setTotal(0);
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    void loadTransactions();

    return () => controller.abort();
  }, [limit, methodFilter, page, paymentStatusFilter, search, statusFilter, tenantId]);

  const totalPages = Math.max(1, Math.ceil(total / limit));
  const startIndex = total === 0 ? 0 : (page - 1) * limit + 1;
  const endIndex = Math.min(total, page * limit);

  const filterSummary = useMemo(
    () => buildFilterSummary(statusFilter, paymentStatusFilter, methodFilter),
    [methodFilter, paymentStatusFilter, statusFilter],
  );

  const exportTransactions = async () => {
    if (!tenantId) {
      return;
    }

    try {
      setIsDownloading(true);

      const params = new URLSearchParams({
        view: "transactions",
        all: "true",
        search: search.trim(),
        status: statusFilter,
        paymentStatus: paymentStatusFilter,
        method: methodFilter,
      });

      const response = await fetch(`/api/tenants/${tenantId}/sales?${params.toString()}`);
      const payload = (await response.json()) as SalesTransactionResponse & { error?: string };

      if (!response.ok) {
        throw new Error(payload.error || "Failed to export transactions");
      }

      const doc = new jsPDF({ orientation: "landscape", unit: "pt", format: "a4" });
      const width = doc.internal.pageSize.getWidth();
      const height = doc.internal.pageSize.getHeight();
      const margin = 36;
      const startY = 126;
      const columnWidths = [78, 78, 58, 210, 70, 74, 76];

      const drawHeader = () => {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(18);
        doc.text(businessName || payload.businessName || "Sales Report", margin, 48);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.text(
          `Generated: ${new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeStyle: "short" }).format(new Date())}`,
          margin,
          68,
        );
        doc.text(
          `Filters: ${search.trim() || "All orders"}${statusFilter !== "all" ? ` • Status: ${capitalize(statusFilter)}` : ""}${paymentStatusFilter !== "all" ? ` • Payment: ${capitalize(paymentStatusFilter)}` : ""}${methodFilter !== "all" ? ` • Method: ${capitalize(methodFilter)}` : ""}`,
          margin,
          84,
          { maxWidth: width - margin * 2 },
        );

        doc.setFont("helvetica", "bold");
        doc.setFontSize(9);
        const headers = ["Order", "Date", "Time", "Items", "Method", "Status", "Total"];
        let x = margin;
        headers.forEach((header, index) => {
          doc.text(header, x, startY);
          x += columnWidths[index];
        });
        doc.line(margin, startY + 6, width - margin, startY + 6);
      };

      drawHeader();

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      let y = startY + 24;

      payload.data.forEach((row: SalesTransactionRecord) => {
        const wrappedItems = doc.splitTextToSize(row.items || "No items", columnWidths[3] - 6);
        const rowBlockHeight = Math.max(20, wrappedItems.length * 12 + 8);

        if (y + rowBlockHeight > height - margin) {
          doc.addPage();
          drawHeader();
          y = startY + 24;
        }

        const values: Array<string | string[]> = [
          row.orderNumber,
          row.date,
          row.time,
          wrappedItems,
          capitalize(row.method),
          capitalize(row.status),
          formatMoney(row.total),
        ];

        let x = margin;
        values.forEach((value, index) => {
          if (Array.isArray(value)) {
            doc.text(value, x, y);
          } else {
            doc.text(String(value), x, y);
          }
          x += columnWidths[index];
        });

        y += rowBlockHeight;
      });

      const fileName = (businessName || payload.businessName || "sales-report")
        .replace(/[^a-z0-9]+/gi, "-")
        .replace(/^-+|-+$/g, "")
        .toLowerCase();

      doc.save(`${fileName || "sales-report"}.pdf`);
    } catch {
      // Keep the UI stable if the export fails.
    } finally {
      setIsDownloading(false);
    }
  };

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("all");
    setPaymentStatusFilter("all");
    setMethodFilter("all");
    setPage(1);
    setIsFilterOpen(false);
  };

  return (
    <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full w-full">
      <div className="p-6 border-b border-gray-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="font-bold text-xl text-text-primary">
            Recent Transactions
          </h3>
          <p className="text-sm text-text-secondary mt-1">
            Detailed log of all store orders
          </p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search order or table..."
              className="pl-9 py-2 text-sm rounded-xl"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
            />
          </div>
          <div className="relative">
            <Button
              variant="outline"
              shape="rounded"
              className="px-3"
              title="Filter"
              onClick={() => setIsFilterOpen((prev) => !prev)}
            >
              <Filter size={16} />
              {filterSummary > 0 ? (
                <span className="ml-2 rounded-full bg-brand-primary px-2 py-0.5 text-[11px] font-semibold text-brand-accent">
                  {filterSummary}
                </span>
              ) : null}
              <ChevronDown size={14} className="ml-1" />
            </Button>

            {isFilterOpen ? (
              <div className="absolute right-0 top-12 z-20 w-80 rounded-2xl border border-gray-100 bg-white p-4 shadow-xl">
                <div className="grid grid-cols-1 gap-3 text-sm">
                  <label className="space-y-1">
                    <span className="text-text-secondary text-xs font-semibold uppercase tracking-wider">Order Status</span>
                    <select
                      value={statusFilter}
                      onChange={(event) => {
                        setStatusFilter(event.target.value as (typeof STATUS_OPTIONS)[number]);
                        setPage(1);
                      }}
                      className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 outline-none"
                    >
                      {STATUS_OPTIONS.map((option) => (
                        <option key={option} value={option}>
                          {capitalize(option)}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="space-y-1">
                    <span className="text-text-secondary text-xs font-semibold uppercase tracking-wider">Payment Status</span>
                    <select
                      value={paymentStatusFilter}
                      onChange={(event) => {
                        setPaymentStatusFilter(event.target.value as (typeof PAYMENT_STATUS_OPTIONS)[number]);
                        setPage(1);
                      }}
                      className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 outline-none"
                    >
                      {PAYMENT_STATUS_OPTIONS.map((option) => (
                        <option key={option} value={option}>
                          {capitalize(option)}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="space-y-1">
                    <span className="text-text-secondary text-xs font-semibold uppercase tracking-wider">Payment Method</span>
                    <select
                      value={methodFilter}
                      onChange={(event) => {
                        setMethodFilter(event.target.value as (typeof METHOD_OPTIONS)[number]);
                        setPage(1);
                      }}
                      className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 outline-none"
                    >
                      {METHOD_OPTIONS.map((option) => (
                        <option key={option} value={option}>
                          {capitalize(option)}
                        </option>
                      ))}
                    </select>
                  </label>
                  <div className="flex justify-end gap-2 pt-2">
                    <Button
                      variant="outline"
                      shape="rounded"
                      className="px-3"
                      onClick={clearFilters}
                    >
                      Clear
                    </Button>
                    <Button
                      variant="primary"
                      shape="rounded"
                      className="px-3"
                      onClick={() => setIsFilterOpen(false)}
                    >
                      Apply
                    </Button>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
          <Button
            variant="outline"
            shape="rounded"
            className="px-3"
            title="Export"
            onClick={() => void exportTransactions()}
            disabled={isDownloading}
          >
            <Download size={16} />
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <table className="w-full text-left border-collapse whitespace-nowrap">
          <thead>
            <tr className="bg-gray-50 text-text-secondary text-[11px] font-bold uppercase tracking-wider">
              <th className="py-3 px-6">Order ID</th>
              <th className="py-3 px-6">Date</th>
              <th className="py-3 px-6">Time</th>
              <th className="py-3 px-6">Items Summary</th>
              <th className="py-3 px-6">Method</th>
              <th className="py-3 px-6 text-center">Status</th>
              <th className="py-3 px-6 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: limit }).map((_, index) => (
                <tr key={`transaction-skeleton-${index}`} className="border-b border-gray-50">
                  <td className="py-4 px-6" colSpan={7}>
                    <div className="h-4 rounded bg-gray-100 animate-pulse" />
                  </td>
                </tr>
              ))
            ) : transactions.length > 0 ? (
              transactions.map((tx) => (
                <tr
                  key={tx.id}
                  className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors"
                >
                  <td className="py-4 px-6 font-bold text-text-primary text-sm">
                    {tx.orderNumber}
                  </td>
                  <td className="py-4 px-6 text-sm text-text-secondary">
                    {tx.date}
                  </td>
                  <td className="py-4 px-6 text-sm text-text-secondary">
                    {tx.time}
                  </td>
                  <td className="py-4 px-6 text-[13px] text-text-primary truncate max-w-[220px]">
                    {tx.items || "No items"}
                  </td>
                  <td className="py-4 px-6 text-[13px] text-text-secondary">
                    {capitalize(tx.method)}
                  </td>
                  <td className="py-4 px-6 text-center">
                    <Badge
                      color={tx.status === "cancelled" || tx.status === "voided" ? "error" : tx.status === "ready" || tx.status === "served" ? "success" : "warning"}
                      variant="subtle"
                      shape="pill"
                      className="justify-center text-[11px] py-0.5"
                    >
                      {capitalize(tx.status)}
                    </Badge>
                  </td>
                  <td className="py-4 px-6 text-right font-bold text-text-primary text-sm">
                    {formatMoney(tx.total)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="py-16 text-center text-sm text-text-secondary">
                  No transactions found for the selected filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="p-4 border-t border-gray-50 flex justify-between items-center text-sm text-text-secondary">
        <span>
          Showing {startIndex} to {endIndex} of {total} transactions
        </span>
        <div className="flex items-center gap-2">
          <button
            className="px-3 py-1 rounded hover:bg-gray-100 disabled:opacity-50 inline-flex items-center gap-1"
            disabled={page <= 1 || isLoading}
            onClick={() => setPage((current) => Math.max(1, current - 1))}
          >
            <ChevronLeft size={14} /> Prev
          </button>
          <span className="px-3 py-1 rounded bg-gray-50 text-text-primary font-medium">
            {page} / {totalPages}
          </span>
          <button
            className="px-3 py-1 rounded hover:bg-gray-100 disabled:opacity-50 inline-flex items-center gap-1"
            disabled={page >= totalPages || isLoading}
            onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
          >
            Next <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};
