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
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
import { Toggle } from "@/components/atoms/Toggle";
import { SectionHeader } from "@/components/molecules/SectionHeader";
import { SessionCard } from "@/components/molecules/SessionCard";

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
        {activeTab === "profile" && <ProfileSettings />}
        {activeTab === "store" && <StoreDetailsSettings />}
        {activeTab === "security" && <SecuritySettings />}
        {activeTab === "notifications" && <NotificationSettings />}
        {activeTab === "billing" && <BillingSettings />}
        {activeTab === "danger" && <DangerZone />}
      </div>
    </div>
  );
};

const ProfileSettings = () => {
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
          <div className="flex flex-col sm:flex-row gap-6 pt-2">
            <div className="flex flex-col items-center gap-3 flex-shrink-0">
              <div className="w-24 h-24 rounded-full bg-brand-primary flex items-center justify-center text-white text-3xl font-bold border-4 border-white shadow-md overflow-hidden relative group">
                M
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
                  <Input defaultValue="Manager" className="py-2.5 rounded-xl" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-text-primary">
                    Last Name
                  </label>
                  <Input defaultValue="Doe" className="py-2.5 rounded-xl" />
                </div>
              </div>
              <div className="space-y-1.5">
                  <label className="text-sm font-medium text-text-primary">
                    Email Address
                  </label>
                  <Input
                    defaultValue="manager@macatual.com"
                    type="email"
                    className="py-2.5 rounded-xl"
                  />
              </div>
              <div className="space-y-1.5">
                  <label className="text-sm font-medium text-text-primary">
                    Phone Number
                  </label>
                  <Input
                    defaultValue="+63 912 345 6789"
                    type="tel"
                    className="py-2.5 rounded-xl"
                  />
              </div>
            </div>
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <Button
            variant="accent"
            shape="rounded"
            leftIcon={<Save size={18} />}
          >
            Save Profile
          </Button>
        </div>
      </div>
    </div>
  );
};

const StoreDetailsSettings = () => {
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-sm font-medium text-text-primary">
                Store Name (Trading Name)
              </label>
              <Input defaultValue="Macatual Branch" className="py-2.5 rounded-xl" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-text-primary">
                Public Contact Email
              </label>
              <Input
                defaultValue="contact@macatual.com"
                type="email"
                className="py-2.5 rounded-xl"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-text-primary">
                Public Phone Number
              </label>
              <Input
                defaultValue="+63 2 8123 4567"
                type="tel"
                className="py-2.5 rounded-xl"
              />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-sm font-medium text-text-primary">
                Physical Address
              </label>
              <Input
                defaultValue="123 Macatual Street, Metro Manila, Philippines"
                className="py-2.5 rounded-xl"
              />
            </div>
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
              <select className="w-full px-4 py-2.5 rounded-xl border-2 border-[#E5E5E5] focus:outline-none focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-accent transition-colors bg-white appearance-none cursor-pointer">
                <option value="PHP">PHP (₱)</option>
                <option value="USD">USD ($)</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-text-primary">
                Timezone
              </label>
              <select className="w-full px-4 py-2.5 rounded-xl border-2 border-[#E5E5E5] focus:outline-none focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-accent transition-colors bg-white appearance-none cursor-pointer">
                <option value="Asia/Manila">Asia/Manila (GMT+8)</option>
                <option value="UTC">UTC</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-text-primary">
                Tax Rate (%)
              </label>
              <Input
                defaultValue="12"
                type="number"
                className="py-2.5 rounded-xl"
              />
            </div>
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <Button
            variant="accent"
            shape="rounded"
            leftIcon={<Save size={18} />}
          >
            Save Store Details
          </Button>
        </div>
      </div>
    </div>
  );
};

