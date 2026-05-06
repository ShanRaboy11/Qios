"use client";

import React, { useState, Suspense } from "react";
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
import { useSearchParams, useRouter, useParams } from "next/navigation";

// import the new organisms
import MenuInventory from "@/components/organisms/MenuInventory";
import IngredientsInventory from "@/components/organisms/IngredientsInventory";
import MenuCategoryManagement from "@/components/organisms/MenuCategoryManagement";
import StaffManagement from "@/components/organisms/StaffManagement";
import RolesManagement from "@/components/organisms/RolesManagement";
import SalesManagement from "@/components/organisms/SalesManagement";
import AuditLogsManagement from "@/components/organisms/AuditLogsManagement";
import { Button } from "@/components/atoms/Button";

type ViewState =
  | "dashboard"
  | "menu"
  | "inventory"
  | "staff"
  | "roles"
  | "sales"
  | "audit_logs";

export default function TenantDashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-bg-primary flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      }
    >
      <TenantDashboardContent />
    </Suspense>
  );
}

function TenantDashboardContent() {
  const searchParams = useSearchParams();
  const initialViewParam = searchParams.get("view") as ViewState | null;
  const initialView =
    initialViewParam &&
    [
      "dashboard",
      "menu",
      "inventory",
      "staff",
      "roles",
      "sales",
      "audit_logs",
    ].includes(initialViewParam)
      ? initialViewParam
      : "dashboard";

  const [currentView, setCurrentView] = useState<ViewState>(initialView);
  const router = useRouter();
  const paramsHook = useParams();
  const tenantId = paramsHook.id as string;



  React.useEffect(() => {
    const view = searchParams.get("view") as ViewState;
    if (
      view &&
      [
        "dashboard",
        "menu",
        "inventory",
        "staff",
        "roles",
        "sales",
        "audit_logs",
      ].includes(view) &&
      view !== currentView
    ) {
      setCurrentView(view);
    }
  }, [searchParams, currentView]);

  const handleNavigation = (view: string) => {
    if (view === "settings") {
      router.push(`/${tenantId}/${view}`);
      return;
    }

    if (currentView === view) return;

    setCurrentView(view as ViewState);
    
    // update URL using pushState for deep linking without reload
    const newUrl = view === "dashboard" ? `/${tenantId}/dashboard` : `/${tenantId}/${view}`;
    window.history.pushState(null, "", newUrl);
  };

  return (
    <div className="min-h-screen bg-bg-primary overflow-x-hidden relative flex flex-col">
      {/* background moving blobs */}
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
        onNavigate={(view) => handleNavigation(view)}
        className="z-[100]"
      />

      <div className="flex-1 max-w-[1440px] w-full mx-auto flex flex-col p-4 md:p-8 lg:p-12 mt-28 relative z-[90] pb-20">
        <AnimatePresence mode="popLayout">
          {currentView === "dashboard" ? (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="flex flex-col gap-8 w-full"
            >
              <TenantDashboardHeader />

              {/* low stock alert */}
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
                onClose={() => {}} // placeholder for close action
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
          ) : currentView === "menu" ? (
            <motion.div
              key="menu"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="mt-4 flex flex-col w-full"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                  <h2 className="h2 text-text-primary">Menu Management</h2>
                  <p className="b1 text-text-secondary mt-2">
                    Manage your restaurant&apos;s digital menu, categories, and item availability
                  </p>
                </div>
              </div>
              <MenuCategoryManagement />
            </motion.div>
          ) : currentView === "inventory" ? (
            <motion.div
              key="inventory"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="mt-4 flex flex-col w-full"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                  <h2 className="h2 text-text-primary">Inventory Configuration</h2>
                  <p className="b1 text-text-secondary mt-2">
                    Track ingredients, set stock alerts, and manage recipe deductions
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-8 w-full">
                <MenuInventory />
                <IngredientsInventory />
              </div>
            </motion.div>
          ) : currentView === "staff" ? (
            <motion.div
              key="staff"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="mt-4 flex flex-col w-full"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                  <h2 className="h2 text-text-primary">Staff Management</h2>
                  <p className="b1 text-text-secondary mt-2">
                    Manage employee records, monitor performance, and track attendance
                  </p>
                </div>
                {/* Wait, the "Add New Staff" button is now in StaffManagement.tsx. I removed it. Let's add it back here! */}
                <div className="flex items-center gap-3">
                  <Button
                    variant="primary"
                    shape="rounded"
                    leftIcon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>}
                    onClick={() => handleNavigation("roles")}
                  >
                    Add New Staff
                  </Button>
                </div>
              </div>
              <StaffManagement />
            </motion.div>
          ) : currentView === "roles" ? (
            <motion.div
              key="roles"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="mt-4 flex flex-col w-full"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                  <h2 className="h2 text-text-primary">Role Management</h2>
                  <p className="b1 text-text-secondary mt-2">
                    Define staff roles, configure permissions, and control system access
                  </p>
                </div>
              </div>
              <RolesManagement />
            </motion.div>
          ) : currentView === "sales" ? (
            <motion.div
              key="sales"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="mt-4 flex flex-col w-full"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                  <h2 className="h2 text-text-primary">Sales</h2>
                  <p className="b1 text-text-secondary mt-2">
                    View revenue insights, transaction history, and detailed sales reports
                  </p>
                </div>
              </div>
              <SalesManagement />
            </motion.div>
          ) : currentView === "audit_logs" ? (
            <motion.div
              key="audit_logs"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="mt-4 flex flex-col w-full"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                  <h2 className="h2 text-text-primary">Audits</h2>
                  <p className="b1 text-text-secondary mt-2">
                    Monitor system activity, user actions, and security logs
                  </p>
                </div>
              </div>
              <AuditLogsManagement />
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
      <div className="relative bottom-0 inset-x-0 h-40 bg-gradient-to-t from-white via-white/50 to-transparent z-[2] pointer-events-none" />
      <Footer hideSocials />
    </div>
  );
}
