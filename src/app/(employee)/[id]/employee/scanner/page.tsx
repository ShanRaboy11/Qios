"use client";

import React, { use } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/organisms/navbar";
import { QrScanner } from "@/components/organisms/QrScanner";
import { motion, AnimatePresence } from "framer-motion";

export default function ScannerPage({
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
        activeView="scanner"
        onNavigate={(view) => {
          if (view === "scanner") return;
          router.push(`/${id}/employee/${view}`);
        }}
        className="z-[100]"
      />

      <div className="flex-1 max-w-[1440px] w-full mx-auto p-4 md:p-8 lg:p-12 mt-28 relative z-10 flex flex-col items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key="employee-scanner"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="w-full flex justify-center"
          >
            <QrScanner />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
