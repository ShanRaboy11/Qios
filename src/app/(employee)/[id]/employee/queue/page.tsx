"use client";

import React, { use } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/organisms/navbar";
import KitchenPreparationDashboard from "@/components/organisms/KitchenPreparationDashboard";
import { motion, AnimatePresence } from "framer-motion";

export default function OrderQueuePage({
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
        activeView="queue"
        onNavigate={(view) => {
          if (view === "queue") return;
          router.push(`/${id}/employee/${view}`);
        }}
        className="z-[100]"
      />

      <div className="flex-1 w-full pt-20 relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key="employee-queue"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="w-full h-[calc(100vh-80px)]"
          >
            <KitchenPreparationDashboard />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
