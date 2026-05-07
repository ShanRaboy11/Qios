"use client";

import React, { Suspense } from "react";
import { CartProvider } from "@/contexts/CartContext";

import { InventoryRecipeMatrix } from "@/components/organisms/InventoryRecipeMatrix";
import KitchenPreparationDashboard from "@/components/organisms/KitchenPreparationDashboard";
import { LiveActivityFeed } from "@/components/organisms/LiveActivityFeed";
import { LoginForm } from "@/components/organisms/LoginForm";
import MenuCatalog from "@/components/organisms/MenuCatalog";
import { PromoBanner } from "@/components/organisms/PromoBanner";
import { QrScanner } from "@/components/organisms/QrScanner";
import { RecipeMatrixView } from "@/components/organisms/RecipeMatrixView";
import { SystemActivity } from "@/components/organisms/SystemActivity";
import { ThresholdSettingsPanel } from "@/components/organisms/ThresholdSettingsPanel";
import { ChatbotUI } from "@/components/organisms/ChatbotUI";
import OrderEditor from "@/components/organisms/OrderEditor";
import OrderSummary from "@/components/organisms/OrderSummary";

export default function DraftPage() {
  return (
    <Suspense fallback={<div>Loading draft...</div>}>
      <CartProvider>
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
            <div className="relative border rounded-xl overflow-hidden">
              <LoginForm />
            </div>
          </SectionWrapper>

          <SectionWrapper title="Menu Catalog">
            <MenuCatalog initialItems={[]} />
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
            <div className="w-full flex items-center justify-center p-12 bg-bg-primary min-h-[700px]">
              <QrScanner />
            </div>
          </SectionWrapper>

          <SectionWrapper title="Chatbot UI">
            <ChatbotUI />
          </SectionWrapper>

          <SectionWrapper title="Order Summary">
            <OrderSummary />
          </SectionWrapper>
        </div>
      </CartProvider>
    </Suspense>
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
