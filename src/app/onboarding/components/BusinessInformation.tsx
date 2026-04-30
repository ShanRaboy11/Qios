"use client";
import React from "react";
import { FormField } from "@/components/molecules/FormField";

export const Required = () => (
  <span className="text-[var(--color-warning-primary)] ml-0.5">*</span>
);

export function BusinessInformation({ data, setData }: any) {
  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-right-8 duration-500 w-full max-w-[450px]">
      
      <FormField
        label={<>Business Name <Required /></>}
        placeholder="Business Name"
        className="max-w-none"
        value={data.name}
        // Force the update to the name property
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
          setData((prev: any) => ({ ...prev, name: e.target.value }))
        }
      />

      <FormField
        label={<>Business Email Address <Required /></>}
        placeholder="Business Email Address"
        className="max-w-none"
        value={data.email}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
          setData((prev: any) => ({ ...prev, email: e.target.value }))
        }
      />

      <FormField
        label="Owner / Admin Name (Optional)"
        placeholder="Owner / Admin Name"
        className="max-w-none"
        value={data.owner || ""}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
          setData((prev: any) => ({ ...prev, owner: e.target.value }))
        }
      />
    </div>
  );
}