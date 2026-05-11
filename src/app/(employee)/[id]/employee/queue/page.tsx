"use client";

import React from "react";
import KitchenPreparationDashboard from "@/components/organisms/KitchenPreparationDashboard";

export default function OrderQueuePage() {
  return (
    <>
      <header className="mb-2">
        <h2 className="h2 text-text-primary">Order Queue</h2>
        <p className="b1 text-text-secondary mt-2">
          Active orders being prepared in the kitchen
        </p>
      </header>

      <div className="w-full h-[calc(100vh-80px)]">
        <KitchenPreparationDashboard />
      </div>
    </>
  );
}
