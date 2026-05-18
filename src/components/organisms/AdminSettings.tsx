"use client";

import React, { useState, useEffect } from "react";
import {
  User,
  Globe,
  Users,
  Blocks,
  Shield,
  Save,
  Bell,
  Moon,
  Key,
  Laptop,
  Smartphone,
  Loader2,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
import { Toggle } from "@/components/atoms/Toggle";
import { Modal } from "@/components/molecules/Modal";
import { ActionConfirmationModal } from "@/components/molecules/ConfirmationModal";
import { Dropdown } from "@/components/molecules/Dropdown";
import { SectionHeader } from "@/components/molecules/SectionHeader";
import { IntegrationCard } from "@/components/molecules/IntegrationCard";
import { SessionCard } from "@/components/molecules/SessionCard";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

type SettingsTab =
  | "account"
  | "platform"
  | "team"
  | "integrations"
  | "security"

export const AdminSettings = () => {
  const [activeTab, setActiveTab] = useState<SettingsTab>("account");

  const tabs = [
    { id: "account", label: "Account & Profile", icon: User },
    { id: "platform", label: "Platform Configuration", icon: Globe },
    { id: "team", label: "Team & Access Control", icon: Users },
    { id: "integrations", label: "Integrations & API", icon: Blocks },
    { id: "security", label: "Security & Compliance", icon: Shield },
  ] as const;

  return (
    <div className="flex flex-col md:flex-row gap-6 md:gap-8 min-h-[600px]">
      {/* Sidebar */}
      <div className="w-full md:w-64 flex-shrink-0 flex flex-col gap-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as SettingsTab)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-left group",
                isActive
                  ? "bg-brand-accent text-white shadow-md shadow-brand-accent/20"
                  : "bg-white text-text-primary hover:bg-gray-50 hover:text-brand-accent border border-gray-100",
              )}
            >
              <Icon
                size={20}
                className={cn(
                  "flex-shrink-0 transition-colors",
                  isActive
                    ? "text-white"
                    : "text-text-secondary group-hover:text-brand-accent",
                )}
              />
              <span className="font-medium text-[15px]">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Content Area */}
      <div className="flex-1 bg-white rounded-[24px] shadow-sm border border-gray-100 p-6 md:p-8 overflow-hidden">
        {activeTab === "account" && <AccountSettings />}
        {activeTab === "platform" && <PlatformSettings />}
        {activeTab === "team" && <TeamSettings />}
        {activeTab === "integrations" && <IntegrationSettings />}
        {activeTab === "security" && <SecuritySettings />}
      </div>
    </div>
  );
};

