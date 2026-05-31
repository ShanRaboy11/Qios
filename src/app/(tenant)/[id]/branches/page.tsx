import React from "react";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { redirect } from "next/navigation";
import BranchesClient from "./BranchesClient";
import { getTenantFeatures } from "@/lib/subscriptionAccess";

export default async function BranchesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: tenantId } = await params;
  const supabase = await createSupabaseServerClient();
  const admin = createSupabaseAdminClient();

  // 1. Verify User Session
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !user.email) {
    redirect("/login");
  }

  // 2. Fetch User Profile
  const { data: profile } = await admin
    .from("profiles")
    .select("role, tenant_id")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile || profile.tenant_id !== tenantId) {
    redirect(`/${profile?.tenant_id || "login"}/dashboard`);
  }

  // 3. Verify Enterprise Feature
  const tenantFeatures = await getTenantFeatures(tenantId);
  const hasMultiBranch = tenantFeatures?.admin_controls?.["Multi-Branch Management"] === true;
  
  if (!hasMultiBranch) {
    redirect(`/${tenantId}/dashboard?error=unauthorized`);
  }

  // 4. Check if Owner
  const { data: currentTenant } = await admin
    .from("tenants")
    .select("business_email, subscription_plan")
    .eq("id", tenantId)
    .maybeSingle();

  if (currentTenant?.business_email?.toLowerCase() !== user.email.toLowerCase()) {
    redirect(`/${tenantId}/dashboard?error=unauthorized`);
  }

  // 5. Fetch all branches
  const { data: branches, error } = await admin
    .from("tenants")
    .select("id, name, business_name, status, created_at, subscription_plan")
    .eq("business_email", currentTenant.business_email)
    .order("created_at", { ascending: true });

  if (error || !branches) {
    return <div className="p-8">Error loading branches.</div>;
  }

  return <BranchesClient branches={branches} activeTenantId={tenantId} />;
}
