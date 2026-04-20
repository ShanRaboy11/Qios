"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { UserItem, AvatarVariant } from "@/components/molecules/UserItem";
import { Badge, BadgeColor, BadgeVariant } from "@/components/atoms/Badge";
import { SearchFilterbarv2 } from "@/components/molecules/SearchFilterbarv2";

// --- Mock Data ---

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

const MOCK_ACTIVITIES: ActivityData[] = [
  {
    id: "act-1",
    user: { name: "Juan dela Cruz", id: "USR-10001", variant: "accent" },
    role: { label: "Tenant Admin", color: "secondary", variant: "solid" },
    action: { label: "CREATE", color: "success" },
    description: "Approved new Tenant Account: 'Cebu Grill'",
    targetEstablishment: "Global System",
    timestamp: "Oct 25, 2024 • 02:45 PM",
  },
  {
    id: "act-2",
    user: { name: "Maria Santos", id: "USR-20045", variant: "accent" },
    role: { label: "Super Admin", color: "accent", variant: "solid" },
    action: { label: "UPDATE", color: "info" },
    description: "Enabled 'Measurement-based' Inventory Mode",
    targetEstablishment: "Cebu Grill",
    timestamp: "Oct 28, 2024 • 01:22 PM",
  },
  {
    id: "act-3",
    user: { name: "Cashier_01", id: "EMP-30012", variant: "accent" },
    role: { label: "Employee", color: "info", variant: "solid" },
    action: { label: "DELETE", color: "error" },
    description: "Voided Transaction #8821 (Suspicious pattern detected)",
    targetEstablishment: "Cebu Grill",
    timestamp: "Oct 31, 2024 • 12:18 PM",
  },
  {
    id: "act-4",
    user: { name: "Guest_551", id: "CUST-40551", variant: "accent" },
    role: { label: "Customer", color: "success", variant: "solid" },
    action: { label: "CREATE", color: "success" },
    description: "Generated QR Order via Gemini AI Concierge",
    targetEstablishment: "Cebu Grill",
    timestamp: "Oct 31, 2024 • 11:45 AM",
  },
];

// --- Main Component ---

export const SystemActivity = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("All Roles");
  const [selectedDate, setSelectedDate] = useState<number | null>(null);

  const filteredActivities = MOCK_ACTIVITIES.filter((a) => {
    // 1. Search filter
    const matchesSearch =
      searchTerm === "" ||
      a.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.user.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.targetEstablishment.toLowerCase().includes(searchTerm.toLowerCase());

    // 2. Role filter
    const matchesRole =
      selectedRole === "All Roles" || a.role.label === selectedRole;

    // 3. Date filter (Mock logic relying on "Oct XX, 2024" format)
    let matchesDate = true;
    if (selectedDate !== null) {
      // pad date like "Oct 25" vs "Oct 05" (our mock data has 2-digit dates)
      const dateStr = `Oct ${selectedDate.toString().padStart(2, "0")}, 2024`;
      matchesDate = a.timestamp.includes(dateStr);
    }

    return matchesSearch && matchesRole && matchesDate;
  });

  return (
    <div className="w-full flex flex-col gap-8 p-8 md:pl-12 md:pr-12 lg:pl-48 lg:pr-48">
      {/* 1. Top Search and Controls */}
      <SearchFilterbarv2
        onSearch={setSearchTerm}
        onRoleFilter={setSelectedRole}
        onDateFilter={setSelectedDate}
        onCalendarClick={() => console.log("Calendar dropdown toggled")}
        onUsersClick={() => console.log("Users dropdown toggled")}
      />

      {/* 2. Table Container */}
      <div className="w-full bg-white rounded-2xl max-w-full overflow-hidden border-2 border-[#E5E5E5] flex flex-col">
        <div className="overflow-x-auto w-full flex-grow">
          <table className="w-full text-left border-collapse min-w-[950px]">
            {/* Table Header */}
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

            {/* Table Body */}
            <tbody className="divide-y-2 divide-[#E5E5E5] bg-white">
              {filteredActivities.length > 0 ? (
                filteredActivities.map((act) => (
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
                  <td colSpan={6} className="px-6 py-10 text-center text-text-secondary b4">
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
