"use client";

import React, { useState, useMemo } from "react";
// Assuming you have lucide-react installed for icons
import { 
  Search, 
  Filter, 
  ChevronDown, 
  Download, 
  ChevronLeft, 
  ChevronRight,
  X // For the modal close button
} from "lucide-react";

// --- Helper Functions ---
// Placed here to be accessible by the component
const capitalize = (s: string) => (s && s.charAt(0).toUpperCase() + s.slice(1)) || "";
const formatMoney = (amount: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

// --- Mock Components (to prevent errors from missing imports) ---
// These are simple stand-ins. You can replace them with your actual component library imports.
const Button = ({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: string; shape?: string; size?: string; title?: string; }) => (
  <button {...props}>{children}</button>
);
const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => <input {...props} />;
const Badge = ({ children, className, ...props }: React.HTMLAttributes<HTMLSpanElement> & { color?: string; variant?: string; shape?: string; }) => (
  <span className={className} {...props}>{children}</span>
);

// A simple mock for the Transaction Details Modal
const TransactionDetailsModal = ({ transaction, isOpen, onClose }: { transaction: any; isOpen: boolean; onClose: () => void; }) => {
  if (!isOpen || !transaction) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[100] flex items-center justify-center">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md relative">
         <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700">
            <X size={24} />
         </button>
        <h3 className="text-lg font-bold">Order: {transaction.orderNumber}</h3>
        <p className="mt-2 text-sm text-gray-600">Items: {transaction.items}</p>
        <p className="mt-4 text-right font-bold text-lg">Total: {formatMoney(transaction.total)}</p>
      </div>
    </div>
  );
};


