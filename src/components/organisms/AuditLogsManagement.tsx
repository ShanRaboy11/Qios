"use client";

import React, { useEffect, useState } from "react";
import { SecurityHighlightsCards } from "@/components/organisms/SecurityHighlightsCards";
import { AuditLogTable } from "@/components/organisms/AuditLogTable";

export default function AuditLogsManagement() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setIsLoading(false), 650);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col w-full gap-6 md:gap-8">
      {/* top row: security highlights */}
      <SecurityHighlightsCards isLoading={isLoading} />

      {/* main content: table */}
      <div className="w-full">
        <AuditLogTable isLoading={isLoading} />
      </div>
    </div>
  );
}
