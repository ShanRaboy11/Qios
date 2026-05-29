import { NextRequest } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

import { requireEmployeePermission } from "@/lib/serverPermissions";

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ tenantId: string; roleId: string; employeeId: string }> },
) {
  const admin = createSupabaseAdminClient();
  const { tenantId, employeeId } = await context.params;

  const token = req.headers.get("authorization")?.split(" ")[1] ?? null;

  const auth = await requireEmployeePermission(tenantId, "Employee Account Management", token);
  if (!auth.ok) {
    return new Response(JSON.stringify({ error: auth.message }), {
      status: auth.status,
    });
  }

  // delete the user from Supabase Auth
  // this will cascade to delete the profile due to ON DELETE CASCADE
  const { error: deleteError } = await admin.auth.admin.deleteUser(employeeId);

  if (deleteError) {
    return new Response(JSON.stringify({ error: deleteError.message }), {
      status: 500,
    });
  }

  return new Response(JSON.stringify({ ok: true }), { status: 200 });
}
