"use client";

import React from "react";
import AuditLogsManagement from "@/components/organisms/AuditLogsManagement";

export default function AuditLogsPage() {
  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <div>
          <h2 className="h2 text-text-primary">Audit Logs</h2>
          <p className="b1 text-text-secondary mt-2">
            Review detailed system events and security logs
          </p>
        </div>
      </div>
      <AuditLogsManagement />
    </>
  );
}
