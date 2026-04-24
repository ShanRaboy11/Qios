"use client";
import React, { useState } from "react";
import { FileText, Contact, ShoppingBag, Component, IdCard } from "lucide-react";
import { Button } from "@/components/atoms/Button";

// Components
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
    // Redirect or trigger API call here
  };

  return (
    <div className="flex min-h-screen bg-white">
      <OnboardingSidebar steps={steps} currentStep={currentStep} />

      <div className="flex-1 bg-[var(--color-bg-primary)] flex flex-col justify-center px-24">
        <div className="w-full mb-12">
          <h1 className="h1 text-[var(--color-text-primary)] leading-tight whitespace-nowrap">
            {currentStep === 1 
              ? "Business Information" 
              : steps.find(s => s.id === currentStep)?.title}
          </h1>
        </div>

        <div className={currentStep === 4 ? "max-w-2xl w-full" : "max-w-[450px] w-full"}>
          <div className="min-h-fit">
            {currentStep === 1 && <BusinessInformation />}
            {currentStep === 2 && <ContactInformation onNext={nextStep} />}
            {currentStep === 3 && <AuthCredentials />}
            {currentStep === 4 && <SubscriptionPackage onNext={nextStep} />}
            {/* Pass the handleFinalize function here */}
            {currentStep === 5 && <FeatureConfig onFinish={handleFinalize} />}
          </div>

          {/* Navigation Button for Steps 1 & 3 */}
          {currentStep !== 2 && currentStep !== 4 && currentStep !== 5 && (
            <div className="flex mt-20"> 
              <Button 
                variant="primary" 
                size="lg" 
                className="h-16 flex-1 font-bold text-lg shadow-xl shadow-orange-200/50" 
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