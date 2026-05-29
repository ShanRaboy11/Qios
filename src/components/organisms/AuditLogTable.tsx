"use client";

import React, { useState } from "react";
import { Badge } from "@/components/atoms/Badge";
import { Input } from "@/components/atoms/Input";
import { Search, Download, Eye } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { Dropdown } from "@/components/molecules/Dropdown";
import { AuditLogDetailsModal, AuditLogEntry } from "./AuditLogDetailsModal";

interface AuditLogTableProps {
  isLoading?: boolean;
}

const mockAuditLogs: AuditLogEntry[] = [
  {
    id: "LOG-9021",
    timestamp: "2026-10-24 14:32:05",
    actor: "Jane Doe",
    role: "Manager",
    action: "Updated Item Price",
    actionType: "UPDATE",
    target: "Menu: Truffle Burger",
    ip: "192.168.1.45",
    details: {
      before: { price: 350 },
      after: { price: 380 },
    }
  },
  {
    id: "LOG-9022",
    timestamp: "2026-10-24 15:10:22",
    actor: "System",
    role: "System",
    action: "Automated Backup",
    actionType: "CREATE",
    target: "Database",
    ip: "127.0.0.1",
    details: { message: "Daily snapshot completed successfully." }
  },
  {
    id: "LOG-9023",
    timestamp: "2026-10-24 16:05:11",
    actor: "John Smith",
    role: "Cashier",
    action: "Refunded Order",
    actionType: "REFUND",
    target: "Order: ORD-1031",
    ip: "192.168.1.12",
    details: {
      before: { status: "Completed" },
      after: { status: "Refunded" },
      message: "Customer complained about cold food."
    }
  },
  {
    id: "LOG-9024",
    timestamp: "2026-10-24 16:45:00",
    actor: "Jane Doe",
    role: "Manager",
    action: "Deleted Staff Member",
    actionType: "DELETE",
    target: "Staff: Mark Lee",
    ip: "192.168.1.45",
    details: {
      before: { id: "STF-004", name: "Mark Lee", status: "Active" }
    }
  },
  {
    id: "LOG-9025",
    timestamp: "2026-10-24 17:20:00",
    actor: "Alex Johnson",
    role: "Admin",
    action: "User Login",
    actionType: "LOGIN",
    target: "Auth",
    ip: "112.204.15.88",
    details: { message: "Successful login via web portal." }
  }
];

