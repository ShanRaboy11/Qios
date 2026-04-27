"use client";

import React, { useState } from "react";
import { AdminDashboardHeader } from "@/components/organisms/AdminDashboardHeader";
import { AdminMetricsRow } from "@/components/organisms/AdminMetricsRow";
import { AdminChartsSection } from "@/components/organisms/AdminChartsSection";
import { AdminListsSection } from "@/components/organisms/AdminListsSection";
import TenantManagement from "@/components/organisms/TenantManagement";
import { SystemActivity } from "@/components/organisms/SystemActivity";
import { Footer } from "@/components/organisms/footer";
import { Navbar } from "@/components/organisms/navbar";
import { LogOut } from "lucide-react";

import { motion, AnimatePresence } from "framer-motion";

type ViewState =
  | "dashboard"
  | "tenant"
  | "system_activity"
  | "subscription"
  | "settings";

export default function AdminDashboardPage() {
  const [currentView, setCurrentView] = useState<ViewState>("dashboard");
  const [initialTenantFilter, setInitialTenantFilter] = useState<
    string | undefined
  >();
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
    <div className="min-h-screen bg-bg-primary overflow-x-hidden relative">
      {/* Background Moving Blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <motion.div
          animate={{
            x: [0, 100, -50, 0],
            y: [0, -100, 50, 0],
            scale: [1, 1.2, 0.8, 1],
          }}
          transition={{
            duration: 60,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
          className="absolute top-[10%] left-[20%] w-[500px] h-[500px] bg-[#FFE5BE] rounded-full mix-blend-multiply filter blur-[80px] opacity-15"
        />
        <motion.div
          animate={{
            x: [0, -120, 80, 0],
            y: [0, 80, -120, 0],
            scale: [1, 0.8, 1.2, 1],
          }}
          transition={{
            duration: 75,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
          className="absolute top-[40%] right-[10%] w-[600px] h-[600px] bg-[#FFDF96] rounded-full mix-blend-multiply filter blur-[100px] opacity-20"
        />
        <motion.div
          animate={{
            x: [0, 150, -100, 0],
            y: [0, 100, -150, 0],
            scale: [1, 1.3, 0.9, 1],
          }}
          transition={{
            duration: 66,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
          className="absolute bottom-[-10%] left-[40%] w-[700px] h-[700px] bg-[#FFBDC6] rounded-full mix-blend-multiply filter blur-[120px] opacity-15"
        />
      </div>

      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full flex justify-center z-[100]">
        <div className="w-full">
          <Navbar
            variant="transparent"
            type="admin"
            activeView={currentView}
            onNavigate={(view) => handleNavigation(view as ViewState)}
          />
        </div>
      </div>
      <div className="max-w-[1440px] mx-auto flex flex-col p-4 md:p-8 lg:p-12 mt-28 relative z-[90]">
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
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-[120px] bg-white border border-gray-100 shadow-sm rounded-[24px] animate-pulse"
                  />
                ))}
              </div>

              {/* Main Content Skeleton */}
              <div className="h-[400px] w-full bg-white border border-gray-100 shadow-sm rounded-[24px] animate-pulse" />

              {/* Bottom Row Skeleton */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-[250px] bg-white border border-gray-100 shadow-sm rounded-[24px] animate-pulse"
                  />
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
              <AdminDashboardHeader
                onCompaniesClick={() =>
                  handleNavigation(
                    currentView === "dashboard" ? "tenant" : "dashboard",
                  )
                }
                isCompaniesActive={currentView !== "dashboard"}
              />
              <AdminMetricsRow />
              <AdminChartsSection />
              <AdminListsSection
                onViewSystemActivity={() => handleNavigation("system_activity")}
                onViewPendingTenants={() =>
                  handleNavigation("tenant", "Pending")
                }
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
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                  <span className="h1 text-text-primary">System Activity</span>
                  <p className="h4 text-text-secondary mt-2">
                    Monitor all actions and events across your system.
                  </p>
                </div>
              </div>
              <SystemActivity />
            </motion.div>
          ) : currentView === "subscription" ? (
            <motion.div
              key="subscription"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="mt-4"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                  <span className="h1 text-text-primary">
                    Subscription and Plans
                  </span>
                  <p className="h4 text-text-secondary mt-2">
                    Manage billing, plans, and subscriptions.
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-center h-[400px] bg-white rounded-[24px] shadow-sm">
                <h2 className="text-2xl font-bold text-text-primary">
                  Coming Soon
                </h2>
              </div>
            </motion.div>
          ) : currentView === "settings" ? (
            <motion.div
              key="settings"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="mt-4"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                  <span className="h1 text-text-primary">Settings</span>
                  <p className="h4 text-text-secondary mt-2">
                    Configure system preferences and administrator settings.
                  </p>
                </div>
              </div>
              <div className="flex flex-col h-[400px] bg-white rounded-[24px] shadow-sm relative p-6 sm:p-8">
                <div className="flex-1 flex items-center justify-center">
                  <h2 className="text-2xl font-bold text-text-primary">
                    Coming Soon
                  </h2>
                </div>
                <div className="flex justify-end mt-auto">
                  <button className="flex items-center gap-2 px-6 py-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors font-semibold">
                    <LogOut className="w-5 h-5" />
                    Logout
                  </button>
                </div>
              </div>
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
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                  <span className="h1 text-text-primary">Tenant Directory</span>
                  <p className="h4 text-text-secondary mt-2">
                    Manage all registered tenants and their statuses.
                  </p>
                </div>
              </div>
              <TenantManagement initialStatusFilter={initialTenantFilter} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="relative bottom-0 inset-x-0 h-40 bg-gradient-to-t from-white via-white/50 to-transparent z-[2] pointer-events-none" />

      <Footer hideSocials />
    </div>
  );
}
