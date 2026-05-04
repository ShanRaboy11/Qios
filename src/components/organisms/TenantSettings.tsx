"use client";

import React, { useState } from "react";
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
  Upload,
  LogOut,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { TenantProfileSettings } from "./TenantProfileSettings";
import { TenantStoreSettings } from "./TenantStoreSettings";
import { TenantSecuritySettings } from "./TenantSecuritySettings";
import { TenantNotificationSettings } from "./TenantNotificationSettings";
import { TenantBillingSettings } from "./TenantBillingSettings";
import { TenantDangerZone } from "./TenantDangerZone";

type SettingsTab =
  | "profile"
  | "store"
  | "security"
  | "notifications"
  | "billing"
  | "danger";

export const TenantSettings = () => {
  const [activeTab, setActiveTab] = useState<SettingsTab>("profile");

  const tabs = [
    { id: "profile", label: "Profile Settings", icon: User },
    { id: "store", label: "Store Details", icon: Store },
    { id: "security", label: "Security", icon: Shield },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "billing", label: "Subscription & Billing", icon: CreditCard },
    { id: "danger", label: "Danger Zone", icon: AlertTriangle },
  ] as const;

  return (
    <div className="flex flex-col md:flex-row gap-6 md:gap-8 min-h-[600px] w-full">
      {/* Sidebar */}
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
                  : "bg-white text-text-primary hover:bg-gray-50 hover:text-brand-accent border border-gray-100"
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
                    : "text-text-secondary group-hover:text-brand-accent"
                )}
              />
              <span className="font-medium text-[15px]">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Content Area */}
      <div className="flex-1 bg-white rounded-[24px] shadow-sm border border-gray-100 p-6 md:p-8 overflow-hidden w-full">
        {activeTab === "profile" && <TenantProfileSettings />}
        {activeTab === "store" && <TenantStoreSettings />}
        {activeTab === "security" && <TenantSecuritySettings />}
        {activeTab === "notifications" && <TenantNotificationSettings />}
        {activeTab === "billing" && <TenantBillingSettings />}
        {activeTab === "danger" && <TenantDangerZone />}
      </div>
    </div>
  );
};
