"use client";
import React, { useState } from "react";
import {
  FileText,
  Contact,
  ShoppingBag,
  Component,
  IdCard,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  FileCheck,
} from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { cn } from "@/lib/utils";

import { OnboardingSidebar } from "./components/Sidebar";
import { BusinessInformation } from "./components/BusinessInformation";
import { DocumentUpload } from "./components/DocumentUpload";
import { ContactInformation } from "./components/ContactInformation";
import { AuthCredentials } from "./components/AuthCredentials";
import { SubscriptionPackage } from "./components/SubscriptionPackage";
import { OperationalSetup } from "./components/OperationalSetup";
import { RegistrationSuccessModal } from "./components/RegistrationSuccessModal";
import { Navbar } from "@/components/organisms/navbar";
import { Footer } from "@/components/organisms/footer";
import { processOnboarding, sendContactVerificationCode } from "./actions";
import { useRouter } from "next/navigation";
import type { OperationalSetupConfig, SubscriptionPlan } from "@/types/tenant";

const steps = [
  { id: 1, title: "Business Information", icon: FileText },
  { id: 2, title: "Contact Verification", icon: Contact },
  { id: 3, title: "Authentication Credentials", icon: IdCard },
  { id: 4, title: "Document Requirements", icon: FileCheck },
  { id: 5, title: "Subscription Package", icon: ShoppingBag },
  { id: 6, title: "Operational Strategy", icon: Component },
];

