"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
import { FeatureToggle } from "@/components/molecules/FeatureToggle";
import {
  Plus,
  Search,
  ShieldAlert,
  Check,
  Copy,
  Trash2,
  GripVertical,
  LineChart,
  Package,
  X,
  Smartphone,
  Users,
  Shield,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

type FeatureGroup = { [key: string]: boolean };
type Features = {
  customer: FeatureGroup;
  employee_ops: FeatureGroup;
  inventory: FeatureGroup;
  analytics: FeatureGroup;
  admin_controls: FeatureGroup;
};
type SubscriptionPlan = {
  id: string;
  name: string;
  color: string;
  badge: string;
  priceMonthly: string;
  priceAnnually: string;
  features: Features;
};

const DEFAULT_FEATURES: Features = {
  customer: {
    "Browser-Based Ordering": false,
    "Text-Based AI Concierge": false,
    "Menu Viewing & Item Customization": false,
    "Real-Time Price Calculation": false,
    "Order Confirmation & QR Generation": false,
    "Order Status Viewing": false,
  },
  employee_ops: {
    "Employee Authentication": false,
    "QR Code Order Retrieval": false,
    "Order Modification & Validation": false,
    "Payment Confirmation": false,
    "Order Queue Management": false,
    "Transaction Logging": false,
  },
  inventory: {
    "Unit-Based Inventory Tracking": false,
    "Measurement-Based Inventory Tracking": false,
    "Automated Stock Deduction": false,
    "Physical Stock Input & Variance Reports": false,
    "Shrinkage Alerts": false,
  },
  analytics: {
    "Live Revenue Dashboard": false,
    "Sales Reports Generation": false,
    "Order Velocity Analytics": false,
    "Staff Activity Monitoring": false,
    "Cancellation & Void Monitoring": false,
  },
  admin_controls: {
    "Admin Authentication": false,
    "Role & Permissions Management": false,
  },
};

const FEATURE_DESCRIPTIONS: Record<string, string> = {
  "Browser-Based Ordering":
    "Access the digital menu through QR code scanning without requiring login.",
  "Text-Based AI Concierge":
    "A chat interface for customers to type orders and get recommendations.",
  "Menu Viewing & Item Customization":
    "Browse items, select predefined meals, and choose add-ons or sizes.",
  "Real-Time Price Calculation":
    "Automatically compute total cost based on selected items and options.",
  "Order Confirmation & QR Generation":
    "Review order summary and generate a QR code with order ID.",
  "Order Status Viewing": "View order progress (Pending, Preparing, Ready).",
  "Employee Authentication": "Secure login for authorized store personnel.",
  "QR Code Order Retrieval":
    "Scan customer-generated QR codes to retrieve order details.",
  "Order Modification & Validation":
    "Adjust items within an active order and verify authenticity.",
  "Payment Confirmation": "Confirm and finalize customer payments.",
  "Order Queue Management":
    "Send validated orders to the preparation dashboard and update status.",
  "Transaction Logging": "Record completed transactions into revenue records.",
  "Unit-Based Inventory Tracking":
    "Track current stock levels by fixed unit quantity per item.",
  "Measurement-Based Inventory Tracking":
    "Track stock in grams/mL based on recipe matrix.",
  "Automated Stock Deduction":
    "Automatically deduct stock upon order finalization.",
  "Physical Stock Input & Variance Reports":
    "Enter actual end-of-day counts and compute discrepancies.",
  "Shrinkage Alerts": "Flag unusual mismatches and missing stock levels.",
  "Live Revenue Dashboard":
    "View real-time total sales and daily income summaries.",
  "Sales Reports Generation":
    "Generate and export daily, weekly, or monthly transaction reports.",
  "Order Velocity Analytics":
    "Monitor average preparation time and service speed.",
  "Staff Activity Monitoring":
    "Track number of transactions processed by each cashier.",
  "Cancellation & Void Monitoring":
    "Detect excessive voids or suspicious transaction patterns.",
  "Admin Authentication": "Secure login for store owners or managers.",
  "Role & Permissions Management":
    "Create accounts, assign roles, and toggle feature access for staff.",
};

const INITIAL_PLANS: SubscriptionPlan[] = [
  {
    id: "p1",
    name: "Basic",
    color: "bg-[#ffc670]",
    badge: "Starter Ready",
    priceMonthly: "1,499",
    priceAnnually: "15,290",
    features: {
      customer: {
        "Browser-Based Ordering": true,
        "Text-Based AI Concierge": false,
        "Menu Viewing & Item Customization": true,
        "Real-Time Price Calculation": true,
        "Order Confirmation & QR Generation": true,
        "Order Status Viewing": true,
      },
      employee_ops: {
        "Employee Authentication": true,
        "QR Code Order Retrieval": true,
        "Order Modification & Validation": true,
        "Payment Confirmation": true,
        "Order Queue Management": true,
        "Transaction Logging": true,
      },
      inventory: {
        "Unit-Based Inventory Tracking": false,
        "Measurement-Based Inventory Tracking": false,
        "Automated Stock Deduction": false,
        "Physical Stock Input & Variance Reports": false,
        "Shrinkage Alerts": false,
      },
      analytics: {
        "Live Revenue Dashboard": false,
        "Sales Reports Generation": true,
        "Order Velocity Analytics": false,
        "Staff Activity Monitoring": false,
        "Cancellation & Void Monitoring": false,
      },
      admin_controls: {
        "Admin Authentication": true,
        "Role & Permissions Management": true,
      },
    },
  },
  {
    id: "p2",
    name: "Business",
    color: "bg-[#ff5269]",
    badge: "Most Popular",
    priceMonthly: "3,499",
    priceAnnually: "35,690",
    features: {
      customer: {
        "Browser-Based Ordering": true,
        "Text-Based AI Concierge": true,
        "Menu Viewing & Item Customization": true,
        "Real-Time Price Calculation": true,
        "Order Confirmation & QR Generation": true,
        "Order Status Viewing": true,
      },
      employee_ops: {
        "Employee Authentication": true,
        "QR Code Order Retrieval": true,
        "Order Modification & Validation": true,
        "Payment Confirmation": true,
        "Order Queue Management": true,
        "Transaction Logging": true,
      },
      inventory: {
        "Unit-Based Inventory Tracking": true,
        "Measurement-Based Inventory Tracking": false,
        "Automated Stock Deduction": true,
        "Physical Stock Input & Variance Reports": false,
        "Shrinkage Alerts": false,
      },
      analytics: {
        "Live Revenue Dashboard": true,
        "Sales Reports Generation": true,
        "Order Velocity Analytics": false,
        "Staff Activity Monitoring": false,
        "Cancellation & Void Monitoring": false,
      },
      admin_controls: {
        "Admin Authentication": true,
        "Role & Permissions Management": true,
      },
    },
  },
  {
    id: "p3",
    name: "Enterprise",
    color: "bg-[#1fad66]",
    badge: "Premium Suite",
    priceMonthly: "7,999",
    priceAnnually: "81,590",
    features: {
      customer: {
        "Browser-Based Ordering": true,
        "Text-Based AI Concierge": true,
        "Menu Viewing & Item Customization": true,
        "Real-Time Price Calculation": true,
        "Order Confirmation & QR Generation": true,
        "Order Status Viewing": true,
      },
      employee_ops: {
        "Employee Authentication": true,
        "QR Code Order Retrieval": true,
        "Order Modification & Validation": true,
        "Payment Confirmation": true,
        "Order Queue Management": true,
        "Transaction Logging": true,
      },
      inventory: {
        "Unit-Based Inventory Tracking": true,
        "Measurement-Based Inventory Tracking": true,
        "Automated Stock Deduction": true,
        "Physical Stock Input & Variance Reports": true,
        "Shrinkage Alerts": true,
      },
      analytics: {
        "Live Revenue Dashboard": true,
        "Sales Reports Generation": true,
        "Order Velocity Analytics": true,
        "Staff Activity Monitoring": true,
        "Cancellation & Void Monitoring": true,
      },
      admin_controls: {
        "Admin Authentication": true,
        "Role & Permissions Management": true,
      },
    },
  },
];

const PRESET_COLORS = [
  "bg-[#ffc670]",
  "bg-[#ff5269]",
  "bg-[#1fad66]",
  "bg-[#3b82f6]",
  "bg-[#8b5cf6]",
  "bg-text-primary",
];

export default function SubscriptionManagement() {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [selectedPlanId, setSelectedPlanId] = useState<string>("");
  const [draftPlan, setDraftPlan] = useState<SubscriptionPlan | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreatePlanModalOpen, setIsCreatePlanModalOpen] = useState(false);
  const [showTemplateReminder, setShowTemplateReminder] = useState(false);
  const [draggedPlanId, setDraggedPlanId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const supabase = createSupabaseBrowserClient();

  useEffect(() => {
    async function fetchPlans() {
      try {
        const { data, error } = await supabase
          .from("subscription_plans")
          .select("*")
          .order("price_monthly");

        if (error) throw error;

        if (data && data.length > 0) {
          const parsed = data.map((d: any) => ({
            id: d.id,
            name: d.name,
            color: d.color,
            badge: d.badge,
            priceMonthly: d.price_monthly,
            priceAnnually: d.price_annually,
            features:
              typeof d.features === "string"
                ? JSON.parse(d.features)
                : d.features,
          }));
          setPlans(parsed);
          setSelectedPlanId(parsed[0].id);
        } else {
          setPlans(INITIAL_PLANS);
          setSelectedPlanId(INITIAL_PLANS[0].id);
        }
      } catch (error) {
        console.error("Error fetching subscription plans:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchPlans();
  }, []);

  const activePlan = plans.find((p) => p.id === selectedPlanId);

  useEffect(() => {
    if (activePlan) {
      setDraftPlan(JSON.parse(JSON.stringify(activePlan)));
      setShowTemplateReminder(false);
    }
  }, [activePlan]);

  const hasChanges = JSON.stringify(activePlan) !== JSON.stringify(draftPlan);

  const handleFeatureChange = (
    category: keyof Features,
    key: string,
    value: boolean,
  ) => {
    if (!draftPlan) return;
    setDraftPlan({
      ...draftPlan,
      features: {
        ...draftPlan.features,
        [category]: { ...draftPlan.features[category], [key]: value },
      },
    });
  };

  const handleSave = async () => {
    if (!draftPlan) return;
    setSaving(true);

    try {
      const payload = {
        name: draftPlan.name,
        color: draftPlan.color,
        badge: draftPlan.badge,
        price_monthly: draftPlan.priceMonthly,
        price_annually: draftPlan.priceAnnually,
        features: draftPlan.features,
      };

      const isNew = draftPlan.id.startsWith("p"); // local initial id
      let data, error;

      if (isNew) {
        ({ data, error } = await supabase
          .from("subscription_plans")
          .insert([payload])
          .select()
          .single());
      } else {
        ({ data, error } = await supabase
          .from("subscription_plans")
          .update(payload)
          .eq("id", draftPlan.id)
          .select()
          .single());
      }

      if (error) throw error;

      const newPlan = {
        ...draftPlan,
        id: data.id,
      };

      setPlans(plans.map((p) => (p.id === draftPlan.id ? newPlan : p)));
      setSelectedPlanId(newPlan.id);
    } catch (error) {
      console.error("Error saving plan:", error);
      alert("Failed to save plan. See console.");
    } finally {
      setSaving(false);
    }
  };

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedPlanId(id);
    e.dataTransfer.effectAllowed = "move";
  };
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };
  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (!draggedPlanId || draggedPlanId === targetId) return;
    const newPlans = [...plans];
    const di = newPlans.findIndex((p) => p.id === draggedPlanId);
    const ti = newPlans.findIndex((p) => p.id === targetId);
    const [dp] = newPlans.splice(di, 1);
    newPlans.splice(ti, 0, dp);
    setPlans(newPlans);
    setDraggedPlanId(null);
  };

  const handleDiscard = () => {
    if (activePlan) setDraftPlan(JSON.parse(JSON.stringify(activePlan)));
  };

  const handleConfirmCreatePlan = (templatePlan?: SubscriptionPlan) => {
    const newPlan: SubscriptionPlan = {
      id: `p${Date.now()}`,
      name: templatePlan ? templatePlan.name : "New Plan",
      color: templatePlan
        ? templatePlan.color
        : PRESET_COLORS[Math.floor(Math.random() * PRESET_COLORS.length)],
      badge: templatePlan ? templatePlan.badge : "",
      priceMonthly: templatePlan ? templatePlan.priceMonthly : "0",
      priceAnnually: templatePlan ? templatePlan.priceAnnually : "0",
      features: templatePlan
        ? JSON.parse(JSON.stringify(templatePlan.features))
        : JSON.parse(JSON.stringify(DEFAULT_FEATURES)),
    };
    setPlans([...plans, newPlan]);
    setSelectedPlanId(newPlan.id);
    setIsCreatePlanModalOpen(false);
    if (templatePlan) setShowTemplateReminder(true);
  };

  const handleDuplicate = () => {
    if (!activePlan) return;
    const newPlan = {
      ...JSON.parse(JSON.stringify(activePlan)),
      id: `p${Date.now()}`,
      name: `${activePlan.name} (Copy)`,
    };
    setPlans([...plans, newPlan]);
    setSelectedPlanId(newPlan.id);
  };

  const handleDelete = async () => {
    if (plans.length <= 1) return;

    const isNew = selectedPlanId.startsWith("p");

    if (!isNew) {
      setSaving(true);
      try {
        const { error } = await supabase
          .from("subscription_plans")
          .delete()
          .eq("id", selectedPlanId);

        if (error) throw error;
      } catch (error) {
        console.error("Error deleting plan:", error);
        alert("Failed to delete plan. See console.");
        setSaving(false);
        return;
      }
    }

    const newPlans = plans.filter((p) => p.id !== selectedPlanId);
    setPlans(newPlans);
    setSelectedPlanId(newPlans[0].id);
    setSaving(false);
  };

  const filteredPlans = plans.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--color-brand-primary)]" />
      </div>
    );
  }

  return (
    <>
      {/* Content placed directly on page — no card wrapper */}
      <div className="flex flex-col md:flex-row gap-6 min-h-[700px]">
        {/* ── Sidebar ── */}
        <div className="w-full md:w-[280px] flex-shrink-0 flex flex-col gap-3">
          <Button
            variant="primary"
            className="w-full"
            leftIcon={<Plus size={18} />}
            onClick={() => setIsCreatePlanModalOpen(true)}
          >
            New Plan
          </Button>
          <div className="relative">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Search size={18} className="text-text-secondary" />
            </div>
            <Input
              placeholder="Search plans"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 !py-2.5 rounded-xl !bg-white/60 !border-white/50"
            />
          </div>

          <div className="flex flex-col gap-2 mt-1">
            {filteredPlans.map((plan) => (
              <div
                key={plan.id}
                draggable
                onDragStart={(e) => handleDragStart(e, plan.id)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, plan.id)}
                onClick={() => setSelectedPlanId(plan.id)}
                className={cn(
                  "group flex items-center gap-3 p-3 rounded-2xl cursor-pointer transition-all duration-300",
                  selectedPlanId === plan.id
                    ? "bg-white shadow-md border border-white/60 scale-[1.02]"
                    : "hover:bg-white/40 border border-transparent",
                  draggedPlanId === plan.id &&
                    "opacity-50 border-dashed border-2 border-brand-primary",
                )}
              >
                <div className="cursor-grab text-text-secondary/50 hover:text-text-primary active:cursor-grabbing">
                  <GripVertical size={16} />
                </div>
                <div
                  className={cn(
                    "w-3 h-3 rounded-full shadow-sm flex-shrink-0",
                    plan.color,
                  )}
                />
                <div className="flex flex-col min-w-0">
                  <span
                    className={cn(
                      "b2 font-bold transition-colors truncate",
                      selectedPlanId === plan.id
                        ? "text-text-primary"
                        : "text-text-primary/80",
                    )}
                  >
                    {plan.name}
                  </span>
                  {plan.badge && (
                    <span className="b5 text-text-secondary truncate mt-0.5">
                      {plan.badge}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Main panel ── */}
        <div className="flex-1 flex flex-col min-w-0 bg-white/50 rounded-[24px] overflow-hidden border border-white/60 shadow-sm">
          {draftPlan ? (
            <>
              {/* Plan settings header */}
              <div className="p-6 md:p-8 pb-5 border-b-2 border-white/50 flex-shrink-0 flex flex-col gap-5">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex-1 w-full max-w-2xl flex gap-4 md:gap-6">
                    <div className="flex-1">
                      <label className="b4 font-bold text-text-secondary mb-2 block uppercase tracking-wider">
                        Plan Name
                      </label>
                      <Input
                        value={draftPlan.name}
                        onChange={(e) =>
                          setDraftPlan({ ...draftPlan, name: e.target.value })
                        }
                        className="text-lg !bg-white/80 !py-1.5 !h-10"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="b4 font-bold text-text-secondary mb-2 block uppercase tracking-wider">
                        Badge (Optional)
                      </label>
                      <Input
                        value={draftPlan.badge}
                        onChange={(e) =>
                          setDraftPlan({ ...draftPlan, badge: e.target.value })
                        }
                        placeholder="e.g. Most Popular"
                        className="text-sm !bg-white/80 !py-1.5 !h-10"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 self-end sm:self-auto">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleDuplicate}
                      title="Duplicate Plan"
                      disabled={saving}
                    >
                      <Copy size={18} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleDelete}
                      title="Delete Plan"
                      className="hover:bg-warning-secondary hover:text-warning-primary"
                      disabled={plans.length <= 1 || saving}
                    >
                      <Trash2 size={18} />
                    </Button>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 md:gap-6">
                  <div className="flex-1 max-w-[200px]">
                    <label className="b4 font-bold text-text-secondary mb-2 block uppercase tracking-wider">
                      Monthly Price
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 b2 font-bold text-text-secondary">
                        ₱
                      </span>
                      <Input
                        value={draftPlan.priceMonthly}
                        onChange={(e) =>
                          setDraftPlan({
                            ...draftPlan,
                            priceMonthly: e.target.value,
                          })
                        }
                        className="pl-7 !bg-white/80 !py-1.5 !h-10"
                      />
                    </div>
                  </div>
                  <div className="flex-1 max-w-[200px]">
                    <label className="b4 font-bold text-text-secondary mb-2 block uppercase tracking-wider">
                      Annual Price
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 b2 font-bold text-text-secondary">
                        ₱
                      </span>
                      <Input
                        value={draftPlan.priceAnnually}
                        onChange={(e) =>
                          setDraftPlan({
                            ...draftPlan,
                            priceAnnually: e.target.value,
                          })
                        }
                        className="pl-7 !bg-white/80 !py-1.5 !h-10"
                      />
                    </div>
                  </div>
                  <div className="flex-1">
                    <label className="b4 font-bold text-text-secondary mb-3 block uppercase tracking-wider">
                      Plan Color
                    </label>
                    <div className="flex gap-2 sm:gap-3 flex-nowrap pb-1">
                      {PRESET_COLORS.map((color) => (
                        <button
                          key={color}
                          onClick={() => setDraftPlan({ ...draftPlan, color })}
                          className={cn(
                            "w-7 h-7 sm:w-8 sm:h-8 flex-shrink-0 rounded-full shadow-md transition-transform duration-200 hover:scale-110 flex items-center justify-center",
                            color,
                            draftPlan.color === color &&
                              "ring-4 ring-brand-primary/30 scale-110",
                          )}
                        >
                          {draftPlan.color === color && (
                            <Check className="text-white w-3 h-3 sm:w-4 sm:h-4" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Feature toggles */}
              <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
                <div className="flex flex-col gap-6 pb-4">
                  {showTemplateReminder && (
                    <div className="bg-warning-secondary/30 border border-warning-primary/30 rounded-xl md:rounded-[24px] p-4 flex items-start gap-3">
                      <ShieldAlert
                        className="text-warning-primary flex-shrink-0 mt-0.5"
                        size={18}
                      />
                      <div>
                        <h4 className="b3 font-bold text-warning-primary">
                          Review Predefined Features
                        </h4>
                        <p className="b4 text-warning-primary/80">
                          You&apos;ve applied a predefined subscription
                          template. Please review and confirm the feature access
                          levels below.
                        </p>
                      </div>
                      <button
                        onClick={() => setShowTemplateReminder(false)}
                        className="ml-auto text-warning-primary/60 hover:text-warning-primary transition-colors"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  )}

                  {Object.entries({
                    "Customer Features": {
                      key: "customer" as keyof Features,
                      data: draftPlan.features.customer,
                      icon: <Smartphone size={18} />,
                    },
                    "Employee Operations": {
                      key: "employee_ops" as keyof Features,
                      data: draftPlan.features.employee_ops,
                      icon: <Users size={18} />,
                    },
                    "Inventory Management": {
                      key: "inventory" as keyof Features,
                      data: draftPlan.features.inventory,
                      icon: <Package size={18} />,
                    },
                    "Analytics & Reporting": {
                      key: "analytics" as keyof Features,
                      data: draftPlan.features.analytics,
                      icon: <LineChart size={18} />,
                    },
                    "Admin Controls": {
                      key: "admin_controls" as keyof Features,
                      data: draftPlan.features.admin_controls,
                      icon: <Shield size={18} />,
                    },
                  }).map(([categoryName, { key: categoryKey, data, icon }]) => (
                    <div
                      key={categoryName}
                      className="bg-white rounded-xl md:rounded-[24px] shadow-sm border border-black/[0.03] overflow-hidden"
                    >
                      <div className="px-4 md:px-6 py-3 md:py-4 bg-brand-secondary/10 border-b border-black/[0.03] flex items-center gap-2">
                        <span className="text-brand-primary">{icon}</span>
                        <h3 className="b3 font-bold text-text-primary uppercase tracking-wider">
                          {categoryName}
                        </h3>
                      </div>
                      <div className="p-2 flex flex-col">
                        {Object.entries(data).map(
                          ([featureName, isEnabled]) => (
                            <FeatureToggle
                              key={featureName}
                              label={featureName}
                              description={FEATURE_DESCRIPTIONS[featureName]}
                              checked={isEnabled}
                              variant="accent"
                              onChange={(checked) =>
                                handleFeatureChange(
                                  categoryKey,
                                  featureName,
                                  checked,
                                )
                              }
                              className="!rounded-xl"
                            />
                          ),
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action footer */}
              <div className="p-4 md:p-6 border-t-2 border-white/50 flex items-center justify-end gap-3 flex-shrink-0 bg-white/50">
                {hasChanges && (
                  <div className="flex flex-col mr-auto">
                    <span className="b2 font-bold text-text-primary">
                      Unsaved changes
                    </span>
                    <span className="b4 text-text-secondary hidden sm:inline">
                      You have modified this plan&apos;s configuration.
                    </span>
                  </div>
                )}
                {hasChanges && (
                  <Button
                    variant="ghost"
                    onClick={handleDiscard}
                    className="text-warning-primary hover:bg-warning-secondary"
                  >
                    Discard Changes
                  </Button>
                )}
                <Button
                  variant={hasChanges ? "primary" : "ghost"}
                  onClick={handleSave}
                  disabled={!hasChanges || saving}
                  loading={saving}
                  className={cn(!hasChanges && "opacity-50")}
                >
                  Save Changes
                </Button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center p-8">
              <div className="text-center b2 text-text-secondary bg-white/50 px-6 py-4 rounded-full shadow-sm border border-white">
                Select a plan to manage its features
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Scrollbar styling */}
      <style
        dangerouslySetInnerHTML={{
          __html: `.custom-scrollbar::-webkit-scrollbar{width:6px}.custom-scrollbar::-webkit-scrollbar-track{background:transparent}.custom-scrollbar::-webkit-scrollbar-thumb{background-color:rgba(0,0,0,0.1);border-radius:10px}.custom-scrollbar:hover::-webkit-scrollbar-thumb{background-color:rgba(0,0,0,0.2)}`,
        }}
      />

      {/* Create plan modal */}
      {isCreatePlanModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-text-primary/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl md:rounded-[32px] w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            <div className="px-6 md:px-8 py-4 md:py-6 flex items-center justify-between border-b border-black/[0.05] flex-shrink-0">
              <h2 className="b2 font-bold text-text-primary">
                Create New Plan
              </h2>
              <button
                onClick={() => setIsCreatePlanModalOpen(false)}
                className="text-text-secondary hover:text-text-primary transition-colors p-1"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6 md:p-8 overflow-y-auto">
              <p className="b3 text-text-secondary font-semibold mb-6">
                Choose a predefined template to quickly set up features, or
                start from scratch.
              </p>
              <div className="flex flex-col gap-3 mb-6">
                {INITIAL_PLANS.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => handleConfirmCreatePlan(template)}
                    className="flex items-center gap-4 p-4 rounded-xl border border-black/[0.05] hover:border-brand-primary/50 hover:bg-brand-primary/5 transition-all text-left group"
                  >
                    <div
                      className={cn(
                        "w-4 h-4 rounded-full flex-shrink-0",
                        template.color,
                      )}
                    />
                    <div>
                      <span className="b2 font-bold text-text-primary group-hover:text-brand-primary transition-colors">
                        {template.name} Plan
                      </span>
                      <p className="b4 text-text-secondary">
                        Pre-configured with standard{" "}
                        {template.name.toLowerCase()} tier access.
                      </p>
                    </div>
                  </button>
                ))}
              </div>
              <div className="relative flex items-center py-2 mb-4">
                <div className="flex-grow border-t border-black/[0.05]" />
                <span className="flex-shrink-0 mx-4 b4 font-bold text-text-secondary uppercase">
                  or
                </span>
                <div className="flex-grow border-t border-black/[0.05]" />
              </div>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => handleConfirmCreatePlan()}
              >
                Skip & Start from Scratch
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
