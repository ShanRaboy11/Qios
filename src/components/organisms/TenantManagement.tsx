"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import {
  getTenantDirectoryDetails,
  getTenants,
  updateTenantStatus,
  type TenantDirectoryDetails,
} from "@/app/(admin)/admin/tenants/actions";
import {
  Search,
  Building2,
  Check,
  Eye,
  FileText,
  Loader2,
  X,
  SlidersHorizontal,
} from "lucide-react";
import { FormField } from "@/components/molecules/FormField";
import { Dropdown } from "@/components/molecules/Dropdown";
import { Badge } from "@/components/atoms/Badge";
import { Button } from "@/components/atoms/Button";
import { AnimatePresence, motion } from "framer-motion";

interface Tenant {
  id: string;
  name: string;
  owner: string;
  type: "Professional" | "Enterprise" | "Starter";
  joined: string;
  status: "Active" | "Suspended" | "Pending" | "Rejected";
}

const INITIAL_DATA: Tenant[] = [
  {
    id: "TEN-2026-001",
    name: "Lola's Lechon House",
    owner: "Maria Santos",
    type: "Professional",
    joined: "Jan 15, 2026",
    status: "Active",
  },
  {
    id: "TEN-2026-002",
    name: "Kape Republika",
    owner: "Juan Dela Cruz",
    type: "Enterprise",
    joined: "Jan 22, 2026",
    status: "Active",
  },
  {
    id: "TEN-2026-003",
    name: "Sugbo Mercado Central",
    owner: "Carlo Reyes",
    type: "Enterprise",
    joined: "Feb 3, 2026",
    status: "Pending",
  },
  {
    id: "TEN-2026-004",
    name: "Tatay's Grill Station",
    owner: "Roberto Garcia",
    type: "Starter",
    joined: "Feb 10, 2026",
    status: "Suspended",
  },
  {
    id: "TEN-2026-005",
    name: "Seafood Express",
    owner: "Ana Mercado",
    type: "Professional",
    joined: "Feb 18, 2026",
    status: "Active",
  },
  {
    id: "TEN-2026-006",
    name: "Crispy Pata Corner",
    owner: "Eddie Tan",
    type: "Starter",
    joined: "Mar 1, 2026",
    status: "Rejected",
  },
];

let tenantCache: Tenant[] | null = null;
let tenantCacheTimestamp = 0;
const TENANT_CACHE_TTL_MS = 30_000;
const TENANT_DETAILS_CACHE_TTL_MS = 90_000;
const tenantDetailsCache = new Map<
  string,
  { data: TenantDirectoryDetails; timestamp: number }
>();
const tenantDetailsRequests = new Map<
  string,
  Promise<TenantDirectoryDetails>
>();

function updateTenantCache(nextTenants: Tenant[]) {
  tenantCache = nextTenants;
  tenantCacheTimestamp = Date.now();
}

function getCachedTenantDetails(
  tenantId: string,
): TenantDirectoryDetails | null {
  const cached = tenantDetailsCache.get(tenantId);
  if (!cached) return null;

  if (Date.now() - cached.timestamp > TENANT_DETAILS_CACHE_TTL_MS) {
    tenantDetailsCache.delete(tenantId);
    return null;
  }

  return cached.data;
}

function updateTenantDetailsCache(details: TenantDirectoryDetails) {
  tenantDetailsCache.set(details.id, {
    data: details,
    timestamp: Date.now(),
  });
}

