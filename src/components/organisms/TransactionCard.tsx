import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/atoms/Badge";
import { Button } from "@/components/atoms/Button";
import { ChevronDown, MoreVertical } from "lucide-react";
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
}

export const TransactionCard = ({ tx }: TransactionCardProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={cn(
      "rounded-2xl border-2 overflow-hidden transition-all duration-300",
      isOpen ? "border-[var(--color-brand-primary)] shadow-md shadow-[var(--color-brand-primary)]/20" : "border-[#E5E5E5]",
    )}>
      {/* Header – always visible */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full flex items-center justify-between px-4 py-3 text-left gap-3 transition-colors"
        style={{
          backgroundColor: isOpen ? "var(--color-brand-primary)" : "var(--color-bg-primary)",
        }}
        aria-expanded={isOpen}
      >
        <div className="flex flex-col gap-1 min-w-0">
          <span className="font-medium text-sm" style={{ color: isOpen ? "var(--color-text-primary)" : "var(--color-text-secondary)" }}>
            Order {tx.orderNumber}
          </span>
          <span className="text-xs" style={{ color: isOpen ? "var(--color-text-primary)" : "var(--color-text-secondary)" }}>
            {tx.date} {tx.time}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Badge
            color={tx.status === "cancelled" ? "error" : tx.status === "ready" || tx.status === "served" ? "success" : "warning"}
            variant="subtle"
            shape="pill"
            className="justify-center text-[11px] py-0.5"
          >
            {capitalize(tx.status)}
          </Badge>
          <span className={cn("text-sm font-medium", isOpen ? "text-white" : "text-text-secondary")}>{formatMoney(tx.total)}</span>
          <ChevronDown
            className={cn("transition-transform duration-300", isOpen ? "rotate-180" : "rotate-0")}
            size={16}
          />
        </div>
      </button>

      {/* Collapsible body – details */}
      <div className={cn(
        "grid transition-all duration-300 ease-in-out",
        isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
      )}>
        <div className="overflow-hidden px-4 py-3 border-t border-[#E5E5E5] space-y-2">
          <div className="text-sm">
            <span className="font-medium">Items:</span> {tx.items || "No items"}
          </div>
          <Button variant="ghost" size="icon" title="More actions">
            <MoreVertical size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
};
