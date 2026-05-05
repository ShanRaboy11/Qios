"use client";

import React from "react";
import { Navbar } from "@/components/organisms/navbar";
import { Footer } from "@/components/organisms/footer";
import { useRouter, useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { SecurityHighlightsCards } from "@/components/organisms/SecurityHighlightsCards";
import { AuditLogTable } from "@/components/organisms/AuditLogTable";

export default function AuditLogsPage() {
  const router = useRouter();
  const params = useParams();
  const tenantId = params.id as string;

  return (
    <div className="min-h-screen bg-bg-primary overflow-x-hidden flex flex-col relative">
      <Navbar
        variant="transparent"
        type="tenant"
        activeView="audit_logs"
        onNavigate={(view) => {
          if (view === "audit_logs") return;
          router.push(`/${tenantId}/${view}`);
        }}
        className="z-[100]"
      />

      <div className="flex-1 max-w-[1440px] w-full mx-auto p-4 md:p-8 lg:p-12 mt-28 relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key="audit-logs"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="flex flex-col w-full gap-6 md:gap-8"
          >
            <div className="mb-2">
              <h1 className="text-3xl font-bold text-text-primary">
                Audit Logs
              </h1>
              <p className="text-text-secondary mt-1">
                Monitor system activity and security events across your tenant.
              </p>
            </div>

            {/* Top Row: Security Highlights */}
            <SecurityHighlightsCards />

            {/* Main Content: Table */}
            <div className="w-full">
              <AuditLogTable />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="bottom-0 inset-x-0 h-40 bg-gradient-to-t from-white via-white/50 to-transparent z-[10] pointer-events-none" />
      <Footer hideSocials />
    </div>
  );
}
