"use client";

import React, { useState, useEffect } from "react";
import { TenantProfileHeader } from "./TenantProfileHeader";
import { TenantProfileBentoGrid } from "./TenantProfileBentoGrid";
import { Modal } from "@/components/molecules/Modal";
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

const PACKAGE_OPTIONS: { label: string; value: PackageId }[] = [
  { label: "Starter", value: "starter" },
  { label: "Growth", value: "growth" },
  { label: "Enterprises", value: "enterprises" },
];

const BILLING_CYCLE_OPTIONS: { label: string; value: BillingCycle }[] = [
  { label: "Monthly", value: "monthly" },
  { label: "Annually", value: "annually" },
];

function planLabelFromPackageId(packageId: PackageId) {
  const selected = PACKAGE_OPTIONS.find((option) => option.value === packageId);
  return selected?.label ?? "Starter";
}

function packageIdFromPlanLabel(planLabel: string): PackageId {
  const normalized = planLabel.trim().toLowerCase();
  if (normalized.includes("growth") || normalized.includes("business")) {
    return "growth";
  }

  if (normalized.includes("enterprise")) {
    return "enterprises";
  }

  return "starter";
}

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
  const [selectedPackageId, setSelectedPackageId] =
    useState<PackageId>("starter");
  const [selectedBillingCycle, setSelectedBillingCycle] =
    useState<BillingCycle>("monthly");
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
        setTenant(details);
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

    setSelectedPackageId(packageIdFromPlanLabel(tenant.plan));
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

      setTenant((prev) =>
        prev
          ? {
              ...prev,
              plan: planLabelFromPackageId(selectedPackageId),
              type: planLabelFromPackageId(selectedPackageId),
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

      <Modal isOpen={modal.isOpen} onClose={closeModal} title={modal.title}>
        <div className="flex flex-col gap-6">
          <p className="text-[15px] text-text-secondary">{modal.description}</p>

          {modal.requireReason &&
            (modal.type === "reject_tenant" ? (
              <div className="flex flex-col gap-1.5 w-full">
                <label className="b4 ml-1 font-medium text-text-secondary">
                  Reason (Required)
                </label>
                <textarea
                  placeholder="e.g., Please revise your submitted permits and upload a clearer copy of the business registration."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows={5}
                  className="w-full bg-white text-sm md:text-[16px] px-6 py-3.5 transition-all duration-300 outline-none rounded-2xl border-2 border-[#E5E5E5] focus:border-brand-primary focus:shadow-[0_0_0_2px_rgba(255,198,112,0.15)] placeholder:text-text-secondary text-text-primary resize-y min-h-[132px]"
                />
              </div>
            ) : (
              <FormField
                label="Reason (Required)"
                placeholder="e.g., Document is blurred, Information mismatch..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full"
              />
            ))}

          {statusActionError && (
            <p className="text-sm text-warning-primary">{statusActionError}</p>
          )}

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              variant="warning"
              onClick={closeModal}
              disabled={isUpdatingStatus}
            >
              Cancel
            </Button>
            <Button
              variant={
                modal.type?.includes("reject") ||
                modal.type?.includes("revision")
                  ? "primary"
                  : "primary"
              }
              className={
                modal.type?.includes("reject") ||
                modal.type?.includes("revision") ||
                modal.type?.includes("suspend")
                  ? ""
                  : ""
              }
              disabled={
                isUpdatingStatus ||
                (modal.requireReason && reason.trim() === "")
              }
              onClick={confirmAction}
            >
              {isUpdatingStatus ? "Saving..." : "Confirm"}
            </Button>
          </div>
        </div>
      </Modal>

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
            options={PACKAGE_OPTIONS}
            value={selectedPackageId}
            onSelect={(option) =>
              setSelectedPackageId(option.value as PackageId)
            }
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
