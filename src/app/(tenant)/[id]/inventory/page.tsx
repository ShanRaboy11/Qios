"use client";

import React from "react";
import MenuInventory from "@/components/organisms/MenuInventory";
import IngredientsInventory from "@/components/organisms/IngredientsInventory";

export default function InventoryPage() {
  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <div>
          <h2 className="h2 text-text-primary">Inventory Configuration</h2>
          <p className="b1 text-text-secondary mt-2">
            Track ingredients, set stock alerts, and manage recipe deductions
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-8 w-full">
        <MenuInventory />
        <IngredientsInventory />
      </div>
    </>
  );
}
