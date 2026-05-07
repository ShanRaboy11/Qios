"use client";

import React from "react";
import { Save } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
import { SectionHeader } from "@/components/molecules/SectionHeader";

export const TenantStoreSettings = () => {
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
              <Input
                defaultValue="Macatual Branch"
                className="py-2.5 rounded-xl"
              />
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
