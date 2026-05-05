"use client";

import React, { useState } from "react";
import { Badge } from "@/components/atoms/Badge";
import { Input } from "@/components/atoms/Input";
import { Search, Download, Filter } from "lucide-react";
import { Button } from "@/components/atoms/Button";

const mockTransactions = [
  { id: "ORD-1029", time: "10:24 AM", items: "Truffle Burger, Fries...", total: 450, status: "Completed", method: "Cash" },
  { id: "ORD-1030", time: "10:28 AM", items: "Iced Macchiato (2)", total: 320, status: "Completed", method: "E-Wallet" },
  { id: "ORD-1031", time: "10:35 AM", items: "Classic Burger", total: 250, status: "Refunded", method: "Card" },
  { id: "ORD-1032", time: "10:41 AM", items: "Chicken Wings (6pc)", total: 380, status: "Completed", method: "E-Wallet" },
  { id: "ORD-1033", time: "10:55 AM", items: "Onion Rings, Soda", total: 180, status: "Completed", method: "Cash" },
  { id: "ORD-1034", time: "11:05 AM", items: "Family Bundle A", total: 1250, status: "Completed", method: "Card" },
];

export const TransactionTable = () => {
  const [search, setSearch] = useState("");

  return (
    <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full w-full">
      <div className="p-6 border-b border-gray-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="font-bold text-xl text-text-primary">Recent Transactions</h3>
          <p className="text-sm text-text-secondary mt-1">
            Detailed log of all store orders
          </p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search Order ID..."
              className="pl-9 py-2 text-sm rounded-xl"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button variant="outline" shape="rounded" className="px-3" title="Filter">
            <Filter size={16} />
          </Button>
          <Button variant="outline" shape="rounded" className="px-3" title="Export">
            <Download size={16} />
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <table className="w-full text-left border-collapse whitespace-nowrap">
          <thead>
            <tr className="bg-gray-50 text-text-secondary text-[11px] font-bold uppercase tracking-wider">
              <th className="py-3 px-6">Order ID</th>
              <th className="py-3 px-6">Time</th>
              <th className="py-3 px-6">Items Summary</th>
              <th className="py-3 px-6">Method</th>
              <th className="py-3 px-6 text-center">Status</th>
              <th className="py-3 px-6 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {mockTransactions.map((tx) => (
              <tr
                key={tx.id}
                className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors"
              >
                <td className="py-4 px-6 font-bold text-text-primary text-sm">
                  {tx.id}
                </td>
                <td className="py-4 px-6 text-sm text-text-secondary">
                  {tx.time}
                </td>
                <td className="py-4 px-6 text-[13px] text-text-primary truncate max-w-[150px]">
                  {tx.items}
                </td>
                <td className="py-4 px-6 text-[13px] text-text-secondary">
                  {tx.method}
                </td>
                <td className="py-4 px-6 text-center">
                  <Badge
                    color={tx.status === "Completed" ? "success" : "error"}
                    variant="subtle"
                    shape="pill"
                    className="justify-center text-[11px] py-0.5"
                  >
                    {tx.status}
                  </Badge>
                </td>
                <td className="py-4 px-6 text-right font-bold text-text-primary text-sm">
                  ₱{tx.total.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="p-4 border-t border-gray-50 flex justify-between items-center text-sm text-text-secondary">
         <span>Showing 6 of 145 transactions</span>
         <div className="flex gap-2">
            <button className="px-3 py-1 rounded hover:bg-gray-100 disabled:opacity-50">Prev</button>
            <button className="px-3 py-1 rounded hover:bg-gray-100">Next</button>
         </div>
      </div>
    </div>
  );
};
