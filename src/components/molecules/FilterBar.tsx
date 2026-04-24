"use client";

import React from "react";
import { Dropdown } from "@/components/molecules/Dropdown";
import { Button } from "@/components/atoms/Button";

export interface FilterBarProps {
  statusValue: string;
  onStatusChange: (value: string) => void;
  onAddClick: () => void;
}

export const FilterBar = ({ statusValue, onStatusChange, onAddClick }: FilterBarProps) => {
  const statusOptions = [
    { label: "All status", value: "all" },
    { label: "Enough", value: "enough" },
    { label: "Low", value: "low" },
    { label: "Critical", value: "critical" },
  ];

  return (
    <div className="flex flex-col md:flex-row items-center gap-3 w-full md:w-auto">
      <div className="flex-1 w-full md:w-[180px]">
        <Dropdown
          label=""
          placeholder="All status"
          options={statusOptions}
          value={statusValue}
          onSelect={(opt) => onStatusChange(opt.value)}
          className="h-[48px]"
        />
      </div>
      
      <Button variant="accent" size="md" shape="rounded" onClick={onAddClick} className="w-full md:w-auto shrink-0 max-h-[48px]">
        + Add item
      </Button>
    </div>
  );
};
