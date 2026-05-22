"use server";

import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { generateSecret, generateURI, verifySync } from "otplib";
import { decrypt, encrypt, hashValue } from "@/lib/encryption";
import {
  sendContactVerificationEmail,
  sendSecurityVerificationEmail,
} from "@/lib/email";
import crypto from "crypto";
import type {
  SettingsActionState,
  TenantBillingHistoryData,
  TenantBillingSettingsData,
  TenantBrandingSettingsData,
  TenantNotificationSettingsData,
  TenantPaymentMethodData,
  TenantSubscriptionPlanData,
  TenantSecuritySettingsData,
  TenantSettingsPageData,
  TenantStoreSettingsData,
} from "./types";

const EMPTY_ACTION_STATE: SettingsActionState = {
  error: "",
  success: "",
  fieldErrors: {},
};

const RECOVERY_CODES_ENCRYPTED_FIELD = "recovery_codes_encrypted";

function serializeRecoveryCodes(recoveryCodes: string[]) {
  return encrypt(JSON.stringify(recoveryCodes));
}

function deserializeRecoveryCodes(encodedCodes: unknown) {
  if (typeof encodedCodes !== "string" || !encodedCodes) return [];

  try {
    const decoded = JSON.parse(decrypt(encodedCodes));
    return Array.isArray(decoded)
      ? decoded.filter((code) => typeof code === "string")
      : [];
  } catch {
    return [];
  }
}

// helper: build recovery code arrays from scratch
function generateFreshRecoveryCodes() {
  const codes = Array.from({ length: 10 }, () =>
    crypto.randomBytes(4).toString("hex"),
  );
  return {
    codes,
    hashed: codes.map((c) => hashValue(c)),
    encrypted: serializeRecoveryCodes(codes),
  };
}

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

const BILLING_DEFAULTS: TenantBillingSettingsData = {
  currentPlanName: "Basic",
  currentPlanBadge: "Starter Ready",
  currentPlanPriceMonthly: "1,499",
  currentPlanPriceAnnually: "15,290",
  currentPlanColor: "bg-[#ffc670]",
  nextBillingDate: new Date(
    Date.now() + 30 * 24 * 60 * 60 * 1000,
  ).toISOString(),
  availablePlans: [],
  paymentMethods: [],
  billingHistory: [],
};

