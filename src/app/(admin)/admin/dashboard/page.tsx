"use client";

import React, { useState } from "react";
import { AdminDashboardHeader } from "@/components/organisms/AdminDashboardHeader";
import { AdminMetricsRow } from "@/components/organisms/AdminMetricsRow";
import { AdminChartsSection } from "@/components/organisms/AdminChartsSection";
import { AdminListsSection } from "@/components/organisms/AdminListsSection";
import TenantManagement from "@/components/organisms/TenantManagement";
import { SystemActivity } from "@/components/organisms/SystemActivity";

import { motion, AnimatePresence } from "framer-motion";

type ViewState = "dashboard" | "tenant" | "system_activity";

export default function AdminDashboardPage() {
  const [currentView, setCurrentView] = useState<ViewState>("dashboard");
  const [initialTenantFilter, setInitialTenantFilter] = useState<string | undefined>();
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleNavigation = (view: ViewState, tenantFilter?: string) => {
    if (currentView === view && view !== "tenant") return;
    
    setIsTransitioning(true);
    
    // Simulate loading delay for skeleton
    setTimeout(() => {
      setInitialTenantFilter(tenantFilter);
      setCurrentView(view);
      setIsTransitioning(false);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#FFF9EF] p-4 md:p-8 lg:p-12 overflow-x-hidden">
      <div className="max-w-[1440px] mx-auto flex flex-col">
        <AdminDashboardHeader 
          onCompaniesClick={() => handleNavigation(currentView === "dashboard" ? "tenant" : "dashboard")}
          isCompaniesActive={currentView !== "dashboard"}
        />
        
        <AnimatePresence mode="wait">
          {isTransitioning ? (
            <motion.div
              key="skeleton"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="w-full flex flex-col gap-6 mt-4 px-1"
            >
              {/* Top Row Skeleton */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="h-[120px] bg-white border border-gray-100 shadow-sm rounded-[24px] animate-pulse" />
                ))}
              </div>
              
              {/* Main Content Skeleton */}
              <div className="h-[400px] w-full bg-white border border-gray-100 shadow-sm rounded-[24px] animate-pulse" />
              
              {/* Bottom Row Skeleton */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-[250px] bg-white border border-gray-100 shadow-sm rounded-[24px] animate-pulse" />
                ))}
              </div>
            </motion.div>
          ) : currentView === "dashboard" ? (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <AdminMetricsRow />
              <AdminChartsSection />
              <AdminListsSection 
                onViewSystemActivity={() => handleNavigation("system_activity")}
                onViewPendingTenants={() => handleNavigation("tenant", "Pending")}
              />
            </motion.div>
          ) : currentView === "system_activity" ? (
            <motion.div
              key="system_activity"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="mt-4"
            >
               <SystemActivity />
            </motion.div>
          ) : (
            <motion.div
              key="tenant"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="mt-4"
            >
              <TenantManagement initialStatusFilter={initialTenantFilter} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
