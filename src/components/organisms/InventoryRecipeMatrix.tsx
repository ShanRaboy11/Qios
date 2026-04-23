"use client";

import React, { useState } from "react";
import { TabGroup } from "@/components/molecules/TabGroup";
import { GlobalThresholdView } from "./GlobalThresholdView";
import { RecipeMatrixView } from "./RecipeMatrixView";

export const InventoryRecipeMatrix = () => {
  const [activeTab, setActiveTab] = useState("recipe");

  const tabOptions = [
    { label: "Recipe Matrix", value: "recipe" },
    { label: "Global threshold", value: "threshold" },
  ];

  return (
    <div className="w-full max-w-[1280px] mx-auto min-h-screen p-4 md:p-8 bg-[#FAF7F2] font-inter">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 md:mb-8 gap-6 md:gap-0">
        <h1 className="text-[28px] md:text-[32px] font-extrabold text-text-primary tracking-tight">
          Inventory & Recipe Matrix
        </h1>
        <div className="w-full md:w-auto overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
          <TabGroup
            options={tabOptions}
            activeValue={activeTab}
            onChange={setActiveTab}
          />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="w-full">
        {activeTab === "recipe" && <RecipeMatrixView />}
        {activeTab === "threshold" && <GlobalThresholdView />}
      </div>
    </div>
  );
};
