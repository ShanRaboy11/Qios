"use client";

import React from "react";
import { FormField } from "@/components/molecules/FormField";
import { cn } from "@/lib/utils";

// Red Asterisk Helper
export const Required = () => (
  <span className="text-[var(--color-warning-primary)] ml-0.5">*</span>
);

export function BusinessInformation() {
  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-right-8 duration-500 w-full max-w-[450px]">
      
      {/* 1. Business Name - Required */}
      <FormField
        label={<>Business Name <Required /></>}
        placeholder="Business Name"
        className="max-w-none"
      />

      {/* 2. Business Email Address - Required */}
      <FormField
        label={<>Business Email Address <Required /></>}
        placeholder="Business Email Address"
        className="max-w-none"
      />

      {/* 3. Owner / Admin Name - Optional */}
      <FormField
        label="Owner / Admin Name (Optional)"
        placeholder="Owner / Admin Name"
        className="max-w-none"
      />

    </div>
  );
}