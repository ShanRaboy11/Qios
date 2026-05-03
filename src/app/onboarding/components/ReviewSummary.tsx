"use client";

import React from "react";
import { ArrowLeft, CheckCircle2, ClipboardCheck } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import type { OperationalSetupConfig, SubscriptionPlan } from "@/types/tenant";

interface ReviewSummaryProps {
  businessData: {
    name: string;
    email: string;
    owner: string;
  };
  selectedPlan: SubscriptionPlan;
  operationalData: OperationalSetupConfig;
  onBack: () => void;
  onSubmit: () => Promise<void> | void;
  loading?: boolean;
}

const PLAN_LABEL: Record<SubscriptionPlan, string> = {
  basic: "Basic",
  business: "Business",
  enterprise: "Enterprise",
};

const OPERATIONS_LABELS = {
  inventoryMode: {
    unit: "Retail Style (Unit-Based)",
    recipe: "Production Style (Recipe-Based)",
  },
  serviceWorkflow: {
    pickup: "Express Pickup",
    dine_in: "Table Service",
  },
  dashboardFocus: {
    speed: "Efficiency (Prep Speed)",
    revenue: "Growth (Customer Behavior)",
  },
  supplyLogic: {
    centralized: "Centralized Commissary",
    local: "Independent Units",
  },
};

const PLAN_FEATURES: Record<
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

function getCumulativeFeatures(plan: SubscriptionPlan) {
  const order: SubscriptionPlan[] = ["basic", "business", "enterprise"];
  const planIndex = order.indexOf(plan);

  return order.slice(0, planIndex + 1).flatMap((tier) =>
    PLAN_FEATURES[tier].items.map((item) => ({
      ...item,
      tier: PLAN_FEATURES[tier].tier,
    })),
  );
}

