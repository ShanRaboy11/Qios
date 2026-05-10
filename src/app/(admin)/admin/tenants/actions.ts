"use server";

import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

interface TenantDirectoryDocument {
  id: string;
  title: string;
  description: string;
  required: boolean;
  submitted: boolean;
  fileName?: string;
  url?: string;
}

export interface TenantDirectoryDetails {
  id: string;
  name: string;
  owner: string;
  ownerEmail: string | null;
  ownerPhone: string | null;
  joined: string;
  status: "Active" | "Suspended" | "Pending" | "Rejected" | "Onboarding";
  documents: TenantDirectoryDocument[];
}

export interface TenantProfileDocument {
  id: string;
  title: string;
  description: string;
  required: boolean;
  fileName?: string;
  status: "Pending" | "Approved" | "Revision Requested" | "Not Uploaded";
  url?: string;
}

export interface TenantProfileDetails {
  id: string;
  business_name: string;
  type: string;
  status: "Active" | "Suspended" | "Pending" | "Rejected" | "Onboarding";
  owner: string;
  email: string;
  phone: string;
  joined: string;
  plan: string;
  billingCycle: string;
  features: string[];
  documents: TenantProfileDocument[];
}

const DOCUMENT_REQUIREMENTS = [
  {
    id: "dti_sec",
    title: "DTI or SEC Registration",
    description: "Sole proprietor or corporation registration.",
    required: true,
  },
  {
    id: "permit",
    title: "Mayor's Permit",
    description: "Includes local LGU and barangay permits.",
    required: true,
  },
  {
    id: "sanitary",
    title: "Sanitary Permit",
    description: "Health certificates from the local LGU.",
    required: true,
  },
  {
    id: "bir",
    title: "BIR Registration",
    description: "TIN and official receipt compliance.",
    required: true,
  },
  {
    id: "fda",
    title: "FDA Licensing",
    description: "For pre-packaged or manufactured food.",
    required: false,
  },
] as const;

function mapTenantStatus(
  status: string | null,
): "Active" | "Suspended" | "Pending" | "Rejected" | "Onboarding" {
  const normalizedStatus = status?.trim().toLowerCase();

  if (normalizedStatus === "onboarding") return "Onboarding";
  if (normalizedStatus === "pending") return "Pending";
  if (normalizedStatus === "approved") return "Active";
  if (normalizedStatus === "rejected") return "Rejected";
  if (normalizedStatus === "suspended") return "Suspended";
  return "Active";
}

function resolveTenantName(tenant: Record<string, unknown>) {
  const candidateKeys = [
    "name",
    "business_name",
    "tenant_name",
    "display_name",
    "company_name",
    "restaurant_name",
    "store_name",
  ];

  for (const key of candidateKeys) {
    const value = tenant[key];
    if (typeof value === "string" && value.trim() !== "") {
      return value;
    }
  }

  return "Unnamed Tenant";
}

function pickFirstString(
  record: Record<string, unknown>,
  keys: string[],
): string | null {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "string" && value.trim() !== "") {
      return value.trim();
    }
  }

  return null;
}

function pickFirstValue(record: Record<string, unknown>, keys: string[]) {
  for (const key of keys) {
    const value = record[key];
    if (value !== undefined && value !== null) {
      return value;
    }
  }

  return null;
}

