"use client";

import React, { useState } from "react";
import { Check, Crown, Zap, Rocket } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge, BadgeColor, BadgeVariant } from "@/components/atoms/Badge";
import { Button } from "@/components/atoms/Button";

interface Feature {
  text: string;
  hasAiBadge?: boolean;
}

interface PackageBadge {
  label: string;
  color: BadgeColor;
  variant: BadgeVariant;
}

interface Package {
  id: string;
  name: string;
  description: string;
  price: string;
  subscribers: string;
  icon: React.ReactNode;
  features: Feature[];
  tierBadge?: PackageBadge;
}

const packages: Package[] = [
  {
    id: "starter",
    name: "Starter",
    description: "Small F&B operators",
    price: "499",
    subscribers: "100 subscribers",
    icon: <Zap size={20} />,
    features: [
      { text: "Digital Menu" }, 
      { text: "Order Management" }, 
      { text: "Basic Reports" }
    ],
  },
  {
    id: "growth",
    name: "Growth",
    description: "Medium-sized businesses",
    price: "1,499",
    subscribers: "500 subscribers",
    icon: <Rocket size={20} />,
    tierBadge: { label: "Popular", color: "error", variant: "solid" },
    features: [
      { text: "Digital Menu" }, 
      { text: "Order Management" }, 
      { text: "Advanced Reports" }, 
      { text: "Inventory Sync" }
    ],
  },
  {
    id: "enterprises",
    name: "Enterprises",
    description: "Large scale operations",
    price: "4,999",
    subscribers: "Unlimited subscribers",
    icon: <Crown size={20} />,
    tierBadge: { label: "Gemini AI", color: "success", variant: "solid" },
    features: [
      { text: "Gemini AI concierge", hasAiBadge: true }, 
      { text: "Multi-branch Support" }, 
      { text: "Priority Support" }, 
      { text: "Dedicated Manager" }
    ],
  },
];

export function SubscriptionPackage({ onNext }: { onNext: () => void }) {
  const [selectedId, setSelectedId] = useState("starter");
  const activePackage = packages.find((p) => p.id === selectedId) || packages[0];

  return (
    <div className="flex flex-col items-center lg:items-start space-y-6 lg:space-y-10 animate-in fade-in slide-in-from-right-8 duration-500 w-full overflow-visible">
      
      {/* 1. PACKAGE SELECTION TABS */}
      <div className="inline-flex items-center bg-white rounded-[50px] p-1 lg:p-1.5 border border-neutral-100 shadow-sm overflow-x-auto max-w-full">
        {packages.map((pkg) => (
          <button
            key={pkg.id}
            onClick={() => setSelectedId(pkg.id)}
            className={cn(
              "px-6 py-2 lg:px-7 lg:py-3 rounded-[40px] b3 transition-all duration-300 whitespace-nowrap",
              selectedId === pkg.id
                ? "bg-[var(--color-brand-primary)] text-white shadow-md"
                : "bg-transparent text-[var(--color-text-secondary)] hover:text-black"
            )}
          >
            {pkg.name}
          </button>
        ))}
      </div>

      {/* 2. PRICING CARD */}
      <div className="relative max-w-[460px] w-full bg-white rounded-[32px] border-2 border-[var(--color-brand-primary)] overflow-hidden shadow-sm transition-all duration-500">
        
        {/* Top Header Section */}
        <div className="bg-[var(--color-bg-primary)] p-6 lg:p-10 border-b-2 border-orange-100/50">
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <h2 className="h2 text-[var(--color-text-primary)] leading-tight">
                  {activePackage.name}
                </h2>
                
                {activePackage.tierBadge && (
                  <Badge 
                    color={activePackage.tierBadge.color} 
                    variant={activePackage.tierBadge.variant}
                    className="text-[11px] px-3.5 py-0.5 font-bold h-fit mt-1.5 shadow-sm"
                  >
                    {activePackage.tierBadge.label}
                  </Badge>
                )}
              </div>
              <p className="b2 text-[var(--color-text-secondary)]">{activePackage.description}</p>
            </div>
            <div className="p-3 bg-white rounded-2xl shadow-sm border border-orange-50 text-[var(--color-brand-primary)]">
              {activePackage.icon}
            </div>
          </div>

          <div className="mt-8 flex items-baseline gap-1">
            <span className="text-4xl lg:text-[52px] font-bold font-figtree text-[var(--color-text-primary)]">
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

          <div className="mt-6 lg:mt-8">
            <Badge 
              color="success" 
              variant="outline" 
              shape="pill"
              className="px-4 py-1.5 lg:px-5 lg:py-2 font-bold tracking-tight bg-white border-[var(--color-success-primary)] text-[var(--color-success-primary)]"
            >
              {activePackage.subscribers}
            </Badge>
          </div>
        </div>

        {/* Features Section */}
        <div className="p-6 lg:p-10 space-y-6 lg:space-y-8 bg-white text-left">
          <h4 className="b3 text-[var(--color-text-secondary)] tracking-[2px] uppercase font-bold text-xs lg:text-base">
            FEATURES
          </h4>

          <ul className="space-y-4 lg:space-y-5">
            {activePackage.features.map((feature, idx) => (
              <li key={idx} className="flex items-center gap-4 group">
                <div className="flex-shrink-0 w-6 h-6 lg:w-7 lg:h-7 rounded-full bg-[var(--color-success-secondary)] border border-[var(--color-success-primary)] flex items-center justify-center">
                   <Check size={12} className="text-[var(--color-success-primary)]" strokeWidth={3} />
                </div>
                
                <div className="flex items-center gap-2.5">
                  <span className="text-sm lg:text-[17px] text-[var(--color-text-primary)] font-medium font-inter">
                    {feature.text}
                  </span>
                  
                 {feature.hasAiBadge && (
                    <Badge 
                      color="success" 
                      variant="subtle" 
                      className="text-[10px] px-2.5 py-0.5 font-bold h-fit whitespace-nowrap border border-[var(--color-success-primary)]/20"
                    >
                      AI-powered
                    </Badge>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 3. SELECTION BUTTON */}
      <div className="w-full max-w-[460px]">
        <Button 
          variant="primary" 
          size="lg" 
          className="w-full h-13 lg:h-13 b2 font-bold text-lg shadow-lg shadow-secondary transform transition-all active:scale-[0.98] bg-[var(--color-brand-secondary)] text-white"
          onClick={onNext}
        >
          Select {activePackage.name}
        </Button>
      </div>
    </div>
  );
}