"use client";

import React, { useState } from "react";
import {
  ArrowLeft,
  BarChart3,
  Bot,
  Check,
  Clock,
  Package,
  ShieldCheck,
  Store,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { Button } from "@/components/atoms/Button";
import { cn } from "@/lib/utils";
import type {
  DashboardFocus,
  InventoryMode,
  OperationalSetupConfig,
  ServiceWorkflow,
  SubscriptionPlan,
  SupplyLogic,
} from "@/types/tenant";

export interface OperationalSetupProps {
  selectedPlan: SubscriptionPlan;
  onBack: () => void;
  onFinish: (data: OperationalSetupConfig) => void;
  loading?: boolean;
}

type OptionValue = InventoryMode | ServiceWorkflow | DashboardFocus | SupplyLogic;

type OptionCard = {
  value: OptionValue;
  title: string;
  description: string;
};

const DEFAULT_CONFIG: OperationalSetupConfig = {
  inventoryMode: "unit",
  serviceWorkflow: "pickup",
  dashboardFocus: "revenue",
  supplyLogic: "local",
};

// Each plan tier lists only its own features; cumulative sets are built below.
const TIER_FEATURES: Record<
  SubscriptionPlan,
  { tier: string; items: { title: string; description: string }[] }
> = {
  basic: {
    tier: "Basic",
    items: [
      {
        title: "QR Ordering",
        description: "Guest-facing ordering flow for fast counter service.",
      },
      {
        title: "Digital Menu",
        description: "Publish menu updates without interrupting operations.",
      },
      {
        title: "Order Tracking",
        description: "See orders progress from confirmation through completion.",
      },
      {
        title: "Single Store Coverage",
        description: "One location, one operational view.",
      },
    ],
  },
  business: {
    tier: "Business",
    items: [
      {
        title: "AI Concierge",
        description: "Automate menu guidance and customer assistance.",
      },
      {
        title: "Real-time Sales",
        description: "Watch sales move as orders are placed.",
      },
      {
        title: "Operational Analytics",
        description: "Track speed, revenue, and modifier trends.",
      },
      {
        title: "Employee Shift Management",
        description: "Coordinate staffing and floor coverage.",
      },
    ],
  },
  enterprise: {
    tier: "Enterprise",
    items: [
      {
        title: "Multi-branch Oversight",
        description: "Compare branches from a shared command center.",
      },
      {
        title: "Priority Support",
        description: "Faster onboarding support for larger teams.",
      },
      {
        title: "Centralized Controls",
        description: "Unify policies, stock rules, and reporting across locations.",
      },
      {
        title: "Advanced Governance",
        description: "Keep teams aligned with structured admin-level controls.",
      },
    ],
  },
};

// Builds a flat list of { tier, title, description } for all features included in a plan.
function getCumulativeFeatures(plan: SubscriptionPlan) {
  const order: SubscriptionPlan[] = ["basic", "business", "enterprise"];
  const planIndex = order.indexOf(plan);
  return order
    .slice(0, planIndex + 1)
    .flatMap((p) =>
      TIER_FEATURES[p].items.map((item) => ({
        ...item,
        tier: TIER_FEATURES[p].tier,
      })),
    );
}

const PlanBadge = ({
  plan,
  variant = "amber",
}: {
  plan: SubscriptionPlan;
  variant?: "rose" | "amber";
}) => {
  const dotColor =
    variant === "rose"
      ? "bg-[var(--color-brand-accent)]"
      : "bg-[var(--color-brand-primary)]";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em]",
        variant === "rose"
          ? "border-[var(--color-brand-accent)]/20 bg-[var(--color-brand-accent)]/8 text-[var(--color-brand-accent)]"
          : "border-[var(--color-brand-primary)]/20 bg-[var(--color-brand-primary)]/8 text-[var(--color-brand-primary)]",
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", dotColor)} />
      {plan}
    </span>
  );
};

// Small tier label shown beside each feature card in the entitlements section.
const TierLabel = ({
  tier,
  variant,
}: {
  tier: string;
  variant: "rose" | "amber";
}) => (
  <span
    className={cn(
      "inline-flex items-center rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.15em]",
      variant === "rose"
        ? "border-[var(--color-brand-accent)]/20 bg-[var(--color-brand-accent)]/8 text-[var(--color-brand-accent)]"
        : "border-[var(--color-brand-primary)]/20 bg-[var(--color-brand-primary)]/8 text-[var(--color-brand-primary)]",
    )}
  >
    {tier}
  </span>
);

