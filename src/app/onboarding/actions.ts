"use server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { sendContactVerificationEmail, sendRegistrationSuccessEmail } from "@/lib/email";
import type {
  OperationalSetupConfig,
  SubscriptionPlan,
  TenantSettings,
} from "@/types/tenant";

const getSubscriptionPlan = (packageId: string): SubscriptionPlan => {
  if (packageId === "basic" || packageId === "starter") return "basic";
  if (packageId === "business" || packageId === "growth") return "business";
  if (packageId === "enterprise" || packageId === "enterprises") return "enterprise";
  return "basic";
};

export async function sendContactVerificationCode(data: {
  email: string;
  businessName: string;
}) {
  const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
  
  // Log generated code in dev mode
  if (process.env.NODE_ENV !== 'production') {
    console.log(`\n[DEV] Verification code generated for ${data.email}: ${verificationCode}\n`);
  }
  
  const result = await sendContactVerificationEmail({
    to: data.email,
    businessName: data.businessName,
    code: verificationCode,
  });

  if (!result.success) {
    const isDev = process.env.NODE_ENV !== 'production';

    if (isDev && result.reason === 'SMTP_NOT_CONFIGURED') {
      // Local dev fallback when SMTP is intentionally unavailable.
      console.log('[DEV] SMTP not configured, returning verification code for manual entry');
      return { success: true, verificationCode };
    }

    throw new Error(
      result.reason === 'SMTP_NOT_CONFIGURED'
        ? 'Email service is not configured. Set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD, and SMTP_FROM.'
        : 'Failed to send verification code. Please check your SMTP credentials and sender address.'
    );
  }

  return {
    success: true,
    verificationCode,
  };
}

export async function processOnboarding(data: {
  businessData: { name: string, email: string, owner: string },
  authData: { email: string, password: string },
  subscriptionData: { packageId: string },
  featureData: OperationalSetupConfig,
  documentData?: Record<string, File>
}) {
  const supabase = createSupabaseAdminClient();
  const subscriptionPlan = getSubscriptionPlan(data.subscriptionData.packageId);
  const tenantSettings: TenantSettings = {
    ai_style: data.featureData.aiStyle,
    dashboard_focus: data.featureData.dashboardFocus,
    ...(subscriptionPlan === "enterprise"
      ? { supply_logic: data.featureData.supplyLogic }
      : {}),
  };
  
  // 1. Create a User in Auth
  const { data: authDataRes, error: authError } = await supabase.auth.admin.createUser({
    email: data.authData.email,
    password: data.authData.password,
    email_confirm: true,
    user_metadata: {
      full_name: data.businessData.name,
      business_email: data.businessData.email,
      subscription_plan: subscriptionPlan,
      settings: tenantSettings,
    }
  });

  if (authError || !authDataRes.user) {
    throw new Error(authError?.message || "Failed to create user");
  }
  
  const userId = authDataRes.user.id;

  // 2. Create the Tenant
  const { data: tenantRes, error: tenantError } = await supabase.from('tenants').insert({
    name: data.businessData.name,
    business_email: data.businessData.email,
    owner_name: data.businessData.owner,
    inventory_mode: data.featureData.inventoryMode,
    service_workflow: data.featureData.serviceWorkflow,
    subscription_plan: subscriptionPlan,
    settings: tenantSettings,
    status: 'pending'
  }).select('id').single();

  if (tenantError || !tenantRes) {
    throw new Error(tenantError?.message || "Failed to create tenant");
  }

  const tenantId = tenantRes.id;
  
  // Handle Document Uploads
  let uploadedUrls: string[] = [];
  if (data.documentData && Object.keys(data.documentData).length > 0) {
    for (const [key, file] of Object.entries(data.documentData)) {
      try {
        // File is a web File object passed from the client; use arrayBuffer to get binary content
        // This avoids client-side base64 serialization and reduces large string transfer.
        // @ts-ignore - File type has arrayBuffer in runtime
        const arrayBuffer = await (file as any).arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const filePath = `${tenantId}/${key}-${Date.now()}-${(file as any).name.replace(/[^a-zA-Z0-9.]/g, '')}`;

        const { error: uploadError } = await supabase.storage
          .from('verification-docs')
          .upload(filePath, buffer, {
            contentType: (file as any).type || 'application/octet-stream',
            upsert: false,
          });

        if (!uploadError) {
          const { data: urlData } = supabase.storage.from('verification-docs').getPublicUrl(filePath);
          if (urlData?.publicUrl) {
            uploadedUrls.push(urlData.publicUrl);
          }
        } else {
          console.error('Document upload failed:', uploadError);
        }
      } catch (err) {
        console.error('Document processing failed:', err);
      }
    }

    // Update tenant with document urls as JSONB array
    // Documents are uploaded, but status remains 'pending' until admin reviews
    if (uploadedUrls.length > 0) {
      await supabase.from('tenants').update({
        verification_doc_urls: uploadedUrls,
      }).eq('id', tenantId);
    }
  }

  // 3. Update the Profile
  const { error: profileError } = await supabase.from('profiles').update({
    tenant_id: tenantId,
    role: 'admin',
  }).eq('id', userId);

  if (profileError) {
    throw new Error(profileError.message || "Failed to link user to tenant");
  }

  // 4. Send Registration Success Email
  try {
    await sendRegistrationSuccessEmail({
      to: data.businessData.email,
      businessName: data.businessData.name,
    });
  } catch (err) {
    console.error('Failed to send registration success email:', err);
    // Don't throw - email failure shouldn't block registration
  }

  return { success: true, tenantId, userId, businessName: data.businessData.name, businessEmail: data.businessData.email };
}