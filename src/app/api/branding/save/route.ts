import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      tenantId,
      primaryColor,
      secondaryColor,
      accentColor,
      fontFamily,
      secondaryFont,
      menuLayout,
      uploaded,
    } = body;

    if (!tenantId) {
      return NextResponse.json({ error: "tenantId required" }, { status: 400 });
    }

    const admin = createSupabaseAdminClient();

    const { data: tenant, error: tenantError } = await admin
      .from("tenants")
      .select("settings")
      .eq("id", tenantId)
      .maybeSingle();

    if (tenantError) {
      throw tenantError;
    }

    const settings = {
      ...(tenant?.settings && typeof tenant.settings === "object"
        ? tenant.settings
        : {}),
      branding_primary_color: primaryColor,
      branding_secondary_color: secondaryColor,
      branding_accent_color: accentColor,
      branding_font_family: fontFamily,
      branding_secondary_font: secondaryFont,
      branding_menu_layout: menuLayout,
      ...(body.customThemes ? { branding_custom_themes: body.customThemes } : {}),
      ...(uploaded || {}),
    };

    const { error: updateError } = await admin
      .from("tenants")
      .update({ settings })
      .eq("id", tenantId);

    if (updateError) throw updateError;

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("branding save api error", err);
    return NextResponse.json(
      { error: err?.message || String(err) },
      { status: 500 },
    );
  }
}
