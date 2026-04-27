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
      "w-full lg:w-[45%] xl:w-[55%] h-auto lg:h-screen sticky lg:fixed top-0 left-0 z-40 overflow-hidden",
      "flex flex-row lg:flex-col justify-center items-center lg:items-start px-6 py-8 lg:px-24",
      /* Warm cream background base */
      "bg-[#FCF8F2] border-b lg:border-b-0 lg:border-r border-orange-100"
    )}>
      
      {/* --- NEW UNIQUE MODERN KIOSK BACKGROUND START --- */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        
        {/* 1. Large Architectural Pill Shape */}
        <div 
          className="absolute -top-20 -left-20 w-[120%] h-[60%] rounded-[100px] rotate-[-15deg] opacity-[0.15]"
          style={{ backgroundColor: 'var(--color-brand-primary)' }}
        />

        {/* 2. Floating Modern "Glass" Circle */}
        <div 
          className="absolute top-[35%] -right-20 w-96 h-96 rounded-full border-[40px] border-orange-200/30 opacity-40 animate-pulse"
          style={{ animationDuration: '8s' }}
        />

        {/* 3. Kiosk Dot Grid (Corrected Property) */}
        <div 
          className="absolute inset-0 opacity-[0.05]" 
          style={{ 
            backgroundImage: `radial-gradient(var(--color-brand-primary) 1.5px, transparent 1.5px)`, 
            backgroundSize: '45px 45px' 
          }}
        />

        {/* 4. Bottom Glow for Depth */}
        <div 
          className="absolute bottom-0 right-0 w-full h-[40%] bg-gradient-to-t from-orange-100/40 to-transparent"
        />
      </div>
      {/* --- NEW UNIQUE MODERN KIOSK BACKGROUND END --- */}

      {/* ORIGINAL CONTENT LOGIC BELOW */}
      <div className="flex flex-row lg:flex-col gap-4 md:gap-12 lg:gap-12 relative w-full justify-center lg:justify-start z-10">
        {steps.map((step, index) => {
          const isDone = currentStep > step.id;
          const isActive = currentStep === step.id;

          return (
            <div key={step.id} className="relative flex flex-col lg:flex-row items-center gap-2 lg:gap-10 flex-1 lg:flex-none">
              
              {/* ORIGINAL CONNECTOR LINES */}
              {index !== steps.length - 1 && (
                <>
                  {/* Desktop Vertical */}
                  <div className={cn(
                    "hidden lg:block absolute left-[39px] top-[80px] h-[48px] border-l-2 border-dashed transition-colors duration-500",
                    isDone ? "border-[var(--color-success-primary)]" : "border-[var(--color-brand-accent)]/20"
                  )} />

                  {/* Mobile Horizontal*/}
                  <div className={cn(
                    "lg:hidden absolute left-[50%] top-[20px] w-full border-t-2 border-dashed -z-10 transition-colors duration-500",
                    isDone ? "border-[var(--color-success-primary)]" : "border-[var(--color-brand-accent)]/20"
                  )} />
                </>
              )}
              
              {/* ORIGINAL ICON CIRCLE */}
              <div className={cn(
                "w-10 h-10 lg:w-20 lg:h-20 rounded-full flex items-center justify-center z-10 transition-all duration-500 border-2 lg:border-4",
                isDone ? "bg-[var(--color-success-secondary)] text-[var(--color-success-primary)] border-[var(--color-success-secondary)]" : 
                isActive ? "bg-[var(--color-brand-primary)] text-white border-[var(--color-brand-secondary)] shadow-xl shadow-orange-200/50" : 
                "bg-white/80 border-white/40 text-neutral-400" 
              )}>
                {isDone ? (
                  <Check className="w-5 h-5 lg:w-8 lg:h-8" strokeWidth={3} />
                ) : (
                  <step.icon className="w-5 h-5 lg:w-8 lg:h-8" />
                )}
              </div>

              {/* ORIGINAL STEP TITLE */}
              <span className={cn(
                "hidden sm:block whitespace-nowrap transition-colors text-[10px] lg:text-xl font-figtree",
                isActive || isDone ? "text-[var(--color-text-primary)] font-bold" : "text-[var(--color-text-secondary)]/60"
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