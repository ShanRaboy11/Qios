"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Badge } from "@/components/atoms/Badge";
import { Input } from "@/components/atoms/Input";
import { Search, Download, Eye, ChevronLeft, ChevronRight } from "lucide-react";
import { jsPDF } from "jspdf";
import { Button } from "@/components/atoms/Button";
import { Dropdown } from "@/components/molecules/Dropdown";
import { AuditLogDetailsModal, AuditLogEntry } from "./AuditLogDetailsModal";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { useParams } from "next/navigation";

interface AuditLogTableProps {
  isLoading?: boolean;
}

// ---------------------------------------------------------------------------
// API response shape from employee_audit_logs
// ---------------------------------------------------------------------------
interface RawAuditLog {
  id: string;
  tenant_id: string;
  actor_id: string | null;
  actor_name: string;
  actor_role: string;
  action_type:
    | "CREATE"
    | "UPDATE"
    | "DELETE"
    | "LOGIN"
    | "LOGOUT"
    | "REFUND"
    | "SYSTEM";
  description: string;
  target_type: string | null;
  target_id: string | null;
  target_name: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
}

interface AuditLogsResponse {
  data: RawAuditLog[];
  total: number;
  page: number;
  limit: number;
}

// ---------------------------------------------------------------------------
// Map raw DB row → AuditLogEntry (used by details modal)
// ---------------------------------------------------------------------------
function mapToEntry(raw: RawAuditLog): AuditLogEntry {
  const meta = raw.metadata ?? {};
  const changes = meta.changes as
    | Record<string, { old: unknown; new: unknown }>
    | undefined;

  let before: Record<string, unknown> | undefined;
  let after: Record<string, unknown> | undefined;

  if (changes && typeof changes === "object") {
    before = {};
    after = {};
    for (const [key, diff] of Object.entries(changes)) {
      if (typeof diff === "object" && diff !== null && "old" in diff) {
        before[key] = (diff as { old: unknown; new: unknown }).old;
        after[key] = (diff as { old: unknown; new: unknown }).new;
      }
    }
    if (Object.keys(before).length === 0) before = undefined;
    if (Object.keys(after).length === 0) after = undefined;
  }

  // action_type mapping — LOGOUT / SYSTEM not in the modal union; coerce to closest
  const actionType = (
    ["CREATE", "UPDATE", "DELETE", "LOGIN", "REFUND"].includes(raw.action_type)
      ? raw.action_type
      : "CREATE"
  ) as AuditLogEntry["actionType"];

  // Remove trailing " (guest)" from actor display and normalize role strings
  const rawActor = (raw.actor_name ?? "").trim() || "System";
  const actor = rawActor.replace(/\s*\(guest\)$/i, "");

  const rawRole = (raw.actor_role ?? "").trim() || "system";
  const roleLower = rawRole.toLowerCase();
  const role =
    roleLower === "guest"
      ? "Customer"
      : roleLower.charAt(0).toUpperCase() + roleLower.slice(1);

  // normalize description and target text: collapse spaces, remove zero-width, replace peso symbol
  const normalizeText = (s: unknown) => {
    if (s === null || s === undefined) return "";
    let str = String(s);
    str = str.replace(/\u00A0/g, " ");
    str = str.replace(/\u200B/g, "");
    str = str.replace(/₱/g, "PHP ");
    str = str.replace(/\s+/g, " ");
    return str.trim();
  };

  return {
    id: raw.id.slice(0, 8).toUpperCase(),
    timestamp: new Date(raw.created_at).toLocaleString("en-PH", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    }),
    actor,
    role,
    action: normalizeText(raw.description),
    actionType,
    target: raw.target_name
      ? `${raw.target_type ? raw.target_type.charAt(0).toUpperCase() + raw.target_type.slice(1) + ": " : ""}${normalizeText(raw.target_name)}`
      : (raw.target_type ?? "—"),
    ip: (meta.ip as string) ?? "—",
    details: {
      before,
      after,
      message: (meta.message as string) ?? undefined,
    },
  };
}

// Role color mapping reused from SystemActivity for consistency
function roleColor(role: string) {
  const r = role.toLowerCase().replace(/[\s_]/g, "");
  if (r.includes("superadmin")) return "accent" as const;
  if (r.includes("admin")) return "secondary" as const;
  if (r.includes("employee")) return "info" as const;
  if (r.includes("customer")) return "success" as const;
  if (r.includes("guest")) return "success" as const;
  return "secondary" as const;
}