const AccountSettings = () => {
  const [firstName, setFirstName] = useState("Admin");
  const [lastName, setLastName] = useState("User");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const supabase = createSupabaseBrowserClient();

  useEffect(() => {
    async function loadProfile() {
      const { data: userData } = await supabase.auth.getUser();
      if (userData?.user) {
        setEmail(userData.user.email || "");
        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name")
          .eq("id", userData.user.id)
          .single();
        if (profile) {
          const parts = profile.full_name.split(" ");
          setFirstName(parts[0] || "");
          setLastName(parts.slice(1).join(" ") || "");
        }
      }
      setLoading(false);
    }
    loadProfile();
  }, [supabase]);

  const handleSave = async () => {
    setShowConfirmModal(false);
    setSaving(true);
    const { data: userData } = await supabase.auth.getUser();
    if (userData?.user) {
      await supabase
        .from("profiles")
        .update({ full_name: `${firstName} ${lastName}`.trim() })
        .eq("id", userData.user.id);

      if (email !== userData.user.email) {
        await supabase.auth.updateUser({ email });
      }

      await supabase.from("system_activity_logs").insert({
        user_id: userData.user.id,
        action: "Update Account Settings",
        details: { email, first_name: firstName, last_name: lastName }
      });
    }
    setSaving(false);
    setShowSuccessModal(true);
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-xl font-bold text-text-primary mb-1">
          Account & Profile
        </h2>
        <p className="text-sm text-text-secondary">
          Manage your personal admin account settings and preferences.
        </p>
      </div>

      <div className="space-y-6">
        {/* Profile Information */}
        <div className="space-y-4">
          <SectionHeader
            title="Profile Information"
            className="mb-0 py-2 border-gray-100"
          />
          <div className="flex flex-col sm:flex-row gap-6 pt-2">
            <div className="w-24 h-24 rounded-full bg-brand-primary flex items-center justify-center text-white text-3xl font-bold flex-shrink-0 border-4 border-white shadow-md uppercase">
              {firstName.charAt(0)}
            </div>
            <div className="flex-1 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-text-primary">
                    First Name
                  </label>
                  <Input
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="py-2.5 rounded-xl"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-text-primary">
                    Last Name
                  </label>
                  <Input
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="py-2.5 rounded-xl"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-text-primary">
                  Email Address
                </label>
                <Input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  className="py-2.5 rounded-xl"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div className="space-y-4">
          <SectionHeader
            title="Preferences"
            className="mb-0 py-2 border-gray-100"
          />
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center">
                  <Bell className="w-5 h-5 text-brand-accent" />
                </div>
                <div>
                  <h4 className="font-medium text-text-primary">
                    Email Notifications
                  </h4>
                  <p className="text-sm text-text-secondary">
                    Receive daily digests and system alerts.
                  </p>
                </div>
              </div>
              <Toggle variant="accent" defaultIsOn={true} />
            </div>
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <Button
            variant="accent"
            shape="rounded"
            leftIcon={
              saving ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Save size={18} />
              )
            }
            onClick={() => setShowConfirmModal(true)}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      <ActionConfirmationModal
        isOpen={showConfirmModal}
        action="save"
        title="Confirm Updates"
        message="Are you sure you want to apply these changes to your account settings?"
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleSave}
        saving={saving}
      />

      <ActionConfirmationModal
        isOpen={showSuccessModal}
        action="success"
        title="Success"
        message="Your account settings have been successfully updated."
        onClose={() => setShowSuccessModal(false)}
        onConfirm={() => setShowSuccessModal(false)}
      />
    </div>
  );
};

