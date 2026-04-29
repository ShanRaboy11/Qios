"use server";

import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

export async function getTenants() {
  const supabase = createSupabaseAdminClient();
  
  // Note: assuming we can join profiles to get the owner name, but we might just get the first admin.
  // Profiles has tenant_id and role.
  const { data: tenants, error: tenantError } = await supabase
    .from("tenants")
    .select(`
      id,
      name,
      created_at,
      status,
      profiles (
        full_name,
        role
      )
    `)
    .order('created_at', { ascending: false });

  if (tenantError) throw new Error(tenantError.message);

  return tenants.map(t => {
    const ownerProfile = t.profiles.find((p: any) => p.role === 'super_admin' || p.role === 'admin');
    return {
      id: t.id,
      name: t.name,
      owner: ownerProfile ? ownerProfile.full_name : "Unknown",
      type: "Professional", // Fallback, could be added to DB if needed
      joined: new Date(t.created_at).toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric' }),
      status: t.status === "pending" ? "Pending" 
            : t.status === "approved" ? "Active" 
            : t.status === "rejected" ? "Rejected" 
            : "Active", // Suspended if we add that later
      rawStatus: t.status,
    };
  });
}

export async function updateTenantStatus(tenantId: string, status: 'pending' | 'approved' | 'rejected') {
  const supabase = createSupabaseAdminClient();
  
  const { error } = await supabase
    .from("tenants")
    .update({ status })
    .eq('id', tenantId);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/tenants");
  revalidatePath("/admin/dashboard");
  return { success: true };
}