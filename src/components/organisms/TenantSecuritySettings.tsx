"use client";

import React, { useActionState, useEffect, useState } from "react";
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
} from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
import { Toggle } from "@/components/atoms/Toggle";
import { ActionConfirmationModal } from "@/components/molecules/ConfirmationModal";
import { SectionHeader } from "@/components/molecules/SectionHeader";
import { SessionCard } from "@/components/molecules/SessionCard";
import { cn } from "@/lib/utils";
import {
  revokeOtherTenantSessions,
  updateTenantPassword,
  updateTenantTwoFactorPreference,
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

export const TenantSecuritySettings = ({
  tenantId,
  initialData,
}: TenantSecuritySettingsProps) => {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [requireTwoFactorAuth, setRequireTwoFactorAuth] = useState(
    initialData.requireTwoFactorAuth,
  );
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving2fa, setSaving2fa] = useState(false);
  const [sessionNotice, setSessionNotice] = useState("");
  const [sessionError, setSessionError] = useState("");
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [loggingOutSessions, setLoggingOutSessions] = useState(false);
  const [passwordState, passwordAction, passwordPending] = useActionState(
    updateTenantPassword.bind(null, tenantId),
    emptySettingsActionState,
  );

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

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
    setRequireTwoFactorAuth(initialData.requireTwoFactorAuth);
  }, [initialData]);

  const isPasswordDirty = currentPassword.length > 0 || newPassword.length > 0 || confirmPassword.length > 0;

  const requirements = passwordRequirements(newPassword);
  const isPasswordStrong =
    requirements.hasMinLength &&
    requirements.hasUppercase &&
    requirements.hasLowercase &&
    requirements.hasDigit &&
    requirements.hasSpecial;

  const handleTwoFactorChange = async (nextValue: boolean) => {
    setSessionError("");
    setSessionNotice("");
    setSaving2fa(true);
    setRequireTwoFactorAuth(nextValue);

    try {
      await updateTenantTwoFactorPreference(tenantId, nextValue);
      setSessionNotice("Two-factor preference saved successfully.");
    } catch (error) {
      setRequireTwoFactorAuth((previous) => !previous);
      setSessionError(
        error instanceof Error
          ? error.message
          : "Unable to update two-factor preference.",
      );
    } finally {
      setSaving2fa(false);
    }
  };

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

  return (
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
          <div className="flex items-center justify-between p-4 mt-2 rounded-xl border border-gray-100 bg-white">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                <Shield className="w-5 h-5 text-brand-accent" />
              </div>
              <div>
                <h4 className="font-medium text-text-primary">
                  Require 2FA for Login
                </h4>
                <p className="text-sm text-text-secondary hidden sm:block">
                  Add an extra layer of security using an authenticator app.
                </p>
              </div>
            </div>
            <Toggle
              variant="accent"
              isOn={requireTwoFactorAuth}
              onChange={handleTwoFactorChange}
              disabled={saving2fa}
            />
          </div>
          {(sessionNotice || sessionError) && (
            <div className="space-y-3 pt-2">
              {sessionNotice && (
                <p className="w-full text-sm text-green-700 bg-green-50 border border-green-100 rounded-xl px-4 py-3">
                  {sessionNotice}
                </p>
              )}
              {sessionError && (
                <p className="w-full text-sm text-red-500 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                  {sessionError}
                </p>
              )}
            </div>
          )}
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

      <ActionConfirmationModal
        isOpen={isLogoutModalOpen}
        action="delete"
        title="Log Out Other Sessions?"
        message="Are you sure you want to log out all other active sessions? This action cannot be undone."
        confirmLabel="Log Out Sessions"
        saving={loggingOutSessions}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogoutOtherSessions}
      />
    </div>
  );
};
