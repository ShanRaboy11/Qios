"use server";

import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import {
  sendContactVerificationEmail,
  sendRegistrationSuccessEmail,
} from "@/lib/email";
import { DOCUMENT_REQUIREMENT_IDS } from "./documentRequirements";
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

type SaveBusinessInformationInput = {
  tenantId?: string;
  userId: string;
  businessData: {
    name: string;
    email: string;
    owner: string;
  };
};

type DocumentUploadInput = {
  tenantId: string;
  userId: string;
  filesData: Record<string, { name: string; base64: string; type: string }>;
  existingDocumentUrls?: Record<string, string>;
};

type OnboardingAccessStatus = "new" | "resume-onboarding" | "completed";

type ResolveOnboardingAccessInput = {
  email: string;
};

type ResolveOnboardingAccessResult = {
  status: OnboardingAccessStatus;
  userExists: boolean;
  userVerified: boolean;
  adminEmail?: string;
  nextStep?: number;
  userId?: string;
  tenantId?: string;
  businessName?: string;
  businessEmail?: string;
  ownerName?: string;
  subscriptionPlan?: SubscriptionPlan;
  verificationDocUrls?: string[];
  operationalSetup?: PartialOperationalSetupConfig;
  tenant?: {
    id: string;
    business_name: string | null;
    business_email: string | null;
    owner_name: string | null;
    subscription_plan: SubscriptionPlan | null;
    verification_doc_urls: string[] | null;
    settings: Record<string, unknown> | null;
    status: string | null;
    [key: string]: unknown;
  };
};

