"use client";

import React from "react";
import { SecurityHighlightsCards } from "@/components/organisms/SecurityHighlightsCards";
import { AuditLogTable } from "@/components/organisms/AuditLogTable";

export default function AuditLogsManagement() {
  return (
    <div className="flex flex-col w-full gap-6 md:gap-8">
      {/* top row: security highlights */}
      <SecurityHighlightsCards />

      {/* main content: table */}
      <div className="w-full">
        <AuditLogTable />
      </div>
    </div>
  );
}
