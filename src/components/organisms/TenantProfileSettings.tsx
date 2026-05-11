"use client";

import React, { useActionState, useEffect, useState } from "react";
import { Upload, Save, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
import { SectionHeader } from "@/components/molecules/SectionHeader";
import { saveTenantProfileSettings } from "@/app/(tenant)/[id]/settings/actions";
import {
  emptySettingsActionState,
  type TenantProfileSettingsData,
} from "@/app/(tenant)/[id]/settings/types";

interface TenantProfileSettingsProps {
  tenantId: string;
  initialData: TenantProfileSettingsData;
}

export const TenantProfileSettings = ({
  tenantId,
  initialData,
}: TenantProfileSettingsProps) => {
  const [formData, setFormData] = useState(initialData);
  const [state, formAction, isPending] = useActionState(
    saveTenantProfileSettings.bind(null, tenantId),
    emptySettingsActionState,
  );

  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  const initials =
    `${formData.firstName.trim().charAt(0)}${formData.lastName.trim().charAt(0)}`.toUpperCase();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 w-full">
      <div>
        <h2 className="text-xl font-bold text-text-primary mb-1">
          Profile Settings
        </h2>
        <p className="text-sm text-text-secondary">
          Manage your personal account details and preferences.
        </p>
      </div>

      <div className="space-y-6">
        <div className="space-y-4">
          <SectionHeader
            title="Personal Information"
            className="mb-0 py-2 border-gray-100"
          />
          <form action={formAction} className="pt-2">
            {(state.error || state.success) && (
              <div className="mb-4 space-y-3">
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

            <div className="flex flex-col sm:flex-row gap-6">
              <div className="flex flex-col items-center gap-3 flex-shrink-0">
                <div className="w-24 h-24 rounded-full bg-brand-primary flex items-center justify-center text-white text-3xl font-bold border-4 border-white shadow-md overflow-hidden relative group">
                  {initials}
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    <Upload size={24} className="text-white" />
                  </div>
                </div>
                <span className="text-xs text-text-secondary">
                  Allowed: JPG, PNG
                </span>
              </div>

              <div className="flex-1 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-text-primary">
                      First Name
                    </label>
                    <Input
                      name="firstName"
                      value={formData.firstName}
                      onChange={(event) =>
                        setFormData((previous) => ({
                          ...previous,
                          firstName: event.target.value,
                        }))
                      }
                      isError={!!state.fieldErrors.firstName}
                      className="py-2.5 rounded-xl"
                    />
                    {state.fieldErrors.firstName && (
                      <p className="text-xs text-red-500 pl-1">
                        {state.fieldErrors.firstName}
                      </p>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-text-primary">
                      Last Name
                    </label>
                    <Input
                      name="lastName"
                      value={formData.lastName}
                      onChange={(event) =>
                        setFormData((previous) => ({
                          ...previous,
                          lastName: event.target.value,
                        }))
                      }
                      isError={!!state.fieldErrors.lastName}
                      className="py-2.5 rounded-xl"
                    />
                    {state.fieldErrors.lastName && (
                      <p className="text-xs text-red-500 pl-1">
                        {state.fieldErrors.lastName}
                      </p>
                    )}
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-text-primary">
                    Email Address
                  </label>
                  <Input
                    name="email"
                    value={formData.email}
                    onChange={(event) =>
                      setFormData((previous) => ({
                        ...previous,
                        email: event.target.value,
                      }))
                    }
                    type="email"
                    isError={!!state.fieldErrors.email}
                    className="py-2.5 rounded-xl"
                  />
                  {state.fieldErrors.email && (
                    <p className="text-xs text-red-500 pl-1">
                      {state.fieldErrors.email}
                    </p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-text-primary">
                    Phone Number
                  </label>
                  <Input
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={(event) =>
                      setFormData((previous) => ({
                        ...previous,
                        phoneNumber: event.target.value,
                      }))
                    }
                    type="tel"
                    className="py-2.5 rounded-xl"
                  />
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
                Save Profile
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
