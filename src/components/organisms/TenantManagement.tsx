"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import {
  Search,
  MoreVertical,
  Building2,
  Check,
  X,
  SlidersHorizontal,
} from "lucide-react";
import { FormField } from "@/components/molecules/FormField";
import { Dropdown } from "@/components/molecules/Dropdown";
import { Badge } from "@/components/atoms/Badge";
import { Button } from "@/components/atoms/Button";

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

export type ActionType =
  | "approve"
  | "reject"
  | "reapprove"
  | "deactivate"
  | "activate";

export interface TenantManagementProps {
  initialStatusFilter?: string;
}

export default function TenantManagement({ initialStatusFilter }: TenantManagementProps) {
  const [tenants, setTenants] = useState<Tenant[]>(INITIAL_DATA);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState(initialStatusFilter || "All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialStatusFilter) {
      setStatusFilter(initialStatusFilter);
    }
  }, [initialStatusFilter]);

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

  const confirmAction = () => {
    if (!selectedTenant || !actionType) return;

    setTenants((prev) =>
      prev.map((t) => {
        if (t.id !== selectedTenant.id) return t;

        let newStatus = t.status;
        switch (actionType) {
          case "approve":
          case "reapprove":
          case "activate":
            newStatus = "Active";
            break;
          case "reject":
            newStatus = "Rejected";
            break;
          case "deactivate":
            newStatus = "Suspended";
            break;
        }

        return { ...t, status: newStatus };
      }),
    );

    setModalOpen(false);
    setSelectedTenant(null);
    setActionType(null);
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
        {filteredTenants.map((tenant) => (
          <TenantCard
            key={tenant.id}
            tenant={tenant}
            onAction={(action) => openModal(tenant, action)}
            disableActions={modalOpen}
          />
        ))}
        {filteredTenants.length === 0 && (
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

function TenantCard({
  tenant,
  onAction,
  disableActions,
}: {
  tenant: Tenant;
  onAction: (action: ActionType) => void;
  disableActions: boolean;
}) {
  return (
    <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center gap-4 transition-all hover:border-orange-100">
      <div className="flex items-start md:items-center gap-4 md:w-[60%] shrink-0">
        {/* Logo */}
        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-orange-300 via-orange-300 to-amber-200 rounded-2xl flex items-center justify-center border-[1.5px] border-white shadow-sm flex-shrink-0">
          <Building2 className="w-5 h-5 sm:w-6 sm:h-6 text-white opacity-90" />
        </div>

        {/* Info */}
        <div className="flex flex-col gap-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-gray-900 text-base sm:text-lg font-semibold tracking-tight truncate">
              {tenant.name}
            </h3>
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
          <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 font-normal">
            <span className="truncate">ID: {tenant.id}</span>
            <span className="text-gray-300">•</span>
            <span className="truncate">Owner: {tenant.owner}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center md:flex-1 justify-between gap-3 md:gap-6 border-t border-gray-50 pt-3 md:pt-0 md:border-none">
        <span className="hidden lg:block text-gray-500 text-sm font-normal shrink-0 mr-[20px]">
          Joined {tenant.joined}
        </span>

        {/* Status Indicator */}
        <div className="flex items-center gap-2 sm:min-w-[85px] shrink-0">
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

        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 shrink-0 md:ml-auto">
          {tenant.status === "Pending" && (
            <>
              <Button
                onClick={() => onAction("approve")}
                disabled={disableActions}
                variant="approve"
                shape="pill"
                size="sm"
              >
                Approve
              </Button>
              <Button
                onClick={() => onAction("reject")}
                disabled={disableActions}
                variant="warning"
                shape="pill"
                size="sm"
              >
                Reject
              </Button>
            </>
          )}

          {tenant.status === "Rejected" && (
            <Button
              onClick={() => onAction("reapprove")}
              disabled={disableActions}
              variant="accent"
              size="sm"
            >
              Re-Approve
            </Button>
          )}

          {tenant.status === "Active" && (
            <Button
              onClick={() => onAction("deactivate")}
              disabled={disableActions}
              variant="outline"
              size="sm"
            >
              Deactivate
            </Button>
          )}

          {tenant.status === "Suspended" && (
            <Button
              onClick={() => onAction("activate")}
              disabled={disableActions}
              variant="primary"
              size="sm"
            >
              Activate
            </Button>
          )}

          <button className="hidden sm:flex p-2 hover:bg-gray-50 rounded-lg text-gray-400 transition-colors ml-2">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
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
