import { NextRequest } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

import { requireEmployeePermission } from "@/lib/serverPermissions";

/* get roles */
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ tenantId: string }> },
) {
  const admin = createSupabaseAdminClient();
  const { tenantId } = await context.params;

  const token = req.headers.get("authorization")?.split(" ")[1] ?? null;

  const auth = await requireEmployeePermission(tenantId, "Role Management Access", token);
  if (!auth.ok) {
    return new Response(JSON.stringify({ error: auth.message }), {
      status: auth.status,
    });
  }

  const { data, error } = await admin
    .from("roles")
    .select(`
      *,
      profiles!app_role_id (
        id,
        full_name
      )
    `)
    .eq("tenant_id", tenantId)
    .order("created_at", { ascending: true });

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }

  // resolve emails for profile ids via supabase admin auth api
  const profileIds = data.flatMap((r: any) => (r.profiles || []).map((p: any) => p.id));
  const uniqueProfileIds = Array.from(new Set(profileIds));
  const usersById: Record<string, any> = {};

  if (uniqueProfileIds.length > 0) {
    const userFetches = await Promise.all(
      uniqueProfileIds.map((id: string) =>
        // use admin.auth.admin.getUserById to fetch the auth user (contains email)
        // guard against individual failures so one bad user doesn't break the whole response
        admin.auth.admin.getUserById(id).then((res: any) => res).catch(() => ({ data: { user: null } })),
      ),
    );

    userFetches.forEach((res: any) => {
      if (res && res.data && res.data.user) {
        usersById[res.data.user.id] = res.data.user;
      }
    });
  }

  const formattedData = data.map((r: any) => ({
    ...r,
    employees:
      r.profiles?.map((p: any) => ({
        id: p.id,
        name: p.full_name,
        email: usersById[p.id]?.email ?? "",
      })) || [],
    profiles: undefined,
  }));

  return new Response(JSON.stringify(formattedData), { status: 200 });
}

/* create role */
export async function POST(
  req: NextRequest,
  context: { params: Promise<{ tenantId: string }> },
) {
  const admin = createSupabaseAdminClient();
  const { tenantId } = await context.params;

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

  const { name, color, permissions } = body;

  if (!name) {
    return new Response(JSON.stringify({ error: "missing name" }), {
      status: 400,
    });
  }

  const payload = {
    tenant_id: tenantId,
    name,
    color: color ?? null,
    permissions: permissions ?? {},
  };

  const { data, error } = await admin
    .from("roles")
    .insert(payload)
    .select()
    .single();

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }

  return new Response(JSON.stringify(data), { status: 201 });
}
