"use client";

import React, { useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { UserItem, AvatarVariant } from "@/components/molecules/UserItem";
import { Badge, BadgeColor, BadgeVariant } from "@/components/atoms/Badge";
import { SearchFilterbarv2 } from "@/components/molecules/SearchFilterbarv2";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

// --- Types ---

type ActivityData = {
  id: string;
  user: {
    name: string;
    id: string;
    variant: AvatarVariant;
  };
  role: {
    label: string;
    color: BadgeColor;
    variant?: BadgeVariant;
  };
  action: {
    label: string;
    color: BadgeColor;
  };
  description: string;
  targetEstablishment: string;
  timestamp: string;
};

interface ActivityLogRow {
  id: string;
  actor_id: string | null;
  actor_name: string;
  actor_role: string;
  action_type: string;
  description: string;
  target_tenant_id: string | null;
  target_tenant_name: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
}

// --- Helpers ---

function roleColor(role: string): BadgeColor {
  const r = role.toLowerCase().replace(/[\s_]/g, "");
  if (r.includes("superadmin")) return "accent";
  if (r.includes("admin")) return "secondary";
  if (r.includes("employee")) return "info";
  if (r.includes("customer")) return "success";
  return "secondary";
}

function actionColor(actionType: string): BadgeColor {
  switch (actionType) {
    case "CREATE":
      return "success";
    case "UPDATE":
      return "info";
    case "DELETE":
    case "REFUND":
      return "error";
    case "LOGIN":
    case "LOGOUT":
      return "secondary";
    case "SYSTEM":
      return "warning";
    default:
      return "secondary";
  }
}

function formatTimestamp(iso: string): string {
  const d = new Date(iso);
  const date = d.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
  const time = d.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
  return `${date} • ${time}`;
}

function mapRow(row: ActivityLogRow): ActivityData {
  return {
    id: row.id,
    user: {
      name: row.actor_name,
      id: row.actor_id ? row.actor_id.slice(0, 8).toUpperCase() : "SYSTEM",
      variant: "accent" as AvatarVariant,
    },
    role: {
      label: row.actor_role,
      color: roleColor(row.actor_role),
      variant: "solid",
    },
    action: {
      label: row.action_type,
      color: actionColor(row.action_type),
    },
    description: row.description,
    targetEstablishment: row.target_tenant_name ?? "Global System",
    timestamp: formatTimestamp(row.created_at),
  };
}

// --- Activity Card (Mobile) ---

const ActivityCard = ({ act }: { act: ActivityData }) => {
  const [isOpen, setIsOpen] = useState(false);

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
      {/* card Header — always visible, tap to toggle */}
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
          <UserItem
            name={act.user.name}
            id={act.user.id}
            variant={act.user.variant}
            className="hover:bg-transparent"
          />
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Badge
            color={act.action.color}
            variant="outline"
            shape="pill"
            className="font-medium uppercase"
          >
            {act.action.label}
          </Badge>

          {/* chevron */}
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
              color: isOpen
                ? "var(--color-text-primary)"
                : "var(--color-text-secondary)",
            }}
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </button>

      {/* collapsible Body */}
      <div
        className={cn(
          "grid transition-all duration-300 ease-in-out",
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
        )}
      >
        <div className="overflow-hidden">
          <div className="px-4 py-4 flex flex-col gap-3 border-t-2 border-[#E5E5E5]">
            {/* row: Role */}
            <div className="flex items-center justify-between gap-2">
              <span
                className="b5 font-bold uppercase tracking-wider"
                style={{ color: "var(--color-text-secondary)" }}
              >
                Role
              </span>
              <Badge
                color={act.role.color}
                variant={act.role.variant || "solid"}
                shape="pill"
                className="font-medium"
              >
                {act.role.label}
              </Badge>
            </div>

            {/* row: Target Establishment */}
            <div className="flex items-center justify-between gap-2">
              <span
                className="b5 font-bold uppercase tracking-wider"
                style={{ color: "var(--color-text-secondary)" }}
              >
                Establishment
              </span>
              <span
                className="b4 font-medium text-right"
                style={{ color: "var(--color-text-primary)" }}
              >
                {act.targetEstablishment}
              </span>
            </div>

            {/* row: Description */}
            <div
              className="rounded-xl px-3 py-2 b4"
              style={{
                backgroundColor: "var(--color-bg-primary)",
                color: "var(--color-text-primary)",
              }}
            >
              <span
                className="b5 font-bold uppercase tracking-wider block mb-1"
                style={{ color: "var(--color-text-secondary)" }}
              >
                Description
              </span>
              {act.description}
            </div>

            {/* row: Timestamp */}
            <div className="flex items-center justify-end gap-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ color: "var(--color-text-secondary)" }}
              >
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              <span
                className="b5 font-medium tracking-wide"
                style={{ color: "var(--color-text-secondary)" }}
              >
                {act.timestamp}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Main Component ---

