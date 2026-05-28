import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { sendAdminNotificationEmail } from "@/lib/email";

async function requireSuperAdmin(
  admin: ReturnType<typeof createSupabaseAdminClient>,
  token: string | null,
): Promise<
  { ok: true; userId: string } | { ok: false; status: number; message: string }
> {
  if (!token) {
    return { ok: false, status: 401, message: "Missing access token" };
  }

  const { data: userData, error: userErr } = await admin.auth.getUser(token);
  if (userErr || !userData?.user) {
    return { ok: false, status: 401, message: "Invalid access token" };
  }

  const { data: profile, error: profileErr } = await admin
    .from("profiles")
    .select("role, full_name")
    .eq("id", userData.user.id)
    .single();

  if (profileErr || !profile) {
    return { ok: false, status: 403, message: "Profile not found" };
  }

  if (profile.role !== "super_admin") {
    return { ok: false, status: 403, message: "Requires super_admin role" };
  }

  return { ok: true, userId: userData.user.id };
}

export async function POST(req: NextRequest) {
  const admin = createSupabaseAdminClient();
  const token = req.headers.get("authorization")?.split(" ")[1] ?? null;

  const auth = await requireSuperAdmin(admin, token);
  if (!auth.ok) {
    return NextResponse.json({ error: auth.message }, { status: auth.status });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const fullName = typeof body.fullName === "string" ? body.fullName.trim() : "";
  const notificationsEnabled = Boolean(body.emailNotificationsEnabled);

  if (!fullName) {
    return NextResponse.json({ error: "fullName is required" }, { status: 400 });
  }

  const { data: userData } = await admin.auth.getUser(token as string);
  const user = userData?.user;

  if (!user) {
    return NextResponse.json({ error: "Unable to resolve user" }, { status: 401 });
  }

  const { error: profileUpdateError } = await admin
    .from("profiles")
    .update({ full_name: fullName })
    .eq("id", user.id);

  if (profileUpdateError) {
    return NextResponse.json({ error: profileUpdateError.message }, { status: 500 });
  }

  const { error: settingsUpdateError } = await admin
    .from("platform_settings")
    .update({
      email_notifications_enabled: notificationsEnabled,
    })
    .eq("id", 1);

  if (settingsUpdateError) {
    return NextResponse.json({ error: settingsUpdateError.message }, { status: 500 });
  }

  if (!notificationsEnabled) {
    return NextResponse.json({ success: true, emailSkipped: true });
  }

  const recipient =
    process.env.SMTP_FROM_EMAIL?.trim() || process.env.SMTP_USER?.trim() || "";

  if (!recipient) {
    return NextResponse.json(
      {
        error:
          "SMTP_FROM_EMAIL is not configured, so the notification email cannot be sent.",
      },
      { status: 500 },
    );
  }

  const emailResult = await sendAdminNotificationEmail({
    to: recipient,
    adminName: fullName,
    notificationsEnabled,
  });

  if (!emailResult.success) {
    return NextResponse.json(
      {
        error: "Preference saved, but the notification email could not be sent.",
      },
      { status: 500 },
    );
  }

  return NextResponse.json({
    success: true,
    emailMessageId: emailResult.messageId,
  });
}