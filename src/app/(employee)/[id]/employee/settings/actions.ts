"use server";

import crypto from "crypto";
import { revalidatePath } from "next/cache";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { EmployeeSettingsPageData, SettingsActionState } from "./types";

const DEFAULT_OPERATIONAL_SETTINGS = {
  terminal: "counter-1",
  defaultView: "scanner",
  autoLogoff: "10",
  quickPin: "",
  soundQueue: true,
  soundScan: true,
  soundStock: false,
  notifyEmail: true,
  notifyPush: true,
};

const DEFAULT_WEEKLY_SCHEDULE = [
  { day: "Monday", enabled: true, start: "09:00", end: "17:00" },
  { day: "Tuesday", enabled: true, start: "09:00", end: "17:00" },
  { day: "Wednesday", enabled: true, start: "09:00", end: "17:00" },
  { day: "Thursday", enabled: true, start: "09:00", end: "17:00" },
  { day: "Friday", enabled: true, start: "09:00", end: "17:00" },
  { day: "Saturday", enabled: true, start: "09:00", end: "15:00" },
  { day: "Sunday", enabled: false, start: "09:00", end: "17:00" },
];

function emptyActionState(error = "", success = ""): SettingsActionState {
  return {
    error,
    success,
    fieldErrors: {},
  };
}

function toText(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : "";
}

