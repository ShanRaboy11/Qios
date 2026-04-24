"use client";

import React, { useState } from "react";
import { Check, Crown, Zap, Rocket, Edit3 } from "lucide-react";
import { cn } from "@/lib/utils";
// Atom Imports
import { Badge } from "@/components/atoms/Badge";
import { Button } from "@/components/atoms/Button";

const packages = [
  {
    id: "starter",
    name: "Starter",
    description: "Small F&B operators",
    price: "499",
    subscribers: "100 subscribers",
    icon: <Zap size={20} />,
    features: ["Digital Menu", "Order Management", "Basic Reports"],
  },
  {
    id: "growth",
    name: "Growth",
    description: "Medium-sized businesses",
    price: "1,499",
    subscribers: "500 subscribers",
    icon: <Rocket size={20} />,
    features: ["Digital Menu", "Order Management", "Advanced Reports", "Inventory Sync"],
  },
  {
    id: "enterprises",
    name: "Enterprises",
    description: "Large scale operations",
    price: "4,999",
    subscribers: "Unlimited subscribers",
    icon: <Crown size={20} />,
    features: ["Custom Integrations", "Multi-branch Support", "Priority Support", "Dedicated Manager"],
  },
];

export function SubscriptionPackage({ onNext }: { onNext: () => void }) {
  const [selectedId, setSelectedId] = useState("starter");
  const activePackage = packages.find((p) => p.id === selectedId) || packages[0];

  return (
    // Changed items-center to items-start for left alignment
    <div className="flex flex-col items-start space-y-10 animate-in fade-in slide-in-from-right-8 duration-500 w-full">
      
      {/* 1. PACKAGE SELECTION TABS (Left Aligned) */}
      <div className="inline-flex items-center bg-white rounded-[50px] p-1.5 border border-neutral-100 shadow-sm">
        {packages.map((pkg) => (
          <button
            key={pkg.id}
            onClick={() => setSelectedId(pkg.id)}
            className={cn(
              "px-8 py-2.5 rounded-[40px] text-[16px] font-semibold transition-all duration-300 whitespace-nowrap",
              selectedId === pkg.id
                ? "bg-[#ffc670] text-white shadow-sm"
                : "bg-transparent text-[#707070] hover:text-black"
            )}
          >
            {pkg.name}
          </button>
        ))}
      </div>

      {/* 2. PRICING CARD (Left Aligned) */}
      <div className="relative max-w-[460px] w-full bg-white rounded-[32px] border-2 border-[var(--color-brand-primary)] overflow-hidden shadow-sm transition-all duration-500">
        
        {/* Top Header Section (Amber Area) */}
        <div className="bg-[var(--color-bg-primary)] p-10 border-b-2 border-orange-100/50">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <h2 className="text-4xl font-bold font-figtree text-[var(--color-text-primary)]">
                {activePackage.name}
              </h2>
              <p className="b2 text-[var(--color-text-secondary)]">
                {activePackage.description}
              </p>
            </div>
            {/* Icon decoration from your image */}
            <div className="p-3 bg-white rounded-2xl shadow-sm border border-orange-50 text-[var(--color-brand-primary)]">
              {activePackage.icon}
            </div>
          </div>

          <div className="mt-8 flex items-baseline gap-1">
            <span className="text-[52px] font-bold font-figtree text-[var(--color-text-primary)]">
              ₱ {activePackage.price}
            </span>
            <span className="text-2xl font-bold font-figtree text-[var(--color-text-secondary)] ml-1">
              /month
            </span>
          </div>

          <div className="mt-2 flex items-center gap-2 b4 text-[var(--color-text-secondary)] font-medium">
            <span>Billed monthly</span>
            <span className="text-[var(--color-brand-primary)] font-bold text-lg">•</span>
            <span>cancel anytime</span>
          </div>

          <div className="mt-8">
            <Badge 
              color="success" 
              variant="outline" 
              shape="pill" 
              className="px-5 py-2 font-bold tracking-tight bg-white"
            >
              {activePackage.subscribers}
            </Badge>
          </div>
        </div>

        {/* Features Section */}
        <div className="p-10 space-y-8 bg-white">
          <h4 className="b3 text-[var(--color-text-secondary)] tracking-[2px] uppercase font-bold">
            FEATURES
          </h4>

          <ul className="space-y-5">
            {activePackage.features.map((feature, idx) => (
              <li key={idx} className="flex items-center gap-4 group">
                <div className="flex-shrink-0 w-7 h-7 rounded-full bg-[var(--color-success-secondary)] border border-[var(--color-success-primary)] flex items-center justify-center">
                   <Check size={14} className="text-[var(--color-success-primary)]" strokeWidth={3} />
                </div>
                <span className="text-[17px] text-[var(--color-text-primary)] font-medium font-inter">
                  {feature}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 3. SELECTION BUTTON (Aligned with card width, not screen) */}
      <div className="w-full max-w-[460px]">
        <Button 
          variant="primary" 
          shape="pill" 
          size="lg" 
          className="w-full h-16 font-bold text-lg shadow-lg shadow-orange-100 transform transition-all active:scale-[0.98]"
          onClick={onNext}
        >
          Select {activePackage.name}
        </Button>
      </div>
    </div>
  );
}