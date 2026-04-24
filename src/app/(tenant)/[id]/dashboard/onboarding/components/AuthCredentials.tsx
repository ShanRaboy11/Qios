"use client";
import React from "react";
import { FormField } from "@/components/molecules/FormField";
import { Required } from "./BusinessInformation";

export function AuthCredentials() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
      <FormField label={<>Admin Email <Required /></>} type="email" placeholder="Admin Email" className="max-w-none" />                
      <FormField label={<>Admin Password <Required /></>} type="password" placeholder="Admin Password" supportiveText="Minimum 8 characters" className="max-w-none" />
      <FormField label={<>Confirm Password <Required /></>} type="password" placeholder="Confirm Password" className="max-w-none" />
    </div>
  );
}