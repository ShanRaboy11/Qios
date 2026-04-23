"use client";
import React, { useState } from "react";
import { FileText, Contact, IdCard, ShoppingBag, Component } from "lucide-react";
import { Button } from "@/components/atoms/Button";

// ✅ FIXED PATHS: Added "./components/"
import { OnboardingSidebar } from "./components/onboardingSidebar";
import { BusinessInformation } from "./components/BusinessInformation";
import { ContactInformation } from "./components/ContactInformation";
import { AuthCredentials } from "./components/AuthCredentials";

const steps = [
  { id: 1, title: "Business Information", icon: FileText },
  { id: 2, title: "Contact Information", icon: Contact },
  { id: 3, title: "Authentication Credentials", icon: IdCard },
  { id: 4, title: "Subscription Package", icon: ShoppingBag },
  { id: 5, title: "Feature Configuration", icon: Component },
];

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(1);

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, steps.length));
  // prevStep function removed to clean up unused code

  return (
    <div className="flex min-h-screen bg-white">
      {/* Sidebar Component */}
      <OnboardingSidebar steps={steps} currentStep={currentStep} />

      <div className="flex-1 bg-[var(--color-bg-primary)] flex flex-col justify-center px-24">
        {/* Dynamic Title Section */}
        <div className="w-full mb-16">
          <h1 className="h1 text-[var(--color-text-primary)] leading-tight whitespace-nowrap">
            {currentStep === 1 
              ? "Business Information" 
              : steps.find(s => s.id === currentStep)?.title}
          </h1>
        </div>

        <div className="max-w-md w-full">
          <div className="min-h-[450px]">
            {/* Step Components */}
            {currentStep === 1 && <BusinessInformation />}
            {currentStep === 2 && <ContactInformation onNext={nextStep} />}
            {currentStep === 3 && <AuthCredentials />}
            
            {/* Steps 4 & 5 */}
            {currentStep >= 4 && (
              <div className="py-20 text-center animate-in zoom-in-95 duration-500">
                <ShoppingBag className="mx-auto mb-6 text-[var(--color-brand-primary)]" size={48} />
                <h3 className="h3 text-[var(--color-text-primary)]">Section Coming Soon</h3>
                <p className="b1 text-[var(--color-text-secondary)] mt-2">
                  Finalizing the {steps[currentStep-1].title} module.
                </p>
              </div>
            )}
          </div>

          {/* Navigation Buttons (Back button removed here) */}
          {currentStep !== 2 && (
            <div className="flex">
              <Button 
                variant="primary" 
                size="lg" 
                className="h-14 flex-1 font-bold text-lg" 
                onClick={nextStep}
              >
                {currentStep === steps.length ? "Finalize" : "Continue"}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}