import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Badge, BadgeColor } from "@/components/atoms/Badge";
import { Eye } from "lucide-react";
import { formatMoney, capitalize } from "@/lib/salesDashboard";

interface TransactionCardProps {
  tx: {
    id: string;
    orderNumber: string;
    date: string;
    time: string;
    items?: string;
    status: string;
    total: number;
  };
  onViewDetails?: () => void;
}

function statusColor(status: string): BadgeColor {
  switch (status.toLowerCase()) {
    case "cancelled":
      return "error";
    case "ready":
    case "served":
      return "success";
    case "pending":
      return "warning";
    default:
      return "secondary";
  }
}

function getOrderInitials(orderNumber: string) {
  const digits = orderNumber.replace(/\D/g, "").slice(-2);
  if (digits.length >= 2) return digits;
  const letters = orderNumber
    .replace(/[^A-Za-z]/g, "")
    .slice(0, 2)
    .toUpperCase();
  return (letters + digits).slice(0, 2) || "TX";
}

export const TransactionCard = ({
  tx,
  onViewDetails,
}: TransactionCardProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const statCol = statusColor(tx.status);

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
          <div
            className="h-9 w-9 rounded-full flex items-center justify-center shrink-0 text-sm font-bold"
            style={{
              background: isOpen ? "rgba(255,255,255,0.2)" : "#f0f0f0",
              color: isOpen ? "white" : "var(--color-brand-primary)",
            }}
          >
            {getOrderInitials(tx.orderNumber)}
          </div>
          <div className="flex flex-col min-w-0">
            <span
              className="text-sm font-bold truncate"
              style={{ color: isOpen ? "white" : "var(--color-text-primary)" }}
            >
              Order {tx.orderNumber}
            </span>
            <span
              className="text-xs truncate"
              style={{
                color: isOpen
                  ? "rgba(255,255,255,0.75)"
                  : "var(--color-text-secondary)",
              }}
            >
              {tx.date} · {tx.time}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span
            className="text-sm font-semibold"
            style={{ color: isOpen ? "white" : "var(--color-text-primary)" }}
          >
            {formatMoney(tx.total)}
          </span>
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
            style={{ color: isOpen ? "white" : "var(--color-text-secondary)" }}
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
          <div className="flex items-start justify-between gap-2">
            <span
              className="text-[11px] font-bold uppercase tracking-wider shrink-0"
              style={{ color: "var(--color-text-secondary)" }}
            >
              Items
            </span>
            <span
              className="text-sm font-medium text-right"
              style={{ color: "var(--color-text-primary)" }}
            >
              {tx.items || "No items"}
            </span>
          </div>
          <div className="flex items-center justify-between gap-2">
            <span
              className="text-[11px] font-bold uppercase tracking-wider"
              style={{ color: "var(--color-text-secondary)" }}
            >
              Status
            </span>
            <Badge
              color={statCol}
              variant="subtle"
              shape="pill"
              className="text-[10px]"
            >
              {capitalize(tx.status)}
            </Badge>
          </div>
          <div className="flex items-center justify-between gap-2">
            <span
              className="text-[11px] font-bold uppercase tracking-wider"
              style={{ color: "var(--color-text-secondary)" }}
            >
              Total
            </span>
            <span
              className="text-sm font-semibold"
              style={{ color: "var(--color-text-primary)" }}
            >
              {formatMoney(tx.total)}
            </span>
          </div>
          {onViewDetails && (
            <div className="flex items-center justify-end gap-2 mt-2">
              <button
                onClick={onViewDetails}
                className="p-2 rounded-lg bg-gray-50 hover:bg-brand-primary/10 hover:text-brand-accent text-gray-500 transition-colors"
                title="View Details"
              >
                <Eye size={16} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