const SecuritySettings = () => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 w-full">
      <div>
        <h2 className="text-xl font-bold text-text-primary mb-1">
          Security Settings
        </h2>
        <p className="text-sm text-text-secondary">
          Protect your account and manage active sessions.
        </p>
      </div>

      <div className="space-y-6">
        <div className="space-y-4">
          <SectionHeader
            title="Password Management"
            className="mb-0 py-2 border-gray-100"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-sm font-medium text-text-primary">
                Current Password
              </label>
              <Input type="password" placeholder="••••••••" className="py-2.5 rounded-xl" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-text-primary">
                New Password
              </label>
              <Input type="password" placeholder="New Password" className="py-2.5 rounded-xl" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-text-primary">
                Confirm New Password
              </label>
              <Input type="password" placeholder="Confirm Password" className="py-2.5 rounded-xl" />
            </div>
            <div className="sm:col-span-2 flex justify-end mt-2">
               <Button variant="outline" shape="rounded">Update Password</Button>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <SectionHeader
            title="Two-Factor Authentication"
            className="mb-0 py-2 border-gray-100"
          />
          <div className="flex items-center justify-between p-4 mt-2 rounded-xl border border-gray-100">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-brand-accent" />
                </div>
                <div>
                  <h4 className="font-medium text-text-primary">
                    Require 2FA for Login
                  </h4>
                  <p className="text-sm text-text-secondary hidden sm:block">
                    Add an extra layer of security using an authenticator app.
                  </p>
                </div>
              </div>
              <Toggle variant="accent" defaultIsOn={false} />
          </div>
        </div>

        <div className="space-y-4 pt-2">
          <SectionHeader
            title="Active Sessions"
            className="mb-0 py-2 border-gray-100"
          />
          <div className="space-y-3 pt-2">
            <SessionCard
              device="Windows 11 • Chrome"
              location="Manila, PH"
              status="Current Session"
              icon={<Laptop className="w-8 h-8" strokeWidth={1.5} />}
              isActive={true}
            />
            <SessionCard
              device="iOS 17 • Safari"
              location="Manila, PH"
              status="Last active 2 hours ago"
              icon={<Smartphone className="w-8 h-8" strokeWidth={1.5} />}
              isActive={false}
            />
          </div>
          <div className="flex justify-end mt-4">
             <Button variant="outline" className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600">
               Log Out All Other Sessions
             </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const NotificationSettings = () => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 w-full">
      <div>
        <h2 className="text-xl font-bold text-text-primary mb-1">
          Notification Preferences
        </h2>
        <p className="text-sm text-text-secondary">
          Choose what alerts you want to receive and how.
        </p>
      </div>

      <div className="space-y-6">
        <div className="space-y-4">
          <SectionHeader
            title="Email Alerts"
            className="mb-0 py-2 border-gray-100"
          />
          <div className="space-y-3 pt-2">
             <div className="flex items-center justify-between p-4 rounded-xl border border-gray-100">
                <div>
                  <h4 className="font-medium text-text-primary">Daily Sales Summary</h4>
                  <p className="text-sm text-text-secondary">Receive an end-of-day digest of transactions.</p>
                </div>
                <Toggle variant="accent" defaultIsOn={true} />
             </div>
             <div className="flex items-center justify-between p-4 rounded-xl border border-gray-100">
                <div>
                  <h4 className="font-medium text-text-primary">Low Stock Alerts</h4>
                  <p className="text-sm text-text-secondary">Get notified when ingredients drop below threshold.</p>
                </div>
                <Toggle variant="accent" defaultIsOn={true} />
             </div>
             <div className="flex items-center justify-between p-4 rounded-xl border border-gray-100">
                <div>
                  <h4 className="font-medium text-text-primary">Staff Overtime</h4>
                  <p className="text-sm text-text-secondary">Alerts when staff exceed their scheduled hours.</p>
                </div>
                <Toggle variant="accent" defaultIsOn={false} />
             </div>
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <Button
            variant="accent"
            shape="rounded"
            leftIcon={<Save size={18} />}
          >
            Save Preferences
          </Button>
        </div>
      </div>
    </div>
  );
};

