import { SupabaseClient } from "@supabase/supabase-js";

interface LogParams {
  supabase: SupabaseClient;
  actorId: string;
  actorName: string;
  actionType: "CREATE" | "UPDATE" | "DELETE" | "REVOKE";
  description: string;
  targetTenantId?: string;
  targetTenantName?: string;
  metadata?: unknown;
}

async function resolveTargetTenantName(
  supabase: SupabaseClient,
  targetTenantId?: string,
  targetTenantName?: string,
) {
  const providedName = targetTenantName?.trim();
  if (providedName) return providedName;
  if (!targetTenantId) return "Global System";

  const { data } = await supabase
    .from("tenants")
    .select("business_name")
    .eq("id", targetTenantId)
    .maybeSingle();

  return data?.business_name?.trim() || "Unknown Tenant";
}

export const logActivity = async ({
  supabase,
  actorId,
  actorName,
  actionType,
  description,
  targetTenantId,
  targetTenantName,
  metadata,
}: LogParams) => {
  const resolvedTargetTenantName = await resolveTargetTenantName(
    supabase,
    targetTenantId,
    targetTenantName,
  );

  const { error } = await supabase.from("system_activity_logs").insert({
    actor_id: actorId,
    actor_name: actorName,
    actor_role: "Super Admin",
    action_type: actionType,
    description: description,
    target_tenant_id: targetTenantId ?? null,
    target_tenant_name: resolvedTargetTenantName,
    metadata: metadata,
  });

  if (!error) {
    return;
  }

  const message = String(error.message || "").toLowerCase();
  const isColumnMismatch =
    error.code === "42703" ||
    message.includes("column") ||
    message.includes("actor_") ||
    message.includes("action_type") ||
    message.includes("description");

  if (!isColumnMismatch) {
    console.error("Logging error:", error);
    return;
  }

  const { error: legacyError } = await supabase
    .from("system_activity_logs")
    .insert({
      user_id: actorId,
      action: description,
      details: {
        action_type: actionType,
        actor_name: actorName,
        metadata,
      },
    });

  if (legacyError) {
    console.error("Logging error (legacy fallback):", legacyError);
  }
};
