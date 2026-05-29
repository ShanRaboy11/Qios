"use client";

import React, { useEffect, useState } from "react";
import {
  User,
  Store,
  Shield,
  Bell,
  CreditCard,
  AlertTriangle,
  Save,
  Laptop,
  Smartphone,
  LogOut,
  Trash2,
  Palette,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { TenantProfileSettings } from "./TenantProfileSettings";
import { TenantStoreSettings } from "./TenantStoreSettings";
import { TenantBrandingSettings } from "./TenantBrandingSettings";
import { TenantSecuritySettings } from "./TenantSecuritySettings";
import { TenantNotificationSettings } from "./TenantNotificationSettings";
import { TenantBillingSettings } from "./TenantBillingSettings";
import { TenantDangerZone } from "./TenantDangerZone";
import type { TenantSettingsPageData } from "@/app/(tenant)/[id]/settings/types";

type SettingsTab =
  | "profile"
  | "store"
  | "branding"
  | "security"
  | "notifications"
  | "billing"
  | "danger";

interface TenantSettingsProps {
  tenantId: string;
  initialData: TenantSettingsPageData;
  initialTab?: SettingsTab;
  scrollToQrSection?: boolean;
}

export const TenantSettings = ({
  tenantId,
  initialData,
  initialTab = "profile",
  scrollToQrSection = false,
}: TenantSettingsProps) => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<SettingsTab>(initialTab);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  const handleRestartTutorial = () => {
    // Redirects to dashboard and triggers the interactive tour automatically
    router.push(`/${tenantId}/dashboard?startTutorial=true`);
  };

  const tabs = [
    { id: "profile", label: "Profile Settings", icon: User },
    { id: "store", label: "Store Details", icon: Store },
    { id: "branding", label: "Branding & Appearance", icon: Palette },
    { id: "security", label: "Security", icon: Shield },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "billing", label: "Subscription & Billing", icon: CreditCard },
    { id: "danger", label: "Danger Zone", icon: AlertTriangle },
  ] as const;

  return (
    <div className="flex flex-col md:flex-row gap-6 md:gap-8 min-h-[600px] w-full">
      {/* sidebar */}
      <div className="w-full md:w-64 flex-shrink-0 flex flex-col gap-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          const isDanger = tab.id === "danger";

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as SettingsTab)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-left group",
                isActive
                  ? isDanger
                    ? "bg-red-500 text-white shadow-md shadow-red-500/20"
                    : "bg-brand-accent text-white shadow-md shadow-brand-accent/20"
                  : isDanger
                    ? "bg-white text-red-500 hover:bg-red-50 border border-gray-100"
                    : "bg-white text-text-primary hover:bg-gray-50 hover:text-brand-accent border border-gray-100",
              )}
            >
              <Icon
                size={20}
                className={cn(
                  "flex-shrink-0 transition-colors",
                  isActive
                    ? "text-white"
                    : isDanger
                      ? "text-red-500 group-hover:text-red-600"
                      : "text-text-secondary group-hover:text-brand-accent",
                )}
              />
              <span className="font-medium text-[15px]">{tab.label}</span>
            </button>
          );
        })}

        <div className="h-px bg-gray-100 my-2" />

        <button
          onClick={handleRestartTutorial}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-brand-accent/5 to-amber-500/5 border border-brand-accent/20 text-brand-accent hover:from-brand-accent/10 hover:to-amber-500/10 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 text-left group shadow-sm shadow-brand-accent/5"
        >
          <Sparkles
            size={20}
            className="flex-shrink-0 text-brand-accent animate-pulse"
          />
          <span className="font-bold text-[15px]">Restart Portal Tour</span>
        </button>
      </div>

      {/* content area */}
      <div className="flex-1 bg-white rounded-[24px] shadow-sm border border-gray-100 p-6 md:p-8 w-full">
        <AnimatePresence mode="wait">
          {activeTab === "profile" && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <TenantProfileSettings
                tenantId={tenantId}
                initialData={initialData.profile}
              />
            </motion.div>
          )}
          {activeTab === "store" && (
            <motion.div
              key="store"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <TenantStoreSettings
                tenantId={tenantId}
                initialData={initialData.store}
                brandingData={initialData.branding}
                scrollToQrSection={scrollToQrSection}
              />
            </motion.div>
          )}
          {activeTab === "branding" && (
            <motion.div
              key="branding"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <TenantBrandingSettings
                tenantId={tenantId}
                initialData={initialData.branding}
              />
            </motion.div>
          )}
          {activeTab === "security" && (
            <motion.div
              key="security"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <TenantSecuritySettings
                tenantId={tenantId}
                initialData={initialData.security}
              />
            </motion.div>
          )}
          {activeTab === "notifications" && (
            <motion.div
              key="notifications"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <TenantNotificationSettings
                tenantId={tenantId}
                initialData={initialData.notifications}
              />
            </motion.div>
          )}
          {activeTab === "billing" && (
            <motion.div
              key="billing"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <TenantBillingSettings
                tenantId={tenantId}
                initialData={initialData.billing}
              />
            </motion.div>
          )}
          {activeTab === "danger" && (
            <motion.div
              key="danger"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <TenantDangerZone
                tenantId={tenantId}
                isDeactivated={initialData.isDeactivated}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
