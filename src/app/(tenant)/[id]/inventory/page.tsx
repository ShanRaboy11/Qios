import React from "react";
import IngredientsInventory from "@/components/organisms/IngredientsInventory";

export default function TenantInventoryPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <main className="min-h-screen bg-bg-primary">
      <div className="max-w-7xl mx-auto py-8">
        <h1 className="text-3xl font-bold text-text-primary mb-8 px-6 md:px-8">Ingredients Inventory</h1>
        <IngredientsInventory />
      </div>
    </main>
  );
}