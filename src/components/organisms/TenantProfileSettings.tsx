"use client";

import React from "react";
import { Upload, Save } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
import { SectionHeader } from "@/components/molecules/SectionHeader";

export const TenantProfileSettings = () => {
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
