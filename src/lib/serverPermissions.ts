import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { type RolePermissions, hasPermission } from "./employeePermissions";

type PermissionCheckResult =
  | {
      ok: true;
      admin: ReturnType<typeof createSupabaseAdminClient>;
      userId: string;
      actorName?: string | null;
      actorRole?: string | null;
    }
  | { ok: false; status: number; message: string };

/**
 * Validates that the current user has access to the specified tenant,
 * and if they are an employee, ensures they have the required permission.
 * Super Admins and Tenant Admins bypass the permission check.
 *
 * @param tenantId The ID of the tenant to check against
 * @param requiredPermission Optional. The specific permission string to check for employees.
 */
export async function requireEmployeePermission(
  tenantId: string,
  requiredPermission?: string,
  token?: string | null,
): Promise<PermissionCheckResult> {
  const supabase = await createSupabaseServerClient();
  const admin = createSupabaseAdminClient();

  let user;
  if (token) {
    const { data } = await admin.auth.getUser(token);
    user = data.user;
  } else {
    const { data } = await supabase.auth.getUser();
    user = data.user;
  }

  if (!user) {
    return { ok: false, status: 401, message: "Unauthorized" };
  }

  const { data: profile, error: profileError } = await admin
    .from("profiles")
    .select("role, tenant_id, app_role_id, full_name")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError || !profile) {
    return { ok: false, status: 403, message: "Profile not found" };
  }

  if (profile.role === "super_admin") {
    return { ok: true, admin, userId: user.id, actorName: profile.full_name, actorRole: profile.role };
  }

  if (profile.tenant_id !== tenantId) {
    return { ok: false, status: 403, message: "Unauthorized for this tenant" };
  }

  if (profile.role === "admin") {
    return { ok: true, admin, userId: user.id, actorName: profile.full_name, actorRole: profile.role };
  }

  if (profile.role === "employee" && requiredPermission) {
    if (!profile.app_role_id) {
      return { ok: false, status: 403, message: "No role assigned" };
    }

    const { data: roleData, error: roleError } = await admin
      .from("roles")
      .select("permissions")
      .eq("id", profile.app_role_id)
      .eq("tenant_id", tenantId)
      .maybeSingle();

    if (roleError || !roleData) {
      return { ok: false, status: 403, message: "Role not found" };
    }

    const permissions =
      (roleData.permissions as RolePermissions | null) ?? null;

    if (!hasPermission(permissions, requiredPermission)) {
      return {
        ok: false,
        status: 403,
        message: `Insufficient permissions: Requires ${requiredPermission}`,
      };
    }
  }

  return { ok: true, admin, userId: user.id, actorName: profile.full_name, actorRole: profile.role };
}

export async function getEmployeePermissionsForTenant(
  tenantId: string,
): Promise<RolePermissions | null> {
  const supabase = await createSupabaseServerClient();
  const admin = createSupabaseAdminClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: profile, error: profileError } = await admin
    .from("profiles")
    .select("role, tenant_id, app_role_id")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError || !profile) {
    return null;
  }

  if (profile.role !== "employee" || profile.tenant_id !== tenantId) {
    return null;
  }

  if (!profile.app_role_id) {
    return null;
  }

  const { data: roleData } = await admin
    .from("roles")
    .select("permissions")
    .eq("id", profile.app_role_id)
    .eq("tenant_id", tenantId)
    .maybeSingle();

  return (roleData?.permissions as RolePermissions | null) ?? null;
}
