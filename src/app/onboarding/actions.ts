"use server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { sendContactVerificationEmail, sendRegistrationSuccessEmail } from "@/lib/email";
import type {
  OperationalSetupConfig,
  SubscriptionPlan,
  TenantSettings,
} from "@/types/tenant";

type OnboardingBusinessData = {
  name?: string;
  email?: string;
  owner?: string;
};

type OnboardingSubscriptionData = {
  packageId?: string;
};

type PartialOperationalSetupConfig = Partial<OperationalSetupConfig>;

type SaveOnboardingProgressInput = {
  tenantId?: string;
  businessData?: OnboardingBusinessData;
  subscriptionData?: OnboardingSubscriptionData;
  featureData?: PartialOperationalSetupConfig;
  documentUrls?: string[];
};

type DocumentUploadInput = {
  tenantId: string;
  filesData: Record<string, { name: string; base64: string; type: string }>;
};

type OnboardingAccessStatus =
  | "new"
  | "resume-onboarding"
  | "completed"
  | "not-found";

type ResolveOnboardingAccessInput = {
  email: string;
};

type ResolveOnboardingAccessResult = {
  status: OnboardingAccessStatus;
  userId?: string;
  tenantId?: string;
  businessName?: string;
  businessEmail?: string;
  ownerName?: string;
  subscriptionPlan?: SubscriptionPlan;
  verificationDocUrls?: string[];
};

const getSubscriptionPlan = (packageId: string): SubscriptionPlan => {
  if (packageId === "basic" || packageId === "starter") return "basic";
  if (packageId === "business" || packageId === "growth") return "business";
  if (packageId === "enterprise" || packageId === "enterprises") return "enterprise";
  return "basic";
};

const normalizeEmail = (email: string) => email.trim().toLowerCase();

const buildTenantSettings = (
  featureData?: PartialOperationalSetupConfig,
): Partial<TenantSettings> => {
  if (!featureData) {
    return {};
  }

  const settings: Partial<TenantSettings> = {
    inventory_mode: featureData.inventoryMode,
    service_workflow: featureData.serviceWorkflow,
    dashboard_focus: featureData.dashboardFocus,
  };

  if (featureData.supplyLogic) {
    settings.supply_logic = featureData.supplyLogic;
  }

  return settings;
};

const getLatestUserByEmail = async (
  supabase: ReturnType<typeof createSupabaseAdminClient>,
  email: string,
) => {
  const normalizedEmail = normalizeEmail(email);
  const pageSize = 100;
  let page = 1;

  while (page <= 10) {
    let data;

    try {
      const result = await supabase.auth.admin.listUsers({
        page,
        perPage: pageSize,
      });
      data = result.data;
    } catch (error: any) {
      console.error("Auth user lookup failed:", error?.message || error);
      return null;
    }

    const user = data.users.find(
      (entry) => normalizeEmail(entry.email || "") === normalizedEmail,
    );

    if (user) {
      return user;
    }

    if (data.users.length < pageSize) {
      return null;
    }

    page += 1;
  }

  return null;
};

export async function resolveOnboardingAccess(
  { email }: ResolveOnboardingAccessInput,
): Promise<ResolveOnboardingAccessResult> {
  const supabase = createSupabaseAdminClient();
  const normalizedEmail = normalizeEmail(email);

  const { data: tenant, error: tenantError } = await supabase
    .from("tenants")
    .select("id, business_name, business_email, owner_name, subscription_plan, status, verification_doc_urls")
    .eq("business_email", normalizedEmail)
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (tenantError) {
    throw new Error(tenantError.message);
  }

  const authUser = await getLatestUserByEmail(supabase, normalizedEmail);

  if (tenant?.status === "onboarding") {
    return {
      status: "resume-onboarding",
      userId: authUser?.id,
      tenantId: tenant.id,
      businessName: tenant.business_name || undefined,
      businessEmail: tenant.business_email || normalizedEmail,
      ownerName: tenant.owner_name || undefined,
      subscriptionPlan: (tenant.subscription_plan as SubscriptionPlan) || undefined,
      verificationDocUrls: tenant.verification_doc_urls || undefined,
    };
  }

  return {
    status: "completed",
    userId: authUser?.id,
    tenantId: tenant?.id,
    businessName: tenant?.business_name || undefined,
    businessEmail: tenant?.business_email || normalizedEmail,
    ownerName: tenant?.owner_name || undefined,
    subscriptionPlan: (tenant?.subscription_plan as SubscriptionPlan) || undefined,
    verificationDocUrls: tenant?.verification_doc_urls || undefined,
  };
}

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

