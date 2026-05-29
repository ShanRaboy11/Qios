"use client";

import React, { useEffect, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { FormField } from "@/components/molecules/FormField";
import { Required } from "./BusinessInformation";
import { CheckCircle2, Circle } from "lucide-react";

type AuthCredentialsProps = {
  data: {
    email: string;
    password: string;
    confirm: string;
    acceptedLegal: boolean;
  };
  setData: React.Dispatch<
    React.SetStateAction<{
      email: string;
      password: string;
      confirm: string;
      acceptedLegal: boolean;
    }>
  >;
  onAutoResume?: (email: string) => Promise<void> | void;
  emailError?: string;
};

const PasswordRequirement = ({
  met,
  text,
}: {
  met: boolean;
  text: string;
}) => (
  <div className="flex items-center gap-2">
    {met ? (
      <CheckCircle2 size={16} className="text-success-primary flex-shrink-0" />
    ) : (
      <Circle size={16} className="text-text-secondary/30 flex-shrink-0" />
    )}
    <span
      className={`b4 transition-colors ${
        met ? "text-text-primary font-medium" : "text-text-secondary/60"
      }`}
    >
      {text}
    </span>
  </div>
);

export function AuthCredentials({
  data,
  setData,
  onAutoResume,
  emailError,
}: AuthCredentialsProps) {
  useEffect(() => {
    let isActive = true;

    const restoreSession = async () => {
      // auto-resume disabled: onboarding should always start fresh.
      // do not auto-call `onAutoResume` from this component.
    };

    void restoreSession();

    return () => {
      isActive = false;
    };
  }, [onAutoResume]);

  // validate password strength
  const hasMinLength = data.password.length >= 8;
  const hasUppercase = /[A-Z]/.test(data.password);
  const hasLowercase = /[a-z]/.test(data.password);
  const hasDigit = /[0-9]/.test(data.password);
  const hasSpecial = /[^A-Za-z0-9]/.test(data.password);
  const isPasswordStrong =
    hasMinLength &&
    hasUppercase &&
    hasLowercase &&
    hasDigit &&
    hasSpecial;
  const passwordsMatch = data.password === data.confirm;

  return (
    <div className="w-full max-w-[450px] space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
      <FormField
        label={
          <>
            Admin Email <Required />
          </>
        }
        type="email"
        placeholder="Admin Email"
        value={data.email}
        onChange={(e) => setData({ ...data, email: e.target.value })}
        className="w-full max-w-none"
        isError={!!emailError}
        supportiveText={emailError || undefined}
      />

      <div className="space-y-4">
        <FormField
          label={
            <>
              Admin Password <Required />
            </>
          }
          type="password"
          placeholder="Admin Password"
          value={data.password}
          onChange={(e) => setData({ ...data, password: e.target.value })}
          className="w-full max-w-none"
          isError={data.password.length > 0 && !isPasswordStrong}
        />

        {data.password && (
          <div className="bg-brand-secondary/5 border border-brand-primary/20 rounded-xl p-4 space-y-3">
            <p className="b4 font-bold text-text-primary uppercase tracking-wider">
              password requirements
            </p>
            <div className="space-y-2">
              <PasswordRequirement
                met={hasMinLength}
                text="At least 8 characters"
              />
              <PasswordRequirement
                met={hasUppercase}
                text="At least one uppercase letter"
              />
              <PasswordRequirement
                met={hasLowercase}
                text="At least one lowercase letter"
              />
              <PasswordRequirement
                met={hasDigit}
                text="At least one digit (0-9)"
              />
              <PasswordRequirement
                met={hasSpecial}
                text="At least one special character (!@#$%^&*)"
              />
            </div>
          </div>
        )}
      </div>

      <FormField
        label={
          <>
            Confirm Password <Required />
          </>
        }
        type="password"
        placeholder="Confirm Password"
        value={data.confirm}
        onChange={(e) => setData({ ...data, confirm: e.target.value })}
        className="w-full max-w-none"
        isError={data.confirm.length > 0 && !passwordsMatch}
        supportiveText={
          data.confirm.length > 0 && !passwordsMatch
            ? "Passwords do not match."
            : undefined
        }
      />

      <div className="flex items-start gap-3 mt-4">
        <div className="flex items-center h-5 mt-1">
          <input
            id="legal-consent"
            type="checkbox"
            className="w-5 h-5 rounded border-black/20 text-brand-primary focus:ring-brand-primary/50 transition-colors cursor-pointer"
            checked={data.acceptedLegal}
            onChange={(e) => setData({ ...data, acceptedLegal: e.target.checked })}
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="legal-consent" className="b2 text-text-primary font-medium cursor-pointer">
            I agree to the Terms and Privacy Policy <Required />
          </label>
          <p className="b4 text-text-secondary">
            By creating an account, you agree to our <a href="/legal/terms-of-service" target="_blank" className="text-brand-accent hover:underline">Terms of Service</a> and <a href="/legal/privacy-policy" target="_blank" className="text-brand-accent hover:underline">Privacy Policy</a>.
          </p>
        </div>
      </div>
    </div>
  );
}
