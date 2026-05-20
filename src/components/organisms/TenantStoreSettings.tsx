"use client";

import React, { useActionState, useEffect, useState, useRef } from "react";
import { Save, CheckCircle2, Edit2 } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
import { Dropdown } from "@/components/molecules/Dropdown";
import { SectionHeader } from "@/components/molecules/SectionHeader";
import { saveTenantStoreSettings } from "@/app/(tenant)/[id]/settings/actions";
import {
  emptySettingsActionState,
  type TenantStoreSettingsData,
} from "@/app/(tenant)/[id]/settings/types";

interface TenantStoreSettingsProps {
  tenantId: string;
  initialData: TenantStoreSettingsData;
}

export const TenantStoreSettings = ({
  tenantId,
  initialData,
}: TenantStoreSettingsProps) => {
  const [formData, setFormData] = useState(initialData);
  const [isEditing, setIsEditing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const wasPending = useRef(false);

  const [state, formAction, isPending] = useActionState(
    saveTenantStoreSettings.bind(null, tenantId),
    emptySettingsActionState,
  );

  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  useEffect(() => {
    if (state.fieldErrors) {
      setFieldErrors(state.fieldErrors);
    }
  }, [state.fieldErrors]);

  useEffect(() => {
    if (wasPending.current && !isPending) {
      if (state.success) {
        setIsEditing(false);
        setShowSuccess(true);
      }
    }
    wasPending.current = isPending;
  }, [isPending, state.success]);

  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showSuccess]);

  const currencyOptions = [
    { label: "PHP (₱)", value: "PHP" },
    { label: "USD ($)", value: "USD" },
    { label: "EUR (€)", value: "EUR" },
    { label: "GBP (£)", value: "GBP" },
    { label: "JPY (¥)", value: "JPY" },
    { label: "AUD (A$)", value: "AUD" },
    { label: "CAD (C$)", value: "CAD" },
    { label: "SGD (S$)", value: "SGD" },
  ];

  const timezoneOptions = [
    { label: "Asia/Manila (GMT+8)", value: "Asia/Manila" },
    { label: "Asia/Tokyo (GMT+9)", value: "Asia/Tokyo" },
    { label: "Asia/Singapore (GMT+8)", value: "Asia/Singapore" },
    { label: "Australia/Sydney (GMT+10)", value: "Australia/Sydney" },
    { label: "Europe/London (GMT)", value: "Europe/London" },
    { label: "America/New_York (GMT-5)", value: "America/New_York" },
    { label: "America/Los_Angeles (GMT-8)", value: "America/Los_Angeles" },
    { label: "UTC", value: "UTC" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 w-full">
      <div>
        <h2 className="text-xl font-bold text-text-primary mb-1">
          Store Details
        </h2>
        <p className="text-sm text-text-secondary">
          Configure the business information displayed to customers.
        </p>
      </div>

      <div className="space-y-6 w-full">
        <div className="space-y-4 w-full">
          <SectionHeader
            title="General Information"
            className="mb-0 py-2 border-gray-100"
          />
          <form action={formAction} className="pt-2 w-full space-y-6">
            {showSuccess && state.success && (
              <div className="mb-6 w-full">
                <div className="flex items-center gap-2 w-full text-green-700 bg-green-50 border border-green-100 rounded-xl px-4 py-3">
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  <p className="text-sm font-medium">{state.success}</p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 w-full">
              <div className="space-y-1.5 sm:col-span-2 w-full">
                <label className="text-sm font-medium text-text-primary">
                  Store Name <span className="text-brand-accent">*</span>
                </label>
                <Input
                  name="storeName"
                  value={formData.storeName}
                  onChange={(event) => {
                    setFormData((previous) => ({
                      ...previous,
                      storeName: event.target.value,
                    }));
                    setFieldErrors((prev) => ({ ...prev, storeName: "" }));
                  }}
                  isError={!!fieldErrors.storeName}
                  className={`py-2.5 w-full rounded-xl focus:outline-none disabled:cursor-not-allowed ${
                    !fieldErrors.storeName
                      ? "focus:border-brand-primary focus:ring-brand-primary"
                      : ""
                  }`}
                  disabled={!isEditing}
                />
                {fieldErrors.storeName && (
                  <p className="text-xs text-red-500 pl-1 mt-1">
                    {fieldErrors.storeName}
                  </p>
                )}
              </div>
              <div className="space-y-1.5 w-full">
                <label className="text-sm font-medium text-text-primary">
                  Email Address <span className="text-brand-accent">*</span>
                </label>
                <Input
                  name="publicContactEmail"
                  value={formData.publicContactEmail}
                  onChange={(event) => {
                    setFormData((previous) => ({
                      ...previous,
                      publicContactEmail: event.target.value,
                    }));
                    setFieldErrors((prev) => ({
                      ...prev,
                      publicContactEmail: "",
                    }));
                  }}
                  type="email"
                  isError={!!fieldErrors.publicContactEmail}
                  className={`py-2.5 w-full rounded-xl focus:outline-none disabled:cursor-not-allowed ${
                    !fieldErrors.publicContactEmail
                      ? "focus:border-brand-primary focus:ring-brand-primary"
                      : ""
                  }`}
                  disabled={!isEditing}
                />
                {fieldErrors.publicContactEmail && (
                  <p className="text-xs text-red-500 pl-1 mt-1">
                    {fieldErrors.publicContactEmail}
                  </p>
                )}
              </div>
              <div className="space-y-1.5 w-full">
                <label className="text-sm font-medium text-text-primary">
                  Phone Number
                </label>
                <div className="flex items-center gap-2 w-full">
                  <span
                    className={`inline-flex items-center px-3 py-2.5 rounded-xl border bg-gray-50 text-text-primary transition-colors ${
                      fieldErrors.publicPhoneNumber
                        ? "border-red-500"
                        : "border-[#E5E5E5]"
                    } ${!isEditing ? "opacity-70 cursor-not-allowed" : ""}`}
                  >
                    +63
                  </span>
                  <Input
                    name="publicPhoneNumber"
                    value={formData.publicPhoneNumber}
                    onChange={(event) => {
                      setFormData((previous) => ({
                        ...previous,
                        publicPhoneNumber: event.target.value
                          .replace(/[^0-9]/g, "")
                          .slice(0, 10),
                      }));
                      setFieldErrors((prev) => ({
                        ...prev,
                        publicPhoneNumber: "",
                      }));
                    }}
                    type="tel"
                    inputMode="numeric"
                    isError={!!fieldErrors.publicPhoneNumber}
                    className={`py-2.5 w-full rounded-xl flex-1 focus:outline-none disabled:cursor-not-allowed ${
                      !fieldErrors.publicPhoneNumber
                        ? "focus:border-brand-primary focus:ring-brand-primary"
                        : ""
                    }`}
                    disabled={!isEditing}
                  />
                </div>
                {fieldErrors.publicPhoneNumber && (
                  <p className="text-xs text-red-500 pl-1 mt-1">
                    {fieldErrors.publicPhoneNumber}
                  </p>
                )}
              </div>
              <div className="space-y-1.5 sm:col-span-2 w-full">
                <label className="text-sm font-medium text-text-primary">
                  Store Address
                </label>
                <Input
                  name="physicalAddress"
                  value={formData.physicalAddress}
                  onChange={(event) => {
                    setFormData((previous) => ({
                      ...previous,
                      physicalAddress: event.target.value,
                    }));
                  }}
                  className="py-2.5 w-full rounded-xl focus:outline-none disabled:cursor-not-allowed focus:border-brand-primary focus:ring-brand-primary"
                  disabled={!isEditing}
                />
              </div>
            </div>

            <div className="space-y-4 w-full pt-2">
              <SectionHeader
                title="Localization & Regional"
                className="mb-0 py-2 border-gray-100"
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 w-full">
                <div className="relative z-50 space-y-1.5 w-full">
                  <label className="text-sm font-medium text-text-primary">
                    Currency <span className="text-brand-accent">*</span>
                  </label>
                  <div
                    className={
                      !isEditing ? "opacity-70 pointer-events-none" : ""
                    }
                  >
                    <input
                      type="hidden"
                      name="currency"
                      value={formData.currency}
                    />
                    <Dropdown
                      label=""
                      className="w-full !max-w-full [&>label]:hidden"
                      options={currencyOptions}
                      value={formData.currency}
                      onSelect={(option) => {
                        if (isEditing) {
                          setFormData((prev) => ({
                            ...prev,
                            currency: option.value,
                          }));
                        }
                      }}
                    />
                  </div>
                </div>
                <div className="relative z-40 space-y-1.5 w-full">
                  <label className="text-sm font-medium text-text-primary">
                    Timezone <span className="text-brand-accent">*</span>
                  </label>
                  <div
                    className={
                      !isEditing ? "opacity-70 pointer-events-none" : ""
                    }
                  >
                    <input
                      type="hidden"
                      name="timezone"
                      value={formData.timezone}
                    />
                    <Dropdown
                      label=""
                      className="w-full !max-w-full [&>label]:hidden"
                      options={timezoneOptions}
                      value={formData.timezone}
                      onSelect={(option) => {
                        if (isEditing) {
                          setFormData((prev) => ({
                            ...prev,
                            timezone: option.value,
                          }));
                        }
                      }}
                    />
                  </div>
                </div>
                <div className="space-y-1.5 w-full">
                  <label className="text-sm font-medium text-text-primary">
                    Tax Rate (%) <span className="text-brand-accent">*</span>
                  </label>
                  <Input
                    name="taxRate"
                    value={formData.taxRate}
                    onChange={(event) => {
                      setFormData((previous) => ({
                        ...previous,
                        taxRate: event.target.value,
                      }));
                      setFieldErrors((prev) => ({ ...prev, taxRate: "" }));
                    }}
                    type="number"
                    isError={!!fieldErrors.taxRate}
                    className={`py-2.5 w-full rounded-xl focus:outline-none disabled:cursor-not-allowed ${
                      !fieldErrors.taxRate
                        ? "focus:border-brand-primary focus:ring-brand-primary"
                        : ""
                    }`}
                    disabled={!isEditing}
                  />
                  {fieldErrors.taxRate && (
                    <p className="text-xs text-red-500 pl-1 mt-1">
                      {fieldErrors.taxRate}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-end w-full">
              {!isEditing ? (
                <Button
                  type="button"
                  variant="outline"
                  shape="rounded"
                  onClick={() => {
                    setIsEditing(true);
                    setShowSuccess(false);
                  }}
                  leftIcon={<Edit2 size={18} />}
                >
                  Edit Store Details
                </Button>
              ) : (
                <div className="flex items-center gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    shape="rounded"
                    onClick={() => {
                      setIsEditing(false);
                      setFormData(initialData);
                      setFieldErrors({});
                    }}
                    disabled={isPending}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="accent"
                    shape="rounded"
                    leftIcon={<Save size={18} />}
                    loading={isPending}
                  >
                    Save Changes
                  </Button>
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
