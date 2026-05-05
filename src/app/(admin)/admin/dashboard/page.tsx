"use client";

import React, { useState, Suspense } from "react";
import { AdminDashboardHeader } from "@/components/organisms/AdminDashboardHeader";
import { AdminMetricsRow } from "@/components/organisms/AdminMetricsRow";
import { AdminChartsSection } from "@/components/organisms/AdminChartsSection";
import { AdminListsSection } from "@/components/organisms/AdminListsSection";
import TenantManagement from "@/components/organisms/TenantManagement";
import { SystemActivity } from "@/components/organisms/SystemActivity";
import { AdminSettings } from "@/components/organisms/AdminSettings";
import { Footer } from "@/components/organisms/footer";
import SubscriptionManagement from "@/components/organisms/SubscriptionManagement";
import { Navbar } from "@/components/organisms/navbar";
import { LogOut } from "lucide-react";

import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams, useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

type ViewState =
  | "dashboard"
  | "tenant"
  | "system_activity"
  | "subscription"
  | "settings";

export default function AdminDashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-bg-primary flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      }
    >
      <AdminDashboardContent />
    </Suspense>
  );
}

function AdminDashboardContent() {
  const searchParams = useSearchParams();
  const initialViewParam = searchParams.get("view") as ViewState | null;
  const initialView =
    initialViewParam &&
    [
      "dashboard",
      "tenant",
      "system_activity",
      "subscription",
      "settings",
    ].includes(initialViewParam)
      ? initialViewParam
      : "dashboard";

  const [currentView, setCurrentView] = useState<ViewState>(initialView);
  const [initialTenantFilter, setInitialTenantFilter] = useState<
    string | undefined
  >();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const transitionTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const router = useRouter();

  React.useEffect(() => {
    return () => {
      if (transitionTimerRef.current) {
        clearTimeout(transitionTimerRef.current);
      }
    };
  }, []);

  React.useEffect(() => {
    const view = searchParams.get("view") as ViewState;
    if (
      view &&
      [
        "dashboard",
        "tenant",
        "system_activity",
        "subscription",
        "settings",
      ].includes(view) &&
      view !== currentView
    ) {
      setCurrentView(view);
    }
  }, [searchParams]);

  const handleLogout = async () => {
    try {
      const supabase = createSupabaseBrowserClient();
      await supabase.auth.signOut();
    } catch {
      // ignore if supabase not configured
    }
    router.push("/login");
  };

  const handleNavigation = (view: ViewState, tenantFilter?: string) => {
    if (currentView === view && view !== "tenant") return;

    if (transitionTimerRef.current) {
      clearTimeout(transitionTimerRef.current);
    }

    setIsTransitioning(true);

    // Keep transitions quick so the directory feels responsive.
    transitionTimerRef.current = setTimeout(() => {
      setInitialTenantFilter(tenantFilter);
      setCurrentView(view);
      setIsTransitioning(false);
    }, 220);
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

      <Navbar
        variant="transparent"
        type="admin"
        activeView={currentView}
        onNavigate={(view) => handleNavigation(view as ViewState)}
      />
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
                  <span className="h1 text-text-primary">Subscription and Plans</span>
                  <p className="h4 text-text-secondary mt-2">
                    Configure subscription plans and feature access.
                  </p>
                </div>
              </div>
              <SubscriptionManagement />
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
              <AdminSettings />
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