function OptionGroup<T extends OptionValue>({
  title,
  icon: Icon,
  description,
  selectedValue,
  options,
  onChange,
  disabled = false,
  lockLabel,
}: {
  title: string;
  icon: LucideIcon;
  description: string;
  selectedValue: T;
  options: OptionCard[];
  onChange: (nextValue: T) => void;
  disabled?: boolean;
  lockLabel?: string;
}) {
  return (
    <section className={cn("space-y-3 w-full", disabled && "opacity-60")}>
      {/* Section Header */}
      <div className="flex items-start gap-3 px-1">
        <div className="mt-0.5 shrink-0 rounded-xl border border-[var(--color-brand-primary)]/15 bg-[var(--color-brand-primary)]/10 p-2 text-[var(--color-brand-primary)]">
          <Icon size={16} />
        </div>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-sm font-semibold leading-tight text-[var(--color-text-primary)]">
              {title}
            </h3>
            {disabled && lockLabel && (
              <span className="rounded-full border border-neutral-200 bg-white px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.15em] text-neutral-400">
                {lockLabel}
              </span>
            )}
          </div>
          <p className="mt-0.5 text-xs leading-relaxed text-[var(--color-text-secondary)]">
            {description}
          </p>
        </div>
      </div>

      {/* Option Cards */}
      <div
        className="grid grid-cols-1 gap-3 sm:grid-cols-2"
        role="radiogroup"
        aria-label={title}
      >
        {options.map((option) => {
          const selected = selectedValue === option.value;

          return (
            <button
              key={option.value}
              type="button"
              role="radio"
              aria-checked={selected}
              disabled={disabled}
              onClick={() => onChange(option.value as T)}
              className={cn(
                "relative rounded-2xl border-2 p-4 text-left transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-primary)]/30",
                disabled && "pointer-events-none cursor-not-allowed",
                selected
                  ? "border-[var(--color-brand-primary)] bg-[var(--color-brand-primary)]/5 shadow-sm"
                  : "border-neutral-200 bg-white hover:border-neutral-300 hover:shadow-sm active:scale-[0.99]",
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <span className="text-sm font-semibold leading-snug text-[var(--color-text-primary)]">
                    {option.title}
                  </span>
                  <p className="mt-1 text-xs leading-relaxed text-[var(--color-text-secondary)]">
                    {option.description}
                  </p>
                </div>

                {/* Radio indicator */}
                <div
                  className={cn(
                    "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-200",
                    selected
                      ? "border-[var(--color-brand-primary)] bg-[var(--color-brand-primary)]"
                      : "border-neutral-300 bg-white",
                  )}
                >
                  {selected && <div className="h-2 w-2 rounded-full bg-white" />}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}

export function OperationalSetup({
  selectedPlan,
  onBack,
  onFinish,
  loading = false,
}: OperationalSetupProps) {
  const [config, setConfig] = useState<OperationalSetupConfig>(DEFAULT_CONFIG);

  const entitlementVariant = selectedPlan === "enterprise" ? "rose" : "amber";
  const cumulativeFeatures = getCumulativeFeatures(selectedPlan);

  // Group features by tier for the section headers.
  const featuresByTier = cumulativeFeatures.reduce<
    Record<string, { title: string; description: string }[]>
  >((acc, f) => {
    if (!acc[f.tier]) acc[f.tier] = [];
    acc[f.tier].push({ title: f.title, description: f.description });
    return acc;
  }, {});

  const updateConfig = <K extends keyof OperationalSetupConfig>(
    key: K,
    value: OperationalSetupConfig[K],
  ) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="flex w-full max-w-[960px] flex-col items-center gap-6 pb-8">
      {/* Main Config Card */}
      <div className="w-full rounded-2xl border border-neutral-100 bg-white shadow-sm">
        {/* Card Header */}
        <div className="flex items-start justify-between gap-4 border-b border-neutral-100 px-5 py-5 sm:px-6 sm:py-6">
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--color-brand-primary)]">
              Operational Strategy
            </p>
            <h2 className="mt-1.5 text-xl font-bold leading-snug text-[var(--color-text-primary)] sm:text-2xl">
              Shape your experience
            </h2>
            <p className="mt-1 max-w-md text-sm leading-relaxed text-[var(--color-text-secondary)]">
              Pick the operating rules that will drive your kitchen, service
              flow, and analytics defaults.
            </p>
          </div>

          <PlanBadge plan={selectedPlan} variant={entitlementVariant} />
        </div>

        {/* Option Groups */}
        <div className="divide-y divide-neutral-100">
          <div className="px-5 py-5 sm:px-6 sm:py-6">
            <OptionGroup
              title="Inventory Logic"
              icon={Package}
              description="Choose how stock is consumed when an order is confirmed."
              selectedValue={config.inventoryMode}
              onChange={(value) => updateConfig("inventoryMode", value)}
              options={[
                {
                  value: "unit",
                  title: "Retail Style (Unit-Based)",
                  description:
                    "Best for kiosks selling finished goods. Deducts one whole unit per sale.",
                },
                {
                  value: "recipe",
                  title: "Production Style (Recipe-Based)",
                  description:
                    "Best for kitchens. Automatically deducts raw ingredients based on your recipe matrix.",
                },
              ]}
            />
          </div>

          <div className="px-5 py-5 sm:px-6 sm:py-6">
            <OptionGroup
              title="Service Workflow"
              icon={Clock}
              description="Set how the order is fulfilled after payment or confirmation."
              selectedValue={config.serviceWorkflow}
              onChange={(value) => updateConfig("serviceWorkflow", value)}
              options={[
                {
                  value: "pickup",
                  title: "Express Pickup",
                  description:
                    "Customer orders via QR and picks up at the counter when notified. Ideal for reducing congestion.",
                },
                {
                  value: "dine_in",
                  title: "Table Service",
                  description:
                    "Customer provides a table number and staff delivers the order. Best for sit-down dining.",
                },
              ]}
            />
          </div>

          {(selectedPlan === "business" || selectedPlan === "enterprise") && (
            <div className="px-5 py-5 sm:px-6 sm:py-6">
              <OptionGroup
                title="Primary Metric"
                icon={BarChart3}
                description="Choose which dashboard lens should dominate the management experience."
                selectedValue={config.dashboardFocus}
                onChange={(value) => updateConfig("dashboardFocus", value)}
                options={[
                  {
                    value: "speed",
                    title: "Efficiency (Prep Speed)",
                    description:
                      "Dashboard prioritizes kitchen fulfillment times and highlights preparation bottlenecks.",
                  },
                  {
                    value: "revenue",
                    title: "Growth (Customer Behavior)",
                    description:
                      "Dashboard prioritizes sales trends, high-margin modifiers, and peak ordering hours.",
                  },
                ]}
              />
            </div>
          )}

          {selectedPlan === "enterprise" && (
            <div className="px-5 py-5 sm:px-6 sm:py-6">
              <OptionGroup
                title="Multi-Store Logic"
                icon={Store}
                description="Decide how inventory should behave when multiple branches are operating."
                selectedValue={config.supplyLogic}
                onChange={(value) => updateConfig("supplyLogic", value)}
                options={[
                  {
                    value: "centralized",
                    title: "Centralized Commissary",
                    description:
                      "All branches pull stock from a shared central kitchen or warehouse pool.",
                  },
                  {
                    value: "local",
                    title: "Independent Units",
                    description:
                      "Each location manages its own local suppliers and independent inventory counts.",
                  },
                ]}
              />
            </div>
          )}
        </div>
      </div>

      {/* Plan Entitlements — Cumulative Feature Breakdown */}
      <div className="w-full rounded-2xl border border-neutral-100 bg-neutral-50 shadow-sm">
        <div className="px-5 py-4 sm:px-6">
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-neutral-400">
            What's Included
          </p>
          <h3 className="mt-1 text-base font-semibold capitalize text-[var(--color-text-primary)]">
            Everything in your{" "}
            <span
              className={cn(
                entitlementVariant === "rose"
                  ? "text-[var(--color-brand-accent)]"
                  : "text-[var(--color-brand-primary)]",
              )}
            >
              {selectedPlan}
            </span>{" "}
            plan
          </h3>
        </div>

        <div className="space-y-4 p-4 sm:p-5">
          {Object.entries(featuresByTier).map(([tier, items], tierIndex) => (
            <div key={tier}>
              {/* Tier section label */}
              <div className="mb-2.5 flex items-center gap-2">
                <TierLabel tier={tier} variant={entitlementVariant} />
                {tierIndex > 0 && (
                  <span className="text-[10px] text-neutral-400">
                    included from {tier}
                  </span>
                )}
              </div>

              {/* Feature cards for this tier */}
              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                {items.map((feature) => (
                  <div
                    key={feature.title}
                    className="flex items-start gap-3 rounded-xl border border-neutral-200/80 bg-white px-3.5 py-3.5"
                  >
                    <div
                      className={cn(
                        "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full",
                        entitlementVariant === "rose"
                          ? "bg-[var(--color-brand-accent)]/12"
                          : "bg-[var(--color-brand-primary)]/12",
                      )}
                    >
                      <Check
                        className={cn(
                          "h-3 w-3",
                          entitlementVariant === "rose"
                            ? "text-[var(--color-brand-accent)]"
                            : "text-[var(--color-brand-primary)]",
                        )}
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold leading-snug text-[var(--color-text-primary)]">
                        {feature.title}
                      </p>
                      <p className="mt-0.5 text-[11px] leading-relaxed text-[var(--color-text-secondary)]">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex w-full flex-row items-center gap-3 sm:gap-4">
        <Button
          variant="ghost"
          size="lg"
          className="h-12 shrink-0 border-neutral-200 px-4 text-sm text-neutral-500"
          onClick={onBack}
          disabled={loading}
        >
          <ArrowLeft className="mr-1.5 h-4 w-4" />
          Back
        </Button>
        <Button
          variant="primary"
          size="lg"
          className="h-12 flex-1 text-sm font-bold shadow-lg shadow-orange-200/40"
          onClick={() => onFinish(config)}
          loading={loading}
        >
          Complete Setup
        </Button>
      </div>
    </div>
  );
}