const PlatformSettings = () => {
  const [platformName, setPlatformName] = useState("Qios");
  const [supportEmail, setSupportEmail] = useState("support@qios.com");
  const [currency, setCurrency] = useState("PHP");
  const [timezone, setTimezone] = useState("Asia/Manila");
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const supabase = createSupabaseBrowserClient();

  useEffect(() => {
    async function loadSettings() {
      const { data } = await supabase
        .from("platform_settings")
        .select("*")
        .eq("id", 1)
        .single();
      if (data) {
        setPlatformName(data.platform_name || "Qios");
        setSupportEmail(data.support_email || "support@qios.com");
        setCurrency(data.default_currency || "PHP");
        setTimezone(data.default_timezone || "Asia/Manila");
        setMaintenanceMode(data.maintenance_mode || false);
      }
      setLoading(false);
    }
    loadSettings();
  }, [supabase]);

  const handleSave = async () => {
    setShowConfirmModal(false);
    setSaving(true);
    const { data: userData } = await supabase.auth.getUser();
    await supabase
      .from("platform_settings")
      .update({
        platform_name: platformName,
        support_email: supportEmail,
        default_currency: currency,
        default_timezone: timezone,
        maintenance_mode: maintenanceMode,
      })
      .eq("id", 1);

    if (userData?.user) {
      await supabase.from("system_activity_logs").insert({
        user_id: userData.user.id,
        action: "Update Platform Settings",
        details: { platform_name: platformName, support_email: supportEmail, default_currency: currency, default_timezone: timezone, maintenance_mode: maintenanceMode }
      });
    }
    setSaving(false);
    setShowSuccessModal(true);
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-xl font-bold text-text-primary mb-1">
          Platform Configuration
        </h2>
        <p className="text-sm text-text-secondary">
          Manage global settings that apply to all tenants and the system.
        </p>
      </div>

      <div className="space-y-6">
        {/* General */}
        <div className="space-y-4">
          <SectionHeader
            title="General Settings"
            className="mb-0 py-2 border-gray-100"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-text-primary">
                Platform Name
              </label>
              <Input
                value={platformName}
                onChange={(e) => setPlatformName(e.target.value)}
                className="py-2.5 rounded-xl"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-text-primary">
                Support Email
              </label>
              <Input
                value={supportEmail}
                onChange={(e) => setSupportEmail(e.target.value)}
                type="email"
                className="py-2.5 rounded-xl"
              />
            </div>
          </div>
        </div>

        {/* Tenant Defaults */}
        <div className="space-y-4">
          <SectionHeader
            title="Tenant Defaults"
            className="mb-0 py-2 border-gray-100"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-text-primary">
                Default Currency
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border-2 border-[#E5E5E5] focus:outline-none focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-accent transition-colors bg-white appearance-none cursor-pointer"
              >
                <option value="PHP">PHP (₱)</option>
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-text-primary">
                Default Timezone
              </label>
              <select
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border-2 border-[#E5E5E5] focus:outline-none focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-accent transition-colors bg-white appearance-none cursor-pointer"
              >
                <option value="Asia/Manila">Asia/Manila (GMT+8)</option>
                <option value="UTC">UTC</option>
                <option value="America/New_York">America/New_York (EST)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Maintenance */}
        <div className="space-y-4">
          <SectionHeader
            title="System Status"
            className="mb-0 py-2 border-gray-100"
          />
          <div className="p-5 mt-2 rounded-xl border border-red-100 bg-red-50 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div>
              <h4 className="font-bold text-red-900">Maintenance Mode</h4>
              <p className="text-sm text-red-700 mt-1">
                Enable this to prevent non-admins from logging in while updates
                are performed.
              </p>
            </div>
            <Toggle
              variant="primary"
              isOn={maintenanceMode}
              onChange={(val) => setMaintenanceMode(val)}
              className="ring-red-500 focus:ring-red-500 focus:ring-offset-red-50"
            />
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <Button
            variant="accent"
            shape="rounded"
            leftIcon={
              saving ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Save size={18} />
              )
            }
            onClick={() => setShowConfirmModal(true)}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Configuration"}
          </Button>
        </div>
      </div>

      <ActionConfirmationModal
        isOpen={showConfirmModal}
        action="save"
        title="Save Platform Configurations?"
        message="Are you sure you want to apply these global platform configurations?"
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleSave}
        saving={saving}
      />

      <ActionConfirmationModal
        isOpen={showSuccessModal}
        action="success"
        title="Configurations Saved!"
        message="Global platform configurations have been successfully updated."
        onClose={() => setShowSuccessModal(false)}
        onConfirm={() => setShowSuccessModal(false)}
      />
    </div>
  );
};

