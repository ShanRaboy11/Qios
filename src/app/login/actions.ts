"use server";

import { createClient } from "@supabase/supabase-js";
import { decrypt, hashValue } from "@/lib/encryption";
import { verifySync } from "otplib";
import { sendSecurityVerificationEmail } from "@/lib/email";

// Ensure this uses the service role because we may need to bypass RLS to read tenant settings securely
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function checkLoginTwoFactorRequired(tenantId: string) {
  if (!tenantId) return { required: false };

  const { data: tenant } = await supabaseAdmin.from("tenants").select("settings, business_name").eq("id", tenantId).single();
  
  if (!tenant || !tenant.settings) return { required: false };
  
  const settings = tenant.settings as Record<string, any>;
  
  if (settings.two_factor_enabled === true) {
    return { 
      required: true,
      tenantId: tenantId,
      businessName: tenant.business_name,
      hasAuthenticator: settings.has_authenticator === true,
      hasEmail: settings.has_email === true
    };
  }
  
  return { required: false };
}

export async function sendLoginEmailCode(tenantId: string, email: string, businessName: string) {
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const codeHashed = hashValue(code);
  const expiresAt = new Date(Date.now() + 10 * 60000).toISOString(); // 10 mins

  const { data: tenant } = await supabaseAdmin.from("tenants").select("settings").eq("id", tenantId).single();
  const settings = (tenant?.settings as Record<string, any>) || {};

  settings.login_email_code_hashed = codeHashed;
  settings.login_email_code_expires_at = expiresAt;

  await supabaseAdmin.from("tenants").update({ settings }).eq("id", tenantId);

  const res = await sendSecurityVerificationEmail({
    to: email,
    businessName: businessName || "Qios",
    code,
  });

  if (!res.success) throw new Error("Unable to send verification email");
  return { success: true };
}

export async function verifyLoginTwoFactorCode(tenantId: string, code: string) {
  const { data: tenant } = await supabaseAdmin.from("tenants").select("settings").eq("id", tenantId).single();
  if (!tenant || !tenant.settings) throw new Error("Invalid tenant configuration.");
  
  const settings = tenant.settings as Record<string, any>;
  let isValid = false;

  // Check if it's a backup recovery code
  if (settings.recovery_codes_hashed && Array.isArray(settings.recovery_codes_hashed)) {
    const hashedCode = hashValue(code);
    if (settings.recovery_codes_hashed.includes(hashedCode)) {
      // Consume the code
      const updatedCodes = settings.recovery_codes_hashed.filter((c: string) => c !== hashedCode);
      settings.recovery_codes_hashed = updatedCodes;
      await supabaseAdmin.from("tenants").update({ settings }).eq("id", tenantId);
      return { success: true, method: "recovery" };
    }
  }

  // 1. Check Authenticator if enabled
  if (settings.has_authenticator === true && settings.totp_secret_encrypted) {
    try {
      const secret = decrypt(settings.totp_secret_encrypted);
      const result = verifySync({ token: code, secret });
      if (result.valid) {
        isValid = true;
      }
    } catch (err) {
      // ignore
    }
  }

  // 2. Check Email if enabled
  if (!isValid && settings.has_email === true && settings.login_email_code_hashed && settings.login_email_code_expires_at) {
    if (new Date(settings.login_email_code_expires_at) > new Date()) {
      if (settings.login_email_code_hashed === hashValue(code)) {
        isValid = true;
        // Clear email code
        settings.login_email_code_hashed = null;
        settings.login_email_code_expires_at = null;
        await supabaseAdmin.from("tenants").update({ settings }).eq("id", tenantId);
      }
    }
  }

  if (isValid) {
    return { success: true };
  }

  throw new Error("Invalid verification code. Please check your authenticator app or email.");
}
