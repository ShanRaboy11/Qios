"use client";

import React, { useState, useRef, useEffect } from "react";
import { Clock, ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { cn } from "@/lib/utils";

interface ContactInformationProps {
  expectedCode: string;
  onResendCode: () => Promise<string>;
  onVerified: () => Promise<void> | void;
  onBack: () => void;
}

export function ContactInformation({
  expectedCode,
  onResendCode,
  onVerified,
  onBack,
}: ContactInformationProps) {
  // Timer starts immediately as the code is sent during the transition from Step 1
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const [timeLeft, setTimeLeft] = useState(45);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [localError, setLocalError] = useState("");
  const otpInputs = useRef<(HTMLInputElement | null)[]>([]);
  const hasAutoVerifiedRef = useRef(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (timeLeft === 0) setIsTimerRunning(false);
    return () => clearInterval(interval);
  }, [isTimerRunning, timeLeft]);

  const isOtpComplete = otp.every((digit) => digit !== "");
  const enteredCode = otp.join("");

  useEffect(() => {
    hasAutoVerifiedRef.current = false;
  }, [expectedCode]);

  useEffect(() => {
    if (!isOtpComplete || !expectedCode) {
      return;
    }

    if (enteredCode === expectedCode && !hasAutoVerifiedRef.current) {
      hasAutoVerifiedRef.current = true;
      void handleVerify();
    }
  }, [enteredCode, expectedCode, isOtpComplete]);

  const handleVerify = async () => {
    setLocalError("");

    if (!expectedCode) {
      setLocalError(
        "Verification code not received. Please go back and try again.",
      );
      return;
    }

    if (enteredCode !== expectedCode) {
      setLocalError("The verification code does not match.");
      return;
    }

    await onVerified();
  };

  const handleResend = async () => {
    if (timeLeft !== 0) {
      return;
    }

    setLocalError("");
    const newCode = await onResendCode();
    setOtp(["", "", "", "", "", ""]);
    setTimeLeft(45);
    setIsTimerRunning(true);

    if (!newCode) {
      setLocalError("Unable to resend the verification code.");
    }
  };

  return (
    /* items-center centers the content horizontally */
    <div className="flex flex-col items-center w-full space-y-10 animate-in fade-in slide-in-from-right-8 duration-500 ">
      {/* Timer and OTP */}
      <div className="flex flex-col items-center w-full max-w-[550px] space-y-12 pt-4">
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-2 b2 font-bold text-text-primary text-xl">
            <Clock
              size={20}
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
              timeLeft === 0
                ? "text-[var(--color-brand-primary)] border-[var(--color-brand-primary)] cursor-pointer"
                : "text-neutral-300 border-transparent cursor-not-allowed",
            )}
          >
            Resend Code
          </button>
        </div>

        {localError && (
          <p className="text-sm text-red-500 text-center">{localError}</p>
        )}

        {/* Verification code is not displayed in any environment for security. */}

        {/* OTP Inputs */}
        <div className="flex gap-4 justify-center">
          {otp.map((digit, i) => (
            <input
              key={i}
              ref={(el) => {
                otpInputs.current[i] = el;
              }}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, "");
                const newOtp = [...otp];
                newOtp[i] = val;
                setOtp(newOtp);
                if (val && i < 5) otpInputs.current[i + 1]?.focus();
              }}
              onKeyDown={(e) => {
                if (e.key === "Backspace" && !digit && i > 0) {
                  otpInputs.current[i - 1]?.focus();
                }
              }}
              className={cn(
                "w-10 h-10 bg-transparent border-b-2 text-center text-2xl outline-none transition-all duration-300",
                digit !== "" || (i === 0 && otp[0] === "")
                  ? "border-[var(--color-brand-primary)]"
                  : "border-slate-200",
              )}
            />
          ))}
        </div>

        <div className="flex flex-row gap-10 w-full justify-center">
          <Button
            variant="ghost"
            size="lg"
            className="h-13 lg:h-13 px-5 b2 border-neutral-200 text-neutral-500 transition-all"
            onClick={onBack}
          >
            <ArrowLeft className="w-5 h-5 mr-1" />
            Back
          </Button>
          <Button
            variant="primary"
            size="lg"
            className={cn(
              "flex-1 h-13 lg:h-13 b2 transition-all duration-500 shadow-none border-none max-w-[480px] font-bold text-lg",
              isOtpComplete
                ? "bg-[var(--color-brand-secondary)] text-text-tertiary scale-[1.02]"
                : "bg-neutral-300 text-white cursor-not-allowed",
            )}
            onClick={handleVerify}
          >
            Continue
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}
