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
      business_name,
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
      business_name: t.business_name,
      owner: ownerProfile ? ownerProfile.full_name : "Unknown",
      type: "Professional" as "Professional" | "Enterprise" | "Starter",
      joined: new Date(t.created_at).toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric' }),
      status: (t.status === "pending" ? "Pending" 
            : t.status === "approved" ? "Active" 
            : t.status === "rejected" ? "Rejected" 
            : "Active") as "Active" | "Suspended" | "Pending" | "Rejected",
      rawStatus: t.status,
    };
  });
}

export async function updateTenantStatus(tenantId: string, status: 'pending' | 'approved' | 'rejected', comments?: string) {
  const supabase = createSupabaseAdminClient();
  
  const updateData: any = { status };
  if (comments !== undefined) {
    updateData.admin_comments = comments;
  }

  const { error } = await supabase
    .from("tenants")
    .update(updateData)
    .eq('id', tenantId);

  if (error) {
    throw new Error(error.message);
  }

  // Find owner to get email for notification (usually 'admin' role in this single-tenant context)
  const { data: adminProfiles } = await supabase
    .from("profiles")
    .select("id, full_name")
    .eq("tenant_id", tenantId)
    .eq("role", "admin")
    .limit(1);

  if (adminProfiles && adminProfiles.length > 0) {
    const adminId = adminProfiles[0].id;
    // Get user email using Supabase identity
    const { data: { user }, error: userError } = await supabase.auth.admin.getUserById(adminId);
    
    if (user && user.email && status !== 'pending') {
      const { sendBusinessVerificationEmail } = await import('@/lib/email');
      await sendBusinessVerificationEmail({
        to: user.email,
        status,
        comments,
      });
    }
  }

  revalidatePath("/admin/tenants");
  revalidatePath("/admin/dashboard");
  return { success: true };
}