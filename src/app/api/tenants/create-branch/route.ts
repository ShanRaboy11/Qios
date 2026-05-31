import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export async function POST(req: NextRequest) {
  try {
    const { branchName } = await req.json();

    if (!branchName) {
      return NextResponse.json({ error: "Missing branchName" }, { status: 400 });
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
      .select("tenant_id")
      .eq("id", user.id)
      .maybeSingle();

    if (!profile || !profile.tenant_id) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    // Clone subscription plan and owner details from the current active tenant
    const { data: currentTenant } = await admin
      .from("tenants")
      .select("business_email, owner_name, subscription_plan")
      .eq("id", profile.tenant_id)
      .maybeSingle();

    if (!currentTenant) {
      return NextResponse.json({ error: "Current tenant not found" }, { status: 404 });
    }

    // Ensure the user actually owns this tenant
    if (currentTenant.business_email?.toLowerCase() !== user.email.toLowerCase()) {
      return NextResponse.json({ error: "Forbidden: You are not the owner" }, { status: 403 });
    }

    // Insert the new tenant
    const { data: newTenant, error: createError } = await admin
      .from("tenants")
      .insert({
        name: branchName.trim(), // Assuming 'name' is the original column for business_name? Wait, it's 'business_name' and 'name'. Let's populate both.
        business_name: branchName.trim(),
        business_email: currentTenant.business_email,
        owner_name: currentTenant.owner_name,
        subscription_plan: currentTenant.subscription_plan,
        status: "approved"
      })
      .select("id")
      .single();

    if (createError || !newTenant) {
      console.error(createError);
      return NextResponse.json({ error: "Failed to create branch" }, { status: 500 });
    }

    // Switch the active tenant to the new branch
    const { error: profileError } = await admin
      .from("profiles")
      .update({ tenant_id: newTenant.id })
      .eq("id", user.id);

    if (profileError) {
      return NextResponse.json({ error: "Failed to switch to new branch" }, { status: 500 });
    }

    return NextResponse.json({ success: true, tenantId: newTenant.id });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
