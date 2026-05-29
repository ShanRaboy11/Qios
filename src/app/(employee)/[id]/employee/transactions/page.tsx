"use client";

import React, { useState, useMemo } from "react";
// Using your atomic components
import { Badge } from "@/components/atoms/Badge";
import { Input } from "@/components/atoms/Input";
import { Button } from "@/components/atoms/Button";
import { 
  Search, 
  Filter, 
  ChevronDown, 
  Download, 
  ChevronLeft, 
  ChevronRight,
  X 
} from "lucide-react";

// Updated to Peso (₱)
const capitalize = (s: string) => (s && s.charAt(0).toUpperCase() + s.slice(1)) || "";
const formatMoney = (amount: number) => 
  new Intl.NumberFormat('en-PH', { 
    style: 'currency', 
    currency: 'PHP',
    minimumFractionDigits: 2 
  }).format(amount);

// Modal for transaction details
const TransactionDetailsModal = ({ transaction, isOpen, onClose }: { transaction: any; isOpen: boolean; onClose: () => void; }) => {
  if (!isOpen || !transaction) return null;
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-[32px] p-8 w-full max-w-md relative shadow-2xl animate-in fade-in zoom-in duration-200">
         <button onClick={onClose} className="absolute top-6 right-6 text-gray-400 hover:text-gray-700 transition-colors">
            <X size={20} />
         </button>
        <h3 className="text-xl font-bold text-text-primary mb-6">Transaction Details</h3>
        <div className="space-y-4">
            <div className="flex justify-between border-b border-gray-50 pb-2">
                <span className="text-sm text-text-secondary">Order Number</span>
                <span className="text-sm font-bold text-text-primary">{transaction.orderNumber}</span>
            </div>
            <div className="flex justify-between border-b border-gray-50 pb-2">
                <span className="text-sm text-text-secondary">Payment</span>
                <Badge color={transaction.paymentStatus === 'paid' ? 'success' : 'warning'} variant="subtle" shape="pill">
                    {capitalize(transaction.paymentStatus)}
                </Badge>
            </div>
            <div className="flex justify-between border-b border-gray-50 pb-2">
                <span className="text-sm text-text-secondary">Items</span>
                <span className="text-sm text-text-primary text-right max-w-[180px]">{transaction.items}</span>
            </div>
            <div className="flex justify-between pt-2">
                <span className="text-sm text-text-secondary font-medium">Total Amount</span>
                <span className="text-xl font-bold text-brand-primary">{formatMoney(transaction.total)}</span>
            </div>
        </div>
        <div className="mt-8 flex gap-3">
            <Button variant="outline" shape="rounded" className="flex-1" onClick={onClose}>Close</Button>
            <Button variant="primary" shape="rounded" className="flex-1">Void Order</Button>
        </div>
      </div>
    </div>
  );
};

