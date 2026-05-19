"use client";

import React, {
  useActionState,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
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
import { cn } from "@/lib/utils";
import {
  deleteTenantPaymentMethod,
  saveTenantPaymentMethod,
  setTenantDefaultPaymentMethod,
  updateTenantSubscriptionPlan,
} from "@/app/(tenant)/[id]/settings/actions";
import {
  emptySettingsActionState,
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

  const [formData, setFormData] = useState({
    methodId: "",
    provider: "visa",
    displayName: "",
    last4: "",
    expMonth: "",
    expYear: "",
    cardholderName: "",
    isDefault: true,
  });

  const [paymentState, paymentAction, paymentPending] = useActionState(
    saveTenantPaymentMethod.bind(null, tenantId),
    emptySettingsActionState,
  );

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
      setPlanNotice(`Subscription updated to ${planName}.`);
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
      isDefault: initialData.paymentMethods.length === 0,
    });
    setShowPaymentForm(true);
  };

  const openEditPaymentMethod = (
    method: (typeof initialData.paymentMethods)[number],
  ) => {
    setEditingMethodId(method.id);
    setFormData({
      methodId: method.id,
      provider: method.provider || "visa",
      displayName: method.displayName,
      last4: method.last4,
      expMonth: method.expMonth,
      expYear: method.expYear,
      cardholderName: method.cardholderName,
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
              <span
                className={cn(
                  "inline-flex items-center gap-2 px-2.5 py-1 text-white text-xs font-bold rounded-full",
                  currentPlan?.color || "bg-brand-accent",
                )}
              >
                {currentPlan?.badge || initialData.currentPlanBadge}
              </span>
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

                return (
                  <div
                    key={plan.id}
                    className={cn(
                      "rounded-2xl border p-5 bg-white",
                      isActive
                        ? "border-brand-accent/30 bg-brand-primary/5"
                        : "border-gray-100",
                    )}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-bold text-text-primary uppercase tracking-[0.2em]">
                          {plan.name}
                        </p>
                        <p className="text-xs text-text-secondary mt-1">
                          {plan.badge}
                        </p>
                      </div>
                      <span
                        className={cn("w-3 h-3 rounded-full", plan.color)}
                      />
                    </div>
                    <div className="mt-4 space-y-1">
                      <p className="text-lg font-bold text-text-primary">
                        ₱{plan.priceMonthly}
                        <span className="text-sm text-text-secondary font-normal">
                          / month
                        </span>
                      </p>
                      <p className="text-sm text-text-secondary">
                        ₱{plan.priceAnnually} / year
                      </p>
                    </div>
                    <div className="mt-4 flex justify-end">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="border-brand-accent text-brand-accent hover:bg-brand-accent hover:text-white hover:border-brand-accent focus:ring-brand-accent"
                        onClick={() => handleChangePlan(plan.name)}
                        loading={savingPlanName === plan.name}
                        disabled={isActive}
                      >
                        {isActive ? "Current Plan" : "Switch Plan"}
                      </Button>
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
                  providerMeta[method.provider] || providerMeta.other;
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
                            {method.displayName || meta.label}
                          </span>
                          <span className="b4 transition-colors duration-300 text-text-secondary">
                            {method.cardholderName}
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
                        Added on {formatDateTime(method.addedAt)} • Expires{" "}
                        {method.expMonth}/{method.expYear}
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
              leftIcon={<Edit2 size={18} />}
              onClick={openAddPaymentMethod}
              className="border-brand-accent text-brand-accent hover:bg-brand-accent hover:text-white hover:border-brand-accent focus:ring-brand-accent"
            >
              Add Payment Method
            </Button>
          </div>

          {showPaymentForm && (
            <form
              action={paymentAction}
              className="mt-4 p-5 rounded-2xl border border-gray-100 bg-white space-y-4"
            >
              <input type="hidden" name="methodId" value={formData.methodId} />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-text-primary">
                    Payment Provider
                  </label>
                  <select
                    name="provider"
                    value={formData.provider}
                    onChange={(event) =>
                      setFormData((previous) => ({
                        ...previous,
                        provider: event.target.value,
                      }))
                    }
                    className="w-full rounded-xl border border-[#E5E5E5] px-3 py-2.5 text-sm text-text-primary focus:border-brand-primary focus:ring-brand-primary"
                  >
                    <option value="visa">Visa</option>
                    <option value="mastercard">Mastercard</option>
                    <option value="paypal">PayPal</option>
                    <option value="stripe">Stripe</option>
                    <option value="gcash">GCash</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-text-primary">
                    Display Name
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
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-text-primary">
                    Cardholder Name
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
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-text-primary">
                    Card Number Last 4
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
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-text-primary">
                    Expiry Month
                  </label>
                  <Input
                    name="expMonth"
                    value={formData.expMonth}
                    onChange={(event) =>
                      setFormData((previous) => ({
                        ...previous,
                        expMonth: event.target.value
                          .replace(/[^0-9]/g, "")
                          .slice(0, 2),
                      }))
                    }
                    inputMode="numeric"
                    maxLength={2}
                    className="py-2.5 rounded-xl"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-text-primary">
                    Expiry Year
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
                </div>
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
    </div>
  );
};
