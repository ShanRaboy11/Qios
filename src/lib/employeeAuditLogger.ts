import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export type EmployeeAuditActionType =
  | "CREATE"
  | "UPDATE"
  | "DELETE"
  | "LOGIN"
  | "LOGOUT"
  | "REFUND"
  | "SYSTEM";

export type EmployeeAuditTargetType =
  | "staff"
  | "role"
  | "menu"
  | "order"
  | "auth"
  | "inventory"
  | "settings"
  | "system";

export interface LogEmployeeActivityParams {
  tenantId: string;
  actorId?: string;
  actorName: string;
  actorRole: string;
  actionType: EmployeeAuditActionType;
  description: string;
  targetType?: EmployeeAuditTargetType;
  targetId?: string;
  targetName?: string;
  metadata?: Record<string, unknown>;
}

/**
 * Writes a tenant-scoped employee audit log entry using the service-role admin client.
 * Call this from API route handlers and server actions after significant mutations.
 *
 * Failures are non-fatal – errors are only logged to the console so they never
 * interrupt the primary operation.
 *
 * @example
 * await logEmployeeActivity({
 *   tenantId:    tenantId,
 *   actorId:     userId,
 *   actorName:   "Jane Doe",
 *   actorRole:   "Manager",
 *   actionType:  "UPDATE",
 *   description: "Updated menu item: Truffle Burger",
 *   targetType:  "menu",
 *   targetId:    menuItemId,
 *   targetName:  "Truffle Burger",
 *   metadata:    { changes: { price: { old: 350, new: 380 } } },
 * });
 */
export async function logEmployeeActivity(
  params: LogEmployeeActivityParams,
): Promise<void> {
  try {
    const admin = createSupabaseAdminClient();

    const { error } = await admin.from("employee_audit_logs").insert({
      tenant_id: params.tenantId,
      actor_id: params.actorId ?? null,
      actor_name: params.actorName,
      actor_role: params.actorRole,
      action_type: params.actionType,
      description: params.description,
      target_type: params.targetType ?? null,
      target_id: params.targetId ?? null,
      target_name: params.targetName ?? null,
      metadata: params.metadata ?? null,
    });

    if (error) {
      console.error(
        "[employeeAuditLogger] Failed to write log:",
        error.message,
      );
    }
  } catch (err) {
    console.error("[employeeAuditLogger] Unexpected error:", err);
  }
}
