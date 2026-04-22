"use client";

import React from "react";
import { 
  Check, 
  Key, 
  CreditCard, 
  Settings, 
  Building2 
} from "lucide-react";

const steps = [
  { id: 1, title: "Business Information", icon: Building2, status: "done" },
  { id: 2, title: "Authentication Credentials", icon: Key, status: "active" },
  { id: 3, title: "Subscription Package", icon: CreditCard, status: "inactive" },
  { id: 4, title: "Feature Configuration", icon: Settings, status: "inactive" },
];

export function AuthenticationForm() {
  return (
    <div className="flex min-h-screen bg-white">
      {/* LEFT SIDEBAR: Progress Navigation */}
      <div className="w-[45%] hidden lg:flex flex-col justify-center px-24 bg-white relative">
        <div className="space-y-12 relative">
          {steps.map((step, index) => (
            <div key={step.id} className="relative flex items-center gap-10">
              {/* Vertical Connector Line */}
              {index !== steps.length - 1 && (
                <div className="absolute left-[39px] top-[80px] h-[48px] border-l-2 border-rose-500" />
              )}
              
              {/* Icon Container */}
              <div className={`w-20 h-20 rounded-[40px] flex items-center justify-center z-10 transition-all
                ${step.status === 'done' ? 'bg-lime-100 text-green-500' : 
                  step.status === 'active' ? 'bg-amber-200 text-zinc-800' : 
                  'bg-orange-300/20 text-neutral-500'}`}>
                
                {step.status === 'done' ? (
                  <Check size={32} strokeWidth={3} />
                ) : (
                  <step.icon size={32} />
                )}
              </div>

              {/* Step Title */}
              <span className={`text-2xl font-medium font-['Figtree'] 
                ${step.status === 'inactive' ? 'text-neutral-400 font-normal' : 'text-black font-medium'}`}>
                {step.title}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT SIDE: Authentication Form */}
      <div className="flex-1 bg-orange-50 flex flex-col justify-center px-24">
        <div className="max-w-md w-full">
          <h1 className="text-[40px] font-semibold font-['Figtree'] text-black mb-16">
            Authentication Credentials
          </h1>

          <div className="space-y-11">
            {/* Admin Email - Active State */}
            <div className="flex flex-col gap-[5px]">
              <div className="px-2.5">
                <label className="text-amber-200 text-base font-medium font-['Inter']">
                  Admin Email <span className="text-red-600/90">*</span>
                </label>
              </div>
              <div className="h-14 w-full rounded-[20px] outline outline-2 outline-offset-[-2px] outline-amber-200 bg-transparent flex items-center px-5">
                <input 
                  type="email" 
                  defaultValue="Admin Email"
                  className="w-full bg-transparent outline-none text-zinc-800 text-base font-medium font-['Inter']"
                />
              </div>
              <div className="px-3.5">
                <p className="text-neutral-500/50 text-xs font-normal font-['Inter']">Supportive text</p>
              </div>
            </div>

            {/* Admin Password - Inactive State */}
            <div className="flex flex-col gap-[5px]">
              <div className="px-2.5">
                <label className="text-neutral-500/50 text-base font-medium font-['Inter']">
                  Admin Password <span className="text-red-600/90">*</span>
                </label>
              </div>
              <div className="h-14 w-full rounded-[20px] outline outline-2 outline-offset-[-2px] outline-neutral-500/30 bg-transparent flex items-center px-5">
                <input 
                  type="password" 
                  placeholder="Admin Password"
                  className="w-full bg-transparent outline-none text-neutral-500/80 text-base font-medium font-['Inter']"
                />
              </div>
              <div className="px-3.5">
                <p className="text-neutral-500/50 text-xs font-normal font-['Inter']">Supportive text</p>
              </div>
            </div>

            {/* Confirm Password - Inactive State */}
            <div className="flex flex-col gap-[5px]">
              <div className="px-2.5">
                <label className="text-neutral-500/50 text-base font-medium font-['Inter']">
                  Confirm Password <span className="text-red-600/90">*</span>
                </label>
              </div>
              <div className="h-14 w-full rounded-[20px] outline outline-2 outline-offset-[-2px] outline-neutral-500/30 bg-transparent flex items-center px-5">
                <input 
                  type="password" 
                  placeholder="Confirm Password"
                  className="w-full bg-transparent outline-none text-neutral-500/80 text-base font-medium font-['Inter']"
                />
              </div>
              <div className="px-3.5">
                <p className="text-neutral-500/50 text-xs font-normal font-['Inter']">Supportive text</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}