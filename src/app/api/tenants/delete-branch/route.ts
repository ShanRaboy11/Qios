import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { canAccessMultiBranchManagement } from "@/lib/subscriptionFeatureAccess";
import { getTenantFeatures } from "@/lib/subscriptionAccess";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const targetTenantId =
      typeof body?.targetTenantId === "string" ? body.targetTenantId : "";

    if (!targetTenantId) {
      return NextResponse.json(
        { error: "Missing targetTenantId" },
        { status: 400 },
      );
    }

    const supabase = await createSupabaseServerClient();
    const admin = createSupabaseAdminClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user || !user.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: profile } = await admin
      .from("profiles")
      .select("tenant_id, role")
      .eq("id", user.id)
      .maybeSingle();

    if (!profile?.tenant_id || profile.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { data: currentTenant } = await admin
      .from("tenants")
      .select("id, business_email, subscription_plan")
      .eq("id", profile.tenant_id)
      .maybeSingle();

    if (!currentTenant) {
      return NextResponse.json(
        { error: "Current tenant not found" },
        { status: 404 },
      );
    }

    const tenantFeatures = await getTenantFeatures(currentTenant.id);
    if (
      !canAccessMultiBranchManagement(
        tenantFeatures,
        currentTenant.subscription_plan,
      )
    ) {
      return NextResponse.json(
        {
          error:
            "Your subscription plan does not include multi-branch management.",
        },
        { status: 403 },
      );
    }

    const branchGroupEmail =
      currentTenant.business_email?.trim().toLowerCase() ||
      user.email.trim().toLowerCase();

    const { data: targetTenant } = await admin
      .from("tenants")
      .select("id, business_email")
      .eq("id", targetTenantId)
      .maybeSingle();

    if (!targetTenant) {
      return NextResponse.json({ error: "Branch not found" }, { status: 404 });
    }

    const targetBusinessEmail =
      targetTenant.business_email?.trim().toLowerCase() || "";

    if (!targetBusinessEmail || targetBusinessEmail !== branchGroupEmail) {
      return NextResponse.json(
        { error: "Forbidden: Branch is not part of your organization." },
        { status: 403 },
      );
    }

    if (targetTenantId === profile.tenant_id) {
      return NextResponse.json(
        {
          error: "Switch to a different branch before deleting this one.",
        },
        { status: 409 },
      );
    }

    const { data: oldestBranch } = await admin
      .from("tenants")
      .select("id")
      .eq("business_email", targetTenant.business_email)
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle();

    if (oldestBranch?.id === targetTenantId) {
      return NextResponse.json(
        { error: "The original onboarding branch cannot be deleted." },
        { status: 403 },
      );
    }

    const { error: deleteError } = await admin
      .from("tenants")
      .delete()
      .eq("id", targetTenantId);

    if (deleteError) {
      return NextResponse.json(
        { error: "Failed to delete branch" },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Unexpected error" },
      { status: 500 },
    );
  }
}
