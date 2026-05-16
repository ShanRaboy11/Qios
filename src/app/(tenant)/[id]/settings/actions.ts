"use server";

import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type {
  SettingsActionState,
  TenantBrandingSettingsData,
  TenantSecuritySettingsData,
  TenantSettingsPageData,
  TenantStoreSettingsData,
} from "./types";

const EMPTY_ACTION_STATE: SettingsActionState = {
  error: "",
  success: "",
  fieldErrors: {},
};

const BRANDING_DEFAULTS: TenantBrandingSettingsData = {
  primaryColor: "#FFC670",
  secondaryColor: "#FFF9F0",
  accentColor: "#00FFFF",
  fontFamily: "inter",
  secondaryFont: "inter",
  menuLayout: "grid",
  qiosSubdomain: "",
  customDomain: "",
  instagramUrl: "",
  facebookUrl: "",
  tiktokUrl: "",
};

const STORE_DEFAULTS: TenantStoreSettingsData = {
  storeName: "",
  publicContactEmail: "",
  publicPhoneNumber: "",
  physicalAddress: "",
  currency: "PHP",
  timezone: "Asia/Manila",
  taxRate: "12",
};

function toText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function toBoolean(value: unknown) {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") {
    return ["true", "1", "on", "yes"].includes(value.trim().toLowerCase());
  }
  return false;
}

function readSettingValue(
  settings: Record<string, unknown> | null,
  keys: string[],
) {
  if (!settings) return "";

  for (const key of keys) {
    const value = settings[key];
    if (typeof value === "string" && value.trim() !== "") {
      return value.trim();
    }
  }

  return "";
}

function mergeSettings(
  currentSettings: Record<string, unknown> | null,
  patch: Record<string, unknown>,
) {
  return {
    ...(currentSettings && typeof currentSettings === "object"
      ? currentSettings
      : {}),
    ...patch,
  };
}

async function getAuthenticatedTenantContext(tenantId: string) {
  if (!tenantId) {
    throw new Error("settings:forbidden");
  }

  const supabase = await createSupabaseServerClient();
  const admin = createSupabaseAdminClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("settings:unauthenticated");
  }

  const { data: profile, error: profileError } = await admin
    .from("profiles")
    .select("role, tenant_id, full_name, phone_number")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError || !profile) {
    throw new Error("settings:forbidden");
  }

  const role = typeof profile.role === "string" ? profile.role : "";
  const profileTenantId =
    typeof profile.tenant_id === "string" ? profile.tenant_id : "";

  if (
    role !== "super_admin" &&
    !(role === "admin" && profileTenantId === tenantId)
  ) {
    throw new Error("settings:forbidden");
  }

  return { supabase, admin, user };
}

