"use client";
import React, { useState } from "react";
import { 
  FileText, 
  Contact, 
  ShoppingBag, 
  Component, 
  IdCard, 
  ChevronLeft, 
  ArrowRight, 
  ArrowLeft
} from "lucide-react";
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
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));
  
  const handleFinalize = (data: any) => {
    console.log("Final Onboarding Data:", data);
    alert("Onboarding Completed!");
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[var(--color-bg-primary)]">
      <OnboardingSidebar steps={steps} currentStep={currentStep} />

      <div className="flex-1 flex flex-col justify-center items-center lg:items-start px-6 py-10 md:px-16 lg:pl-[50%] xl:pl-[60%] lg:pr-24 min-h-screen">
        <div className="w-full mb-8 lg:mb-12 text-center lg:text-left">
          <h1 className="text-3xl md:text-4xl lg:h1 text-[var(--color-text-primary)] leading-tight lg:whitespace-nowrap">
            {steps.find(s => s.id === currentStep)?.title}
          </h1>
        </div>

        <div className={cn(
          "w-full transition-all duration-500",
          currentStep === 4 ? "max-w-2xl" : "max-w-[450px]"
        )}>
          <div className="min-h-fit">
            {currentStep === 1 && <BusinessInformation />}
            
            {currentStep === 2 && (
              <ContactInformation onNext={nextStep} onBack={prevStep} />
            )}
            
            {currentStep === 3 && <AuthCredentials />}
            {currentStep === 4 && <SubscriptionPackage onNext={nextStep} onBack={prevStep} />}
            {currentStep === 5 && <FeatureConfig onFinish={handleFinalize} onBack={prevStep} />}
          </div>

          {(currentStep === 1 || currentStep === 3) && (
            <div className="flex flex-row gap-10 mt-12 lg:mt-20"> 
              {currentStep === 3 && (
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="h-13 lg:h-13 px-8 b2 border-neutral-200 text-neutral-500 hover:bg- transition-all" 
                  onClick={prevStep}
                >
                  <ArrowLeft className="w-5 h-5 mr-1" />
                  Back
                </Button>
              )}
              <Button 
                variant="primary" 
                size="lg" 
                className="h-13 lg:h-13 flex-1 b2 font-bold text-lg shadow-xl shadow-orange-200/50 text-[var(--color-text-tertiary)]" 
                onClick={nextStep}
              >
                Continue
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}