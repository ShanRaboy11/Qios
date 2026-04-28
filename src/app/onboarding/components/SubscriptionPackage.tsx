"use client";

import React, { useState } from "react";
import { Check, Info, Sparkles, Rocket, ArrowLeft, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/atoms/Button";
import { Badge } from "@/components/atoms/Badge";
import SubscriptionPlans from "@/components/organisms/SubscriptionPlans";

type PlanVariant = "basic" | "business" | "enterprise";

interface Package {
  id: string;
  variant: PlanVariant;
  name: string;
  badge?: string;
  description: string;
  price: string; 
  featuresTitle: string;
  features: string[];
  notes: { label: string }[];
  icon: React.ReactNode;
}

const packages: Package[] = [
  {
    id: "starter",
    variant: "basic",
    name: "Starter",
    badge: "Starter Ready",
    description: "Perfect for small F&B operators starting digital.",
    price: "1,499",
    featuresTitle: "What's Included",
    features: [
      "QR mobile ordering",
      "Simple digital menu + cart",
      "Order status tracking",
      "Basic sales summary",
      "1 store only",
    ],
    notes: [{ label: "Cancel anytime" }, { label: "7-day guarantee" }],
    icon: <Zap size={20} />,
  },
  {
    id: "growth",
    variant: "business",
    name: "Growth",
    description: "Advanced tools for growing multi-branch operators.",
    price: "3,499",
    featuresTitle: "Everything in Basic, plus",
    features: [
      "AI chat ordering functionality",
      "Customizable menu options",
      "Staff accounts with login",
      "Live sales dashboard",
      "Inventory & performance tracking",
      "Detailed analytical reports",
      "Multi-device support",
    ],
    notes: [{ label: "Cancel anytime" }, { label: "14-day guarantee" }],
    icon: <Rocket size={20} />,
  },
  {
    id: "enterprises",
    variant: "enterprise",
    name: "Enterprises",
    badge: "Premium Suite",
    description: "Custom solutions for chains and large franchises.",
    price: "7,999",
    featuresTitle: "Everything in Business, plus",
    features: [
      "Multi-branch management",
      "Advanced stock tracking",
      "Deep efficiency analytics",
      "Full activity audit logs",
      "Custom settings per branch",
      "External API integration",
    ],
    notes: [{ label: "30-day cancellation notice" }, { label: "Onboarding support" }],
    icon: <Sparkles size={20} />,
  },
];

export function SubscriptionPackage({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  const [selectedId, setSelectedId] = useState("starter");
  const activePackage = packages.find((p) => p.id === selectedId) || packages[0];

  const styles = {
    basic: {
      border: "border-[#ffc670]/80",
      bg: "bg-gradient-to-b from-white to-[#FFF1D6]",
      checkBg: "bg-[#ffc670]/20",
      checkIcon: "text-[#ffc670]",
    },
    business: {
      border: "border-[#ff5269]/80",
      bg: "bg-gradient-to-b from-white to-[#FFDFE4]",
      checkBg: "bg-[#ff5269]/20",
      checkIcon: "text-[#ff5269]",
    },
    enterprise: {
      border: "border-[#1fad66]/80",
      bg: "bg-gradient-to-b from-white to-[#DFF2E8]",
      checkBg: "bg-[#1fad66]/20",
      checkIcon: "text-[#1fad66]",
    },
  }[activePackage.variant];

  return (
    <div className="flex flex-col items-center lg:items-start space-y-6 lg:space-y-10 animate-in fade-in slide-in-from-right-8 duration-500 w-full overflow-visible">
      
      {/* PACKAGE SELECTION TABS */}
      <div className="inline-flex items-center bg-white rounded-[50px] p-1 lg:p-1.5 border border-neutral-100 shadow-sm overflow-x-auto max-w-full">
        {packages.map((pkg) => (
          <button
            key={pkg.id}
            onClick={() => setSelectedId(pkg.id)}
            className={cn(
              "px-6 py-2 lg:px-7 lg:py-3 rounded-[40px] b3 transition-all duration-300 whitespace-nowrap font-bold",
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
      <div
        className={cn(
          "relative max-w-[460px] w-full rounded-[2.5rem] border transition-all duration-500 overflow-hidden shadow-lg",
          styles.bg,
          styles.border
        )}
      >
        {/* Header Section */}
        <div className="p-8 lg:p-10 text-center border-b border-black/5">
          <div className="flex flex-col items-center gap-3 mb-4">
            {(activePackage.badge || activePackage.variant === "business") && (
              <Badge
                color={activePackage.variant === "enterprise" ? "success" : activePackage.variant === "business" ? "error" : "primary"}
                variant={activePackage.variant === "business" ? "solid" : "subtle"}
                className="text-[10px] py-1 px-4 font-bold uppercase tracking-wider"
              >
                {activePackage.variant === "business" ? "Most Popular" : activePackage.badge}
              </Badge>
            )}
            <h2 className="text-3xl lg:text-[40px] font-bold text-text-primary leading-tight">
              {activePackage.name}
            </h2>
          </div>
          
          <p className="text-sm text-text-secondary max-w-[280px] mx-auto leading-relaxed mb-8">
            {activePackage.description}
          </p>

          <div className="flex items-baseline justify-center">
            <span className="text-4xl lg:text-5xl font-bold text-text-primary">
              ₱ {activePackage.price}
            </span>
            <span className="text-lg font-medium text-text-secondary ml-1">/month</span>
          </div>
          
          <div className="mt-2 flex items-center justify-center gap-2 b4 text-text-secondary font-medium">
            <span>Billed monthly</span>
            <span className="text-[var(--color-brand-primary)] font-bold text-lg">•</span>
            <span>cancel anytime</span>
          </div>
        </div>

        {/* Features Section */}
        <div className="p-8 lg:p-10 space-y-6">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-secondary/60 text-center">
            {activePackage.featuresTitle}
          </p>

          <ul className="space-y-4">
            {activePackage.features.map((feature, idx) => (
              <li key={idx} className="flex items-start gap-4">
                <div className={cn("mt-1 shrink-0 w-5 h-5 rounded-full flex items-center justify-center", styles.checkBg)}>
                  <Check className={cn("w-3 h-3 stroke-[4px]", styles.checkIcon)} />
                </div>
                <span className="text-sm lg:text-[17px] text-text-primary font-medium leading-tight font-inter">
                  {feature}
                </span>
              </li>
            ))}
          </ul>

          <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 pt-6 border-t border-black/5">
            {activePackage.notes.map((note, i) => (
              <div key={i} className="flex items-center gap-1.5 opacity-70">
                <Info size={12} className="text-text-secondary" />
                <span className="text-[10px] font-bold text-text-secondary uppercase tracking-tight">
                  {note.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SELECTION BUTTONS */}
      <div className="w-full max-w-[460px] flex flex-row gap-10">
        <Button 
          variant="ghost" 
          size="lg" 
          className="h-13 lg:h-13 px-5 b2 border-neutral-200 text-neutral-500 transition-all" 
          onClick={onBack}
        >
          <ArrowLeft className="w-5 h-5 mr-1" />
          Back
        </Button>
        <Button 
          variant="primary" 
          shape="pill" 
          size="lg" 
          className={cn(
            "flex-1 h-13 lg:h-13 b2 font-bold text-lg shadow-lg shadow-secondary bg-[var(--color-brand-secondary)] text-white transition-all active:scale-[0.98]",
            activePackage.variant === "business" && "bg-[#ff5269]" 
          )}
          onClick={onNext}
        >
          Select {activePackage.name}
        </Button>
      </div>
    </div>
  );
}