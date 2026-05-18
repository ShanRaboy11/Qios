"use client";

import React, { useActionState, useEffect, useState, useRef } from "react";
import {
  CheckCircle2,
  Shield,
  Laptop,
  Smartphone,
  Eye,
  EyeOff,
  LogOut,
  Save,
  Edit2,
  Circle,
  SmartphoneNfc,
  Mail,
  Copy,
  Download,
  AlertTriangle,
  Trash2,
  KeyRound,
  Loader2,
  X,
  Check,
  ShieldAlert,
} from "lucide-react";
import QRCode from "react-qr-code";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
import { Toggle } from "@/components/atoms/Toggle";
import { Badge } from "@/components/atoms/Badge";
import { ActionConfirmationModal } from "@/components/molecules/ConfirmationModal";
import { SectionHeader } from "@/components/molecules/SectionHeader";
import { SessionCard } from "@/components/molecules/SessionCard";
import { cn } from "@/lib/utils";
import {
  revokeOtherTenantSessions,
  updateTenantPassword,
  setupAuthenticatorTwoFactor,
  verifyAndEnableAuthenticatorTwoFactor,
  setupEmailTwoFactor,
  verifyAndEnableEmailTwoFactor,
  disableTwoFactorAuth,
  generateRecoveryCodes,
} from "@/app/(tenant)/[id]/settings/actions";
import {
  emptySettingsActionState,
  type TenantSecuritySettingsData,
} from "@/app/(tenant)/[id]/settings/types";

interface TenantSecuritySettingsProps {
  tenantId: string;
  initialData: TenantSecuritySettingsData;
}

const passwordRequirements = (password: string) => ({
  hasMinLength: password.length >= 8,
  hasUppercase: /[A-Z]/.test(password),
  hasLowercase: /[a-z]/.test(password),
  hasDigit: /[0-9]/.test(password),
  hasSpecial: /[^A-Za-z0-9]/.test(password),
});

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
      className={cn(
        "b4 transition-colors",
        met ? "text-text-primary font-medium" : "text-text-secondary/60"
      )}
    >
      {text}
    </span>
  </div>
);

const getTimeAgo = (dateString?: string) => {
  if (!dateString) return "recently";
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInHours = diffInMs / (1000 * 60 * 60);
  const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
  
  if (diffInDays >= 1) return `${Math.floor(diffInDays)} days ago`;
  if (diffInHours >= 1) return `${Math.floor(diffInHours)} hrs ago`;
  const diffInMins = diffInMs / (1000 * 60);
  return `${Math.floor(diffInMins)} mins ago`;
};

const SixDigitInput = ({ value, onChange, disabled, isError, errorMessage }: { value: string, onChange: (val: string) => void, disabled?: boolean, isError?: boolean, errorMessage?: string }) => {
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9]/g, "");
    const newCode = [...value.padEnd(6, " ").split("")];
    if (!val) {
      newCode[index] = " ";
      onChange(newCode.join("").trimEnd());
      return;
    }
    newCode[index] = val[val.length - 1];
    onChange(newCode.join("").trimEnd());
    if (index < 5) inputs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && (!value[index] || value[index] === " ") && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/[^0-9]/g, "").slice(0, 6);
    if (pasted) {
      onChange(pasted);
      inputs.current[Math.min(pasted.length, 5)]?.focus();
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2 justify-center" onPaste={handlePaste}>
        {Array.from({ length: 6 }).map((_, i) => (
          <input
            key={i}
            ref={(el) => { inputs.current[i] = el; }}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={2}
            value={value[i] && value[i] !== " " ? value[i] : ""}
            disabled={disabled}
            onChange={(e) => handleChange(i, e)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            className={cn(
              "w-10 h-12 sm:w-12 sm:h-14 text-center text-xl font-bold rounded-xl border outline-none transition-all disabled:opacity-50",
              isError 
                ? "border-warning-primary focus:border-warning-primary focus:ring-2 focus:ring-warning-primary/20 text-warning-primary bg-warning-primary/5" 
                : "border-black/[0.08] focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 text-text-primary bg-white"
            )}
          />
        ))}
      </div>
      {isError && errorMessage && (
        <p className="text-sm text-warning-primary text-center animate-in fade-in slide-in-from-top-1">
          {errorMessage}
        </p>
      )}
    </div>
  );
};