export default function TransactionsPage() {
  const [searchInput, setSearchInput] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const STATUS_OPTIONS = ["all", "pending", "ready", "served", "cancelled"] as const;
  const PAYMENT_STATUS_OPTIONS = ["all", "paid", "unpaid", "refunded"] as const;

  const transactions = [
    { id: 1, orderNumber: "#ORD-5551", date: "May 24, 2024", time: "10:30 AM", items: "2x Cappuccino, 1x Croissant", status: "served", paymentStatus: "paid", total: 625.50 },
    { id: 2, orderNumber: "#ORD-5552", date: "May 24, 2024", time: "10:35 AM", items: "1x Americano", status: "ready", paymentStatus: "paid", total: 180.00 },
    { id: 3, orderNumber: "#ORD-5553", date: "May 24, 2024", time: "10:42 AM", items: "3x Espresso, 1x Muffin", status: "cancelled", paymentStatus: "refunded", total: 411.25 },
    { id: 4, orderNumber: "#ORD-5554", date: "May 24, 2024", time: "11:05 AM", items: "1x Iced Latte", status: "served", paymentStatus: "paid", total: 245.50 },
  ];
  
  const limit = 10;
  const total = transactions.length;
  const totalPages = Math.ceil(total / limit);
  const startIndex = (page - 1) * limit + 1;
  const endIndex = Math.min(page * limit, total);
  
  const filterSummary = useMemo(() => {
    let count = 0;
    if (statusFilter !== "all") count++;
    if (paymentStatusFilter !== "all") count++;
    return count;
  }, [statusFilter, paymentStatusFilter]);

  const clearFilters = () => {
    setStatusFilter("all");
    setPaymentStatusFilter("all");
    setPage(1);
  };

  return (
    <>
      <header className="mb-2">
        <h2 className="h2 text-text-primary">Transactions</h2>
        <p className="b1 text-text-secondary mt-2">
          Review today's orders and process refunds
        </p>
      </header>

      <div className="relative bg-white rounded-[24px] shadow-sm border border-gray-100 overflow-visible flex flex-col h-auto w-full mt-8">
        <div className="p-6 border-b border-gray-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h3 className="font-bold text-xl text-text-primary">Recent Transactions</h3>
            <p className="text-sm text-text-secondary mt-1">Detailed log of all store orders</p>
          </div>
          
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search order or item..."
                className="pl-11 pr-4 py-2.5 text-sm rounded-2xl border-gray-200 bg-gray-50/80 focus:bg-white"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </div>

            <div className="relative">
              <Button
                variant="outline"
                shape="rounded"
                className="px-4 py-2.5"
                onClick={() => setIsFilterOpen((prev) => !prev)}
              >
                <Filter size={16} />
                {filterSummary > 0 && (
                  <span className="ml-2 rounded-full bg-brand-primary px-2 py-0.5 text-[11px] font-semibold text-brand-accent">
                    {filterSummary}
                  </span>
                )}
                <ChevronDown size={14} className="ml-1" />
              </Button>

              {isFilterOpen && (
                <div className="absolute right-0 top-full mt-3 z-50 min-w-[20rem] rounded-2xl border border-gray-100 bg-white p-5 shadow-lg">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                    <p className="text-sm font-bold text-text-primary">Filters</p>
                    <button onClick={clearFilters} className="text-xs font-medium text-brand-primary hover:underline">
                      Clear all
                    </button>
                  </div>
                  <div className="mt-4 space-y-4">
                    <div>
                      <span className="text-text-secondary text-[11px] font-bold uppercase tracking-[0.16em]">Order Status</span>
                      <select
                        value={statusFilter}
                        onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
                        className="w-full mt-1.5 rounded-2xl border-2 border-[#E5E5E5] bg-white px-4 py-3 text-sm text-text-primary outline-none focus:border-brand-primary cursor-pointer"
                      >
                        {STATUS_OPTIONS.map((opt) => <option key={opt} value={opt}>{capitalize(opt)}</option>)}
                      </select>
                    </div>

                    {/* Payment Status - PRESERVED */}
                    <div>
                      <span className="text-text-secondary text-[11px] font-bold uppercase tracking-[0.16em]">Payment Status</span>
                      <select
                        value={paymentStatusFilter}
                        onChange={(e) => { setPaymentStatusFilter(e.target.value); setPage(1); }}
                        className="w-full mt-1.5 rounded-2xl border-2 border-[#E5E5E5] bg-white px-4 py-3 text-sm text-text-primary outline-none focus:border-brand-primary cursor-pointer"
                      >
                        {PAYMENT_STATUS_OPTIONS.map((opt) => <option key={opt} value={opt}>{capitalize(opt)}</option>)}
                      </select>
                    </div>

                    <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
                      <Button variant="outline" shape="rounded" size="sm" onClick={clearFilters}>Clear</Button>
                      <Button variant="primary" shape="rounded" size="sm" onClick={() => setIsFilterOpen(false)}>Apply</Button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <Button variant="outline" shape="rounded" className="px-3" disabled={isDownloading}>
              <Download size={16} />
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto [&::-webkit-scrollbar]:hidden">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-gray-50 text-text-secondary text-[11px] font-bold uppercase tracking-wider">
                <th className="py-3 px-6 text-center">Order ID</th>
                <th className="py-3 px-6 text-center">Date</th>
                <th className="py-3 px-6 text-center">Time</th>
                <th className="py-3 px-6 text-center">Items Summary</th>
                <th className="py-3 px-6 text-center">Status</th>
                <th className="py-3 px-6 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr
                  key={tx.id}
                  className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors cursor-pointer"
                  onClick={() => setSelectedTransaction(tx)}
                >
                  <td className="py-4 px-6 font-bold text-text-primary text-sm text-center">{tx.orderNumber}</td>
                  <td className="py-4 px-6 text-sm text-text-secondary text-center">{tx.date}</td>
                  <td className="py-4 px-6 text-sm text-text-secondary text-center">{tx.time}</td>
                  <td className="py-4 px-6 text-[13px] text-text-primary truncate max-w-[220px] text-center">{tx.items}</td>
                  <td className="py-4 px-6 text-center">
                    <Badge
                      color={tx.status === "cancelled" ? "error" : tx.status === "ready" || tx.status === "served" ? "success" : "warning"}
                      variant="subtle"
                      shape="pill"
                      className="text-[11px]"
                    >
                      {capitalize(tx.status)}
                    </Badge>
                  </td>
                  <td className="py-4 px-6 text-right font-bold text-text-primary text-sm">
                    {formatMoney(tx.total)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="border-t border-gray-50 flex justify-between items-center px-4 py-4 text-sm text-text-secondary">
          <span>Showing {startIndex} to {endIndex} of {total} transactions</span>
          <div className="flex items-center gap-2">
            <button
              className="px-3 py-1 rounded hover:bg-gray-100 disabled:opacity-50 inline-flex items-center gap-1"
              disabled={page <= 1}
              onClick={() => setPage((c) => Math.max(1, c - 1))}
            >
              <ChevronLeft size={14} /> Prev
            </button>
            <span className="px-3 py-1 rounded bg-gray-50 text-text-primary font-medium">{page} / {totalPages || 1}</span>
            <button
              className="px-3 py-1 rounded hover:bg-gray-100 disabled:opacity-50 inline-flex items-center gap-1"
              disabled={page >= totalPages}
              onClick={() => setPage((c) => Math.min(totalPages, c + 1))}
            >
              Next <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

      <TransactionDetailsModal
        transaction={selectedTransaction}
        isOpen={selectedTransaction !== null}
        onClose={() => setSelectedTransaction(null)}
      />
    </>
  );
}