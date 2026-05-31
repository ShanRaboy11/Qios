import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export async function POST(req: NextRequest) {
  try {
    const { targetTenantId } = await req.json();

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

    if (!profile?.tenant_id) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    // Verify the target tenant exists and is owned by the same business email
    const { data: targetTenant, error: tenantError } = await admin
      .from("tenants")
      .select("id, business_email")
      .eq("id", targetTenantId)
      .maybeSingle();

    if (tenantError || !targetTenant) {
      return NextResponse.json({ error: "Tenant not found" }, { status: 404 });
    }

    const { data: currentTenant } = await admin
      .from("tenants")
      .select("business_email")
      .eq("id", profile.tenant_id)
      .maybeSingle();

    const normalizedUserEmail = user.email.trim().toLowerCase();
    const normalizedTargetBusinessEmail =
      targetTenant.business_email?.trim().toLowerCase() ?? "";
    const normalizedCurrentBusinessEmail =
      currentTenant?.business_email?.trim().toLowerCase() ?? "";

    const isBusinessEmailOwner =
      normalizedTargetBusinessEmail.length > 0 &&
      normalizedTargetBusinessEmail === normalizedUserEmail;
    const isTenantAdminWithinBusiness =
      profile.role === "admin" &&
      normalizedCurrentBusinessEmail.length > 0 &&
      normalizedTargetBusinessEmail === normalizedCurrentBusinessEmail;

    if (!isBusinessEmailOwner && !isTenantAdminWithinBusiness) {
      return NextResponse.json(
        { error: "Forbidden: You are not allowed to switch to this branch" },
        { status: 403 },
      );
    }

    // Update the profile's active tenant_id
    const { error: profileError } = await admin
      .from("profiles")
      .update({ tenant_id: targetTenantId })
      .eq("id", user.id);

    if (profileError) {
      return NextResponse.json(
        { error: "Failed to switch branch" },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true, tenantId: targetTenantId });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
