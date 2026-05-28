"use client";

import React from "react";
import { Navbar } from "@/components/organisms/navbar";
import { Footer } from "@/components/organisms/footer";
import { motion } from "framer-motion";
import { usePathname, useRouter, useParams } from "next/navigation";

export function EmployeeDashboardShell({
  children,
  storeName,
}: {
  children: React.ReactNode;
  storeName: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const params = useParams();
  const tenantId = params.id as string;

  let currentView = "dashboard";
  if (pathname.includes("/queue")) currentView = "queue";
  if (pathname.includes("/scanner")) currentView = "scanner";
  if (pathname.includes("/inventory_audit")) currentView = "inventory_audit";
  if (pathname.includes("/stock_audit")) currentView = "stock_audit";
  if (pathname.includes("/transactions")) currentView = "transactions";
  if (pathname.includes("/kitchen")) currentView = "kitchen";
  if (pathname.includes("/settings")) currentView = "settings";

  const handleNavigation = (view: string) => {
    if (view === currentView) return;
    router.push(`/${tenantId}/employee/${view}`);
  };

  return (
    <div className="min-h-screen bg-bg-primary overflow-x-hidden relative flex flex-col">
      {/* Background moving blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <motion.div
          animate={{ x: [0, 100, -50, 0], y: [0, -100, 50, 0], scale: [1, 1.2, 0.8, 1] }}
          transition={{ duration: 60, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
          className="absolute top-[10%] left-[20%] w-[500px] h-[500px] bg-brand-primary rounded-full mix-blend-multiply filter blur-[80px] opacity-15"
        />
        <motion.div
          animate={{ x: [0, -120, 80, 0], y: [0, 80, -120, 0], scale: [1, 0.8, 1.2, 1] }}
          transition={{ duration: 75, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
          className="absolute top-[40%] right-[10%] w-[600px] h-[600px] bg-brand-secondary rounded-full mix-blend-multiply filter blur-[100px] opacity-20"
        />
        <motion.div
          animate={{ x: [0, 150, -100, 0], y: [0, 100, -150, 0], scale: [1, 1.3, 0.9, 1] }}
          transition={{ duration: 66, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
          className="absolute bottom-[-10%] left-[40%] w-[700px] h-[700px] bg-brand-accent rounded-full mix-blend-multiply filter blur-[120px] opacity-15"
        />
      </div>

      <div className="relative z-[40]">
        <Navbar
          variant="transparent"
          type="employee"
          activeView={currentView}
          onNavigate={handleNavigation}
        />
      </div>

      <div className="flex-1 max-w-[1440px] w-full mx-auto flex flex-col p-4 md:p-8 lg:p-12 mt-28 relative">
        {children}
      </div>

      <div className="relative bottom-0 inset-x-0 h-40 bg-gradient-to-t from-white via-white/50 to-transparent z-[2] pointer-events-none" />
      <Footer hideSocials variant="tenant" tenantName={storeName} />
    </div>
  );
}
