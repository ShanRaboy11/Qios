"use client";

import React, { useState, useEffect } from "react";
import { TenantProfileHeader } from "./TenantProfileHeader";
import { TenantProfileBentoGrid } from "./TenantProfileBentoGrid";
import { Modal } from "@/components/molecules/Modal";
import { Button } from "@/components/atoms/Button";
import { FormField } from "@/components/molecules/FormField";
import { motion, AnimatePresence } from "framer-motion";
import { TenantProfileSkeleton } from "./TenantProfileSkeleton";

export interface TenantProfileData {
  id: string;
  name: string;
  type: string;
  status: "Active" | "Pending" | "Suspended" | "Rejected";
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

const MOCK_TENANT: TenantProfileData = {
  id: "TEN-2026-003",
  name: "Sugbo Mercado Central",
  type: "Enterprise",
  status: "Pending",
  owner: "Carlo Reyes",
  email: "carlo.reyes@sugbomercado.com",
  phone: "+63 917 123 4567",
  joined: "Feb 3, 2026",
  plan: "Enterprise",
  billingCycle: "Annual",
  features: [
    "Kitchen Prep",
    "Kiosk Ordering",
    "Advanced Analytics",
    "Multiple Locations",
  ],
  documents: [
    {
      id: "doc1",
      title: "DTI or SEC Registration",
      description: "Sole proprietor or Corporation registration.",
      required: true,
      fileName: "dti-cert-2026.pdf",
      status: "Approved",
      url: "#",
    },
    {
      id: "doc2",
      title: "Mayor's Permit",
      description: "Includes local LGU and Barangay permits.",
      required: true,
      fileName: "mayors-permit-2026.pdf",
      status: "Pending",
      url: "#",
    },
    {
      id: "doc3",
      title: "Sanitary Permit",
      description: "Health certificates from your local LGU.",
      required: true,
      fileName: undefined,
      status: "Not Uploaded",
    },
    {
      id: "doc4",
      title: "BIR Registration",
      description: "TIN and Official Receipt compliance.",
      required: true,
      fileName: "bir-2303.pdf",
      status: "Revision Requested",
      url: "#",
    },
    {
      id: "doc5",
      title: "FDA Licensing",
      description: "For pre-packaged or manufactured food.",
      required: false,
      fileName: undefined,
      status: "Not Uploaded",
    },
  ],
};

interface TenantProfilePageProps {
  tenantId: string;
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
  const [modal, setModal] = useState<ModalState>({
    isOpen: false,
    type: null,
    title: "",
    description: "",
    requireReason: false,
  });
  const [reason, setReason] = useState("");

  useEffect(() => {
    // Simulate network fetch for the profile
    const timer = setTimeout(() => {
      setTenant(MOCK_TENANT);
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, [tenantId]);

  const handleStatusChange = (newStatus: TenantProfileData["status"]) => {
    if (!tenant) return;
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
        description: "Please provide a reason for rejecting this tenant application.",
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
    newStatus: "Approved" | "Revision Requested"
  ) => {
    if (!tenant) return;
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

  const confirmAction = () => {
    if (!tenant) return;
    if (modal.type === "approve_tenant" || modal.type === "reactivate_tenant") {
      setTenant((prev) => prev ? { ...prev, status: "Active" } : null);
    } else if (modal.type === "reject_tenant") {
      setTenant((prev) => prev ? { ...prev, status: "Rejected" } : null);
    } else if (modal.type === "suspend_tenant") {
      setTenant((prev) => prev ? { ...prev, status: "Suspended" } : null);
    } else if (modal.type === "approve_doc" && modal.targetId) {
      setTenant((prev) => prev ? ({
        ...prev,
        documents: prev.documents.map((doc) =>
          doc.id === modal.targetId ? { ...doc, status: "Approved" } : doc
        ),
      }) : null);
    } else if (modal.type === "revision_doc" && modal.targetId) {
      setTenant((prev) => prev ? ({
        ...prev,
        documents: prev.documents.map((doc) =>
          doc.id === modal.targetId ? { ...doc, status: "Revision Requested" } : doc
        ),
      }) : null);
    }

    closeModal();
  };

  const closeModal = () => {
    setModal({ ...modal, isOpen: false });
    setReason("");
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
            className="flex flex-col gap-8 w-full max-w-[1440px] mx-auto"
          >
            <TenantProfileHeader
              tenant={tenant}
              onStatusChange={handleStatusChange}
            />
            <TenantProfileBentoGrid
              tenant={tenant}
              onUpdateDocumentStatus={handleUpdateDocumentStatus}
            />
          </motion.div>
        ) : null}
      </AnimatePresence>

      <Modal isOpen={modal.isOpen} onClose={closeModal} title={modal.title}>
        <div className="flex flex-col gap-6">
          <p className="text-[15px] text-text-secondary">
            {modal.description}
          </p>

          {modal.requireReason && (
            <FormField
              label="Reason (Required)"
              placeholder="e.g., Document is blurred, Information mismatch..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full"
            />
          )}

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button variant="outline" onClick={closeModal}>
              Cancel
            </Button>
            <Button
              variant={
                modal.type?.includes("reject") || modal.type?.includes("revision")
                  ? "outline"
                  : "primary"
              }
              className={
                modal.type?.includes("reject") || modal.type?.includes("revision") || modal.type?.includes("suspend")
                  ? "text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300 bg-white"
                  : ""
              }
              disabled={modal.requireReason && reason.trim() === ""}
              onClick={confirmAction}
            >
              Confirm
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