// Mobile step progress bar
function MobileStepBar({
  currentStep,
  totalSteps,
}: {
  currentStep: number;
  totalSteps: number;
}) {
  const step = steps.find((s) => s.id === currentStep);
  const StepIcon = step?.icon;
  const progress = Math.round((currentStep / totalSteps) * 100);

  return (
    <div className="lg:hidden sticky top-[72px] z-20 bg-white border-b border-neutral-100 px-4 py-3 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {StepIcon && (
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--color-brand-primary)]/10">
              <StepIcon className="h-3.5 w-3.5 text-[var(--color-brand-primary)]" />
            </div>
          )}
          <span className="text-sm font-semibold text-[var(--color-text-primary)]">
            {step?.title}
          </span>
        </div>
        <span className="text-xs font-medium text-[var(--color-text-secondary)]">
          {currentStep} of {totalSteps}
        </span>
      </div>
      {/* Progress bar */}
      <div className="h-1.5 w-full rounded-full bg-neutral-100 overflow-hidden">
        <div
          className="h-full rounded-full bg-[var(--color-brand-primary)] transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [businessData, setBusinessData] = useState({
    name: "",
    email: "",
    owner: "",
  });
  const [contactData, setContactData] = useState({ phoneNumber: "" });
  const [authData, setAuthData] = useState({
    email: "",
    password: "",
    confirm: "",
  });
  const [subscriptionData, setSubscriptionData] = useState({
    packageId: "starter",
  });
  const [documentData, setDocumentData] = useState<Record<string, File>>({});
  const [verificationCode, setVerificationCode] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [registrationData, setRegistrationData] = useState({
    businessName: "",
    businessEmail: "",
  });

  const validateEmail = (email: string) => /\S+@\S+\.\S+/.test(email);

  const getSelectedPlan = (packageId: string): SubscriptionPlan => {
    if (packageId === "basic" || packageId === "starter") return "basic";
    if (packageId === "business" || packageId === "growth") return "business";
    if (packageId === "enterprise" || packageId === "enterprises")
      return "enterprise";
    return "basic";
  };

  const dispatchVerificationCode = async () => {
    const res = await sendContactVerificationCode({
      email: businessData.email,
      businessName: businessData.name,
    });
    setVerificationCode(res.verificationCode);
    return res.verificationCode;
  };

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const nextStep = async () => {
    setError("");
    setSuccess("");

    if (currentStep === 1) {
      if (!businessData.name.trim())
        return setError("Business name is required.");
      if (!validateEmail(businessData.email))
        return setError("A valid business email is required.");
      if (!businessData.owner?.trim())
        return setError("Owner / admin name is required.");

      setLoading(true);
      try {
        await dispatchVerificationCode();
        setSuccess(`Verification code sent to ${businessData.email}`);
        setCurrentStep(2);
        scrollToTop();
      } catch (err: any) {
        setError(err.message || "Unable to send verification code.");
      } finally {
        setLoading(false);
      }
      return;
    }

    if (currentStep === 3) {
      if (!validateEmail(authData.email))
        return setError("A valid admin email is required.");
      if (authData.password.length < 8)
        return setError("Password must be at least 8 characters.");
      if (authData.password !== authData.confirm)
        return setError("Passwords do not match.");
    }

    setCurrentStep((prev) => Math.min(prev + 1, steps.length));
    scrollToTop();
  };

  const prevStep = () => {
    setError("");
    setSuccess("");
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    scrollToTop();
  };

  const handleFinalize = async (featureData: OperationalSetupConfig) => {
    setLoading(true);
    setError("");
    try {
      const res = await processOnboarding({
        businessData,
        authData,
        subscriptionData,
        featureData,
        documentData,
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

  // Determine content width per step
  const contentMaxWidth = cn(
    currentStep === 6
      ? "max-w-[960px]"
      : currentStep === 4 || currentStep === 5
        ? "max-w-xl"
        : "max-w-[420px]",
  );

  // Whether to show the generic continue/back buttons
  const showDefaultActions = currentStep === 1 || currentStep === 3;

  return (
    <main className="flex flex-col min-h-screen bg-[var(--color-bg-primary)] w-full overflow-x-hidden">
      <Navbar variant="transparent" />

      {/* pt-[72px] offsets the fixed/sticky navbar so content is never hidden beneath it */}
      <div className="flex flex-1 flex-col lg:flex-row pt-[72px]">
        {/* Sidebar — visible on desktop only */}
        <OnboardingSidebar steps={steps} currentStep={currentStep} />

        {/* Mobile progress bar */}
        <MobileStepBar currentStep={currentStep} totalSteps={steps.length} />

        {/* ── MAIN CONTENT ── */}
        <div
          className={cn(
            "flex-1 flex flex-col items-center px-4 sm:px-6 md:px-10 lg:px-12 xl:px-24",
            currentStep <= 3
              ? "justify-center min-h-[calc(100vh-72px)]"
              : "justify-start pt-12 pb-20",
          )}
        >
          {/* Step title */}
          <div className="w-full mb-8 text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-[var(--color-text-primary)]">
              {steps.find((s) => s.id === currentStep)?.title}
            </h1>
          </div>

          {/* Content wrapper */}
          <div className={cn("w-full mx-auto", contentMaxWidth)}>
            {currentStep === 1 && (
              <BusinessInformation
                data={businessData}
                setData={setBusinessData}
                error={error}
              />
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
              <AuthCredentials
                data={authData}
                setData={setAuthData}
                error={error}
              />
            )}

            {currentStep === 4 && (
              <DocumentUpload
                data={documentData}
                setData={setDocumentData}
                onNext={nextStep}
                onBack={prevStep}
              />
            )}

            {currentStep === 5 && (
              <SubscriptionPackage
                data={subscriptionData}
                setData={setSubscriptionData}
                onNext={nextStep}
                onBack={prevStep}
              />
            )}

            {currentStep === 6 && (
              <OperationalSetup
                selectedPlan={getSelectedPlan(subscriptionData.packageId)}
                onFinish={handleFinalize}
                onBack={prevStep}
                loading={loading}
              />
            )}

            {/* Action buttons for steps 1 & 3 */}
            {showDefaultActions && (
              <div className="mt-8 flex flex-col items-center w-full">
                {success && (
                  <div className="flex items-center gap-2 w-full text-green-700 bg-green-50 border border-green-100 rounded-xl px-4 py-3 mb-4">
                    <CheckCircle2 className="h-4 w-4 shrink-0" />
                    <p className="text-sm font-medium">{success}</p>
                  </div>
                )}
                {error && (
                  <p className="w-full text-sm text-red-500 bg-red-50 border border-red-100 rounded-xl px-4 py-3 mb-4 text-center">
                    {error}
                  </p>
                )}
                <div className="flex flex-row gap-3 w-full">
                  {currentStep === 3 && (
                    <Button
                      variant="ghost"
                      size="lg"
                      className="h-12 shrink-0 border-neutral-200 px-4 text-sm text-neutral-500"
                      onClick={prevStep}
                      disabled={loading}
                    >
                      <ArrowLeft className="h-4 w-4 mr-1.5" />
                      Back
                    </Button>
                  )}
                  <Button
                    variant="primary"
                    size="lg"
                    className="h-12 flex-1 text-sm font-bold shadow-lg shadow-orange-200/40"
                    onClick={nextStep}
                    disabled={loading}
                  >
                    {loading && currentStep === 1
                      ? "Sending Code…"
                      : "Continue"}
                    {!loading && <ArrowRight className="h-4 w-4 ml-1.5" />}
                  </Button>
                </div>
              </div>
            )}

            {currentStep === 6 && error && (
              <p className="mt-4 text-sm text-red-500 text-center">{error}</p>
            )}
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
