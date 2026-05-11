"use client";

import React from "react";
import { TenantSettings } from "@/components/organisms/TenantSettings";

export default function SettingsPage() {
  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="h2 text-text-primary">Account Settings</h2>
          <p className="b1 text-text-secondary mt-2">
            Manage your store details, branding, security, and notifications
          </p>
        </div>
      </div>
      <TenantSettings />
    </>
  );
}

{/* backend huhu */}