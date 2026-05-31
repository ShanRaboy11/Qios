"use client";

import React, { useEffect, useState } from "react";
import {
  Bell,
  Check,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  Shield,
  Sliders,
  Smartphone,
  Terminal,
  User,
  Volume2,
} from "lucide-react";
import { Badge } from "@/components/atoms/Badge";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
import { Toggle } from "@/components/atoms/Toggle";
import { Dropdown } from "@/components/molecules/Dropdown";
import {
  saveEmployeeOperationalSettings,
  saveEmployeeProfileSettings,
  updateEmployeePassword,
} from "./actions";
import {
  emptySettingsActionState,
  type EmployeeSettingsPageData,
  type SettingsActionState,
} from "./types";

type SettingsTab = "profile" | "shift" | "security" | "notifications";

interface EmployeeSettingsClientProps {
  tenantId: string;
  initialData: EmployeeSettingsPageData;
}

const terminalOptions = [
  { label: "Terminal 01 - Main Lobby Counter", value: "counter-1" },
  { label: "Terminal 02 - Dining Room Cashier", value: "counter-2" },
  { label: "Terminal 03 - Takeout Express Bar", value: "counter-express" },
];

const defaultViewOptions = [
  { label: "Operational Dashboard Overview", value: "dashboard" },
  { label: "Orders Queue Display", value: "queue" },
  { label: "QR Order Scanner Mode", value: "scanner" },
  { label: "Kitchen Prep Monitor", value: "kitchen" },
];

const logoffOptions = [
  { label: "3 Minutes of Inactivity", value: "3" },
  { label: "5 Minutes of Inactivity", value: "5" },
  { label: "10 Minutes of Inactivity", value: "10" },
  { label: "30 Minutes of Inactivity", value: "30" },
  { label: "Never Automatically Lock Till", value: "never" },
];

function validatePassword(password: string) {
  return {
    hasMinLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasDigit: /[0-9]/.test(password),
    hasSpecial: /[^A-Za-z0-9]/.test(password),
  };
}

function SettingsMessage({ state }: { state: SettingsActionState }) {
  if (state.error) {
    return (
      <div className="flex items-center gap-2 w-full text-red-700 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
        <Shield className="h-4 w-4 shrink-0" />
        <p className="text-sm font-medium">{state.error}</p>
      </div>
    );
  }

  return null;
}

