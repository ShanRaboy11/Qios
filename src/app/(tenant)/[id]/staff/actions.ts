"use server";

import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { requireEmployeePermission } from "@/lib/serverPermissions";
import { logEmployeeActivity } from "@/lib/employeeAuditLogger";
import { revalidatePath } from "next/cache";

export interface StaffMember {
  id: string;
  name: string;
  email: string;
  role: string;
  appRoleId?: string;
  department: string;
  status: "Active" | "On Leave" | "Suspended";
  lastActive: string;
}

export interface StaffDataResult {
  success: boolean;
  staff: StaffMember[];
  roles: { id: string; name: string }[];
  error?: string;
}

export async function getStaffData(tenantId: string): Promise<StaffDataResult> {
  try {
    const auth = await requireEmployeePermission(tenantId);
    if (!auth.ok) {
      return { success: false, staff: [], roles: [], error: auth.message };
    }

    const admin = createSupabaseAdminClient();

    // 1. Fetch profiles for this tenant
    const { data: profiles, error: profilesError } = await admin
      .from("profiles")
      .select("id, full_name, role, app_role_id, department, status, created_at")
      .eq("tenant_id", tenantId)
      .order("created_at", { ascending: false });

    if (profilesError) {
      return { success: false, staff: [], roles: [], error: profilesError.message };
    }

    // 2. Fetch roles for this tenant
    const { data: roles, error: rolesError } = await admin
      .from("roles")
      .select("id, name")
      .eq("tenant_id", tenantId);

    if (rolesError) {
      return { success: false, staff: [], roles: [], error: rolesError.message };
    }

    const rolesMap = new Map<string, string>(roles?.map((r) => [r.id, r.name]) ?? []);

    // 3. Fetch emails for these profiles
    const uniqueProfileIds = Array.from(new Set(profiles.map((p) => p.id)));
    const emailsMap: Record<string, string> = {};

    if (uniqueProfileIds.length > 0) {
      const userFetches = await Promise.all(
        uniqueProfileIds.map((id) =>
          admin.auth.admin
            .getUserById(id)
            .then((res) => res.data?.user?.email ?? "")
            .catch(() => "")
        )
      );

      uniqueProfileIds.forEach((id, idx) => {
        emailsMap[id] = userFetches[idx];
      });
    }

    // 4. Format profiles
    const staff: StaffMember[] = (profiles ?? []).map((p) => {
      let roleDisplay = "Staff";
      if (p.role === "admin") {
        roleDisplay = "Admin";
      } else if (p.role === "super_admin") {
        roleDisplay = "Super Admin";
      } else if (p.app_role_id) {
        roleDisplay = rolesMap.get(p.app_role_id) ?? "Staff";
      }

      return {
        id: p.id,
        name: p.full_name || "New User",
        email: emailsMap[p.id] || "",
        role: roleDisplay,
        appRoleId: p.app_role_id ?? undefined,
        department: p.department || "Operations",
        status: (p.status || "Active") as "Active" | "On Leave" | "Suspended",
        lastActive: "Just now", // In a real system, you'd fetch this from activity logs or session data
      };
    });

    return {
      success: true,
      staff,
      roles: roles?.map((r) => ({ id: r.id, name: r.name })) ?? [],
    };
  } catch (error: any) {
    return {
      success: false,
      staff: [],
      roles: [],
      error: error?.message || "Failed to load staff data",
    };
  }
}

