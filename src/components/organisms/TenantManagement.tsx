"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import {
  getTenants,
  updateTenantStatus,
} from "@/app/(admin)/admin/tenants/actions";
import { useRouter } from "next/navigation";
import {
  Search,
  Building2,
  Check,
  Loader2,
  X,
  SlidersHorizontal,
} from "lucide-react";
import { FormField } from "@/components/molecules/FormField";
import { Dropdown } from "@/components/molecules/Dropdown";
import { Badge } from "@/components/atoms/Badge";
import { Button } from "@/components/atoms/Button";
import { ActionConfirmationModal } from "@/components/molecules/ConfirmationModal";

interface Tenant {
  id: string;
  business_name: string;
  owner: string;
  type: "Basic" | "Business" | "Enterprise";
  joined: string;
  status: "Active" | "Suspended" | "Pending" | "Rejected" | "Onboarding";
  rawStatus?: string;
}

const INITIAL_DATA: Tenant[] = [
  {
    id: "TEN-2026-001",
    business_name: "Lola's Lechon House",
    owner: "Maria Santos",
    type: "Business",
    joined: "Jan 15, 2026",
    status: "Active",
  },
  {
    id: "TEN-2026-002",
    business_name: "Kape Republika",
    owner: "Juan Dela Cruz",
    type: "Enterprise",
    joined: "Jan 22, 2026",
    status: "Active",
  },
  {
    id: "TEN-2026-003",
    business_name: "Sugbo Mercado Central",
    owner: "Carlo Reyes",
    type: "Enterprise",
    joined: "Feb 3, 2026",
    status: "Pending",
  },
  {
    id: "TEN-2026-004",
    business_name: "Tatay's Grill Station",
    owner: "Roberto Garcia",
    type: "Basic",
    joined: "Feb 10, 2026",
    status: "Suspended",
  },
  {
    id: "TEN-2026-005",
    business_name: "Seafood Express",
    owner: "Ana Mercado",
    type: "Business",
    joined: "Feb 18, 2026",
    status: "Active",
  },
  {
    id: "TEN-2026-006",
    business_name: "Crispy Pata Corner",
    owner: "Eddie Tan",
    type: "Basic",
    joined: "Mar 1, 2026",
    status: "Rejected",
  },
];

let tenantCache: Tenant[] | null = null;
let tenantCacheTimestamp = 0;
const TENANT_CACHE_TTL_MS = 30_000;

function updateTenantCache(nextTenants: Tenant[]) {
  tenantCache = nextTenants;
  tenantCacheTimestamp = Date.now();
}

export type ActionType =
  | "approve"
  | "reject"
  | "reapprove"
  | "deactivate"
  | "activate";

export interface TenantManagementProps {
  initialStatusFilter?: string;
  initialTenants?: Tenant[];
}