export function EmployeeSettingsClient({
  tenantId,
  initialData,
}: EmployeeSettingsClientProps) {
  const [activeTab, setActiveTab] = useState<SettingsTab>("profile");
  const [profileEditMode, setProfileEditMode] = useState(false);
  const [securityEditMode, setSecurityEditMode] = useState(false);
  const [preferencesEditMode, setPreferencesEditMode] = useState(false);

  const [profileData, setProfileData] = useState(initialData.profile);
  const [operationalData, setOperationalData] = useState(
    initialData.operational,
  );

  const [profileState, setProfileState] = useState<SettingsActionState>(
    emptySettingsActionState,
  );
  const [securityState, setSecurityState] = useState<SettingsActionState>(
    emptySettingsActionState,
  );
  const [preferencesState, setPreferencesState] = useState<SettingsActionState>(
    emptySettingsActionState,
  );

  const [profileSaving, setProfileSaving] = useState(false);
  const [securitySaving, setSecuritySaving] = useState(false);
  const [preferencesSaving, setPreferencesSaving] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saveFlash, setSaveFlash] = useState<string>("");
  const passwordStrength = validatePassword(newPassword);

  useEffect(() => {
    setProfileData(initialData.profile);
    setOperationalData(initialData.operational);
    setProfileEditMode(false);
    setSecurityEditMode(false);
    setPreferencesEditMode(false);
    setProfileState(emptySettingsActionState);
    setSecurityState(emptySettingsActionState);
    setPreferencesState(emptySettingsActionState);
  }, [initialData]);

  useEffect(() => {
    if (!saveFlash) return;

    const timeout = window.setTimeout(() => {
      setSaveFlash("");
    }, 3500);

    return () => window.clearTimeout(timeout);
  }, [saveFlash]);

  // Sound playback: synthesize tones via WebAudio and listen for global events.
  useEffect(() => {
    if (typeof window === "undefined") return;

    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;

    const ctx = new AudioCtx();

    const playTone = (
      freq: number,
      duration = 0.15,
      type: OscillatorType = "sine",
      gain = 0.12,
    ) => {
      try {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = type;
        o.frequency.value = freq;
        g.gain.value = gain;
        o.connect(g);
        g.connect(ctx.destination);
        const now = ctx.currentTime;
        o.start(now);
        g.gain.setValueAtTime(gain, now);
        g.gain.exponentialRampToValueAtTime(0.001, now + duration);
        o.stop(now + duration + 0.02);
      } catch (e) {
        // ignore audio errors in restrictive browsers
      }
    };

    const playQueue = () => {
      // pleasant rising chime
      playTone(440, 0.14, "sine", 0.08);
      setTimeout(() => playTone(660, 0.2, "sine", 0.06), 120);
    };

    const playScan = () => {
      playTone(1200, 0.08, "square", 0.08);
    };

    const playStock = () => {
      // low-frequency alert
      playTone(220, 0.3, "sawtooth", 0.12);
      setTimeout(() => playTone(180, 0.2, "sawtooth", 0.1), 220);
    };

    const onQueue = () => {
      if (operationalData.soundQueue) playQueue();
    };

    const onScan = () => {
      if (operationalData.soundScan) playScan();
    };

    const onStock = () => {
      if (operationalData.soundStock) playStock();
    };

    window.addEventListener("qios:sound:queue", onQueue as EventListener);
    window.addEventListener("qios:sound:scan", onScan as EventListener);
    window.addEventListener("qios:sound:stock", onStock as EventListener);

    return () => {
      window.removeEventListener("qios:sound:queue", onQueue as EventListener);
      window.removeEventListener("qios:sound:scan", onScan as EventListener);
      window.removeEventListener("qios:sound:stock", onStock as EventListener);
      try {
        ctx.close();
      } catch (e) {
        /* noop */
      }
    };
    // operationalData intentionally in dependency array so toggles take effect
  }, [operationalData]);

  const tabs = [
    { id: "profile", label: "Profile Details", icon: <User size={18} /> },
    { id: "shift", label: "Shift & Operations", icon: <Sliders size={18} /> },
    {
      id: "security",
      label: "Security & Passwords",
      icon: <Shield size={18} />,
    },
    { id: "notifications", label: "Sounds & Alerts", icon: <Bell size={18} /> },
  ] as const;

  const submitProfile = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!profileEditMode) {
      setProfileEditMode(true);
      return;
    }

    setProfileSaving(true);
    setProfileState(emptySettingsActionState);

    try {
      const formData = new FormData();
      formData.set("fullName", profileData.fullName);
      formData.set("displayName", profileData.displayName);
      formData.set("phoneNumber", profileData.phoneNumber);

      const result = await saveEmployeeProfileSettings(
        tenantId,
        profileState,
        formData,
      );
      setProfileState(result);

      if (result.success) {
        setProfileEditMode(false);
        setSaveFlash(result.success);
      }
    } finally {
      setProfileSaving(false);
    }
  };

  const submitPreferences = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!preferencesEditMode) {
      setPreferencesEditMode(true);
      return;
    }

    await savePreferences();
  };

  const savePreferences = async () => {
    setPreferencesSaving(true);
    setPreferencesState(emptySettingsActionState);

    try {
      const formData = new FormData();
      formData.set("terminal", operationalData.terminal);
      formData.set("defaultView", operationalData.defaultView);
      formData.set("autoLogoff", operationalData.autoLogoff);
      formData.set("quickPin", operationalData.quickPin);
      formData.set("soundQueue", String(operationalData.soundQueue));
      formData.set("soundScan", String(operationalData.soundScan));
      formData.set("soundStock", String(operationalData.soundStock));
      formData.set("notifyEmail", String(operationalData.notifyEmail));
      formData.set("notifyPush", String(operationalData.notifyPush));

      const result = await saveEmployeeOperationalSettings(
        tenantId,
        preferencesState,
        formData,
      );
      setPreferencesState(result);

      if (result.success) {
        setPreferencesEditMode(false);
        setOperationalData((previous) => ({ ...previous, quickPin: "" }));
        setSaveFlash(result.success);
      }
    } finally {
      setPreferencesSaving(false);
    }
  };

  const submitPassword = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!securityEditMode) {
      setSecurityEditMode(true);
      return;
    }

    setSecuritySaving(true);
    setSecurityState(emptySettingsActionState);

    try {
      const formData = new FormData();
      formData.set("currentPassword", currentPassword);
      formData.set("newPassword", newPassword);
      formData.set("confirmPassword", confirmPassword);

      const result = await updateEmployeePassword(
        tenantId,
        securityState,
        formData,
      );
      setSecurityState(result);

      if (result.success) {
        setSecurityEditMode(false);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setSaveFlash(result.success);
      }
    } finally {
      setSecuritySaving(false);
    }
  };

  return (
    <>
      <header className="mb-6">
        <h2 className="h2 text-text-primary font-figtree">Account Settings</h2>
        <p className="b1 text-text-secondary mt-1">
          Manage your profile, operational defaults, and account credentials.
        </p>
      </header>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {saveFlash && (
          <div className="fixed bottom-6 right-6 z-50 max-w-sm rounded-2xl border border-green-200 bg-green-50 px-4 py-3 shadow-lg text-green-800 flex items-start gap-3">
            <Check className="mt-0.5 h-4 w-4 shrink-0" />
            <p className="text-sm font-medium leading-6">{saveFlash}</p>
          </div>
        )}
        <div className="w-full lg:w-64 flex flex-row lg:flex-col gap-1.5 overflow-x-auto lg:overflow-visible pb-3 lg:pb-0 border-b lg:border-b-0 lg:border-r border-brand-primary/10 pr-0 lg:pr-6 shrink-0 scrollbar-none">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
              }}
              type="button"
              className={`flex items-center gap-3 px-4 py-3.5 rounded-[16px] b2 font-semibold transition-all duration-300 whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-brand-accent/10 text-brand-accent shadow-sm border border-brand-accent/20"
                  : "text-text-secondary hover:text-brand-accent hover:bg-brand-primary/5 border border-transparent"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex-1 w-full bg-white/70 backdrop-blur-md border border-brand-primary/10 rounded-[32px] p-6 md:p-8 shadow-sm">
          {activeTab === "profile" && (
            <form
              onSubmit={submitProfile}
              className="space-y-6 animate-in fade-in duration-300"
            >
              <div className="flex items-center gap-4 flex-wrap pb-4 border-b border-brand-primary/5">
                <div className="w-16 h-16 rounded-full bg-brand-accent/10 border border-brand-accent/20 flex items-center justify-center text-brand-accent font-figtree text-2xl font-bold">
                  {(profileData.fullName || profileData.displayName || "E")
                    .split(/\s+/)
                    .filter(Boolean)
                    .slice(0, 2)
                    .map((part) => part.charAt(0))
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()}
                </div>
                <div>
                  <h3 className="h3 text-text-primary font-figtree">
                    Personal Profile
                  </h3>
                  <div className="flex gap-2 mt-1.5 flex-wrap">
                    <Badge color="accent" variant="subtle">
                      Role: {profileData.roleLabel}
                    </Badge>
                    <Badge color="primary" variant="subtle">
                      Employee ID: {profileData.employeeId}
                    </Badge>
                  </div>
                </div>
              </div>

              <SettingsMessage state={profileState} />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="b4 text-text-secondary font-bold uppercase tracking-wider font-inter ml-1">
                    Full Name
                  </label>
                  <Input
                    type="text"
                    value={profileData.fullName}
                    onChange={(event) =>
                      setProfileData((previous) => ({
                        ...previous,
                        fullName: event.target.value,
                      }))
                    }
                    disabled={!profileEditMode}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="b4 text-text-secondary font-bold uppercase tracking-wider font-inter ml-1">
                    Display Name
                  </label>
                  <Input
                    type="text"
                    value={profileData.displayName}
                    onChange={(event) =>
                      setProfileData((previous) => ({
                        ...previous,
                        displayName: event.target.value,
                      }))
                    }
                    disabled={!profileEditMode}
                  />
                </div>

                <div className="space-y-2">
                  <label className="b4 text-text-secondary font-bold uppercase tracking-wider font-inter ml-1">
                    Email Address
                  </label>
                  <Input
                    type="email"
                    value={profileData.email}
                    disabled
                    readOnly
                  />
                </div>

                <div className="space-y-2">
                  <label className="b4 text-text-secondary font-bold uppercase tracking-wider font-inter ml-1">
                    Phone Number
                  </label>
                  <Input
                    type="tel"
                    value={profileData.phoneNumber}
                    onChange={(event) =>
                      setProfileData((previous) => ({
                        ...previous,
                        phoneNumber: event.target.value,
                      }))
                    }
                    disabled={!profileEditMode}
                  />
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-brand-primary/10 flex justify-end gap-3">
                <Button
                  type={profileEditMode ? "submit" : "button"}
                  onClick={
                    profileEditMode ? undefined : () => setProfileEditMode(true)
                  }
                  disabled={profileSaving}
                  variant="accent"
                  shape="pill"
                  className="w-full sm:w-auto h-[50px] px-8 text-base font-bold font-figtree"
                  leftIcon={
                    profileSaving ? (
                      <Loader2 size={18} className="animate-spin opacity-90" />
                    ) : (
                      <Check size={18} className="opacity-90" />
                    )
                  }
                >
                  {profileEditMode
                    ? profileSaving
                      ? "Saving..."
                      : "Save Profile"
                    : "Edit Profile"}
                </Button>
              </div>
            </form>
          )}

          {activeTab === "shift" && (
            <form
              onSubmit={submitPreferences}
              className="space-y-6 animate-in fade-in duration-300"
            >
              <div className="pb-4 border-b border-brand-primary/5">
                <h3 className="h3 text-text-primary font-figtree">
                  Shift & Operational Defaults
                </h3>
                <p className="b4 text-text-secondary mt-1 font-inter">
                  Manage your active terminal, quick dashboard routing, and
                  screen lock behavior.
                </p>
              </div>

              <SettingsMessage state={preferencesState} />

              <div className="space-y-5">
                <Dropdown
                  label="Active Counter / Cash Terminal"
                  options={terminalOptions}
                  value={operationalData.terminal}
                  onSelect={(option) =>
                    setOperationalData((previous) => ({
                      ...previous,
                      terminal: option.value,
                    }))
                  }
                  className="max-w-none w-full"
                  disabled={!preferencesEditMode}
                />

                <Dropdown
                  label="Default Launch Station"
                  options={defaultViewOptions}
                  value={operationalData.defaultView}
                  onSelect={(option) =>
                    setOperationalData((previous) => ({
                      ...previous,
                      defaultView: option.value,
                    }))
                  }
                  className="max-w-none w-full"
                  disabled={!preferencesEditMode}
                />

                <Dropdown
                  label="Auto-Logoff Idle Lockout"
                  options={logoffOptions}
                  value={operationalData.autoLogoff}
                  onSelect={(option) =>
                    setOperationalData((previous) => ({
                      ...previous,
                      autoLogoff: option.value,
                    }))
                  }
                  className="max-w-none w-full"
                  disabled={!preferencesEditMode}
                />

                <div className="p-4 bg-brand-primary/5 rounded-[18px] border border-brand-primary/10 flex items-start gap-3 mt-4">
                  <Terminal
                    size={18}
                    className="text-brand-accent flex-shrink-0 mt-0.5"
                  />
                  <p className="text-xs text-text-secondary leading-relaxed font-inter">
                    <strong>Station Binding Alert:</strong> Changing your
                    counter/terminal session will direct all transactions,
                    printable receipts, and active queue logs to the selected
                    hardware hub.
                  </p>
                </div>
              </div>

              <div className="h-px bg-brand-primary/10 my-4" />

              <div className="space-y-5">
                <div className="space-y-2 max-w-sm">
                  <label className="b4 text-text-secondary font-bold uppercase tracking-wider font-inter ml-1 flex items-center gap-1.5">
                    <Lock
                      size={14}
                      className="text-brand-accent animate-pulse"
                    />
                    4-Digit Terminal Quick PIN
                  </label>
                  <Input
                    type="password"
                    maxLength={4}
                    align="center"
                    value={operationalData.quickPin}
                    onChange={(event) =>
                      setOperationalData((previous) => ({
                        ...previous,
                        quickPin: event.target.value.replace(/\D/g, ""),
                      }))
                    }
                    placeholder="1234"
                    className="text-lg tracking-[8px] font-bold bg-white"
                    disabled={!preferencesEditMode}
                  />
                  <p className="text-[11px] text-text-secondary font-inter ml-1">
                    Used for quick unlocking when your counter screen goes idle.
                  </p>
                </div>

                {/* Sound effects moved to Sounds & Alerts tab */}

                <div className="flex items-center justify-between p-5 border border-brand-primary/10 rounded-[24px] bg-white/50 hover:bg-white/80 transition-all">
                  <div className="flex-1 pr-4">
                    <p className="b2 font-bold text-text-primary font-figtree flex items-center gap-1.5">
                      <Mail size={16} className="text-brand-accent" />
                      Email shift updates
                    </p>
                    <p className="text-xs text-text-secondary mt-0.5 leading-relaxed font-inter">
                      Receive scheduling, roster modifications, or store reports
                      on your email.
                    </p>
                  </div>
                  <Toggle
                    variant="accent"
                    isOn={operationalData.notifyEmail}
                    onChange={(next) =>
                      setOperationalData((previous) => ({
                        ...previous,
                        notifyEmail: next,
                      }))
                    }
                    disabled={!preferencesEditMode}
                  />
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-brand-primary/10 flex justify-end gap-3">
                <Button
                  type={preferencesEditMode ? "submit" : "button"}
                  onClick={
                    preferencesEditMode
                      ? undefined
                      : () => setPreferencesEditMode(true)
                  }
                  disabled={preferencesSaving}
                  variant="accent"
                  shape="pill"
                  className="w-full sm:w-auto h-[50px] px-8 text-base font-bold font-figtree"
                  leftIcon={
                    preferencesSaving ? (
                      <Loader2 size={18} className="animate-spin opacity-90" />
                    ) : (
                      <Check size={18} className="opacity-90" />
                    )
                  }
                >
                  {preferencesEditMode
                    ? preferencesSaving
                      ? "Saving..."
                      : "Save Preferences"
                    : "Edit Preferences"}
                </Button>
              </div>
            </form>
          )}

          {activeTab === "security" && (
            <form
              onSubmit={submitPassword}
              className="space-y-6 animate-in fade-in duration-300"
            >
              <div className="pb-4 border-b border-brand-primary/5">
                <h3 className="h3 text-text-primary font-figtree">
                  Security & Credentials
                </h3>
                <p className="b4 text-text-secondary mt-1 font-inter">
                  Manage active logins and change your password credentials.
                </p>
              </div>

              <SettingsMessage state={securityState} />

              {!securityEditMode ? (
                <div className="rounded-[24px] border border-brand-primary/10 bg-white/60 p-6 text-text-secondary">
                  Click Edit Password to unlock the password fields.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="b4 text-text-secondary font-bold uppercase tracking-wider font-inter ml-1">
                      Current Password
                    </label>
                    <div className="relative">
                      <Input
                        type={showCurrentPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={currentPassword}
                        onChange={(event) =>
                          setCurrentPassword(event.target.value)
                        }
                        className="pr-11"
                        required
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowCurrentPassword((previous) => !previous)
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-brand-accent transition-colors"
                        aria-label={
                          showCurrentPassword
                            ? "Hide current password"
                            : "Show current password"
                        }
                      >
                        {showCurrentPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="b4 text-text-secondary font-bold uppercase tracking-wider font-inter ml-1">
                      New Password
                    </label>
                    <div className="relative">
                      <Input
                        type={showNewPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={newPassword}
                        onChange={(event) => setNewPassword(event.target.value)}
                        className="pr-11"
                        required
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowNewPassword((previous) => !previous)
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-brand-accent transition-colors"
                        aria-label={
                          showNewPassword
                            ? "Hide new password"
                            : "Show new password"
                        }
                      >
                        {showNewPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="b4 text-text-secondary font-bold uppercase tracking-wider font-inter ml-1">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(event) =>
                          setConfirmPassword(event.target.value)
                        }
                        className="pr-11"
                        required
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword((previous) => !previous)
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-brand-accent transition-colors"
                        aria-label={
                          showConfirmPassword
                            ? "Hide confirm password"
                            : "Show confirm password"
                        }
                      >
                        {showConfirmPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {securityEditMode && newPassword && (
                <div className="rounded-[24px] border border-brand-primary/10 bg-brand-secondary/5 p-5 space-y-3">
                  <p className="b4 font-bold text-text-primary uppercase tracking-wider font-inter">
                    password requirements
                  </p>
                  <div className="space-y-2 text-sm text-text-secondary font-inter">
                    <p
                      className={
                        passwordStrength.hasMinLength ? "text-emerald-700" : ""
                      }
                    >
                      At least 8 characters
                    </p>
                    <p
                      className={
                        passwordStrength.hasUppercase ? "text-emerald-700" : ""
                      }
                    >
                      At least one uppercase letter
                    </p>
                    <p
                      className={
                        passwordStrength.hasLowercase ? "text-emerald-700" : ""
                      }
                    >
                      At least one lowercase letter
                    </p>
                    <p
                      className={
                        passwordStrength.hasDigit ? "text-emerald-700" : ""
                      }
                    >
                      At least one digit (0-9)
                    </p>
                    <p
                      className={
                        passwordStrength.hasSpecial ? "text-emerald-700" : ""
                      }
                    >
                      At least one special character (!@#$%^&*)
                    </p>
                  </div>
                </div>
              )}

              <div className="h-px bg-brand-primary/10 my-4" />

              <div className="space-y-2 max-w-sm">
                <label className="b4 text-text-secondary font-bold uppercase tracking-wider font-inter ml-1 flex items-center gap-1.5">
                  <Lock size={14} className="text-brand-accent animate-pulse" />
                  Active Session Email
                </label>
                <Input
                  type="email"
                  value={profileData.email}
                  disabled
                  readOnly
                />
                <p className="text-[11px] text-text-secondary font-inter ml-1">
                  Password updates are tied to the signed-in account email.
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-brand-primary/10 flex justify-end gap-3">
                <Button
                  type={securityEditMode ? "submit" : "button"}
                  onClick={
                    securityEditMode
                      ? undefined
                      : () => setSecurityEditMode(true)
                  }
                  disabled={securitySaving}
                  variant="accent"
                  shape="pill"
                  className="w-full sm:w-auto h-[50px] px-8 text-base font-bold font-figtree"
                  leftIcon={
                    securitySaving ? (
                      <Loader2 size={18} className="animate-spin opacity-90" />
                    ) : (
                      <Check size={18} className="opacity-90" />
                    )
                  }
                >
                  {securityEditMode
                    ? securitySaving
                      ? "Saving..."
                      : "Save Password"
                    : "Edit Password"}
                </Button>
              </div>
            </form>
          )}

          {activeTab === "notifications" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="pb-4 border-b border-brand-primary/5">
                <h3 className="h3 text-text-primary font-figtree">
                  Sound Effects & Alerts
                </h3>
                <p className="b4 text-text-secondary mt-1 font-inter">
                  These alerts are synced with the operational preferences you
                  save in Shift & Operations.
                </p>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between p-5 border border-brand-primary/10 rounded-[24px] bg-white/50 hover:bg-white/80 transition-all">
                    <div className="flex-1 pr-4">
                      <p className="b2 font-bold text-text-primary font-figtree flex items-center gap-1.5">
                        <Volume2 size={16} className="text-brand-accent" />
                        Queue Placement Chime
                      </p>
                      <p className="text-xs text-text-secondary mt-0.5 leading-relaxed font-inter">
                        Play a gentle chime when a customer places a new order
                        or updates queue status.
                      </p>
                    </div>
                    <Toggle
                      variant="accent"
                      isOn={operationalData.soundQueue}
                      onChange={(next) =>
                        setOperationalData((previous) => ({
                          ...previous,
                          soundQueue: next,
                        }))
                      }
                      disabled={!preferencesEditMode}
                    />
                  </div>

                  <div className="flex items-center justify-between p-5 border border-brand-primary/10 rounded-[24px] bg-white/50 hover:bg-white/80 transition-all">
                    <div className="flex-1 pr-4">
                      <p className="b2 font-bold text-text-primary font-figtree flex items-center gap-1.5">
                        <Volume2 size={16} className="text-brand-accent" />
                        Scan Matching Beep
                      </p>
                      <p className="text-xs text-text-secondary mt-0.5 leading-relaxed font-inter">
                        Play a success beep once a customer ticket QR code scan
                        finishes.
                      </p>
                    </div>
                    <Toggle
                      variant="accent"
                      isOn={operationalData.soundScan}
                      onChange={(next) =>
                        setOperationalData((previous) => ({
                          ...previous,
                          soundScan: next,
                        }))
                      }
                      disabled={!preferencesEditMode}
                    />
                  </div>

                  <div className="flex items-center justify-between p-5 border border-brand-primary/10 rounded-[24px] bg-white/50 hover:bg-white/80 transition-all">
                    <div className="flex-1 pr-4">
                      <p className="b2 font-bold text-text-primary font-figtree flex items-center gap-1.5">
                        <Volume2 size={16} className="text-brand-accent" />
                        Critical Stock Alerts
                      </p>
                      <p className="text-xs text-text-secondary mt-0.5 leading-relaxed font-inter">
                        Play a low-frequency alert beep if an item scanned falls
                        below inventory levels.
                      </p>
                    </div>
                    <Toggle
                      variant="accent"
                      isOn={operationalData.soundStock}
                      onChange={(next) =>
                        setOperationalData((previous) => ({
                          ...previous,
                          soundStock: next,
                        }))
                      }
                      disabled={!preferencesEditMode}
                    />
                  </div>
                </div>

                <div className="h-px bg-brand-primary/10 my-4" />

                <h3 className="b2 font-bold text-text-primary font-figtree mb-2 ml-1">
                  Notification Channels
                </h3>

                <div className="flex items-center justify-between p-5 border border-brand-primary/10 rounded-[24px] bg-white/50 hover:bg-white/80 transition-all">
                  <div className="flex-1 pr-4">
                    <p className="b2 font-bold text-text-primary font-figtree flex items-center gap-1.5">
                      <Mail size={16} className="text-brand-accent" />
                      Email shift updates
                    </p>
                    <p className="text-xs text-text-secondary mt-0.5 leading-relaxed font-inter">
                      Receive scheduling, roster modifications, or store reports
                      on your email.
                    </p>
                  </div>
                  <Toggle
                    variant="accent"
                    isOn={operationalData.notifyEmail}
                    onChange={(next) =>
                      setOperationalData((previous) => ({
                        ...previous,
                        notifyEmail: next,
                      }))
                    }
                    disabled={!preferencesEditMode}
                  />
                </div>

                <div className="flex items-center justify-between p-5 border border-brand-primary/10 rounded-[24px] bg-white/50 hover:bg-white/80 transition-all">
                  <div className="flex-1 pr-4">
                    <p className="b2 font-bold text-text-primary font-figtree flex items-center gap-1.5">
                      <Smartphone size={16} className="text-brand-accent" />
                      Mobile Push indicators
                    </p>
                    <p className="text-xs text-text-secondary mt-0.5 leading-relaxed font-inter">
                      Get fast notification banner alerts on emergency store
                      messages or priority tasks.
                    </p>
                  </div>
                  <Toggle
                    variant="accent"
                    isOn={operationalData.notifyPush}
                    onChange={(next) =>
                      setOperationalData((previous) => ({
                        ...previous,
                        notifyPush: next,
                      }))
                    }
                    disabled={!preferencesEditMode}
                  />
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-brand-primary/10 flex justify-end gap-3">
                <Button
                  type={preferencesEditMode ? "button" : "button"}
                  onClick={
                    preferencesEditMode
                      ? async () => {
                          await savePreferences();
                        }
                      : () => setPreferencesEditMode(true)
                  }
                  disabled={preferencesSaving}
                  variant="accent"
                  shape="pill"
                  className="w-full sm:w-auto h-[50px] px-8 text-base font-bold font-figtree"
                  leftIcon={
                    preferencesSaving ? (
                      <Loader2 size={18} className="animate-spin opacity-90" />
                    ) : (
                      <Check size={18} className="opacity-90" />
                    )
                  }
                >
                  {preferencesEditMode
                    ? preferencesSaving
                      ? "Saving..."
                      : "Save Preferences"
                    : "Edit Preferences"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
