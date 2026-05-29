import { NextRequest } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

import { requireEmployeePermission } from "@/lib/serverPermissions";

/* get single role */
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ tenantId: string; roleId: string }> },
) {
  const admin = createSupabaseAdminClient();
  const { tenantId, roleId } = await context.params;

  const token = req.headers.get("authorization")?.split(" ")[1] ?? null;

  const auth = await requireEmployeePermission(tenantId, "Role Management Access", token);
  if (!auth.ok) {
    return new Response(JSON.stringify({ error: auth.message }), {
      status: auth.status,
    });
  }

  const { data, error } = await admin
    .from("roles")
    .select("*")
    .eq("id", roleId)
    .eq("tenant_id", tenantId)
    .single();

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 404,
    });
  }

  return new Response(JSON.stringify(data), { status: 200 });
}

/* update role */
export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ tenantId: string; roleId: string }> },
) {
  const admin = createSupabaseAdminClient();
  const { tenantId, roleId } = await context.params;

  const token = req.headers.get("authorization")?.split(" ")[1] ?? null;

  const auth = await requireEmployeePermission(tenantId, "Role Management Access", token);
  if (!auth.ok) {
    return new Response(JSON.stringify({ error: auth.message }), {
      status: auth.status,
    });
  }

  let body: any;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "invalid json" }), {
      status: 400,
    });
  }

  const update: any = {};
  if (body.name !== undefined) update.name = body.name;
  if (body.color !== undefined) update.color = body.color;
  if (body.permissions !== undefined) update.permissions = body.permissions;

  if (Object.keys(update).length === 0) {
    return new Response(JSON.stringify({ error: "nothing to update" }), {
      status: 400,
    });
  }

  const { data, error } = await admin
    .from("roles")
    .update(update)
    .eq("id", roleId)
    .eq("tenant_id", tenantId)
    .select()
    .single();

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }

  return new Response(JSON.stringify(data), { status: 200 });
}

/* delete role */
export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ tenantId: string; roleId: string }> },
) {
  const admin = createSupabaseAdminClient();
  const { tenantId, roleId } = await context.params;

  const token = req.headers.get("authorization")?.split(" ")[1] ?? null;

  const auth = await requireEmployeePermission(tenantId, "Role Management Access", token);
  if (!auth.ok) {
    return new Response(JSON.stringify({ error: auth.message }), {
      status: auth.status,
    });
  }

  const { error } = await admin
    .from("roles")
    .delete()
    .eq("id", roleId)
    .eq("tenant_id", tenantId);

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }

  return new Response(null, { status: 204 });
}