const NOTIFICATION_DEFAULTS: TenantNotificationSettingsData = {
  receiveSecurityAlerts: true,
  receiveDailySalesSummary: true,
  receiveLowStockAlerts: true,
  receiveStaffOvertimeAlerts: false,
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

function readSettingBoolean(
  settings: Record<string, unknown> | null,
  keys: string[],
  fallback: boolean,
) {
  if (!settings) return fallback;

  for (const key of keys) {
    const value = settings[key];
    if (typeof value === "boolean") {
      return value;
    }
    if (typeof value === "string" && value.trim() !== "") {
      return toBoolean(value);
    }
  }

  return fallback;
}

function readSettingStringArray(
  settings: Record<string, unknown> | null,
  key: string,
) {
  const value = settings?.[key];
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string");
}

function readSettingObjectArray<T>(
  settings: Record<string, unknown> | null,
  key: string,
) {
  const value = settings?.[key];
  if (!Array.isArray(value)) return [] as T[];
  return value.filter(
    (item): item is T => typeof item === "object" && item !== null,
  );
}

function formatMoney(amount: number | string, currency: string) {
  const numeric = typeof amount === "number" ? amount : Number(amount);
  const safeAmount = Number.isNaN(numeric) ? 0 : numeric;
  const symbol =
    currency === "USD"
      ? "$"
      : currency === "EUR"
        ? "€"
        : currency === "GBP"
          ? "£"
          : currency === "JPY"
            ? "¥"
            : currency === "AUD"
              ? "A$"
              : currency === "CAD"
                ? "C$"
                : currency === "SGD"
                  ? "S$"
                  : "₱";
  return `${symbol}${safeAmount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function normalizePlanName(name: string) {
  return name.trim().toLowerCase();
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
    .select(
      "id, business_name, business_email, owner_name, subscription_plan, settings",
    )
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

  const isDeactivated = settings?.is_deactivated === true;

  const { data: plans } = await admin
    .from("subscription_plans")
    .select(
      "id, name, color, badge, price_monthly, price_annually, features, display_order",
    )
    .order("display_order", { ascending: true });

  const availablePlans: TenantSubscriptionPlanData[] = (plans ?? []).map(
    (plan) => ({
      id: String(plan.id),
      name: toText(plan.name),
      color: toText(plan.color),
      badge: toText(plan.badge),
      priceMonthly: toText(plan.price_monthly),
      priceAnnually: toText(plan.price_annually),
      features:
        plan.features && typeof plan.features === "object"
          ? (plan.features as Record<string, unknown>)
          : {},
      displayOrder:
        typeof plan.display_order === "number" ? plan.display_order : 0,
    }),
  );

  const matchedPlan = availablePlans.find(
    (plan) =>
      normalizePlanName(plan.name) ===
      normalizePlanName(toText(tenant.subscription_plan ?? "")),
  );

  const currentPlan = matchedPlan ?? availablePlans[0] ?? null;

  const { data: paymentMethodRows } = await admin
    .from("tenant_payment_methods")
    .select(
      "id, provider, display_name, last4, exp_month, exp_year, cardholder_name, is_default, created_at",
    )
    .eq("tenant_id", tenantId)
    .order("is_default", { ascending: false })
    .order("created_at", { ascending: false });

  const paymentMethods: TenantPaymentMethodData[] = (
    paymentMethodRows ?? []
  ).map((method) => ({
    id: String(method.id),
    provider: toText(method.provider),
    displayName: toText(method.display_name),
    last4: toText(method.last4),
    expMonth: toText(method.exp_month),
    expYear: toText(method.exp_year),
    cardholderName: toText(method.cardholder_name),
    isDefault: method.is_default === true,
    addedAt: toText(method.created_at),
  }));

  const { data: billingHistoryRows } = await admin
    .from("tenant_billing_history")
    .select(
      "id, invoice_number, description, amount, currency, status, billing_date, invoice_url",
    )
    .eq("tenant_id", tenantId)
    .order("billing_date", { ascending: false });

  const billingHistory: TenantBillingHistoryData[] = (
    billingHistoryRows ?? []
  ).map((entry) => ({
    id: String(entry.id),
    invoiceNumber: toText(entry.invoice_number),
    description: toText(entry.description),
    amount: formatMoney(entry.amount ?? 0, toText(entry.currency) || "PHP"),
    currency: toText(entry.currency) || "PHP",
    status: toText(entry.status),
    billingDate: toText(entry.billing_date),
    invoiceUrl: toText(entry.invoice_url) || undefined,
  }));

  const nextBillingDate =
    toText(settings?.next_billing_date) || BILLING_DEFAULTS.nextBillingDate;

  const billing: TenantBillingSettingsData = {
    currentPlanName: currentPlan?.name || BILLING_DEFAULTS.currentPlanName,
    currentPlanBadge: currentPlan?.badge || BILLING_DEFAULTS.currentPlanBadge,
    currentPlanPriceMonthly:
      currentPlan?.priceMonthly || BILLING_DEFAULTS.currentPlanPriceMonthly,
    currentPlanPriceAnnually:
      currentPlan?.priceAnnually || BILLING_DEFAULTS.currentPlanPriceAnnually,
    currentPlanColor: currentPlan?.color || BILLING_DEFAULTS.currentPlanColor,
    nextBillingDate,
    availablePlans,
    paymentMethods,
    billingHistory,
  };

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
      readSettingValue(settings, ["qios_subdomain", "qiosSubdomain"]) ||
      BRANDING_DEFAULTS.qiosSubdomain,
    customDomain:
      readSettingValue(settings, ["custom_domain", "customDomain"]) ||
      BRANDING_DEFAULTS.customDomain,
    instagramUrl:
      readSettingValue(settings, ["instagram_url", "instagramUrl"]) ||
      BRANDING_DEFAULTS.instagramUrl,
    facebookUrl:
      readSettingValue(settings, ["facebook_url", "facebookUrl"]) ||
      BRANDING_DEFAULTS.facebookUrl,
    tiktokUrl:
      readSettingValue(settings, ["tiktok_url", "tiktokUrl"]) ||
      BRANDING_DEFAULTS.tiktokUrl,
    dashboardLogoUrl:
      readSettingValue(settings, ["branding_logo_dashboard"]) || undefined,
    kioskSplashUrl:
      readSettingValue(settings, ["branding_kiosk_splash"]) || undefined,
    faviconUrl: readSettingValue(settings, ["branding_favicon"]) || undefined,
    customThemes: Array.isArray(settings?.branding_custom_themes)
      ? (settings.branding_custom_themes as any[])
      : [],
  };

  const notifications: TenantNotificationSettingsData = {
    receiveSecurityAlerts: readSettingBoolean(
      settings,
      ["receive_security_alerts", "security_alerts"],
      NOTIFICATION_DEFAULTS.receiveSecurityAlerts,
    ),
    receiveDailySalesSummary: readSettingBoolean(
      settings,
      ["receive_daily_sales_summary", "daily_sales_summary"],
      NOTIFICATION_DEFAULTS.receiveDailySalesSummary,
    ),
    receiveLowStockAlerts: readSettingBoolean(
      settings,
      ["receive_low_stock_alerts", "low_stock_alerts"],
      NOTIFICATION_DEFAULTS.receiveLowStockAlerts,
    ),
    receiveStaffOvertimeAlerts: readSettingBoolean(
      settings,
      ["receive_staff_overtime_alerts", "staff_overtime_alerts"],
      NOTIFICATION_DEFAULTS.receiveStaffOvertimeAlerts,
    ),
  };

  // read per-user 2fa data from the profiles table, not tenant.settings
  const { data: userTwoFa } = await admin
    .from("profiles")
    .select(
      "two_factor_enabled, has_authenticator, has_email_2fa, authenticator_updated_at, email_2fa_updated_at, recovery_codes_generated_at",
    )
    .eq("id", user.id)
    .maybeSingle();

  const security: TenantSecuritySettingsData = {
    requireTwoFactorAuth: settings?.require_two_factor_auth === true,
    twoFactorEnabled: userTwoFa?.two_factor_enabled === true,
    hasAuthenticator: userTwoFa?.has_authenticator === true,
    hasEmail: userTwoFa?.has_email_2fa === true,
    authenticatorUpdatedAt: userTwoFa?.authenticator_updated_at as
      | string
      | undefined,
    emailUpdatedAt: userTwoFa?.email_2fa_updated_at as string | undefined,
    recoveryCodesGeneratedAt: userTwoFa?.recovery_codes_generated_at as
      | string
      | undefined,
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
    billing,
    notifications,
    security,
    isDeactivated,
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
      success: "Branding and appearance settings saved successfully.",
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

export async function saveTenantNotificationSettings(
  tenantId: string,
  _previousState: SettingsActionState,
  formData: FormData,
): Promise<SettingsActionState> {
  try {
    const { admin } = await requireTenantContext(tenantId);

    const receiveSecurityAlerts = toBoolean(
      formData.get("receiveSecurityAlerts"),
    );
    const receiveDailySalesSummary = toBoolean(
      formData.get("receiveDailySalesSummary"),
    );
    const receiveLowStockAlerts = toBoolean(
      formData.get("receiveLowStockAlerts"),
    );
    const receiveStaffOvertimeAlerts = toBoolean(
      formData.get("receiveStaffOvertimeAlerts"),
    );

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
        receive_security_alerts: receiveSecurityAlerts,
        receive_daily_sales_summary: receiveDailySalesSummary,
        receive_low_stock_alerts: receiveLowStockAlerts,
        receive_staff_overtime_alerts: receiveStaffOvertimeAlerts,
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

    return {
      ...EMPTY_ACTION_STATE,
      success: "Notification preferences saved successfully.",
    };
  } catch (error) {
    return {
      ...EMPTY_ACTION_STATE,
      error:
        error instanceof Error
          ? error.message
          : "Unable to save notification preferences.",
    };
  }
}

export async function updateTenantSubscriptionPlan(
  tenantId: string,
  planName: string,
) {
  const { admin, user } = await requireTenantContext(tenantId);
  const normalizedPlanName = normalizePlanName(planName);

  const { data: plan, error: planError } = await admin
    .from("subscription_plans")
    .select("name, price_monthly")
    .ilike("name", planName.trim())
    .maybeSingle();

  if (planError) throw new Error(planError.message);
  if (!plan) throw new Error("Selected plan is not available.");

  const { data: tenant, error: tenantError } = await admin
    .from("tenants")
    .select("settings")
    .eq("id", tenantId)
    .maybeSingle();

  if (tenantError) throw new Error(tenantError.message);

  const nextBillingDate = new Date(
    Date.now() + 30 * 24 * 60 * 60 * 1000,
  ).toISOString();
  const settings = mergeSettings(
    tenant?.settings && typeof tenant.settings === "object"
      ? (tenant.settings as Record<string, unknown>)
      : null,
    { next_billing_date: nextBillingDate },
  );

  const { error: updateError } = await admin
    .from("tenants")
    .update({ subscription_plan: plan.name, settings })
    .eq("id", tenantId);

  if (updateError) throw new Error(updateError.message);

  const invoiceNumber = `INV-${Date.now().toString().slice(-8)}`;
  const amountMatch = String(plan.price_monthly).replace(/[^0-9.]/g, "");
  await admin.from("tenant_billing_history").insert({
    tenant_id: tenantId,
    invoice_number: invoiceNumber,
    description: `Subscription plan updated to ${plan.name}`,
    amount: amountMatch || 0,
    currency: "PHP",
    status: "paid",
    billing_date: new Date().toISOString(),
  });

  revalidatePath(`/${tenantId}/settings`);

  return { success: true };
}

export async function saveTenantPaymentMethod(
  tenantId: string,
  _previousState: SettingsActionState,
  formData: FormData,
): Promise<SettingsActionState> {
  try {
    await requireTenantContext(tenantId);

    const methodId = toText(formData.get("methodId"));
    const provider = toText(formData.get("provider"));
    const displayName = toText(formData.get("displayName"));
    const isDefault = toBoolean(formData.get("isDefault"));

    const fieldErrors: Record<string, string> = {};
    if (!provider) fieldErrors.provider = "Payment provider is required.";
    if (!displayName) fieldErrors.displayName = "Account name is required.";

    let mappedLast4 = "0000";
    let mappedExpMonth = "12";
    let mappedExpYear = "2099";
    let mappedCardholderName = "";

    const normalizedProvider = provider.toLowerCase();
    if (normalizedProvider === "visa" || normalizedProvider === "mastercard") {
      const last4 = toText(formData.get("last4"));
      const expMonth = toText(formData.get("expMonth"));
      const expYear = toText(formData.get("expYear"));
      const cardholderName = toText(formData.get("cardholderName"));

      if (!cardholderName) {
        fieldErrors.cardholderName = "Cardholder name is required.";
      }
      if (!last4 || !/^[0-9]{4}$/.test(last4)) {
        fieldErrors.last4 = "Enter the last 4 digits.";
      }
      if (!expMonth || Number(expMonth) < 1 || Number(expMonth) > 12) {
        fieldErrors.expMonth = "Enter a valid month.";
      }
      if (!expYear || Number(expYear) < 2026) {
        fieldErrors.expYear = "Enter a valid year.";
      }

      mappedLast4 = last4;
      mappedExpMonth = expMonth.padStart(2, "0");
      mappedExpYear = expYear;
      mappedCardholderName = cardholderName;
    } else if (normalizedProvider === "gcash") {
      const mobileNumber = toText(formData.get("mobileNumber"));
      if (!mobileNumber || !/^[0-9]{10,11}$/.test(mobileNumber)) {
        fieldErrors.mobileNumber = "Enter a valid 10-11 digit mobile number.";
      }
      mappedCardholderName = mobileNumber;
      mappedLast4 = mobileNumber ? mobileNumber.slice(-4) : "0000";
    } else if (normalizedProvider === "paypal" || normalizedProvider === "stripe") {
      const email = toText(formData.get("email"));
      if (!email || !validateEmail(email)) {
        fieldErrors.email = "Enter a valid email address.";
      }
      mappedCardholderName = email;
    } else {
      // other
      const description = toText(formData.get("description"));
      if (!description) {
        fieldErrors.description = "Description/Reference is required.";
      }
      mappedCardholderName = description;
    }

    if (Object.keys(fieldErrors).length > 0) {
      return { ...EMPTY_ACTION_STATE, fieldErrors };
    }

    const { admin } = await requireTenantContext(tenantId);

    if (isDefault) {
      await admin
        .from("tenant_payment_methods")
        .update({ is_default: false })
        .eq("tenant_id", tenantId);
    }

    if (methodId) {
      const { error } = await admin
        .from("tenant_payment_methods")
        .update({
          provider,
          display_name: displayName,
          last4: mappedLast4,
          exp_month: mappedExpMonth,
          exp_year: mappedExpYear,
          cardholder_name: mappedCardholderName,
          is_default: isDefault,
        })
        .eq("id", methodId)
        .eq("tenant_id", tenantId);

      if (error) throw new Error(error.message);
    } else {
      const { error } = await admin.from("tenant_payment_methods").insert({
        tenant_id: tenantId,
        provider,
        display_name: displayName,
        last4: mappedLast4,
        exp_month: mappedExpMonth,
        exp_year: mappedExpYear,
        cardholder_name: mappedCardholderName,
        is_default: isDefault,
      });

      if (error) throw new Error(error.message);
    }

    revalidatePath(`/${tenantId}/settings`);
    return {
      ...EMPTY_ACTION_STATE,
      success: "Payment method saved successfully.",
    };
  } catch (error) {
    return {
      ...EMPTY_ACTION_STATE,
      error:
        error instanceof Error
          ? error.message
          : "Unable to save payment method.",
    };
  }
}

export async function setTenantDefaultPaymentMethod(
  tenantId: string,
  methodId: string,
) {
  const { admin } = await requireTenantContext(tenantId);

  const { error: clearError } = await admin
    .from("tenant_payment_methods")
    .update({ is_default: false })
    .eq("tenant_id", tenantId);

  if (clearError) throw new Error(clearError.message);

  const { error: updateError } = await admin
    .from("tenant_payment_methods")
    .update({ is_default: true })
    .eq("id", methodId)
    .eq("tenant_id", tenantId);

  if (updateError) throw new Error(updateError.message);

  revalidatePath(`/${tenantId}/settings`);
  return { success: true };
}

export async function deleteTenantPaymentMethod(
  tenantId: string,
  methodId: string,
) {
  const { admin } = await requireTenantContext(tenantId);

  const { error } = await admin
    .from("tenant_payment_methods")
    .delete()
    .eq("id", methodId)
    .eq("tenant_id", tenantId);

  if (error) throw new Error(error.message);

  revalidatePath(`/${tenantId}/settings`);
  return { success: true };
}

export interface TenantActiveSessionData {
  id: string;
  user_agent: string | null;
  ip_address: string | null;
  created_at: string;
  updated_at: string;
}

export async function getTenantActiveSessions(tenantId: string) {
  const { supabase } = await requireTenantContext(tenantId);

  const [{ data: sessionData }, { data: sessions, error: sessionsError }] =
    await Promise.all([
      supabase.auth.getSession(),
      supabase.rpc("get_my_sessions"),
    ]);

  if (sessionsError) {
    throw new Error(sessionsError.message);
  }

  const currentSessionId = (sessionData.session as any)?.id ?? null;

  return {
    currentSessionId,
    sessions: (sessions ?? []) as TenantActiveSessionData[],
  };
}

export async function revokeTenantSession(tenantId: string, sessionId: string) {
  const { supabase } = await requireTenantContext(tenantId);

  const { error } = await supabase.rpc("revoke_session", {
    session_id: sessionId,
  });

  if (error) {
    throw new Error(error.message);
  }

  return { success: true };
}

export async function saveTenantCustomThemes(
  tenantId: string,
  customThemes: any[],
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
    },
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

// ─── 2fa management ─────────────────────────────────────────────────────────

export async function setupAuthenticatorTwoFactor(tenantId: string) {
  const { admin } = await getAuthenticatedTenantContext(tenantId);
  const { data: tenant } = await admin
    .from("tenants")
    .select("business_name")
    .eq("id", tenantId)
    .single();
  const businessName = tenant?.business_name || "Qios Tenant";

  const secret = generateSecret();
  const otpauthUrl = generateURI({
    issuer: "Qios",
    label: businessName,
    secret,
  });

  return { secret, otpauthUrl };
}

export async function verifyAndEnableAuthenticatorTwoFactor(
  tenantId: string,
  secret: string,
  token: string,
) {
  // verify the totp code using the correct otplib v13 verifySync api
  const result = verifySync({ token, secret });
  if (!result.valid) throw new Error("Invalid verification code.");

  const { admin, user } = await getAuthenticatedTenantContext(tenantId);

  // check if the user already has recovery codes to avoid regenerating
  const { data: existingProfile } = await admin
    .from("profiles")
    .select("recovery_codes_hashed, recovery_codes_encrypted")
    .eq("id", user.id)
    .single();

  let recoveryCodes: string[];
  let recoveryCodesHashed: string[];
  let recoveryCodesEncrypted: string;

  const existingCodes = deserializeRecoveryCodes(
    existingProfile?.recovery_codes_encrypted,
  );
  const existingHashed: string[] = existingProfile?.recovery_codes_hashed || [];

  if (existingHashed.length && existingCodes.length) {
    // reuse existing recovery codes so enabling a second method doesn't regenerate them
    recoveryCodes = existingCodes;
    recoveryCodesHashed = existingHashed;
    recoveryCodesEncrypted = existingProfile!.recovery_codes_encrypted!;
  } else {
    const fresh = generateFreshRecoveryCodes();
    recoveryCodes = fresh.codes;
    recoveryCodesHashed = fresh.hashed;
    recoveryCodesEncrypted = fresh.encrypted;
  }

  // write 2fa data to the user's own profile row
  const { error } = await admin
    .from("profiles")
    .update({
      two_factor_enabled: true,
      has_authenticator: true,
      authenticator_updated_at: new Date().toISOString(),
      totp_secret_encrypted: encrypt(secret),
      recovery_codes_hashed: recoveryCodesHashed,
      [RECOVERY_CODES_ENCRYPTED_FIELD]: recoveryCodesEncrypted,
      recovery_codes_generated_at: new Date().toISOString(),
    })
    .eq("id", user.id);
  if (error) throw new Error(error.message);

  revalidatePath(`/${tenantId}/settings`);

  return { success: true, recoveryCodes };
}

export async function setupEmailTwoFactor(tenantId: string) {
  const { admin, user } = await getAuthenticatedTenantContext(tenantId);

  const { data: tenant } = await admin
    .from("tenants")
    .select("business_name")
    .eq("id", tenantId)
    .single();

  const emailToUse = user.email;
  const businessName = tenant?.business_name || "Qios";

  if (!emailToUse)
    throw new Error("No valid email found to send verification code to.");

  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const codeHashed = hashValue(code);
  const expiresAt = new Date(Date.now() + 10 * 60000).toISOString(); // 10 mins

  // store the verification code in the user's profile, not tenant.settings
  const { error } = await admin
    .from("profiles")
    .update({
      login_email_code_hashed: codeHashed,
      login_email_code_expires_at: expiresAt,
    })
    .eq("id", user.id);

  if (error) throw new Error("Failed to store verification code.");

  const res = await sendSecurityVerificationEmail({
    to: emailToUse,
    businessName,
    code,
  });

  if (!res.success) {
    throw new Error("Unable to send verification email. Please try again.");
  }

  return { success: true };
}

export async function verifyAndEnableEmailTwoFactor(
  tenantId: string,
  code: string,
) {
  const { admin, user } = await getAuthenticatedTenantContext(tenantId);

  // read pending verification code from the user's profile
  const { data: profile } = await admin
    .from("profiles")
    .select(
      "login_email_code_hashed, login_email_code_expires_at, recovery_codes_hashed, recovery_codes_encrypted",
    )
    .eq("id", user.id)
    .single();

  if (
    !profile?.login_email_code_hashed ||
    !profile?.login_email_code_expires_at
  ) {
    throw new Error("No pending verification code.");
  }

  if (new Date(profile.login_email_code_expires_at) < new Date()) {
    throw new Error("Verification code has expired. Please request a new one.");
  }

  if (profile.login_email_code_hashed !== hashValue(code)) {
    throw new Error("Invalid verification code.");
  }

  // reuse existing recovery codes if already generated, otherwise create fresh ones
  let recoveryCodes: string[];
  let recoveryCodesHashed: string[];
  let recoveryCodesEncrypted: string;
  let recoveryCodesGeneratedAt: string;

  const existingCodes = deserializeRecoveryCodes(
    profile.recovery_codes_encrypted,
  );
  const existingHashed: string[] = profile.recovery_codes_hashed || [];

  if (existingHashed.length && existingCodes.length) {
    recoveryCodes = existingCodes;
    recoveryCodesHashed = existingHashed;
    recoveryCodesEncrypted = profile.recovery_codes_encrypted!;
    recoveryCodesGeneratedAt = new Date().toISOString();
  } else {
    const fresh = generateFreshRecoveryCodes();
    recoveryCodes = fresh.codes;
    recoveryCodesHashed = fresh.hashed;
    recoveryCodesEncrypted = fresh.encrypted;
    recoveryCodesGeneratedAt = new Date().toISOString();
  }

  const { error } = await admin
    .from("profiles")
    .update({
      two_factor_enabled: true,
      has_email_2fa: true,
      email_2fa_updated_at: new Date().toISOString(),
      recovery_codes_hashed: recoveryCodesHashed,
      [RECOVERY_CODES_ENCRYPTED_FIELD]: recoveryCodesEncrypted,
      recovery_codes_generated_at: recoveryCodesGeneratedAt,
      login_email_code_hashed: null, // clear after successful verification
      login_email_code_expires_at: null,
    })
    .eq("id", user.id);
  if (error) throw new Error(error.message);

  revalidatePath(`/${tenantId}/settings`);

  return { success: true, recoveryCodes };
}

export async function disableTwoFactorAuth(
  tenantId: string,
  passwordConfirm: string,
  method: "all" | "authenticator" | "email" = "all",
) {
  const { admin, supabase, user } =
    await getAuthenticatedTenantContext(tenantId);

  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();
  if (!authUser?.email) throw new Error("Not authenticated");

  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: authUser.email,
    password: passwordConfirm,
  });

  if (signInError) throw new Error("Incorrect password.");

  // read current 2fa state from user's profile
  const { data: profile } = await admin
    .from("profiles")
    .select("has_authenticator, has_email_2fa")
    .eq("id", user.id)
    .single();

  const profilePatch: Record<string, unknown> = {};

  if (method === "all") {
    profilePatch.two_factor_enabled = false;
    profilePatch.has_authenticator = false;
    profilePatch.has_email_2fa = false;
    profilePatch.totp_secret_encrypted = null;
    profilePatch.recovery_codes_hashed = null;
    profilePatch[RECOVERY_CODES_ENCRYPTED_FIELD] = null;
    profilePatch.recovery_codes_generated_at = null;
    profilePatch.authenticator_updated_at = null;
    profilePatch.email_2fa_updated_at = null;
    profilePatch.login_email_code_hashed = null;
    profilePatch.login_email_code_expires_at = null;
  } else {
    const remainingHasAuthenticator =
      method === "email" ? profile?.has_authenticator === true : false;
    const remainingHasEmail =
      method === "authenticator" ? profile?.has_email_2fa === true : false;

    if (method === "authenticator") {
      profilePatch.has_authenticator = false;
      profilePatch.totp_secret_encrypted = null;
      profilePatch.authenticator_updated_at = null;
    } else {
      profilePatch.has_email_2fa = false;
      profilePatch.email_2fa_updated_at = null;
      profilePatch.login_email_code_hashed = null;
      profilePatch.login_email_code_expires_at = null;
    }

    if (!remainingHasAuthenticator && !remainingHasEmail) {
      // no methods left — fully disable 2fa and clear recovery codes
      profilePatch.two_factor_enabled = false;
      profilePatch.recovery_codes_hashed = null;
      profilePatch[RECOVERY_CODES_ENCRYPTED_FIELD] = null;
      profilePatch.recovery_codes_generated_at = null;
    } else {
      profilePatch.two_factor_enabled = true;
    }
  }

  const { error } = await admin
    .from("profiles")
    .update(profilePatch)
    .eq("id", user.id);
  if (error) throw new Error(error.message);

  revalidatePath(`/${tenantId}/settings`);

  return { success: true };
}

export async function generateRecoveryCodes(tenantId: string) {
  const { admin, user } = await getAuthenticatedTenantContext(tenantId);

  const fresh = generateFreshRecoveryCodes();

  // write new recovery codes to the user's own profile row
  const { error } = await admin
    .from("profiles")
    .update({
      recovery_codes_hashed: fresh.hashed,
      [RECOVERY_CODES_ENCRYPTED_FIELD]: fresh.encrypted,
      recovery_codes_generated_at: new Date().toISOString(),
    })
    .eq("id", user.id);
  if (error) throw new Error(error.message);

  revalidatePath(`/${tenantId}/settings`);

  return { success: true, recoveryCodes: fresh.codes };
}

export async function deactivateTenantStore(
  tenantId: string,
  deactivate: boolean,
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
    { is_deactivated: deactivate },
  );

  const { error: updateError } = await admin
    .from("tenants")
    .update({ settings })
    .eq("id", tenantId);

  if (updateError) throw new Error(updateError.message);

  revalidatePath(`/${tenantId}/settings`);

  return { success: true };
}

export async function deleteTenantAccount(tenantId: string) {
  const { supabase, admin, user } = await requireTenantContext(tenantId);

  // clear session cookies first so the client is clean
  await supabase.auth.signOut();

  // delete user from auth triggers cascading db cleanup
  const { error } = await admin.auth.admin.deleteUser(user.id);
  if (error) throw new Error(error.message);

  return { success: true };
}
