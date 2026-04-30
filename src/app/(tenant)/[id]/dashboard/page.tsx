"use client";

import React, { useState } from "react";
import { TenantDashboardHeader } from "@/components/organisms/TenantDashboardHeader";
import { TenantMetricsSection } from "@/components/organisms/TenantMetricsSection";
import { SalesAndPurchaseChart } from "@/components/organisms/SalesAndPurchaseChart";
import { OverallInformation } from "@/components/organisms/OverallInformation";
import { DashboardListsSection } from "@/components/organisms/DashboardListsSection";
import { AlertBanner } from "@/components/molecules/AlertBanner";
import Link from "next/link";
import { Navbar } from "@/components/organisms/navbar";
import { Footer } from "@/components/organisms/footer";
import { motion, AnimatePresence } from "framer-motion";

type ViewState =
  | "dashboard"
  | "menu"
  | "inventory"
  | "staff"
  | "sales"
  | "audit_logs";

export default function TenantDashboardPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [currentView, setCurrentView] = useState<ViewState>("dashboard");
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleNavigation = (view: ViewState) => {
    if (currentView === view) return;

    setIsTransitioning(true);

    // Simulate loading delay for skeleton
    setTimeout(() => {
      setCurrentView(view);
      setIsTransitioning(false);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-bg-primary overflow-x-hidden relative">
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-[1]">
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

      <Navbar
        variant="transparent"
        type="tenant"
        activeView={currentView}
        onNavigate={(view) => handleNavigation(view as ViewState)}
        className="z-[100]"
      />

      <div className="max-w-[1440px] mx-auto flex flex-col p-4 md:p-8 lg:p-12 mt-28 relative z-[90] pb-20">
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
              {/* Header Skeleton */}
              <div className="flex flex-col md:flex-row justify-between md:items-end gap-4 mb-4">
                <div className="flex flex-col gap-2">
                  <div className="h-10 w-64 bg-white border border-gray-100 shadow-sm rounded-xl animate-pulse" />
                  <div className="h-5 w-48 bg-white border border-gray-100 shadow-sm rounded-lg animate-pulse" />
                </div>
                <div className="h-10 w-full md:w-[280px] bg-white border border-gray-100 shadow-sm rounded-xl animate-pulse" />
              </div>

              {/* Alert Banner Skeleton */}
              <div className="h-12 w-full bg-red-50 border border-red-100 shadow-sm rounded-xl animate-pulse" />

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
              <div className="flex flex-col lg:flex-row gap-6">
                <div className="w-full lg:w-[65%] h-[400px] bg-white border border-gray-100 shadow-sm rounded-[24px] animate-pulse" />
                <div className="w-full lg:w-[35%] h-[400px] bg-white border border-gray-100 shadow-sm rounded-[24px] animate-pulse" />
              </div>
            </motion.div>
          ) : currentView === "dashboard" ? (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="flex flex-col gap-8"
            >
              <TenantDashboardHeader />

              {/* Low Stock Alert */}
              <AlertBanner
                message={
                  <>
                    Your Ingredient{" "}
                    <span className="text-[#EF4444]">Salt is running low.</span>{" "}
                    <Link
                      href="#"
                      className="underline decoration-[#EF4444] text-[#EF4444]"
                    >
                      Add Stock
                    </Link>
                  </>
                }
                onClose={() => {}} // Placeholder for close action
              />

              <TenantMetricsSection />

              <div className="flex flex-col lg:flex-row gap-6">
                <div className="w-full lg:w-[65%]">
                  <SalesAndPurchaseChart />
                </div>
                <div className="w-full lg:w-[35%]">
                  <OverallInformation />
                </div>
              </div>

              <DashboardListsSection />
            </motion.div>
          ) : (
            <motion.div
              key={currentView}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="mt-4"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                  <span className="h1 text-text-primary capitalize">
                    {currentView.replace("_", " ")}
                  </span>
                  <p className="h4 text-text-secondary mt-2">
                    Manage your {currentView.replace("_", " ")} and
                    configurations.
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-center h-[400px] bg-white rounded-[24px] shadow-sm">
                <h2 className="text-2xl font-bold text-text-primary">
                  Coming Soon
                </h2>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="bottom-0 inset-x-0 h-40 bg-gradient-to-t from-white via-white/50 to-transparent z-[100] pointer-events-none" />
      <Footer hideSocials />
    </div>
  );
}
