"use client";

import React from "react";
import { SystemActivity } from "@/components/organisms/SystemActivity";

export default function SystemActivityPage() {
  return (
    <div className="mt-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="h2 text-text-primary">System Activity</h2>
          <p className="b1 text-text-secondary mt-2">
            Monitor all actions and events across your system
          </p>
        </div>
      </div>
      <SystemActivity />
    </div>
  );
}
