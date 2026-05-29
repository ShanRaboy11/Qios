"use server";

import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

/**
 * Persists the tenant onboarding tutorial completion status directly in the database.
 * Stored inside the `settings` JSONB field in the `tenants` table.
 */
export async function updateTenantTutorialStatus(
  tenantId: string,
  completed: boolean
) {
  if (!tenantId) {
    return { success: false, error: "Tenant ID is required" };
  }

  try {
    const admin = createSupabaseAdminClient();

    // 1. Fetch current settings JSONB
    const { data: tenant, error: fetchError } = await admin
      .from("tenants")
      .select("settings")
      .eq("id", tenantId)
      .maybeSingle();

    if (fetchError) {
      throw new Error(fetchError.message);
    }

    const currentSettings =
      tenant?.settings && typeof tenant.settings === "object"
        ? (tenant.settings as Record<string, unknown>)
        : {};

    // 2. Merge onboarding tutorial completion status
    const updatedSettings = {
      ...currentSettings,
      tutorial_completed: completed,
      tutorial_completed_at: completed ? new Date().toISOString() : null,
    };

    // 3. Update the database row
    const { error: updateError } = await admin
      .from("tenants")
      .update({
        settings: updatedSettings,
      })
      .eq("id", tenantId);

    if (updateError) {
      throw new Error(updateError.message);
    }

    // 4. Revalidate cache
    revalidatePath(`/${tenantId}/dashboard`);
    revalidatePath(`/${tenantId}/settings`);

    return { success: true };
  } catch (error: any) {
    console.error("[updateTenantTutorialStatus] Error saving tutorial status:", error);
    return {
      success: false,
      error: error?.message || "Failed to update onboarding tutorial status",
    };
  }
}

/**
 * Fetches the tenant onboarding tutorial completion status from the database.
 */
export async function getTenantTutorialStatus(tenantId: string) {
  if (!tenantId) {
    return { completed: false };
  }

  try {
    const admin = createSupabaseAdminClient();
    const { data: tenant } = await admin
      .from("tenants")
      .select("settings")
      .eq("id", tenantId)
      .maybeSingle();

    const settings =
      tenant?.settings && typeof tenant.settings === "object"
        ? (tenant.settings as Record<string, unknown>)
        : null;

    return {
      completed: settings?.tutorial_completed === true,
    };
  } catch {
    return { completed: false };
  }
}