export default function TransactionsPage() {
  // --- STATE MANAGEMENT ---
  // All state from the original component is now managed here.
  const [searchInput, setSearchInput] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
  
  // Mock data fetching state
  const [isLoading, setIsLoading] = useState(false); 
  const [isDownloading, setIsDownloading] = useState(false);

  // --- CONSTANTS AND MOCK DATA ---
  const STATUS_OPTIONS = ["all", "pending", "ready", "served", "cancelled"] as const;
  const PAYMENT_STATUS_OPTIONS = ["all", "paid", "unpaid", "refunded"] as const;

  // Mock transaction data. Replace this with your actual data fetching logic.
  const allTransactions = [
    { id: 1, orderNumber: "#ORD-5551", date: "May 24, 2024", time: "10:30 AM", items: "2x Cappuccino, 1x Croissant", status: "served", total: 12.50 },
    { id: 2, orderNumber: "#ORD-5552", date: "May 24, 2024", time: "10:35 AM", items: "1x Americano", status: "ready", total: 4.00 },
    { id: 3, orderNumber: "#ORD-5553", date: "May 24, 2024", time: "10:42 AM", items: "3x Espresso, 1x Muffin", status: "cancelled", total: 11.25 },
    { id: 4, orderNumber: "#ORD-5554", date: "May 24, 2024", time: "11:05 AM", items: "1x Iced Latte", status: "served", total: 5.50 },
    { id: 5, orderNumber: "#ORD-5555", date: "May 24, 2024", time: "11:15 AM", items: "1x Flat White, 2x Scone", status: "pending", total: 9.75 },
  ];
  const transactions = allTransactions; // In a real app, you would filter this based on state
  
  // Pagination logic
  const limit = 10;
  const total = transactions.length;
  const totalPages = Math.ceil(total / limit);
  const startIndex = (page - 1) * limit + 1;
  const endIndex = Math.min(page * limit, total);
  
  // Filter summary logic
  const filterSummary = useMemo(() => {
    let count = 0;
    if (statusFilter !== "all") count++;
    if (paymentStatusFilter !== "all") count++;
    return count;
  }, [statusFilter, paymentStatusFilter]);

  // --- HANDLER FUNCTIONS ---
  const clearFilters = () => {
    setStatusFilter("all");
    setPaymentStatusFilter("all");
    setIsFilterOpen(false);
    setPage(1);
  };

  const exportTransactions = () => {
    setIsDownloading(true);
    console.log("Exporting transactions...");
    // Simulate a download process
    setTimeout(() => setIsDownloading(false), 1500);
  };

  return (
    <>
      {/* THIS IS THE ORIGINAL HEADER FROM YOUR LAYOUT */}
      <header className="mb-6">
        <h2 className="text-2xl font-bold text-text-primary">Transactions</h2>
        <p className="text-base text-text-secondary mt-2">
          Review today's orders and process refunds
        </p>
      </header>

      {/* THIS IS THE INTEGRATED CODE BLOCK */}
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
                className="pl-11 pr-4 py-2.5 text-sm rounded-2xl border-gray-200 bg-gray-50/80 focus:bg-white w-full border outline-none focus:ring-2 focus:ring-brand-primary"
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
              />
            </div>
            <div className="relative">
              <Button
                variant="outline"
                shape="rounded"
                className="px-4 py-2.5 flex items-center border border-gray-200 rounded-xl bg-white hover:bg-gray-50"
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
                    <button
                      onClick={clearFilters}
                      className="text-xs font-medium text-brand-primary hover:text-brand-primary/80 hover:underline transition-colors duration-200"
                    >
                      Clear all
                    </button>
                  </div>
                  <div className="mt-4 space-y-4">
                    <div>
                      <span className="text-text-secondary text-[11px] font-bold uppercase tracking-[0.16em]">Order Status</span>
                      <div className="relative mt-1.5">
                        <select
                          value={statusFilter}
                          onChange={(event) => {
                            setStatusFilter(event.target.value);
                            setPage(1);
                          }}
                          className="w-full rounded-2xl border-2 border-[#E5E5E5] bg-white px-6 py-3.5 text-sm text-text-primary outline-none focus:border-brand-primary focus:shadow-[0_0_0_4px_rgba(255,198,112,0.08)] appearance-none cursor-pointer transition-colors"
                        >
                          {STATUS_OPTIONS.map((option) => (
                            <option key={option} value={option}>
                              {capitalize(option)}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                      </div>
                    </div>
                    <div>
                      <span className="text-text-secondary text-[11px] font-bold uppercase tracking-[0.16em]">Payment Status</span>
                      <div className="relative mt-1.5">
                        <select
                          value={paymentStatusFilter}
                          onChange={(event) => {
                            setPaymentStatusFilter(event.target.value);
                            setPage(1);
                          }}
                          className="w-full rounded-2xl border-2 border-[#E5E5E5] bg-white px-6 py-3.5 text-sm text-text-primary outline-none focus:border-brand-primary focus:shadow-[0_0_0_4px_rgba(255,198,112,0.08)] appearance-none cursor-pointer transition-colors"
                        >
                          {PAYMENT_STATUS_OPTIONS.map((option) => (
                            <option key={option} value={option}>
                              {capitalize(option)}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
                       <Button
                        className="px-4 py-2 border rounded-lg"
                        onClick={clearFilters}
                      >
                        Clear
                      </Button>
                      <Button
                        className="px-4 py-2 bg-gray-800 text-white rounded-lg"
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
              className="px-3 py-2.5 border border-gray-200 rounded-xl bg-white hover:bg-gray-50 disabled:opacity-50"
              title="Export"
              onClick={exportTransactions}
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
                Array.from({ length: 5 }).map((_, index) => (
                    <tr key={`transaction-skeleton-${index}`} className="border-b border-gray-50">
                      <td className="py-4 px-6 text-center"><div className="h-4 rounded bg-gray-200 animate-pulse w-24 mx-auto" /></td>
                      <td className="py-4 px-6 text-center"><div className="h-4 rounded bg-gray-200 animate-pulse w-20 mx-auto" /></td>
                      <td className="py-4 px-6 text-center"><div className="h-4 rounded bg-gray-200 animate-pulse w-20 mx-auto" /></td>
                      <td className="py-4 px-6 text-center"><div className="h-4 rounded bg-gray-200 animate-pulse w-44 mx-auto" /></td>
                      <td className="py-4 px-6 text-center"><div className="h-4 rounded bg-gray-200 animate-pulse w-20 mx-auto" /></td>
                      <td className="py-4 px-6 text-right"><div className="h-4 rounded bg-gray-200 animate-pulse w-24 ml-auto" /></td>
                    </tr>
                  ))
              ) : transactions.length > 0 ? (
                transactions.map((tx) => (
                  <tr
                    key={tx.id}
                    className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors cursor-pointer"
                    onClick={() => setSelectedTransaction(tx)}
                  >
                    <td className="py-4 px-6 font-bold text-text-primary text-sm text-center">{tx.orderNumber}</td>
                    <td className="py-4 px-6 text-sm text-text-secondary text-center">{tx.date}</td>
                    <td className="py-4 px-6 text-sm text-text-secondary text-center">{tx.time}</td>
                    <td className="py-4 px-6 text-[13px] text-text-primary truncate max-w-[220px] text-center">{tx.items || "No items"}</td>
                    <td className="py-4 px-6 text-center">
                      <Badge
                        color={tx.status === "cancelled" ? "error" : tx.status === "ready" || tx.status === "served" ? "success" : "warning"}
                        className={`inline-block text-center text-[11px] py-1 px-3 rounded-full ${
                          tx.status === 'served' ? 'bg-green-100 text-green-800' :
                          tx.status === 'ready' ? 'bg-blue-100 text-blue-800' :
                          tx.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}
                      >
                        {capitalize(tx.status)}
                      </Badge>
                    </td>
                    <td className="py-4 px-6 text-right font-bold text-text-primary text-sm">{formatMoney(tx.total)}</td>
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
    </>
  );
}