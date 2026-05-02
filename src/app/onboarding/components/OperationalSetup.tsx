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

import { Button } from "@/components/atoms/Button";
import { cn } from "@/lib/utils";
import type {
  AIStyle,
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

type OptionValue = InventoryMode | ServiceWorkflow | AIStyle | DashboardFocus | SupplyLogic;

type OptionCard = {
  value: OptionValue;
  title: string;
  description: string;
};

const DEFAULT_CONFIG: OperationalSetupConfig = {
  inventoryMode: "unit",
  serviceWorkflow: "pickup",
  aiStyle: "passive",
  dashboardFocus: "revenue",
  supplyLogic: "local",
};

const PLAN_ENTITLEMENTS: Record<
  SubscriptionPlan,
  { title: string; description: string }[]
> = {
  basic: [
    {
      title: "QR Ordering",
      description: "Guest-facing ordering flow for fast counter service.",
    },
    {
      title: "Live Menu Publishing",
      description: "Publish menu updates without interrupting operations.",
    },
    {
      title: "Basic Sales Summary",
      description: "See revenue and order volume at a glance.",
    },
    {
      title: "Single Store Coverage",
      description: "One location, one operational view.",
    },
  ],
  business: [
    {
      title: "Real-time Sales Feed",
      description: "Watch sales move as orders are placed.",
    },
    {
      title: "Employee Shift Management",
      description: "Coordinate staffing and floor coverage.",
    },
    {
      title: "AI Concierge",
      description: "Automate menu guidance and customer assistance.",
    },
    {
      title: "Operational Analytics",
      description: "Track speed, revenue, and modifier trends.",
    },
  ],
  enterprise: [
    {
      title: "Real-time Sales Feed",
      description: "Unify performance signals across locations.",
    },
    {
      title: "Employee Shift Management",
      description: "Centralize staffing across branches.",
    },
    {
      title: "Multi-Store Oversight",
      description: "Compare branches from a shared command center.",
    },
    {
      title: "Priority Support",
      description: "Faster onboarding support for larger teams.",
    },
  ],
};

const CustomLockedToggle = ({
  isOn,
  variant = "amber",
}: {
  isOn: boolean;
  variant?: "rose" | "amber";
}) => {
  const knobColor =
    variant === "rose"
      ? "var(--color-brand-accent)"
      : "var(--color-brand-primary)";
  const trackColor =
    variant === "rose"
      ? "rgba(255, 82, 105, 0.2)"
      : "rgba(255, 198, 112, 0.2)";

  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none flex h-[30px] w-[50px] shrink-0 items-center rounded-full px-1 transition-colors duration-300",
        isOn ? "" : "bg-neutral-200/50",
      )}
      style={{ backgroundColor: isOn ? trackColor : undefined }}
    >
      <div
        className={cn(
          "transform transition-all duration-300",
          isOn ? "translate-x-5" : "translate-x-0",
        )}
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 21 21"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="20.4286" height="20.4286" rx="10.2143" fill={knobColor} />
          <g clipPath="url(#clip0_1778_5359)">
            <path
              d="M6.28516 11.7859C6.28516 10.6747 6.28516 10.1191 6.63035 9.77391C6.97555 9.42871 7.53113 9.42871 8.6423 9.42871H11.7852C12.8963 9.42871 13.4519 9.42871 13.7971 9.77391C14.1423 10.1191 14.1423 10.6747 14.1423 11.7859C14.1423 12.897 14.1423 13.4526 13.7971 13.7978C13.4519 14.143 12.8963 14.143 11.7852 14.143H8.6423C7.53113 14.143 6.97555 14.143 6.63035 13.7978C6.28516 13.4526 6.28516 12.897 6.28516 11.7859Z"
              stroke="var(--color-bg-primary)"
              strokeWidth="0.785714"
            />
            <path
              d="M7.85742 9.42899V8.64328C7.85742 7.34146 8.91275 6.28613 10.2146 6.28613C11.0003 6.28613 11.786 6.67899 12.1789 7.4647"
              stroke="var(--color-bg-primary)"
              strokeWidth="0.785714"
              strokeLinecap="round"
            />
            <path
              d="M10.2148 11V12.5714"
              stroke="var(--color-bg-primary)"
              strokeWidth="0.785714"
              strokeLinecap="round"
            />
          </g>
          <defs>
            <clipPath id="clip0_1778_5359">
              <rect width="9.42857" height="9.42857" fill="white" transform="translate(5.5 5.5)" />
            </clipPath>
          </defs>
        </svg>
      </div>
    </div>
  );
};

