"use client";

import React, { use } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/organisms/navbar";
import { motion, AnimatePresence } from "framer-motion";

export default function InventoryAuditPage({
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
        activeView="inventory_audit"
        onNavigate={(view) => {
          if (view === "inventory_audit") return;
          router.push(`/${id}/employee/${view}`);
        }}
        className="z-[100]"
      />

      <div className="flex-1 max-w-[1440px] w-full mx-auto p-4 md:p-8 lg:p-12 mt-28 relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key="employee-inventory"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="flex flex-col w-full gap-6 md:gap-8"
          >
            <header className="mb-2">
              <h1 className="text-3xl font-bold text-gray-900">
                Inventory Audit
              </h1>
              <p className="text-gray-600 mt-1">
                Quick stock updates and low stock alerts.
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
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Inventory System Placeholder
              </h3>
              <p className="text-gray-500 max-w-md mx-auto">
                The full inventory audit list will be populated here, allowing
                staff to quickly update quantities directly from the floor.
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
