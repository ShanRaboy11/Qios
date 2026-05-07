"use client";

import React from "react";
import { DateRangePicker } from "@/components/molecules/DateRangePicker";

export interface TenantDashboardHeaderProps {
  adminName?: string;
  subtitle?: React.ReactNode;
}

export const TenantDashboardHeader = ({
  adminName = "Admin",
  subtitle = (
    <>
      You have <span className="text-[#FFB020] font-semibold">200+</span>{" "}
      Orders, Today
    </>
  ),
}: TenantDashboardHeaderProps) => {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 w-full cursor-default">
      <div className="flex flex-col">
        <span className="h2 md:text-[36px] leading-tight">
          Welcome, {adminName}
        </span>
        <p className="b1 text-text-secondary mt-1">
          {subtitle}
        </p>
      </div>
      <div className="shrink-0">
        <DateRangePicker />
      </div>
    </div>
  );
};