const BillingSettings = () => {
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

      <div className="space-y-6">
        <div className="p-6 rounded-xl border border-brand-accent bg-brand-accent/5">
           <div className="flex items-start justify-between">
              <div>
                 <span className="inline-block px-2.5 py-1 bg-brand-accent text-white text-xs font-bold rounded-full mb-2">
                    PRO PLAN
                 </span>
                 <h3 className="text-xl font-bold text-text-primary">₱2,500 <span className="text-sm text-text-secondary font-normal">/ month</span></h3>
                 <p className="text-sm text-text-secondary mt-1">Next billing date: June 1, 2026</p>
              </div>
              <Button variant="outline" className="border-brand-accent text-brand-accent hover:bg-brand-accent/10">
                 Change Plan
              </Button>
           </div>
        </div>

        <div className="space-y-4">
          <SectionHeader
            title="Payment Method"
            className="mb-0 py-2 border-gray-100"
          />
          <div className="flex items-center justify-between p-4 rounded-xl border border-gray-100">
             <div className="flex items-center gap-4">
                <div className="w-12 h-8 bg-gray-100 rounded flex items-center justify-center border border-gray-200">
                   <CreditCard size={20} className="text-gray-500"/>
                </div>
                <div>
                   <h4 className="font-medium text-text-primary">Visa ending in 4242</h4>
                   <p className="text-sm text-text-secondary">Expires 12/28</p>
                </div>
             </div>
             <Button variant="ghost" className="text-brand-accent">Edit</Button>
          </div>
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
                      <th className="py-3 px-4 text-xs font-medium text-text-secondary">Date</th>
                      <th className="py-3 px-4 text-xs font-medium text-text-secondary">Amount</th>
                      <th className="py-3 px-4 text-xs font-medium text-text-secondary">Status</th>
                      <th className="py-3 px-4 text-xs font-medium text-text-secondary text-right">Invoice</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                   <tr>
                      <td className="py-3 px-4 text-sm">May 1, 2026</td>
                      <td className="py-3 px-4 text-sm font-medium">₱2,500</td>
                      <td className="py-3 px-4 text-sm"><span className="text-green-600 bg-green-50 px-2 py-1 rounded-full text-xs">Paid</span></td>
                      <td className="py-3 px-4 text-sm text-right"><button className="text-brand-accent hover:underline">Download</button></td>
                   </tr>
                   <tr>
                      <td className="py-3 px-4 text-sm">Apr 1, 2026</td>
                      <td className="py-3 px-4 text-sm font-medium">₱2,500</td>
                      <td className="py-3 px-4 text-sm"><span className="text-green-600 bg-green-50 px-2 py-1 rounded-full text-xs">Paid</span></td>
                      <td className="py-3 px-4 text-sm text-right"><button className="text-brand-accent hover:underline">Download</button></td>
                   </tr>
                </tbody>
             </table>
          </div>
        </div>
      </div>
    </div>
  );
};

const DangerZone = () => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 w-full">
      <div>
        <h2 className="text-xl font-bold text-red-600 mb-1">
          Danger Zone
        </h2>
        <p className="text-sm text-text-secondary">
          Irreversible and destructive actions for your tenant account.
        </p>
      </div>

      <div className="space-y-6">
        <div className="p-5 rounded-xl border border-orange-200 bg-orange-50 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
           <div>
              <h4 className="font-bold text-orange-900">Deactivate Store</h4>
              <p className="text-sm text-orange-700 mt-1 max-w-md">
                 Temporarily hide your store from customer-facing interfaces like Kiosks and QR Menus. You can reactivate anytime.
              </p>
           </div>
           <Button className="bg-orange-500 hover:bg-orange-600 text-white flex-shrink-0 whitespace-nowrap">
              Deactivate
           </Button>
        </div>

        <div className="p-5 rounded-xl border border-red-200 bg-red-50 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
           <div>
              <h4 className="font-bold text-red-900">Delete Account & Store Data</h4>
              <p className="text-sm text-red-700 mt-1 max-w-md">
                 Permanently remove your account, store details, inventory, and transaction history. This action cannot be undone.
              </p>
           </div>
           <Button className="bg-red-600 hover:bg-red-700 text-white flex-shrink-0 whitespace-nowrap" leftIcon={<Trash2 size={16}/>}>
              Delete Account
           </Button>
        </div>
      </div>
    </div>
  );
};