export async function getTenantSettings(
  tenantId: string,
): Promise<TenantSettingsPageData> {
  const { admin, user } = await getAuthenticatedTenantContext(tenantId);

  const { data: tenant, error: tenantError } = await admin
    .from("tenants")
    .select("id, business_name, business_email, owner_name, settings")
    .eq("id", tenantId)
    .maybeSingle();

  if (tenantError) {
    throw new Error(tenantError.message);
  }

  if (!tenant) {
    throw new Error("settings:not_found");
  }

  const { data: authUser, error: authUserError } =
    await admin.auth.admin.getUserById(user.id);

  if (authUserError) {
    throw new Error(authUserError.message);
  }

  const authMetadata =
    (authUser?.user?.user_metadata as Record<string, unknown> | undefined) ??
    {};
  const fullName = toText(
    authMetadata.full_name ?? authMetadata.display_name ?? tenant.owner_name,
  );
  const phoneNumber = toText(
    authMetadata.phone_number ?? authMetadata.contact_number ?? "",
  );
  const avatarUrl = toText(authMetadata.avatar_url ?? "");

  const settings =
    tenant.settings && typeof tenant.settings === "object"
      ? (tenant.settings as Record<string, unknown>)
      : null;

  const store: TenantStoreSettingsData = {
    storeName: toText(tenant.business_name),
    publicContactEmail: toText(tenant.business_email),
    publicPhoneNumber: readSettingValue(settings, [
      "store_phone_number",
      "public_phone_number",
      "phone_number",
    ]),
    physicalAddress: readSettingValue(settings, [
      "store_address",
      "physical_address",
      "address",
    ]),
    currency:
      readSettingValue(settings, ["currency", "currency_code"]) ||
      STORE_DEFAULTS.currency,
    timezone:
      readSettingValue(settings, ["timezone", "time_zone"]) ||
      STORE_DEFAULTS.timezone,
    taxRate:
      readSettingValue(settings, ["tax_rate", "taxRate"]) ||
      STORE_DEFAULTS.taxRate,
  };

  const branding: TenantBrandingSettingsData = {
    primaryColor:
      readSettingValue(settings, [
        "branding_primary_color",
        "primary_color",
        "primaryColor",
      ]) || BRANDING_DEFAULTS.primaryColor,
    secondaryColor:
      readSettingValue(settings, [
        "branding_secondary_color",
        "secondary_color",
        "secondaryColor",
      ]) || BRANDING_DEFAULTS.secondaryColor,
    accentColor:
      readSettingValue(settings, [
        "branding_accent_color",
        "accent_color",
        "accentColor",
      ]) || BRANDING_DEFAULTS.accentColor,
    fontFamily:
      readSettingValue(settings, [
        "branding_font_family",
        "font_family",
        "fontFamily",
      ]) || BRANDING_DEFAULTS.fontFamily,
    menuLayout:
      readSettingValue(settings, [
        "branding_menu_layout",
        "menu_layout",
        "menuLayout",
      ]) || BRANDING_DEFAULTS.menuLayout,
    secondaryFont:
      readSettingValue(settings, [
        "branding_secondary_font",
        "secondary_font",
        "secondaryFont",
      ]) || BRANDING_DEFAULTS.secondaryFont,
    qiosSubdomain:
      readSettingValue(settings, [
        "qios_subdomain",
        "qiosSubdomain",
      ]) || BRANDING_DEFAULTS.qiosSubdomain,
    customDomain:
      readSettingValue(settings, [
        "custom_domain",
        "customDomain",
      ]) || BRANDING_DEFAULTS.customDomain,
    instagramUrl:
      readSettingValue(settings, [
        "instagram_url",
        "instagramUrl",
      ]) || BRANDING_DEFAULTS.instagramUrl,
    facebookUrl:
      readSettingValue(settings, [
        "facebook_url",
        "facebookUrl",
      ]) || BRANDING_DEFAULTS.facebookUrl,
    tiktokUrl:
      readSettingValue(settings, [
        "tiktok_url",
        "tiktokUrl",
      ]) || BRANDING_DEFAULTS.tiktokUrl,
    dashboardLogoUrl: readSettingValue(settings, ["branding_logo_dashboard"]) || undefined,
    kioskSplashUrl: readSettingValue(settings, ["branding_kiosk_splash"]) || undefined,
    faviconUrl: readSettingValue(settings, ["branding_favicon"]) || undefined,
    customThemes: Array.isArray(settings?.branding_custom_themes) 
      ? (settings.branding_custom_themes as any[])
      : [],
  };

  const security: TenantSecuritySettingsData = {
    requireTwoFactorAuth: toBoolean(
      readSettingValue(settings, [
        "require_two_factor_auth",
        "requireTwoFactorAuth",
      ]),
    ),
  };

  return {
    profile: {
      name: fullName,
      email: toText(authUser?.user?.email ?? ""),
      phoneNumber,
      avatarUrl: avatarUrl || undefined,
    },
    store,
    branding,
    security,
  };
}

function validateEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePassword(password: string) {
  return {
    hasMinLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasDigit: /[0-9]/.test(password),
    hasSpecial: /[^A-Za-z0-9]/.test(password),
  };
}

async function requireTenantContext(tenantId: string) {
  return getAuthenticatedTenantContext(tenantId);
}

