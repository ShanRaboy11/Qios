import { NextRequest } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

/**
 * Shared helper: verify the caller is an admin (or super_admin) for this tenant.
 * Returns { ok: true, userId, actorName, actorRole } on success, or an error descriptor.
 */
async function requireAdminForTenant(
  admin: ReturnType<typeof createSupabaseAdminClient>,
  token: string | null,
  tenantId: string,
): Promise<
  | { ok: true; userId: string; actorName: string; actorRole: string }
  | { ok: false; status: number; message: string }
> {
  if (!token) {
    return { ok: false, status: 401, message: "missing access token" };
  }

  const { data: userData, error: userErr } =
    await admin.auth.getUser(token);
  if (userErr || !userData?.user) {
    return { ok: false, status: 401, message: "invalid access token" };
  }

  const userId = userData.user.id;

  const { data: profile, error: profileErr } = await admin
    .from("profiles")
    .select("role, tenant_id, full_name, app_role_id")
    .eq("id", userId)
    .single();

  if (profileErr || !profile) {
    return { ok: false, status: 403, message: "profile not found" };
  }

  if (profile.role === "super_admin") {
    return {
      ok: true,
      userId,
      actorName: profile.full_name,
      actorRole: "Super Admin",
    };
  }

  if (profile.role === "admin" && profile.tenant_id === tenantId) {
    return {
      ok: true,
      userId,
      actorName: profile.full_name,
      actorRole: "Admin",
    };
  }

  return { ok: false, status: 403, message: "insufficient privileges" };
}

// ---------------------------------------------------------------------------
// GET /api/tenants/[tenantId]/audit-logs
// ---------------------------------------------------------------------------
// Query params:
//   page        — page number, default 1
//   limit       — results per page, default 20, max 100
//   search      — matches actor_name or description (case-insensitive)
//   action_type — CREATE | UPDATE | DELETE | LOGIN | LOGOUT | REFUND | SYSTEM
//   target_type — staff | role | menu | order | auth | inventory | settings | system
//   date_from   — ISO-8601 date string (inclusive lower bound)
//   date_to     — ISO-8601 date string (inclusive upper bound)
// ---------------------------------------------------------------------------
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ tenantId: string }> },
) {
  const admin = createSupabaseAdminClient();
  const { tenantId } = await context.params;

  const token = req.headers.get("authorization")?.split(" ")[1] ?? null;
  const auth = await requireAdminForTenant(admin, token, tenantId);
  if (!auth.ok) {
    return Response.json({ error: auth.message }, { status: auth.status });
  }

  const { searchParams } = req.nextUrl;
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
  const limit = Math.min(
    100,
    Math.max(1, parseInt(searchParams.get("limit") ?? "20", 10)),
  );
  const search = searchParams.get("search")?.trim() ?? "";
  const actionType = searchParams.get("action_type") ?? "";
  const targetType = searchParams.get("target_type") ?? "";
  const dateFrom = searchParams.get("date_from") ?? "";
  const dateTo = searchParams.get("date_to") ?? "";

  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = admin
    .from("employee_audit_logs")
    .select("*", { count: "exact" })
    .eq("tenant_id", tenantId)
    .order("created_at", { ascending: false })
    .range(from, to);

  if (search) {
    query = query.or(
      `actor_name.ilike.%${search}%,description.ilike.%${search}%,target_name.ilike.%${search}%`,
    );
  }

  if (actionType) {
    query = query.eq("action_type", actionType);
  }

  if (targetType) {
    query = query.eq("target_type", targetType);
  }

  if (dateFrom) {
    query = query.gte("created_at", new Date(dateFrom).toISOString());
  }

  if (dateTo) {
    // Include the whole end day
    const end = new Date(dateTo);
    end.setDate(end.getDate() + 1);
    query = query.lt("created_at", end.toISOString());
  }

  const { data, error, count } = await query;

  if (error) {
    console.error("[audit-logs] DB error:", error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({
    data: data ?? [],
    total: count ?? 0,
    page,
    limit,
  });
}