function OptionGroup<T extends OptionValue>({
  title,
  icon: Icon,
  description,
  selectedValue,
  options,
  onChange,
}: {
  title: string;
  icon: React.ComponentType<{ className?: string; size?: number }>;
  description: string;
  selectedValue: T;
  options: OptionCard[];
  onChange: (nextValue: T) => void;
}) {
  return (
    <section className="space-y-4 w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-start gap-3">
        <div className="rounded-2xl border border-[var(--color-brand-primary)]/15 bg-[var(--color-brand-primary)]/10 p-2.5 text-[var(--color-brand-primary)] shadow-sm">
          <Icon size={20} />
        </div>
        <div className="space-y-1">
          <h3 className="h4 text-[var(--color-text-primary)]">{title}</h3>
          <p className="b4 max-w-2xl text-[var(--color-text-secondary)]">{description}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2" role="radiogroup" aria-label={title}>
        {options.map((option) => {
          const selected = selectedValue === option.value;

          return (
            <button
              key={option.value}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => onChange(option.value as T)}
              className={cn(
                "group relative overflow-hidden rounded-[24px] border-2 px-5 py-5 text-left transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-primary)]/30",
                selected
                  ? "border-[var(--color-brand-primary)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(255,247,231,0.96))] shadow-[0_20px_50px_rgba(255,198,112,0.16)]"
                  : "border-neutral-200 bg-white/90 hover:border-neutral-300 hover:bg-white hover:shadow-[0_10px_30px_rgba(15,23,42,0.04)]",
              )}
            >
              {selected && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent opacity-80" />
              )}

              <div className="relative flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div
                    className={cn(
                      "flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl transition-all duration-300",
                      selected
                        ? "bg-[var(--color-brand-primary)]/12 text-[var(--color-brand-primary)]"
                        : "bg-neutral-100 text-neutral-600 group-hover:bg-neutral-50",
                    )}
                  >
                    <Icon size={18} />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="b2 font-semibold text-[var(--color-text-primary)]">{option.title}</span>
                      {selected && <Check className="h-4 w-4 text-[var(--color-brand-primary)]" />}
                    </div>
                    <p className="b4 leading-relaxed text-[var(--color-text-secondary)]">{option.description}</p>
                  </div>
                </div>

                <div
                  className={cn(
                    "mt-1 rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] transition-colors duration-300",
                    selected
                      ? "border-[var(--color-brand-primary)]/25 bg-[var(--color-brand-primary)]/10 text-[var(--color-brand-primary)]"
                      : "border-neutral-200 bg-neutral-50 text-neutral-400",
                  )}
                >
                  {selected ? "Selected" : "Choose"}
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

  const entitlements = PLAN_ENTITLEMENTS[selectedPlan];
  const entitlementVariant = selectedPlan === "enterprise" ? "rose" : "amber";

  const updateConfig = <K extends keyof OperationalSetupConfig>(
    key: K,
    value: OperationalSetupConfig[K],
  ) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="flex w-full max-w-[980px] flex-col items-center gap-10 pb-12 animate-in fade-in slide-in-from-right-8 duration-500">
      <div className="w-full rounded-[36px] border border-neutral-100 bg-white/80 p-6 shadow-[0_20px_70px_rgba(15,23,42,0.06)] backdrop-blur-sm md:p-8">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <p className="b4 font-semibold uppercase tracking-[0.22em] text-[var(--color-brand-primary)]">Operational Strategy</p>
            <h2 className="mt-2 h3 text-[var(--color-text-primary)]">Shape the experience for the {selectedPlan} plan</h2>
            <p className="mt-2 b4 max-w-3xl text-[var(--color-text-secondary)]">
              Pick the operating rules that will drive your kitchen, service flow, and analytics defaults.
            </p>
          </div>

          <div className="hidden rounded-full border border-neutral-200 bg-neutral-50 px-4 py-2 text-right md:block">
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-neutral-400">Plan</p>
            <p className="b2 font-semibold capitalize text-[var(--color-text-primary)]">{selectedPlan}</p>
          </div>
        </div>

        <div className="space-y-10">
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

          {(selectedPlan === "business" || selectedPlan === "enterprise") && (
            <>
              <OptionGroup
                title="AI Engagement Style"
                icon={Bot}
                description="Tune how proactive your AI layer should behave with the customer cart."
                selectedValue={config.aiStyle}
                onChange={(value) => updateConfig("aiStyle", value)}
                options={[
                  {
                    value: "proactive",
                    title: "Proactive Upseller",
                    description:
                      "AI analyzes the cart and suggests logical pairings to increase revenue.",
                  },
                  {
                    value: "passive",
                    title: "Passive Expert",
                    description:
                      "AI acts as a menu encyclopedia and waits for customer questions before responding.",
                  },
                ]}
              />

              <OptionGroup
                title="Operational Primary Metric"
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
            </>
          )}

          {selectedPlan === "enterprise" && (
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
          )}
        </div>
      </div>

      <div className="w-full rounded-[36px] border border-neutral-100 bg-neutral-50/85 p-6 shadow-[0_12px_45px_rgba(15,23,42,0.05)] md:p-8">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <p className="b4 font-semibold uppercase tracking-[0.22em] text-neutral-400">Plan Entitlements</p>
            <h3 className="mt-2 h4 text-[var(--color-text-primary)]">Included in your {selectedPlan} plan</h3>
          </div>
          <div className="hidden items-center gap-2 rounded-full border border-neutral-200 bg-white px-3 py-2 text-neutral-500 md:flex">
            <ShieldCheck className="h-4 w-4 text-[var(--color-brand-primary)]" />
            <span className="text-xs font-semibold uppercase tracking-[0.18em]">Read only</span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
          {entitlements.map((feature) => (
            <div
              key={feature.title}
              className="flex items-start gap-3 rounded-[22px] border border-white/70 bg-white px-4 py-4 shadow-[0_10px_30px_rgba(15,23,42,0.04)]"
            >
              <CustomLockedToggle isOn variant={entitlementVariant} />
              <div className="min-w-0 space-y-1">
                <p className="b2 font-semibold text-[var(--color-text-primary)]">{feature.title}</p>
                <p className="b4 leading-relaxed text-[var(--color-text-secondary)]">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex w-full flex-row justify-center gap-6 pt-2 md:gap-10">
        <Button
          variant="ghost"
          size="lg"
          className="h-13 border-neutral-200 px-5 b2 text-neutral-500"
          onClick={onBack}
          disabled={loading}
        >
          <ArrowLeft className="mr-1 h-5 w-5" />
          Back
        </Button>
        <Button
          variant="primary"
          size="lg"
          className="h-13 flex-1 max-w-[320px] b2 shadow-xl shadow-orange-200/50"
          onClick={() => onFinish(config)}
          loading={loading}
        >
          Complete Setup
        </Button>
      </div>
    </div>
  );
}
