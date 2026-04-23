"use client";
import React from "react";
import { FormField } from "@/components/molecules/FormField";

export const Required = () => <span className="text-[var(--color-warning-primary)] ml-1">*</span>;

export function BusinessInformation() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
      <FormField label={<>Business Name <Required/></>} placeholder="Business Name" className="max-w-none" />
      <FormField label={<>Business Email Address <Required/></>} placeholder="Business Email Address" className="max-w-none" />
      <FormField label="Owner / Admin Name (Optional)" placeholder="Owner / Admin Name" className="max-w-none" />
    </div>
  );
}