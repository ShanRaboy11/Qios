"use client";

import React, { useState } from "react";
import { Power, Trash2 } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { ActionConfirmationModal } from "@/components/molecules/ConfirmationModal";
import { deactivateTenantStore, deleteTenantAccount } from "@/app/(tenant)/[id]/settings/actions";
import { useRouter } from "next/navigation";

interface TenantDangerZoneProps {
  tenantId: string;
  isDeactivated: boolean;
}

export const TenantDangerZone = ({ tenantId, isDeactivated }: TenantDangerZoneProps) => {
  const [localIsDeactivated, setLocalIsDeactivated] = useState(isDeactivated);
  const [isDeactivating, setIsDeactivating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const router = useRouter();

  const handleDeactivateToggle = async () => {
    setIsDeactivating(true);
    try {
      const nextState = !localIsDeactivated;
      await deactivateTenantStore(tenantId, nextState);
      setLocalIsDeactivated(nextState);
    } catch (err: any) {
      console.error("deactivate error:", err);
    } finally {
      setIsDeactivating(false);
    }
  };

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    try {
      await deleteTenantAccount(tenantId);
      // after deletion, redirect to landing or logout
      window.location.href = "/";
    } catch (err: any) {
      console.error("delete error:", err);
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 w-full">
      <div>
        <h2 className="text-xl font-bold text-red-600 mb-1">Danger Zone</h2>
        <p className="text-sm text-text-secondary">
          Irreversible and destructive actions for your tenant account.
        </p>
      </div>

      <div className="space-y-6">
        {/* deactivate store card */}
        <div className="flex flex-col md:flex-row gap-4 p-5 rounded-2xl border border-orange-200 bg-orange-50/50 justify-between items-start md:items-center">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center shrink-0 text-orange-600">
              <Power className="w-6 h-6" strokeWidth={1.8} />
            </div>
            <div className="flex flex-col gap-0.5 select-none pt-1">
              <span className="b2 font-bold text-orange-950">
                {localIsDeactivated ? "Reactivate Store" : "Deactivate Store"}
              </span>
              <span className="b4 text-orange-800/80 max-w-md">
                {localIsDeactivated
                  ? "Reactivate your store to make it visible to customer-facing interfaces."
                  : "Temporarily hide your store from customer-facing interfaces like kiosks and qr menus. you can reactivate anytime."}
              </span>
            </div>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleDeactivateToggle}
            loading={isDeactivating}
            className="border-orange-500 text-orange-600 hover:bg-orange-600 hover:text-white hover:border-orange-600 focus:ring-orange-500 flex-shrink-0"
          >
            {localIsDeactivated ? "Reactivate" : "Deactivate"}
          </Button>
        </div>

        {/* delete account card */}
        <div className="flex flex-col md:flex-row gap-4 p-5 rounded-2xl border border-red-200 bg-red-50/50 justify-between items-start md:items-center">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center shrink-0 text-red-600">
              <Trash2 className="w-6 h-6" strokeWidth={1.8} />
            </div>
            <div className="flex flex-col gap-0.5 select-none pt-1">
              <span className="b2 font-bold text-red-950">
                Delete Account & Store Data
              </span>
              <span className="b4 text-red-800/80 max-w-md">
                Permanently remove your account, store details, inventory, and transaction history. this action cannot be undone.
              </span>
            </div>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setShowDeleteModal(true)}
            className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white hover:border-red-600 focus:ring-red-600 flex-shrink-0"
          >
            Delete Account
          </Button>
        </div>
      </div>

      <ActionConfirmationModal
        isOpen={showDeleteModal}
        action="delete"
        title="Delete Account & Store Data"
        message="Are you sure you want to permanently delete your account and all associated store data? This action is irreversible and cannot be undone."
        confirmLabel="Delete permanently"
        cancelLabel="Cancel"
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteConfirm}
        saving={isDeleting}
      />
    </div>
  );
};
