"use client";

import React from "react";
import { FileText, Contact, ShoppingBag, Component, ChevronDown } from "lucide-react";


const steps = [
  { id: 1, title: "Business Information", icon: FileText, active: true },
  { id: 2, title: "Authentication Credentials", icon: Contact, active: false },
  { id: 3, title: "Subscription Package", icon: ShoppingBag, active: false },
  { id: 4, title: "Feature Configuration", icon: Component, active: false },
];

export default function OnboardingView() {
  return (
    <div className="flex min-h-screen bg-white">
      {/* LEFT SIDE: Progress Sidebar */}
      <div className="w-[45%] flex flex-col justify-center px-24 bg-white relative">
        <div className="space-y-12 relative">
          {steps.map((step, index) => (
            <div key={step.id} className="relative flex items-center gap-10">
              {/* Dashed Red Line */}
              {index !== steps.length - 1 && (
                <div className="absolute left-[39px] top-[80px] h-[48px] border-l-2 border-dashed border-rose-400" />
              )}
              
              {/* Icon Container */}
              <div className={`w-20 h-20 rounded-full flex items-center justify-center z-10 transition-all
                ${step.active ? 'bg-[#FFD684]' : 'bg-[#F9F4EE]'}`}>
                <step.icon size={30} className={step.active ? 'text-[#4A3B28]' : 'text-neutral-400'} />
              </div>

              {/* Step Title */}
              <span className={`text-2xl font-medium font-['Figtree'] ${step.active ? 'text-black' : 'text-neutral-500'}`}>
                {step.title}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT SIDE: The Form */}
      <div className="flex-1 bg-[#FFF9F0] flex flex-col justify-center px-24">
        <div className="max-w-md w-full">
          <h1 className="text-[40px] font-bold font-['Figtree'] text-black mb-16">
            Business Information
          </h1>

          <div className="space-y-10">
            {/* Business Name */}
            <div className="space-y-1.5">
              <label className="text-[#FFD684] text-sm font-semibold font-['Inter'] px-2">Business Name *</label>
              <input 
                type="text" 
                defaultValue="Business Name"
                className="w-full h-[58px] px-6 rounded-[20px] border-2 border-[#FFD684] bg-white/50 text-black font-medium focus:outline-none"
              />
              <p className="text-neutral-400 text-[11px] px-4">Supportive text</p>
            </div>

            {/* Email Address */}
            <div className="space-y-1.5">
              <label className="text-neutral-400 text-sm font-semibold font-['Inter'] px-2">Business Email Address *</label>
              <input 
                type="text" 
                placeholder="Business Email Address"
                className="w-full h-[58px] px-6 rounded-[20px] border-2 border-neutral-200 bg-transparent text-neutral-400 font-medium focus:outline-none"
              />
              <p className="text-neutral-400 text-[11px] px-4">Supportive text</p>
            </div>

            {/* Contact Number */}
            <div className="space-y-1.5">
              <label className="text-neutral-400 text-sm font-semibold font-['Inter'] px-2">Contact Number *</label>
              <div className="flex gap-4">
                <div className="w-[110px] h-[58px] px-4 rounded-[20px] border-2 border-neutral-200 bg-white/50 flex items-center justify-between cursor-pointer">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🇵🇭</span>
                    <span className="text-neutral-600 font-medium">+63</span>
                  </div>
                  <ChevronDown size={16} className="text-neutral-400" />
                </div>
                <input 
                  type="text" 
                  placeholder="9123456789"
                  className="flex-1 h-[58px] px-6 rounded-[20px] border-2 border-neutral-200 bg-transparent text-neutral-400 font-medium focus:outline-none"
                />
              </div>
              <p className="text-neutral-400 text-[11px] px-4">Supportive text</p>
            </div>

            {/* Admin Name */}
            <div className="space-y-1.5">
              <label className="text-neutral-400 text-sm font-semibold font-['Inter'] px-2">Owner / Admin Name (Optional)</label>
              <input 
                type="text" 
                placeholder="Owner / Admin Name"
                className="w-full h-[58px] px-6 rounded-[20px] border-2 border-neutral-200 bg-transparent text-neutral-400 font-medium focus:outline-none"
              />
              <p className="text-neutral-400 text-[11px] px-4">Supportive text</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}