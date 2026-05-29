import { NextRequest } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

async function requireAdminForTenant(
  admin: any,
  token: string | null,
  tenantId: string,
) {
  if (!token) {
    return { ok: false, status: 401, message: "missing access token" };
  }

  const { data: userData, error: userErr } = await admin.auth.getUser(token);
  if (userErr || !userData?.user) {
    return { ok: false, status: 401, message: "invalid access token" };
  }

  const userId = userData.user.id;

  const { data: profile, error: profileErr } = await admin
    .from("profiles")
    .select("role, tenant_id")
    .eq("id", userId)
    .single();

  if (profileErr || !profile) {
    return {
      ok: false,
      status: 403,
      message: "not authorized for this tenant",
    };
  }

  if (profile.role === "super_admin") {
    return { ok: true, userId };
  }

  if (profile.role === "admin" && profile.tenant_id === tenantId) {
    return { ok: true, userId };
  }

  return { ok: false, status: 403, message: "insufficient privileges" };
}

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ tenantId: string; roleId: string }> },
) {
  const admin = createSupabaseAdminClient();
  const { tenantId, roleId } = await context.params;

  const token = req.headers.get("authorization")?.split(" ")[1] ?? null;

  const auth = await requireAdminForTenant(admin, token, tenantId);
  if (!auth.ok) {
    return new Response(JSON.stringify({ error: auth.message }), {
      status: auth.status,
    });
  }

  const { data: role, error: roleError } = await admin
    .from("roles")
    .select("id, tenant_id")
    .eq("id", roleId)
    .eq("tenant_id", tenantId)
    .maybeSingle();

  if (roleError) {
    return new Response(JSON.stringify({ error: roleError.message }), {
      status: 500,
    });
  }

  if (!role) {
    return new Response(JSON.stringify({ error: "role not found" }), {
      status: 404,
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

  const { name, email, password } = body;
  const normalizedEmail = String(email ?? "")
    .trim()
    .toLowerCase();

  if (!normalizedEmail || !password) {
    return new Response(
      JSON.stringify({ error: "missing required fields: email and password" }),
      {
        status: 400,
      },
    );
  }

  // validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(normalizedEmail)) {
    return new Response(JSON.stringify({ error: "invalid email format" }), {
      status: 400,
    });
  }

  // strict password validation (minimum 8 chars, uppercase, lowercase, digit, special char)
  if (password.length < 8) {
    return new Response(
      JSON.stringify({ error: "Password must be at least 8 characters long" }),
      { status: 400 },
    );
  }
  if (!/[A-Z]/.test(password)) {
    return new Response(
      JSON.stringify({
        error: "Password must contain at least one uppercase letter",
      }),
      { status: 400 },
    );
  }
  if (!/[a-z]/.test(password)) {
    return new Response(
      JSON.stringify({
        error: "Password must contain at least one lowercase letter",
      }),
      { status: 400 },
    );
  }
  if (!/[0-9]/.test(password)) {
    return new Response(
      JSON.stringify({ error: "Password must contain at least one digit" }),
      { status: 400 },
    );
  }
  if (!/[^A-Za-z0-9]/.test(password)) {
    return new Response(
      JSON.stringify({
        error: "Password must contain at least one special character",
      }),
      { status: 400 },
    );
  }

  // create user in supabase auth with email address directly
  const fullName = name
    ? String(name).trim()
    : String(normalizedEmail.split("@")[0]);
  const username = normalizedEmail.split("@")[0];

  const { data: authData, error: authError } =
    await admin.auth.admin.createUser({
      email: normalizedEmail,
      password: password,
      email_confirm: true,
      user_metadata: {
        full_name: fullName,
        tenant_id: tenantId,
        app_role_id: roleId,
        username,
      },
    });

  if (authError) {
    return new Response(JSON.stringify({ error: authError.message }), {
      status: 500,
    });
  }

  const { error: profileError } = await admin.from("profiles").upsert(
    {
      id: authData.user.id,
      full_name: fullName,
      username,
      role: "employee",
      tenant_id: tenantId,
      app_role_id: roleId,
    },
    { onConflict: "id" },
  );

  if (profileError) {
    await admin.auth.admin.deleteUser(authData.user.id);
    return new Response(JSON.stringify({ error: profileError.message }), {
      status: 500,
    });
  }

  const newEmployee = {
    id: authData.user.id,
    name: fullName,
    email: normalizedEmail,
  };

  return new Response(JSON.stringify(newEmployee), { status: 201 });
}