export async function addStaffMember(
  tenantId: string,
  name: string,
  email: string,
  appRoleId: string,
  department: string,
  password?: string
) {
  try {
    const auth = await requireEmployeePermission(tenantId, "Employee Account Management");
    if (!auth.ok) {
      return { success: false, error: auth.message };
    }

    const admin = createSupabaseAdminClient();
    const normalizedEmail = email.trim().toLowerCase();

    // Check if password meets criteria
    const resolvedPassword = password || "Temp123!@#";

    const { data: authData, error: authError } = await admin.auth.admin.createUser({
      email: normalizedEmail,
      password: resolvedPassword,
      email_confirm: true,
      user_metadata: {
        full_name: name.trim(),
        tenant_id: tenantId,
        app_role_id: appRoleId || null,
        username: normalizedEmail.split("@")[0],
        department: department || "Operations",
        status: "Active",
      },
    });

    if (authError) {
      return { success: false, error: authError.message };
    }

    const { error: profileError } = await admin.from("profiles").upsert(
      {
        id: authData.user.id,
        full_name: name.trim(),
        username: normalizedEmail.split("@")[0],
        role: "employee",
        tenant_id: tenantId,
        app_role_id: appRoleId || null,
        department: department || "Operations",
        status: "Active",
      },
      { onConflict: "id" }
    );

    if (profileError) {
      await admin.auth.admin.deleteUser(authData.user.id);
      return { success: false, error: profileError.message };
    }

    // Log to employee audit logs
    void logEmployeeActivity({
      tenantId,
      actorId: auth.userId,
      actorName: auth.actorName ?? "Unknown",
      actorRole: auth.actorRole ?? "admin",
      actionType: "CREATE",
      description: `Added staff member: ${name.trim()}`,
      targetType: "staff",
      targetId: authData.user.id,
      targetName: name.trim(),
      metadata: { email: normalizedEmail, appRoleId, department },
    });

    revalidatePath(`/${tenantId}/staff`);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error?.message || "Failed to add staff member" };
  }
}

export async function editStaffMember(
  tenantId: string,
  staffId: string,
  name: string,
  appRoleId: string,
  department: string,
  status: "Active" | "On Leave" | "Suspended"
) {
  try {
    const auth = await requireEmployeePermission(tenantId, "Employee Account Management");
    if (!auth.ok) {
      return { success: false, error: auth.message };
    }

    const admin = createSupabaseAdminClient();

    // Fetch existing profile to log changes
    const { data: oldProfile } = await admin
      .from("profiles")
      .select("full_name, app_role_id, department, status")
      .eq("id", staffId)
      .maybeSingle();

    const { error: profileError } = await admin
      .from("profiles")
      .update({
        full_name: name.trim(),
        app_role_id: appRoleId || null,
        department: department || "Operations",
        status,
      })
      .eq("id", staffId)
      .eq("tenant_id", tenantId);

    if (profileError) {
      return { success: false, error: profileError.message };
    }

    // Update metadata in auth.users
    const { data: authUser } = await admin.auth.admin.getUserById(staffId);
    if (authUser?.user) {
      const currentMetadata = authUser.user.user_metadata || {};
      await admin.auth.admin.updateUserById(staffId, {
        user_metadata: {
          ...currentMetadata,
          full_name: name.trim(),
          app_role_id: appRoleId || null,
          department: department || "Operations",
          status,
        },
      });
    }

    // Log to employee audit logs
    void logEmployeeActivity({
      tenantId,
      actorId: auth.userId,
      actorName: auth.actorName ?? "Unknown",
      actorRole: auth.actorRole ?? "admin",
      actionType: "UPDATE",
      description: `Updated staff member profile: ${name.trim()}`,
      targetType: "staff",
      targetId: staffId,
      targetName: name.trim(),
      metadata: {
        changes: {
          name: { old: oldProfile?.full_name, new: name.trim() },
          appRoleId: { old: oldProfile?.app_role_id, new: appRoleId },
          department: { old: oldProfile?.department, new: department },
          status: { old: oldProfile?.status, new: status },
        },
      },
    });

    revalidatePath(`/${tenantId}/staff`);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error?.message || "Failed to update staff member" };
  }
}

