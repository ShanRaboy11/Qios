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
  status: "Active" | "Suspended" | "Pending" | "Rejected";
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
  name: string;
  type: string;
  status: "Active" | "Suspended" | "Pending" | "Rejected";
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
): "Active" | "Suspended" | "Pending" | "Rejected" {
  if (status === "pending") return "Pending";
  if (status === "approved") return "Active";
  if (status === "rejected") return "Rejected";
  return "Active";
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
      id,
      name,
      created_at,
      status,
      profiles (
        full_name,
        role
      )
    `,
    )
    .order("created_at", { ascending: false });

  if (tenantError) throw new Error(tenantError.message);

  return tenants.map((t) => {
    const profiles = normalizeProfiles(t.profiles);
    const ownerProfile = selectOwnerProfile(profiles);
    return {
      id: t.id,
      name: t.name,
      owner: ownerProfile?.full_name ?? "Unknown",
      type: "Professional" as "Professional" | "Enterprise" | "Starter",
      joined: new Date(t.created_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
      status: (t.status === "pending"
        ? "Pending"
        : t.status === "approved"
          ? "Active"
          : t.status === "rejected"
            ? "Rejected"
            : "Active") as "Active" | "Suspended" | "Pending" | "Rejected",
      rawStatus: t.status,
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
      id,
      name,
      created_at,
      status,
      verification_doc_urls,
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
  const sortedDocuments = await buildTenantDocuments(
    supabase,
    tenantId,
    tenant.verification_doc_urls,
  );

  return {
    id: tenant.id,
    name: tenant.name,
    owner: ownerProfile?.full_name ?? "Unknown",
    ownerEmail: ownerIdentity.email,
    ownerPhone: ownerIdentity.phone,
    joined: new Date(tenant.created_at).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }),
    status: mapTenantStatus(tenant.status),
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
      id,
      name,
      created_at,
      status,
      verification_doc_urls,
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
  const sortedDocuments = await buildTenantDocuments(
    supabase,
    tenantId,
    tenant.verification_doc_urls,
  );

  const planLabel = formatPlanLabel(ownerIdentity.metadata.subscription_plan);
  const featureList = extractFeatureList(ownerIdentity.metadata.features);

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
    name: tenant.name,
    type: planLabel,
    status: mapTenantStatus(tenant.status),
    owner: ownerProfile?.full_name ?? "Unknown",
    email: ownerIdentity.email ?? "",
    phone: ownerIdentity.phone ?? "",
    joined: new Date(tenant.created_at).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }),
    plan: planLabel,
    billingCycle: "Monthly",
    features: featureList,
    documents: profileDocuments,
  };
}

export async function updateTenantStatus(
  tenantId: string,
  status: "pending" | "approved" | "rejected",
  comments?: string,
) {
  const supabase = createSupabaseAdminClient();

  const updateData: any = { status };
  if (comments !== undefined) {
    updateData.admin_comments = comments;
  }

  const { error } = await supabase
    .from("tenants")
    .update(updateData)
    .eq("id", tenantId);

  if (error) {
    throw new Error(error.message);
  }

  // Find owner to get email for notification (usually 'admin' role in this single-tenant context)
  const { data: adminProfiles } = await supabase
    .from("profiles")
    .select("id, full_name")
    .eq("tenant_id", tenantId)
    .eq("role", "admin")
    .limit(1);

  if (adminProfiles && adminProfiles.length > 0) {
    const adminId = adminProfiles[0].id;
    // Get user email using Supabase identity
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.admin.getUserById(adminId);

    if (user && user.email && status !== "pending") {
      const { sendBusinessVerificationEmail } = await import("@/lib/email");
      await sendBusinessVerificationEmail({
        to: user.email,
        status,
        comments,
      });
    }
  }

  revalidatePath("/admin/tenants");
  revalidatePath("/admin/dashboard");
  return { success: true };
}
