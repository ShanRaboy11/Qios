"use client";

import React, { useMemo, useState } from "react";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
import { Badge } from "@/components/atoms/Badge";
import { ActionConfirmationModal } from "@/components/molecules/ConfirmationModal";
import {
  Building2,
  Plus,
  ArrowRight,
  Loader2,
  RefreshCw,
  Trash2,
  X,
  AlertCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

type Branch = {
  id: string;
  name?: string;
  business_name: string;
  status: string;
  created_at: string;
  subscription_plan: string;
};

function ModalOverlay({
  onClose,
  children,
}: {
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
    >
      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-lg">
        {children}
      </div>
    </div>
  );
}

export default function BranchesClient({
  branches,
  activeTenantId,
  originalTenantId,
}: {
  branches: Branch[];
  activeTenantId: string;
  originalTenantId: string | null;
}) {
  const router = useRouter();
  const [branchItems, setBranchItems] = useState<Branch[]>(branches);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Branch | null>(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [branchName, setBranchName] = useState("");
  const [branchNameError, setBranchNameError] = useState("");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  const normalizedExistingBranchNames = useMemo(
    () =>
      branches
        .map((branch) => branch.business_name || branch.name || "")
        .filter(Boolean)
        .map((name) => name.trim().toLowerCase()),
    [branchItems],
  );

  const validateBranchName = (value: string) => {
    const trimmed = value.trim();

    if (!trimmed) return "Branch name is required.";
    if (trimmed.length < 2) return "Branch name must be at least 2 characters.";
    if (trimmed.length > 80)
      return "Branch name must be 80 characters or less.";

    if (normalizedExistingBranchNames.includes(trimmed.toLowerCase())) {
      return "A branch with this name already exists.";
    }

    return "";
  };

  const openCreateModal = () => {
    setBranchName("");
    setBranchNameError("");
    setError("");
    setCreateModalOpen(true);
  };

  const closeCreateModal = () => {
    if (creating) return;

    setCreateModalOpen(false);
    setBranchName("");
    setBranchNameError("");
  };

  const handleSwitch = async (tenantId: string) => {
    if (tenantId === activeTenantId) return;
    setLoadingId(tenantId);
    setError("");

    try {
      const res = await fetch("/api/tenants/switch-branch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetTenantId: tenantId }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to switch branch");

      router.push(`/${tenantId}/dashboard`);
    } catch (err: any) {
      setError(err.message);
      setLoadingId(null);
    }
  };

  const handleCreateBranch = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationMessage = validateBranchName(branchName);
    if (validationMessage) {
      setBranchNameError(validationMessage);
      return;
    }

    setCreating(true);
    setError("");
    setBranchNameError("");

    try {
      const res = await fetch("/api/tenants/create-branch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ branchName: branchName.trim() }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to create branch");

      setCreateModalOpen(false);
      setBranchName("");
      router.push(`/${data.tenantId}/dashboard`);
    } catch (err: any) {
      setError(err.message);
      setCreating(false);
    }
  };

  const handleDeleteBranch = async () => {
    if (!deleteTarget) return;

    setDeletingId(deleteTarget.id);
    setError("");

    try {
      const res = await fetch("/api/tenants/delete-branch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetTenantId: deleteTarget.id }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to delete branch");

      setBranchItems((prev) =>
        prev.filter((branch) => branch.id !== deleteTarget.id),
      );
      setDeleteTarget(null);
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-300">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-figtree tracking-tight text-gray-900">
            Multi-Branch Management
          </h1>
          <p className="text-gray-500 mt-1">
            Manage and switch between your enterprise locations seamlessly.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button
            onClick={openCreateModal}
            disabled={creating}
            className="shadow-sm flex items-center gap-2"
          >
            {creating ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Plus className="w-4 h-4" />
            )}
            Add New Branch
          </Button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 text-sm">
          {error}
        </div>
      )}

      {createModalOpen && (
        <ModalOverlay onClose={closeCreateModal}>
          <div className="bg-white rounded-[24px] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-5 border-b border-black/5 bg-black/[0.02]">
              <div>
                <h3 className="text-xl font-bold text-text-primary">
                  Add New Branch
                </h3>
                <p className="text-sm text-text-secondary mt-1">
                  Enter a name for the new location.
                </p>
              </div>
              <button
                onClick={closeCreateModal}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-black/5 hover:bg-black/10 text-text-secondary transition-colors"
                type="button"
              >
                <X size={16} />
              </button>
            </div>

            <form
              onSubmit={handleCreateBranch}
              className="p-5 flex flex-col gap-5"
            >
              {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-xl border border-red-100 flex items-start gap-2">
                  <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{error}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-text-secondary uppercase tracking-widest mb-1.5">
                  Branch Name
                </label>
                <Input
                  value={branchName}
                  onChange={(e) => {
                    setBranchName(e.target.value);
                    if (branchNameError) {
                      setBranchNameError(validateBranchName(e.target.value));
                    }
                  }}
                  placeholder="e.g. Main Branch"
                  isError={Boolean(branchNameError)}
                  autoFocus
                />
                {branchNameError ? (
                  <p className="mt-1.5 text-xs text-warning-primary">
                    {branchNameError}
                  </p>
                ) : (
                  <p className="mt-1.5 text-xs text-text-secondary">
                    This will be used as the business name for the branch.
                  </p>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-1 border-t border-black/5">
                <Button
                  variant="outline"
                  type="button"
                  onClick={closeCreateModal}
                  className="border-brand-primary text-brand-primary hover:!bg-brand-primary hover:!border-brand-primary hover:!text-white"
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  type="submit"
                  disabled={creating}
                  className="bg-brand-accent hover:bg-brand-accent/90 border-brand-accent text-white"
                >
                  {creating ? "Creating..." : "Create Branch"}
                </Button>
              </div>
            </form>
          </div>
        </ModalOverlay>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {branchItems.map((branch) => {
          const isActive = branch.id === activeTenantId;
          const isLoading = loadingId === branch.id;
          const isDeleting = deletingId === branch.id;
          const canDelete = branch.id !== originalTenantId && !isActive;

          return (
            <div
              key={branch.id}
              className={cn(
                "p-6 rounded-3xl border transition-all duration-300 flex flex-col gap-4",
                isActive
                  ? "border-brand-primary bg-orange-50/50 shadow-md ring-1 ring-brand-primary/20"
                  : "border-gray-100 bg-white hover:border-gray-200 hover:shadow-sm",
              )}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div
                    className={cn(
                      "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-inner",
                      isActive
                        ? "bg-brand-primary text-white"
                        : "bg-gray-100 text-gray-500",
                    )}
                  >
                    <Building2 className="w-6 h-6" />
                  </div>
                  <div className="flex flex-col">
                    <h3 className="font-semibold text-lg text-gray-900 truncate">
                      {branch.business_name || branch.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm text-gray-500">
                        {new Date(branch.created_at).toLocaleDateString()}
                      </span>
                      <span className="text-gray-300">&bull;</span>
                      <span className="text-sm text-gray-500 capitalize">
                        {branch.subscription_plan}
                      </span>
                    </div>
                  </div>
                </div>

                {isActive && (
                  <Badge variant="outline" color="success" className="shrink-0">
                    Active
                  </Badge>
                )}
                {!isActive && branch.status === "pending" && (
                  <Badge variant="outline" color="warning" className="shrink-0">
                    Pending
                  </Badge>
                )}
              </div>

              {!isActive && (
                <div className="mt-2 flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1 border-brand-primary text-brand-primary hover:!bg-brand-primary hover:!border-brand-primary hover:!text-white"
                    onClick={() => handleSwitch(branch.id)}
                    disabled={!!loadingId || !!deletingId}
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Switching...
                      </>
                    ) : (
                      <>
                        Switch to Branch
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>

                  {canDelete && (
                    <Button
                      variant="outline"
                      className="border-red-300 text-red-600 hover:!bg-red-500 hover:!border-red-500 hover:!text-white"
                      onClick={() => setDeleteTarget(branch)}
                      disabled={!!loadingId || !!deletingId}
                    >
                      {isDeleting ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Deleting...
                        </>
                      ) : (
                        <>
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </>
                      )}
                    </Button>
                  )}
                </div>
              )}
              {isActive && (
                <div className="mt-2 text-center text-sm font-medium text-brand-primary bg-white py-2 rounded-xl border border-brand-primary/20">
                  Currently Managing
                </div>
              )}
            </div>
          );
        })}
      </div>

      <ActionConfirmationModal
        isOpen={Boolean(deleteTarget)}
        action="delete"
        title="Delete branch?"
        message={
          deleteTarget
            ? `This will permanently delete ${deleteTarget.business_name} and its branch data.`
            : undefined
        }
        confirmLabel="Delete"
        onClose={() => {
          if (deletingId) return;
          setDeleteTarget(null);
        }}
        onConfirm={handleDeleteBranch}
        saving={Boolean(deletingId)}
      />
    </div>
  );
}
