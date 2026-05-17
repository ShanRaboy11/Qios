import React from "react";
import KitchenPreparationDashboard from "@/components/organisms/KitchenPreparationDashboard";

export default function KitchenDashboardPage() {
  return (
    <>
      <header className="mb-2 px-6 md:px-8">
        <h2 className="h2 text-text-primary">Kitchen Display System</h2>
      </header>
      <div className="max-w-7xl mx-auto py-8">
        <KitchenPreparationDashboard />
      </div>
    </>
  );
}