export async function saveTenantProfileSettings(
  tenantId: string,
  _previousState: SettingsActionState,
  formData: FormData,
): Promise<SettingsActionState> {
  try {
    const { admin, user } = await requireTenantContext(tenantId);

    const name = toText(formData.get("name"));
    const email = toText(formData.get("email"));
    const phoneNumber = toText(formData.get("phoneNumber"));

    const fieldErrors: Record<string, string> = {};

    if (!name) fieldErrors.name = "Name is required.";
    if (!email) {
      fieldErrors.email = "Email address is required.";
    } else if (!validateEmail(email)) {
      fieldErrors.email = "A valid email address is required.";
    }

    if (phoneNumber && !/^[0-9]{10}$/.test(phoneNumber)) {
      fieldErrors.phoneNumber = "Enter a valid 10-digit mobile number.";
    }

    if (Object.keys(fieldErrors).length > 0) {
      return {
        ...EMPTY_ACTION_STATE,
        fieldErrors,
      };
    }

    const { data: authUser, error: authUserError } =
      await admin.auth.admin.getUserById(user.id);

    if (authUserError) {
      throw new Error(authUserError.message);
    }

    const currentMetadata =
      (authUser?.user?.user_metadata as Record<string, unknown> | undefined) ??
      {};

    const { error: authUpdateError } = await admin.auth.admin.updateUserById(
      user.id,
      {
        email,
        user_metadata: {
          ...currentMetadata,
          full_name: name,
          display_name: name,
          phone_number: phoneNumber || null,
        },
      },
    );

    if (authUpdateError) {
      throw new Error(authUpdateError.message);
    }

    const { error: profileUpdateError } = await admin
      .from("profiles")
      .update({
        full_name: name,
        phone_number: phoneNumber || null,
      })
      .eq("id", user.id)
      .eq("tenant_id", tenantId);

    if (profileUpdateError) {
      throw new Error(profileUpdateError.message);
    }

    const avatarFile = formData.get("avatar");
    if (
      avatarFile &&
      typeof (avatarFile as any).name === "string" &&
      (avatarFile as File).size > 0
    ) {
      try {
        const file = avatarFile as File;
        const objectPath = `${tenantId}/avatar-${Date.now()}-${file.name}`;
        const { error: uploadError } = await admin.storage
          .from("verification-docs")
          .upload(objectPath, file, { upsert: true });

        if (uploadError) {
          throw uploadError;
        }

        const { data: publicUrlData } = admin.storage
          .from("verification-docs")
          .getPublicUrl(objectPath);

        const avatarUrl = publicUrlData?.publicUrl ?? null;

        if (avatarUrl) {
          await admin.auth.admin.updateUserById(user.id, {
            user_metadata: {
              ...currentMetadata,
              full_name: name,
              display_name: name,
              phone_number: phoneNumber || null,
              avatar_url: avatarUrl,
            },
          });
        }
      } catch (err) {
        return {
          ...EMPTY_ACTION_STATE,
          error:
            err instanceof Error ? err.message : "Failed to upload avatar.",
        };
      }
    }

    revalidatePath(`/${tenantId}/settings`);

    return {
      ...EMPTY_ACTION_STATE,
      success: "Profile settings saved successfully.",
    };
  } catch (error) {
    return {
      ...EMPTY_ACTION_STATE,
      error:
        error instanceof Error
          ? error.message
          : "Unable to save profile settings.",
    };
  }
}

