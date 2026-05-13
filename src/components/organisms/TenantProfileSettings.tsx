"use client";

import React, { useActionState, useEffect, useState, useRef } from "react";
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
  const [showSuccess, setShowSuccess] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const wasPending = useRef(false);

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

  const nameParts = formData.name.trim().split(/\s+/);
  const initials =
    nameParts.length > 1
      ? `${nameParts[0].charAt(0)}${nameParts[nameParts.length - 1].charAt(0)}`.toUpperCase()
      : (formData.name.trim().charAt(0) || "U").toUpperCase();

  const currentAvatar = avatarPreview || formData.avatarUrl;

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

      <div className="space-y-6 w-full">
        <div className="space-y-4 w-full">
          <SectionHeader
            title="Personal Information"
            className="mb-0 py-2 border-gray-100"
          />
          <form action={formAction} className="pt-2 w-full">
            {showSuccess && state.success && (
              <div className="mb-6 w-full">
                <div className="flex items-center gap-2 w-full text-green-700 bg-green-50 border border-green-100 rounded-xl px-4 py-3">
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  <p className="text-sm font-medium">{state.success}</p>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-8 lg:gap-12 items-start w-full">
              <div className="flex flex-col items-center gap-4 flex-shrink-0 sm:w-52">
                <div className="relative group w-40 h-40 sm:w-52 sm:h-52 rounded-full bg-brand-primary flex items-center justify-center text-white text-5xl font-bold border-4 border-white shadow-md overflow-hidden">
                  {currentAvatar ? (
                    <img
                      src={currentAvatar}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    initials
                  )}
                  {isEditing && (
                    <label className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 text-white opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity duration-200">
                      <Upload size={28} className="mb-1" />
                      <span className="text-sm font-medium leading-tight">
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
                <div className="text-sm text-text-secondary text-center">
                  <p>Allowed: JPG, PNG</p>
                  <p>(Max 5MB)</p>
                </div>
              </div>

              <div className="flex-1 w-full space-y-5">
                <div className="space-y-1.5 w-full">
                  <label className="text-sm font-medium text-text-primary">
                    Full Name <span className="text-brand-accent">*</span>
                  </label>
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={(event) => {
                      setFormData((previous) => ({
                        ...previous,
                        name: event.target.value,
                      }));
                      setFieldErrors((prev) => ({ ...prev, name: "" }));
                    }}
                    isError={!!fieldErrors.name}
                    className={`py-2.5 w-full rounded-xl focus:outline-none disabled:cursor-not-allowed ${
                      !fieldErrors.name
                        ? "focus:border-brand-primary focus:ring-brand-primary"
                        : ""
                    }`}
                    disabled={!isEditing}
                  />
                  {fieldErrors.name && (
                    <p className="text-xs text-red-500 pl-1 mt-1">
                      {fieldErrors.name}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5 w-full">
                  <label className="text-sm font-medium text-text-primary">
                    Email Address <span className="text-brand-accent">*</span>
                  </label>
                  <input type="hidden" name="email" value={formData.email} />
                  <Input
                    value={formData.email}
                    type="email"
                    isError={!!fieldErrors.email}
                    className="py-2.5 w-full rounded-xl focus:outline-none disabled:cursor-not-allowed"
                    disabled
                  />
                  {fieldErrors.email && (
                    <p className="text-xs text-red-500 pl-1 mt-1">
                      {fieldErrors.email}
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
                        fieldErrors.phoneNumber
                          ? "border-red-500"
                          : "border-[#E5E5E5]"
                      } ${!isEditing ? "opacity-70 cursor-not-allowed" : ""}`}
                    >
                      +63
                    </span>
                    <Input
                      name="phoneNumber"
                      value={formData.phoneNumber || ""}
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
                      className={`py-2.5 w-full rounded-xl flex-1 focus:outline-none disabled:cursor-not-allowed ${
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
                      Edit Profile
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
                          setAvatarPreview(null);
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
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