export async function resetStaffPassword(tenantId: string, staffId: string, newPassword?: string) {
  try {
    const auth = await requireEmployeePermission(tenantId, "Employee Account Management");
    if (!auth.ok) {
      return { success: false, error: auth.message };
    }

    const admin = createSupabaseAdminClient();
    const resolvedPassword = newPassword || "Temp123!@#";

    const { data: profile } = await admin
      .from("profiles")
      .select("full_name")
      .eq("id", staffId)
      .maybeSingle();

    const { error: resetError } = await admin.auth.admin.updateUserById(staffId, {
      password: resolvedPassword,
    });

    if (resetError) {
      return { success: false, error: resetError.message };
    }

    // Log to employee audit logs
    void logEmployeeActivity({
      tenantId,
      actorId: auth.userId,
      actorName: auth.actorName ?? "Unknown",
      actorRole: auth.actorRole ?? "admin",
      actionType: "UPDATE",
      description: `Reset password for staff member: ${profile?.full_name ?? "Unknown"}`,
      targetType: "staff",
      targetId: staffId,
      targetName: profile?.full_name ?? undefined,
      metadata: { action: "RESET_PASSWORD" },
    });

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error?.message || "Failed to reset password" };
  }
}

export async function deactivateStaffMember(tenantId: string, staffId: string) {
  try {
    const auth = await requireEmployeePermission(tenantId, "Employee Account Management");
    if (!auth.ok) {
      return { success: false, error: auth.message };
    }

    const admin = createSupabaseAdminClient();

    const { data: profile } = await admin
      .from("profiles")
      .select("full_name")
      .eq("id", staffId)
      .maybeSingle();

    // Deactivation updates status to "Suspended"
    const { error: profileError } = await admin
      .from("profiles")
      .update({
        status: "Suspended",
      })
      .eq("id", staffId)
      .eq("tenant_id", tenantId);

    if (profileError) {
      return { success: false, error: profileError.message };
    }

    // Update metadata status in auth.users
    const { data: authUser } = await admin.auth.admin.getUserById(staffId);
    if (authUser?.user) {
      const currentMetadata = authUser.user.user_metadata || {};
      await admin.auth.admin.updateUserById(staffId, {
        user_metadata: {
          ...currentMetadata,
          status: "Suspended",
        },
      });
    }

    // Log to employee audit logs
    void logEmployeeActivity({
      tenantId,
      actorId: auth.userId,
      actorName: auth.actorName ?? "Unknown",
      actorRole: auth.actorRole ?? "admin",
      actionType: "UPDATE",
      description: `Suspended/deactivated staff member account: ${profile?.full_name ?? "Unknown"}`,
      targetType: "staff",
      targetId: staffId,
      targetName: profile?.full_name ?? undefined,
      metadata: { status: "Suspended" },
    });

    revalidatePath(`/${tenantId}/staff`);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error?.message || "Failed to deactivate staff member" };
  }
}

export interface LeaderboardEntry {
  id: string;
  rank: number;
  name: string;
  volume: number;
  performance: "Excellent" | "Moderate" | "Poor";
}

export interface ActivityEntry {
  id: string;
  name: string;
  action: string;
  time: string;
  status: "success" | "warning" | "error";
}

export async function getStaffLeaderboard(
  tenantId: string
): Promise<{ success: boolean; data: LeaderboardEntry[]; error?: string }> {
  try {
    const auth = await requireEmployeePermission(tenantId);
    if (!auth.ok) {
      return { success: false, data: [], error: auth.message };
    }

    const admin = createSupabaseAdminClient();

    // 1. Fetch profiles to map staff IDs to names
    const { data: profiles, error: profilesError } = await admin
      .from("profiles")
      .select("id, full_name")
      .eq("tenant_id", tenantId);

    if (profilesError) {
      return { success: false, data: [], error: profilesError.message };
    }

    // 2. Fetch order status logs to calculate volume
    const { data: logs, error: logsError } = await admin
      .from("order_status_logs")
      .select("staff_id, order_id")
      .eq("tenant_id", tenantId);

    if (logsError) {
      return { success: false, data: [], error: logsError.message };
    }

    // Count unique orders per staff member
    const counts: Record<string, Set<string>> = {};
    if (logs) {
      for (const log of logs) {
        if (log.staff_id) {
          if (!counts[log.staff_id]) {
            counts[log.staff_id] = new Set();
          }
          counts[log.staff_id].add(log.order_id);
        }
      }
    }

    // Map profiles to leaderboard entries
    const entries: LeaderboardEntry[] = (profiles ?? []).map((profile) => {
      const volume = counts[profile.id]?.size || 0;
      let performance: "Excellent" | "Moderate" | "Poor" = "Poor";
      if (volume >= 50) {
        performance = "Excellent";
      } else if (volume >= 20) {
        performance = "Moderate";
      }

      return {
        id: profile.id,
        rank: 0, // Assigned below after sorting
        name: profile.full_name || "New Staff",
        volume,
        performance,
      };
    });

    // Sort descending by volume
    entries.sort((a, b) => b.volume - a.volume);

    // Assign rank
    entries.forEach((entry, idx) => {
      entry.rank = idx + 1;
    });

    return { success: true, data: entries };
  } catch (error: any) {
    return {
      success: false,
      data: [],
      error: error?.message || "Failed to load staff leaderboard",
    };
  }
}

