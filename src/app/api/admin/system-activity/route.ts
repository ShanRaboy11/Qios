import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

// ---------------------------------------------------------------------------
// auth helper – verifies the bearer token and requires super_admin role
// ---------------------------------------------------------------------------
async function requireSuperAdmin(
  admin: ReturnType<typeof createSupabaseAdminClient>,
  token: string | null,
): Promise<
  { ok: true; userId: string } | { ok: false; status: number; message: string }
> {
  if (!token) {
    return { ok: false, status: 401, message: "Missing access token" };
  }

  const { data: userData, error: userErr } = await admin.auth.getUser(token);
  if (userErr || !userData?.user) {
    return { ok: false, status: 401, message: "Invalid access token" };
  }

  const { data: profile, error: profileErr } = await admin
    .from("profiles")
    .select("role")
    .eq("id", userData.user.id)
    .single();

  if (profileErr || !profile) {
    return { ok: false, status: 403, message: "Profile not found" };
  }

  if (profile.role !== "super_admin") {
    return { ok: false, status: 403, message: "Requires super_admin role" };
  }

  return { ok: true, userId: userData.user.id };
}

// ---------------------------------------------------------------------------
// gET /api/admin/system-activity
//
// query params:
//   search  – free-text on actor_name, description, target_tenant_name
//   role    – exact actor_role ("All Roles" = no filter)
//   date    – ISO date "YYYY-MM-DD" to filter to that calendar day (UTC)
//   page    – 1-based (default 1)
//   limit   – rows per page (default 20, max 100)
// ---------------------------------------------------------------------------
export async function GET(req: NextRequest) {
  const admin = createSupabaseAdminClient();
  const token = req.headers.get("authorization")?.split(" ")[1] ?? null;

  const auth = await requireSuperAdmin(admin, token);
  if (!auth.ok) {
    return NextResponse.json({ error: auth.message }, { status: auth.status });
  }

  const { searchParams } = req.nextUrl;
  const search = searchParams.get("search")?.trim() ?? "";
  const role = searchParams.get("role")?.trim() ?? "";
  const date = searchParams.get("date")?.trim() ?? "";
  const hasExplicitPaging =
    searchParams.has("page") || searchParams.has("limit");
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
  const limit = Math.min(
    100,
    Math.max(1, parseInt(searchParams.get("limit") ?? "20", 10)),
  );
  const offset = (page - 1) * limit;

  const selectClause =
    "id, actor_id, actor_name, actor_role, action_type, description, target_tenant_id, target_tenant_name, metadata, created_at";

  async function enrichTenantNames(
    rows: Array<{
      target_tenant_id: string | null;
      target_tenant_name: string | null;
      actor_role: string;
      [key: string]: unknown;
    }>,
  ) {
    const ids = [
      ...new Set(rows.map((row) => row.target_tenant_id).filter(Boolean)),
    ] as string[];
    const tenantNameById = new Map<string, string>();

    if (ids.length > 0) {
      const { data } = await admin
        .from("tenants")
        .select("id, business_name")
        .in("id", ids);

      for (const tenant of data ?? []) {
        tenantNameById.set(tenant.id, tenant.business_name);
      }
    }

    return rows.map((row) => {
      const resolvedName =
        row.target_tenant_name?.trim() ||
        (row.target_tenant_id
          ? tenantNameById.get(row.target_tenant_id)
          : null) ||
        (row.actor_role
          .toLowerCase()
          .replace(/[\s_]/g, "")
          .includes("superadmin")
          ? "Global System"
          : "Unknown Tenant");

      return {
        ...row,
        target_tenant_name: resolvedName,
      };
    });
  }

  const applyFilters = (query: any) => {
    let filtered = query;

    if (search) {
      filtered = filtered.or(
        `actor_name.ilike.%${search}%,description.ilike.%${search}%,target_tenant_name.ilike.%${search}%`,
      );
    }

    if (role && role !== "All Roles") {
      filtered = filtered.ilike("actor_role", role);
    }

    if (date) {
      filtered = filtered
        .gte("created_at", `${date}T00:00:00.000Z`)
        .lte("created_at", `${date}T23:59:59.999Z`);
    }

    return filtered;
  };

  if (!hasExplicitPaging) {
    const batchSize = 1000;
    const allRows: Array<Record<string, unknown>> = [];
    let start = 0;

    while (true) {
      let query = applyFilters(
        admin
          .from("system_activity_logs")
          .select(selectClause)
          .order("created_at", { ascending: false })
          .range(start, start + batchSize - 1),
      );

      const { data, error } = await query;
      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      const rows = data ?? [];
      const enrichedRows = await enrichTenantNames(
        rows as Array<{
          target_tenant_id: string | null;
          target_tenant_name: string | null;
          actor_role: string;
          [key: string]: unknown;
        }>,
      );
      allRows.push(...enrichedRows);

      if (rows.length < batchSize) {
        break;
      }

      start += batchSize;
    }

    return NextResponse.json({
      data: allRows,
      total: allRows.length,
      page: 1,
      limit: allRows.length,
    });
  }

  let query = applyFilters(
    admin
      .from("system_activity_logs")
      .select(selectClause, { count: "exact" })
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1),
  );

  const { data, error, count } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const enrichedData = await enrichTenantNames(
    (data ?? []) as Array<{
      target_tenant_id: string | null;
      target_tenant_name: string | null;
      actor_role: string;
      [key: string]: unknown;
    }>,
  );

  return NextResponse.json({
    data: enrichedData,
    total: count ?? 0,
    page,
    limit,
  });
}

// ---------------------------------------------------------------------------
// pOST /api/admin/system-activity
// body: { actor_id?, actor_name, actor_role, action_type, description,
//         target_tenant_id?, target_tenant_name?, metadata? }
// ---------------------------------------------------------------------------
export async function POST(req: NextRequest) {
  const admin = createSupabaseAdminClient();
  const token = req.headers.get("authorization")?.split(" ")[1] ?? null;

  const auth = await requireSuperAdmin(admin, token);
  if (!auth.ok) {
    return NextResponse.json({ error: auth.message }, { status: auth.status });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const {
    actor_id,
    actor_name,
    actor_role,
    action_type,
    description,
    target_tenant_id,
    target_tenant_name,
    metadata,
  } = body;

  if (
    typeof action_type !== "string" ||
    typeof description !== "string" ||
    !description.trim()
  ) {
    return NextResponse.json(
      { error: "action_type and description are required" },
      { status: 400 },
    );
  }

  const { data, error } = await admin
    .from("system_activity_logs")
    .insert({
      actor_id: actor_id ?? null,
      actor_name: typeof actor_name === "string" ? actor_name : "System",
      actor_role: typeof actor_role === "string" ? actor_role : "system",
      action_type,
      description: description.trim(),
      target_tenant_id: target_tenant_id ?? null,
      target_tenant_name:
        typeof target_tenant_name === "string" ? target_tenant_name : null,
      metadata: metadata ?? null,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data }, { status: 201 });
}
