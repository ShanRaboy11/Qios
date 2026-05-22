"use client";

import React, { useState, useEffect } from "react";
import {
  Check,
  Info,
  Sparkles,
  Rocket,
  ArrowLeft,
  Zap,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/atoms/Button";
import { Badge } from "@/components/atoms/Badge";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

interface FeatureGroup {
  [key: string]: boolean;
}

interface Features {
  customer: FeatureGroup;
  employee_ops: FeatureGroup;
  inventory: FeatureGroup;
  analytics: FeatureGroup;
  admin_controls: FeatureGroup;
}

interface SubscriptionPlanData {
  id: string;
  name: string;
  color: string;
  badge: string;
  priceMonthly: string;
  priceAnnually: string;
  features: Features;
}

const CATEGORY_LABELS: Record<keyof Features, string> = {
  customer: "Customer Features",
  employee_ops: "Employee & Operations",
  inventory: "Inventory Tracking",
  analytics: "Analytics & Insights",
  admin_controls: "Admin Controls",
};

const formatPlanName = (name: string) =>
  name ? name.charAt(0).toUpperCase() + name.slice(1).toLowerCase() : name;

export function SubscriptionPackage({
  data,
  setData,
  onNext,
  onBack,
}: {
  data: { packageName: string };
  setData: React.Dispatch<React.SetStateAction<{ packageName: string }>>;
  onNext: () => void;
  onBack: () => void;
}) {
  const [selectedId, setSelectedId] = useState("");
  const [plans, setPlans] = useState<SubscriptionPlanData[]>([]);
  const [loading, setLoading] = useState(true);

  const supabase = createSupabaseBrowserClient();

  useEffect(() => {
    async function fetchPlans() {
      try {
        let response = await supabase
          .from("subscription_plans")
          .select("*")
          .order("display_order", { ascending: true, nullsFirst: false })
          .order("created_at", { ascending: true });

        if (response.error) {
          response = await supabase
            .from("subscription_plans")
            .select("*")
            .order("created_at", { ascending: true });
        }

        const { data: dbData, error } = response;

        if (error) throw error;

        if (dbData && dbData.length > 0) {
          const parsed = dbData.map((d: any) => ({
            id: d.id,
            name: d.name,
            color: d.color,
            badge: d.badge,
            ...d,
            priceMonthly: d.price_monthly,
            priceAnnually: d.price_annually,
            features:
              typeof d.features === "string"
                ? JSON.parse(d.features)
                : d.features,
          }));
          setPlans(parsed);

          if (
            !data.packageName ||
            data.packageName.toLowerCase() === "starter" ||
            data.packageName.toLowerCase() === "basic"
          ) {
            const defaultPlan =
              parsed.find(
                (p: any) =>
                  p.name.toLowerCase() === "basic" ||
                  p.name.toLowerCase() === "starter",
              ) || parsed[0];
            setSelectedId(defaultPlan.id);
            setData({ packageName: defaultPlan.name });
          } else {
            const matchedPlan =
              parsed.find(
                (p: any) =>
                  p.id === data.packageName ||
                  p.name.toLowerCase() === data.packageName.toLowerCase(),
              ) || parsed[0];

            if (!matchedPlan) {
              return;
            }

            setSelectedId(matchedPlan.id);
            setData({ packageName: matchedPlan.name });
          }
        }
      } catch (error) {
        console.error("Error fetching subscription plans:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchPlans();
  }, []);

  // Keep local selection in sync when parent updates (user navigates back)
  useEffect(() => {
    if (!data.packageName || plans.length === 0) {
      return;
    }

    const matchedPlan = plans.find(
      (plan) =>
        plan.id === data.packageName ||
        plan.name.toLowerCase() === data.packageName.toLowerCase(),
    );

    if (matchedPlan && matchedPlan.id !== selectedId) {
      setSelectedId(matchedPlan.id);
    }
  }, [data.packageName, plans, selectedId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px]">
        <Loader2 className="w-8 h-8 text-[var(--color-brand-primary)] animate-spin" />
        <p className="mt-4 text-text-secondary text-sm">Loading plans...</p>
      </div>
    );
  }

  if (plans.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px]">
        <p className="text-text-secondary text-sm">No plans available.</p>
      </div>
    );
  }

  const activePackage = plans.find((p) => p.id === selectedId) || plans[0];

  const activeColorHex =
    activePackage.color.match(/#([0-9a-fA-F]{6})/)?.[0] || "#ffc670";
  const isDark =
    activeColorHex.toLowerCase() === "#18181b" ||
    activeColorHex.toLowerCase() === "#000000";

  return (
    <div className="flex flex-col items-center space-y-6 lg:space-y-10 animate-in fade-in slide-in-from-right-8 duration-500 w-full overflow-visible">
      {/* PACKAGE SELECTION TABS */}
      <div className="inline-flex items-center bg-white rounded-[50px] p-1 lg:p-1.5 border border-neutral-100 shadow-sm overflow-x-auto max-w-full">
        {plans.map((pkg) => (
          <button
            key={pkg.id}
            onClick={() => {
              setSelectedId(pkg.id);
              setData({ packageName: pkg.name });
            }}
            className={cn(
              "px-6 py-2 lg:px-7 lg:py-3 rounded-[40px] b3 transition-all duration-300 whitespace-nowrap font-bold",
              selectedId === pkg.id
                ? "text-white shadow-md"
                : "bg-transparent text-[var(--color-text-secondary)] hover:text-black",
            )}
            style={
              selectedId === pkg.id ? { backgroundColor: activeColorHex } : {}
            }
          >
            {formatPlanName(pkg.name)}
          </button>
        ))}
      </div>

      {/* 2. PRICING CARD */}
      <div
        className={cn(
          "relative max-w-[500px] w-full rounded-[2.5rem] border-2 transition-all duration-500 overflow-hidden shadow-lg",
        )}
        style={{
          borderColor: `${activeColorHex}80`,
          backgroundImage: `linear-gradient(to bottom, #ffffff, ${isDark ? "#e4e4e7" : activeColorHex + "20"})`,
        }}
      >
        {/* Header Section */}
        <div className="p-8 lg:p-10 text-center border-b border-black/5">
          <div className="flex flex-col items-center gap-3 mb-4">
            {activePackage.badge && (
              <Badge
                className="text-[10px] py-1 px-4 font-bold uppercase tracking-wider text-white"
                style={{ backgroundColor: activeColorHex }}
              >
                {activePackage.badge}
              </Badge>
            )}
            <h2 className="text-3xl lg:text-[40px] font-bold text-text-primary leading-tight">
              {formatPlanName(activePackage.name)}
            </h2>
          </div>

          <div className="flex items-baseline justify-center mt-6">
            <span className="text-4xl lg:text-5xl font-bold text-text-primary">
              ₱ {activePackage.priceMonthly}
            </span>
            <span className="text-lg font-medium text-text-secondary ml-1">
              /month
            </span>
          </div>

          <div className="mt-2 flex items-center justify-center gap-2 b4 text-text-secondary font-medium">
            <span>Billed monthly</span>
            <span
              className="font-bold text-lg"
              style={{ color: activeColorHex }}
            >
              •
            </span>
            <span>cancel anytime</span>
          </div>
        </div>

        {/* Features Section */}
        <div className="space-y-8">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-secondary/60 text-center">
            What's Included
          </p>

          <div className="flex flex-col gap-6 pl-16 pb-10 lg:pl-24 pb-10">
            {(Object.keys(CATEGORY_LABELS) as Array<keyof Features>).map(
              (categoryKey) => {
                const featuresInCategory = activePackage.features[categoryKey];
                if (!featuresInCategory) return null;

                const enabledFeatures = Object.entries(featuresInCategory)
                  .filter(([_, isEnabled]) => isEnabled)
                  .map(([featureName]) => featureName);

                if (enabledFeatures.length === 0) return null;

                return (
                  <div key={categoryKey}>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-text-secondary mb-3">
                      {CATEGORY_LABELS[categoryKey]}
                    </h4>
                    <ul className="space-y-3">
                      {enabledFeatures.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <div
                            className="mt-0.5 shrink-0 w-5 h-5 rounded-full flex items-center justify-center"
                            style={{ backgroundColor: `${activeColorHex}20` }}
                          >
                            <Check
                              className="w-3 h-3 stroke-[4px]"
                              style={{ color: activeColorHex }}
                            />
                          </div>
                          <span className="text-sm lg:text-base text-text-primary font-medium leading-snug">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              },
            )}
          </div>
        </div>
      </div>

      {/* SELECTION BUTTONS */}
      <div className="w-full max-w-[500px] flex flex-row gap-6">
        <Button
          variant="ghost"
          size="lg"
          className="h-13 lg:h-13 px-5 b2 border-neutral-200 text-neutral-500 transition-all font-semibold shrink-0"
          onClick={onBack}
        >
          <ArrowLeft className="w-5 h-5 mr-1" />
          Back
        </Button>
        <Button
          variant="primary"
          shape="pill"
          size="lg"
          className="flex-1 h-14 b2 font-bold text-lg shadow-lg text-white transition-all active:scale-[0.98]"
          style={{
            boxShadow: `0 10px 15px -3px ${activeColorHex}40`,
          }}
          onClick={() => {
            setData({ packageName: activePackage.name });
            onNext();
          }}
        >
          Select {formatPlanName(activePackage.name)}
        </Button>
      </div>
    </div>
  );
}
