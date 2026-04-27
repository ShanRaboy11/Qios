"use client";
import React, { useState } from "react";
import { FileText, Contact, ShoppingBag, Component, IdCard } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { cn } from "@/lib/utils";

import { OnboardingSidebar } from "./components/Sidebar";
import { BusinessInformation } from "./components/BusinessInformation";
import { ContactInformation } from "./components/ContactInformation";
import { AuthCredentials } from "./components/AuthCredentials";
import { SubscriptionPackage } from "./components/SubscriptionPackage";
import { FeatureConfig } from "./components/FeatureConfiguration";

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
  
  const handleFinalize = (data: any) => {
    console.log("Final Onboarding Data:", data);
    alert("Onboarding Completed!");
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[var(--color-bg-primary)]">
      
      {/* Sidebar */}
      <OnboardingSidebar steps={steps} currentStep={currentStep} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col justify-center items-center lg:items-start px-6 py-10 md:px-16 lg:pl-[50%] xl:pl-[60%] lg:pr-24 min-h-screen">
        
        {/* Header */}
        <div className="w-full mb-8 lg:mb-12 text-center lg:text-left">
          <h1 className="text-3xl md:text-4xl lg:h1 text-[var(--color-text-primary)] leading-tight lg:whitespace-nowrap">
            {currentStep === 1 
              ? "Business Information" 
              : steps.find(s => s.id === currentStep)?.title}
          </h1>
        </div>

        <div className={cn(
          "w-full transition-all duration-500",
          currentStep === 4 ? "max-w-2xl" : "max-w-[450px]"
        )}>
          <div className="min-h-fit">
            {currentStep === 1 && <BusinessInformation />}
            {currentStep === 2 && <ContactInformation onNext={nextStep} />}
            {currentStep === 3 && <AuthCredentials />}
            {currentStep === 4 && <SubscriptionPackage onNext={nextStep} />}
            {currentStep === 5 && <FeatureConfig onFinish={handleFinalize} />}
          </div>

          {/* Navigation Button for Steps 1 & 3 */}
          {currentStep !== 2 && currentStep !== 4 && currentStep !== 5 && (
            <div className="flex mt-12 lg:mt-20"> 
              <Button 
                variant="primary" 
                size="lg" 
                className="h-14 lg:h-16 flex-1 b2 font-bold text-lg shadow-xl shadow-orange-200/50 text-[var(--color-text-tertiary)] transition-all duration-300" 
                onClick={nextStep}
              >
                Continue
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
