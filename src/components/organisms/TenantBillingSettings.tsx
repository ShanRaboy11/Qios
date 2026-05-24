"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  CheckCircle2,
  CreditCard,
  Edit2,
  Loader2,
  Plus,
  Shield,
  Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/atoms/Badge";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
import { Toggle } from "@/components/atoms/Toggle";
import { SectionHeader } from "@/components/molecules/SectionHeader";
import { Dropdown } from "@/components/molecules/Dropdown";
import { ActionConfirmationModal } from "@/components/molecules/ConfirmationModal";
import { cn } from "@/lib/utils";
import {
  deleteTenantPaymentMethod,
  saveTenantPaymentMethod,
  setTenantDefaultPaymentMethod,
  updateTenantSubscriptionPlan,
} from "@/app/(tenant)/[id]/settings/actions";
import {
  emptySettingsActionState,
  type SettingsActionState,
  type TenantBillingSettingsData,
} from "@/app/(tenant)/[id]/settings/types";

interface TenantBillingSettingsProps {
  tenantId: string;
  initialData: TenantBillingSettingsData;
}

const formatDateTime = (value?: string) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString("en-US", {
    month: "numeric",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
};

const formatPlanName = (name: string) =>
  name ? name.charAt(0).toUpperCase() + name.slice(1).toLowerCase() : name;

const providerMeta: Record<
  string,
  { label: string; accent: string; icon: React.ReactNode }
> = {
  visa: {
    label: "Visa",
    accent: "text-[#1A1F71]",
    icon: <span className="text-[11px] font-bold tracking-[0.2em]">VISA</span>,
  },
  mastercard: {
    label: "Mastercard",
    accent: "text-[#EB001B]",
    icon: <span className="text-[11px] font-bold tracking-[0.18em]">MC</span>,
  },
  paypal: {
    label: "PayPal",
    accent: "text-[#003087]",
    icon: <span className="text-[11px] font-bold tracking-[0.18em]">PP</span>,
  },
  stripe: {
    label: "Stripe",
    accent: "text-[#635BFF]",
    icon: <span className="text-[11px] font-bold tracking-[0.18em]">S</span>,
  },
  gcash: {
    label: "GCash",
    accent: "text-[#0070F3]",
    icon: <span className="text-[11px] font-bold tracking-[0.18em]">GC</span>,
  },
  other: {
    label: "Other",
    accent: "text-text-secondary",
    icon: <CreditCard className="w-4 h-4" />,
  },
};

const getPlanCardStyles = (
  planName: string,
  planColor: string,
  isActive: boolean,
) => {
  const name = planName.toLowerCase();
  const color = planColor.toLowerCase();

  // yellow theme
  if (
    color.includes("ffc670") ||
    name.includes("basic") ||
    name.includes("starter") ||
    name.includes("yellow")
  ) {
    return {
      cardClass: isActive
        ? "bg-gradient-to-br from-[#ffc670]/20 to-[#ffc670]/10 border-[#ffc670] shadow-[0_0_15px_rgba(255,198,112,0.15)] ring-2 ring-[#ffc670]/20"
        : "bg-gradient-to-br from-[#ffc670]/10 to-[#ffc670]/5 border-[#ffc670]/20 hover:from-[#ffc670]/15 hover:to-[#ffc670]/10",
      buttonColor: "bg-[#ffc670] hover:bg-[#ffc670]/90 text-text-primary",
      badgeColor: "bg-[#ffc670]/20 text-[#7a5800]",
    };
  }
  // red theme
  if (
    color.includes("ff5269") ||
    name.includes("business") ||
    name.includes("pro") ||
    name.includes("red")
  ) {
    return {
      cardClass: isActive
        ? "bg-gradient-to-br from-[#ff5269]/20 to-[#ff5269]/10 border-[#ff5269] shadow-[0_0_15px_rgba(255,82,105,0.15)] ring-2 ring-[#ff5269]/20"
        : "bg-gradient-to-br from-[#ff5269]/10 to-[#ff5269]/5 border-[#ff5269]/20 hover:from-[#ff5269]/15 hover:to-[#ff5269]/10",
      buttonColor: "bg-[#ff5269] hover:bg-[#ff5269]/90 text-white",
      badgeColor: "bg-[#ff5269]/20 text-[#8f1929]",
    };
  }
  // blue theme
  if (
    color.includes("3b82f6") ||
    name.includes("trial") ||
    name.includes("free") ||
    name.includes("blue")
  ) {
    return {
      cardClass: isActive
        ? "bg-gradient-to-br from-[#3b82f6]/20 to-[#3b82f6]/10 border-[#3b82f6] shadow-[0_0_15px_rgba(59,130,246,0.15)] ring-2 ring-[#3b82f6]/20"
        : "bg-gradient-to-br from-[#3b82f6]/10 to-[#3b82f6]/5 border-[#3b82f6]/20 hover:from-[#3b82f6]/15 hover:to-[#3b82f6]/10",
      buttonColor: "bg-[#3b82f6] hover:bg-[#3b82f6]/90 text-white",
      badgeColor: "bg-[#3b82f6]/20 text-[#1e40af]",
    };
  }
  // purple theme
  if (color.includes("8b5cf6") || name.includes("purple")) {
    return {
      cardClass: isActive
        ? "bg-gradient-to-br from-[#8b5cf6]/20 to-[#8b5cf6]/10 border-[#8b5cf6] shadow-[0_0_15px_rgba(139,92,246,0.15)] ring-2 ring-[#8b5cf6]/20"
        : "bg-gradient-to-br from-[#8b5cf6]/10 to-[#8b5cf6]/5 border-[#8b5cf6]/20 hover:from-[#8b5cf6]/15 hover:to-[#8b5cf6]/10",
      buttonColor: "bg-[#8b5cf6] hover:bg-[#8b5cf6]/90 text-white",
      badgeColor: "bg-[#8b5cf6]/20 text-[#5c21b5]",
    };
  }
  // dark theme
  if (
    color.includes("text-primary") ||
    name.includes("dark") ||
    name.includes("black")
  ) {
    return {
      cardClass: isActive
        ? "bg-gradient-to-br from-text-primary/20 to-text-primary/10 border-text-primary shadow-[0_0_15px_rgba(0,0,0,0.15)] ring-2 ring-text-primary/20"
        : "bg-gradient-to-br from-text-primary/10 to-text-primary/5 border-text-primary/20 hover:from-text-primary/15 hover:to-text-primary/10",
      buttonColor: "bg-text-primary hover:bg-text-primary/90 text-white",
      badgeColor: "bg-text-primary/20 text-text-primary",
    };
  }
  // green theme (default/enterprise)
  return {
    cardClass: isActive
      ? "bg-gradient-to-br from-[#1fad66]/20 to-[#1fad66]/10 border-[#1fad66] shadow-[0_0_15px_rgba(31,173,102,0.15)] ring-2 ring-[#1fad66]/20"
      : "bg-gradient-to-br from-[#1fad66]/10 to-[#1fad66]/5 border-[#1fad66]/20 hover:from-[#1fad66]/15 hover:to-[#1fad66]/10",
    buttonColor: "bg-[#1fad66] hover:bg-[#1fad66]/90 text-white",
    badgeColor: "bg-[#1fad66]/20 text-[#0d5931]",
  };
};

export const TenantBillingSettings = ({
  tenantId,
  initialData,
}: TenantBillingSettingsProps) => {
  const router = useRouter();
  const successTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showPlanPicker, setShowPlanPicker] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [planNotice, setPlanNotice] = useState("");
  const [planError, setPlanError] = useState("");
  const [savingPlanName, setSavingPlanName] = useState("");
  const [editingMethodId, setEditingMethodId] = useState("");
  const [showSwitchModal, setShowSwitchModal] = useState(false);
  const [pendingPlanName, setPendingPlanName] = useState("");

  const [formData, setFormData] = useState({
    methodId: "",
    provider: "visa",
    displayName: "",
    last4: "",
    expMonth: "",
    expYear: "",
    cardholderName: "",
    mobileNumber: "",
    email: "",
    description: "",
    isDefault: true,
  });

  const [paymentState, setPaymentState] = useState<SettingsActionState>(
    emptySettingsActionState,
  );
  const [paymentPending, setPaymentPending] = useState(false);

  const handlePaymentSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setPaymentPending(true);

    try {
      const result = await saveTenantPaymentMethod(
        tenantId,
        paymentState,
        formData,
      );
      setPaymentState(result);
    } catch (error) {
      setPaymentState({
        ...emptySettingsActionState,
        error:
          error instanceof Error
            ? error.message
            : "Unable to save payment method.",
      });
    } finally {
      setPaymentPending(false);
    }
  };

  useEffect(() => {
    if (!paymentState.success) return;

    setShowSuccess(true);
    setShowPaymentForm(false);
    setEditingMethodId("");
    setFormData({
      methodId: "",
      provider: "visa",
      displayName: "",
      last4: "",
      expMonth: "",
      expYear: "",
      cardholderName: "",
      mobileNumber: "",
      email: "",
      description: "",
      isDefault: true,
    });
    router.refresh();
  }, [paymentState.success, router]);

  useEffect(() => {
    if (showSuccess) {
      if (successTimerRef.current) {
        clearTimeout(successTimerRef.current);
      }
      successTimerRef.current = setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    }

    return () => {
      if (successTimerRef.current) {
        clearTimeout(successTimerRef.current);
      }
    };
  }, [showSuccess]);

  // success message plan notice auto clear after 3 seconds
  useEffect(() => {
    if (planNotice) {
      const timer = setTimeout(() => {
        setPlanNotice("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [planNotice]);

  const currentPlan = useMemo(
    () =>
      initialData.availablePlans.find(
        (plan) => plan.name === initialData.currentPlanName,
      ) || initialData.availablePlans[0],
    [initialData.availablePlans, initialData.currentPlanName],
  );

  const activePaymentMethodId =
    initialData.paymentMethods.find((method) => method.isDefault)?.id ??
    initialData.paymentMethods[0]?.id ??
    "";

  const handleChangePlan = async (planName: string) => {
    setPlanError("");
    setPlanNotice("");
    setSavingPlanName(planName);

    try {
      await updateTenantSubscriptionPlan(tenantId, planName);
      setPlanNotice(`Subscription updated to ${formatPlanName(planName)}.`);
      setShowPlanPicker(false);
      router.refresh();
    } catch (error) {
      setPlanError(
        error instanceof Error ? error.message : "Unable to change plan.",
      );
    } finally {
      setSavingPlanName("");
    }
  };

  const handleConfirmPlanSwitch = (planName: string) => {
    setPendingPlanName(planName);
    setShowSwitchModal(true);
  };

  const handleExecutePlanSwitch = async () => {
    setShowSwitchModal(false);
    if (pendingPlanName) {
      await handleChangePlan(pendingPlanName);
    }
  };

  const handleSwitchMethod = async (methodId: string) => {
    setPlanError("");
    setPlanNotice("");
    try {
      await setTenantDefaultPaymentMethod(tenantId, methodId);
      setPlanNotice("Payment method updated successfully.");
      router.refresh();
    } catch (error) {
      setPlanError(
        error instanceof Error
          ? error.message
          : "Unable to switch payment method.",
      );
    }
  };

  const handleDeleteMethod = async (methodId: string) => {
    setPlanError("");
    setPlanNotice("");
    try {
      await deleteTenantPaymentMethod(tenantId, methodId);
      setPlanNotice("Payment method removed successfully.");
      router.refresh();
    } catch (error) {
      setPlanError(
        error instanceof Error
          ? error.message
          : "Unable to remove payment method.",
      );
    }
  };

  const openAddPaymentMethod = () => {
    setEditingMethodId("");
    setFormData({
      methodId: "",
      provider: "visa",
      displayName: "",
      last4: "",
      expMonth: "",
      expYear: "",
      cardholderName: "",
      mobileNumber: "",
      email: "",
      description: "",
      isDefault: initialData.paymentMethods.length === 0,
    });
    setShowPaymentForm(true);
  };

  const openEditPaymentMethod = (
    method: (typeof initialData.paymentMethods)[number],
  ) => {
    setEditingMethodId(method.id);
    const prov = (method.provider || "visa").toLowerCase();
    setFormData({
      methodId: method.id,
      provider: prov,
      displayName: method.displayName,
      last4: prov === "visa" || prov === "mastercard" ? method.last4 : "",
      expMonth: prov === "visa" || prov === "mastercard" ? method.expMonth : "",
      expYear: prov === "visa" || prov === "mastercard" ? method.expYear : "",
      cardholderName:
        prov === "visa" || prov === "mastercard" ? method.cardholderName : "",
      mobileNumber: prov === "gcash" ? method.cardholderName : "",
      email:
        prov === "paypal" || prov === "stripe" ? method.cardholderName : "",
      description:
        prov !== "visa" &&
        prov !== "mastercard" &&
        prov !== "gcash" &&
        prov !== "paypal" &&
        prov !== "stripe"
          ? method.cardholderName
          : "",
      isDefault: method.isDefault,
    });
    setShowPaymentForm(true);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 w-full">
      <div>
        <h2 className="text-xl font-bold text-text-primary mb-1">
          Subscription & Billing
        </h2>
        <p className="text-sm text-text-secondary">
          Manage your Qios subscription plan and payment methods.
        </p>
      </div>

      {showSuccess && paymentState.success && (
        <div className="flex items-center gap-2 w-full text-green-700 bg-green-50 border border-green-100 rounded-xl px-4 py-3">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <p className="text-sm font-medium">{paymentState.success}</p>
        </div>
      )}
      {paymentState.error && (
        <div className="flex items-center gap-2 w-full text-red-700 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
          <Shield className="h-4 w-4 shrink-0" />
          <p className="text-sm font-medium">{paymentState.error}</p>
        </div>
      )}
      {planNotice && (
        <div className="flex items-center gap-2 w-full text-green-700 bg-green-50 border border-green-100 rounded-xl px-4 py-3">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <p className="text-sm font-medium">{planNotice}</p>
        </div>
      )}
      {planError && (
        <div className="flex items-center gap-2 w-full text-red-700 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
          <Shield className="h-4 w-4 shrink-0" />
          <p className="text-sm font-medium">{planError}</p>
        </div>
      )}

      <div className="space-y-6">
        <div className="p-6 rounded-2xl border border-brand-accent bg-brand-accent/5">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2">
              {/* subscription plan name text capitalized first letter and stylized like price */}
              <h2 className="text-2xl font-bold text-text-primary">
                {formatPlanName(initialData.currentPlanName)}
              </h2>
              <h3 className="text-xl font-bold text-text-primary">
                ₱{initialData.currentPlanPriceMonthly}{" "}
                <span className="text-sm text-text-secondary font-normal">
                  / month
                </span>
              </h3>
              <p className="text-sm text-text-secondary">
                Next billing date: {formatDateTime(initialData.nextBillingDate)}
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="border-brand-accent text-brand-accent hover:bg-brand-accent hover:text-white hover:border-brand-accent focus:ring-brand-accent"
              onClick={() => setShowPlanPicker((previous) => !previous)}
            >
              Change Plan
            </Button>
          </div>

          {showPlanPicker && (
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              {initialData.availablePlans.map((plan) => {
                const isActive = plan.name === initialData.currentPlanName;
                const styles = getPlanCardStyles(
                  plan.name,
                  plan.color,
                  isActive,
                );

                return (
                  <div
                    key={plan.id}
                    className={cn(
                      "rounded-2xl border p-5 relative transition-all duration-300",
                      styles.cardClass,
                    )}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-bold text-text-primary uppercase tracking-[0.2em]">
                          {formatPlanName(plan.name)}
                        </p>
                        <p className="text-xs text-text-secondary mt-1">
                          {plan.badge}
                        </p>
                      </div>

                      <div className="absolute top-4 right-4">
                        {isActive ? (
                          <span
                            className={cn(
                              "px-2.5 py-1 text-xs font-bold rounded-full",
                              styles.badgeColor,
                            )}
                          >
                            Current
                          </span>
                        ) : (
                          <Button
                            type="button"
                            size="sm"
                            onClick={() => handleConfirmPlanSwitch(plan.name)}
                            loading={savingPlanName === plan.name}
                            className={cn(
                              "py-1 px-3 text-xs border-transparent focus:ring-offset-2",
                              styles.buttonColor,
                            )}
                          >
                            Switch Plan
                          </Button>
                        )}
                      </div>
                    </div>
                    <div className="mt-6 space-y-1">
                      <p className="text-lg font-bold text-text-primary">
                        ₱{plan.priceMonthly}
                        <span className="text-sm text-text-secondary font-normal">
                          / month
                        </span>
                      </p>
                      <p className="text-xs text-text-secondary">
                        ₱{plan.priceAnnually} / year
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <SectionHeader
            title="Payment Method"
            className="mb-0 py-2 border-gray-100"
          />

          <div className="space-y-3 pt-2">
            {initialData.paymentMethods.length > 0 ? (
              initialData.paymentMethods.map((method) => {
                const meta =
                  providerMeta[method.provider.toLowerCase()] ||
                  providerMeta.other;
                const isCurrent =
                  method.id === activePaymentMethodId || method.isDefault;

                return (
                  <div
                    key={method.id}
                    className="flex flex-col gap-4 p-5 rounded-2xl border border-black/[0.05] bg-white transition-colors hover:bg-black/[0.01]"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div
                          className={cn(
                            "w-12 h-12 rounded-full bg-brand-primary/10 flex items-center justify-center shrink-0",
                            meta.accent,
                          )}
                        >
                          {meta.icon}
                        </div>
                        <div className="flex flex-col gap-0.5 select-none pt-1">
                          <span className="b2 font-bold transition-colors duration-300 text-text-primary">
                            {method.displayName} ({meta.label})
                          </span>
                          <span className="b4 transition-colors duration-300 text-text-secondary">
                            {(() => {
                              const prov = method.provider.toLowerCase();
                              if (prov === "visa" || prov === "mastercard") {
                                return `${method.cardholderName} • Card ending in **** ${method.last4}`;
                              }
                              if (prov === "gcash") {
                                return `Mobile: +63 ${method.cardholderName}`;
                              }
                              if (prov === "paypal" || prov === "stripe") {
                                return `Email: ${method.cardholderName}`;
                              }
                              return `Description: ${method.cardholderName}`;
                            })()}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => openEditPaymentMethod(method)}
                          className="border-brand-accent text-brand-accent hover:bg-brand-accent hover:text-white hover:border-brand-accent focus:ring-brand-accent"
                        >
                          Edit
                        </Button>
                        {!isCurrent && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handleSwitchMethod(method.id)}
                            className="border-brand-accent text-brand-accent hover:bg-brand-accent hover:text-white hover:border-brand-accent focus:ring-brand-accent"
                          >
                            Switch
                          </Button>
                        )}
                        {!isCurrent && (
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => handleDeleteMethod(method.id)}
                            className="border-brand-accent text-brand-accent hover:bg-brand-accent hover:text-white hover:border-brand-accent focus:ring-brand-accent"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-black/[0.05]">
                      <Badge
                        color="success"
                        variant="subtle"
                        shape="rounded"
                        className="text-xs"
                      >
                        {isCurrent ? "Current method" : "Linked method"}
                      </Badge>
                      <p className="text-xs text-text-secondary">
                        Added on {formatDateTime(method.addedAt)}
                        {["visa", "mastercard"].includes(
                          method.provider.toLowerCase(),
                        ) && (
                          <>
                            {" "}
                            • Expires {method.expMonth}/{method.expYear}
                          </>
                        )}
                      </p>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="rounded-2xl border border-black/[0.05] bg-white px-5 py-6">
                <p className="text-sm text-text-secondary">
                  No payment methods linked yet.
                </p>
              </div>
            )}
          </div>

          <div className="pt-2 flex justify-end">
            <Button
              type="button"
              variant="outline"
              shape="rounded"
              leftIcon={<Plus size={18} />}
              onClick={openAddPaymentMethod}
              className="border-brand-accent text-brand-accent hover:bg-brand-accent hover:text-white hover:border-brand-accent focus:ring-brand-accent"
            >
              Add Payment Method
            </Button>
          </div>

          {showPaymentForm && (
            <form
              onSubmit={handlePaymentSubmit}
              className="mt-4 p-5 rounded-2xl border border-gray-100 bg-white space-y-4"
            >
              <input type="hidden" name="methodId" value={formData.methodId} />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* payment provider */}
                <div className="space-y-1.5 relative z-50">
                  <label className="text-sm font-medium text-text-primary">
                    Payment Provider{" "}
                    <span className="text-brand-accent">*</span>
                  </label>
                  <input
                    type="hidden"
                    name="provider"
                    value={formData.provider}
                  />
                  <Dropdown
                    label=""
                    className="w-full !max-w-full [&>label]:hidden"
                    options={[
                      { label: "Visa", value: "visa" },
                      { label: "Mastercard", value: "mastercard" },
                      { label: "PayPal", value: "paypal" },
                      { label: "Stripe", value: "stripe" },
                      { label: "GCash", value: "gcash" },
                      { label: "Other", value: "other" },
                    ]}
                    value={formData.provider}
                    onSelect={(option) =>
                      setFormData((previous) => ({
                        ...previous,
                        provider: option.value,
                      }))
                    }
                  />
                  {paymentState.fieldErrors?.provider && (
                    <p className="text-xs text-red-500 pl-1 mt-1">
                      {paymentState.fieldErrors.provider}
                    </p>
                  )}
                </div>

                {/* account name (globally renamed display name) */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-text-primary">
                    Account Name <span className="text-brand-accent">*</span>
                  </label>
                  <Input
                    name="displayName"
                    value={formData.displayName}
                    onChange={(event) =>
                      setFormData((previous) => ({
                        ...previous,
                        displayName: event.target.value,
                      }))
                    }
                    className="py-2.5 rounded-xl"
                  />
                  {paymentState.fieldErrors?.displayName && (
                    <p className="text-xs text-red-500 pl-1 mt-1">
                      {paymentState.fieldErrors.displayName}
                    </p>
                  )}
                </div>

                {/* conditional fields depending on provider */}
                {["visa", "mastercard"].includes(
                  formData.provider.toLowerCase(),
                ) && (
                  <>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-text-primary">
                        Cardholder Name{" "}
                        <span className="text-brand-accent">*</span>
                      </label>
                      <Input
                        name="cardholderName"
                        value={formData.cardholderName}
                        onChange={(event) =>
                          setFormData((previous) => ({
                            ...previous,
                            cardholderName: event.target.value,
                          }))
                        }
                        className="py-2.5 rounded-xl"
                      />
                      {paymentState.fieldErrors?.cardholderName && (
                        <p className="text-xs text-red-500 pl-1 mt-1">
                          {paymentState.fieldErrors.cardholderName}
                        </p>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-text-primary">
                        Card Number Last 4{" "}
                        <span className="text-brand-accent">*</span>
                      </label>
                      <Input
                        name="last4"
                        value={formData.last4}
                        onChange={(event) =>
                          setFormData((previous) => ({
                            ...previous,
                            last4: event.target.value
                              .replace(/[^0-9]/g, "")
                              .slice(0, 4),
                          }))
                        }
                        inputMode="numeric"
                        maxLength={4}
                        className="py-2.5 rounded-xl"
                      />
                      {paymentState.fieldErrors?.last4 && (
                        <p className="text-xs text-red-500 pl-1 mt-1">
                          {paymentState.fieldErrors.last4}
                        </p>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-text-primary">
                        Expiry Month (mm){" "}
                        <span className="text-brand-accent">*</span>
                      </label>
                      <Input
                        name="expMonth"
                        value={formData.expMonth}
                        onChange={(event) => {
                          const val = event.target.value
                            .replace(/[^0-9]/g, "")
                            .slice(0, 2);
                          if (
                            val === "" ||
                            (Number(val) >= 1 && Number(val) <= 12) ||
                            val === "0"
                          ) {
                            setFormData((previous) => ({
                              ...previous,
                              expMonth: val,
                            }));
                          }
                        }}
                        inputMode="numeric"
                        maxLength={2}
                        className="py-2.5 rounded-xl"
                      />
                      {paymentState.fieldErrors?.expMonth && (
                        <p className="text-xs text-red-500 pl-1 mt-1">
                          {paymentState.fieldErrors.expMonth}
                        </p>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-text-primary">
                        Expiry Year (yyyy){" "}
                        <span className="text-brand-accent">*</span>
                      </label>
                      <Input
                        name="expYear"
                        value={formData.expYear}
                        onChange={(event) =>
                          setFormData((previous) => ({
                            ...previous,
                            expYear: event.target.value
                              .replace(/[^0-9]/g, "")
                              .slice(0, 4),
                          }))
                        }
                        inputMode="numeric"
                        maxLength={4}
                        className="py-2.5 rounded-xl"
                      />
                      {paymentState.fieldErrors?.expYear && (
                        <p className="text-xs text-red-500 pl-1 mt-1">
                          {paymentState.fieldErrors.expYear}
                        </p>
                      )}
                    </div>
                  </>
                )}

                {formData.provider.toLowerCase() === "gcash" && (
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-sm font-medium text-text-primary">
                      Mobile Number <span className="text-brand-accent">*</span>
                    </label>
                    <div className="flex gap-2 items-center">
                      <span className="inline-flex items-center px-3 py-2.5 rounded-xl border bg-gray-50 border-[#E5E5E5] text-text-primary">
                        +63
                      </span>
                      <Input
                        name="mobileNumber"
                        value={formData.mobileNumber}
                        onChange={(event) =>
                          setFormData((previous) => ({
                            ...previous,
                            mobileNumber: event.target.value
                              .replace(/[^0-9]/g, "")
                              .slice(0, 11),
                          }))
                        }
                        inputMode="numeric"
                        maxLength={11}
                        className="py-2.5 rounded-xl flex-1"
                        placeholder=""
                      />
                    </div>
                    {paymentState.fieldErrors?.mobileNumber && (
                      <p className="text-xs text-red-500 pl-1 mt-1">
                        {paymentState.fieldErrors.mobileNumber}
                      </p>
                    )}
                  </div>
                )}

                {["paypal", "stripe"].includes(
                  formData.provider.toLowerCase(),
                ) && (
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-sm font-medium text-text-primary">
                      Email Address <span className="text-brand-accent">*</span>
                    </label>
                    <Input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={(event) =>
                        setFormData((previous) => ({
                          ...previous,
                          email: event.target.value,
                        }))
                      }
                      className="py-2.5 rounded-xl"
                      placeholder="account@email.com"
                    />
                    {paymentState.fieldErrors?.email && (
                      <p className="text-xs text-red-500 pl-1 mt-1">
                        {paymentState.fieldErrors.email}
                      </p>
                    )}
                  </div>
                )}

                {formData.provider.toLowerCase() === "other" && (
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-sm font-medium text-text-primary">
                      Description/Reference{" "}
                      <span className="text-brand-accent">*</span>
                    </label>
                    <Input
                      name="description"
                      value={formData.description}
                      onChange={(event) =>
                        setFormData((previous) => ({
                          ...previous,
                          description: event.target.value,
                        }))
                      }
                      className="py-2.5 rounded-xl"
                      placeholder="Enter description or reference details"
                    />
                    {paymentState.fieldErrors?.description && (
                      <p className="text-xs text-red-500 pl-1 mt-1">
                        {paymentState.fieldErrors.description}
                      </p>
                    )}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between gap-4 pt-2">
                <div className="flex items-center gap-3">
                  <Toggle
                    variant="accent"
                    isOn={formData.isDefault}
                    onChange={(nextValue) =>
                      setFormData((previous) => ({
                        ...previous,
                        isDefault: nextValue,
                      }))
                    }
                  />
                  <span className="text-sm text-text-secondary">
                    Set as default payment method
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    shape="rounded"
                    onClick={() => setShowPaymentForm(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="accent"
                    shape="rounded"
                    leftIcon={
                      paymentPending ? (
                        <Loader2 size={18} className="animate-spin" />
                      ) : (
                        <Plus size={18} />
                      )
                    }
                    loading={paymentPending}
                  >
                    {editingMethodId ? "Save Method" : "Add Method"}
                  </Button>
                </div>
              </div>
            </form>
          )}
        </div>

        <div className="space-y-4">
          <SectionHeader
            title="Billing History"
            className="mb-0 py-2 border-gray-100"
          />
          <div className="rounded-xl border border-gray-100 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="py-3 px-4 text-xs font-medium text-text-secondary">
                    Date
                  </th>
                  <th className="py-3 px-4 text-xs font-medium text-text-secondary">
                    Amount
                  </th>
                  <th className="py-3 px-4 text-xs font-medium text-text-secondary">
                    Status
                  </th>
                  <th className="py-3 px-4 text-xs font-medium text-text-secondary text-right">
                    Invoice
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {initialData.billingHistory.length > 0 ? (
                  initialData.billingHistory.map((entry) => (
                    <tr key={entry.id}>
                      <td className="py-3 px-4 text-sm">
                        {formatDateTime(entry.billingDate)}
                      </td>
                      <td className="py-3 px-4 text-sm font-medium">
                        {entry.amount}
                      </td>
                      <td className="py-3 px-4 text-sm">
                        <span className="text-green-600 bg-green-50 px-2 py-1 rounded-full text-xs">
                          {entry.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-right">
                        <button className="text-brand-accent hover:underline">
                          Download
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      className="py-3 px-4 text-sm text-text-secondary"
                      colSpan={4}
                    >
                      No billing history found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <ActionConfirmationModal
        isOpen={showSwitchModal}
        action="save"
        title="Confirm Plan Change"
        message={
          <div className="space-y-2 select-none">
            <p>
              Are you sure you want to change your subscription plan to{" "}
              <strong>{formatPlanName(pendingPlanName)}</strong>?
            </p>
            <p className="text-xs text-text-secondary">
              Standard Billing Notice: Your payment method will be charged for
              the new plan, and any unused portion of your current subscription
              will be prorated.
            </p>
          </div>
        }
        confirmLabel="Switch plan"
        cancelLabel="Cancel"
        onClose={() => setShowSwitchModal(false)}
        onConfirm={handleExecutePlanSwitch}
        saving={savingPlanName !== ""}
      />
    </div>
  );
};
