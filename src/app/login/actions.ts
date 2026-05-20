"use server";

import { createClient } from "@supabase/supabase-js";
import { decrypt, hashValue } from "@/lib/encryption";
import { verifySync } from "otplib";
import { sendSecurityVerificationEmail } from "@/lib/email";

// use service role to bypass rls when reading profile 2fa data securely
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function checkLoginTwoFactorRequired(
  tenantId: string,
  userId: string
) {
  if (!userId) return { required: false };

  // read 2fa config from the individual user's profile
  const { data: profile } = await supabaseAdmin
    .from("profiles")
    .select("two_factor_enabled, has_authenticator, has_email_2fa")
    .eq("id", userId)
    .single();

  if (!profile?.two_factor_enabled) return { required: false };

  // get business name for the email notification
  let businessName = "Qios";
  if (tenantId) {
    const { data: tenant } = await supabaseAdmin
      .from("tenants")
      .select("business_name")
      .eq("id", tenantId)
      .single();
    businessName = tenant?.business_name || "Qios";
  }

  return {
    required: true,
    tenantId,
    businessName,
    hasAuthenticator: profile.has_authenticator === true,
    hasEmail: profile.has_email_2fa === true,
  };
}

export async function sendLoginEmailCode(
  userId: string,
  email: string,
  businessName: string
) {
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const codeHashed = hashValue(code);
  const expiresAt = new Date(Date.now() + 10 * 60000).toISOString(); // 10 mins

  // store the hashed code in the user's own profile row
  const { error } = await supabaseAdmin
    .from("profiles")
    .update({
      login_email_code_hashed: codeHashed,
      login_email_code_expires_at: expiresAt,
    })
    .eq("id", userId);

  if (error) throw new Error("Failed to store verification code.");

  const res = await sendSecurityVerificationEmail({
    to: email,
    businessName: businessName || "Qios",
    code,
  });

  if (!res.success) throw new Error("Unable to send verification email");
  return { success: true };
}

export async function verifyLoginTwoFactorCode(userId: string, code: string) {
  const { data: profile } = await supabaseAdmin
    .from("profiles")
    .select(
      "has_authenticator, has_email_2fa, totp_secret_encrypted, recovery_codes_hashed, login_email_code_hashed, login_email_code_expires_at"
    )
    .eq("id", userId)
    .single();

  if (!profile) throw new Error("User profile not found.");

  let isValid = false;

  // 1. check backup recovery code first
  if (
    profile.recovery_codes_hashed &&
    Array.isArray(profile.recovery_codes_hashed)
  ) {
    const hashedCode = hashValue(code);
    if (profile.recovery_codes_hashed.includes(hashedCode)) {
      // consume the used recovery code so it can't be reused
      const updatedCodes = profile.recovery_codes_hashed.filter(
        (c: string) => c !== hashedCode
      );
      await supabaseAdmin
        .from("profiles")
        .update({ recovery_codes_hashed: updatedCodes })
        .eq("id", userId);
      return { success: true, method: "recovery" };
    }
  }

  // 2. check totp authenticator app if enabled
  if (profile.has_authenticator && profile.totp_secret_encrypted) {
    try {
      const secret = decrypt(profile.totp_secret_encrypted);
      const result = verifySync({ token: code, secret });
      if (result.valid) isValid = true;
    } catch {
      // ignore decryption or verification errors and fall through
    }
  }

  // 3. check email otp code if enabled
  if (
    !isValid &&
    profile.has_email_2fa &&
    profile.login_email_code_hashed &&
    profile.login_email_code_expires_at
  ) {
    if (new Date(profile.login_email_code_expires_at) > new Date()) {
      if (profile.login_email_code_hashed === hashValue(code)) {
        isValid = true;
        // clear the one-time email code after successful use
        await supabaseAdmin
          .from("profiles")
          .update({
            login_email_code_hashed: null,
            login_email_code_expires_at: null,
          })
          .eq("id", userId);
      }
    }
  }

  if (isValid) {
    return { success: true };
  }

  throw new Error(
    "Invalid verification code. Please check your authenticator app or email."
  );
}
