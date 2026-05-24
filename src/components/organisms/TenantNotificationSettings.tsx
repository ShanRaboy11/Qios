"use client";

import React, { useEffect, useState } from "react";
import { Bell, Clock3, Save, ShieldAlert, TriangleAlert } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { Toggle } from "@/components/atoms/Toggle";
import { CheckCircle2 } from "lucide-react";
import { SectionHeader } from "@/components/molecules/SectionHeader";
import { saveTenantNotificationSettings } from "@/app/(tenant)/[id]/settings/actions";
import {
  emptySettingsActionState,
  type SettingsActionState,
  type TenantNotificationSettingsData,
} from "@/app/(tenant)/[id]/settings/types";

interface TenantNotificationSettingsProps {
  tenantId: string;
  initialData: TenantNotificationSettingsData;
}

export const TenantNotificationSettings = ({
  tenantId,
  initialData,
}: TenantNotificationSettingsProps) => {
  const [formData, setFormData] = useState(initialData);
  const [showSuccess, setShowSuccess] = useState(false);
  const [state, setState] = useState<SettingsActionState>(
    emptySettingsActionState,
  );
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showSuccess]);

  const rows = [
    {
      id: "receiveSecurityAlerts",
      title: "Security Alerts",
      description: "Receive login, password, and account security notices.",
      icon: ShieldAlert,
    },
    {
      id: "receiveDailySalesSummary",
      title: "Daily Sales Summary",
      description: "Receive an end-of-day digest of transactions.",
      icon: Bell,
    },
    {
      id: "receiveLowStockAlerts",
      title: "Low Stock Alerts",
      description: "Get notified when ingredients drop below threshold.",
      icon: TriangleAlert,
    },
    {
      id: "receiveStaffOvertimeAlerts",
      title: "Staff Overtime",
      description: "Alerts when staff exceed their scheduled hours.",
      icon: Clock3,
    },
  ] as const;

  return (
    <form
      onSubmit={async (event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        setIsPending(true);

        try {
          const result = await saveTenantNotificationSettings(
            tenantId,
            state,
            formData,
          );
          setState(result);

          if (result.success) {
            setShowSuccess(true);
          }
        } catch (error) {
          setState({
            ...emptySettingsActionState,
            error:
              error instanceof Error
                ? error.message
                : "Unable to save notification settings.",
          });
        } finally {
          setIsPending(false);
        }
      }}
      className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 w-full"
    >
      <div>
        <h2 className="text-xl font-bold text-text-primary mb-1">
          Notification Preferences
        </h2>
        <p className="text-sm text-text-secondary">
          Choose what alerts you want to receive and how.
        </p>
      </div>

      <div className="space-y-6">
        {state.error && (
          <div className="w-full">
            <div className="flex items-center gap-2 w-full text-red-700 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
              <TriangleAlert className="h-4 w-4 shrink-0" />
              <p className="text-sm font-medium">{state.error}</p>
            </div>
          </div>
        )}

        {showSuccess && state.success && (
          <div className="w-full">
            <div className="flex items-center gap-2 w-full text-green-700 bg-green-50 border border-green-100 rounded-xl px-4 py-3">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <p className="text-sm font-medium">{state.success}</p>
            </div>
          </div>
        )}

        <div className="space-y-4">
          <SectionHeader
            title="Email Alerts"
            className="mb-0 py-2 border-gray-100"
          />
          <div className="space-y-3 pt-2">
            {rows.map((row) => {
              const Icon = row.icon;
              const value = formData[row.id];

              return (
                <div
                  key={row.id}
                  className="flex flex-col gap-4 p-5 rounded-2xl border border-black/[0.05] bg-white transition-colors hover:bg-black/[0.01]"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-brand-primary/10 flex items-center justify-center shrink-0 text-brand-accent">
                        <Icon className="w-6 h-6" strokeWidth={1.8} />
                      </div>
                      <div className="flex flex-col gap-0.5 select-none pt-1">
                        <span className="b2 font-bold text-text-primary">
                          {row.title}
                        </span>
                        <span className="b4 text-text-secondary">
                          {row.description}
                        </span>
                      </div>
                    </div>
                    <Toggle
                      variant="accent"
                      isOn={value}
                      onChange={(nextValue) =>
                        setFormData((previous) => ({
                          ...previous,
                          [row.id]: nextValue,
                        }))
                      }
                    />
                  </div>
                  <input type="hidden" name={row.id} value={String(value)} />
                </div>
              );
            })}
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
            Save Preferences
          </Button>
        </div>
      </div>
    </form>
  );
};