export const TenantSecuritySettings = ({
  tenantId,
  initialData,
}: TenantSecuritySettingsProps) => {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [sessionNotice, setSessionNotice] = useState("");
  const [sessionError, setSessionError] = useState("");
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [loggingOutSessions, setLoggingOutSessions] = useState(false);
  const [passwordState, passwordAction, passwordPending] = useActionState(
    updateTenantPassword.bind(null, tenantId),
    emptySettingsActionState,
  );

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // 2FA Detailed State
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(initialData.twoFactorEnabled || false);
  const [hasAuthenticator, setHasAuthenticator] = useState(initialData.hasAuthenticator || false);
  const [hasEmail, setHasEmail] = useState(initialData.hasEmail || false);
  const [authenticatorUpdatedAt, setAuthenticatorUpdatedAt] = useState(initialData.authenticatorUpdatedAt);
  const [emailUpdatedAt, setEmailUpdatedAt] = useState(initialData.emailUpdatedAt);
  const [recoveryCodesGeneratedAt, setRecoveryCodesGeneratedAt] = useState(initialData.recoveryCodesGeneratedAt);
  const [showSetupOptions, setShowSetupOptions] = useState(initialData.twoFactorEnabled || false);

  const [isSetupModalOpen, setIsSetupModalOpen] = useState(false);
  const [setupStep, setSetupStep] = useState<"authenticator" | "email" | "recovery">("authenticator");
  const [setupSecret, setSetupSecret] = useState("");
  const [setupQrUrl, setSetupQrUrl] = useState("");
  const [setupVerificationCode, setSetupVerificationCode] = useState("");
  const [setupRecoveryCodes, setSetupRecoveryCodes] = useState<string[]>([]);
  const [setupLoading, setSetupLoading] = useState(false);
  const [setupError, setSetupError] = useState("");

  const [isDisableModalOpen, setIsDisableModalOpen] = useState(false);
  const [disableMethod, setDisableMethod] = useState<"all" | "authenticator" | "email">("all");
  const [disablePassword, setDisablePassword] = useState("");
  const [disableLoading, setDisableLoading] = useState(false);
  const [disableError, setDisableError] = useState("");

  const [isRegenerateModalOpen, setIsRegenerateModalOpen] = useState(false);
  const [regenerateLoading, setRegenerateLoading] = useState(false);

  useEffect(() => {
    if (passwordState.fieldErrors) {
      setFieldErrors(passwordState.fieldErrors);
    }
  }, [passwordState.fieldErrors]);

  useEffect(() => {
    if (passwordState.success) {
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setFieldErrors({});
    }
  }, [passwordState.success]);

  useEffect(() => {
    setTwoFactorEnabled(initialData.twoFactorEnabled || false);
    setHasAuthenticator(initialData.hasAuthenticator || false);
    setHasEmail(initialData.hasEmail || false);
    setAuthenticatorUpdatedAt(initialData.authenticatorUpdatedAt);
    setEmailUpdatedAt(initialData.emailUpdatedAt);
    setRecoveryCodesGeneratedAt(initialData.recoveryCodesGeneratedAt);
    if (initialData.twoFactorEnabled) setShowSetupOptions(true);
  }, [initialData]);

  const isPasswordDirty = currentPassword.length > 0 || newPassword.length > 0 || confirmPassword.length > 0;

  const requirements = passwordRequirements(newPassword);
  const isPasswordStrong =
    requirements.hasMinLength &&
    requirements.hasUppercase &&
    requirements.hasLowercase &&
    requirements.hasDigit &&
    requirements.hasSpecial;

  const handleLogoutOtherSessions = async () => {
    setSessionError("");
    setSessionNotice("");
    setLoggingOutSessions(true);

    try {
      await revokeOtherTenantSessions(tenantId);
      setSessionNotice("Other sessions were logged out successfully.");
      setIsLogoutModalOpen(false);
    } catch (error) {
      setSessionError(
        error instanceof Error
          ? error.message
          : "Unable to log out other sessions.",
      );
    } finally {
      setLoggingOutSessions(false);
    }
  };

  const handleMasterToggle = (val: boolean) => {
    if (val) {
      setShowSetupOptions(true);
    } else {
      setDisableMethod("all");
      setIsDisableModalOpen(true);
    }
  };

  const handleDisableSpecificMethod = (method: "authenticator" | "email") => {
    setDisableMethod(method);
    setIsDisableModalOpen(true);
  };

  const handleStartSetup = async (method: "authenticator" | "email") => {
    setSetupStep(method);
    setSetupError("");
    setSetupVerificationCode("");
    setSetupLoading(true);
    setIsSetupModalOpen(true);
    
    try {
      if (method === "authenticator") {
        const res = await setupAuthenticatorTwoFactor(tenantId);
        setSetupSecret(res.secret);
        setSetupQrUrl(res.otpauthUrl);
      } else {
        await setupEmailTwoFactor(tenantId);
      }
    } catch (err: any) {
      setSetupError(err.message || "Failed to initiate setup");
    } finally {
      setSetupLoading(false);
    }
  };

  const handleVerifySetup = async () => {
    if (setupVerificationCode.length < 6) {
      setSetupError("Please enter the complete 6-digit verification code.");
      return;
    }
    setSetupLoading(true);
    setSetupError("");
    try {
      let res;
      if (setupStep === "authenticator") {
        res = await verifyAndEnableAuthenticatorTwoFactor(tenantId, setupSecret, setupVerificationCode);
      } else {
        res = await verifyAndEnableEmailTwoFactor(tenantId, setupVerificationCode);
      }
      setSetupRecoveryCodes(res.recoveryCodes);
      setTwoFactorEnabled(true);
      setShowSetupOptions(true);
      if (setupStep === "authenticator") {
        setHasAuthenticator(true);
        setAuthenticatorUpdatedAt(new Date().toISOString());
      } else {
        setHasEmail(true);
        setEmailUpdatedAt(new Date().toISOString());
      }
      setRecoveryCodesGeneratedAt(new Date().toISOString());
      setSetupStep("recovery");
    } catch (err: any) {
      setSetupError(err.message || "Invalid verification code");
    } finally {
      setSetupLoading(false);
    }
  };

  const handleDisable2FA = async () => {
    if (!disablePassword) {
      setDisableError("Please enter your current password.");
      return;
    }
    setDisableLoading(true);
    setDisableError("");
    try {
      // In a real app we might pass disableMethod to disable only one,
      // but the current actions.ts clears everything.
      await disableTwoFactorAuth(tenantId, disablePassword);
      setTwoFactorEnabled(false);
      setShowSetupOptions(false);
      setHasAuthenticator(false);
      setHasEmail(false);
      setRecoveryCodesGeneratedAt(undefined);
      setIsDisableModalOpen(false);
      setDisablePassword("");
    } catch (err: any) {
      setDisableError(err.message || "Failed to disable 2FA");
    } finally {
      setDisableLoading(false);
    }
  };

  const handleRegenerateCodes = async () => {
    setRegenerateLoading(true);
    try {
      const res = await generateRecoveryCodes(tenantId);
      setSetupRecoveryCodes(res.recoveryCodes);
      setRecoveryCodesGeneratedAt(new Date().toISOString());
      setIsRegenerateModalOpen(false);
      setSetupStep("recovery");
      setIsSetupModalOpen(true);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setRegenerateLoading(false);
    }
  };

  const handleCopyCodes = () => {
    navigator.clipboard.writeText(setupRecoveryCodes.join("\n"));
  };

  const handleDownloadCodes = () => {
    const element = document.createElement("a");
    const file = new Blob([setupRecoveryCodes.join("\n")], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "qios-recovery-codes.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 w-full">
        <div>
          <h2 className="text-xl font-bold text-text-primary mb-1">
            Security Settings
          </h2>
          <p className="text-sm text-text-secondary">
            Protect your account and manage active sessions.
          </p>
        </div>

        <div className="space-y-6">
          <div className="space-y-4">
            <SectionHeader
              title="Password Management"
              className="mb-0 py-2 border-gray-100"
            />
            <form
              action={passwordAction}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2"
            >
              {passwordState.success && (
                <div className="sm:col-span-2 space-y-3">
                  <div className="flex items-center gap-2 w-full text-green-700 bg-green-50 border border-green-100 rounded-xl px-4 py-3">
                    <CheckCircle2 className="h-4 w-4 shrink-0" />
                    <p className="text-sm font-medium">{passwordState.success}</p>
                  </div>
                </div>
              )}
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-sm font-medium text-text-primary">
                  Current Password {isPasswordDirty && <span className="text-brand-accent">*</span>}
                </label>
                <div className="relative">
                  <Input
                    name="currentPassword"
                    value={currentPassword}
                    onChange={(event) => {
                      setCurrentPassword(event.target.value);
                      setFieldErrors(prev => ({ ...prev, currentPassword: "" }));
                    }}
                    type={showCurrentPassword ? "text" : "password"}
                    placeholder="Current Password"
                    isError={!!fieldErrors.currentPassword}
                    className={cn(
                      "py-2.5 rounded-xl pr-10 focus:outline-none",
                      !fieldErrors.currentPassword && "focus:border-brand-primary focus:ring-brand-primary"
                    )}
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setShowCurrentPassword(!showCurrentPassword);
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-brand-accent transition-colors z-10 p-1"
                  >
                    {showCurrentPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
                {fieldErrors.currentPassword && (
                  <p className="text-xs text-red-500 pl-1">
                    {fieldErrors.currentPassword}
                  </p>
                )}
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-text-primary">
                  New Password {isPasswordDirty && <span className="text-brand-accent">*</span>}
                </label>
                <div className="relative">
                  <Input
                    name="newPassword"
                    value={newPassword}
                    onChange={(event) => {
                      setNewPassword(event.target.value);
                      setFieldErrors(prev => ({ ...prev, newPassword: "" }));
                    }}
                    type={showNewPassword ? "text" : "password"}
                    placeholder="New Password"
                    isError={
                      !!fieldErrors.newPassword ||
                      (newPassword.length > 0 && !isPasswordStrong)
                    }
                    className={cn(
                      "py-2.5 rounded-xl pr-10 focus:outline-none",
                      !(!!fieldErrors.newPassword || (newPassword.length > 0 && !isPasswordStrong)) && "focus:border-brand-primary focus:ring-brand-primary"
                    )}
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setShowNewPassword(!showNewPassword);
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-brand-accent transition-colors z-10 p-1"
                  >
                    {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {fieldErrors.newPassword && (
                  <p className="text-xs text-red-500 pl-1">
                    {fieldErrors.newPassword}
                  </p>
                )}
                {newPassword && (
                  <div className="bg-brand-secondary/5 border border-brand-primary/20 rounded-xl p-4 space-y-3">
                    <p className="b4 font-bold text-text-primary uppercase tracking-wider">
                      password requirements
                    </p>
                    <div className="space-y-2">
                      <PasswordRequirement met={requirements.hasMinLength} text="At least 8 characters" />
                      <PasswordRequirement met={requirements.hasUppercase} text="At least one uppercase letter" />
                      <PasswordRequirement met={requirements.hasLowercase} text="At least one lowercase letter" />
                      <PasswordRequirement met={requirements.hasDigit} text="At least one digit (0-9)" />
                      <PasswordRequirement met={requirements.hasSpecial} text="At least one special character (!@#$%^&*)" />
                    </div>
                  </div>
                )}
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-text-primary">
                  Confirm New Password {isPasswordDirty && <span className="text-brand-accent">*</span>}
                </label>
                <div className="relative">
                  <Input
                    name="confirmPassword"
                    value={confirmPassword}
                    onChange={(event) => {
                      setConfirmPassword(event.target.value);
                      setFieldErrors(prev => ({ ...prev, confirmPassword: "" }));
                    }}
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm Password"
                    isError={!!fieldErrors.confirmPassword}
                    className={cn(
                      "py-2.5 rounded-xl pr-10 focus:outline-none",
                      !fieldErrors.confirmPassword && "focus:border-brand-primary focus:ring-brand-primary"
                    )}
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setShowConfirmPassword(!showConfirmPassword);
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-brand-accent transition-colors z-10 p-1"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
                {fieldErrors.confirmPassword && (
                  <p className="text-xs text-red-500 pl-1">
                    {fieldErrors.confirmPassword}
                  </p>
                )}
              </div>
              <div className="sm:col-span-2 flex justify-end mt-2">
                <Button
                  type="submit"
                  variant="outline"
                  shape="rounded"
                  leftIcon={<Edit2 size={18} />}
                  loading={passwordPending}
                >
                  Update Password
                </Button>
              </div>
            </form>
          </div>

          <div className="space-y-4">
            <SectionHeader
              title="Two-Factor Authentication"
              className="mb-0 py-2 border-gray-100"
            />
            <div className="flex flex-col gap-4 mt-2">
              <div className="flex items-center justify-between gap-4 p-4 rounded-xl border border-transparent bg-white hover:bg-black/[0.02] transition-all duration-300">
                <div className="flex flex-col gap-0.5 select-none">
                  <span className={cn("b2 font-bold transition-colors duration-300", twoFactorEnabled || showSetupOptions ? "text-text-primary" : "text-text-primary/80")}>
                    Require 2FA for Login
                  </span>
                  <span className={cn("b4 transition-colors duration-300", twoFactorEnabled || showSetupOptions ? "text-text-secondary" : "text-text-secondary/90")}>
                    Add an extra layer of security to your account.
                  </span>
                </div>
                <Toggle 
                  isOn={twoFactorEnabled || showSetupOptions} 
                  onChange={handleMasterToggle} 
                  variant="accent"
                />
              </div>

              {(twoFactorEnabled || showSetupOptions) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col p-5 rounded-2xl border border-black/[0.05] bg-white transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary shrink-0">
                          <SmartphoneNfc className="w-6 h-6 text-brand-accent" />
                        </div>
                        <div className="flex flex-col gap-0.5 select-none pt-1">
                          <span className="b2 font-bold transition-colors duration-300 text-text-primary">
                            Authenticator App
                          </span>
                          <span className="b4 transition-colors duration-300 text-text-secondary">
                            Get codes from an app like Google Authenticator or Authy.
                          </span>
                        </div>
                      </div>
                      {!hasAuthenticator && (
                        <Button variant="outline" size="sm" onClick={() => handleStartSetup("authenticator")}>
                          Set Up
                        </Button>
                      )}
                    </div>
                    
                    {hasAuthenticator && (
                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-black/[0.05]">
                        <Badge color="success" variant="subtle" shape="rounded" className="text-xs">
                          Added {getTimeAgo(authenticatorUpdatedAt || recoveryCodesGeneratedAt)}
                        </Badge>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleStartSetup("authenticator")}>
                            Change App
                          </Button>
                          <Button variant="outline" size="icon" onClick={() => handleDisableSpecificMethod("authenticator")} className="border-brand-accent text-brand-accent hover:bg-brand-accent hover:text-white hover:border-brand-accent focus:ring-brand-accent">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col p-5 rounded-2xl border border-black/[0.05] bg-white transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary shrink-0">
                          <Mail className="w-6 h-6 text-brand-accent" />
                        </div>
                        <div className="flex flex-col gap-0.5 select-none pt-1">
                          <span className="b2 font-bold transition-colors duration-300 text-text-primary">
                            Email Verification
                          </span>
                          <span className="b4 transition-colors duration-300 text-text-secondary">
                            Receive a 6-digit code to your email inbox.
                          </span>
                        </div>
                      </div>
                      {!hasEmail && (
                        <Button variant="outline" size="sm" onClick={() => handleStartSetup("email")}>
                          Set Up
                        </Button>
                      )}
                    </div>

                    {hasEmail && (
                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-black/[0.05]">
                        <Badge color="success" variant="subtle" shape="rounded" className="text-xs">
                          Added {getTimeAgo(emailUpdatedAt || recoveryCodesGeneratedAt)}
                        </Badge>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="icon" onClick={() => handleDisableSpecificMethod("email")} className="border-brand-accent text-brand-accent hover:bg-brand-accent hover:text-white hover:border-brand-accent focus:ring-brand-accent">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {twoFactorEnabled && recoveryCodesGeneratedAt && (
                <div className="flex flex-col p-5 rounded-2xl border border-black/[0.05] bg-white transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary shrink-0">
                        <KeyRound className="w-6 h-6 text-brand-accent" />
                      </div>
                      <div className="flex flex-col gap-0.5 select-none pt-1">
                        <span className="b2 font-bold transition-colors duration-300 text-text-primary">
                          Backup Recovery Codes
                        </span>
                        <span className="b4 transition-colors duration-300 text-text-secondary">
                          Use these codes if you lose access to your other methods.
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-black/[0.05]">
                    <Badge color="success" variant="subtle" shape="rounded" className="text-xs">
                      Generated {getTimeAgo(recoveryCodesGeneratedAt)}
                    </Badge>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" onClick={() => setIsRegenerateModalOpen(true)}>
                        Regenerate
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4 pt-2">
            <SectionHeader
              title="Active Sessions"
              className="mb-0 py-2 border-gray-100"
            />
            <div className="space-y-3 pt-2">
              <SessionCard
                device="Windows 11 • Chrome"
                location="Manila, PH"
                status="Current Session"
                icon={<Laptop className="w-8 h-8" strokeWidth={1.5} />}
                isActive={true}
              />
              <SessionCard
                device="iOS 17 • Safari"
                location="Manila, PH"
                status="Last active 2 hours ago"
                icon={<Smartphone className="w-8 h-8" strokeWidth={1.5} />}
                isActive={false}
              />
            </div>
            <div className="flex justify-end mt-4">
              <Button
                type="button"
                variant="accent"
                shape="rounded"
                leftIcon={<LogOut className="w-4 h-4" />}
                onClick={() => setIsLogoutModalOpen(true)}
              >
                Log Out All Other Sessions
              </Button>
            </div>
          </div>
        </div>
      </div>

      <ActionConfirmationModal
        isOpen={isLogoutModalOpen}
        action="delete"
        title="Log Out Other Sessions?"
        message="Are you sure you want to log out all other active sessions? This action cannot be undone."
        confirmLabel="Log Out"
        saving={loggingOutSessions}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogoutOtherSessions}
      />

      {isSetupModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-text-primary/45 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl md:rounded-[32px] w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            <div className="px-6 md:px-8 py-4 md:py-6 flex items-center justify-between border-b border-black/[0.05] flex-shrink-0">
              <h2 className="b2 font-bold text-text-primary">
                {setupStep === "authenticator" && "Authenticator Setup"}
                {setupStep === "email" && "Email Verification"}
                {setupStep === "recovery" && "Recovery Codes"}
              </h2>
              {setupStep !== "recovery" && (
                <button
                  onClick={() => setIsSetupModalOpen(false)}
                  className="text-text-secondary hover:text-text-primary transition-colors p-1"
                >
                  <X size={20} />
                </button>
              )}
            </div>

            <div className="p-6 md:p-8 overflow-y-auto">
              {setupError && (
                <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-100 flex gap-2 text-sm text-red-600 items-start">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                  <p>{setupError}</p>
                </div>
              )}

              {setupStep === "authenticator" && (
                <div className="space-y-6">
                  {setupLoading && !setupQrUrl ? (
                    <div className="flex flex-col items-center justify-center py-10 space-y-4">
                      <Loader2 className="w-8 h-8 animate-spin text-brand-primary" />
                      <p className="text-sm text-text-secondary">Generating secure keys...</p>
                    </div>
                  ) : (
                    <>
                      <div className="text-center space-y-2">
                        <p className="text-sm text-text-secondary">
                          1. Open your authenticator app and scan this QR code.
                        </p>
                        <div className="bg-white p-4 rounded-xl border border-gray-200 inline-block mt-2">
                          <QRCode value={setupQrUrl} size={160} />
                        </div>
                        <p className="text-xs text-text-secondary mt-2">
                          Unable to scan? Enter this key manually:<br/>
                          <span className="font-mono font-medium text-text-primary bg-gray-100 px-2 py-1 rounded inline-block mt-1">{setupSecret}</span>
                        </p>
                      </div>

                      <div className="space-y-3 pt-4 border-t border-black/[0.05]">
                        <p className="text-sm text-text-secondary mb-3">
                          2. Enter the 6-digit code generated by your app.
                        </p>
                        <SixDigitInput 
                          value={setupVerificationCode} 
                          onChange={setSetupVerificationCode} 
                          disabled={setupLoading}
                        />
                      </div>

                      <div className="flex gap-3 mt-6">
                        <Button onClick={() => setIsSetupModalOpen(false)} variant="outline" className="flex-1">Cancel</Button>
                        <Button onClick={handleVerifySetup} variant="primary" className="flex-1" loading={setupLoading} disabled={setupVerificationCode.length < 6}>
                          Verify & Enable
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              )}

              {setupStep === "email" && (
                <div className="space-y-6 text-center">
                  <div className="relative w-16 h-16 mx-auto mb-4">
                    <div className="absolute inset-0 rounded-full bg-brand-primary/30 animate-ping" style={{ animationDuration: "1.8s" }} />
                    <div className="relative w-16 h-16 bg-brand-primary/20 text-brand-primary rounded-full flex items-center justify-center shadow-lg shadow-brand-primary/20">
                      <Mail size={32} strokeWidth={2} />
                    </div>
                  </div>
                  <p className="text-sm text-text-secondary">
                    We've sent a 6-digit verification code to your email. Please enter it below to confirm.
                  </p>
                  
                  <div className="py-4">
                    <SixDigitInput 
                      value={setupVerificationCode} 
                      onChange={setSetupVerificationCode} 
                      disabled={setupLoading}
                    />
                  </div>

                  <div className="flex gap-3 pt-2">
                    <Button onClick={() => setIsSetupModalOpen(false)} variant="outline" className="flex-1">Cancel</Button>
                    <Button onClick={handleVerifySetup} variant="primary" className="flex-1" loading={setupLoading} disabled={setupVerificationCode.length < 6}>
                      Verify Code
                    </Button>
                  </div>
                </div>
              )}

              {setupStep === "recovery" && (
                <div className="space-y-6 text-center">
                  <div className="relative w-16 h-16 mx-auto mb-2">
                    <div className="absolute inset-0 rounded-full bg-success-secondary/60 animate-ping" style={{ animationDuration: "1.8s" }} />
                    <div className="relative w-16 h-16 bg-success-secondary text-success-primary rounded-full flex items-center justify-center shadow-lg shadow-success-primary/20">
                      <Check size={32} strokeWidth={3} />
                    </div>
                  </div>
                  <div>
                    <h3 className="b2 font-bold text-text-primary mb-1">
                      2FA is now active!
                    </h3>
                    <p className="b4 text-text-secondary">
                      Save these backup recovery codes in a secure place. They will only be shown once.
                    </p>
                  </div>

                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 grid grid-cols-2 gap-3 text-left">
                    {setupRecoveryCodes.map((code, idx) => (
                      <div key={idx} className="font-mono text-sm font-medium text-text-primary tracking-wider text-center">
                        {code.slice(0,4)}-{code.slice(4)}
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button onClick={handleCopyCodes} variant="outline" shape="rounded" leftIcon={<Copy className="w-4 h-4"/>} className="flex-1">
                      Copy
                    </Button>
                    <Button onClick={handleDownloadCodes} variant="outline" shape="rounded" leftIcon={<Download className="w-4 h-4"/>} className="flex-1">
                      Download
                    </Button>
                  </div>

                  <Button onClick={() => setIsSetupModalOpen(false)} variant="primary" className="w-full mt-2">
                    Done
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {isDisableModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-text-primary/45 backdrop-blur-sm p-4">
          <div
            className="bg-white rounded-[28px] w-full max-w-sm shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
            style={{
              boxShadow: "0 24px 64px rgba(0,0,0,0.14), 0 4px 16px rgba(0,0,0,0.08)",
            }}
          >
            <div className="flex flex-col items-center text-center px-8 pt-8 pb-6">
              <div
                className="flex items-center justify-center mb-5 w-14 h-14 rounded-2xl bg-[#fff0f0]"
                style={{
                  boxShadow: "0 4px 18px rgba(255,82,105,0.18)",
                }}
              >
                <ShieldAlert className="w-7 h-7 text-[#ec1313]" strokeWidth={1.75} />
              </div>

              <h3 className="font-bold text-[17px] text-text-primary leading-snug">
                Disable {disableMethod === "all" ? "2FA" : disableMethod === "authenticator" ? "Authenticator App" : "Email Verification"}?
              </h3>

              <p className="text-[13px] text-text-secondary mt-2 leading-relaxed max-w-[270px]">
                {disableMethod === "all" 
                  ? "Are you sure you want to disable all two-factor authentication methods? Your account will be less secure." 
                  : "Are you sure you want to remove this 2FA method?"} 
              </p>
            </div>

            <div className="px-6 pb-2">
              <div className="space-y-1.5 w-full relative">
                <Input
                  type="password"
                  placeholder="Current Password"
                  value={disablePassword}
                  onChange={(e) => {
                     setDisablePassword(e.target.value);
                     if (disableError) setDisableError("");
                  }}
                  className={cn(
                     "w-full py-2.5 rounded-xl pr-10 focus:outline-none",
                     !disableError && "focus:border-brand-primary focus:ring-brand-primary"
                  )}
                  isError={!!disableError}
                />
                {disableError && <p className="text-xs text-[#ec1313] pl-1 text-left">{disableError}</p>}
              </div>
            </div>

            <div className="h-px bg-black/[0.05] mx-6 mt-4" />

            <div className="px-6 py-5 flex items-center gap-3">
              <Button
                variant="ghost"
                onClick={() => setIsDisableModalOpen(false)}
                disabled={disableLoading}
                className="flex-1 rounded-xl h-11 text-[13.5px] font-medium text-text-secondary hover:bg-black/[0.04] hover:text-text-primary transition-all duration-150 border border-black/[0.07]"
              >
                Cancel
              </Button>
              <Button
                onClick={handleDisable2FA}
                loading={disableLoading}
                disabled={disableLoading || !disablePassword}
                className="flex-1 rounded-xl h-11 text-[13.5px] font-semibold transition-all duration-200 shadow-sm active:scale-[0.98] bg-warning-secondary text-warning-primary border-2 border-warning-primary/20 hover:bg-warning-primary hover:text-white hover:border-warning-primary hover:shadow-md"
              >
                Disable
              </Button>
            </div>
          </div>
        </div>
      )}

      <ActionConfirmationModal
        isOpen={isRegenerateModalOpen}
        action="save"
        title="Regenerate Recovery Codes?"
        message="This will invalidate all your existing backup codes immediately. Ensure you save the new ones."
        confirmLabel="Regenerate"
        saving={regenerateLoading}
        onClose={() => setIsRegenerateModalOpen(false)}
        onConfirm={handleRegenerateCodes}
      />
    </>
  );
};
