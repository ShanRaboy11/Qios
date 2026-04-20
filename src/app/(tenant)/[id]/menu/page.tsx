import React from "react";
import { MenuInventory } from "@/components/organisms/MenuInventory";

export default function TenantMenuInventoryPage({ params }: { params: { id: string } }) {
  return (
    <main className="min-h-screen bg-bg-primary">
      <div className="max-w-7xl mx-auto py-8">
        <h1 className="text-3xl font-bold text-text-primary mb-8 px-6 md:px-8">Menu Inventory</h1>
        <MenuInventory />
      </div>
    </main>
  );
}