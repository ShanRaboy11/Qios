"use client";

import React from "react";
import { Save } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { Toggle } from "@/components/atoms/Toggle";
import { SectionHeader } from "@/components/molecules/SectionHeader";

export const TenantNotificationSettings = () => {
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
                <h4 className="font-medium text-text-primary">
                  Daily Sales Summary
                </h4>
                <p className="text-sm text-text-secondary">
                  Receive an end-of-day digest of transactions.
                </p>
              </div>
              <Toggle variant="accent" defaultIsOn={true} />
            </div>
            <div className="flex items-center justify-between p-4 rounded-xl border border-gray-100">
              <div>
                <h4 className="font-medium text-text-primary">
                  Low Stock Alerts
                </h4>
                <p className="text-sm text-text-secondary">
                  Get notified when ingredients drop below threshold.
                </p>
              </div>
              <Toggle variant="accent" defaultIsOn={true} />
            </div>
            <div className="flex items-center justify-between p-4 rounded-xl border border-gray-100">
              <div>
                <h4 className="font-medium text-text-primary">
                  Staff Overtime
                </h4>
                <p className="text-sm text-text-secondary">
                  Alerts when staff exceed their scheduled hours.
                </p>
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