export async function saveTenantStoreSettings(
  tenantId: string,
  _previousState: SettingsActionState,
  formData: FormData,
): Promise<SettingsActionState> {
  try {
    const { admin } = await requireTenantContext(tenantId);

    const storeName = toText(formData.get("storeName"));
    const publicContactEmail = toText(formData.get("publicContactEmail"));
    const publicPhoneNumber = toText(formData.get("publicPhoneNumber"));
    const physicalAddress = toText(formData.get("physicalAddress"));
    const currency = toText(formData.get("currency"));
    const timezone = toText(formData.get("timezone"));
    const taxRate = toText(formData.get("taxRate"));

    const fieldErrors: Record<string, string> = {};

    if (!storeName) fieldErrors.storeName = "Store name is required.";
    if (!publicContactEmail) {
      fieldErrors.publicContactEmail = "Public contact email is required.";
    } else if (!validateEmail(publicContactEmail)) {
      fieldErrors.publicContactEmail = "A valid email address is required.";
    }

    if (taxRate) {
      const numericTaxRate = Number(taxRate);
      if (
        Number.isNaN(numericTaxRate) ||
        numericTaxRate < 0 ||
        numericTaxRate > 100
      ) {
        fieldErrors.taxRate = "Tax rate must be a number between 0 and 100.";
      }
    }

    if (publicPhoneNumber && !/^[0-9]{10}$/.test(publicPhoneNumber)) {
      fieldErrors.publicPhoneNumber = "Enter a valid 10-digit mobile number.";
    }

    if (Object.keys(fieldErrors).length > 0) {
      return {
        ...EMPTY_ACTION_STATE,
        fieldErrors,
      };
    }

    const { data: tenant, error: tenantError } = await admin
      .from("tenants")
      .select("settings")
      .eq("id", tenantId)
      .maybeSingle();

    if (tenantError) {
      throw new Error(tenantError.message);
    }

    const settings = mergeSettings(
      tenant?.settings && typeof tenant.settings === "object"
        ? (tenant.settings as Record<string, unknown>)
        : null,
      {
        store_phone_number: publicPhoneNumber,
        store_address: physicalAddress,
        currency,
        timezone,
        tax_rate: taxRate,
      },
    );

    const { error: updateError } = await admin
      .from("tenants")
      .update({
        business_name: storeName,
        business_email: publicContactEmail,
        settings,
      })
      .eq("id", tenantId);

    if (updateError) {
      throw new Error(updateError.message);
    }

    revalidatePath(`/${tenantId}/settings`);

    return {
      ...EMPTY_ACTION_STATE,
      success: "Store details saved successfully.",
    };
  } catch (error) {
    return {
      ...EMPTY_ACTION_STATE,
      error:
        error instanceof Error
          ? error.message
          : "Unable to save store details.",
    };
  }
}

