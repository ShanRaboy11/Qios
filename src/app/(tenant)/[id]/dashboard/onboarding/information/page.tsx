"use client";

import React, { useState, useRef, useEffect } from "react";
import { 
  FileText, 
  Contact, 
  ShoppingBag, 
  Component, 
  ChevronDown, 
  Check,
  Search
} from "lucide-react";

import { Button } from "@/components/atoms/Button";
import { FormField } from "@/components/molecules/FormField";
import { cn } from "@/lib/utils";

const steps = [
  { id: 1, title: "Business Information", icon: FileText },
  { id: 2, title: "Authentication Credentials", icon: Contact },
  { id: 3, title: "Subscription Package", icon: ShoppingBag },
  { id: 4, title: "Feature Configuration", icon: Component },
];

const countries = [
  { name: "Philippines", code: "ph", dial: "+63" },
  { name: "United States", code: "us", dial: "+1" },
  { name: "United Kingdom", code: "gb", dial: "+44" },
  { name: "Singapore", code: "sg", dial: "+65" },
  { name: "Australia", code: "au", dial: "+61" },
  { name: "Canada", code: "ca", dial: "+1" },
];

function CountryCodeSelect() {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(countries[0]);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const clickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener("mousedown", clickOutside);
    return () => document.removeEventListener("mousedown", clickOutside);
  }, []);

  const filtered = countries.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || c.dial.includes(search)
  );

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-[130px] h-[50px] px-3.5 rounded-[15px] border-2 flex items-center justify-between cursor-pointer transition-all bg-white",
          isOpen ? "border-[var(--color-brand-primary)] shadow-sm" : "border-neutral-200"
        )}
      >
        <div className="flex items-center gap-1">
          <img 
            src={`https://flagcdn.com/w40/${selected.code}.png`} 
            alt={selected.name}
            className="w-10 h-5 object-cover rounded-sm"
          />
          <span className="b2 text-[var(--color-text-primary)] font-semibold">{selected.dial}</span>
        </div>
        <ChevronDown size={18} className={cn("text-text-secondary transition-transform duration-300", isOpen && "rotate-180 text-[var(--color-brand-primary)]")} />
      </div>

      {isOpen && (
        <div className="absolute top-[65px] left-0 w-[260px] bg-white border-2 border-[#E5E5E5] rounded-2xl shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          <div className="p-3 border-b border-neutral-50 bg-neutral-50/50">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                className="w-full h-9 pl-9 pr-3 bg-white border border-neutral-200 rounded-xl text-sm outline-none focus:border-[var(--color-brand-primary)]"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                autoFocus
              />
            </div>
          </div>
          <div className="max-h-[220px] overflow-y-auto">
            {filtered.map((c) => (
              <div
                key={c.code}
                onClick={() => { setSelected(c); setIsOpen(false); setSearch(""); }}
                className={cn(
                  "px-4 py-3 hover:bg-slate-50 flex items-center justify-between cursor-pointer group",
                  selected.code === c.code ? "bg-orange-50/50" : ""
                )}
              >
                <div className="flex items-center gap-1">
                  <img src={`https://flagcdn.com/w40/${c.code}.png`} alt={c.name} className="w-10 h-5 rounded-sm" />
                  <span className={cn("b2", selected.code === c.code ? "text-[var(--color-brand-primary)] font-bold" : "text-[var(--color-text-primary)]")}>
                    {c.name}
                  </span>
                </div>
                <span className="b4 text-[var(--color-text-secondary)] font-bold">{c.dial}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function OnboardingView() {
  const [currentStep, setCurrentStep] = useState(1);

  const nextStep = () => currentStep < steps.length && setCurrentStep(currentStep + 1);
  const prevStep = () => currentStep > 1 && setCurrentStep(currentStep - 1);
  const Required = () => <span className="text-[var(--color-warning-primary)]">*</span>;

  return (
    <div className="flex min-h-screen bg-white">
      {/* LEFT SIDE: Progress Sidebar */}
      <div className="w-[55%] h-[1066px] hidden lg:flex flex-col justify-center px-24 bg-white relative border-r border-neutral-50">
        <div className="space-y-12 relative">
          {steps.map((step, index) => {
            const isDone = currentStep > step.id;
            const isActive = currentStep === step.id;

            return (
              <div key={step.id} className="relative flex items-center gap-10">
                {index !== steps.length - 1 && (
                  <div className={cn(
                    "absolute left-[39px] top-[80px] h-[48px] border-l-2 border-dashed transition-colors duration-500",
                    isDone ? "border-[var(--color-success-primary)]" : "border-[var(--color-brand-accent)]"
                  )} />
                )}
                
                <div className={cn(
                  "w-20 h-20 rounded-full flex items-center justify-center z-10 transition-all duration-500 border-4",
                  isDone ? "bg-[var(--color-success-secondary)] border-[var(--color-success-secondary)] text-[var(--color-success-primary)]" : 
                  isActive ? "bg-[var(--color-brand-primary)] border-[var(--color-brand-secondary)] text-[var(--color-text-tertiary)] shadow-lg shadow-orange-100" : 
                  "bg-neutral-50 border-transparent text-neutral-300"
                )}>
                  {isDone ? <Check size={32} strokeWidth={3} /> : <step.icon size={30} />}
                </div>

                <span className={cn(
                  "h4 transition-colors duration-500 whitespace-nowrap",
                  isActive || isDone ? "text-[var(--color-text-primary)] font-semibold" : "text-[var(--color-text-secondary)]"
                )}>
                  {step.title}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* RIGHT SIDE: Form Section */}
      <div className="flex-1 bg-[var(--color-bg-primary)] flex flex-col justify-center px-24">
        
        {currentStep === 2 ? (
          <div className="max-w-md w-full">
            <h1 className="h1 text-[var(--color-text-primary)] mb-16 leading-tight">
              {steps.find(s => s.id === currentStep)?.title}
            </h1>
          </div>
        ) : (
          <div className="w-full">
            <h1 className="h1 text-[var(--color-text-primary)] mb-16 leading-tight whitespace-nowrap">
              {currentStep === 1 
                ? "Business Information" 
                : steps.find(s => s.id === currentStep)?.title}
            </h1>
          </div>
        )}

        <div className="max-w-md w-full">
          <div className="min-h-[420px]">
            {/* STEP 1: BUSINESS INFO */}
            {currentStep === 1 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
                <FormField 
                  label={<>Business Name <Required/></>} 
                  placeholder="Business Name" 
                  className="max-w-none" />

                <FormField 
                  label={<>Business Email Address <Required/></>} 
                  placeholder="Business Email Address" 
                  className="max-w-none" />
                
                <div className="space-y-1.5 flex flex-col">
                  <label className="b4 ml-1 font-medium text-[var(--color-text-secondary)]">Contact Number <Required/></label>
                  <div className="flex gap-4">
                    <CountryCodeSelect />
                    <FormField label="" placeholder="912 345 6789" className="flex-1 max-w-none" />
                  </div>
                </div>

                <FormField label="Owner / Admin Name (Optional)" placeholder="Owner / Admin Name" className="max-w-none" />
              </div>
            )}

            {/* STEP 2: AUTH CREDENTIALS */}
            {currentStep === 2 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
              <FormField 
                  label={<>Admin Email <Required /></>} 
                  type="email" 
                  placeholder="Admin Email" 
                  className="max-w-none" 
                />                
                <FormField 
                  label={<>Admin Password <Required /></>} 
                  type="password" 
                  placeholder="Admin Password" 
                  supportiveText="Minimum 8 characters" 
                  className="max-w-none" 
                />
                <FormField 
                  label={<>Confirm Password <Required /></>} 
                  type="password" 
                  placeholder="Confirm Password" 
                  className="max-w-none" 
                />
              </div>
            )}

            {/* STEP 3 & 4 */}
            {currentStep >= 3 && (
              <div className="py-20 text-center animate-in zoom-in-95 duration-500">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                  <ShoppingBag className="text-[var(--color-brand-primary)]" size={40} />
                </div>
                <h3 className="h3 text-[var(--color-text-primary)]">Section Coming Soon</h3>
                <p className="b1 text-[var(--color-text-secondary)] mt-2">Finalizing the {steps[currentStep-1].title} module.</p>
              </div>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="mt-14 flex gap-4">
            {currentStep > 1 && (
              <Button variant="outline" onClick={prevStep}>
                Back
              </Button>
            )}
            <Button 
              variant="primary" 
              size="lg"
              className="h-14 flex-1 font-bold text-lg"
              onClick={nextStep}
            >
              {currentStep === steps.length ? "Finalize Setup" : "Continue"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}