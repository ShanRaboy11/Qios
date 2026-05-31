import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export async function POST(req: NextRequest) {
  try {
    const { targetTenantId } = await req.json();

    if (!targetTenantId) {
      return NextResponse.json({ error: "Missing targetTenantId" }, { status: 400 });
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

    // Verify the target tenant exists and is owned by the same business email
    const { data: targetTenant, error: tenantError } = await admin
      .from("tenants")
      .select("id, business_email")
      .eq("id", targetTenantId)
      .maybeSingle();

    if (tenantError || !targetTenant) {
      return NextResponse.json({ error: "Tenant not found" }, { status: 404 });
    }

    if (targetTenant.business_email?.toLowerCase() !== user.email.toLowerCase()) {
      return NextResponse.json({ error: "Forbidden: You do not own this branch" }, { status: 403 });
    }

    // Update the profile's active tenant_id
    const { error: profileError } = await admin
      .from("profiles")
      .update({ tenant_id: targetTenantId })
      .eq("id", user.id);

    if (profileError) {
      return NextResponse.json({ error: "Failed to switch branch" }, { status: 500 });
    }

    return NextResponse.json({ success: true, tenantId: targetTenantId });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