export async function saveOnboardingProgress(data: SaveOnboardingProgressInput) {
  const supabase = createSupabaseAdminClient();
  const normalizedEmail = normalizeEmail(data.businessData?.email || "");

  const { data: existingTenant, error: lookupError } = data.tenantId
    ? { data: null, error: null }
    : await supabase
        .from("tenants")
        .select("id")
        .eq("business_email", normalizedEmail)
        .maybeSingle();

  if (lookupError) {
    throw new Error(lookupError.message);
  }

  const updatePayload: Record<string, unknown> = { status: "onboarding" };

  if (data.businessData?.name) {
    updatePayload.business_name = data.businessData.name;
  }

  if (data.businessData?.email) {
    updatePayload.business_email = data.businessData.email;
  }

  if (data.businessData?.owner) {
    updatePayload.owner_name = data.businessData.owner;
  }

  if (data.subscriptionData?.packageId) {
    updatePayload.subscription_plan = getSubscriptionPlan(data.subscriptionData.packageId);
  }

  const tenantSettings = buildTenantSettings(data.featureData);
  if (Object.keys(tenantSettings).length > 0) {
    updatePayload.settings = tenantSettings;
  }

  if (data.documentUrls) {
    updatePayload.verification_doc_urls = data.documentUrls;
  }

  const tenantId = data.tenantId || existingTenant?.id;

  if (tenantId) {
    const { error } = await supabase
      .from("tenants")
      .update(updatePayload)
      .eq("id", tenantId);

    if (error) {
      throw new Error(error.message);
    }

    return { success: true, tenantId };
  }

  const { data: tenant, error } = await supabase
    .from("tenants")
    .insert({
      ...updatePayload,
      business_email: data.businessData?.email || null,
      ...(updatePayload.settings !== undefined ? { settings: updatePayload.settings } : {}),
    })
    .select("id")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return { success: true, tenantId: tenant.id };
}

export async function saveDocumentUploads(data: DocumentUploadInput) {
  const supabase = createSupabaseAdminClient();

  // Verify tenant exists before attempting upload
  const { data: tenant, error: tenantCheckError } = await supabase
    .from("tenants")
    .select("id")
    .eq("id", data.tenantId)
    .maybeSingle();

  if (tenantCheckError) {
    throw new Error(
      `Unable to verify your business record: ${tenantCheckError.message}`
    );
  }

  if (!tenant) {
    throw new Error(
      "Your business record was not found. Please go back and save your business information first."
    );
  }

  const uploadedUrls: string[] = [];
  const uploadErrors: string[] = [];

  for (const [key, fileInfo] of Object.entries(data.filesData)) {
    try {
      const buffer = Buffer.from(fileInfo.base64, "base64");
      const safeName = fileInfo.name.replace(/[^a-zA-Z0-9.]/g, "");
      const filePath = `${data.tenantId}/${key}-${Date.now()}-${safeName}`;

      const { error: uploadError } = await supabase.storage
        .from("verification-docs")
        .upload(filePath, buffer, {
          contentType: fileInfo.type || "application/octet-stream",
          upsert: false,
        });

      if (uploadError) {
        const message = `Document upload failed for ${key}: ${uploadError.message}`;
        console.error(message, uploadError);
        uploadErrors.push(message);
        continue;
      }

      const { data: urlData } = supabase.storage
        .from("verification-docs")
        .getPublicUrl(filePath);

      if (urlData?.publicUrl) {
        uploadedUrls.push(urlData.publicUrl);
      } else {
        const message = `Document upload completed for ${key} but no public URL was returned.`;
        console.error(message);
        uploadErrors.push(message);
      }
    } catch (err: any) {
      const message = `Document processing failed for ${key}: ${err?.message || err}`;
      console.error(message, err);
      uploadErrors.push(message);
    }
  }

  if (uploadErrors.length > 0) {
    throw new Error(uploadErrors[0]);
  }

  if (uploadedUrls.length !== Object.keys(data.filesData).length) {
    throw new Error("Not all verification documents were uploaded successfully.");
  }

  const { error } = await supabase.from("tenants").update({
    verification_doc_urls: uploadedUrls,
    status: "onboarding",
  }).eq("id", data.tenantId);

  if (error) {
    throw new Error(error.message);
  }

  return { success: true, uploadedUrls };
}

