import { NextRequest } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

// ---------------------------------------------------------------------------
// GET /api/tenants/[tenantId]/audit-logs/stats
// ---------------------------------------------------------------------------
// Returns a security summary for the SecurityHighlightsCards component.
// Response:
//   {
//     totalActions24h: number,   // all log entries in last 24 h
//     criticalActions:  number,  // DELETE + REFUND entries in last 24 h
//     failedLogins:     number,  // LOGIN entries with metadata.success = false in last 24 h
//     securityAlerts:   number,  // entries with metadata.security_alert = true in last 24 h
//   }
// ---------------------------------------------------------------------------
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ tenantId: string }> },
) {
  const admin = createSupabaseAdminClient();
  const { tenantId } = await context.params;

  const token = req.headers.get("authorization")?.split(" ")[1] ?? null;

  if (!token) {
    return Response.json({ error: "missing access token" }, { status: 401 });
  }

  const { data: userData, error: userErr } = await admin.auth.getUser(token);
  if (userErr || !userData?.user) {
    return Response.json({ error: "invalid access token" }, { status: 401 });
  }

  const { data: profile, error: profileErr } = await admin
    .from("profiles")
    .select("role, tenant_id")
    .eq("id", userData.user.id)
    .single();

  if (profileErr || !profile) {
    return Response.json({ error: "profile not found" }, { status: 403 });
  }

  const isSuperAdmin = profile.role === "super_admin";
  const isAdmin = profile.role === "admin" && profile.tenant_id === tenantId;

  if (!isSuperAdmin && !isAdmin) {
    return Response.json({ error: "insufficient privileges" }, { status: 403 });
  }

  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

  // Run all four counts in parallel
  const [totalResult, criticalResult, failedLoginsResult, alertsResult] =
    await Promise.all([
      // Total actions in last 24 h
      admin
        .from("employee_audit_logs")
        .select("id", { count: "exact", head: true })
        .eq("tenant_id", tenantId)
        .gte("created_at", since),

      // Critical: DELETE or REFUND in last 24 h
      admin
        .from("employee_audit_logs")
        .select("id", { count: "exact", head: true })
        .eq("tenant_id", tenantId)
        .in("action_type", ["DELETE", "REFUND"])
        .gte("created_at", since),

      // Failed logins: LOGIN entries with metadata->>'success' = 'false'
      admin
        .from("employee_audit_logs")
        .select("id", { count: "exact", head: true })
        .eq("tenant_id", tenantId)
        .eq("action_type", "LOGIN")
        .eq("target_type", "auth")
        .gte("created_at", since)
        .contains("metadata", { success: false }),

      // Security alerts: entries with metadata->>'security_alert' = true
      admin
        .from("employee_audit_logs")
        .select("id", { count: "exact", head: true })
        .eq("tenant_id", tenantId)
        .gte("created_at", since)
        .contains("metadata", { security_alert: true }),
    ]);

  return Response.json({
    totalActions24h: totalResult.count ?? 0,
    criticalActions: criticalResult.count ?? 0,
    failedLogins: failedLoginsResult.count ?? 0,
    securityAlerts: alertsResult.count ?? 0,
  });
}