const TeamSettings = () => {
  const [admins, setAdmins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createSupabaseBrowserClient();

  useEffect(() => {
    async function loadAdmins() {
      const { data } = await supabase
        .from("profiles")
        .select("id, full_name, role")
        .in("role", ["super_admin"]);

      if (data) {
        setAdmins(
          data.map((p: any) => ({
            id: p.id,
            name: p.full_name,
            email: "Protected",
            role: "Super Admin",
            status: "Active",
          })),
        );
      }
      setLoading(false);
    }
    loadAdmins();
  }, [supabase]);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-text-primary mb-1">
            Team & Access Control
          </h2>
          <p className="text-sm text-text-secondary">
            Manage admin users and their access levels.
          </p>
        </div>
        <Button
          variant="accent"
          shape="rounded"
          className="flex-shrink-0 py-2 px-6 h-10"
        >
          Invite Admin
        </Button>
      </div>

      <div className="space-y-4">
        <div className="overflow-x-auto rounded-xl border border-gray-100">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-sm font-medium text-text-secondary">
                <th className="py-3 px-4 font-medium">User</th>
                <th className="py-3 px-4 font-medium">Role</th>
                <th className="py-3 px-4 font-medium">Status</th>
                <th className="py-3 px-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {admins.map((admin) => (
                <tr
                  key={admin.id}
                  className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors group"
                >
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-brand-primary/20 flex items-center justify-center text-brand-accent font-bold uppercase">
                        {admin.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-medium text-text-primary">
                          {admin.name}
                        </div>
                        <div className="text-xs text-text-secondary">
                          {admin.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-text-secondary">
                      {admin.role}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={cn(
                        "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium",
                        admin.status === "Active"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-500",
                      )}
                    >
                      {admin.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <button className="text-sm font-medium text-brand-accent hover:text-brand-accent/80 transition-colors">
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
              {admins.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="py-8 text-center text-text-secondary"
                  >
                    No admins found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const IntegrationSettings = () => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-xl font-bold text-text-primary mb-1">
          Integrations & API
        </h2>
        <p className="text-sm text-text-secondary">
          Connect Qios with third-party services and manage API keys.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <IntegrationCard
          name="SendGrid"
          description="System emails, password resets, and notifications."
          icon={<Globe className="w-5 h-5" />}
          iconBgColor="bg-[#F0F5FA]"
          iconTextColor="text-[#1A82E2]"
          status="Connected"
        />

        <IntegrationCard
          name="Stripe"
          description="Payment processing for tenant subscriptions."
          icon={<Key className="w-5 h-5" />}
          iconBgColor="bg-[#F6F8FA]"
          iconTextColor="text-[#635BFF]"
          status="Not Configured"
        />
      </div>
    </div>
  );
};

const SecuritySettings = () => {
  const [passwordMinLength, setPasswordMinLength] = useState("8");
  const [sessionTimeoutHours, setSessionTimeoutHours] = useState("24");
  const [sessions, setSessions] = useState<any[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const supabase = createSupabaseBrowserClient();

  useEffect(() => {
    async function loadSettings() {
      // Load platform settings
      const { data } = await supabase
        .from("platform_settings")
        .select("password_min_length, session_timeout_hours")
        .eq("id", 1)
        .single();
      if (data) {
        setPasswordMinLength(data.password_min_length?.toString() || "8");
        setSessionTimeoutHours(data.session_timeout_hours?.toString() || "24");
      }

      // Load active sessions
      const { data: sessionData } = await supabase.auth.getSession();
      if (sessionData?.session) {
        setCurrentSessionId(sessionData.session.id);
      }

      const { data: mySessions, error: sessionFetchError } =
        await supabase.rpc("get_my_sessions");
      console.log("Sessions fetch result:", { mySessions, sessionFetchError });

      if (mySessions) {
        // Sort current session first
        const sortedSessions = [...mySessions].sort((a, b) => {
          if (a.id === sessionData?.session?.id) return -1;
          if (b.id === sessionData?.session?.id) return 1;
          return (
            new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
          );
        });
        setSessions(sortedSessions);
      }

      setLoading(false);
    }
    loadSettings();
  }, [supabase]);

  const handleSave = async () => {
    setShowConfirmModal(false);
    setSaving(true);
    const { data: userData } = await supabase.auth.getUser();
    await supabase
      .from("platform_settings")
      .update({
        password_min_length: parseInt(passwordMinLength),
        session_timeout_hours: parseInt(sessionTimeoutHours),
      })
      .eq("id", 1);
      
    if (userData?.user) {
      await supabase.from("system_activity_logs").insert({
        user_id: userData.user.id,
        action: "Update Security Settings",
        details: { password_min_length: passwordMinLength, session_timeout_hours: sessionTimeoutHours }
      });
    }
    setSaving(false);
    setShowSuccessModal(true);
  };

  const handleRevokeSession = async (sessionId: string) => {
    const { error } = await supabase.rpc("revoke_session", {
      session_id: sessionId,
    });
    if (!error) {
      setSessions((prev) => prev.filter((s) => s.id !== sessionId));
    }
  };

  const parseUserAgent = (ua: string | undefined | null) => {
    let device = "Unknown Device";
    let icon = <Laptop className="w-8 h-8" strokeWidth={1.5} />;

    if (!ua) return { deviceText: `${device} • Unknown Browser`, icon };

    if (/Windows/i.test(ua)) device = "Windows";
    else if (/Mac/i.test(ua) && !/iPhone|iPad|iPod/i.test(ua)) device = "macOS";
    else if (/iPhone|iPad|iPod/i.test(ua)) {
      device = "iOS";
      icon = <Smartphone className="w-8 h-8" strokeWidth={1.5} />;
    } else if (/Android/i.test(ua)) {
      device = "Android";
      icon = <Smartphone className="w-8 h-8" strokeWidth={1.5} />;
    } else if (/Linux/i.test(ua)) device = "Linux";

    let browser = "Unknown Browser";
    if (/Edg/i.test(ua)) browser = "Edge";
    else if (/Firefox/i.test(ua)) browser = "Firefox";
    else if (/Chrome/i.test(ua)) browser = "Chrome";
    else if (/Safari/i.test(ua) && !/Chrome/i.test(ua)) browser = "Safari";

    return { deviceText: `${device} • ${browser}`, icon };
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-xl font-bold text-text-primary mb-1">
          Security & Compliance
        </h2>
        <p className="text-sm text-text-secondary">
          Enforce global security policies and manage active sessions.
        </p>
      </div>

      <div className="space-y-6">
        {/* Policies */}
        <div className="space-y-4">
          <SectionHeader
            title="Password Policies"
            className="mb-0 py-2 border-gray-100"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <Dropdown
              label="Minimum Password Length"
              value={passwordMinLength}
              onSelect={(opt) => setPasswordMinLength(opt.value)}
              options={[
                { label: "8 Characters", value: "8" },
                { label: "10 Characters", value: "10" },
                { label: "12 Characters", value: "12" },
              ]}
              className="max-w-full"
            />
            <Dropdown
              label="Session Timeout"
              value={sessionTimeoutHours}
              onSelect={(opt) => setSessionTimeoutHours(opt.value)}
              options={[
                { label: "2 Hours", value: "2" },
                { label: "12 Hours", value: "12" },
                { label: "24 Hours", value: "24" },
              ]}
              className="max-w-full"
            />
          </div>
        </div>

        {/* Sessions */}
        <div className="space-y-4 pt-2">
          <SectionHeader
            title="Your Active Sessions"
            className="mb-0 py-2 border-gray-100"
          />
          <div className="space-y-3 pt-2">
            {sessions.length > 0 ? (
              sessions.map((session) => {
                const isActive = session.id === currentSessionId;
                const { deviceText, icon } = parseUserAgent(session.user_agent);

                // Keep time relatively simple for this display
                const lastUpdated = new Date(session.updated_at);
                const timeStr = isActive
                  ? "Current Session"
                  : `Last active: ${lastUpdated.toLocaleDateString()} ${lastUpdated.toLocaleTimeString()}`;

                return (
                  <SessionCard
                    key={session.id}
                    device={deviceText}
                    location={session.ip || "Unknown Location"}
                    status={timeStr}
                    icon={icon}
                    isActive={isActive}
                    onRevoke={() => handleRevokeSession(session.id)}
                  />
                );
              })
            ) : (
              <p className="text-sm text-text-secondary">No sessions found.</p>
            )}
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <Button
            variant="accent"
            shape="rounded"
            leftIcon={
              saving ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Save size={18} />
              )
            }
            onClick={() => setShowConfirmModal(true)}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Policies"}
          </Button>
        </div>
      </div>

      <ActionConfirmationModal
        isOpen={showConfirmModal}
        action="save"
        title="Save Security Policies?"
        message="Are you sure you want to apply these security policy changes?"
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleSave}
        saving={saving}
      />

      <ActionConfirmationModal
        isOpen={showSuccessModal}
        action="success"
        title="Policies Saved!"
        message="Security policies have been successfully updated."
        onClose={() => setShowSuccessModal(false)}
        onConfirm={() => setShowSuccessModal(false)}
      />
    </div>
  );
};
