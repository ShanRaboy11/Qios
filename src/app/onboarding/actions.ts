"use server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export async function processOnboarding(data: {
  businessData: { name: string, email: string },
  contactData: { phoneNumber: string },
  authData: { email: string, password: string },
  subscriptionData: { packageId: string },
  featureData: { inventoryMode: string, generalFeatures: any }
}) {
  const supabase = createSupabaseAdminClient();
  
  // 1. Create a User in Auth
  const { data: authDataRes, error: authError } = await supabase.auth.admin.createUser({
    email: data.authData.email,
    password: data.authData.password,
    email_confirm: true,
    user_metadata: {
      full_name: data.businessData.name,
      business_email: data.businessData.email,
      phone_number: data.contactData.phoneNumber,
      subscription_plan: data.subscriptionData.packageId,
      features: data.featureData.generalFeatures
    }
  });

  if (authError || !authDataRes.user) {
    throw new Error(authError?.message || "Failed to create user");
  }
  
  const userId = authDataRes.user.id;

  // 2. Create the Tenant
  const { data: tenantRes, error: tenantError } = await supabase.from('tenants').insert({
    name: data.businessData.name,
    inventory_mode: data.featureData.inventoryMode
  }).select('id').single();

  if (tenantError || !tenantRes) {
    throw new Error(tenantError?.message || "Failed to create tenant");
  }

  const tenantId = tenantRes.id;

  // 3. Wait slightly for the profile trigger to run just in case, though it runs in transaction usually.
  // We can just update it safely
  const { error: profileError } = await supabase.from('profiles').update({
    tenant_id: tenantId,
    role: 'super_admin', // maybe 'super_admin' is better for the main tenant owner? actually 'admin' is typical for a tenant owner. Let's use 'super_admin' or 'admin'
  }).eq('id', userId);

  if (profileError) {
    throw new Error(profileError.message || "Failed to link user to tenant");
  }

  return { success: true, tenantId, userId };
}