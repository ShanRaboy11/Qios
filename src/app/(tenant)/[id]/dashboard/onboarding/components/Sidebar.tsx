"use client";
import React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  steps: any[];
  currentStep: number;
}

export function OnboardingSidebar({ steps, currentStep }: SidebarProps) {
  return (
    <div className="w-[55%] h-[1066px] hidden lg:flex flex-col justify-center px-24 bg-white border-r border-neutral-50">
      <div className="space-y-12 relative">
        {steps.map((step, index) => {
          const isDone = currentStep > step.id;
          const isActive = currentStep === step.id;
          return (
            <div key={step.id} className="relative flex items-center gap-10">
              {index !== steps.length - 1 && (
                <div className={cn("absolute left-[39px] top-[80px] h-[48px] border-l-2 border-dashed transition-colors duration-500", isDone ? "border-[var(--color-success-primary)]" : "border-[var(--color-brand-accent)]")} />
              )}
              <div className={cn("w-20 h-20 rounded-full flex items-center justify-center z-10 transition-all duration-500 border-4", isDone ? "bg-[var(--color-success-secondary)] text-[var(--color-success-primary)] border-[var(--color-success-secondary)]" : isActive ? "bg-[var(--color-brand-primary)] text-white border-[var(--color-brand-secondary)] shadow-lg shadow-orange-100" : "bg-neutral-50 border-transparent text-neutral-300")}>
                {isDone ? <Check size={32} strokeWidth={3} /> : <step.icon size={30} />}
              </div>
              <span className={cn("h4 whitespace-nowrap transition-colors", isActive || isDone ? "text-black font-semibold" : "text-neutral-400")}>{step.title}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}