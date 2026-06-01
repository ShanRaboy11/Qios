import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { canAccessMultiBranchManagement } from "@/lib/subscriptionFeatureAccess";
import { getTenantFeatures } from "@/lib/subscriptionAccess";

function extractBrandingSettings(source: unknown) {
  if (!source || typeof source !== "object") return null;

  const entries = Object.entries(source as Record<string, unknown>).filter(
    ([key]) =>
      key.startsWith("branding_") ||
      key.endsWith("Color") ||
      key.endsWith("Font") ||
      key === "fontFamily" ||
      key === "secondaryFont" ||
      key === "menuLayout",
  );

  if (entries.length === 0) return null;
  return Object.fromEntries(entries);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const branchName =
      typeof body?.branchName === "string" ? body.branchName.trim() : "";

    if (!branchName) {
      return NextResponse.json(
        { error: "Branch name is required." },
        { status: 400 },
      );
    }

    if (branchName.length < 2) {
      return NextResponse.json(
        { error: "Branch name must be at least 2 characters." },
        { status: 400 },
      );
    }

    if (branchName.length > 80) {
      return NextResponse.json(
        { error: "Branch name must be 80 characters or less." },
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

    // Get the current profile to find the active tenant
    const { data: profile } = await admin
      .from("profiles")
      .select("tenant_id, role")
      .eq("id", user.id)
      .maybeSingle();

    if (!profile || !profile.tenant_id) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    // Clone subscription plan and owner details from the current active tenant
    const { data: currentTenant } = await admin
      .from("tenants")
      .select("business_email, owner_name, subscription_plan, settings")
      .eq("id", profile.tenant_id)
      .maybeSingle();

    if (!currentTenant) {
      return NextResponse.json(
        { error: "Current tenant not found" },
        { status: 404 },
      );
    }

    const normalizedUserEmail = user.email.trim().toLowerCase();
    const normalizedBusinessEmail =
      currentTenant.business_email?.trim().toLowerCase() ?? "";

    const isBusinessEmailOwner =
      normalizedBusinessEmail.length > 0 &&
      normalizedBusinessEmail === normalizedUserEmail;
    const isTenantAdmin =
      profile.role === "admin" && Boolean(profile.tenant_id);

    // Allow either exact business email ownership OR active tenant admin access.
    if (!isBusinessEmailOwner && !isTenantAdmin) {
      return NextResponse.json(
        { error: "Forbidden: You are not allowed to manage branches." },
        { status: 403 },
      );
    }

    const branchOwnerBusinessEmail =
      currentTenant.business_email?.trim() || user.email;
    const inheritedBrandingSettings = extractBrandingSettings(
      currentTenant.settings,
    );

    const tenantFeatures = await getTenantFeatures(profile.tenant_id);
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

    const { data: existingBranch } = await admin
      .from("tenants")
      .select("id")
      .eq("business_email", branchOwnerBusinessEmail)
      .ilike("business_name", branchName)
      .maybeSingle();

    if (existingBranch) {
      return NextResponse.json(
        { error: "A branch with this name already exists." },
        { status: 409 },
      );
    }

    // Insert the new tenant
    const { data: newTenant, error: createError } = await admin
      .from("tenants")
      .insert({
        business_name: branchName,
        business_email: branchOwnerBusinessEmail,
        owner_name: currentTenant.owner_name,
        subscription_plan: currentTenant.subscription_plan,
        settings: inheritedBrandingSettings ?? undefined,
        status: "approved",
      })
      .select("id")
      .single();

    if (createError || !newTenant) {
      console.error(createError);
      return NextResponse.json(
        { error: "Failed to create branch" },
        { status: 500 },
      );
    }

    // Switch the active tenant to the new branch
    const { error: profileError } = await admin
      .from("profiles")
      .update({ tenant_id: newTenant.id })
      .eq("id", user.id);

    if (profileError) {
      return NextResponse.json(
        { error: "Failed to switch to new branch" },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true, tenantId: newTenant.id });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
