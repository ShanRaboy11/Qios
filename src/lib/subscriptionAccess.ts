import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export async function getTenantFeatures(tenantId: string): Promise<any | null> {
  const admin = createSupabaseAdminClient();

  const { data: tenant, error: tenantError } = await admin
    .from("tenants")
    .select("subscription_plan")
    .eq("id", tenantId)
    .maybeSingle();

  if (tenantError || !tenant || !tenant.subscription_plan) {
    return null;
  }

  // Handle case sensitivity for plan names
  const { data: plan, error: planError } = await admin
    .from("subscription_plans")
    .select("features")
    .ilike("name", tenant.subscription_plan)
    .maybeSingle();

  if (planError || !plan) {
    return null;
  }

  return plan.features;
}

export async function getTenantSubscriptionPlan(
  tenantId: string,
): Promise<string | null> {
  const admin = createSupabaseAdminClient();

  const { data: tenant, error } = await admin
    .from("tenants")
    .select("subscription_plan")
    .eq("id", tenantId)
    .maybeSingle();

  if (error || !tenant?.subscription_plan) {
    return null;
  }

  return tenant.subscription_plan;
}

export async function hasTenantFeature(
  tenantId: string,
  featureGroup: string,
  featureName: string,
): Promise<boolean> {
  const features = await getTenantFeatures(tenantId);

  if (!features) {
    return false;
  }

  return features[featureGroup]?.[featureName] === true;
}