export default function TenantManagement({
  initialStatusFilter,
  initialTenants = [],
}: TenantManagementProps) {
  const router = useRouter();
  const [tenants, setTenants] = useState<Tenant[]>(() => {
    if (initialTenants.length > 0) return initialTenants;
    return tenantCache ?? [];
  });
  const [isLoadingTenants, setIsLoadingTenants] = useState(
    initialTenants.length === 0 && (tenantCache?.length ?? 0) === 0,
  );
  const [isRefreshingTenants, setIsRefreshingTenants] = useState(false);
  const [tenantListError, setTenantListError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState(
    initialStatusFilter || "All",
  );
  const [typeFilter, setTypeFilter] = useState("All");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialStatusFilter) {
      setStatusFilter(initialStatusFilter);
    }
  }, [initialStatusFilter]);

  useEffect(() => {
    if (initialTenants.length > 0) {
      setTenants(initialTenants);
      setIsLoadingTenants(false);
      setIsRefreshingTenants(false);
      setTenantListError(null);
      updateTenantCache(initialTenants);
      return;
    }

    const cachedTenants = tenantCache ?? [];
    const hasCachedTenants = cachedTenants.length > 0;
    const isCacheFresh =
      hasCachedTenants &&
      Date.now() - tenantCacheTimestamp < TENANT_CACHE_TTL_MS;

    if (hasCachedTenants) {
      setTenants(cachedTenants);
      setIsLoadingTenants(false);
    }

    if (isCacheFresh) {
      setTenantListError(null);
      return;
    }

    let isMounted = true;
    const loadTenants = async () => {
      if (hasCachedTenants) {
        setIsRefreshingTenants(true);
      } else {
        setIsLoadingTenants(true);
      }
      setTenantListError(null);

      try {
        const fetchedTenants = await getTenants();
        if (!isMounted) return;

        setTenants(fetchedTenants);
        updateTenantCache(fetchedTenants);
      } catch (error) {
        console.error("Failed to load tenants", error);
        if (!isMounted) return;

        if (hasCachedTenants) {
          setTenantListError(
            "Unable to refresh tenant data right now. Showing last loaded data.",
          );
        } else {
          // Keep the UI usable in local dev even if Supabase is unavailable.
          setTenants(INITIAL_DATA);
          setTenantListError(
            "Live tenant data is unavailable. Showing fallback data.",
          );
        }
      } finally {
        if (isMounted) {
          setIsLoadingTenants(false);
          setIsRefreshingTenants(false);
        }
      }
    };

    loadTenants();

    return () => {
      isMounted = false;
    };
  }, [initialTenants]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        filterRef.current &&
        !filterRef.current.contains(event.target as Node)
      ) {
        setIsFilterOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
  const [actionType, setActionType] = useState<ActionType | null>(null);

  const openModal = (tenant: Tenant, action: ActionType) => {
    setSelectedTenant(tenant);
    setActionType(action);
    setModalOpen(true);
  };

  const confirmAction = async () => {
    if (!selectedTenant || !actionType) return;

    let dbStatus: "pending" | "approved" | "rejected" = "approved";
    let newStatus: Tenant["status"] = "Active";

    switch (actionType) {
      case "approve":
      case "reapprove":
      case "activate":
        dbStatus = "approved";
        newStatus = "Active";
        break;
      case "reject":
      case "deactivate":
        dbStatus = "rejected";
        newStatus = "Rejected";
        break;
    }

    try {
      await updateTenantStatus(selectedTenant.id, dbStatus);
      setTenants((prev) =>
        prev.map((t) =>
          t.id === selectedTenant.id ? { ...t, status: newStatus } : t,
        ),
      );
    } catch (err) {
      console.error("Failed to update status", err);
    }

    setModalOpen(false);
    setSelectedTenant(null);
    setActionType(null);
  };

  const handleTenantClick = (tenant: Tenant) => {
    router.push(`/admin/tenants/${tenant.id}`);
  };

  const prefetchTenantDetails = (tenantId: string) => {
    void router.prefetch(`/admin/tenants/${tenantId}`);
  };

  const filteredTenants = useMemo(() => {
    const query = searchTerm.toLowerCase();
    return tenants.filter((t) => {
      const matchesSearch =
        t.business_name.toLowerCase().includes(query) ||
        t.id.toLowerCase().includes(query) ||
        t.owner.toLowerCase().includes(query);
      const matchesStatus = statusFilter === "All" || t.status === statusFilter;
      const matchesType = typeFilter === "All" || t.type === typeFilter;

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [searchTerm, statusFilter, typeFilter, tenants]);

  const stats = useMemo(
    () => ({
      total: tenants.length,
      active: tenants.filter((t) => t.status === "Active").length,
      pending: tenants.filter((t) => t.status === "Pending").length,
      suspended: tenants.filter((t) => t.status === "Suspended").length,
      rejected: tenants.filter((t) => t.status === "Rejected").length,
      onboarding: tenants.filter((t) => t.status === "Onboarding").length,
    }),
    [tenants],
  );

  return (
    <div className="w-full mx-auto space-y-4 px-1 pb-10">
      <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-4 py-2">
        <div className="flex items-center gap-2">
          <span className="b1 text-gray-500">Total:</span>
          <span className="b1 text-gray-900">{stats.total}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 bg-green-500 rounded-full" />
          <span className="b1 text-gray-500">Active:</span>
          <span className="b1 text-green-900">{stats.active}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 bg-gray-400 rounded-full" />
          <span className="b1 text-gray-500">Suspended:</span>
          <span className="b1 text-gray-900">{stats.suspended}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 bg-yellow-400 rounded-full" />
          <span className="b1 text-gray-500">Pending:</span>
          <span className="b1 text-gray-900">{stats.pending}</span>
        </div>

        <div className="w-2.5 h-2.5 bg-[#ffc670] rounded-full" />
        <span className="b1 text-gray-500">Onboarding:</span>
        <span className="b1 text-gray-900">{stats.onboarding}</span>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 bg-warning-primary rounded-full" />
          <span className="b1 text-gray-500">Rejected:</span>
          <span className="b1 text-gray-900">{stats.rejected}</span>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="mt-5 flex flex-col md:flex-row items-stretch md:items-end gap-3 w-full">
        <div className="flex-1">
          <FormField
            label=" "
            placeholder="Search tenants by name, ID, or owner..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            leftIcon={<Search size={20} className="text-gray-400" />}
            className="max-w-none"
          />
        </div>

        <div className="relative shrink-0" ref={filterRef}>
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={cn(
              "h-[52px] w-full md:w-auto px-4 md:px-6 flex justify-center items-center gap-2 bg-white border-2 rounded-2xl transition-all group",
              isFilterOpen
                ? "border-[#ffc670] bg-orange-50/30"
                : "border-[#E5E5E5] hover:bg-slate-50",
            )}
          >
            <SlidersHorizontal
              size={18}
              className={cn(
                "transition-colors",
                isFilterOpen
                  ? "text-[#ffc670]"
                  : "text-[#707070] group-hover:text-[#ffc670]",
              )}
            />
            <span
              className={cn(
                "inline-block text-sm md:text-base font-medium transition-colors",
                isFilterOpen
                  ? "text-[#2d2d2d]"
                  : "text-[#707070] group-hover:text-[#2d2d2d]",
              )}
            >
              Filters
            </span>
          </button>

          {isFilterOpen && (
            <div className="absolute top-[110%] right-0 w-[280px] z-40 bg-white border-2 border-[#E5E5E5] rounded-2xl shadow-xl p-4 animate-in fade-in zoom-in-95 duration-200">
              <div className="mb-4">
                <Dropdown
                  label="Status"
                  options={[
                    { label: "All Statuses", value: "All" },
                    { label: "Active", value: "Active" },
                    { label: "Pending", value: "Pending" },
                    { label: "Suspended", value: "Suspended" },
                    { label: "Rejected", value: "Rejected" },
                    { label: "Onboarding", value: "Onboarding" },
                  ]}
                  value={statusFilter}
                  onSelect={(opt) => setStatusFilter(opt.value)}
                  className="w-full"
                />
              </div>

              <div>
                <Dropdown
                  label="Plan"
                  options={[
                    { label: "All Plans", value: "All" },
                    { label: "Basic", value: "Basic" },
                    { label: "Business", value: "Business" },
                    { label: "Enterprise", value: "Enterprise" },
                  ]}
                  value={typeFilter}
                  onSelect={(opt) => setTypeFilter(opt.value)}
                  className="w-full"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tenant List */}
      <div className="flex flex-col gap-3 mt-3">
        {tenantListError && (
          <div className="rounded-2xl border border-warning-primary/20 bg-warning-primary/5 px-4 py-3 text-sm text-warning-primary">
            {tenantListError}
          </div>
        )}

        {isRefreshingTenants && !isLoadingTenants && (
          <div className="rounded-2xl border border-gray-100 bg-white px-4 py-3 text-sm text-gray-500 flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            Refreshing tenant directory...
          </div>
        )}

        {isLoadingTenants && (
          <div className="space-y-3">
            {[1, 2, 3].map((item) => (
              <TenantCardSkeleton key={item} />
            ))}
          </div>
        )}

        {!isLoadingTenants &&
          filteredTenants.map((tenant) => (
            <TenantCard
              key={tenant.id}
              tenant={tenant}
              onClick={handleTenantClick}
              onPrefetch={prefetchTenantDetails}
            />
          ))}
        {!isLoadingTenants && filteredTenants.length === 0 && (
          <div className="text-center py-12 text-gray-400 bg-white rounded-2xl border border-dashed">
            No tenants found matching your search and filters.
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {modalOpen && selectedTenant && actionType && (
        <ConfirmationModal
          tenant={selectedTenant}
          actionType={actionType}
          onConfirm={confirmAction}
          onCancel={() => setModalOpen(false)}
        />
      )}
    </div>
  );
}

function TenantCardSkeleton() {
  return (
    <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-100 shadow-sm animate-pulse">
      <div className="flex items-start md:items-center gap-4">
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gray-100" />
        <div className="flex-1 min-w-0 space-y-2">
          <div className="h-4 sm:h-5 w-2/3 bg-gray-100 rounded-lg" />
          <div className="h-3 w-1/2 bg-gray-100 rounded-lg" />
        </div>
        <div className="h-6 w-20 bg-gray-100 rounded-full" />
      </div>
    </div>
  );
}

function TenantCard({
  tenant,
  onClick,
  onPrefetch,
}: {
  tenant: Tenant;
  onClick: (tenant: Tenant) => void;
  onPrefetch: (tenantId: string) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onClick(tenant)}
      onMouseEnter={() => onPrefetch(tenant.id)}
      onFocus={() => onPrefetch(tenant.id)}
      className="group bg-white p-4 sm:p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center gap-4 transition-all hover:border-orange-100 block"
    >
      <div className="flex items-start md:items-center gap-4 md:w-[60%] shrink-0">
        {/* Logo */}
        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-orange-300 via-orange-300 to-amber-200 rounded-2xl flex items-center justify-center border-[1.5px] border-white shadow-sm flex-shrink-0">
          <Building2 className="w-5 h-5 sm:w-6 sm:h-6 text-white opacity-90" />
        </div>

        {/* Info */}
        <div className="flex flex-col gap-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-gray-900 text-base sm:text-lg font-semibold tracking-tight truncate group-hover:text-brand-accent transition-colors cursor-pointer">
              {tenant.business_name}
            </h3>
          </div>
          <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 font-normal">
            <span className="truncate">ID: {tenant.id}</span>
            <span className="text-gray-300">•</span>
            <span className="truncate">Owner: {tenant.owner}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-row items-center justify-between w-full md:w-auto md:flex-1 gap-3 md:gap-6 border-t border-gray-50 pt-3 md:pt-0 md:border-none mt-2 md:mt-0">
        {/* Left Section: Joined Date & Status Indicator grouped together */}
        <div className="flex items-center gap-6 shrink-0">
          <span className="hidden lg:block text-gray-500 text-sm font-normal shrink-0">
            Joined {tenant.joined}
          </span>

          {/* Status Indicator placed close to the joined date */}
          <div className="flex items-center gap-2 sm:min-w-[85px] justify-between">
            <div
              className={cn(
                "w-2 h-2 rounded-full",
                tenant.status === "Active" && "bg-success-primary",
                tenant.status === "Pending" && "bg-brand-secondary",
                tenant.status === "Suspended" && "bg-gray-500",
                tenant.status === "Onboarding" && "bg-[#ffc670]",
                tenant.status === "Rejected" && "bg-warning-primary",
              )}
            />
            <span
              className={cn(
                "text-xs sm:text-sm font-medium",
                tenant.status === "Active" && "text-success-primary",
                tenant.status === "Pending" && "text-brand-secondary",
                tenant.status === "Suspended" && "text-gray-500",
                tenant.status === "Onboarding" && "text-[#ffc670]",
                tenant.status === "Rejected" && "text-warning-primary",
              )}
            >
              {tenant.status}
            </span>
          </div>
        </div>

        {/* Right Section: Badge pushed to the right */}
        <div className="flex items-center md:ml-auto">
          <Badge
            variant="outline"
            color={
              tenant.type === "Enterprise"
                ? "success"
                : tenant.type === "Business"
                  ? "accent"
                  : "warning"
            }
          >
            {tenant.type}
          </Badge>
        </div>
      </div>
    </button>
  );
}

function ConfirmationModal({
  tenant,
  actionType,
  onConfirm,
  onCancel,
}: {
  tenant: Tenant;
  actionType: ActionType;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const sharedAction =
    actionType === "approve" || actionType === "reapprove"
      ? "approve"
      : actionType === "reject"
        ? "reject"
        : actionType === "deactivate"
          ? "delete"
          : "approve";

  return (
    <ActionConfirmationModal
      isOpen
      action={sharedAction}
      activePlanName={tenant.business_name}
      title={
        actionType === "approve" || actionType === "reapprove"
          ? "Approve Tenant"
          : actionType === "reject"
            ? "Reject Tenant"
            : actionType === "deactivate"
              ? "Deactivate Tenant"
              : "Activate Tenant"
      }
      message={
        actionType === "approve" || actionType === "reapprove"
          ? `Are you sure you want to approve ${tenant.business_name}? They will gain full access to the platform.`
          : actionType === "reject"
            ? `Are you sure you want to reject ${tenant.business_name}? This action cannot be undone immediately.`
            : actionType === "deactivate"
              ? `Are you sure you want to suspend ${tenant.business_name}? Their access will be temporarily disabled.`
              : `Are you sure you want to reactivate ${tenant.business_name}? Their access will be restored.`
      }
      confirmLabel={
        actionType === "approve" || actionType === "reapprove"
          ? "Approve"
          : actionType === "reject"
            ? "Reject"
            : actionType === "deactivate"
              ? "Deactivate"
              : "Activate"
      }
      confirmVariant={
        actionType === "reject" || actionType === "deactivate"
          ? "outline"
          : "primary"
      }
      onClose={onCancel}
      onConfirm={onConfirm}
    />
  );
}
