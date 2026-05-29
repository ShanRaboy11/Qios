"use client";

import React, { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { Badge } from "@/components/atoms/Badge";
import { Input } from "@/components/atoms/Input";
import { Button } from "@/components/atoms/Button";
import { ChevronDown, ChevronLeft, ChevronRight, Download, Filter, Search, X } from "lucide-react";
import { jsPDF } from "jspdf";
import { AnimatePresence, motion } from "framer-motion";
import {
  formatMoney,
  type SalesTransactionRecord,
  type SalesTransactionResponse,
} from "@/lib/salesDashboard";

interface TransactionTableProps {
  tenantId: string;
  businessName: string;
}

const STATUS_OPTIONS = ["all", "pending", "preparing", "ready", "served", "cancelled"] as const;
const PAYMENT_STATUS_OPTIONS = ["all", "unpaid", "paid", "refunded"] as const;

function capitalize(value: string) {
  if (!value) return value;
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function buildFilterSummary(
  status: (typeof STATUS_OPTIONS)[number],
  paymentStatus: (typeof PAYMENT_STATUS_OPTIONS)[number],
) {
  return [status, paymentStatus].filter((value) => value !== "all").length;
}

function formatDateTime(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function parseItems(items: string) {
  return items
    .split(/\n|\|/)
    .map((item) => item.trim())
    .filter(Boolean);
}

type TransactionDetailsModalProps = {
  transaction: SalesTransactionRecord | null;
  isOpen: boolean;
  onClose: () => void;
};

function TransactionDetailsModal({ transaction, isOpen, onClose }: TransactionDetailsModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && transaction ? (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[150] bg-black/40 backdrop-blur-sm"
          />
          <div className="fixed inset-0 z-[160] flex items-center justify-center p-4 sm:p-6 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="w-full max-w-3xl max-h-[90vh] overflow-hidden rounded-[28px] bg-white shadow-2xl pointer-events-auto flex flex-col"
            >
              <div className="flex items-start justify-between gap-4 border-b border-gray-100 bg-gray-50/60 p-6">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-accent">
                    Transaction Details
                  </p>
                  <h3 className="mt-2 text-2xl font-bold text-text-primary">
                    Order {transaction.orderNumber}
                  </h3>
                  <p className="mt-1 text-sm text-text-secondary">
                    {formatDateTime(transaction.createdAt)}
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-gray-100 bg-white text-text-secondary shadow-sm transition-colors hover:bg-gray-50 hover:text-text-primary"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="overflow-y-auto p-6 space-y-6">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  {[
                    { label: "Order ID", value: transaction.orderNumber },
                    { label: "Date", value: transaction.date },
                    { label: "Time", value: transaction.time },
                    { label: "Table", value: transaction.tableNumber || "Walk-in" },
                    { label: "Status", value: capitalize(transaction.status) },
                    { label: "Payment Status", value: capitalize(transaction.paymentStatus) },
                    { label: "Method", value: capitalize(transaction.method) },
                    { label: "Total", value: formatMoney(transaction.total) },
                  ].map((field) => (
                    <div key={field.label} className="rounded-2xl border border-gray-100 bg-gray-50/60 p-4">
                      <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-text-secondary">
                        {field.label}
                      </p>
                      <p className="mt-2 text-sm font-semibold text-text-primary">{field.value}</p>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.3fr_0.7fr]">
                  <div className="rounded-[24px] border border-gray-100 bg-white shadow-sm overflow-hidden">
                    <div className="border-b border-gray-100 px-5 py-4">
                      <h4 className="text-sm font-bold text-text-primary">Items</h4>
                      <p className="mt-1 text-xs text-text-secondary">All items included in this order</p>
                    </div>
                    <div className="divide-y divide-gray-100">
                      {parseItems(transaction.items).length > 0 ? (
                        parseItems(transaction.items).map((item, index) => (
                          <div key={`${transaction.id}-item-${index}`} className="px-5 py-4 flex items-start gap-3">
                            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-primary/10 text-xs font-bold text-brand-accent">
                              {index + 1}
                            </div>
                            <p className="text-sm text-text-primary leading-relaxed">{item}</p>
                          </div>
                        ))
                      ) : (
                        <div className="px-5 py-8 text-sm text-text-secondary">No item details available.</div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="rounded-[24px] border border-gray-100 bg-gray-50/60 p-5">
                      <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-text-secondary">
                        Order Summary
                      </p>
                      <div className="mt-4 space-y-3 text-sm">
                        <div className="flex items-center justify-between gap-4">
                          <span className="text-text-secondary">Created at</span>
                          <span className="font-medium text-text-primary text-right">{formatDateTime(transaction.createdAt)}</span>
                        </div>
                        <div className="flex items-center justify-between gap-4">
                          <span className="text-text-secondary">Transaction ID</span>
                          <span className="font-medium text-text-primary text-right break-all">{transaction.id}</span>
                        </div>
                        <div className="flex items-center justify-between gap-4">
                          <span className="text-text-secondary">Table number</span>
                          <span className="font-medium text-text-primary text-right">{transaction.tableNumber || "Walk-in"}</span>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-[24px] border border-gray-100 bg-brand-primary/5 p-5">
                      <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-brand-accent">
                        Amount Due
                      </p>
                      <p className="mt-3 text-3xl font-bold text-text-primary">{formatMoney(transaction.total)}</p>
                      <p className="mt-2 text-sm text-text-secondary">Includes all listed items and charges for this order.</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}

export const TransactionTable = ({ tenantId, businessName }: TransactionTableProps) => {
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<(typeof STATUS_OPTIONS)[number]>("all");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<(typeof PAYMENT_STATUS_OPTIONS)[number]>("all");
  const [page, setPage] = useState(1);
  const [limit] = useState(6);
  const [transactions, setTransactions] = useState<SalesTransactionRecord[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<SalesTransactionRecord | null>(null);

  useEffect(() => {
    const query = searchInput.trim();

    if (!query) {
      return;
    }

    const timeout = window.setTimeout(() => {
      setPage(1);
      setSearchQuery(query);
    }, 300);

    return () => window.clearTimeout(timeout);
  }, [searchInput]);

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
          search: searchQuery,
          status: statusFilter,
          paymentStatus: paymentStatusFilter,
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
  }, [limit, page, paymentStatusFilter, searchQuery, statusFilter, tenantId]);

  const totalPages = Math.max(1, Math.ceil(total / limit));
  const startIndex = total === 0 ? 0 : (page - 1) * limit + 1;
  const endIndex = Math.min(total, page * limit);

  const filterSummary = useMemo(
    () => buildFilterSummary(statusFilter, paymentStatusFilter),
    [paymentStatusFilter, statusFilter],
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
        search: searchQuery,
        status: statusFilter,
        paymentStatus: paymentStatusFilter,
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
      const columnWidths = [78, 78, 58, 250, 74, 76];

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
          `Filters: ${searchQuery || "All orders"}${statusFilter !== "all" ? ` • Status: ${capitalize(statusFilter)}` : ""}${paymentStatusFilter !== "all" ? ` • Payment: ${capitalize(paymentStatusFilter)}` : ""}`,
          margin,
          84,
          { maxWidth: width - margin * 2 },
        );

        doc.setFont("helvetica", "bold");
        doc.setFontSize(9);
        const headers = ["Order", "Date", "Time", "Items", "Status", "Total"];
        const headerWidths = [78, 78, 58, 250, 74, 76];
        let x = margin;
        headers.forEach((header, index) => {
          doc.text(header, x, startY);
          x += headerWidths[index];
        });
        doc.line(margin, startY + 6, width - margin, startY + 6);
      };

      drawHeader();

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      let y = startY + 24;

      payload.data.forEach((row: SalesTransactionRecord) => {
        const wrappedItems = doc.splitTextToSize(row.items || "No items", 244);
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
    setSearchInput("");
    setSearchQuery("");
    setStatusFilter("all");
    setPaymentStatusFilter("all");
    setPage(1);
    setIsFilterOpen(false);
  };

  return (
    <div className="relative bg-white rounded-[24px] shadow-sm border border-gray-100 overflow-visible flex flex-col h-auto w-full">
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
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search order, item, or table"
              className="pl-11 pr-4 py-2.5 text-sm rounded-2xl border-gray-200 bg-gray-50/80 focus:bg-white"
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
            />
          </div>
          <div className="relative">
            <Button
              variant="outline"
              shape="rounded"
              className="px-4 py-2.5"
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
              <div className="absolute right-0 top-full mt-3 z-50 min-w-[20rem] rounded-2xl border border-gray-100 bg-white p-5 shadow-lg">
                <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                  <div>
                    <p className="text-sm font-bold text-text-primary">Filters</p>
                    <p className="text-xs text-text-secondary mt-0.5">Refine the transaction list</p>
                  </div>
                  <Button
                    variant="ghost"
                    shape="rounded"
                    className="px-3 py-2 text-xs"
                    onClick={clearFilters}
                  >
                    Clear all
                  </Button>
                </div>
                <div className="mt-4 grid grid-cols-1 gap-4 text-sm">
                  <label className="space-y-1.5">
                    <span className="text-text-secondary text-[11px] font-bold uppercase tracking-[0.16em]">Order Status</span>
                    <div className="relative">
                      <select
                        value={statusFilter}
                        onChange={(event) => {
                          setStatusFilter(event.target.value as (typeof STATUS_OPTIONS)[number]);
                          setPage(1);
                        }}
                        className="w-full rounded-2xl border-2 border-[#E5E5E5] bg-white px-6 py-3.5 text-sm text-text-primary outline-none focus:border-brand-primary focus:shadow-[0_0_0_4px_rgba(255,198,112,0.08)]"
                      >
                        {STATUS_OPTIONS.map((option) => (
                          <option key={option} value={option}>
                            {capitalize(option)}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    </div>
                  </label>
                  <label className="space-y-1.5">
                    <span className="text-text-secondary text-[11px] font-bold uppercase tracking-[0.16em]">Payment Status</span>
                    <div className="relative">
                      <select
                        value={paymentStatusFilter}
                        onChange={(event) => {
                          setPaymentStatusFilter(event.target.value as (typeof PAYMENT_STATUS_OPTIONS)[number]);
                          setPage(1);
                        }}
                        className="w-full rounded-2xl border-2 border-[#E5E5E5] bg-white px-6 py-3.5 text-sm text-text-primary outline-none focus:border-brand-primary focus:shadow-[0_0_0_4px_rgba(255,198,112,0.08)]"
                      >
                        {PAYMENT_STATUS_OPTIONS.map((option) => (
                          <option key={option} value={option}>
                            {capitalize(option)}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    </div>
                  </label>
                  <div className="flex justify-end gap-2 pt-2">
                    <Button
                      variant="outline"
                      shape="rounded"
                      className="px-4 py-2.5 text-sm"
                      onClick={clearFilters}
                    >
                      Clear
                    </Button>
                    <Button
                      variant="primary"
                      shape="rounded"
                      className="px-4 py-2.5 text-sm"
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
            <tr className="bg-gray-50 text-text-secondary text-[11px] font-bold uppercase tracking-wider text-center">
              <th className="py-3 px-6 text-center">Order ID</th>
              <th className="py-3 px-6 text-center">Date</th>
              <th className="py-3 px-6 text-center">Time</th>
              <th className="py-3 px-6 text-center">Items Summary</th>
              <th className="py-3 px-6 text-center">Status</th>
              <th className="py-3 px-6 text-center">Total</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: limit }).map((_, index) => (
                <tr key={`transaction-skeleton-${index}`} className="border-b border-gray-50">
                  <td className="py-4 px-6" colSpan={6}>
                    <div className="h-4 rounded bg-gray-100 animate-pulse" />
                  </td>
                </tr>
              ))
            ) : transactions.length > 0 ? (
              transactions.map((tx) => (
                <tr
                  key={tx.id}
                  className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors cursor-pointer"
                  onClick={() => setSelectedTransaction(tx)}
                >
                  <td className="py-4 px-6 font-bold text-text-primary text-sm text-center">
                    {tx.orderNumber}
                  </td>
                  <td className="py-4 px-6 text-sm text-text-secondary text-center">
                    {tx.date}
                  </td>
                  <td className="py-4 px-6 text-sm text-text-secondary text-center">
                    {tx.time}
                  </td>
                  <td className="py-4 px-6 text-[13px] text-text-primary truncate max-w-[220px] text-center">
                    {tx.items || "No items"}
                  </td>
                  <td className="py-4 px-6 text-center">
                    <Badge
                      color={tx.status === "cancelled" ? "error" : tx.status === "ready" || tx.status === "served" ? "success" : "warning"}
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
                <td colSpan={6} className="py-16 text-center text-sm text-text-secondary">
                  No transactions found for the selected filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="border-t border-gray-50 flex justify-between items-center px-4 py-4 text-sm text-text-secondary">
        <span>
          {total <= limit ? `Showing ${total} of ${total} transactions` : `Showing ${startIndex} to ${endIndex} of ${total} transactions`}
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
      <TransactionDetailsModal
        transaction={selectedTransaction}
        isOpen={selectedTransaction !== null}
        onClose={() => setSelectedTransaction(null)}
      />
    </div>
  );
};