export async function saveTenantBrandingSettings(
  tenantId: string,
  _previousState: SettingsActionState,
  formData: FormData,
): Promise<SettingsActionState> {
  try {
    const { admin } = await requireTenantContext(tenantId);

    const primaryColor = toText(formData.get("primaryColor"));
    const secondaryColor = toText(formData.get("secondaryColor"));
    const accentColor = toText(formData.get("accentColor"));
    const fontFamily = toText(formData.get("fontFamily"));
    const secondaryFont = toText(formData.get("secondaryFont"));
    const menuLayout = toText(formData.get("menuLayout"));
    const qiosSubdomain = toText(formData.get("qiosSubdomain"));
    const customDomain = toText(formData.get("customDomain"));
    const instagramUrl = toText(formData.get("instagramUrl"));
    const facebookUrl = toText(formData.get("facebookUrl"));
    const tiktokUrl = toText(formData.get("tiktokUrl"));

    const fieldErrors: Record<string, string> = {};
    const colorPattern = /^#[0-9a-fA-F]{6}$/;

    if (!colorPattern.test(primaryColor)) {
      fieldErrors.primaryColor = "Primary color must be a valid hex value.";
    }
    if (!colorPattern.test(secondaryColor)) {
      fieldErrors.secondaryColor = "Secondary color must be a valid hex value.";
    }
    if (!colorPattern.test(accentColor)) {
      fieldErrors.accentColor = "Accent color must be a valid hex value.";
    }

    const validFonts = new Set(["inter", "playfair", "roboto"]);
    if (!validFonts.has(fontFamily)) {
      fieldErrors.fontFamily = "Please select a valid font family.";
    }

    const validLayouts = new Set(["grid", "list"]);
    if (!validLayouts.has(menuLayout)) {
      fieldErrors.menuLayout = "Please select a valid menu layout.";
    }

    if (Object.keys(fieldErrors).length > 0) {
      return {
        ...EMPTY_ACTION_STATE,
        fieldErrors,
      };
    }

    const { data: tenant, error: tenantError } = await admin
      .from("tenants")
      .select("settings")
      .eq("id", tenantId)
      .maybeSingle();

    if (tenantError) {
      throw new Error(tenantError.message);
    }

    const settings = mergeSettings(
      tenant?.settings && typeof tenant.settings === "object"
        ? (tenant.settings as Record<string, unknown>)
        : null,
      {
        branding_primary_color: primaryColor,
        branding_secondary_color: secondaryColor,
        branding_accent_color: accentColor,
        branding_font_family: fontFamily,
        branding_secondary_font: secondaryFont,
        branding_menu_layout: menuLayout,
        qios_subdomain: qiosSubdomain,
        custom_domain: customDomain,
        instagram_url: instagramUrl,
        facebook_url: facebookUrl,
        tiktok_url: tiktokUrl,
      },
    );

    const { error: updateError } = await admin
      .from("tenants")
      .update({ settings })
      .eq("id", tenantId);

    if (updateError) {
      throw new Error(updateError.message);
    }

    try {
      const dashboardLogo = formData.get("dashboardLogo");
      const kioskSplash = formData.get("kioskSplash");
      const favicon = formData.get("favicon");

      const uploaded: Record<string, string> = {};

      const uploads = [
        { file: dashboardLogo, key: "branding_logo_dashboard" },
        { file: kioskSplash, key: "branding_kiosk_splash" },
        { file: favicon, key: "branding_favicon" },
      ];

      for (const item of uploads) {
        if (
          item.file &&
          typeof (item.file as any).name === "string" &&
          (item.file as File).size > 0
        ) {
          const file = item.file as File;
          const objectPath = `${tenantId}/branding-${item.key}-${Date.now()}-${file.name}`;
          const { error: uploadError } = await admin.storage
            .from("verification-docs")
            .upload(objectPath, file, { upsert: true });

          if (uploadError) {
            throw uploadError;
          }

          const { data: publicUrlData } = admin.storage
            .from("verification-docs")
            .getPublicUrl(objectPath);

          const url = publicUrlData?.publicUrl ?? null;
          if (url) uploaded[item.key] = url;
        }
      }

      if (Object.keys(uploaded).length > 0) {
        const { data: tenantAfter, error: tenantAfterError } = await admin
          .from("tenants")
          .select("settings")
          .eq("id", tenantId)
          .maybeSingle();

        if (tenantAfterError) throw tenantAfterError;

        const newSettings = mergeSettings(
          tenantAfter?.settings && typeof tenantAfter.settings === "object"
            ? (tenantAfter.settings as Record<string, unknown>)
            : null,
          uploaded,
        );

        const { error: finalUpdateError } = await admin
          .from("tenants")
          .update({ settings: newSettings })
          .eq("id", tenantId);

        if (finalUpdateError) throw finalUpdateError;
      }
    } catch (err) {
      return {
        ...EMPTY_ACTION_STATE,
        error: err instanceof Error ? err.message : "Failed to upload assets.",
      };
    }

    revalidatePath(`/${tenantId}/settings`);

    return {
      ...EMPTY_ACTION_STATE,
      success: "Branding settings saved successfully.",
    };
  } catch (error) {
    return {
      ...EMPTY_ACTION_STATE,
      error:
        error instanceof Error
          ? error.message
          : "Unable to save branding settings.",
    };
  }
}

export async function saveTenantCustomThemes(
  tenantId: string,
  customThemes: any[]
) {
  const { admin } = await requireTenantContext(tenantId);

  const { data: tenant, error: tenantError } = await admin
    .from("tenants")
    .select("settings")
    .eq("id", tenantId)
    .maybeSingle();

  if (tenantError) throw new Error(tenantError.message);

  const settings = mergeSettings(
    tenant?.settings && typeof tenant.settings === "object"
      ? (tenant.settings as Record<string, unknown>)
      : null,
    {
      branding_custom_themes: customThemes,
    }
  );

  const { error: updateError } = await admin
    .from("tenants")
    .update({ settings })
    .eq("id", tenantId);

  if (updateError) throw new Error(updateError.message);

  revalidatePath(`/${tenantId}/settings`);
  return { success: true };
}

