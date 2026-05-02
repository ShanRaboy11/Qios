"use client";
import React, { useState } from "react";
import {
  Building2,
  FileText,
  ShoppingBag,
  Component,
  IdCard,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  FileCheck,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { cn } from "@/lib/utils";

import { OnboardingSidebar } from "./components/Sidebar";
import { BusinessInformation } from "./components/BusinessInformation";
import { DocumentUpload } from "./components/DocumentUpload";
import { AuthCredentials } from "./components/AuthCredentials";
import { SubscriptionPackage } from "./components/SubscriptionPackage";
import { OperationalSetup } from "./components/OperationalSetup";
import { FinalOTPVerification } from "./components/ContactInformation";
import { RegistrationSuccessModal } from "./components/RegistrationSuccessModal";
import { Navbar } from "@/components/organisms/navbar";
import { Footer } from "@/components/organisms/footer";
import {
  processOnboarding,
  resolveOnboardingAccess,
  saveDocumentUploads,
  saveOnboardingProgress,
  sendContactVerificationCode,
} from "./actions";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import type { OperationalSetupConfig, SubscriptionPlan } from "@/types/tenant";

const steps = [
  { id: 1, title: "Auth Credentials", icon: IdCard },
  { id: 2, title: "Business Information", icon: Building2 },
  { id: 3, title: "Document Requirements", icon: FileCheck },
  { id: 4, title: "Subscription Package", icon: ShoppingBag },
  { id: 5, title: "Operational Strategy", icon: Component },
  { id: 6, title: "Final Review & OTP Verification", icon: ShieldCheck },
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
  const [tenantId, setTenantId] = useState("");
  const [userId, setUserId] = useState("");
  const [operationalData, setOperationalData] = useState<OperationalSetupConfig>({
    inventoryMode: "unit",
    serviceWorkflow: "pickup",
    dashboardFocus: "revenue",
    supplyLogic: "local",
  });

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

  const dispatchVerificationCode = async ({
    email = businessData.email || authData.email,
    businessName = businessData.name || businessData.email || authData.email,
  }: {
    email?: string;
    businessName?: string;
  } = {}) => {
    const res = await sendContactVerificationCode({
      email,
      businessName,
    });
    setVerificationCode(res.verificationCode);
    return res.verificationCode;
  };

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const handleAuthContinue = async () => {
    setError("");
    setSuccess("");

    if (!validateEmail(authData.email)) {
      return setError("A valid admin email is required.");
    }
    if (authData.password.length < 8) {
      return setError("Password must be at least 8 characters.");
    }
    if (authData.password !== authData.confirm) {
      return setError("Passwords do not match.");
    }

    setLoading(true);
    try {
      const supabase = createSupabaseBrowserClient();
      const access = await resolveOnboardingAccess({ email: authData.email });

      if (access.status === "resume-onboarding") {
        setUserId(access.userId || "");
        setTenantId(access.tenantId || "");
        setBusinessData((prev) => ({
          ...prev,
          name: prev.name || access.businessName || "",
          email: prev.email || access.businessEmail || authData.email,
          owner: prev.owner || access.ownerName || "",
        }));
        if (access.subscriptionPlan) {
          setSubscriptionData({ packageId: access.subscriptionPlan });
        }
        await dispatchVerificationCode({
          email: authData.email,
          businessName: access.businessName || authData.email,
        });
        setCurrentStep(2);
        setBusinessData((prev) => ({ ...prev, email: prev.email || authData.email }));
        scrollToTop();
        return;
      }

      if (access.status === "completed") {
        setError("This email is already registered.");
        return;
      }

      const { data, error: signUpError } = await supabase.auth.signUp({
        email: authData.email,
        password: authData.password,
        options: {
          data: {
            full_name: businessData.name || authData.email,
            business_email: businessData.email || authData.email,
          },
        },
      });

      if (signUpError) {
        throw new Error(signUpError.message || "Failed to create account. Please try again.");
      }

      const signedUpUserId = data.user?.id;
      if (!signedUpUserId) {
        throw new Error("Account created but no user ID was returned. Please contact support.");
      }

      setUserId(signedUpUserId);
      await dispatchVerificationCode({
        email: authData.email,
        businessName: businessData.name || authData.email,
      });

      setCurrentStep(2);
      setBusinessData((prev) => ({ ...prev, email: prev.email || authData.email }));
      scrollToTop();
    } catch (err: any) {
      setError(err.message || "An error occurred during signup. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleBusinessContinue = async () => {
    setError("");
    setSuccess("");

    if (!businessData.name.trim()) {
      return setError("Business name is required.");
    }

    if (!validateEmail(businessData.email)) {
      return setError("A valid business email is required.");
    }

    if (!businessData.owner?.trim()) {
      return setError("Owner / admin name is required.");
    }

    setLoading(true);
    try {
      const res = await saveOnboardingProgress({
        tenantId: tenantId || undefined,
        businessData,
      });

      setTenantId(res.tenantId);
      setSuccess("Business information saved.");
      setCurrentStep(3);
      scrollToTop();
    } catch (err: any) {
      setError(err.message || "Unable to save business information.");
    } finally {
      setLoading(false);
    }
  };

  const handleDocumentContinue = async () => {
    setError("");
    setSuccess("");

    if (!tenantId) {
      return setError("Please save business information first.");
    }

    if (!userId) {
      return setError("Your account was not created successfully. Please go back and try signing up again.");
    }

    setLoading(true);
    try {
      // Convert File objects to base64 strings for server action serialization
      const filesData: Record<string, { name: string; base64: string; type: string }> = {};
      for (const [key, file] of Object.entries(documentData)) {
        const reader = new FileReader();
        const base64 = await new Promise<string>((resolve) => {
          reader.onload = () => {
            const result = reader.result as string;
            resolve(result.split(",")[1]); // Extract base64 part
          };
          reader.readAsDataURL(file);
        });
        filesData[key] = { name: file.name, base64, type: file.type };
      }

      const res = await saveDocumentUploads({
        tenantId,
        filesData,
      });

      if (res.success) {
        setSuccess("Documents uploaded and saved.");
        setCurrentStep(4);
        scrollToTop();
      }
    } catch (err: any) {
      setError(err.message || "Unable to upload documents.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubscriptionContinue = async () => {
    setError("");
    setSuccess("");

    if (!tenantId) {
      return setError("Please save business information first.");
    }

    setLoading(true);
    try {
      const res = await saveOnboardingProgress({
        tenantId,
        businessData,
        subscriptionData,
      });

      setTenantId(res.tenantId);
      setSuccess("Subscription package saved.");
      setCurrentStep(5);
      scrollToTop();
    } catch (err: any) {
      setError(err.message || "Unable to save subscription package.");
    } finally {
      setLoading(false);
    }
  };

  const handleOperationalContinue = async (featureData: OperationalSetupConfig) => {
    setError("");
    setSuccess("");

    if (!tenantId) {
      return setError("Please save business information first.");
    }

    setLoading(true);
    try {
      setOperationalData(featureData);
      const res = await saveOnboardingProgress({
        tenantId,
        businessData,
        subscriptionData,
        featureData,
      });

      setTenantId(res.tenantId);
      setSuccess("Operational strategy saved.");
      setCurrentStep(6);
      scrollToTop();
    } catch (err: any) {
      setError(err.message || "Unable to save operational strategy.");
    } finally {
      setLoading(false);
    }
  };

  const handleFinalOtpVerified = async () => {
    setLoading(true);
    setError("");

    try {
      let finalTenantId = tenantId;
      let finalUserId = userId;

      if (!finalTenantId || !finalUserId) {
        const access = await resolveOnboardingAccess({
          email: businessData.email || authData.email,
        });

        if (access.status === "resume-onboarding" || access.status === "completed") {
          finalTenantId = finalTenantId || access.tenantId || "";
          finalUserId = finalUserId || access.userId || "";
          // Populate missing data from resolved access
          if (!businessData.name && access.businessName) {
            setBusinessData((prev) => ({
              ...prev,
              name: access.businessName || "",
              email: access.businessEmail || prev.email || authData.email,
              owner: access.ownerName || prev.owner || "",
            }));
          }
          if (!subscriptionData.packageId && access.subscriptionPlan) {
            setSubscriptionData({ packageId: access.subscriptionPlan });
          }
        }
      }

      if (!finalTenantId || !finalUserId) {
        throw new Error("Your registration session is incomplete. Please go back and continue again.");
      }

      const res = await processOnboarding({
        tenantId: finalTenantId,
        userId: finalUserId,
        businessData,
        authData,
        subscriptionData,
        featureData: operationalData,
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

  const handleChangeEmail = () => {
    setError("");
    setSuccess("");
    setVerificationCode("");
    setTenantId("");
    setUserId("");
    setCurrentStep(1);
    scrollToTop();
  };

  const prevStep = () => {
    setError("");
    setSuccess("");
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    scrollToTop();
  };

  const handleModalClose = () => {
    setShowSuccessModal(false);
    router.push("/");
  };

  // Determine content width per step
  const contentMaxWidth = cn(
    currentStep === 5
      ? "max-w-[960px]"
      : currentStep === 6
        ? "max-w-[860px]"
        : currentStep === 3
        ? "max-w-[1200px]"
        : currentStep === 4
        ? "max-w-xl"
        : "max-w-[450px]",
  );

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
            currentStep <= 2
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

          {(success || error) && currentStep <= 2 && (
            <div className="w-full max-w-[450px] mb-6 space-y-3">
              {success && (
                <div className="flex items-center gap-2 w-full text-green-700 bg-green-50 border border-green-100 rounded-xl px-4 py-3">
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  <p className="text-sm font-medium">{success}</p>
                </div>
              )}
              {error && (
                <p className="w-full text-sm text-red-500 bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-center">
                  {error}
                </p>
              )}
            </div>
          )}

          {/* Content wrapper */}
          <div className={cn("w-full mx-auto", contentMaxWidth)}>
            {currentStep === 1 && (
              <AuthCredentials
                data={authData}
                setData={setAuthData}
                error={error}
              />
            )}

            {currentStep === 1 && (
              <div className="mt-8 flex flex-col items-center w-full">
                <div className="flex flex-row gap-3 w-full">
                  <Button
                    variant="primary"
                    size="lg"
                    className="h-12 flex-1 text-sm font-bold shadow-lg shadow-orange-200/40"
                    onClick={handleAuthContinue}
                  >
                    Continue
                    <ArrowRight className="h-4 w-4 ml-1.5" />
                  </Button>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <BusinessInformation
                data={businessData}
                setData={setBusinessData}
                error={error}
              />
            )}

            {currentStep === 2 && (
              <div className="mt-8 flex flex-col items-center w-full">
                <div className="flex flex-row gap-3 w-full">
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
                  <Button
                    variant="primary"
                    size="lg"
                    className="h-12 flex-1 text-sm font-bold shadow-lg shadow-orange-200/40"
                    onClick={handleBusinessContinue}
                    disabled={loading}
                  >
                    {loading ? "Saving…" : "Continue"}
                    {!loading && <ArrowRight className="h-4 w-4 ml-1.5" />}
                  </Button>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <DocumentUpload
                data={documentData}
                setData={setDocumentData}
                onNext={handleDocumentContinue}
                onBack={prevStep}
                loading={loading}
              />
            )}

            {currentStep === 4 && (
              <SubscriptionPackage
                data={subscriptionData}
                setData={setSubscriptionData}
                onNext={handleSubscriptionContinue}
                onBack={prevStep}
              />
            )}

            {currentStep === 5 && (
              <OperationalSetup
                selectedPlan={getSelectedPlan(subscriptionData.packageId)}
                onFinish={handleOperationalContinue}
                onBack={prevStep}
                loading={loading}
              />
            )}

            {currentStep === 6 && (
              <FinalOTPVerification
                businessName={businessData.name}
                selectedPlan={getSelectedPlan(subscriptionData.packageId)}
                expectedCode={verificationCode}
                onResendCode={() =>
                  dispatchVerificationCode({
                    email: businessData.email || authData.email,
                    businessName: businessData.name || businessData.email || authData.email,
                  })
                }
                onVerified={handleFinalOtpVerified}
                onChangeEmail={handleChangeEmail}
              />
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