function toBoolean(value: FormDataEntryValue | null, fallback = false) {
  if (typeof value !== "string") return fallback;
  return ["true", "1", "on", "yes"].includes(value.trim().toLowerCase());
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

function normalizeAutoLogoff(value: FormDataEntryValue | null) {
  const text = toText(value);
  if (!text || text === "never") return 0;

  const parsed = Number.parseInt(text, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 10;
}

function parseWeeklySchedule(value: FormDataEntryValue | null) {
  if (typeof value !== "string" || !value.trim()) {
    return DEFAULT_WEEKLY_SCHEDULE;
  }

  try {
    const parsed = JSON.parse(value) as Array<{
      day: string;
      enabled: boolean;
      start: string;
      end: string;
    }>;

    if (!Array.isArray(parsed) || parsed.length === 0) {
      return DEFAULT_WEEKLY_SCHEDULE;
    }

    return parsed
      .map((item) => ({
        day: String(item.day || "").trim(),
        enabled: Boolean(item.enabled),
        start: typeof item.start === "string" ? item.start : "09:00",
        end: typeof item.end === "string" ? item.end : "17:00",
      }))
      .filter((item) => Boolean(item.day));
  } catch {
    return DEFAULT_WEEKLY_SCHEDULE;
  }
}

async function getEmployeeSettingsContext(tenantId: string) {
  const supabase = await createSupabaseServerClient();
  const admin = createSupabaseAdminClient();

  const [{ data: userData }, { data: sessionData }] = await Promise.all([
    supabase.auth.getUser(),
    supabase.auth.getSession(),
  ]);

  const user = userData.user ?? sessionData.session?.user ?? null;

  if (!user) {
    throw new Error("Unauthorized");
  }

  const { data: profile, error: profileError } = await admin
    .from("profiles")
    .select(
      "id, tenant_id, full_name, phone_number, username, role, app_role_id",
    )
    .eq("id", user.id)
    .maybeSingle();

  if (profileError || !profile) {
    throw new Error("Unauthorized");
  }

  if (profile.role !== "super_admin" && profile.tenant_id !== tenantId) {
    throw new Error("Unauthorized");
  }

  let roleLabel = profile.role === "super_admin" ? "Super Admin" : "Employee";

  if (profile.app_role_id) {
    const { data: roleRow } = await admin
      .from("roles")
      .select("name")
      .eq("id", profile.app_role_id)
      .eq("tenant_id", tenantId)
      .maybeSingle();

    if (roleRow?.name) {
      roleLabel = roleRow.name;
    }
  }

  let { data: employeeSettings, error: employeeSettingsError } = await admin
    .from("employee_settings")
    .select(
      "terminal, default_view, auto_logoff_minutes, quick_pin_hash, sound_queue, sound_scan, sound_stock, notify_email, notify_push, weekly_schedule",
    )
    .eq("profile_id", user.id)
    .maybeSingle();

  if (
    employeeSettingsError?.message?.includes("weekly_schedule") ||
    employeeSettingsError?.message?.includes("schema cache")
  ) {
    const fallback = await admin
      .from("employee_settings")
      .select(
        "terminal, default_view, auto_logoff_minutes, quick_pin_hash, sound_queue, sound_scan, sound_stock, notify_email, notify_push",
      )
      .eq("profile_id", user.id)
      .maybeSingle();
    employeeSettings = fallback.data;
    employeeSettingsError = fallback.error;
  }

  if (employeeSettingsError) {
    throw new Error(employeeSettingsError.message);
  }

  const weeklySchedule = Array.isArray(employeeSettings?.weekly_schedule)
    ? employeeSettings.weekly_schedule
        .map((item: any) => ({
          day: String(item?.day || "").trim(),
          enabled: Boolean(item?.enabled),
          start: typeof item?.start === "string" ? item.start : "09:00",
          end: typeof item?.end === "string" ? item.end : "17:00",
        }))
        .filter((item: { day: string }) => Boolean(item.day))
    : DEFAULT_WEEKLY_SCHEDULE;

  return {
    supabase,
    admin,
    user,
    profile,
    roleLabel,
    employeeSettings,
    weeklySchedule,
  };
}

export async function getEmployeeSettingsPageData(
  tenantId: string,
): Promise<EmployeeSettingsPageData> {
  const { user, profile, roleLabel, employeeSettings, weeklySchedule } =
    await getEmployeeSettingsContext(tenantId);

  return {
    profile: {
      fullName: profile.full_name || user.email || "Employee",
      displayName:
        profile.username || profile.full_name || user.email || "Employee",
      email: user.email || "",
      phoneNumber: profile.phone_number || "",
      roleLabel,
      employeeId: profile.username || profile.id.slice(0, 8).toUpperCase(),
    },
    operational: {
      terminal:
        employeeSettings?.terminal || DEFAULT_OPERATIONAL_SETTINGS.terminal,
      defaultView:
        employeeSettings?.default_view ||
        DEFAULT_OPERATIONAL_SETTINGS.defaultView,
      autoLogoff:
        employeeSettings?.auto_logoff_minutes === 0
          ? "never"
          : String(
              employeeSettings?.auto_logoff_minutes ||
                Number(DEFAULT_OPERATIONAL_SETTINGS.autoLogoff),
            ),
      quickPin: "",
      soundQueue:
        employeeSettings?.sound_queue ??
        DEFAULT_OPERATIONAL_SETTINGS.soundQueue,
      soundScan:
        employeeSettings?.sound_scan ?? DEFAULT_OPERATIONAL_SETTINGS.soundScan,
      soundStock:
        employeeSettings?.sound_stock ??
        DEFAULT_OPERATIONAL_SETTINGS.soundStock,
      notifyEmail:
        employeeSettings?.notify_email ??
        DEFAULT_OPERATIONAL_SETTINGS.notifyEmail,
      notifyPush:
        employeeSettings?.notify_push ??
        DEFAULT_OPERATIONAL_SETTINGS.notifyPush,
      weeklySchedule,
    },
  };
}

export async function saveEmployeeProfileSettings(
  tenantId: string,
  _state: SettingsActionState,
  formData: FormData,
) {
  try {
    const { admin, user, profile } = await getEmployeeSettingsContext(tenantId);

    const fullName = toText(formData.get("fullName")) || profile.full_name;
    const displayName = toText(formData.get("displayName")) || fullName;
    const phoneNumber = toText(formData.get("phoneNumber"));

    const { error: profileError } = await admin
      .from("profiles")
      .update({
        full_name: fullName,
        phone_number: phoneNumber || null,
        username: displayName || null,
      })
      .eq("id", user.id);

    if (profileError) {
      throw new Error(profileError.message);
    }

    const { data: authUserData } = await admin.auth.admin.getUserById(user.id);
    const existingMetadata = authUserData.user?.user_metadata ?? {};

    const { error: authError } = await admin.auth.admin.updateUserById(
      user.id,
      {
        user_metadata: {
          ...existingMetadata,
          full_name: fullName,
          display_name: displayName,
          phone_number: phoneNumber || undefined,
        },
      },
    );

    if (authError) {
      throw new Error(authError.message);
    }

    revalidatePath(`/${tenantId}/employee/settings`, "page");
    return emptyActionState("", "Profile details saved successfully.");
  } catch (error) {
    return emptyActionState(
      error instanceof Error
        ? error.message
        : "Unable to save profile details.",
    );
  }
}

export async function saveEmployeeOperationalSettings(
  tenantId: string,
  _state: SettingsActionState,
  formData: FormData,
) {
  try {
    const { admin, user } = await getEmployeeSettingsContext(tenantId);

    const terminal =
      toText(formData.get("terminal")) || DEFAULT_OPERATIONAL_SETTINGS.terminal;
    const defaultView =
      toText(formData.get("defaultView")) ||
      DEFAULT_OPERATIONAL_SETTINGS.defaultView;
    const autoLogoffMinutes = normalizeAutoLogoff(formData.get("autoLogoff"));
    const quickPin = toText(formData.get("quickPin"));
    const pinHash = quickPin
      ? crypto.createHash("sha256").update(quickPin).digest("hex")
      : null;

    const payload: Record<string, unknown> = {
      profile_id: user.id,
      terminal,
      default_view: defaultView,
      auto_logoff_minutes: autoLogoffMinutes,
      sound_queue: toBoolean(
        formData.get("soundQueue"),
        DEFAULT_OPERATIONAL_SETTINGS.soundQueue,
      ),
      sound_scan: toBoolean(
        formData.get("soundScan"),
        DEFAULT_OPERATIONAL_SETTINGS.soundScan,
      ),
      sound_stock: toBoolean(
        formData.get("soundStock"),
        DEFAULT_OPERATIONAL_SETTINGS.soundStock,
      ),
      notify_email: toBoolean(
        formData.get("notifyEmail"),
        DEFAULT_OPERATIONAL_SETTINGS.notifyEmail,
      ),
      notify_push: toBoolean(
        formData.get("notifyPush"),
        DEFAULT_OPERATIONAL_SETTINGS.notifyPush,
      ),
      weekly_schedule: parseWeeklySchedule(formData.get("weeklySchedule")),
    };

    if (pinHash) {
      payload.quick_pin_hash = pinHash;
    }

    const { error } = await admin
      .from("employee_settings")
      .upsert(payload, { onConflict: "profile_id" });

    if (error) {
      throw new Error(error.message);
    }

    revalidatePath(`/${tenantId}/employee/settings`, "page");
    return emptyActionState("", "Preferences saved successfully.");
  } catch (error) {
    return emptyActionState(
      error instanceof Error ? error.message : "Unable to save preferences.",
    );
  }
}

export async function updateEmployeePassword(
  _tenantId: string,
  _state: SettingsActionState,
  formData: FormData,
) {
  try {
    const supabase = await createSupabaseServerClient();

    const [{ data: userData }, { data: sessionData }] = await Promise.all([
      supabase.auth.getUser(),
      supabase.auth.getSession(),
    ]);

    const user = userData.user ?? sessionData.session?.user ?? null;

    if (!user?.email) {
      throw new Error("Unauthorized");
    }

    const currentPassword = toText(formData.get("currentPassword"));
    const newPassword = toText(formData.get("newPassword"));
    const confirmPassword = toText(formData.get("confirmPassword"));

    if (!currentPassword || !newPassword || !confirmPassword) {
      throw new Error("Please complete all password fields.");
    }

    const strength = validatePassword(newPassword);

    if (!strength.hasMinLength) {
      throw new Error("New password must be at least 8 characters.");
    }

    if (!strength.hasUppercase) {
      throw new Error(
        "New password must contain at least one uppercase letter.",
      );
    }

    if (!strength.hasLowercase) {
      throw new Error(
        "New password must contain at least one lowercase letter.",
      );
    }

    if (!strength.hasDigit) {
      throw new Error("New password must contain at least one digit.");
    }

    if (!strength.hasSpecial) {
      throw new Error(
        "New password must contain at least one special character.",
      );
    }

    if (newPassword !== confirmPassword) {
      throw new Error("New password and confirmation do not match.");
    }

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: currentPassword,
    });

    if (signInError) {
      throw new Error("Current password is incorrect.");
    }

    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (updateError) {
      throw new Error(updateError.message);
    }

    return emptyActionState("", "Password updated successfully.");
  } catch (error) {
    return emptyActionState(
      error instanceof Error ? error.message : "Unable to update password.",
    );
  }
}