async function fetchTenantDetailsWithCache(
  tenantId: string,
  forceRefresh = false,
): Promise<TenantDirectoryDetails> {
  const cached = getCachedTenantDetails(tenantId);
  if (cached && !forceRefresh) {
    return cached;
  }

  const existingRequest = tenantDetailsRequests.get(tenantId);
  if (existingRequest) {
    return existingRequest;
  }

  const request = getTenantDirectoryDetails(tenantId)
    .then((details) => {
      updateTenantDetailsCache(details);
      return details;
    })
    .finally(() => {
      tenantDetailsRequests.delete(tenantId);
    });

  tenantDetailsRequests.set(tenantId, request);
  return request;
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
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [tenantDetails, setTenantDetails] =
    useState<TenantDirectoryDetails | null>(null);
  const [tenantDetailsError, setTenantDetailsError] = useState<string | null>(
    null,
  );

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

  const handleTenantClick = async (tenant: Tenant) => {
    setIsDetailsModalOpen(true);
    setTenantDetailsError(null);

    const cachedDetails = getCachedTenantDetails(tenant.id);
    if (cachedDetails) {
      setTenantDetails(cachedDetails);
      setIsLoadingDetails(false);
    } else {
      setIsLoadingDetails(true);
      setTenantDetails(null);
    }

    try {
      const details = await fetchTenantDetailsWithCache(
        tenant.id,
        !cachedDetails,
      );
      setTenantDetails(details);
    } catch (error) {
      console.error("Failed to load tenant details", error);
      if (cachedDetails) {
        setTenantDetails(cachedDetails);
        setTenantDetailsError(
          "Showing cached details. Unable to refresh right now.",
        );
      } else {
        setTenantDetailsError(
          "Unable to load this tenant's details right now.",
        );
        setTenantDetails({
          id: tenant.id,
          name: tenant.name,
          owner: tenant.owner,
          ownerEmail: null,
          ownerPhone: null,
          joined: tenant.joined,
          status: tenant.status,
          documents: [],
        });
      }
    } finally {
      setIsLoadingDetails(false);
    }
  };

  const prefetchTenantDetails = (tenantId: string) => {
    if (getCachedTenantDetails(tenantId)) return;
    void fetchTenantDetailsWithCache(tenantId).catch(() => {
      // Silent prefetch failure: click handler handles user-facing errors.
    });
  };

  const filteredTenants = useMemo(() => {
    const query = searchTerm.toLowerCase();
    return tenants.filter((t) => {
      const matchesSearch =
        t.name.toLowerCase().includes(query) ||
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
                    { label: "Professional", value: "Professional" },
                    { label: "Enterprise", value: "Enterprise" },
                    { label: "Starter", value: "Starter" },
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

      <TenantDetailsModal
        isOpen={isDetailsModalOpen}
        isLoading={isLoadingDetails}
        tenant={tenantDetails}
        error={tenantDetailsError}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setTenantDetails(null);
          setTenantDetailsError(null);
        }}
      />

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
              {tenant.name}
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
                tenant.status === "Rejected" && "bg-warning-primary",
              )}
            />
            <span
              className={cn(
                "text-xs sm:text-sm font-medium",
                tenant.status === "Active" && "text-success-primary",
                tenant.status === "Pending" && "text-brand-secondary",
                tenant.status === "Suspended" && "text-gray-500",
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
                ? "primary"
                : tenant.type === "Professional"
                  ? "accent"
                  : "info"
            }
          >
            {tenant.type}
          </Badge>
        </div>
      </div>
    </button>
  );
}