function toTitleCaseWords(raw: string) {
  return raw
    .replace(/[_-]/g, " ")
    .split(" ")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function resolveOwnerName(
  tenantRecord: Record<string, unknown>,
  ownerProfile: any,
  ownerMetadata: Record<string, unknown>,
) {
  const tenantOwnerName = pickFirstString(tenantRecord, [
    "owner_name",
    "owner",
    "contact_name",
    "primary_contact_name",
    "admin_name",
  ]);
  if (tenantOwnerName) return tenantOwnerName;

  const metadataOwnerName = pickFirstString(ownerMetadata, [
    "owner_name",
    "full_name",
    "contact_name",
    "name",
  ]);
  if (metadataOwnerName) return metadataOwnerName;

  if (
    typeof ownerProfile?.full_name === "string" &&
    ownerProfile.full_name.trim() !== ""
  ) {
    return ownerProfile.full_name;
  }

  return "Unknown";
}

function resolveOwnerEmail(
  tenantRecord: Record<string, unknown>,
  ownerEmail: string | null,
  ownerMetadata: Record<string, unknown>,
) {
  return (
    pickFirstString(tenantRecord, [
      "owner_email",
      "email",
      "business_email",
      "contact_email",
      "primary_email",
    ]) ??
    pickFirstString(ownerMetadata, [
      "business_email",
      "owner_email",
      "email",
    ]) ??
    ownerEmail ??
    ""
  );
}

function resolveOwnerPhone(
  tenantRecord: Record<string, unknown>,
  ownerPhone: string | null,
  ownerMetadata: Record<string, unknown>,
) {
  return (
    pickFirstString(tenantRecord, [
      "owner_phone",
      "phone",
      "phone_number",
      "contact_phone",
      "contact_number",
      "mobile_number",
    ]) ??
    pickFirstString(ownerMetadata, [
      "phone",
      "phone_number",
      "contact_number",
      "mobile_number",
    ]) ??
    ownerPhone ??
    ""
  );
}

function resolveTenantPlanLabel(
  tenantRecord: Record<string, unknown>,
  ownerMetadata: Record<string, unknown>,
) {
  const plan =
    pickFirstString(tenantRecord, [
      "subscription_plan",
      "plan",
      "plan_name",
      "package",
      "package_id",
      "tier",
    ]) ??
    pickFirstString(ownerMetadata, [
      "subscription_plan",
      "plan",
      "plan_name",
      "package",
      "package_id",
      "tier",
    ]);

  return formatPlanLabel(plan);
}

function resolveTenantDirectoryType(
  tenantRecord: Record<string, unknown>,
): "Basic" | "Business" | "Enterprise" {
  const plan = pickFirstString(tenantRecord, [
    "subscription_plan",
    "plan",
    "plan_name",
    "package",
    "package_id",
    "tier",
  ]);

  const normalizedPlan = plan?.trim().toLowerCase();

  if (normalizedPlan === "basic" || normalizedPlan === "starter") {
    return "Basic";
  }

  if (normalizedPlan === "enterprise" || normalizedPlan === "enterprises") {
    return "Enterprise";
  }

  if (
    normalizedPlan === "growth" ||
    normalizedPlan === "business" ||
    normalizedPlan === "professional" ||
    normalizedPlan === "pro"
  ) {
    return "Business";
  }

  return "Business";
}

function resolveBillingCycle(
  tenantRecord: Record<string, unknown>,
  ownerMetadata: Record<string, unknown>,
) {
  const cycle =
    pickFirstString(tenantRecord, [
      "billing_cycle",
      "billingCycle",
      "subscription_cycle",
      "plan_cycle",
      "interval",
    ]) ??
    pickFirstString(ownerMetadata, [
      "billing_cycle",
      "billingCycle",
      "subscription_cycle",
      "plan_cycle",
      "subscription_interval",
      "interval",
    ]);

  return cycle ? toTitleCaseWords(cycle) : "Monthly";
}

function resolveFeatureList(
  tenantRecord: Record<string, unknown>,
  ownerMetadata: Record<string, unknown>,
) {
  const settingsValue = tenantRecord.settings;
  const settings =
    settingsValue && typeof settingsValue === "object"
      ? (settingsValue as Record<string, unknown>)
      : null;

  if (settings) {
    const operationalBreakdown: string[] = [];

    const inventoryMode = settings.inventory_mode;
    if (typeof inventoryMode === "string") {
      if (inventoryMode === "unit") {
        operationalBreakdown.push("Inventory Logic: Retail Style (Unit-Based)");
      } else if (
        inventoryMode === "recipe" ||
        inventoryMode === "measurement"
      ) {
        operationalBreakdown.push(
          "Inventory Logic: Production Style (Recipe-Based)",
        );
      }
    }

    const serviceWorkflow = settings.service_workflow;
    if (typeof serviceWorkflow === "string") {
      if (serviceWorkflow === "pickup") {
        operationalBreakdown.push("Service Workflow: Express Pickup");
      } else if (serviceWorkflow === "dine_in") {
        operationalBreakdown.push("Service Workflow: Table Service");
      }
    }

    const dashboardFocus = settings.dashboard_focus;
    if (typeof dashboardFocus === "string") {
      if (dashboardFocus === "speed") {
        operationalBreakdown.push("Primary Metric: Efficiency (Prep Speed)");
      } else if (dashboardFocus === "revenue") {
        operationalBreakdown.push("Primary Metric: Growth (Customer Behavior)");
      }
    }

    const supplyLogic = settings.supply_logic;
    if (typeof supplyLogic === "string") {
      if (supplyLogic === "centralized") {
        operationalBreakdown.push("Multi-Store Logic: Centralized Commissary");
      } else if (supplyLogic === "local") {
        operationalBreakdown.push("Multi-Store Logic: Independent Units");
      }
    }

    if (operationalBreakdown.length > 0) {
      return operationalBreakdown;
    }
  }

  const tenantFeatures = pickFirstValue(tenantRecord, [
    "features",
    "enabled_features",
    "feature_flags",
    "feature_list",
  ]);
  const tenantFeatureList = extractFeatureList(tenantFeatures);
  if (tenantFeatureList.length > 0) {
    return tenantFeatureList;
  }

  const metadataFeatures = pickFirstValue(ownerMetadata, [
    "features",
    "enabled_features",
    "feature_flags",
    "feature_list",
  ]);
  return extractFeatureList(metadataFeatures);
}

function isMissingColumnError(errorMessage: string | undefined) {
  const normalized = (errorMessage ?? "").toLowerCase();
  return normalized.includes("column") && normalized.includes("does not exist");
}

function normalizePackageId(packageId: string) {
  const normalized = packageId.trim().toLowerCase();
  if (normalized === "starter" || normalized === "growth") {
    return normalized;
  }

  if (
    normalized === "enterprise" ||
    normalized === "enterprises" ||
    normalized === "business"
  ) {
    return "enterprises";
  }

  return "starter";
}

function normalizeBillingCycle(cycle: string) {
  const normalized = cycle.trim().toLowerCase();
  return normalized === "annually" ? "annually" : "monthly";
}

function formatJoinedDate(rawCreatedAt: unknown) {
  if (typeof rawCreatedAt !== "string" && !(rawCreatedAt instanceof Date)) {
    return "N/A";
  }

  const date = new Date(rawCreatedAt);
  if (Number.isNaN(date.getTime())) {
    return "N/A";
  }

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function parseDocumentUrls(raw: unknown): string[] {
  if (Array.isArray(raw)) {
    return raw.filter((url): url is string => typeof url === "string");
  }

  if (typeof raw === "string") {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed.filter((url): url is string => typeof url === "string");
      }
      return [];
    } catch {
      return [];
    }
  }

  return [];
}