export const SystemActivity = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("All Roles");
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [activities, setActivities] = useState<ActivityData[]>([]);

  const fetchActivities = useCallback(async () => {
    try {
      const supabase = createSupabaseBrowserClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const params = new URLSearchParams();
      if (searchTerm) params.set("search", searchTerm);
      if (selectedRole && selectedRole !== "All Roles")
        params.set("role", selectedRole);
      if (selectedDate !== null) {
        const day = selectedDate.toString().padStart(2, "0");
        params.set("date", `2024-10-${day}`);
      }

      const res = await fetch(
        `/api/admin/system-activity?${params.toString()}`,
        {
          headers: { Authorization: `Bearer ${session?.access_token ?? ""}` },
        },
      );

      if (!res.ok) {
        const json = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(json.error ?? `Request failed (${res.status})`);
      }

      const json = (await res.json()) as { data: ActivityLogRow[] };
      setActivities((json.data ?? []).map(mapRow));
    } catch (err) {
      console.error("[SystemActivity] Failed to load:", err);
    }
  }, [searchTerm, selectedRole, selectedDate]);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  return (
    <div className="w-full flex flex-col gap-8">
      {/* 1. Top Search and Controls */}
      <SearchFilterbarv2
        onSearch={setSearchTerm}
        onRoleFilter={setSelectedRole}
        onDateFilter={setSelectedDate}
        onCalendarClick={() => console.log("Calendar dropdown toggled")}
        onUsersClick={() => console.log("Users dropdown toggled")}
      />

      {/* 2a. Mobile: Collapsible Cards */}
      <div className="flex md:hidden flex-col gap-3">
        {activities.length > 0 ? (
          activities.map((act) => <ActivityCard key={act.id} act={act} />)
        ) : (
          <div
            className="rounded-2xl border-2 border-[#E5E5E5] py-10 text-center b4"
            style={{
              backgroundColor: "white",
              color: "var(--color-text-secondary)",
            }}
          >
            No activities found.
          </div>
        )}
      </div>

      {/* 2b. Desktop: Table */}
      <div className="hidden md:block w-full bg-white rounded-2xl max-w-full overflow-hidden border-2 border-[#E5E5E5]">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse min-w-[950px]">
            <thead className="bg-[#FAF7F2]">
              <tr className="border-b-2 border-[#E5E5E5]">
                <th className="pl-[-6px] pr-6 py-4 b5 font-bold text-text-primary tracking-wider uppercase text-center">
                  USER
                </th>
                <th className="px-6 py-4 b5 font-bold text-text-primary tracking-wider uppercase text-center">
                  ROLE
                </th>
                <th className="px-6 py-4 b5 font-bold text-text-primary tracking-wider uppercase text-center">
                  TARGET ESTABLISHMENT
                </th>
                <th className="px-6 py-4 b5 font-bold text-text-primary tracking-wider uppercase text-center">
                  ACTION
                </th>
                <th className="px-6 py-4 b5 font-bold text-text-primary tracking-wider uppercase text-center">
                  DESCRIPTION
                </th>
                <th className="px-6 py-4 b5 font-bold text-text-primary tracking-wider uppercase text-center">
                  TIMESTAMP
                </th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-[#E5E5E5] bg-white">
              {activities.length > 0 ? (
                activities.map((act) => (
                  <tr
                    key={act.id}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="pl-12 pr-6 py-2 min-w-[220px]">
                      <UserItem
                        name={act.user.name}
                        id={act.user.id}
                        variant={act.user.variant}
                        className="hover:bg-transparent"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <Badge
                        color={act.role.color}
                        variant={act.role.variant || "solid"}
                        shape="pill"
                        className="font-medium"
                      >
                        {act.role.label}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className="b4 text-text-primary font-medium">
                        {act.targetEstablishment}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <Badge
                        color={act.action.color}
                        variant="outline"
                        shape="pill"
                        className="font-medium uppercase"
                      >
                        {act.action.label}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 min-w-[300px] text-center">
                      <span className="b4 text-text-primary font-medium">
                        {act.description}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className="b5 text-text-secondary font-medium tracking-wide">
                        {act.timestamp}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-10 text-center text-text-secondary b4"
                  >
                    No activities found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
