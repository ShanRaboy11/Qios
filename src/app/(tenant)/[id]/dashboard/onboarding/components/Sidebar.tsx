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
    <div className={cn(
      "w-full lg:w-[45%] xl:w-[55%] h-auto lg:h-screen sticky lg:fixed top-0 left-0 z-40",
      "flex flex-row lg:flex-col justify-center items-center lg:items-start px-6 py-8 lg:px-24 bg-white border-b lg:border-b-0 lg:border-r border-neutral-100"
    )}>
      <div className="flex flex-row lg:flex-col gap-4 md:gap-12 lg:gap-12 relative w-full justify-center lg:justify-start">
        {steps.map((step, index) => {
          const isDone = currentStep > step.id;
          const isActive = currentStep === step.id;

          return (
            <div key={step.id} className="relative flex flex-col lg:flex-row items-center gap-2 lg:gap-10 flex-1 lg:flex-none">
              
              {/* CONNECTOR LINES */}
              {index !== steps.length - 1 && (
                <>
                  {/* Desktop Vertical */}
                  <div className={cn(
                    "hidden lg:block absolute left-[39px] top-[80px] h-[48px] border-l-2 border-dashed transition-colors duration-500",
                    isDone ? "border-[var(--color-success-primary)]" : "border-[var(--color-brand-accent)]"
                  )} />

                  {/* Mobile Horizontal*/}
                  <div className={cn(
                    "lg:hidden absolute left-[50%] top-[20px] w-full border-t-2 border-dashed -z-10 transition-colors duration-500",
                    isDone ? "border-[var(--color-success-primary)]" : "border-[var(--color-brand-accent)]"
                  )} />
                </>
              )}
              
              {/* ICON CIRCLE */}
              <div className={cn(
                "w-10 h-10 lg:w-20 lg:h-20 rounded-full flex items-center justify-center z-10 transition-all duration-500 border-2 lg:border-4",
                isDone ? "bg-[var(--color-success-secondary)] text-[var(--color-success-primary)] border-[var(--color-success-secondary)]" : 
                isActive ? "bg-[var(--color-brand-primary)] text-white border-[var(--color-brand-secondary)] shadow-lg shadow-orange-100" : 
                "bg-neutral-50 border-transparent text-neutral-300"
              )}>
                {isDone ? (
                  <Check className="w-5 h-5 lg:w-8 lg:h-8" strokeWidth={3} />
                ) : (
                  <step.icon className="w-5 h-5 lg:w-8 lg:h-8" />
                )}
              </div>

              {/* STEP TITLE */}
              <span className={cn(
                "hidden sm:block whitespace-nowrap transition-colors text-[10px] lg:text-xl font-figtree",
                isActive || isDone ? "text-[var(--color-text-primary)] font-semibold" : "text-[var(--color-text-secondary)]"
              )}>
                {step.title}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
