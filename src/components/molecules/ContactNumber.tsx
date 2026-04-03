"use client";

import React from "react";
import { Input } from "@/components/atoms/Input";
import { ChevronDown } from "lucide-react";

export const ContactNumberInput = ({ label, supportiveText, isError }: any) => {
  return (
    <div className="flex flex-col gap-1.5 w-full max-w-sm">
      <label className="b4 text-text-secondary ml-1">{label}</label>

      <div className="flex gap-2">
        <div className="flex items-center gap-2 px-4 border-2 border-[#E5E5E5] rounded-2xl bg-white cursor-pointer hover:border-brand-primary transition-all">
          <span className="text-lg">🇵🇭</span>
          <span className="b2 font-medium">+63</span>
          <ChevronDown size={16} className="text-text-secondary" />
        </div>

        <Input placeholder="9123456789" isError={isError} type="tel" />
      </div>

      {supportiveText && (
        <span className="b5 text-text-tertiary ml-1">{supportiveText}</span>
      )}
    </div>
  );
};
