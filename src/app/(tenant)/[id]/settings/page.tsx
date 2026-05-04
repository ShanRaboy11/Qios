"use client";

import React from "react";
import { Navbar } from "@/components/organisms/navbar";
import { Footer } from "@/components/organisms/footer";
import { useRouter, useParams } from "next/navigation";
import { TenantSettings } from "@/components/organisms/TenantSettings";
import { motion, AnimatePresence } from "framer-motion";

export default function SettingsPage() {
  const router = useRouter();
  const params = useParams();
  const tenantId = params.id as string;

  return (
    <div className="min-h-screen bg-bg-primary overflow-x-hidden flex flex-col relative">
      <Navbar
        variant="transparent"
        type="tenant"
        activeView="settings"
        onNavigate={(view) => {
          if (view === "settings") return;
          router.push(`/${tenantId}/${view}`);
        }}
        className="z-[100]"
      />

      <div className="flex-1 max-w-[1440px] w-full mx-auto p-4 md:p-8 lg:p-12 mt-28 relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key="settings"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="flex flex-col w-full"
          >
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-text-primary">
                Account Settings
              </h1>
              <p className="text-text-secondary mt-1">
                Manage your personal profile, store preferences, and billing
                information.
              </p>
            </div>

            <TenantSettings />
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="bottom-0 inset-x-0 h-40 bg-gradient-to-t from-white via-white/50 to-transparent z-[100] pointer-events-none" />
      <Footer hideSocials />
    </div>
  );
}
