"use client";

import React from "react";
import KitchenPreparationDashboard from "@/components/organisms/KitchenPreparationDashboard";

export default function OrderQueuePage() {
  return (
    <div className="flex flex-col pb-32">
      <header className="mb-6">
        <h2 className="h2 text-text-primary">Order Queue</h2>
        <p className="b1 text-text-secondary mt-2">
          Active orders being prepared in the kitchen
        </p>
      </header>

      <div className="w-full">
        <KitchenPreparationDashboard />
      </div>
    </div>
  );
}
