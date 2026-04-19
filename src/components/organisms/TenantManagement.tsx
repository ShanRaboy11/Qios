"use client";

import React, { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { Search, SlidersHorizontal, MoreVertical, Building2 } from "lucide-react";
import { FormField } from "@/components/molecules/FormField";

interface Tenant {
  id: string;
  name: string;
  owner: string;
  type: "Professional" | "Enterprise" | "Starter";
  joined: string;
  status: "Active" | "Suspended";
}

const INITIAL_DATA: Tenant[] = [
  { id: "TEN-2026-001", name: "Lola's Lechon House", owner: "Maria Santos", type: "Professional", joined: "Jan 15, 2026", status: "Active" },
  { id: "TEN-2026-002", name: "Kape Republika", owner: "Juan Dela Cruz", type: "Enterprise", joined: "Jan 22, 2026", status: "Active" },
  { id: "TEN-2026-003", name: "Sugbo Mercado Central", owner: "Carlo Reyes", type: "Enterprise", joined: "Feb 3, 2026", status: "Active" },
  { id: "TEN-2026-004", name: "Tatay's Grill Station", owner: "Roberto Garcia", type: "Starter", joined: "Feb 10, 2026", status: "Suspended" },
  { id: "TEN-2026-005", name: "Seafood Express", owner: "Ana Mercado", type: "Professional", joined: "Feb 18, 2026", status: "Active" },
  { id: "TEN-2026-006", name: "Crispy Pata Corner", owner: "Eddie Tan", type: "Starter", joined: "Mar 1, 2026", status: "Active" },
];

export default function TenantManagement() {
  const [tenants, setTenants] = useState<Tenant[]>(INITIAL_DATA);
  const [searchTerm, setSearchTerm] = useState("");

  // Toggle Functionality
  const toggleStatus = (id: string) => {
    setTenants((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, status: t.status === "Active" ? "Suspended" : "Active" }
          : t
      )
    );
  };

  // Search Logic
  const filteredTenants = useMemo(() => {
    const query = searchTerm.toLowerCase();
    return tenants.filter((t) =>
      t.name.toLowerCase().includes(query) || t.id.toLowerCase().includes(query)
    );
  }, [searchTerm, tenants]);

  // Dynamic Stats
  const stats = useMemo(() => ({
    total: tenants.length,
    active: tenants.filter(t => t.status === "Active").length,
    suspended: tenants.filter(t => t.status === "Suspended").length
  }), [tenants]);

  return (
    <div className="w-full max-w-[966px] mx-auto space-y-4">
      {/* Dynamic Header Stats */}
      <div className="flex justify-center items-center gap-6 py-2">
        <div className="flex items-center gap-2">
          <span className="text-gray-500 text-sm font-normal">Total:</span>
          <span className="text-gray-900 text-sm font-semibold">{stats.total}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full" />
          <span className="text-gray-500 text-sm font-normal">Active:</span>
          <span className="text-green-700 text-sm font-semibold">{stats.active}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 bg-gray-400 rounded-full" />
          <span className="text-gray-500 text-sm font-normal">Suspended:</span>
          <span className="text-gray-500 text-sm font-semibold">{stats.suspended}</span>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex items-end gap-3 w-full">
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
        
        <button className="h-[52px] px-5 bg-white border border-gray-200 rounded-2xl flex items-center gap-2 hover:bg-gray-50 transition-colors shadow-sm mb-[1px]">
          <SlidersHorizontal className="w-4 h-4 text-gray-700" />
          <span className="text-gray-700 font-medium text-sm">Filters</span>
        </button>
      </div>

      {/* Tenant List */}
      <div className="flex flex-col gap-3">
        {filteredTenants.map((tenant) => (
          <TenantCard 
            key={tenant.id} 
            tenant={tenant} 
            onToggle={() => toggleStatus(tenant.id)} 
          />
        ))}
        {filteredTenants.length === 0 && (
          <div className="text-center py-12 text-gray-400 bg-white rounded-2xl border border-dashed">
            No tenants found matching your search.
          </div>
        )}
      </div>
    </div>
  );
}

function TenantCard({ tenant, onToggle }: { tenant: Tenant; onToggle: () => void }) {
  const isSuspended = tenant.status === "Suspended";

  return (
    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between transition-all hover:border-orange-100">
      <div className="flex items-center gap-4">
        {/* Logo */}
        <div className="w-12 h-12 bg-gradient-to-br from-orange-300 via-orange-300 to-amber-200 rounded-2xl flex items-center justify-center border-[1.5px] border-white shadow-sm flex-shrink-0">
          <Building2 className="w-6 h-6 text-white opacity-90" />
        </div>

        {/* Info */}
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-2">
            <h3 className="text-gray-900 text-lg font-semibold tracking-tight">{tenant.name}</h3>
            <Badge type={tenant.type} />
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500 font-normal">
            <span>ID: {tenant.id}</span>
            <span className="text-gray-300">•</span>
            <span>Owner: {tenant.owner}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-8">
        <span className="hidden md:block text-gray-500 text-sm font-normal">
          Joined {tenant.joined}
        </span>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 min-w-[85px] justify-end">
            <div className={cn("w-2 h-2 rounded-full", isSuspended ? "bg-gray-400" : "bg-green-500")} />
            <span className={cn("text-sm font-normal", isSuspended ? "text-gray-400" : "text-green-700")}>
              {tenant.status}
            </span>
          </div>

          {/* Toggle Switch Button */}
          <button 
            onClick={onToggle}
            className={cn(
              "w-11 h-6 rounded-full relative p-1 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-orange-100",
              isSuspended ? "bg-rose-500" : "bg-green-500"
            )}
          >
            <div className={cn(
              "w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300",
              isSuspended ? "translate-x-0" : "translate-x-5"
            )} />
          </button>
        </div>

        <button className="p-1 hover:bg-gray-50 rounded-lg text-gray-400 transition-colors">
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

function Badge({ type }: { type: Tenant["type"] }) {
  const variants = {
    Professional: "bg-amber-50/50 border-orange-200 text-orange-400",
    Enterprise: "bg-red-50/50 border-red-200 text-red-500",
    Starter: "bg-green-50/50 border-green-200 text-green-600",
  };

  return (
    <span className={cn(
      "px-3 py-0.5 border text-[10px] font-medium rounded-full uppercase tracking-wider",
      variants[type]
    )}>
      {type}
    </span>
  );
}