export const AuditLogTable = ({ isLoading = false }: AuditLogTableProps) => {
  const [search, setSearch] = useState("");
  const [moduleFilter, setModuleFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [selectedLog, setSelectedLog] = useState<AuditLogEntry | null>(null);

  const filteredLogs = mockAuditLogs.filter((log) => {
    const matchesSearch =
      log.actor.toLowerCase().includes(search.toLowerCase()) ||
      log.action.toLowerCase().includes(search.toLowerCase());
    
    const matchesModule =
      moduleFilter === "all" ||
      log.target.toLowerCase().includes(moduleFilter.toLowerCase());

    const matchesType =
      typeFilter === "all" || log.actionType === typeFilter;

    return matchesSearch && matchesModule && matchesType;
  });

  return (
    <>
      <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full w-full">
        <div className="p-6 border-b border-gray-50 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h3 className="font-bold text-xl text-text-primary">Activity Log</h3>
            <p className="text-sm text-text-secondary mt-1">
              Comprehensive trail of system actions and changes.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search actor, action..."
                className="pl-9 py-2 text-sm rounded-xl"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="hidden sm:block w-36 z-30">
              <Dropdown
                label=""
                size="sm"
                value={moduleFilter}
                onSelect={(opt) => setModuleFilter(opt.value)}
                options={[
                  { label: "All Modules", value: "all" },
                  { label: "Menu", value: "menu" },
                  { label: "Order", value: "order" },
                  { label: "Staff", value: "staff" },
                  { label: "Auth", value: "auth" },
                ]}
              />
            </div>
            <div className="hidden sm:block w-36 z-20">
              <Dropdown
                label=""
                size="sm"
                value={typeFilter}
                onSelect={(opt) => setTypeFilter(opt.value)}
                options={[
                  { label: "All Actions", value: "all" },
                  { label: "Create", value: "CREATE" },
                  { label: "Update", value: "UPDATE" },
                  { label: "Delete", value: "DELETE" },
                  { label: "Refund", value: "REFUND" },
                  { label: "Login", value: "LOGIN" },
                ]}
              />
            </div>
            <Button variant="outline" shape="rounded" className="px-3" title="Export CSV">
              <Download size={16} />
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead>
                <tr className="bg-gray-50 text-text-secondary text-[11px] font-bold uppercase tracking-wider">
                  <th className="py-3 px-6"><div className="h-3 w-20 rounded skeleton-shimmer" /></th>
                  <th className="py-3 px-6"><div className="h-3 w-16 rounded skeleton-shimmer" /></th>
                  <th className="py-3 px-6"><div className="h-3 w-16 rounded skeleton-shimmer" /></th>
                  <th className="py-3 px-6"><div className="h-3 w-16 rounded skeleton-shimmer" /></th>
                  <th className="py-3 px-6 text-center"><div className="h-3 w-12 rounded skeleton-shimmer mx-auto" /></th>
                  <th className="py-3 px-6 text-center"><div className="h-3 w-14 rounded skeleton-shimmer mx-auto" /></th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 7 }).map((_, rowIndex) => (
                  <tr key={`audit-log-skeleton-${rowIndex}`} className="border-b border-gray-50 last:border-0">
                    <td className="py-4 px-6"><div className="h-4 w-28 rounded skeleton-shimmer" /></td>
                    <td className="py-4 px-6"><div className="h-4 w-28 rounded skeleton-shimmer" /></td>
                    <td className="py-4 px-6"><div className="h-4 w-32 rounded skeleton-shimmer" /></td>
                    <td className="py-4 px-6"><div className="h-4 w-44 max-w-full rounded skeleton-shimmer" /></td>
                    <td className="py-4 px-6 text-center"><div className="h-6 w-20 rounded-full skeleton-shimmer mx-auto" /></td>
                    <td className="py-4 px-6 text-center"><div className="h-9 w-9 rounded-lg skeleton-shimmer mx-auto" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
        <div className="overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-gray-50 text-text-secondary text-[11px] font-bold uppercase tracking-wider">
                <th className="py-3 px-6">Timestamp</th>
                <th className="py-3 px-6">Actor</th>
                <th className="py-3 px-6">Action</th>
                <th className="py-3 px-6">Target</th>
                <th className="py-3 px-6 text-center">Type</th>
                <th className="py-3 px-6 text-center">Details</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.length > 0 ? (
                filteredLogs.map((log) => (
                  <tr
                    key={log.id}
                    className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="py-4 px-6 text-[13px] font-medium text-text-secondary">
                      {log.timestamp}
                    </td>
                    <td className="py-4 px-6">
                      <p className="font-bold text-text-primary text-sm">{log.actor}</p>
                      <p className="text-[11px] text-text-tertiary">{log.role}</p>
                    </td>
                    <td className="py-4 px-6 font-medium text-text-primary text-sm">
                      {log.action}
                    </td>
                    <td className="py-4 px-6 text-sm text-text-secondary truncate max-w-[200px]">
                      {log.target}
                    </td>
                    <td className="py-4 px-6 text-center">
                      <Badge
                        color={
                          log.actionType === "DELETE" || log.actionType === "REFUND" ? "error" :
                          log.actionType === "UPDATE" ? "warning" :
                          log.actionType === "CREATE" ? "success" : "info"
                        }
                        variant="subtle"
                        shape="pill"
                        className="justify-center text-[10px] py-0.5"
                      >
                        {log.actionType}
                      </Badge>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <button
                        onClick={() => setSelectedLog(log)}
                        className="p-2 rounded-lg bg-gray-50 hover:bg-brand-primary/10 hover:text-brand-accent text-gray-500 transition-colors inline-flex"
                        title="View Details"
                      >
                        <Eye size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-sm text-text-secondary">
                    No audit logs found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        )}
        <div className="p-4 border-t border-gray-50 flex justify-between items-center text-sm text-text-secondary">
           <span>Showing {filteredLogs.length} of {mockAuditLogs.length} logs</span>
           <div className="flex gap-2">
              <button className="px-3 py-1 rounded hover:bg-gray-100 disabled:opacity-50">Prev</button>
              <button className="px-3 py-1 rounded hover:bg-gray-100">Next</button>
           </div>
        </div>
      </div>

      <AuditLogDetailsModal
        isOpen={!!selectedLog}
        onClose={() => setSelectedLog(null)}
        log={selectedLog}
      />
    </>
  );
};