function TenantDetailsModal({
  isOpen,
  isLoading,
  tenant,
  error,
  onClose,
}: {
  isOpen: boolean;
  isLoading: boolean;
  tenant: TenantDirectoryDetails | null;
  error: string | null;
  onClose: () => void;
}) {
  const [previewDocument, setPreviewDocument] = useState<{
    url: string;
    title: string;
  } | null>(null);

  useEffect(() => {
    setPreviewDocument(null);
  }, [tenant?.id, isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[120] flex items-start justify-center bg-black/45 backdrop-blur-sm p-4 pt-14 md:pt-20"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
        >
          <motion.div
            className="bg-white rounded-[24px] w-full max-w-4xl shadow-xl max-h-[84vh] overflow-hidden"
            onClick={(event) => event.stopPropagation()}
            initial={{ opacity: 0, y: 16, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.99 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
              <div>
                <h3 className="text-[20px] font-bold text-[#2D2D2D]">
                  Tenant Details
                </h3>
                <p className="text-[13px] text-text-secondary">
                  Business profile and submitted verification documents.
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-text-secondary hover:text-text-primary hover:bg-gray-50 rounded-full transition-colors"
                aria-label="Close tenant details modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto max-h-[calc(84vh-80px)]">
              {isLoading && (
                <div className="flex items-center justify-center gap-2 py-12 text-text-secondary">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Loading tenant details...</span>
                </div>
              )}

              {!isLoading && tenant && (
                <div className="space-y-6">
                  <div className="rounded-2xl border border-gray-100 bg-gray-50/40 p-5">
                    <div className="flex items-center justify-between gap-4 mb-4">
                      <div>
                        <h4 className="text-[18px] font-semibold text-text-primary">
                          {tenant.name}
                        </h4>
                        <p className="text-sm text-text-secondary">
                          ID: {tenant.id}
                        </p>
                      </div>
                      <Badge
                        variant="outline"
                        color={
                          tenant.status === "Active"
                            ? "success"
                            : tenant.status === "Pending"
                              ? "primary"
                              : tenant.status === "Rejected"
                                ? "error"
                                : "info"
                        }
                      >
                        {tenant.status}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-text-secondary">Owner</span>
                        <p className="font-medium text-text-primary">
                          {tenant.owner}
                        </p>
                      </div>
                      <div>
                        <span className="text-text-secondary">Email</span>
                        <p className="font-medium text-text-primary">
                          {tenant.ownerEmail || "Not available"}
                        </p>
                      </div>
                      <div>
                        <span className="text-text-secondary">Phone</span>
                        <p className="font-medium text-text-primary">
                          {tenant.ownerPhone || "Not available"}
                        </p>
                      </div>
                      <div>
                        <span className="text-text-secondary">Joined</span>
                        <p className="font-medium text-text-primary">
                          {tenant.joined}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h5 className="text-[16px] font-semibold text-text-primary">
                        Verification Documents
                      </h5>
                      <span className="text-xs text-text-secondary">
                        {tenant.documents.filter((doc) => doc.submitted).length}{" "}
                        submitted
                      </span>
                    </div>

                    {tenant.documents.length === 0 ? (
                      <div className="rounded-2xl border border-dashed border-gray-200 p-6 text-center text-sm text-text-secondary">
                        No submitted documents found.
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {tenant.documents.map((doc) => (
                          <div
                            key={doc.id}
                            className="rounded-2xl border border-gray-100 bg-white p-4 flex flex-col gap-3"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex items-start gap-2 min-w-0">
                                <FileText className="w-4 h-4 mt-0.5 text-text-secondary shrink-0" />
                                <div className="min-w-0">
                                  <p className="text-sm font-semibold text-text-primary truncate">
                                    {doc.title}
                                  </p>
                                  <p className="text-xs text-text-secondary leading-snug mt-1">
                                    {doc.description}
                                  </p>
                                </div>
                              </div>
                              {doc.required && (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase text-red-600 bg-red-50">
                                  Required
                                </span>
                              )}
                            </div>

                            {doc.submitted ? (
                              <div className="flex items-center justify-between gap-2 rounded-xl border border-green-100 bg-green-50/60 px-3 py-2">
                                <span className="text-xs font-medium text-green-800 truncate">
                                  {doc.fileName || "Uploaded file"}
                                </span>
                                {doc.url && (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setPreviewDocument({
                                        url: doc.url || "",
                                        title: doc.fileName || doc.title,
                                      })
                                    }
                                    className="text-xs font-semibold text-brand-primary hover:underline inline-flex items-center gap-1 shrink-0"
                                  >
                                    View
                                    <Eye className="w-3 h-3" />
                                  </button>
                                )}
                              </div>
                            ) : (
                              <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 px-3 py-2 text-xs text-text-secondary text-center">
                                Not submitted
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {previewDocument && (
                    <div className="rounded-2xl border border-gray-100 bg-gray-50/40 p-4 space-y-3">
                      <div className="flex items-center justify-between gap-3">
                        <h6 className="text-sm font-semibold text-text-primary truncate">
                          Preview: {previewDocument.title}
                        </h6>
                        <button
                          type="button"
                          onClick={() => setPreviewDocument(null)}
                          className="text-xs font-medium text-text-secondary hover:text-text-primary"
                        >
                          Close Preview
                        </button>
                      </div>

                      <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
                        <iframe
                          src={previewDocument.url}
                          title={previewDocument.title}
                          className="w-full h-[52vh]"
                        />
                      </div>
                    </div>
                  )}

                  {error && (
                    <p className="text-sm text-warning-primary">{error}</p>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
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
  const getModalContent = () => {
    switch (actionType) {
      case "approve":
      case "reapprove":
        return {
          title: "Approve Tenant",
          message: `Are you sure you want to approve ${tenant.name}? They will gain full access to the platform.`,
          confirmText: "Approve",
          confirmVariant: "primary",
          icon: <Check className="w-6 h-6 text-[#22C55E]" />,
        };
      case "reject":
        return {
          title: "Reject Tenant",
          message: `Are you sure you want to reject ${tenant.name}? This action cannot be undone immediately.`,
          confirmText: "Reject",
          confirmVariant: "warning",
          icon: <X className="w-6 h-6 text-warning-primary" />,
        };
      case "deactivate":
        return {
          title: "Deactivate Tenant",
          message: `Are you sure you want to suspend ${tenant.name}? Their access will be temporarily disabled.`,
          confirmText: "Deactivate",
          confirmVariant: "warning",
          icon: <X className="w-6 h-6 text-warning-primary" />,
        };
      case "activate":
        return {
          title: "Activate Tenant",
          message: `Are you sure you want to reactivate ${tenant.name}? Their access will be restored.`,
          confirmText: "Activate",
          confirmVariant: "primary",
          icon: <Check className="w-6 h-6 text-[#22C55E]" />,
        };
      default:
        return {
          title: "",
          message: "",
          confirmText: "",
          confirmVariant: "primary",
          icon: null,
        };
    }
  };

  const content = getModalContent();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-[24px] p-6 sm:p-8 w-full max-w-[400px] shadow-xl animate-in fade-in zoom-in duration-200">
        <div className="flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center mb-4">
            {content.icon}
          </div>
          <h3 className="text-[20px] font-bold text-[#2D2D2D] mb-2">
            {content.title}
          </h3>
          <p className="text-[14px] text-text-secondary mb-8">
            {content.message}
          </p>

          <div className="flex gap-3 w-full mt-4">
            <Button onClick={onCancel} variant="outline" className="flex-1">
              Cancel
            </Button>
            <Button
              onClick={onConfirm}
              variant={content.confirmVariant as any}
              className="flex-1"
            >
              {content.confirmText}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
