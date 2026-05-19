import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export type ActivityActionType =
  | "CREATE"
  | "UPDATE"
  | "DELETE"
  | "LOGIN"
  | "LOGOUT"
  | "REFUND"
  | "SYSTEM";

export interface LogActivityParams {
  actorId?: string;
  actorName: string;
  actorRole: string;
  actionType: ActivityActionType;
  description: string;
  targetTenantId?: string;
  targetTenantName?: string;
  metadata?: Record<string, unknown>;
}

/**
 * Writes a system-level activity log entry using the service-role admin client.
 * Call this from API route handlers and server actions after significant mutations.
 *
 * Failures are non-fatal – errors are only logged to the console so they never
 * interrupt the primary operation.
 *
 * @example
 * await logActivity({
 *   actorId:          userId,
 *   actorName:        "Jane Doe",
 *   actorRole:        "Super Admin",
 *   actionType:       "UPDATE",
 *   description:      "Enabled measurement-based inventory for Cebu Grill",
 *   targetTenantId:   tenantId,
 *   targetTenantName: "Cebu Grill",
 * });
 */
export async function logActivity(params: LogActivityParams): Promise<void> {
  try {
    const admin = createSupabaseAdminClient();

    const { error } = await admin.from("system_activity_logs").insert({
      actor_id: params.actorId ?? null,
      actor_name: params.actorName,
      actor_role: params.actorRole,
      action_type: params.actionType,
      description: params.description,
      target_tenant_id: params.targetTenantId ?? null,
      target_tenant_name: params.targetTenantName ?? null,
      metadata: params.metadata ?? null,
    });

    if (error) {
      console.error("[activityLogger] Failed to write log:", error.message);
    }
  } catch (err) {
    console.error("[activityLogger] Unexpected error:", err);
  }
}