function toTitleFromKey(key: string): string {
  return key
    .split("_")
    .filter(Boolean)
    .map((token) => token.charAt(0).toUpperCase() + token.slice(1))
    .join(" ");
}

function extractDocumentKey(fileName: string): string | null {
  const baseName = fileName.split("/").pop() || fileName;
  const key = baseName.split("-")[0]?.trim();
  return key || null;
}

function normalizeUploadedFileName(
  fileName: string,
  documentKey: string | null,
): string {
  const baseName = fileName.split("/").pop() || fileName;
  const parts = baseName.split("-");

  if (documentKey && parts.length >= 3) {
    return parts.slice(2).join("-");
  }

  return baseName;
}

function getRequirementForKey(documentKey: string | null) {
  if (!documentKey) return null;
  return (
    DOCUMENT_REQUIREMENTS.find(
      (requirement) => requirement.id === documentKey,
    ) ?? null
  );
}

function createDocumentFromUpload(
  uniqueId: string,
  fileName: string,
  url: string,
  documentKey: string | null,
): TenantDirectoryDocument {
  const requirement = getRequirementForKey(documentKey);

  return {
    id: requirement?.id ?? uniqueId,
    title:
      requirement?.title ??
      toTitleFromKey(documentKey ?? "supporting_document"),
    description:
      requirement?.description ??
      "Additional verification document submitted by the tenant.",
    required: requirement?.required ?? false,
    submitted: true,
    fileName: normalizeUploadedFileName(fileName, documentKey),
    url,
  };
}