const PAGE_SIZE = 20;

export const AuditLogTable = ({
  isLoading: propIsLoading,
}: AuditLogTableProps) => {
  const params = useParams();
  const tenantId = params?.id as string | undefined;

  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [businessName, setBusinessName] = useState<string>("");
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const showLoading = propIsLoading !== undefined ? propIsLoading : isLoading;
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [moduleFilter, setModuleFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [selectedLog, setSelectedLog] = useState<AuditLogEntry | null>(null);

  // Debounce search input
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, moduleFilter, typeFilter]);

  const fetchLogs = useCallback(async () => {
    if (!tenantId) return;

    setIsLoading(true);
    setError(null);

    try {
      const supabase = createSupabaseBrowserClient();
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData?.session?.access_token;
      if (!token) {
        setError("Not authenticated.");
        setIsLoading(false);
        return;
      }

      const qs = new URLSearchParams({
        page: String(page),
        limit: String(PAGE_SIZE),
      });

      if (debouncedSearch) qs.set("search", debouncedSearch);
      if (typeFilter !== "all") qs.set("action_type", typeFilter);
      if (moduleFilter !== "all") qs.set("target_type", moduleFilter);

      const res = await fetch(
        `/api/tenants/${tenantId}/audit-logs?${qs.toString()}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          cache: "no-store",
        },
      );

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setError(body.error ?? `Error ${res.status}`);
        setIsLoading(false);
        return;
      }

      const json = await res.json();
      // API now returns { businessName, data, total, page, limit }
      setBusinessName(
        typeof json.businessName === "string" ? json.businessName : "",
      );
      setLogs((json.data ?? []).map(mapToEntry));
      setTotal(json.total ?? 0);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsLoading(false);
    }
  }, [tenantId, page, debouncedSearch, moduleFilter, typeFilter]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  // ---------------------------------------------------------------------------
  // Export PDF
  // ---------------------------------------------------------------------------
  const handleExportPDF = () => {
    if (logs.length === 0) return;

    const doc = new jsPDF({
      orientation: "landscape",
      unit: "pt",
      format: "a4",
    });
    const width = doc.internal.pageSize.getWidth();
    const height = doc.internal.pageSize.getHeight();
    const margin = 20; // tighter margin
    const startY = 100;
    // column widths must sum to <= width - margin*2
    const columnWidths = [58, 100, 110, 260, 210, 70];

    const drawHeader = () => {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      const titleText = businessName || "Activity Log";
      doc.text(titleText, margin, 42);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.text(
        `Activity Log • Generated: ${new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeStyle: "short" }).format(new Date())}`,
        margin,
        56,
      );

      doc.setFillColor(247, 247, 247);
      doc.rect(margin, startY - 12, width - margin * 2, 20, "F");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      const headers = ["ID", "Timestamp", "Actor", "Action", "Target", "Type"];
      let x = margin + 4; // small left padding inside column
      headers.forEach((h, i) => {
        const centerX = x + columnWidths[i] / 2;
        doc.text(h, centerX, startY, { align: "center" });
        x += columnWidths[i];
      });
      doc.setDrawColor(220);
      doc.line(margin, startY + 8, width - margin, startY + 8);
    };

    drawHeader();

    doc.setFont("helvetica", "normal");
    doc.setFontSize(6.5); // very small table font to fit content
    const lineHeight = 7; // pt
    let y = startY + 22;

    logs.forEach((l, rowIndex) => {
      const actionLines = doc.splitTextToSize(
        String(l.action || "-"),
        columnWidths[3] - 8,
      );
      const targetLines = doc.splitTextToSize(
        String(l.target || "-"),
        columnWidths[4] - 8,
      );

      // also wrap other columns to ensure nothing overflows
      const idLines = doc.splitTextToSize(
        String(l.id || ""),
        columnWidths[0] - 6,
      );
      const tsLines = doc.splitTextToSize(
        String(l.timestamp || ""),
        columnWidths[1] - 6,
      );
      const actorLines = doc.splitTextToSize(
        String(l.actor || ""),
        columnWidths[2] - 6,
      );

      const maxLines = Math.max(
        actionLines.length,
        targetLines.length,
        idLines.length,
        tsLines.length,
        actorLines.length,
        1,
      );

      const rowHeight = Math.max(12, maxLines * lineHeight + 6);

      if (y + rowHeight > height - margin - 24) {
        doc.addPage();
        drawHeader();
        y = startY + 24;
      }

      if (rowIndex % 2 === 0) {
        doc.setFillColor(250, 250, 250);
        doc.rect(margin, y - 6, width - margin * 2, rowHeight, "F");
      }

      let x = margin + 4; // inner padding

      // ID
      doc.setTextColor(40, 40, 40);
      let centerX = x + columnWidths[0] / 2;
      doc.text(idLines, centerX, y, { align: "center" });
      x += columnWidths[0];

      // Timestamp
      centerX = x + columnWidths[1] / 2;
      doc.text(tsLines, centerX, y, { align: "center" });
      x += columnWidths[1];

      // Actor
      centerX = x + columnWidths[2] / 2;
      doc.text(actorLines, centerX, y, { align: "center" });
      x += columnWidths[2];

      // Action
      centerX = x + columnWidths[3] / 2;
      doc.text(actionLines, centerX, y, { align: "center" });
      x += columnWidths[3];

      // Target
      centerX = x + columnWidths[4] / 2;
      doc.text(targetLines, centerX, y, { align: "center" });
      x += columnWidths[4];

      // Type (single line)
      const typeLines = doc.splitTextToSize(
        String(l.actionType || ""),
        columnWidths[5] - 6,
      );
      centerX = x + columnWidths[5] / 2;
      doc.text(typeLines, centerX, y, { align: "center" });
      x += columnWidths[5];

      y += rowHeight;
    });

    doc.setDrawColor(220);
    doc.line(margin, height - 36, width - margin, height - 36);
    doc.setFontSize(8);
    doc.setTextColor(110, 110, 110);
    doc.text("Powered by Qios", width / 2, height - 18, { align: "center" });
    doc.setTextColor(0, 0, 0);

    const fileName = `audit-logs-${new Date().toISOString().slice(0, 10)}.pdf`;
    doc.save(fileName);
  };

  return (
    <>
      <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full w-full">
        {/* Header / Filters */}
        <div className="p-6 border-b border-gray-50 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h3 className="font-bold text-xl text-text-primary">
              Activity Log
            </h3>
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
                  { label: "Staff", value: "staff" },
                  { label: "Role", value: "role" },
                  { label: "Menu", value: "menu" },
                  { label: "Order", value: "order" },
                  { label: "Auth", value: "auth" },
                  { label: "Inventory", value: "inventory" },
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
                  { label: "Logout", value: "LOGOUT" },
                ]}
              />
            </div>
            <Button
              variant="outline"
              shape="rounded"
              className="px-3 border-brand-primary text-brand-primary hover:!bg-brand-primary hover:!border-brand-primary hover:!text-white"
              title="Export PDF"
              onClick={handleExportPDF}
            >
              <Download size={16} />
            </Button>
          </div>
        </div>

        {showLoading ? (
          <div className="overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <table className="w-full text-center border-collapse whitespace-nowrap">
              <thead>
                <tr className="bg-gray-50 text-text-secondary text-[11px] font-bold uppercase tracking-wider">
                  <th className="py-3 px-6 text-center">
                    <div className="h-3 w-20 rounded skeleton-shimmer mx-auto" />
                  </th>
                  <th className="py-3 px-6 text-center">
                    <div className="h-3 w-12 rounded skeleton-shimmer mx-auto" />
                  </th>
                  <th className="py-3 px-6 text-center">
                    <div className="h-3 w-16 rounded skeleton-shimmer mx-auto" />
                  </th>
                  <th className="py-3 px-6 text-center">
                    <div className="h-3 w-16 rounded skeleton-shimmer mx-auto" />
                  </th>
                  <th className="py-3 px-6 text-center">
                    <div className="h-3 w-16 rounded skeleton-shimmer mx-auto" />
                  </th>
                  <th className="py-3 px-6 text-center">
                    <div className="h-3 w-12 rounded skeleton-shimmer mx-auto" />
                  </th>
                  <th className="py-3 px-6 text-center">
                    <div className="h-3 w-14 rounded skeleton-shimmer mx-auto" />
                  </th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 7 }).map((_, rowIndex) => (
                  <tr
                    key={`audit-log-skeleton-${rowIndex}`}
                    className="border-b border-gray-50 last:border-0"
                  >
                    <td className="py-4 px-6 text-center">
                      <div className="h-4 w-28 rounded skeleton-shimmer mx-auto" />
                    </td>
                    <td className="py-4 px-6 text-center">
                      <div className="h-4 w-28 rounded skeleton-shimmer mx-auto" />
                    </td>
                    <td className="py-4 px-6 text-center">
                      <div className="h-4 w-32 rounded skeleton-shimmer mx-auto" />
                    </td>
                    <td className="py-4 px-6 text-center">
                      <div className="h-4 w-24 rounded skeleton-shimmer mx-auto" />
                    </td>
                    <td className="py-4 px-6 text-center">
                      <div className="h-4 w-44 max-w-full rounded skeleton-shimmer mx-auto" />
                    </td>
                    <td className="py-4 px-6 text-center">
                      <div className="h-6 w-20 rounded-full skeleton-shimmer mx-auto" />
                    </td>
                    <td className="py-4 px-6 text-center">
                      <div className="h-9 w-9 rounded-lg skeleton-shimmer mx-auto" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <table className="w-full text-center border-collapse whitespace-nowrap">
              <thead>
                <tr className="bg-gray-50 text-text-secondary text-[11px] font-bold uppercase tracking-wider">
                  <th className="py-3 px-6 text-center">Timestamp</th>
                  <th className="py-3 px-6 text-center">Actor</th>
                  <th className="py-3 px-6 text-center">Role</th>
                  <th className="py-3 px-6 text-center">Action</th>
                  <th className="py-3 px-6 text-center">Target</th>
                  <th className="py-3 px-6 text-center">Type</th>
                  <th className="py-3 px-6 text-center">Details</th>
                </tr>
              </thead>
              <tbody>
                {error ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="py-8 text-center text-sm text-error-primary"
                    >
                      {error}
                    </td>
                  </tr>
                ) : logs.length > 0 ? (
                  logs.map((log) => (
                    <tr
                      key={log.id}
                      className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="py-4 px-6 text-[13px] font-medium text-text-secondary text-center">
                        {log.timestamp}
                      </td>
                      <td className="py-4 px-6 text-center">
                        <p className="font-bold text-text-primary text-sm">
                          {log.actor}
                        </p>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <div className="mt-0 flex justify-center">
                          <Badge
                            color={roleColor(log.role)}
                            variant="subtle"
                            shape="pill"
                            className="text-[10px] py-0.5"
                          >
                            {log.role}
                          </Badge>
                        </div>
                      </td>
                      <td className="py-4 px-6 font-medium text-text-primary text-sm text-center">
                        {log.action}
                      </td>
                      <td className="py-4 px-6 text-sm text-text-secondary truncate max-w-[200px] text-center">
                        {log.target}
                      </td>
                      <td className="py-4 px-6 text-center">
                        <Badge
                          color={
                            log.actionType === "DELETE" ||
                            log.actionType === "REFUND"
                              ? "error"
                              : log.actionType === "UPDATE"
                                ? "warning"
                                : log.actionType === "CREATE"
                                  ? "success"
                                  : "info"
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
                          className="p-2 rounded-lg bg-gray-50 hover:bg-brand-primary/10 hover:text-brand-accent text-gray-500 transition-colors inline-flex mx-auto"
                          title="View Details"
                        >
                          <Eye size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={7}
                      className="py-8 text-center text-sm text-text-secondary"
                    >
                      No audit logs found matching your filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
        <div className="p-4 border-t border-gray-50 flex justify-between items-center text-sm text-text-secondary">
          <span>
            {showLoading
              ? "Loading…"
              : `Showing ${logs.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1}–${Math.min(page * PAGE_SIZE, total)} of ${total} logs`}
          </span>
          <div className="flex items-center gap-1">
            <button
              className="p-1.5 rounded hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1 || showLoading}
              aria-label="Previous page"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="px-2 text-xs font-medium">
              {page} / {totalPages}
            </span>
            <button
              className="p-1.5 rounded hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages || showLoading}
              aria-label="Next page"
            >
              <ChevronRight size={16} />
            </button>
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
