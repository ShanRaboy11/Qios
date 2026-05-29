import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { logEmployeeActivity, EmployeeAuditActionType, EmployeeAuditTargetType } from "@/lib/employeeAuditLogger";

interface LogAuditRequest {
  actionType: EmployeeAuditActionType;
  description: string;
  targetType?: EmployeeAuditTargetType;
  targetId?: string;
  targetName?: string;
  metadata?: Record<string, unknown>;
}

/**
 * POST /api/tenants/[tenantId]/audit-logs/log
 *
 * Generic client-callable endpoint for writing to employee_audit_logs.
 * Used by client-side hooks (useMenuManagement, useInventoryManagement) that
 * write directly to Supabase and therefore cannot call logEmployeeActivity()
 * server-side. Verifies the caller's JWT and tenant membership before logging.
 */
export async function POST(
  req: NextRequest,
  context: { params: Promise<{ tenantId: string }> },
) {
  const { tenantId } = await context.params;
  const admin = createSupabaseAdminClient();

  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return NextResponse.json({ error: "missing access token" }, { status: 401 });
  }

  const token = authHeader.slice(7);
  const { data: userData, error: userErr } = await admin.auth.getUser(token);
  if (userErr || !userData?.user) {
    return NextResponse.json({ error: "invalid access token" }, { status: 401 });
  }

  const userId = userData.user.id;

  const { data: profile, error: profileErr } = await admin
    .from("profiles")
    .select("full_name, role, tenant_id")
    .eq("id", userId)
    .single();

  if (profileErr || !profile) {
    return NextResponse.json({ error: "profile not found" }, { status: 403 });
  }

  // Enforce tenant membership (super_admin can log for any tenant)
  if (profile.role !== "super_admin" && profile.tenant_id !== tenantId) {
    return NextResponse.json({ error: "tenant mismatch" }, { status: 403 });
  }

  let body: LogAuditRequest;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  const { actionType, description, targetType, targetId, targetName, metadata } = body;

  if (!actionType || !description) {
    return NextResponse.json(
      { error: "missing required fields: actionType, description" },
      { status: 400 },
    );
  }

  await logEmployeeActivity({
    tenantId,
    actorId: userId,
    actorName: profile.full_name ?? "Unknown",
    actorRole: profile.role as string,
    actionType,
    description,
    targetType,
    targetId,
    targetName,
    metadata,
  });

  return NextResponse.json({ ok: true }, { status: 200 });
}
