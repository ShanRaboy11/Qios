"use client";

import React from "react";
import MenuCategoryManagement from "@/components/organisms/MenuCategoryManagement";

export default function MenuPage() {
  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <div>
          <h2 className="h2 text-text-primary">Menu Management</h2>
          <p className="b1 text-text-secondary mt-2">
            Manage your restaurant&apos;s digital menu, categories, and item
            availability
          </p>
        </div>
      </div>
      <div id="tutorial-menu-grid">
        <MenuCategoryManagement />
      </div>
    </>
  );
}
