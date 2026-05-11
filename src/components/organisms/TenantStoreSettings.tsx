"use client";

import React, { useActionState, useEffect, useState } from "react";
import { Save, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
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
  const [state, formAction, isPending] = useActionState(
    saveTenantStoreSettings.bind(null, tenantId),
    emptySettingsActionState,
  );

  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

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

      <div className="space-y-6">
        <div className="space-y-4">
          <SectionHeader
            title="General Information"
            className="mb-0 py-2 border-gray-100"
          />
          <form action={formAction} className="pt-2 space-y-6">
            {(state.error || state.success) && (
              <div className="space-y-3">
                {state.success && (
                  <div className="flex items-center gap-2 w-full text-green-700 bg-green-50 border border-green-100 rounded-xl px-4 py-3">
                    <CheckCircle2 className="h-4 w-4 shrink-0" />
                    <p className="text-sm font-medium">{state.success}</p>
                  </div>
                )}
                {state.error && (
                  <p className="w-full text-sm text-red-500 bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-center">
                    {state.error}
                  </p>
                )}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-sm font-medium text-text-primary">
                  Store Name (Trading Name)
                </label>
                <Input
                  name="storeName"
                  value={formData.storeName}
                  onChange={(event) =>
                    setFormData((previous) => ({
                      ...previous,
                      storeName: event.target.value,
                    }))
                  }
                  isError={!!state.fieldErrors.storeName}
                  className="py-2.5 rounded-xl"
                />
                {state.fieldErrors.storeName && (
                  <p className="text-xs text-red-500 pl-1">
                    {state.fieldErrors.storeName}
                  </p>
                )}
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-text-primary">
                  Public Contact Email
                </label>
                <Input
                  name="publicContactEmail"
                  value={formData.publicContactEmail}
                  onChange={(event) =>
                    setFormData((previous) => ({
                      ...previous,
                      publicContactEmail: event.target.value,
                    }))
                  }
                  type="email"
                  isError={!!state.fieldErrors.publicContactEmail}
                  className="py-2.5 rounded-xl"
                />
                {state.fieldErrors.publicContactEmail && (
                  <p className="text-xs text-red-500 pl-1">
                    {state.fieldErrors.publicContactEmail}
                  </p>
                )}
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-text-primary">
                  Public Phone Number
                </label>
                <Input
                  name="publicPhoneNumber"
                  value={formData.publicPhoneNumber}
                  onChange={(event) =>
                    setFormData((previous) => ({
                      ...previous,
                      publicPhoneNumber: event.target.value,
                    }))
                  }
                  type="tel"
                  className="py-2.5 rounded-xl"
                />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-sm font-medium text-text-primary">
                  Physical Address
                </label>
                <Input
                  name="physicalAddress"
                  value={formData.physicalAddress}
                  onChange={(event) =>
                    setFormData((previous) => ({
                      ...previous,
                      physicalAddress: event.target.value,
                    }))
                  }
                  className="py-2.5 rounded-xl"
                />
              </div>
            </div>

            <div className="space-y-4">
              <SectionHeader
                title="Localization & Regional"
                className="mb-0 py-2 border-gray-100"
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-text-primary">
                    Currency
                  </label>
                  <select
                    name="currency"
                    value={formData.currency}
                    onChange={(event) =>
                      setFormData((previous) => ({
                        ...previous,
                        currency: event.target.value,
                      }))
                    }
                    className="w-full px-4 py-2.5 rounded-xl border-2 border-[#E5E5E5] focus:outline-none focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-accent transition-colors bg-white appearance-none cursor-pointer"
                  >
                    <option value="PHP">PHP (₱)</option>
                    <option value="USD">USD ($)</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-text-primary">
                    Timezone
                  </label>
                  <select
                    name="timezone"
                    value={formData.timezone}
                    onChange={(event) =>
                      setFormData((previous) => ({
                        ...previous,
                        timezone: event.target.value,
                      }))
                    }
                    className="w-full px-4 py-2.5 rounded-xl border-2 border-[#E5E5E5] focus:outline-none focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-accent transition-colors bg-white appearance-none cursor-pointer"
                  >
                    <option value="Asia/Manila">Asia/Manila (GMT+8)</option>
                    <option value="UTC">UTC</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-text-primary">
                    Tax Rate (%)
                  </label>
                  <Input
                    name="taxRate"
                    value={formData.taxRate}
                    onChange={(event) =>
                      setFormData((previous) => ({
                        ...previous,
                        taxRate: event.target.value,
                      }))
                    }
                    type="number"
                    isError={!!state.fieldErrors.taxRate}
                    className="py-2.5 rounded-xl"
                  />
                  {state.fieldErrors.taxRate && (
                    <p className="text-xs text-red-500 pl-1">
                      {state.fieldErrors.taxRate}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <Button
                type="submit"
                variant="accent"
                shape="rounded"
                leftIcon={<Save size={18} />}
                loading={isPending}
              >
                Save Store Details
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
