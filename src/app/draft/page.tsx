"use client";

import React from "react";

// Organism Imports
import { CustomerHeader } from "@/components/organisms/CustomerHeader";
import FeatureSection from "@/components/organisms/FeatureSection";
import { Footer } from "@/components/organisms/footer";
import { Hero } from "@/components/organisms/hero";
import IngredientsInventory from "@/components/organisms/IngredientsInventory";
import { InventoryRecipeMatrix } from "@/components/organisms/InventoryRecipeMatrix";
import KitchenPreparationDashboard from "@/components/organisms/KitchenPreparationDashboard";
import { LiveActivityFeed } from "@/components/organisms/LiveActivityFeed";
import { LoginForm } from "@/components/organisms/LoginForm";
import MenuCatalog from "@/components/organisms/MenuCatalog";
import MenuInventory from "@/components/organisms/MenuInventory";
import { Navbar } from "@/components/organisms/navbar";
import { ProblemSolution } from "@/components/organisms/ProblemnSolution";
import { PromoBanner } from "@/components/organisms/PromoBanner";
import { QrScanner } from "@/components/organisms/QrScanner";
import { RecipeMatrixView } from "@/components/organisms/RecipeMatrixView";
import { SystemActivity } from "@/components/organisms/SystemActivity";
import TenantManagement from "@/components/organisms/TenantManagement";
import { ThresholdSettingsPanel } from "@/components/organisms/ThresholdSettingsPanel";

export default function DraftPage() {
  return (
    <div className="min-h-screen bg-[#fff8e1] flex flex-col gap-24 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-12">
          Organisms Showcase Draft
        </h1>
        <p className="text-center text-gray-500 max-w-2xl mx-auto">
          This is a draft page to visualize all organisms side-by-side. Some
          components might look cramped or unusual depending on how they are
          styled to fill their parent container.
        </p>
      </div>

      <SectionWrapper title="Login Form">
        {/* LoginForm contains a min-h-screen container. Setting a specific height to contain it here if possible, 
            though min-h-screen might force it to be full viewport height regardless. */}
        <div className="relative border rounded-xl overflow-hidden">
          <LoginForm />
        </div>
      </SectionWrapper>

      <SectionWrapper title="Menu Catalog">
        <MenuCatalog initialItems={[]} />
      </SectionWrapper>

      <SectionWrapper title="Menu Inventory">
        <MenuInventory />
      </SectionWrapper>

      <SectionWrapper title="Ingredients Inventory">
        <IngredientsInventory />
      </SectionWrapper>

      <SectionWrapper title="Inventory Recipe Matrix">
        <div className="container mx-auto">
          <InventoryRecipeMatrix />
        </div>
      </SectionWrapper>

      <SectionWrapper title="Recipe Matrix View">
        <div className="p-4 bg-gray-100">
          <RecipeMatrixView />
        </div>
      </SectionWrapper>

      <SectionWrapper title="Tenant Management">
        <TenantManagement />
      </SectionWrapper>

      <SectionWrapper title="Kitchen Preparation Dashboard">
        <div className="p-4 bg-gray-100">
          <KitchenPreparationDashboard />
        </div>
      </SectionWrapper>

      <SectionWrapper title="System Activity">
        <div>
          <SystemActivity />
        </div>
      </SectionWrapper>

      <SectionWrapper title="Threshold Settings Panel">
        <div className="w-full p-10">
          <ThresholdSettingsPanel />
        </div>
      </SectionWrapper>

      <SectionWrapper title="QR Scanner">
        <div>
          <QrScanner />
        </div>
      </SectionWrapper>
    </div>
  );
}

function SectionWrapper({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="w-full border-t-4 border-gray-200 pt-8 flex flex-col gap-4">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-semibold text-gray-800 bg-gray-200 inline-block px-4 py-2 rounded-lg">
          {title}
        </h2>
      </div>
      <div className="w-full bg-white shadow-sm border-b border-gray-200 relative overflow-x-hidden">
        {children}
      </div>
    </section>
  );
}
