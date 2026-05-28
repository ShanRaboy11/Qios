import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import type { TenantBrandingSettingsData } from "@/app/(tenant)/[id]/settings/types";

function readStr(settings: Record<string, unknown> | null, keys: string[]): string {
  if (!settings) return "";
  for (const key of keys) {
    const v = settings[key];
    if (typeof v === "string" && v.trim()) return v.trim();
  }
  return "";
}

const BRANDING_DEFAULTS: Partial<TenantBrandingSettingsData> = {
  primaryColor: "#FFC670",
  secondaryColor: "#FFF9F0",
  accentColor: "#1E3932",
  fontFamily: "inter",
  secondaryFont: "inter",
  menuLayout: "grid",
};

/**
 * Fetches tenant branding and store name from the tenants table using the admin client.
 * Safe to call from server components and server actions (no auth required).
 */
export async function fetchTenantBranding(tenantId: string): Promise<{
  branding: Partial<TenantBrandingSettingsData>;
  storeName: string;
}> {
  const supabase = createSupabaseAdminClient();

  const { data: tenant } = await supabase
    .from("tenants")
    .select("settings, business_name")
    .eq("id", tenantId)
    .maybeSingle();

  const settings =
    tenant?.settings && typeof tenant.settings === "object"
      ? (tenant.settings as Record<string, unknown>)
      : null;

  const branding: Partial<TenantBrandingSettingsData> = {
    primaryColor:
      readStr(settings, ["branding_primary_color", "primary_color", "primaryColor"]) ||
      BRANDING_DEFAULTS.primaryColor,
    secondaryColor:
      readStr(settings, ["branding_secondary_color", "secondary_color", "secondaryColor"]) ||
      BRANDING_DEFAULTS.secondaryColor,
    accentColor:
      readStr(settings, ["branding_accent_color", "accent_color", "accentColor"]) ||
      BRANDING_DEFAULTS.accentColor,
    fontFamily:
      readStr(settings, ["branding_font_family", "font_family", "fontFamily"]) ||
      BRANDING_DEFAULTS.fontFamily,
    secondaryFont:
      readStr(settings, ["branding_secondary_font", "secondary_font", "secondaryFont"]) ||
      BRANDING_DEFAULTS.secondaryFont,
    menuLayout:
      readStr(settings, ["branding_menu_layout", "menu_layout", "menuLayout"]) ||
      BRANDING_DEFAULTS.menuLayout,
    dashboardLogoUrl:
      readStr(settings, ["branding_logo_dashboard"]) || undefined,
    kioskSplashUrl:
      readStr(settings, ["branding_kiosk_splash"]) || undefined,
    faviconUrl:
      readStr(settings, ["branding_favicon"]) || undefined,
  };

  return {
    branding,
    storeName: typeof tenant?.business_name === "string" ? tenant.business_name : "",
  };
}
