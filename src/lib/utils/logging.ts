import { SupabaseClient } from "@supabase/supabase-js";

interface LogParams {
  supabase: SupabaseClient;
  actorId: string;
  actorName: string;
  actionType: "CREATE" | "UPDATE" | "DELETE" | "REVOKE";
  description: string;
  metadata?: unknown;
}

export const logActivity = async ({
  supabase,
  actorId,
  actorName,
  actionType,
  description,
  metadata,
}: LogParams) => {
  const { error } = await supabase.from("system_activity_logs").insert({
    actor_id: actorId,
    actor_name: actorName,
    actor_role: "Super Admin",
    action_type: actionType,
    description: description,
    target_tenant_name: "Global System",
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