export async function processOnboarding(data: {
  tenantId: string;
  userId: string;
  businessData: { name: string; email: string; owner: string };
  authData: { email: string; password?: string };
  subscriptionData: { packageId: string };
  featureData: OperationalSetupConfig;
}) {
  const supabase = createSupabaseAdminClient();
  const subscriptionPlan = getSubscriptionPlan(data.subscriptionData.packageId);
  const tenantSettings: TenantSettings = {
    inventory_mode: data.featureData.inventoryMode,
    service_workflow: data.featureData.serviceWorkflow,
    dashboard_focus: data.featureData.dashboardFocus,
    ...(subscriptionPlan === "enterprise"
      ? { supply_logic: data.featureData.supplyLogic }
      : {}),
  };

  const { error: tenantError } = await supabase.from("tenants").update({
    business_name: data.businessData.name,
    business_email: data.businessData.email,
    owner_name: data.businessData.owner,
    subscription_plan: subscriptionPlan,
    settings: tenantSettings,
    status: "pending",
  }).eq("id", data.tenantId);

  if (tenantError) {
    throw new Error(tenantError.message || "Failed to finalize tenant");
  }

  // Ensure the auth user exists and mark email confirmed. If the provided
  // userId is missing or the user cannot be found, attempt to resolve by
  // email and create the user if necessary.
  let targetUserId = data.userId;

  const userUpdatePayload = {
    email_confirm: true,
    user_metadata: {
      full_name: data.businessData.name,
      business_email: data.businessData.email,
      subscription_plan: subscriptionPlan,
      settings: tenantSettings,
    },
  };

  let confirmError: any = null;

  if (targetUserId) {
    const res = await supabase.auth.admin.updateUserById(targetUserId, userUpdatePayload as any);
    confirmError = res.error;
  } else {
    confirmError = { message: "User id not provided" };
  }

  if (confirmError) {
    // Try to find existing auth user by email
    try {
      const found = await getLatestUserByEmail(supabase, data.authData.email);
      if (found) {
        targetUserId = found.id;
        const res2 = await supabase.auth.admin.updateUserById(targetUserId, userUpdatePayload as any);
        confirmError = res2.error;
      } else {
        // Create user as last resort
        const createRes = await supabase.auth.admin.createUser({
          email: data.authData.email,
          password: data.authData.password,
          email_confirm: true,
          user_metadata: userUpdatePayload.user_metadata,
        } as any);

        if (createRes.error) {
          confirmError = createRes.error;
        } else {
          // createRes may contain user in different shapes depending on client
          const createdId = (createRes as any).user?.id || (createRes as any).data?.user?.id;
          if (createdId) targetUserId = createdId;
          confirmError = null;
        }
      }
    } catch (err: any) {
      confirmError = err;
    }
  }

  if (confirmError) {
    throw new Error(confirmError.message || "Failed to confirm or create user email");
  }

  const { error: profileError } = await supabase.from("profiles").update({
    tenant_id: data.tenantId,
    role: "admin",
  }).eq("id", targetUserId);

  if (profileError) {
    throw new Error(profileError.message || "Failed to link user to tenant");
  }

  try {
    await sendRegistrationSuccessEmail({
      to: data.businessData.email,
      businessName: data.businessData.name,
    });
  } catch (err) {
    console.error("Failed to send registration success email:", err);
  }

  return {
    success: true,
    tenantId: data.tenantId,
    userId: data.userId,
    businessName: data.businessData.name,
    businessEmail: data.businessData.email,
  };
}