export async function updateTenantTwoFactorPreference(
  tenantId: string,
  requireTwoFactorAuth: boolean,
) {
  const { admin } = await requireTenantContext(tenantId);

  const { data: tenant, error: tenantError } = await admin
    .from("tenants")
    .select("settings")
    .eq("id", tenantId)
    .maybeSingle();

  if (tenantError) {
    throw new Error(tenantError.message);
  }

  const settings = mergeSettings(
    tenant?.settings && typeof tenant.settings === "object"
      ? (tenant.settings as Record<string, unknown>)
      : null,
    {
      require_two_factor_auth: requireTwoFactorAuth,
    },
  );

  const { error: updateError } = await admin
    .from("tenants")
    .update({ settings })
    .eq("id", tenantId);

  if (updateError) {
    throw new Error(updateError.message);
  }

  revalidatePath(`/${tenantId}/settings`);

  return { success: true };
}

export async function revokeOtherTenantSessions(tenantId: string) {
  const { supabase } = await requireTenantContext(tenantId);

  const { error } = await supabase.auth.signOut({ scope: "others" });
  if (error) {
    throw new Error(error.message);
  }

  return { success: true };
}

export async function updateTenantPassword(
  tenantId: string,
  _previousState: SettingsActionState,
  formData: FormData,
): Promise<SettingsActionState> {
  try {
    const { admin, user } = await requireTenantContext(tenantId);

    const currentPassword = toText(formData.get("currentPassword"));
    const newPassword = toText(formData.get("newPassword"));
    const confirmPassword = toText(formData.get("confirmPassword"));

    const fieldErrors: Record<string, string> = {};

    if (!currentPassword) {
      fieldErrors.currentPassword = "Current password is required.";
    }

    if (!newPassword) {
      fieldErrors.newPassword = "New password is required.";
    } else {
      const strength = validatePassword(newPassword);
      if (!strength.hasMinLength) {
        fieldErrors.newPassword = "Password must be at least 8 characters.";
      } else if (!strength.hasUppercase) {
        fieldErrors.newPassword =
          "Password must contain at least one uppercase letter.";
      } else if (!strength.hasLowercase) {
        fieldErrors.newPassword =
          "Password must contain at least one lowercase letter.";
      } else if (!strength.hasDigit) {
        fieldErrors.newPassword = "Password must contain at least one digit.";
      } else if (!strength.hasSpecial) {
        fieldErrors.newPassword =
          "Password must contain at least one special character.";
      }
    }

    if (!confirmPassword) {
      fieldErrors.confirmPassword = "Please confirm your new password.";
    } else if (newPassword && confirmPassword !== newPassword) {
      fieldErrors.confirmPassword = "Passwords do not match.";
    }

    if (Object.keys(fieldErrors).length > 0) {
      return {
        ...EMPTY_ACTION_STATE,
        fieldErrors,
      };
    }

    const { data: authUser, error: authUserError } =
      await admin.auth.admin.getUserById(user.id);

    if (authUserError) {
      throw new Error(authUserError.message);
    }

    const email = toText(authUser?.user?.email ?? "");
    if (!email) {
      throw new Error("Unable to determine your account email.");
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error("Supabase credentials are not configured.");
    }

    const verifier = createSupabaseClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });

    const { error: signInError } = await verifier.auth.signInWithPassword({
      email,
      password: currentPassword,
    });

    if (signInError) {
      return {
        ...EMPTY_ACTION_STATE,
        error: "Current password is incorrect.",
        fieldErrors: {
          currentPassword: "Current password is incorrect.",
        },
      };
    }

    const { error: updateError } = await admin.auth.admin.updateUserById(
      user.id,
      {
        password: newPassword,
      },
    );

    if (updateError) {
      throw new Error(updateError.message);
    }

    revalidatePath(`/${tenantId}/settings`);

    return {
      ...EMPTY_ACTION_STATE,
      success: "Password updated successfully.",
    };
  } catch (error) {
    return {
      ...EMPTY_ACTION_STATE,
      error:
        error instanceof Error ? error.message : "Unable to update password.",
    };
  }
}
