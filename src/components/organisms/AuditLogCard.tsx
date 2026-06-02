// src/components/organisms/AuditLogCard.tsx
"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Badge, BadgeColor } from "@/components/atoms/Badge";
import { Eye } from "lucide-react";

interface AuditLogCardProps {
  log: {
    id: string;
    timestamp: string;
    actor: string;
    role: string;
    action: string;
    actionType: string;
    target: string;
  };
  onViewDetails: () => void;
}

function roleColor(role: string): BadgeColor {
  const r = role.toLowerCase().replace(/[\s_]/g, "");
  if (r.includes("superadmin")) return "accent" as const;
  if (r.includes("admin")) return "secondary" as const;
  if (r.includes("employee")) return "info" as const;
  if (r.includes("customer")) return "success" as const;
  if (r.includes("guest")) return "success" as const;
  return "secondary" as const;
}

function actionColor(actionType: string): BadgeColor {
  switch (actionType) {
    case "CREATE":
      return "success" as const;
    case "UPDATE":
      return "warning" as const;
    case "DELETE":
    case "REFUND":
      return "error" as const;
    case "LOGIN":
    case "LOGOUT":
      return "info" as const;
    case "SYSTEM":
      return "secondary" as const;
    default:
      return "secondary" as const;
  }
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export const AuditLogCard = ({ log, onViewDetails }: AuditLogCardProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const roleCol = roleColor(log.role);
  const actCol = actionColor(log.actionType);

  return (
    <div
      className={cn(
        "rounded-2xl border-2 overflow-hidden transition-all duration-300",
        isOpen
          ? "border-[var(--color-brand-primary)] shadow-md shadow-[var(--color-brand-primary)]/20"
          : "border-[#E5E5E5]",
      )}
      style={{ backgroundColor: "white" }}
    >
      {/* Header */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full flex items-center justify-between px-4 py-3 text-left gap-3 transition-colors"
        style={{
          backgroundColor: isOpen
            ? "var(--color-brand-primary)"
            : "var(--color-bg-primary)",
        }}
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-3 min-w-0">
          {/* Simple initial avatar */}
          <div
            className="h-9 w-9 rounded-full flex items-center justify-center shrink-0 text-sm font-bold"
            style={{
              backgroundColor: isOpen
                ? "rgba(255,255,255,0.2)"
                : "var(--color-brand-primary)/10",
              color: isOpen ? "white" : "var(--color-brand-primary)",
              background: isOpen ? "rgba(255,255,255,0.2)" : "#f0f0f0",
            }}
          >
            {getInitials(log.actor)}
          </div>
          <div className="flex flex-col min-w-0">
            <span
              className="text-sm font-bold truncate"
              style={{ color: isOpen ? "white" : "var(--color-text-primary)" }}
            >
              {log.actor}
            </span>
            <span
              className="text-xs truncate"
              style={{
                color: isOpen
                  ? "rgba(255,255,255,0.75)"
                  : "var(--color-text-secondary)",
              }}
            >
              {log.timestamp}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Badge color={actCol} variant="subtle" shape="pill" className="font-medium uppercase text-[10px]">
            {log.actionType}
          </Badge>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={cn(
              "transition-transform duration-300 shrink-0",
              isOpen ? "rotate-180" : "rotate-0",
            )}
            style={{
              color: isOpen ? "white" : "var(--color-text-secondary)",
            }}
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </button>

      {/* Body */}
      <div
        className={cn(
          "grid transition-all duration-300 ease-in-out",
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
        )}
      >
        <div className="overflow-hidden px-4 py-4 border-t-2 border-[#E5E5E5] flex flex-col gap-2">
          <div className="flex items-center justify-between gap-2">
            <span
              className="text-[11px] font-bold uppercase tracking-wider"
              style={{ color: "var(--color-text-secondary)" }}
            >
              Role
            </span>
            <Badge color={roleCol} variant="subtle" shape="pill" className="text-[10px]">
              {log.role}
            </Badge>
          </div>
          <div className="flex items-start justify-between gap-2">
            <span
              className="text-[11px] font-bold uppercase tracking-wider shrink-0"
              style={{ color: "var(--color-text-secondary)" }}
            >
              Action
            </span>
            <span
              className="text-sm font-medium text-right"
              style={{ color: "var(--color-text-primary)" }}
            >
              {log.action}
            </span>
          </div>
          <div className="flex items-start justify-between gap-2">
            <span
              className="text-[11px] font-bold uppercase tracking-wider shrink-0"
              style={{ color: "var(--color-text-secondary)" }}
            >
              Target
            </span>
            <span
              className="text-sm font-medium text-right"
              style={{ color: "var(--color-text-primary)" }}
            >
              {log.target}
            </span>
          </div>
          <div className="flex items-center justify-end gap-2 mt-2">
            <button
              onClick={onViewDetails}
              className="p-2 rounded-lg bg-gray-50 hover:bg-brand-primary/10 hover:text-brand-accent text-gray-500 transition-colors"
              title="View Details"
            >
              <Eye size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};