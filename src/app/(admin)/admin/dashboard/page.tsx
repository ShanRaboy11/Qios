import React from "react";
import { SystemActivity } from "@/components/organisms/SystemActivity";

export default function AdminDashboardPage() {
  return (
    <main className="min-h-screen bg-bg-primary">
      <div className="max-w-full mx-auto py-8">
        <h1 className="text-3xl font-bold text-text-primary mb-8 px-6 md:px-8">System Dashboard</h1>
        <SystemActivity />
      </div>
    </main>
  );
}