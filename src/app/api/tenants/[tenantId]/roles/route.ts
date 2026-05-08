import { createSupabaseAdminClient } from "@/lib/supabase/admin";

async function requireAdminForTenant(
  admin: any,
  token: string | null,
  tenantId: string,
) {
  if (!token) {
    return { ok: false, status: 401, message: "Missing access token" };
  }

  const { data: userData, error: userErr } = await admin.auth.getUser(token);
  if (userErr || !userData?.user) {
    return { ok: false, status: 401, message: "Invalid access token" };
  }

  const userId = userData.user.id;
  const { data: profile, error: profileErr } = await admin
    .from("profiles")
    .select("role,tenant_id")
    .eq("id", userId)
    .eq("tenant_id", tenantId)
    .single();

  if (profileErr || !profile) {
    return {
      ok: false,
      status: 403,
      message: "Not authorized for this tenant",
    };
  }

  if (!(profile.role === "admin" || profile.role === "super_admin")) {
    return { ok: false, status: 403, message: "Insufficient privileges" };
  }

  return { ok: true, userId };
}

export async function GET(
  req: Request,
  { params }: { params: { tenantId: string } },
) {
  const admin = createSupabaseAdminClient();
  const token = req.headers.get("authorization")?.split(" ")[1] ?? null;

  const auth = await requireAdminForTenant(admin, token, params.tenantId);
  if (!auth.ok)
    return new Response(JSON.stringify({ error: auth.message }), {
      status: auth.status,
    });

  const { data, error } = await admin
    .from("roles")
    .select("*")
    .eq("tenant_id", params.tenantId)
    .order("created_at", { ascending: true });

  if (error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  return new Response(JSON.stringify(data), { status: 200 });
}

export async function POST(
  req: Request,
  { params }: { params: { tenantId: string } },
) {
  const admin = createSupabaseAdminClient();
  const token = req.headers.get("authorization")?.split(" ")[1] ?? null;

  const auth = await requireAdminForTenant(admin, token, params.tenantId);
  if (!auth.ok)
    return new Response(JSON.stringify({ error: auth.message }), {
      status: auth.status,
    });

  let body: any;
  try {
    body = await req.json();
  } catch (e) {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), {
      status: 400,
    });
  }

  const { name, color, permissions } = body;
  if (!name)
    return new Response(JSON.stringify({ error: "Missing 'name'" }), {
      status: 400,
    });

  const payload = {
    tenant_id: params.tenantId,
    name,
    color: color ?? null,
    permissions: permissions ?? {},
  };

  const { data, error } = await admin
    .from("roles")
    .insert(payload)
    .select()
    .single();
  if (error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  return new Response(JSON.stringify(data), { status: 201 });
}
