"use client";

import React, { useState, useEffect } from "react";
import { SecurityHighlightsCards, SecurityStats } from "@/components/organisms/SecurityHighlightsCards";
import { AuditLogTable } from "@/components/organisms/AuditLogTable";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { useParams } from "next/navigation";

export default function AuditLogsManagement() {
  const params = useParams();
  const tenantId = params?.id as string | undefined;

  const [stats, setStats] = useState<SecurityStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    if (!tenantId) return;

    let cancelled = false;

    async function fetchStats() {
      setStatsLoading(true);
      try {
        const supabase = createSupabaseBrowserClient();
        const { data: sessionData } = await supabase.auth.getSession();
        const token = sessionData?.session?.access_token;
        if (!token) return;

        const res = await fetch(`/api/tenants/${tenantId}/audit-logs/stats`, {
          headers: { Authorization: `Bearer ${token}` },
          cache: "no-store",
        });

        if (!res.ok) return;

        const data: SecurityStats = await res.json();
        if (!cancelled) setStats(data);
      } catch {
        // stats are non-critical; silently fail
      } finally {
        if (!cancelled) setStatsLoading(false);
      }
    }

    fetchStats();
    return () => { cancelled = true; };
  }, [tenantId]);

  return (
    <div className="flex flex-col w-full gap-6 md:gap-8">
      {/* top row: security highlights */}
      <SecurityHighlightsCards stats={stats} isLoading={statsLoading} />

      {/* main content: table */}
      <div className="w-full">
        <AuditLogTable />
      </div>
    </div>
  );
}