function normalizeProfiles(raw: unknown) {
  return Array.isArray(raw) ? raw : [];
}

function selectOwnerProfile(profiles: any[]) {
  return (
    profiles.find(
      (profile: any) =>
        profile.role === "super_admin" || profile.role === "admin",
    ) ??
    profiles[0] ??
    null
  );
}

async function getOwnerIdentity(
  supabase: ReturnType<typeof createSupabaseAdminClient>,
  ownerProfile: any,
) {
  if (!ownerProfile?.id) {
    return { email: null, phone: null, metadata: {} };
  }

  const {
    data: { user },
  } = await supabase.auth.admin.getUserById(ownerProfile.id);

  return {
    email: user?.email ?? null,
    phone:
      ownerProfile?.phone_number ??
      (user?.user_metadata?.phone_number as string | undefined) ??
      (user?.user_metadata?.contact_number as string | undefined) ??
      null,
    metadata:
      (user?.user_metadata as Record<string, unknown> | undefined) ?? {},
  };
}

async function buildTenantDocuments(
  supabase: ReturnType<typeof createSupabaseAdminClient>,
  tenantId: string,
  verificationDocUrls: unknown,
) {
  const documents = new Map<string, TenantDirectoryDocument>();

  const { data: bucketFiles, error: bucketError } = await supabase.storage
    .from("verification-docs")
    .list(tenantId, {
      limit: 100,
      offset: 0,
      sortBy: { column: "created_at", order: "desc" },
    });

  if (!bucketError && bucketFiles) {
    for (const file of bucketFiles) {
      if (!file.name) continue;

      const objectPath = `${tenantId}/${file.name}`;
      const { data: publicUrlData } = supabase.storage
        .from("verification-docs")
        .getPublicUrl(objectPath);
      const url = publicUrlData.publicUrl;
      const documentKey = extractDocumentKey(file.name);
      const document = createDocumentFromUpload(
        `bucket:${file.name}`,
        file.name,
        url,
        documentKey,
      );

      documents.set(document.id, document);
    }
  }

  const verificationUrls = parseDocumentUrls(verificationDocUrls);
  for (const url of verificationUrls) {
    let guessedFileName = url;
    try {
      const parsedUrl = new URL(url);
      const marker = "/object/public/verification-docs/";
      const markerIndex = parsedUrl.pathname.indexOf(marker);

      if (markerIndex >= 0) {
        guessedFileName = decodeURIComponent(
          parsedUrl.pathname.slice(markerIndex + marker.length),
        );
      } else {
        guessedFileName = decodeURIComponent(parsedUrl.pathname);
      }
    } catch {
      guessedFileName = url;
    }

    const shortName = guessedFileName.split("/").pop() || guessedFileName;
    const documentKey = extractDocumentKey(shortName);
    const document = createDocumentFromUpload(
      `url:${url}`,
      shortName,
      url,
      documentKey,
    );

    if (!documents.has(document.id)) {
      documents.set(document.id, document);
    }
  }

  for (const requirement of DOCUMENT_REQUIREMENTS) {
    if (!documents.has(requirement.id)) {
      documents.set(requirement.id, {
        id: requirement.id,
        title: requirement.title,
        description: requirement.description,
        required: requirement.required,
        submitted: false,
      });
    }
  }

  return Array.from(documents.values()).sort((a, b) => {
    if (a.required !== b.required) return a.required ? -1 : 1;
    if (a.submitted !== b.submitted) return a.submitted ? -1 : 1;
    return a.title.localeCompare(b.title);
  });
}

