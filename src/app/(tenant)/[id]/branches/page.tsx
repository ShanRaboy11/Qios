import React from "react";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { redirect } from "next/navigation";
import BranchesClient from "./BranchesClient";
import { getTenantFeatures } from "@/lib/subscriptionAccess";
import { canAccessMultiBranchManagement } from "@/lib/subscriptionFeatureAccess";

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
  const { data: currentTenant } = await admin
    .from("tenants")
    .select("business_email, subscription_plan")
    .eq("id", tenantId)
    .maybeSingle();

  const hasMultiBranch = canAccessMultiBranchManagement(
    tenantFeatures,
    currentTenant?.subscription_plan,
  );

  if (!hasMultiBranch) {
    redirect(`/${tenantId}/dashboard?error=unauthorized`);
  }

  if (!currentTenant?.business_email) {
    return <div className="p-8">Error loading branches.</div>;
  }

  // 4. Fetch all branches
  const { data: branches, error } = await admin
    .from("tenants")
    .select("id, business_name, status, created_at, subscription_plan")
    .eq("business_email", currentTenant.business_email)
    .order("created_at", { ascending: true });

  if (error || !branches) {
    return <div className="p-8">Error loading branches.</div>;
  }

  const originalTenantId = branches[0]?.id ?? null;

  return (
    <BranchesClient
      branches={branches}
      activeTenantId={tenantId}
      originalTenantId={originalTenantId}
    />
  );
}
