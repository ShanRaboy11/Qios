"use client";
import React from "react";
import { FormField } from "@/components/molecules/FormField";
import { Required } from "./BusinessInformation";

export function AuthCredentials({ data, setData }: any) {
  return (
    <div className="w-full max-w-[450px] space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
      
      <FormField 
        label={<>Admin Email <Required /></>} 
        type="email" 
        placeholder="Admin Email" 
        value={data.email}
        onChange={(e) => setData({ ...data, email: e.target.value })}
        className="w-full max-w-none"
      />                

      <FormField 
        label={<>Admin Password <Required /></>} 
        type="password" 
        placeholder="Admin Password" 
        supportiveText="Minimum 8 characters" 
        value={data.password}
        onChange={(e) => setData({ ...data, password: e.target.value })}
        className="w-full max-w-none"
      />

      <FormField 
        label={<>Confirm Password <Required /></>} 
        type="password" 
        placeholder="Confirm Password" 
        value={data.confirm}
        onChange={(e) => setData({ ...data, confirm: e.target.value })}
        className="w-full max-w-none"
      />
      
    </div>
  );
}