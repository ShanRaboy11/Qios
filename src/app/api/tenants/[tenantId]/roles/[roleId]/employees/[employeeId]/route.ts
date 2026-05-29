import { NextRequest } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { logEmployeeActivity } from "@/lib/employeeAuditLogger";

import { requireEmployeePermission } from "@/lib/serverPermissions";

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ tenantId: string; roleId: string; employeeId: string }> },
) {
  const admin = createSupabaseAdminClient();
  const { tenantId, roleId, employeeId } = await context.params;

  const token = req.headers.get("authorization")?.split(" ")[1] ?? null;

  const auth = await requireEmployeePermission(tenantId, "Employee Account Management", token);
  if (!auth.ok) {
    return new Response(JSON.stringify({ error: auth.message }), {
      status: auth.status,
    });
  }

  // Fetch the employee's name before deleting so we can include it in the audit log
  const { data: employeeProfile } = await admin
    .from("profiles")
    .select("full_name")
    .eq("id", employeeId)
    .maybeSingle();

  // delete the user from Supabase Auth
  // this will cascade to delete the profile due to ON DELETE CASCADE
  const { error: deleteError } = await admin.auth.admin.deleteUser(employeeId);

  if (deleteError) {
    return new Response(JSON.stringify({ error: deleteError.message }), {
      status: 500,
    });
  }

  // Log the employee removal to employee audit logs
  void logEmployeeActivity({
    tenantId,
    actorId: auth.userId,
    actorName: auth.actorName ?? "Unknown",
    actorRole: auth.actorRole ?? "admin",
    actionType: "DELETE",
    description: `Removed staff member: ${employeeProfile?.full_name ?? employeeId}`,
    targetType: "staff",
    targetId: employeeId,
    targetName: employeeProfile?.full_name ?? undefined,
    metadata: { roleId },
  });

  return new Response(JSON.stringify({ ok: true }), { status: 200 });
}