const getSubscriptionPlan = (packageId: string): SubscriptionPlan => {
  if (!packageId) return "basic";
  const lowerId = packageId.toLowerCase();
  
  if (
    lowerId === "basic" || 
    lowerId === "starter" || 
    lowerId === "b3c2d4a5-1e6f-4c8d-9b1e-0a1f2e3d4c5b"
  ) return "basic";
  
  if (
    lowerId === "business" || 
    lowerId === "growth" || 
    lowerId === "d1e2f3a4-b5c6-4d7e-8c9b-1a2f3e4d5c6b"
  ) return "business";
  
  if (
    lowerId === "enterprise" || 
    lowerId === "enterprises" || 
    lowerId === "f5a4b3c2-e1d0-4e8f-9a1b-2c3d4e5f6a9b"
  ) return "enterprise";
  
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

const parseOperationalSetup = (
  settings: Record<string, unknown> | null,
): PartialOperationalSetupConfig => {
  if (!settings) {
    return {};
  }

  const inventoryMode = settings.inventory_mode;
  const serviceWorkflow = settings.service_workflow;
  const dashboardFocus = settings.dashboard_focus;
  const supplyLogic = settings.supply_logic;

  return {
    ...(typeof inventoryMode === "string" ? { inventoryMode } : {}),
    ...(typeof serviceWorkflow === "string" ? { serviceWorkflow } : {}),
    ...(typeof dashboardFocus === "string" ? { dashboardFocus } : {}),
    ...(typeof supplyLogic === "string" ? { supplyLogic } : {}),
  } as PartialOperationalSetupConfig;
};

const mapTenantRow = (tenant: {
  id: string;
  business_name: string | null;
  business_email: string | null;
  owner_name: string | null;
  subscription_plan: SubscriptionPlan | null;
  verification_doc_urls: string[] | null;
  settings: Record<string, unknown> | null;
  status: string | null;
  [key: string]: unknown;
}) => tenant;

const ensureProfileTenantLink = async (
  supabase: ReturnType<typeof createSupabaseAdminClient>,
  userId: string,
  tenantId: string,
  fallbackName: string,
) => {
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, tenant_id, role, full_name")
    .eq("id", userId)
    .maybeSingle();

  if (profileError) {
    throw new Error(profileError.message);
  }

  if (profile?.tenant_id === tenantId) {
    return;
  }

  const { error: profileLinkError } = await supabase.from("profiles").upsert({
    id: userId,
    tenant_id: tenantId,
    role: profile?.role === "super_admin" ? profile.role : "admin",
    full_name: profile?.full_name || fallbackName,
  });

  if (profileLinkError) {
    throw new Error(profileLinkError.message);
  }
};

const deriveNextStep = (
  tenant: {
    business_name: string | null;
    business_email: string | null;
    owner_name: string | null;
    subscription_plan: SubscriptionPlan | null;
    verification_doc_urls: string[] | null;
    settings: Record<string, unknown> | null;
  },
  userVerified: boolean,
) => {
  if (!userVerified) {
    return 2;
  }

  const hasBusinessCore =
    Boolean(tenant.business_name?.trim()) &&
    Boolean(tenant.business_email?.trim()) &&
    Boolean(tenant.owner_name?.trim());

  if (!hasBusinessCore) {
    return 3;
  }

  const hasVerificationDocs = Array.isArray(tenant.verification_doc_urls)
    ? tenant.verification_doc_urls.length > 0
    : false;

  if (!hasVerificationDocs) {
    return 4;
  }

  if (!tenant.subscription_plan) {
    return 5;
  }

  const settings = tenant.settings || {};
  const hasOperationalSetup = Boolean(
    settings.inventory_mode &&
    settings.service_workflow &&
    settings.dashboard_focus,
  );

  if (!hasOperationalSetup) {
    return 6;
  }

  return 7;
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

export async function createOnboardingAuthUser(input: {
  email: string;
  password: string;
}) {
  const supabase = createSupabaseAdminClient();
  const normalizedEmail = normalizeEmail(input.email);
  const existingUser = await getLatestUserByEmail(supabase, normalizedEmail);

  if (existingUser) {
    const { data, error } = await supabase.auth.admin.updateUserById(
      existingUser.id,
      {
        password: input.password,
        email_confirm: true,
      },
    );

    if (error || !data.user) {
      throw new Error(
        error?.message || "Failed to update the local onboarding account.",
      );
    }

    return { userId: data.user.id };
  }

  const { data, error } = await supabase.auth.admin.createUser({
    email: normalizedEmail,
    password: input.password,
    email_confirm: true,
  });

  if (error || !data.user) {
    throw new Error(
      error?.message || "Failed to create the local onboarding account.",
    );
  }

  return { userId: data.user.id };
}

export async function resolveOnboardingAccess({
  email,
}: ResolveOnboardingAccessInput): Promise<ResolveOnboardingAccessResult> {
  const supabase = createSupabaseAdminClient();
  const normalizedEmail = normalizeEmail(email);

  const authUser = await getLatestUserByEmail(supabase, normalizedEmail);
  const userExists = Boolean(authUser);
  const userVerified = Boolean(authUser?.email_confirmed_at);

  let tenantRow: Record<string, unknown> | null = null;

  if (authUser?.id) {
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("tenant_id")
      .eq("id", authUser.id)
      .maybeSingle();

    if (profileError) {
      throw new Error(profileError.message);
    }

    if (profile?.tenant_id) {
      const { data: tenantByProfile, error: tenantByProfileError } =
        await supabase
          .from("tenants")
          .select("*")
          .eq("id", profile.tenant_id)
          .maybeSingle();

      if (tenantByProfileError) {
        throw new Error(tenantByProfileError.message);
      }

      tenantRow = tenantByProfile as Record<string, unknown> | null;
    }
  }

  if (!tenantRow) {
    const { data: tenantByBusinessEmail, error: tenantByEmailError } =
      await supabase
        .from("tenants")
        .select("*")
        .eq("business_email", normalizedEmail)
        .order("updated_at", { ascending: false })
        .limit(1)
        .maybeSingle();

    if (tenantByEmailError) {
      throw new Error(tenantByEmailError.message);
    }

    tenantRow = tenantByBusinessEmail as Record<string, unknown> | null;
  }

  const tenant = tenantRow ? mapTenantRow(tenantRow as any) : null;

  if (tenant && authUser?.id) {
    await ensureProfileTenantLink(
      supabase,
      authUser.id,
      tenant.id,
      tenant.owner_name || tenant.business_name || normalizedEmail,
    );
  }

  if (tenant?.status === "onboarding") {
    return {
      status: "resume-onboarding",
      userExists,
      userVerified,
      adminEmail: authUser?.email || normalizedEmail,
      nextStep: deriveNextStep(
        {
          business_name: tenant.business_name,
          business_email: tenant.business_email,
          owner_name: tenant.owner_name,
          subscription_plan: tenant.subscription_plan as SubscriptionPlan,
          verification_doc_urls:
            (tenant.verification_doc_urls as string[]) || [],
          settings: (tenant.settings as Record<string, unknown> | null) || null,
        },
        userVerified,
      ),
      userId: authUser?.id,
      tenantId: tenant.id,
      businessName: tenant.business_name || undefined,
      businessEmail: tenant.business_email || normalizedEmail,
      ownerName: tenant.owner_name || undefined,
      subscriptionPlan:
        (tenant.subscription_plan as SubscriptionPlan) || undefined,
      verificationDocUrls:
        (tenant.verification_doc_urls as string[]) || undefined,
      operationalSetup: parseOperationalSetup(
        (tenant.settings as Record<string, unknown> | null) || null,
      ),
      tenant,
    };
  }

  if (tenant) {
    return {
      status: "completed",
      userExists,
      userVerified,
      adminEmail: authUser?.email || normalizedEmail,
      nextStep: deriveNextStep(
        {
          business_name: tenant.business_name,
          business_email: tenant.business_email,
          owner_name: tenant.owner_name,
          subscription_plan: tenant.subscription_plan as SubscriptionPlan,
          verification_doc_urls:
            (tenant.verification_doc_urls as string[]) || [],
          settings: (tenant.settings as Record<string, unknown> | null) || null,
        },
        userVerified,
      ),
      userId: authUser?.id,
      tenantId: tenant.id,
      businessName: tenant.business_name || undefined,
      businessEmail: tenant.business_email || normalizedEmail,
      ownerName: tenant.owner_name || undefined,
      subscriptionPlan:
        (tenant.subscription_plan as SubscriptionPlan) || undefined,
      verificationDocUrls:
        (tenant.verification_doc_urls as string[]) || undefined,
      operationalSetup: parseOperationalSetup(
        (tenant.settings as Record<string, unknown> | null) || null,
      ),
      tenant,
    };
  }

  if (userExists && userVerified) {
    return {
      status: "resume-onboarding",
      userExists,
      userVerified,
      adminEmail: authUser?.email || normalizedEmail,
      nextStep: 3,
      userId: authUser?.id,
      businessEmail: normalizedEmail,
    };
  }

  return {
    status: "new",
    userExists,
    userVerified,
    adminEmail: authUser?.email || normalizedEmail,
    nextStep: 1,
    userId: authUser?.id,
    businessEmail: normalizedEmail,
  };
}

export async function sendContactVerificationCode(data: {
  email: string;
  businessName: string;
}) {
  const verificationCode = Math.floor(
    100000 + Math.random() * 900000,
  ).toString();

  const result = await sendContactVerificationEmail({
    to: data.email,
    businessName: data.businessName,
    code: verificationCode,
  });

  if (!result.success) {
    throw new Error(
      result.reason === "SMTP_NOT_CONFIGURED"
        ? "Email service is not configured. Set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD, and SMTP_FROM."
        : "Failed to send verification code. Please check SMTP credentials and sender address.",
    );
  }

  return {
    success: true,
    verificationCode,
  };
}

export async function saveBusinessInformation(
  data: SaveBusinessInformationInput,
) {
  const supabase = createSupabaseAdminClient();
  const userId = data.userId;

  if (!userId) {
    throw new Error("User account was not created. Please return to Step 1.");
  }

  const normalizedEmail = normalizeEmail(data.businessData.email);

  const updatePayload = {
    business_name: data.businessData.name.trim(),
    business_email: normalizedEmail,
    owner_name: data.businessData.owner.trim(),
    status: "onboarding",
  };

  const tenantId = data.tenantId;

  if (tenantId) {
    const { error: updateError } = await supabase
      .from("tenants")
      .update(updatePayload)
      .eq("id", tenantId);

    if (updateError) {
      throw new Error(updateError.message);
    }

    const { error: profileUpdateError } = await supabase
      .from("profiles")
      .update({ tenant_id: tenantId, role: "admin" })
      .eq("id", userId);

    if (profileUpdateError) {
      throw new Error(profileUpdateError.message);
    }

    return { success: true, tenantId };
  }

  const { data: existingTenant, error: existingTenantError } = await supabase
    .from("tenants")
    .select("id")
    .eq("business_email", normalizedEmail)
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (existingTenantError) {
    throw new Error(existingTenantError.message);
  }

  let finalTenantId = existingTenant?.id;

  if (finalTenantId) {
    const { error: updateError } = await supabase
      .from("tenants")
      .update(updatePayload)
      .eq("id", finalTenantId);

    if (updateError) {
      throw new Error(updateError.message);
    }
  } else {
    const { data: createdTenant, error: createError } = await supabase
      .from("tenants")
      .insert(updatePayload)
      .select("id")
      .single();

    if (createError || !createdTenant?.id) {
      throw new Error(
        createError?.message || "Unable to create tenant record.",
      );
    }

    finalTenantId = createdTenant.id;
  }

  const { data: existingProfile, error: profileLookupError } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", userId)
    .maybeSingle();

  if (profileLookupError) {
    throw new Error(profileLookupError.message);
  }

  if (existingProfile) {
    const { error: profileUpdateError } = await supabase
      .from("profiles")
      .update({ tenant_id: finalTenantId, role: "admin" })
      .eq("id", userId);

    if (profileUpdateError) {
      throw new Error(profileUpdateError.message);
    }
  } else {
    const fallbackName =
      data.businessData.owner?.trim() || data.businessData.email || "Admin";

    const { error: profileInsertError } = await supabase
      .from("profiles")
      .insert({
        id: userId,
        tenant_id: finalTenantId,
        role: "admin",
        full_name: fallbackName,
      });

    if (profileInsertError) {
      throw new Error(profileInsertError.message);
    }
  }

  return { success: true, tenantId: finalTenantId };
}

export async function saveOnboardingProgress(
  data: SaveOnboardingProgressInput,
) {
  const supabase = createSupabaseAdminClient();
  const updatePayload: Record<string, unknown> = {};

  if (data.businessData?.name) {
    updatePayload.business_name = data.businessData.name;
  }

  if (data.businessData?.email) {
    updatePayload.business_email = normalizeEmail(data.businessData.email);
  }

  if (data.businessData?.owner) {
    updatePayload.owner_name = data.businessData.owner;
  }

  if (data.subscriptionData?.packageId) {
    updatePayload.subscription_plan = getSubscriptionPlan(
      data.subscriptionData.packageId,
    );
  }

  const tenantSettings = buildTenantSettings(data.featureData);
  if (Object.keys(tenantSettings).length > 0) {
    updatePayload.settings = tenantSettings;
  }

  if (data.documentUrls) {
    updatePayload.verification_doc_urls = data.documentUrls;
  }

  if (!data.tenantId) {
    throw new Error(
      "Missing tenant record. Please complete business information first.",
    );
  }

  const { error } = await supabase
    .from("tenants")
    .update(updatePayload)
    .eq("id", data.tenantId);

  if (error) {
    throw new Error(error.message);
  }

  return { success: true, tenantId: data.tenantId };
}

export async function saveDocumentUploads(data: DocumentUploadInput) {
  const supabase = createSupabaseAdminClient();
  if (!data.userId) {
    throw new Error("User account was not created. Please return to Step 1.");
  }

  const { data: tenant, error: tenantError } = await supabase
    .from("tenants")
    .select("id")
    .eq("id", data.tenantId)
    .maybeSingle();

  if (tenantError || !tenant) {
    throw new Error(
      "Tenant record is missing. Please complete business information first.",
    );
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("tenant_id")
    .eq("id", data.userId)
    .maybeSingle();

  if (profileError) {
    throw new Error(profileError.message);
  }

  if (!profile || profile.tenant_id !== data.tenantId) {
    const { error: profileLinkError } = await supabase
      .from("profiles")
      .update({ tenant_id: data.tenantId, role: "admin" })
      .eq("id", data.userId);

    if (profileLinkError) {
      throw new Error(profileLinkError.message);
    }
  }

  const uploadedUrls: string[] = [];
  const uploadErrors: string[] = [];
  const finalUrlsByRequirement = {
    ...(data.existingDocumentUrls || {}),
  } as Record<string, string>;

  for (const [key, fileInfo] of Object.entries(data.filesData)) {
    try {
      const buffer = Buffer.from(fileInfo.base64, "base64");
      const safeName = fileInfo.name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
      const filePath = `${data.userId}/${key}-${safeName}`;

      const { error: uploadError } = await supabase.storage
        .from("verification-docs")
        .upload(filePath, buffer, {
          contentType: fileInfo.type || "application/octet-stream",
          upsert: true,
        });

      if (uploadError) {
        uploadErrors.push(
          `Document upload failed for ${key}: ${uploadError.message}`,
        );
        continue;
      }

      const { data: urlData } = supabase.storage
        .from("verification-docs")
        .getPublicUrl(filePath);
      if (urlData?.publicUrl) {
        finalUrlsByRequirement[key] = urlData.publicUrl;
        uploadedUrls.push(urlData.publicUrl);
      } else {
        uploadErrors.push(
          `Document upload completed for ${key} but no public URL was returned.`,
        );
      }
    } catch (err: any) {
      uploadErrors.push(
        `Document processing failed for ${key}: ${err?.message || err}`,
      );
    }
  }

  if (uploadErrors.length > 0) {
    throw new Error(uploadErrors[0]);
  }

  const orderedUrls = DOCUMENT_REQUIREMENT_IDS.map(
    (requirementId) => finalUrlsByRequirement[requirementId],
  ).filter((url): url is string => Boolean(url));

  const requiredMissing = DOCUMENT_REQUIREMENT_IDS.filter((requirementId) => {
    const isRequired = requirementId !== "fda";
    return isRequired && !finalUrlsByRequirement[requirementId];
  });

  if (requiredMissing.length > 0) {
    throw new Error(
      "Not all required verification documents are available for this session.",
    );
  }

  const { error } = await supabase
    .from("tenants")
    .update({
      verification_doc_urls: orderedUrls,
      status: "onboarding",
    })
    .eq("id", data.tenantId);

  if (error) {
    throw new Error(error.message);
  }

  return { success: true, uploadedUrls: orderedUrls };
}

export async function processOnboarding(data: {
  tenantId: string;
  businessData: { name: string; email: string; owner: string };
  subscriptionData: { packageId: string };
  featureData: OperationalSetupConfig;
  userId?: string;
  adminEmail?: string;
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

  const { error: tenantError } = await supabase
    .from("tenants")
    .update({
      business_name: data.businessData.name,
      business_email: normalizeEmail(data.businessData.email),
      owner_name: data.businessData.owner,
      subscription_plan: subscriptionPlan,
      settings: tenantSettings,
      status: "pending",
    })
    .eq("id", data.tenantId);

  if (tenantError) {
    throw new Error(tenantError.message || "Failed to finalize tenant");
  }

  if (data.userId) {
    const ownerName = data.businessData.owner.trim();

    const { error: authError } = await supabase.auth.admin.updateUserById(
      data.userId,
      {
        user_metadata: {
          full_name: ownerName,
          display_name: ownerName,
        },
      },
    );

    if (authError) {
      throw new Error(
        authError.message || "Failed to sync auth profile metadata.",
      );
    }

    const { error: profileSyncError } = await supabase
      .from("profiles")
      .update({
        role: "admin",
        full_name: ownerName,
      })
      .eq("id", data.userId);

    if (profileSyncError) {
      throw new Error(
        profileSyncError.message || "Failed to sync profile metadata.",
      );
    }
  }

  try {
    const toEmail = data.adminEmail || data.businessData.email;
    await sendRegistrationSuccessEmail({
      to: toEmail,
      adminName: data.businessData.owner.trim(),
      businessName: data.businessData.name,
    });
  } catch (err) {
    console.error("Failed to send registration success email:", err);
  }

  return {
    success: true,
    tenantId: data.tenantId,
    businessName: data.businessData.name,
    businessEmail: data.businessData.email,
    ownerName: data.businessData.owner,
  };
}
