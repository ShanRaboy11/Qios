"use client";

import React, { use } from "react";
import { useRouter } from "next/navigation";
import { KPICard } from "@/components/molecules/KPICard";
import { DashboardListItem } from "@/components/molecules/DashboardListItem";
import { Clock, CheckCircle2, ChefHat, Activity } from "lucide-react";
import { Navbar } from "@/components/organisms/navbar";
import { motion, AnimatePresence } from "framer-motion";

export default function EmployeeDashboard({
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
        activeView="dashboard"
        onNavigate={(view) => {
          if (view === "dashboard") return;
          router.push(`/${id}/employee/${view}`);
        }}
        className="z-[100]"
      />

      <div className="flex-1 max-w-[1440px] w-full mx-auto p-4 md:p-8 lg:p-12 mt-28 relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key="employee-dashboard"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="flex flex-col w-full gap-6 md:gap-8"
          >
            <header className="mb-2">
              <h1 className="text-3xl font-bold text-gray-900">Operational Overview</h1>
              <p className="text-gray-600 mt-1">Your daily tasks and overall performance.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <KPICard
                title="Pending Orders"
                value="12"
                description="Orders waiting"
                percentageChange={0}
                icon={<Clock size={24} />}
                color="primary"
              />
              <KPICard
                title="Completed Today"
                value="45"
                description="Served"
                percentageChange={5}
                icon={<CheckCircle2 size={24} />}
                color="secondary"
              />
              <KPICard
                title="Avg Prep Time"
                value="14 m"
                description="Mins per order"
                percentageChange={-2}
                icon={<ChefHat size={24} />}
                color="accent"
              />
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mt-4">
              <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
              <div className="space-y-0">
                <DashboardListItem
                  title="Order #1024"
                  subtitle="Double Cheeseburger, Fries"
                  icon={
                    <div className="bg-blue-100 p-2 rounded-full text-blue-600">
                      <Activity size={20} />
                    </div>
                  }
                  rightContent={
                    <div className="text-right">
                      <p className="text-sm font-medium">Just now</p>
                      <p className="text-xs text-gray-500">Prep started</p>
                    </div>
                  }
                />
                <DashboardListItem
                  title="Order #1023"
                  subtitle="Caesar Salad, Coke"
                  icon={
                    <div className="bg-green-100 p-2 rounded-full text-green-600">
                      <CheckCircle2 size={20} />
                    </div>
                  }
                  rightContent={
                    <div className="text-right">
                      <p className="text-sm font-medium">5 mins ago</p>
                      <p className="text-xs text-gray-500">Ready to serve</p>
                    </div>
                  }
                  isLast={true}
                />
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
