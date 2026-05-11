"use client";

import React from "react";

export default function TransactionsPage() {
  return (
    <>
      <header className="mb-2">
        <h2 className="h2 text-text-primary">Transactions</h2>
        <p className="b1 text-text-secondary mt-2">
          Review today's orders and process refunds
        </p>
      </header>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
        <div className="text-gray-400 mb-4">
          <svg
            className="w-16 h-16 mx-auto"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-2">
          Transactions Ledger Placeholder
        </h3>
        <p className="text-gray-500 max-w-md mx-auto">
          A table of today's completed orders will appear here, giving cashiers
          the ability to quickly reprint tickets or process voids.
        </p>
      </div>
    </>
  );
}