function formatPlanLabel(rawPlan: unknown) {
  if (typeof rawPlan !== "string" || rawPlan.trim() === "") {
    return "Professional";
  }

  return rawPlan
    .replace(/[_-]/g, " ")
    .split(" ")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function extractFeatureList(rawFeatures: unknown): string[] {
  if (Array.isArray(rawFeatures)) {
    return rawFeatures.filter(
      (feature): feature is string => typeof feature === "string",
    );
  }

  if (typeof rawFeatures === "string") {
    const trimmed = rawFeatures.trim();
    if (!trimmed) return [];

    try {
      const parsed = JSON.parse(trimmed);
      return extractFeatureList(parsed);
    } catch {
      return trimmed
        .split(",")
        .map((feature) => feature.trim())
        .filter(Boolean)
        .map((feature) => toTitleCaseWords(feature));
    }
  }

  if (rawFeatures && typeof rawFeatures === "object") {
    return Object.entries(rawFeatures)
      .filter(([, value]) => Boolean(value))
      .map(([key]) =>
        key
          .replace(/[_-]/g, " ")
          .split(" ")
          .filter(Boolean)
          .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
          .join(" "),
      );
  }

  return [];
}

export async function getTenants() {
  const supabase = createSupabaseAdminClient();

  // Note: assuming we can join profiles to get the owner name, but we might just get the first admin.
  // Profiles has tenant_id and role.
  const { data: tenants, error: tenantError } = await supabase
    .from("tenants")
    .select(
      `
      *,
      profiles (
        full_name,
        role
      )
    `,
    )
    .order("created_at", { ascending: false });

  if (tenantError) throw new Error(tenantError.message);

  return tenants.map((t) => {
    const tenantRecord = t as Record<string, unknown>;
    const profiles = normalizeProfiles(t.profiles);
    const ownerProfile = selectOwnerProfile(profiles);

    return {
      id: t.id,
      business_name: resolveTenantName(tenantRecord),
      owner: resolveOwnerName(tenantRecord, ownerProfile, {}),
      type: resolveTenantDirectoryType(tenantRecord),
      joined: formatJoinedDate(t.created_at),
      status: mapTenantStatus(typeof t.status === "string" ? t.status : null),
      rawStatus: typeof t.status === "string" ? t.status : "approved",
    };
  });
}

export async function getTenantDirectoryDetails(
  tenantId: string,
): Promise<TenantDirectoryDetails> {
  const supabase = createSupabaseAdminClient();

  const { data: tenant, error: tenantError } = await supabase
    .from("tenants")
    .select(
      `
      *,
      profiles (
        id,
        full_name,
        phone_number,
        role
      )
    `,
    )
    .eq("id", tenantId)
    .single();

  if (tenantError || !tenant) {
    throw new Error(tenantError?.message || "Tenant not found");
  }

  const profiles = normalizeProfiles(tenant.profiles);
  const ownerProfile = selectOwnerProfile(profiles);
  const ownerIdentity = await getOwnerIdentity(supabase, ownerProfile);
  const tenantRecord = tenant as Record<string, unknown>;
  const ownerMetadata = ownerIdentity.metadata;
  const sortedDocuments = await buildTenantDocuments(
    supabase,
    tenantId,
    tenant.verification_doc_urls,
  );

  return {
    id: tenant.id,
    name: resolveTenantName(tenantRecord),
    owner: resolveOwnerName(tenantRecord, ownerProfile, ownerMetadata),
    ownerEmail: resolveOwnerEmail(
      tenantRecord,
      ownerIdentity.email,
      ownerMetadata,
    ),
    ownerPhone: resolveOwnerPhone(
      tenantRecord,
      ownerIdentity.phone,
      ownerMetadata,
    ),
    joined: formatJoinedDate(tenant.created_at),
    status: mapTenantStatus(
      typeof tenant.status === "string" ? tenant.status : null,
    ),
    documents: sortedDocuments,
  };
}

export async function getTenantProfileDetails(
  tenantId: string,
): Promise<TenantProfileDetails> {
  const supabase = createSupabaseAdminClient();

  const { data: tenant, error: tenantError } = await supabase
    .from("tenants")
    .select(
      `
      *,
      profiles (
        id,
        full_name,
        phone_number,
        role
      )
    `,
    )
    .eq("id", tenantId)
    .single();

  if (tenantError || !tenant) {
    throw new Error(tenantError?.message || "Tenant not found");
  }

  const profiles = normalizeProfiles(tenant.profiles);
  const ownerProfile = selectOwnerProfile(profiles);
  const ownerIdentity = await getOwnerIdentity(supabase, ownerProfile);
  const tenantRecord = tenant as Record<string, unknown>;
  const ownerMetadata = ownerIdentity.metadata;
  const sortedDocuments = await buildTenantDocuments(
    supabase,
    tenantId,
    tenant.verification_doc_urls,
  );

  const planLabel = resolveTenantPlanLabel(tenantRecord, ownerMetadata);
  const featureList = resolveFeatureList(tenantRecord, ownerMetadata);

  const profileDocuments: TenantProfileDocument[] = sortedDocuments.map(
    (document) => ({
      id: document.id,
      title: document.title,
      description: document.description,
      required: document.required,
      fileName: document.fileName,
      status: document.submitted ? "Pending" : "Not Uploaded",
      url: document.url,
    }),
  );

  return {
    id: tenant.id,
    business_name: resolveTenantName(tenantRecord),
    type: planLabel,
    status: mapTenantStatus(
      typeof tenant.status === "string" ? tenant.status : null,
    ),
    owner: resolveOwnerName(tenantRecord, ownerProfile, ownerMetadata),
    email: resolveOwnerEmail(tenantRecord, ownerIdentity.email, ownerMetadata),
    phone: resolveOwnerPhone(tenantRecord, ownerIdentity.phone, ownerMetadata),
    joined: formatJoinedDate(tenant.created_at),
    plan: planLabel,
    billingCycle: resolveBillingCycle(tenantRecord, ownerMetadata),
    features: featureList,
    documents: profileDocuments,
  };
}

export async function updateTenantSubscription(
  tenantId: string,
  packageId: string,
  billingCycle: string,
) {
  const supabase = createSupabaseAdminClient();
  const normalizedPackage = normalizePackageId(packageId);
  const normalizedCycle = normalizeBillingCycle(billingCycle);

  const { data: tenantData, error: tenantError } = await supabase
    .from("tenants")
    .select(
      `
      id,
      profiles (
        id,
        role
      )
    `,
    )
    .eq("id", tenantId)
    .single();

  if (tenantError || !tenantData) {
    throw new Error(tenantError?.message || "Tenant not found");
  }

  const profiles = normalizeProfiles(tenantData.profiles);
  const ownerProfile = selectOwnerProfile(profiles);

  if (!ownerProfile?.id) {
    throw new Error("Unable to locate tenant owner profile");
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.admin.getUserById(ownerProfile.id);

  if (userError) {
    throw new Error(userError.message);
  }

  const currentMetadata =
    (user?.user_metadata as Record<string, unknown> | undefined) ?? {};

  const { error: metadataUpdateError } =
    await supabase.auth.admin.updateUserById(ownerProfile.id, {
      user_metadata: {
        ...currentMetadata,
        subscription_plan: normalizedPackage,
        plan: normalizedPackage,
        package_id: normalizedPackage,
        billing_cycle: normalizedCycle,
        billingCycle: normalizedCycle,
      },
    });

  if (metadataUpdateError) {
    throw new Error(metadataUpdateError.message);
  }

  const planColumns = ["subscription_plan", "plan", "plan_name", "package_id"];
  for (const column of planColumns) {
    const { error } = await supabase
      .from("tenants")
      .update({ [column]: normalizedPackage } as Record<string, string>)
      .eq("id", tenantId);

    if (!error) {
      break;
    }

    if (!isMissingColumnError(error.message)) {
      throw new Error(error.message);
    }
  }

  const billingColumns = [
    "billing_cycle",
    "billingCycle",
    "subscription_cycle",
    "plan_cycle",
    "interval",
  ];
  for (const column of billingColumns) {
    const { error } = await supabase
      .from("tenants")
      .update({ [column]: normalizedCycle } as Record<string, string>)
      .eq("id", tenantId);

    if (!error) {
      break;
    }

    if (!isMissingColumnError(error.message)) {
      throw new Error(error.message);
    }
  }

  revalidatePath(`/admin/tenants/${tenantId}`);
  revalidatePath("/admin/tenants");
  revalidatePath("/admin/dashboard");

  return {
    success: true,
    packageId: normalizedPackage,
    billingCycle: normalizedCycle,
  };
}

export async function updateTenantStatus(
  tenantId: string,
  status: "pending" | "approved" | "rejected",
  comments?: string,
) {
  const supabase = createSupabaseAdminClient();
  const trimmedComments = comments?.trim();

  const updateData: any = { status };
  if (status === "approved") {
    // Automatically resolve any prior rejection comment when the tenant is approved.
    updateData.admin_comments = "RESOLVED";
  } else if (trimmedComments !== undefined) {
    updateData.admin_comments = trimmedComments;
  }

  const { error } = await supabase
    .from("tenants")
    .update(updateData)
    .eq("id", tenantId);

  if (error) {
    throw new Error(error.message);
  }

  // Prefer the tenant's registered business email, then fall back to owner auth email.
  const { data: tenant, error: tenantFetchError } = await supabase
    .from("tenants")
    .select("business_email")
    .eq("id", tenantId)
    .maybeSingle();

  if (tenantFetchError) {
    console.error(
      "[updateTenantStatus] Failed to fetch tenant business_email:",
      tenantFetchError.message,
    );
  }

  let recipientEmail =
    typeof tenant?.business_email === "string" &&
    tenant.business_email.trim() !== ""
      ? tenant.business_email.trim()
      : null;

  // Find owner to resolve fallback email if tenant business_email is unavailable.
  const { data: adminProfiles, error: profilesError } = await supabase
    .from("profiles")
    .select("id, full_name")
    .eq("tenant_id", tenantId)
    .eq("role", "admin")
    .limit(1);

  if (profilesError) {
    console.error(
      "[updateTenantStatus] Failed to fetch admin profiles:",
      profilesError.message,
    );
  }

  if (adminProfiles && adminProfiles.length > 0) {
    const adminId = adminProfiles[0].id;
    // Get user email using Supabase identity
    const {
      data: { user },
      error: authUserError,
    } = await supabase.auth.admin.getUserById(adminId);

    if (authUserError) {
      console.error(
        "[updateTenantStatus] Failed to fetch auth user:",
        authUserError.message,
      );
    }

    console.log(
      "[updateTenantStatus] Auth user email (fallback):",
      user?.email ?? "(none)",
    );

    if (!recipientEmail && user?.email) {
      recipientEmail = user.email;
    }
  } else {
    console.warn(
      "[updateTenantStatus] No admin profile found for tenant:",
      tenantId,
    );
  }

  console.log(
    "[updateTenantStatus] Final recipient email:",
    recipientEmail ?? "(none — email will not be sent)",
  );

  if (recipientEmail && status !== "pending") {
    const { sendBusinessVerificationEmail } = await import("@/lib/email");
    console.log(
      "[updateTenantStatus] Sending",
      status,
      "email to:",
      recipientEmail,
    );
    const emailResult = await sendBusinessVerificationEmail({
      to: recipientEmail,
      status,
      comments: trimmedComments,
    });
    if (!emailResult.success) {
      console.error(
        "[updateTenantStatus] Email send failed. Reason:",
        emailResult.reason,
        emailResult.error,
      );
    } else {
      console.log(
        "[updateTenantStatus] Email sent successfully. MessageId:",
        emailResult.messageId,
      );
    }
  } else if (!recipientEmail) {
    console.warn(
      "[updateTenantStatus] No recipient email resolved — skipping email notification.",
    );
  }

  revalidatePath("/admin/tenants");
  revalidatePath("/admin/dashboard");
  return { success: true };
}
