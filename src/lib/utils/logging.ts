import { SupabaseClient } from "@supabase/supabase-js";

interface LogParams {
  supabase: SupabaseClient;
  actorId: string;
  actorName: string;
  actionType: "CREATE" | "UPDATE" | "DELETE" | "REVOKE";
  description: string;
  metadata?: any;
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

  if (error) console.error("Logging error:", error);
};