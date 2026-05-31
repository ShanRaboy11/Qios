"use client";

import React, { useState } from "react";
import { Button } from "@/components/atoms/Button";
import { Badge } from "@/components/atoms/Badge";
import { Building2, Plus, ArrowRight, Loader2, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

type Branch = {
  id: string;
  name: string;
  business_name: string;
  status: string;
  created_at: string;
  subscription_plan: string;
};

export default function BranchesClient({
  branches,
  activeTenantId,
}: {
  branches: Branch[];
  activeTenantId: string;
}) {
  const router = useRouter();
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

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

  const handleCreateBranch = async () => {
    const branchName = prompt("Enter the name for the new branch:");
    if (!branchName?.trim()) return;

    setCreating(true);
    setError("");

    try {
      const res = await fetch("/api/tenants/create-branch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ branchName }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to create branch");

      router.push(`/${data.tenantId}/dashboard`);
    } catch (err: any) {
      setError(err.message);
      setCreating(false);
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
        <Button
          onClick={handleCreateBranch}
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

      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {branches.map((branch) => {
          const isActive = branch.id === activeTenantId;
          const isLoading = loadingId === branch.id;

          return (
            <div
              key={branch.id}
              className={cn(
                "p-6 rounded-3xl border transition-all duration-300 flex flex-col gap-4",
                isActive
                  ? "border-brand-primary bg-orange-50/50 shadow-md ring-1 ring-brand-primary/20"
                  : "border-gray-100 bg-white hover:border-gray-200 hover:shadow-sm"
              )}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div
                    className={cn(
                      "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-inner",
                      isActive
                        ? "bg-brand-primary text-white"
                        : "bg-gray-100 text-gray-500"
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
                <Button
                  variant="outline"
                  className="w-full mt-2"
                  onClick={() => handleSwitch(branch.id)}
                  disabled={!!loadingId}
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
    </div>
  );
}
