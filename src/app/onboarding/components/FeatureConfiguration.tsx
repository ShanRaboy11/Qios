"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Required } from "./BusinessInformation";
import { Button } from "@/components/atoms/Button"; 
import { ArrowLeft, ChevronLeft } from "lucide-react";

const CustomLockedToggle = ({ 
  isOn, 
  variant = "amber" 
}: { 
  isOn: boolean, 
  variant?: "rose" | "amber" 
}) => {
  const knobColor = variant === "rose" ? "var(--color-brand-accent)" : "var(--color-brand-primary)";
  const trackColor = variant === "rose" ? "rgba(255, 82, 105, 0.2)" : "rgba(255, 198, 112, 0.2)";

  return (
    <div 
      className={cn(
        "w-[50px] h-[30px] rounded-full transition-colors duration-300 flex items-center px-1 shrink-0",
        isOn ? "" : "bg-neutral-200/50"
      )}
      style={{ backgroundColor: isOn ? trackColor : undefined }}
    >
      <div className={cn(
        "transition-all duration-300 transform",
        isOn ? "translate-x-5" : "translate-x-0"
      )}>
        <svg width="22" height="22" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="20.4286" height="20.4286" rx="10.2143" fill={knobColor}/>
          <g clipPath="url(#clip0_1778_5359)">
            <path d="M6.28516 11.7859C6.28516 10.6747 6.28516 10.1191 6.63035 9.77391C6.97555 9.42871 7.53113 9.42871 8.6423 9.42871H11.7852C12.8963 9.42871 13.4519 9.42871 13.7971 9.77391C14.1423 10.1191 14.1423 10.6747 14.1423 11.7859C14.1423 12.897 14.1423 13.4526 13.7971 13.7978C13.4519 14.143 12.8963 14.143 11.7852 14.143H8.6423C7.53113 14.143 6.97555 14.143 6.63035 13.7978C6.28516 13.4526 6.28516 12.897 6.28516 11.7859Z" stroke="var(--color-bg-primary)" strokeWidth="0.785714"/>
            <path d="M7.85742 9.42899V8.64328C7.85742 7.34146 8.91275 6.28613 10.2146 6.28613C11.0003 6.28613 11.786 6.67899 12.1789 7.4647" stroke="var(--color-bg-primary)" strokeWidth="0.785714" strokeLinecap="round"/>
            <path d="M10.2148 11V12.5714" stroke="var(--color-bg-primary)" strokeWidth="0.785714" strokeLinecap="round"/>
          </g>
          <defs>
            <clipPath id="clip0_1778_5359">
              <rect width="9.42857" height="9.42857" fill="white" transform="translate(5.5 5.5)"/>
            </clipPath>
          </defs>
        </svg>
      </div>
    </div>
  );
};

interface FeatureConfigProps {
  onFinish?: (data: any) => void;
    onBack: () => void;
}

export function FeatureConfig({ onFinish, onBack }: FeatureConfigProps) {
  const [inventoryMode, setInventoryMode] = useState<"unit" | "measurement">("unit");
  const [generalFeatures, setGeneralFeatures] = useState({
    ai: true, inventory: false, analytics: true, notifications: false, customization: false,
  });

  const toggleGeneral = (key: keyof typeof generalFeatures) => {
    setGeneralFeatures(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleFinalize = () => {
    if (onFinish) {
      onFinish({ inventoryMode, generalFeatures });
    }
  };

  return (
    <div className="flex flex-col gap-10 animate-in fade-in slide-in-from-right-8 duration-500 w-full max-w-[520px] pb-10">
      
      {/*INVENTORY MODE */}
      <div className="space-y-4">
        <h3 className="h4 text-[var(--color-text-primary)]">
          Inventory Mode Selection <Required />
        </h3>
        <div className="space-y-3">
          {[
            { id: "unit", label: "Unit Based", desc: "Fixed deduction per item" },
            { id: "measurement", label: "Measurement Based", desc: "grams/mL deduction via recipe matrix" }
          ].map((item) => (
            <div 
              key={item.id} 
              onClick={() => setInventoryMode(item.id as any)} 
              className={cn(
                "flex items-center gap-5 px-6 py-5 rounded-[22px] cursor-pointer transition-all border-2",
                inventoryMode === item.id 
                  ? "bg-white border-[var(--color-brand-primary)] shadow-[0_0_0_4px_rgba(255,198,112,0.08)]" 
                  : "bg-neutral-50 border-transparent hover:bg-neutral-100"
              )}
            >
              <CustomLockedToggle isOn={inventoryMode === item.id} variant="rose" />
              <div className="flex flex-col">
                <span className="b2 font-bold text-[var(--color-text-primary)] leading-tight">
                  {item.label}
                </span>
                <span className="b4 text-[var(--color-text-secondary)] mt-0.5">
                  {item.desc}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* GENERAL MODE */}
      <div className="space-y-4">
        <h3 className="h4 text-[var(--color-text-primary)]">
          General Mode Selection
        </h3>
        <div className="space-y-3">
          {[
            { id: "ai", label: "AI Concierge", desc: "Automated customer assistance" },
            { id: "inventory", label: "Inventory Module", desc: "Full stock management system" },
            { id: "analytics", label: "Analytics Dashboard", desc: "Real-time business insights" },
            { id: "notifications", label: "Notifications", desc: "Instant order alerts" },
          ].map((item) => (
            <div 
              key={item.id} 
              onClick={() => toggleGeneral(item.id as any)} 
              className={cn(
                "flex items-center gap-5 px-6 py-5 rounded-[22px] cursor-pointer transition-all border-2",
                generalFeatures[item.id as keyof typeof generalFeatures]
                  ? "bg-white border-[var(--color-brand-primary)] shadow-[0_0_0_4px_rgba(255,198,112,0.08)]" 
                  : "bg-neutral-50 border-transparent hover:bg-neutral-100"
              )}
            >
              <CustomLockedToggle isOn={generalFeatures[item.id as keyof typeof generalFeatures]} variant="amber" />
              <div className="flex flex-col">
                <span className="b2 font-bold text-[var(--color-text-primary)] leading-tight">
                  {item.label}
                </span>
                <span className="b4 text-[var(--color-text-secondary)] mt-0.5">
                  {item.desc}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Finalize Button */}
      <div className="flex flex-row gap-10 pt-4">
        <Button 
          variant="ghost" 
          size="lg" 
          className="h-13 lg:h-13 px-5 b2 border-neutral-200 text-neutral-500" 
          onClick={onBack}
        >
          <ArrowLeft className="w-5 h-5 mr-1" />
          Back
        </Button>
        <Button 
          variant="primary" 
          size="lg" 
          className="h-13 lg:h-13 flex-1 b2 shadow-xl shadow-orange-200/50" 
          onClick={handleFinalize}
        >
          Finalize
        </Button>
      </div>
    </div>
  );
}