export function ReviewSummary({
  businessData,
  selectedPlan,
  operationalData,
  onBack,
  onSubmit,
  loading = false,
}: ReviewSummaryProps) {
  const showPrimaryMetric = selectedPlan === "business" || selectedPlan === "enterprise";
  const showMultiStoreLogic = selectedPlan === "enterprise";
  const cumulativeFeatures = getCumulativeFeatures(selectedPlan);

  const featuresByTier = cumulativeFeatures.reduce<
    Record<string, { title: string; description: string }[]>
  >((acc, feature) => {
    if (!acc[feature.tier]) acc[feature.tier] = [];
    acc[feature.tier].push({ title: feature.title, description: feature.description });
    return acc;
  }, {});

  return (
    <div className="flex flex-col w-full max-w-[960px] mx-auto gap-6 animate-in fade-in slide-in-from-right-8 duration-500">
      <div className="rounded-[28px] border border-neutral-100 bg-white p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--color-brand-primary)]/10 text-[var(--color-brand-primary)] shrink-0">
            <ClipboardCheck className="h-6 w-6" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--color-brand-primary)]">
              Step 7
            </p>
            <h2 className="mt-1 text-2xl font-bold text-[var(--color-text-primary)]">
              Review your application
            </h2>
            <p className="mt-2 text-sm text-[var(--color-text-secondary)] leading-relaxed max-w-2xl">
              Confirm your business details, package choice, and operational strategy before submitting the application for review.
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-neutral-100 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-2">
          <ClipboardCheck className="h-5 w-5 text-[var(--color-brand-primary)]" />
          <h3 className="text-lg font-bold text-[var(--color-text-primary)]">Application Details</h3>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-neutral-100 bg-neutral-50 px-4 py-4 shadow-sm sm:col-span-2">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400">Admin Email</p>
            <p className="mt-2 text-base font-semibold text-[var(--color-text-primary)] break-all">
              {businessData.email || "-"}
            </p>
          </div>

          <div className="rounded-2xl border border-neutral-100 bg-neutral-50 px-4 py-4 shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400">Business Name</p>
            <p className="mt-2 text-base font-semibold text-[var(--color-text-primary)]">
              {businessData.name || "-"}
            </p>
          </div>

          <div className="rounded-2xl border border-neutral-100 bg-neutral-50 px-4 py-4 shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400">Owner Name</p>
            <p className="mt-2 text-base font-semibold text-[var(--color-text-primary)]">
              {businessData.owner || "-"}
            </p>
          </div>

          <div className="rounded-2xl border border-neutral-100 bg-white px-4 py-4 shadow-sm sm:col-span-2">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400">Selected Plan</p>
            <p className="mt-2 text-base font-semibold text-[var(--color-text-primary)]">{PLAN_LABEL[selectedPlan]}</p>
          </div>

          <div className="rounded-2xl border border-neutral-100 bg-neutral-50 px-4 py-3.5 shadow-sm">
            <p className="text-sm text-[var(--color-text-secondary)]">Inventory Logic</p>
            <p className="mt-1 text-sm font-semibold text-[var(--color-text-primary)]">
              {OPERATIONS_LABELS.inventoryMode[operationalData.inventoryMode]}
            </p>
          </div>

          <div className="rounded-2xl border border-neutral-100 bg-neutral-50 px-4 py-3.5 shadow-sm">
            <p className="text-sm text-[var(--color-text-secondary)]">Service Workflow</p>
            <p className="mt-1 text-sm font-semibold text-[var(--color-text-primary)]">
              {OPERATIONS_LABELS.serviceWorkflow[operationalData.serviceWorkflow]}
            </p>
          </div>

          {showPrimaryMetric && (
            <div className="rounded-2xl border border-neutral-100 bg-neutral-50 px-4 py-3.5 shadow-sm">
              <p className="text-sm text-[var(--color-text-secondary)]">Primary Metric</p>
              <p className="mt-1 text-sm font-semibold text-[var(--color-text-primary)]">
                {OPERATIONS_LABELS.dashboardFocus[operationalData.dashboardFocus]}
              </p>
            </div>
          )}

          {showMultiStoreLogic && (
            <div className="rounded-2xl border border-neutral-100 bg-neutral-50 px-4 py-3.5 shadow-sm">
              <p className="text-sm text-[var(--color-text-secondary)]">Multi-Store Logic</p>
              <p className="mt-1 text-sm font-semibold text-[var(--color-text-primary)]">
                {OPERATIONS_LABELS.supplyLogic[operationalData.supplyLogic]}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="rounded-3xl border border-neutral-100 bg-neutral-50 px-5 py-5 shadow-sm">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-[var(--color-brand-primary)]" />
          <h3 className="text-lg font-bold text-[var(--color-text-primary)]">Plan Includes</h3>
        </div>

        <div className="mt-4 space-y-4">
          {Object.entries(featuresByTier).map(([tier, items], tierIndex) => (
            <div key={tier}>
              <div className="mb-2.5 flex items-center gap-2">
                <span className="inline-flex items-center rounded-full border border-[var(--color-brand-primary)]/20 bg-[var(--color-brand-primary)]/8 px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.15em] text-[var(--color-brand-primary)]">
                  {tier}
                </span>
                {tierIndex > 0 && <span className="text-[10px] text-neutral-400">included from {tier}</span>}
              </div>

              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                {items.map((feature) => (
                  <div key={feature.title} className="flex items-start gap-3 rounded-xl border border-neutral-200/80 bg-white px-3.5 py-3.5">
                    <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--color-brand-primary)]/12">
                      <CheckCircle2 className="h-3 w-3 text-[var(--color-brand-primary)]" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold leading-snug text-[var(--color-text-primary)]">{feature.title}</p>
                      <p className="mt-0.5 text-[11px] leading-relaxed text-[var(--color-text-secondary)]">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-3xl border border-green-100 bg-green-50 px-5 py-4 text-sm text-green-800 flex items-start gap-2">
        <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0" />
        <p>
          Final check: make sure all details are correct. Once submitted, your application status moves to pending review.
        </p>
      </div>

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
          onClick={onSubmit}
          loading={loading}
        >
          Submit Application
        </Button>
      </div>
    </div>
  );
}
