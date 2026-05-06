"use client";

import React from "react";
import SubscriptionManagement from "@/components/organisms/SubscriptionManagement";

export default function SubscriptionPage() {
  return (
    <div className="mt-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="h2 text-text-primary">Subscription and Plans</h2>
          <p className="b1 text-text-secondary mt-2">
            Configure subscription plans and feature access
          </p>
        </div>
      </div>
      <SubscriptionManagement />
    </div>
  );
}
