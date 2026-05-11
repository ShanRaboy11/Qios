"use client";

import React from "react";
import { KPICard } from "@/components/molecules/KPICard";
import { DashboardListItem } from "@/components/molecules/DashboardListItem";
import { Clock, CheckCircle2, ChefHat, Activity } from "lucide-react";

export default function EmployeeDashboard() {
  return (
    <>
      <header className="mb-2">
        <h2 className="h2 text-text-primary">Operational Overview</h2>
        <p className="b1 text-text-secondary mt-2">
          Your daily tasks and overall performance
        </p>
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
    </>
  );
}
