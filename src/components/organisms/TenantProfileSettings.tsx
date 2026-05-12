"use client";

import React, { useActionState, useEffect, useState } from "react";
import { Upload, Save, CheckCircle2, Edit2 } from "lucide-react";
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
  const [isEditing, setIsEditing] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const [state, formAction, isPending] = useActionState(
    saveTenantProfileSettings.bind(null, tenantId),
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
            {state.success && (
              <div className="mb-4">
                <div className="flex items-center gap-2 w-full text-green-700 bg-green-50 border border-green-100 rounded-xl px-4 py-3">
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  <p className="text-sm font-medium">{state.success}</p>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-6">
              <div className="flex flex-col items-center gap-3 flex-shrink-0">
                <div className="relative group w-24 h-24 rounded-full bg-brand-primary flex items-center justify-center text-white text-3xl font-bold border-4 border-white shadow-md overflow-hidden">
                  {avatarPreview ? (
                    <img
                      src={avatarPreview}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    initials
                  )}
                  {isEditing && (
                    <label className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 text-white opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity duration-200">
                      <Upload size={20} className="mb-0.5" />
                      <span className="text-[10px] font-medium leading-tight">
                        Upload
                      </span>
                      <input
                        type="file"
                        name="avatar"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setAvatarPreview(URL.createObjectURL(file));
                          }
                        }}
                      />
                    </label>
                  )}
                </div>
                <div className="text-xs text-text-secondary text-center">
                  <p>Allowed: JPG, PNG</p>
                  <p>(Max 5MB)</p>
                </div>
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
                      onChange={(event) => {
                        setFormData((previous) => ({
                          ...previous,
                          firstName: event.target.value,
                        }));
                        setFieldErrors((prev) => ({ ...prev, firstName: "" }));
                      }}
                      isError={!!fieldErrors.firstName}
                      className={`py-2.5 rounded-xl focus:outline-none disabled:cursor-not-allowed ${
                        !fieldErrors.firstName
                          ? "focus:border-brand-primary focus:ring-brand-primary"
                          : ""
                      }`}
                      disabled={!isEditing}
                    />
                    {fieldErrors.firstName && (
                      <p className="text-xs text-red-500 pl-1 mt-1">
                        {fieldErrors.firstName}
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
                      onChange={(event) => {
                        setFormData((previous) => ({
                          ...previous,
                          lastName: event.target.value,
                        }));
                        setFieldErrors((prev) => ({ ...prev, lastName: "" }));
                      }}
                      isError={!!fieldErrors.lastName}
                      className={`py-2.5 rounded-xl focus:outline-none disabled:cursor-not-allowed ${
                        !fieldErrors.lastName
                          ? "focus:border-brand-primary focus:ring-brand-primary"
                          : ""
                      }`}
                      disabled={!isEditing}
                    />
                    {fieldErrors.lastName && (
                      <p className="text-xs text-red-500 pl-1 mt-1">
                        {fieldErrors.lastName}
                      </p>
                    )}
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-text-primary">
                    Email Address
                  </label>
                  <input type="hidden" name="email" value={formData.email} />
                  <Input
                    value={formData.email}
                    type="email"
                    isError={!!fieldErrors.email}
                    className="py-2.5 rounded-xl focus:outline-none disabled:cursor-not-allowed"
                    disabled
                  />
                  {fieldErrors.email && (
                    <p className="text-xs text-red-500 pl-1 mt-1">
                      {fieldErrors.email}
                    </p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-text-primary">
                    Phone Number
                  </label>
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center px-3 py-2.5 rounded-xl border bg-gray-50 text-text-primary transition-colors ${
                        fieldErrors.phoneNumber
                          ? "border-red-500"
                          : "border-[#E5E5E5]"
                      } ${!isEditing ? "opacity-70 cursor-not-allowed" : ""}`}
                    >
                      +63
                    </span>
                    <Input
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={(event) => {
                        setFormData((previous) => ({
                          ...previous,
                          phoneNumber: event.target.value,
                        }));
                        setFieldErrors((prev) => ({
                          ...prev,
                          phoneNumber: "",
                        }));
                      }}
                      type="tel"
                      isError={!!fieldErrors.phoneNumber}
                      className={`py-2.5 rounded-xl flex-1 focus:outline-none disabled:cursor-not-allowed ${
                        !fieldErrors.phoneNumber
                          ? "focus:border-brand-primary focus:ring-brand-primary"
                          : ""
                      }`}
                      disabled={!isEditing}
                    />
                  </div>
                  {fieldErrors.phoneNumber && (
                    <p className="text-xs text-red-500 pl-1 mt-1">
                      {fieldErrors.phoneNumber}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              {!isEditing ? (
                <Button
                  type="button"
                  variant="outline"
                  shape="rounded"
                  onClick={() => setIsEditing(true)}
                  leftIcon={<Edit2 size={18} />}
                >
                  Edit
                </Button>
              ) : (
                <Button
                  type="submit"
                  variant="accent"
                  shape="rounded"
                  leftIcon={<Save size={18} />}
                  loading={isPending}
                >
                  Save
                </Button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
