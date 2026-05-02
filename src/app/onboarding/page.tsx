"use client";
import React, { useState } from "react";
import { 
  FileText, Contact, ShoppingBag, Component, 
  IdCard, ArrowRight, ArrowLeft, CheckCircle2, FileCheck 
} from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { cn } from "@/lib/utils";

import { OnboardingSidebar } from "./components/Sidebar";
import { BusinessInformation } from "./components/BusinessInformation";
import { DocumentUpload } from "./components/DocumentUpload";
import { ContactInformation } from "./components/ContactInformation";
import { AuthCredentials } from "./components/AuthCredentials";
import { SubscriptionPackage } from "./components/SubscriptionPackage";
import { FeatureConfig } from "./components/FeatureConfiguration";
import { RegistrationSuccessModal } from "./components/RegistrationSuccessModal";
import { Navbar } from "@/components/organisms/navbar";
import { Footer } from "@/components/organisms/footer";
import { processOnboarding, sendContactVerificationCode } from "./actions";
import { useRouter } from "next/navigation";

const steps = [
  { id: 1, title: "Business Information", icon: FileText },
  { id: 2, title: "Contact Verification", icon: Contact },
  { id: 3, title: "Authentication Credentials", icon: IdCard },
  { id: 4, title: "Document Requirements", icon: FileCheck },
  { id: 5, title: "Subscription Package", icon: ShoppingBag },
  { id: 6, title: "Feature Configuration", icon: Component },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  const [businessData, setBusinessData] = useState({ name: "", email: "", owner: "" });
  const [contactData, setContactData] = useState({ phoneNumber: "" });
  const [authData, setAuthData] = useState({ email: "", password: "", confirm: "" });
  const [subscriptionData, setSubscriptionData] = useState({ packageId: "starter" });
  const [documentData, setDocumentData] = useState<Record<string, File>>({});
  const [verificationCode, setVerificationCode] = useState("");
  
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [registrationData, setRegistrationData] = useState({ businessName: "", businessEmail: "" });

  const validateEmail = (email: string) => /\S+@\S+\.\S+/.test(email);

  const dispatchVerificationCode = async () => {
    const res = await sendContactVerificationCode({
      email: businessData.email,
      businessName: businessData.name,
    });

    setVerificationCode(res.verificationCode);
    return res.verificationCode;
  };

  const nextStep = async () => {
    setError("");
    setSuccess("");

    if (currentStep === 1) {
      if (!businessData.name.trim()) return setError("Business Name is required");
      if (!validateEmail(businessData.email)) return setError("A valid business email is required");
      if (!businessData.owner?.trim()) return setError("Owner / Admin Name is required");

      setLoading(true);
      try {
        await dispatchVerificationCode();
        setSuccess(`Verification code sent to ${businessData.email}`);
        setCurrentStep(2);
      } catch (err: any) {
        setError(err.message || "Unable to send verification code.");
      } finally {
        setLoading(false);
      }
      return;
    }

    if (currentStep === 3) {
      if (!validateEmail(authData.email)) return setError("Valid Admin Email is required");
      if (authData.password.length < 8) return setError("Password must be at least 8 characters");
      if (authData.password !== authData.confirm) return setError("Passwords do not match");
    }

    setCurrentStep((prev) => Math.min(prev + 1, steps.length));
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to top on step change
  };

  const prevStep = () => {
    setError("");
    setSuccess("");
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const handleFinalize = async (featureData: any) => {
    setLoading(true);
    setError("");
    try {
      const res = await processOnboarding({
        businessData,
        authData,
        subscriptionData,
        featureData,
        documentData
      });
      if (res.success) {
        setRegistrationData({
          businessName: res.businessName,
          businessEmail: res.businessEmail,
        });
        setShowSuccessModal(true);
      }
    } catch (err: any) {
      setError(err.message || "An error occurred during onboarding.");
    } finally {
      setLoading(false);
    }
  };

  const handleModalClose = () => {
    setShowSuccessModal(false);
    router.push("/");
  };

  return (
    <main className="flex flex-col min-h-screen bg-white w-full overflow-x-hidden">
      <Navbar variant="transparent" />
      <div className="flex flex-col lg:flex-row min-h-screen bg-[var(--color-bg-primary)]">
        <OnboardingSidebar steps={steps} currentStep={currentStep} />

      {/* MAIN CONTENT AREA */}
      <div className={cn(
        "flex-1 flex flex-col items-center px-6 md:px-16 lg:px-16 xl:px-24 min-h-screen transition-all duration-300",
        currentStep <= 3 ? "justify-center pt-24 lg:pt-0" : "justify-start pt-52 lg:pt-32 pb-20"
      )}>
        
        {/* Title Section */}
        <div className="w-full mb-8 lg:mb-12 text-center">
          <h1 className="text-3xl md:text-4xl lg:h1 text-[var(--color-text-primary)] leading-tight lg:whitespace-nowrap">
            {steps.find(s => s.id === currentStep)?.title}
          </h1>
        </div>

        {/* Content Wrapper */}
        <div className={cn(
          "w-full transition-all duration-500 mx-auto flex flex-col items-center",
          (currentStep === 4 || currentStep === 5 || currentStep === 6) ? "max-w-2xl" : "max-w-[450px]"
        )}>
          <div className="min-h-fit w-full">
            {currentStep === 1 && (
              <BusinessInformation data={businessData} setData={setBusinessData} error={error} />
            )}
            
            {currentStep === 2 && (
              <ContactInformation
                data={contactData}
                setData={setContactData}
                expectedCode={verificationCode}
                onResendCode={dispatchVerificationCode}
                onBack={prevStep}
                onVerified={nextStep}
              />
            )}
            
            {currentStep === 3 && (
              <AuthCredentials data={authData} setData={setAuthData} error={error} />
            )}

            {currentStep === 4 && (
              <DocumentUpload data={documentData} setData={setDocumentData} onNext={nextStep} onBack={prevStep} />
            )}
            
            {currentStep === 5 && (
              <SubscriptionPackage data={subscriptionData} setData={setSubscriptionData} onNext={nextStep} onBack={prevStep} />
            )}

            {currentStep === 6 && (
              <FeatureConfig onFinish={handleFinalize} onBack={prevStep} />
            )}
          </div>

          {/* Action Buttons for Step 1 & 3 */}
          {(currentStep === 1 || currentStep === 3) && (
            <div className="flex flex-col mt-12 w-full items-center">
              {success && (
                <div className="flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded-lg mb-4 border border-green-100">
                  <CheckCircle2 className="w-4 h-4" />
                  <p className="text-sm font-medium">{success}</p>
                </div>
              )}

              {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
              
              <div className="flex flex-row gap-6 w-full justify-center"> 
                {currentStep === 3 && (
                  <Button 
                    variant="ghost" 
                    size="lg" 
                    className="h-13 px-8 border-neutral-200 text-neutral-500" 
                    onClick={prevStep}
                    disabled={loading}
                  >
                    <ArrowLeft className="w-5 h-5 mr-1" />
                    Back
                  </Button>
                )}
                <Button 
                  variant="primary" 
                  size="lg" 
                  className={cn(
                    "h-13 b2 font-bold text-lg shadow-xl shadow-orange-200/50 text-[var(--color-text-tertiary)]",
                    currentStep === 3 ? "flex-1 max-w-[300px]" : "w-full"
                  )} 
                  onClick={nextStep}
                  disabled={loading}
                >
                  {loading && currentStep === 1 ? "Sending Code..." : "Continue"}
                  {!loading && <ArrowRight className="w-5 h-5 ml-2" />}
                </Button>
              </div>
            </div>
          )}
          {currentStep === 6 && error && <p className="text-red-500 text-sm mt-4 text-center">{error}</p>}
        </div>
      </div>
    </div>
    <Footer />
    {showSuccessModal && (
      <RegistrationSuccessModal
        businessName={registrationData.businessName}
        businessEmail={registrationData.businessEmail}
        onClose={handleModalClose}
      />
    )}
    </main>
  );
}