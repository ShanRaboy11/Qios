"use client";

import React, { use } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/organisms/navbar";
import { motion, AnimatePresence } from "framer-motion";

export default function TransactionsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  return (
    <div className="flex flex-col min-h-screen bg-bg-primary">
      <Navbar
        type="employee"
        activeView="transactions"
        onNavigate={(view) => {
          if (view === "transactions") return;
          router.push(`/${id}/employee/${view}`);
        }}
        className="z-[100]"
      />

      <div className="flex-1 max-w-[1440px] w-full mx-auto p-4 md:p-8 lg:p-12 mt-28 relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key="employee-transactions"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="flex flex-col w-full gap-6 md:gap-8"
          >
            <header className="mb-2">
              <h1 className="text-3xl font-bold text-gray-900">
                Shift Transactions
              </h1>
              <p className="text-gray-600 mt-1">
                Review today's orders and process refunds.
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
                A table of today's completed orders will appear here, giving
                cashiers the ability to quickly reprint tickets or process
                voids.
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
