"use client";

import React, { useState, useEffect } from "react";
import { TenantProfileHeader } from "./TenantProfileHeader";
import { TenantProfileBentoGrid } from "./TenantProfileBentoGrid";
import { Modal } from "@/components/molecules/Modal";
import { ActionConfirmationModal } from "@/components/molecules/ConfirmationModal";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { Button } from "@/components/atoms/Button";
import { FormField } from "@/components/molecules/FormField";
import { Dropdown } from "@/components/molecules/Dropdown";
import { motion, AnimatePresence } from "framer-motion";
import { TenantProfileSkeleton } from "./TenantProfileSkeleton";
import {
  getTenantProfileDetails,
  updateTenantSubscription,
  updateTenantStatus,
} from "@/app/(admin)/admin/tenants/actions";

export interface TenantProfileData {
  id: string;
  business_name: string;
  type: string;
  status: "Active" | "Pending" | "Suspended" | "Rejected" | "Onboarding";
  owner: string;
  email: string;
  phone: string;
  joined: string;
  plan: string;
  billingCycle: string;
  totalLocations: number;
  totalStaff: number;
  features: string[];
  documents: {
    id: string;
    title: string;
    description: string;
    required: boolean;
    fileName?: string;
    status: "Pending" | "Approved" | "Revision Requested" | "Not Uploaded";
    url?: string;
  }[];
}

interface TenantProfilePageProps {
  tenantId: string;
}

type PackageId = "starter" | "growth" | "enterprises";
type BillingCycle = "monthly" | "annually";

// will be loaded from DB
// const PACKAGE_OPTIONS kept for typing fallback
const DEFAULT_PACKAGE_OPTIONS: { label: string; value: string }[] = [
  { label: "Starter", value: "starter" },
  { label: "Growth", value: "growth" },
  { label: "Enterprises", value: "enterprises" },
];

const BILLING_CYCLE_OPTIONS: { label: string; value: BillingCycle }[] = [
  { label: "Monthly", value: "monthly" },
  { label: "Annually", value: "annually" },
];

// plan label/id helpers are handled dynamically via `subscriptionOptions` fetched from DB

const formatPlanLabel = (name: string) =>
  name ? name.charAt(0).toUpperCase() + name.slice(1).toLowerCase() : name;

function billingCycleFromLabel(label: string): BillingCycle {
  return label.trim().toLowerCase().includes("annual") ? "annually" : "monthly";
}

function billingLabelFromCycle(cycle: BillingCycle) {
  return cycle === "annually" ? "Annually" : "Monthly";
}

type ModalState = {
  isOpen: boolean;
  type:
    | "approve_tenant"
    | "reject_tenant"
    | "suspend_tenant"
    | "reactivate_tenant"
    | "approve_doc"
    | "revision_doc"
    | null;
  targetId?: string;
  title: string;
  description: string;
  requireReason: boolean;
};