export async function getLiveActivities(
  tenantId: string
): Promise<{ success: boolean; data: ActivityEntry[]; error?: string }> {
  try {
    const auth = await requireEmployeePermission(tenantId);
    if (!auth.ok) {
      return { success: false, data: [], error: auth.message };
    }

    const admin = createSupabaseAdminClient();

    // 1. Query employee_audit_logs
    const { data: ealLogs, error: ealError } = await admin
      .from("employee_audit_logs")
      .select("id, actor_name, description, action_type, created_at")
      .eq("tenant_id", tenantId)
      .order("created_at", { ascending: false })
      .limit(20);

    if (ealError) {
      return { success: false, data: [], error: ealError.message };
    }

    // 2. Query system_activity_logs (e.g. order queue changes)
    const { data: systemLogs, error: systemError } = await admin
      .from("system_activity_logs")
      .select("id, actor_name, description, action_type, created_at")
      .eq("target_tenant_id", tenantId)
      .not("actor_role", "eq", "Customer")
      .order("created_at", { ascending: false })
      .limit(20);

    if (systemError) {
      return { success: false, data: [], error: systemError.message };
    }

    // Helper function for relative time
    const getRelativeTime = (dateStr: string): string => {
      const now = new Date();
      const date = new Date(dateStr);
      const diffMs = now.getTime() - date.getTime();
      const diffSecs = Math.floor(diffMs / 1000);
      const diffMins = Math.floor(diffSecs / 60);
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);

      if (diffSecs < 10) return "Just now";
      if (diffSecs < 60) return `${diffSecs}s ago`;
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      return `${diffDays}d ago`;
    };

    // Helper function to map activity status
    const getActivityStatus = (
      actionType: string,
      description: string
    ): "success" | "warning" | "error" => {
      const desc = description.toLowerCase();
      if (
        desc.includes("cancelled") ||
        desc.includes("voided") ||
        actionType === "DELETE" ||
        actionType === "REFUND"
      ) {
        return "error";
      }
      if (
        desc.includes("preparing") ||
        desc.includes("pending") ||
        actionType === "UPDATE"
      ) {
        return "warning";
      }
      return "success";
    };

    // Merge logs and sort by created_at descending
    const allLogs = [
      ...(ealLogs || []).map((l) => ({ ...l, source: "audit" })),
      ...(systemLogs || []).map((l) => ({ ...l, source: "system" })),
    ];

    allLogs.sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    // Limit to top 20 and map to ActivityEntry
    const mappedLogs: ActivityEntry[] = allLogs.slice(0, 20).map((log) => ({
      id: log.id,
      name: log.actor_name,
      action: log.description,
      time: getRelativeTime(log.created_at),
      status: getActivityStatus(log.action_type, log.description),
    }));

    return { success: true, data: mappedLogs };
  } catch (error: any) {
    return {
      success: false,
      data: [],
      error: error?.message || "Failed to load live activities",
    };
  }
}

