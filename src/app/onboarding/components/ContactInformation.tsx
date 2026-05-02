"use client";

import React, { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Clock, Mail, ShieldCheck } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { cn } from "@/lib/utils";
import type { SubscriptionPlan } from "@/types/tenant";

interface FinalOTPVerificationProps {
  businessName: string;
  selectedPlan: SubscriptionPlan;
  expectedCode: string;
  onResendCode: () => Promise<string>;
  onVerified: () => Promise<void> | void;
  onChangeEmail: () => void;
}

const getPlanLabel = (plan: SubscriptionPlan) => {
  if (plan === "enterprise") return "Enterprise";
  if (plan === "business") return "Business";
  return "Basic";
};

export function FinalOTPVerification({
  businessName,
  selectedPlan,
  expectedCode,
  onResendCode,
  onVerified,
  onChangeEmail,
}: FinalOTPVerificationProps) {
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const [timeLeft, setTimeLeft] = useState(60);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [localError, setLocalError] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [isResending, setIsResending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const otpInputs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isTimerRunning && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (timeLeft === 0) {
      setIsTimerRunning(false);
    }

    return () => clearInterval(interval);
  }, [isTimerRunning, timeLeft]);

  const isOtpComplete = otp.every((digit) => digit !== "");
  const enteredCode = otp.join("");

  const handleVerify = async () => {
    setLocalError("");
    setStatusMessage("");

    if (!expectedCode) {
      setLocalError("Verification code not received. Please resend it.");
      return;
    }

    if (enteredCode !== expectedCode) {
      setLocalError("The verification code does not match.");
      return;
    }

    setIsVerifying(true);

    try {
      await onVerified();
    } catch (error) {
      setLocalError("We couldn't complete registration. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    if (timeLeft !== 0) {
      return;
    }

    setLocalError("");
    setStatusMessage("");
    setIsResending(true);

    try {
      const newCode = await onResendCode();
      setOtp(["", "", "", "", "", ""]);
      setTimeLeft(60);
      setIsTimerRunning(true);

      if (!newCode) {
        setLocalError("Unable to resend the verification code.");
        return;
      }

      setStatusMessage("A new verification code has been sent.");
      window.setTimeout(() => setStatusMessage(""), 5000);
      otpInputs.current[0]?.focus();
    } catch {
      setLocalError("Unable to resend the verification code.");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="flex flex-col w-full max-w-[760px] mx-auto space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
      <div className="flex flex-col lg:flex-row gap-4 lg:items-stretch">
        <div className="flex-1 rounded-[28px] border border-neutral-100 bg-white p-6 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--color-brand-primary)]/10 text-[var(--color-brand-primary)] shrink-0">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--color-brand-primary)]">
                Final Review
              </p>
              <h2 className="mt-1 text-2xl font-bold text-[var(--color-text-primary)]">
                Verify the email to complete registration
              </h2>
              <p className="mt-2 text-sm text-[var(--color-text-secondary)] leading-relaxed max-w-xl">
                Confirm the contact email one last time before your account is marked as pending review.
              </p>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-[280px] rounded-[28px] border border-neutral-100 bg-[var(--color-bg-secondary)] p-6 shadow-sm">
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-neutral-400">
            Summary
          </p>
          <div className="mt-4 space-y-3 text-sm">
            <div>
              <p className="text-neutral-400">Business Name</p>
              <p className="font-semibold text-[var(--color-text-primary)]">{businessName || "-"}</p>
            </div>
            <div>
              <p className="text-neutral-400">Plan</p>
              <p className="font-semibold text-[var(--color-text-primary)]">{getPlanLabel(selectedPlan)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-[32px] border border-neutral-100 bg-white p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-brand-primary)]/10 text-[var(--color-brand-primary)]">
                <Mail className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[var(--color-text-primary)]">
                  OTP Verification
                </p>
                <p className="text-xs text-[var(--color-text-secondary)]">
                  Enter the 6-digit code sent to the business email.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 b2 font-bold text-text-primary text-base">
                <Clock
                  size={18}
                  className={
                    timeLeft > 0
                      ? "text-[var(--color-brand-primary)]"
                      : "text-neutral-400"
                  }
                />
                <span>00 : {timeLeft.toString().padStart(2, "0")}</span>
              </div>
              <button
                type="button"
                onClick={handleResend}
                className={cn(
                  "b2 border-b-2 font-bold transition-all",
                  timeLeft === 0 && !isResending
                    ? "text-[var(--color-brand-primary)] border-[var(--color-brand-primary)] cursor-pointer"
                    : "text-neutral-300 border-transparent cursor-not-allowed",
                )}
                disabled={timeLeft !== 0 || isResending}
              >
                {isResending ? "Resending..." : "Resend Code"}
              </button>
            </div>
          </div>

          {statusMessage && (
            <p className="text-sm text-green-700 text-center bg-green-50 border border-green-100 rounded-xl px-4 py-3">
              {statusMessage}
            </p>
          )}

          {localError && (
            <p className="text-sm text-red-500 text-center">{localError}</p>
          )}

          <div className="flex gap-3 sm:gap-4 justify-center">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {
                  otpInputs.current[index] = el;
                }}
                type="text"
                maxLength={1}
                inputMode="numeric"
                value={digit}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, "");
                  const nextOtp = [...otp];
                  nextOtp[index] = val;
                  setOtp(nextOtp);
                  if (val && index < 5) {
                    otpInputs.current[index + 1]?.focus();
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === "Backspace" && !digit && index > 0) {
                    otpInputs.current[index - 1]?.focus();
                  }
                }}
                className={cn(
                  "w-12 h-12 sm:w-14 sm:h-14 bg-transparent border-b-2 text-center text-2xl outline-none transition-all duration-300",
                  digit !== "" || (index === 0 && otp[0] === "")
                    ? "border-[var(--color-brand-primary)]"
                    : "border-slate-200",
                )}
              />
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full justify-center pt-2">
            <Button
              variant="ghost"
              size="lg"
              className="h-13 lg:h-13 px-5 b2 border-neutral-200 text-neutral-500 transition-all"
              onClick={onChangeEmail}
            >
              <ArrowLeft className="w-5 h-5 mr-1" />
              Change Email
            </Button>
            <Button
              variant="primary"
              size="lg"
              className={cn(
                "flex-1 h-13 lg:h-13 b2 transition-all duration-500 shadow-none border-none max-w-[480px] font-bold text-lg",
                isOtpComplete && !isVerifying
                  ? "bg-[var(--color-brand-secondary)] text-text-tertiary scale-[1.02]"
                  : "bg-neutral-300 text-white cursor-not-allowed",
              )}
              disabled={!isOtpComplete || isVerifying}
              onClick={handleVerify}
            >
              {isVerifying ? "Completing..." : "Complete Registration"}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
