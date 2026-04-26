"use client";

import React, { useState } from "react";
import { AdminDashboardHeader } from "@/components/organisms/AdminDashboardHeader";
import { AdminMetricsRow } from "@/components/organisms/AdminMetricsRow";
import { AdminChartsSection } from "@/components/organisms/AdminChartsSection";
import { AdminListsSection } from "@/components/organisms/AdminListsSection";
import TenantManagement from "@/components/organisms/TenantManagement";

import { motion, AnimatePresence } from "framer-motion";

export default function AdminDashboardPage() {
  const [currentView, setCurrentView] = useState<"dashboard" | "tenant">("dashboard");

  return (
    <div className="min-h-screen bg-[#FFF9EF] p-4 md:p-8 lg:p-12 overflow-x-hidden">
      <div className="max-w-[1440px] mx-auto flex flex-col">
        <AdminDashboardHeader 
          onCompaniesClick={() => setCurrentView(currentView === "dashboard" ? "tenant" : "dashboard")}
          isCompaniesActive={currentView === "tenant"}
        />
        
        <AnimatePresence mode="wait">
          {currentView === "dashboard" ? (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <AdminMetricsRow />
              <AdminChartsSection />
              <AdminListsSection />
            </motion.div>
          ) : (
            <motion.div
              key="tenant"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <TenantManagement />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
