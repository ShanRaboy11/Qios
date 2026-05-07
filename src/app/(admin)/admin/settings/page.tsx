"use client";

import React from "react";
import { AdminSettings } from "@/components/organisms/AdminSettings";

export default function SettingsPage() {
  return (
    <div className="mt-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="h2 text-text-primary">Settings</h2>
          <p className="b1 text-text-secondary mt-2">
            Configure system preferences and administrator settings
          </p>
        </div>
      </div>
      <AdminSettings />
    </div>
  );
}