export const TenantProfilePage = ({ tenantId }: TenantProfilePageProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [tenant, setTenant] = useState<TenantProfileData | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [modal, setModal] = useState<ModalState>({
    isOpen: false,
    type: null,
    title: "",
    description: "",
    requireReason: false,
  });
  const [reason, setReason] = useState("");
  const [isManagePlanOpen, setIsManagePlanOpen] = useState(false);
  const [selectedPackageId, setSelectedPackageId] = useState<string>("starter");
  const [selectedBillingCycle, setSelectedBillingCycle] =
    useState<BillingCycle>("monthly");
  const [subscriptionOptions, setSubscriptionOptions] = useState<
    { label: string; value: string }[]
  >(DEFAULT_PACKAGE_OPTIONS);

  const supabase = createSupabaseBrowserClient();
  const [isUpdatingPlan, setIsUpdatingPlan] = useState(false);
  const [managePlanError, setManagePlanError] = useState<string | null>(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [statusActionError, setStatusActionError] = useState<string | null>(
    null,
  );

  useEffect(() => {
    let isMounted = true;

    const loadTenant = async () => {
      setIsLoading(true);
      setLoadError(null);

      try {
        const details = await getTenantProfileDetails(tenantId);
        if (!isMounted) return;
        setTenant({
          ...details,
          totalLocations: details.totalLocations ?? 0,
          totalStaff: details.totalStaff ?? 0,
        });
      } catch (error) {
        console.error("Failed to load tenant profile", error);
        if (!isMounted) return;
        setLoadError("Unable to load tenant profile data right now.");
        setTenant(null);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadTenant();

    return () => {
      isMounted = false;
    };
  }, [tenantId]);

  // load subscription plans from DB
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        let resp = await supabase
          .from("subscription_plans")
          .select("name,display_order")
          .order("display_order", { ascending: true });

        if (resp.error) {
          resp = await supabase
            .from("subscription_plans")
            .select("name")
            .order("created_at", { ascending: true });
        }

        const data = resp.data ?? [];
        const opts = data.map((d: any) => ({
          label: formatPlanLabel(d.name),
          value: d.name,
        }));
        if (mounted && opts.length > 0) setSubscriptionOptions(opts);
      } catch (err) {
        console.error("Failed to load subscription plans", err);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const handleStatusChange = (newStatus: TenantProfileData["status"]) => {
    if (!tenant) return;
    setStatusActionError(null);

    if (
      tenant.status === "Onboarding" &&
      (newStatus === "Active" || newStatus === "Rejected")
    ) {
      return;
    }

    if (newStatus === "Active") {
      const isReactivating = tenant.status === "Suspended";
      setModal({
        isOpen: true,
        type: isReactivating ? "reactivate_tenant" : "approve_tenant",
        title: isReactivating ? "Reactivate Tenant" : "Approve Tenant",
        description: isReactivating
          ? "Are you sure you want to reactivate this tenant's account?"
          : "Are you sure you want to approve this tenant? This will grant them full access.",
        requireReason: false,
      });
    } else if (newStatus === "Rejected") {
      setModal({
        isOpen: true,
        type: "reject_tenant",
        title: "Reject Tenant",
        description:
          "Please provide a reason for rejecting this tenant application.",
        requireReason: true,
      });
    } else if (newStatus === "Suspended") {
      setModal({
        isOpen: true,
        type: "suspend_tenant",
        title: "Suspend Tenant",
        description: "Please provide a reason for suspending this tenant.",
        requireReason: true,
      });
    }
  };

  const handleUpdateDocumentStatus = (
    docId: string,
    newStatus: "Approved" | "Revision Requested",
  ) => {
    if (!tenant) return;
    setStatusActionError(null);

    const doc = tenant.documents.find((d) => d.id === docId);
    if (newStatus === "Approved") {
      setModal({
        isOpen: true,
        type: "approve_doc",
        targetId: docId,
        title: "Approve Document",
        description: `Are you sure you want to approve the ${doc?.title}?`,
        requireReason: false,
      });
    } else {
      setModal({
        isOpen: true,
        type: "revision_doc",
        targetId: docId,
        title: "Request Revision",
        description: `Please provide a reason for requesting a revision on the ${doc?.title}.`,
        requireReason: true,
      });
    }
  };

  const confirmAction = async () => {
    if (!tenant) return;

    if (modal.requireReason && reason.trim() === "") {
      setStatusActionError("A comment is required for this action.");
      return;
    }

    setIsUpdatingStatus(true);
    setStatusActionError(null);

    try {
      if (
        modal.type === "approve_tenant" ||
        modal.type === "reactivate_tenant"
      ) {
        await updateTenantStatus(tenant.id, "approved");
        setTenant((prev) => (prev ? { ...prev, status: "Active" } : null));
      } else if (modal.type === "reject_tenant") {
        const adminComment = reason.trim();
        await updateTenantStatus(tenant.id, "rejected", adminComment);
        setTenant((prev) => (prev ? { ...prev, status: "Rejected" } : null));
      } else if (modal.type === "suspend_tenant") {
        const adminComment = reason.trim() || undefined;
        await updateTenantStatus(tenant.id, "suspended", adminComment);
        setTenant((prev) => (prev ? { ...prev, status: "Suspended" } : null));
      } else if (modal.type === "approve_doc" && modal.targetId) {
        setTenant((prev) =>
          prev
            ? {
                ...prev,
                documents: prev.documents.map((doc) =>
                  doc.id === modal.targetId
                    ? { ...doc, status: "Approved" }
                    : doc,
                ),
              }
            : null,
        );
      } else if (modal.type === "revision_doc" && modal.targetId) {
        setTenant((prev) =>
          prev
            ? {
                ...prev,
                documents: prev.documents.map((doc) =>
                  doc.id === modal.targetId
                    ? { ...doc, status: "Revision Requested" }
                    : doc,
                ),
              }
            : null,
        );
      }

      closeModal();
    } catch (error) {
      console.error("Failed to process tenant action", error);
      setStatusActionError(
        error instanceof Error
          ? error.message
          : "Unable to process this action right now.",
      );
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const closeModal = () => {
    if (isUpdatingStatus) return;
    setModal({ ...modal, isOpen: false });
    setReason("");
    setStatusActionError(null);
  };

  const openManagePlan = () => {
    if (!tenant) return;

    // try to find matching option by label, fallback to lowercased plan
    const match = subscriptionOptions.find(
      (o) => o.label.toLowerCase() === tenant.plan.toLowerCase(),
    );
    setSelectedPackageId(match ? match.value : tenant.plan.toLowerCase());
    setSelectedBillingCycle(billingCycleFromLabel(tenant.billingCycle));
    setManagePlanError(null);
    setIsManagePlanOpen(true);
  };

  const closeManagePlan = () => {
    if (isUpdatingPlan) return;
    setIsManagePlanOpen(false);
    setManagePlanError(null);
  };

  const saveManagePlan = async () => {
    if (!tenant) return;

    setIsUpdatingPlan(true);
    setManagePlanError(null);

    try {
      await updateTenantSubscription(
        tenant.id,
        selectedPackageId,
        selectedBillingCycle,
      );

      const planLabel =
        subscriptionOptions.find((o) => o.value === selectedPackageId)?.label ??
        (selectedPackageId ? formatPlanLabel(selectedPackageId) : "");

      setTenant((prev) =>
        prev
          ? {
              ...prev,
              plan: planLabel,
              type: planLabel,
              billingCycle: billingLabelFromCycle(selectedBillingCycle),
            }
          : null,
      );

      setIsManagePlanOpen(false);
    } catch (error) {
      console.error("Failed to update tenant subscription", error);
      setManagePlanError(
        error instanceof Error
          ? error.message
          : "Unable to update subscription plan right now.",
      );
    } finally {
      setIsUpdatingPlan(false);
    }
  };

  return (
    <>
      <AnimatePresence mode="wait">
        {isLoading ? (
          <TenantProfileSkeleton key="skeleton" />
        ) : tenant ? (
          <motion.div
            key="content"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="flex flex-col w-full"
          >
            <div className="flex flex-col gap-8 w-full">
              {loadError && (
                <div className="rounded-2xl border border-warning-primary/20 bg-warning-primary/5 px-4 py-3 text-sm text-warning-primary">
                  {loadError}
                </div>
              )}
              <TenantProfileHeader
                tenant={tenant}
                onStatusChange={handleStatusChange}
              />
              <TenantProfileBentoGrid
                tenant={tenant}
                onUpdateDocumentStatus={handleUpdateDocumentStatus}
                onManagePlan={openManagePlan}
              />
            </div>
          </motion.div>
        ) : (
          <div className="flex items-center justify-center min-h-[60vh] text-text-secondary">
            {loadError ?? "Tenant not found."}
          </div>
        )}
      </AnimatePresence>

      {/* Approve / Reactivate / Reject use shared confirmation modal (keeps Cancel ghost variant). */}
      {(modal.type === "approve_tenant" ||
        modal.type === "reactivate_tenant" ||
        modal.type === "reject_tenant" ||
        modal.type === "suspend_tenant") &&
        tenant && (
          <ActionConfirmationModal
            isOpen={modal.isOpen}
            action={
              modal.type === "reject_tenant" || modal.type === "suspend_tenant"
                ? "reject"
                : "approve"
            }
            activePlanName={tenant.business_name}
            title={modal.title}
            message={modal.description}
            confirmLabel={modal.type === "reject_tenant" ? "Reject" : "Confirm"}
            confirmVariant={
              modal.type === "reject_tenant" ? "outline" : "primary"
            }
            requireReason={modal.requireReason}
            reasonValue={reason}
            onReasonChange={(v) => setReason(v)}
            saving={isUpdatingStatus}
            onClose={closeModal}
            onConfirm={confirmAction}
          />
        )}

      <Modal
        isOpen={isManagePlanOpen}
        onClose={closeManagePlan}
        title="Manage Subscription Plan"
      >
        <div className="flex flex-col gap-5">
          <p className="text-[15px] text-text-secondary">
            Update the tenant's plan and billing cycle.
          </p>

          <Dropdown
            label="Plan"
            options={subscriptionOptions}
            value={selectedPackageId}
            onSelect={(option) => setSelectedPackageId(option.value as string)}
          />

          <Dropdown
            label="Billing Cycle"
            options={BILLING_CYCLE_OPTIONS}
            value={selectedBillingCycle}
            onSelect={(option) =>
              setSelectedBillingCycle(option.value as BillingCycle)
            }
          />

          {managePlanError && (
            <p className="text-sm text-warning-primary">{managePlanError}</p>
          )}

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button variant="warning" onClick={closeManagePlan}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={saveManagePlan}
              disabled={isUpdatingPlan}
            >
              {isUpdatingPlan ? "Saving..." : "Save Plan"}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};
