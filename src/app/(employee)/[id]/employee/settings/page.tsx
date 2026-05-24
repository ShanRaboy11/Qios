"use client";

import React, { useState } from "react";
import {
  User,
  Shield,
  Sliders,
  Bell,
  Check,
  Lock,
  Loader2,
  Terminal,
  Volume2,
  Mail,
  Smartphone,
} from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { Badge } from "@/components/atoms/Badge";
import { Input } from "@/components/atoms/Input";
import { Toggle } from "@/components/atoms/Toggle";
import { Dropdown } from "@/components/molecules/Dropdown";

type SettingsTab = "profile" | "shift" | "security" | "notifications";

export default function EmployeeSettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("profile");
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Profile Form States
  const [fullName, setFullName] = useState("Employee User");
  const [displayName, setDisplayName] = useState("Emp_User");
  const [email, setEmail] = useState("employee@qios.com");
  const [phone, setPhone] = useState("+63 912 345 6789");

  // Shift & Operational States
  const [terminal, setTerminal] = useState("counter-1");
  const [defaultView, setDefaultView] = useState("scanner");
  const [autoLogoff, setAutoLogoff] = useState("10");

  // Security States
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [quickPin, setQuickPin] = useState("1234");

  // Sound & Notification States
  const [soundQueue, setSoundQueue] = useState(true);
  const [soundScan, setSoundScan] = useState(true);
  const [soundStock, setSoundStock] = useState(false);
  const [notifyEmail, setNotifyEmail] = useState(true);
  const [notifyPush, setNotifyPush] = useState(true);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveSuccess(false);

    // Simulate saving settings
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setSaving(false);
    setSaveSuccess(true);

    // Clear success message after 3 seconds
    setTimeout(() => {
      setSaveSuccess(false);
    }, 3000);
  };

  const tabs = [
    { id: "profile", label: "Profile Details", icon: <User size={18} /> },
    { id: "shift", label: "Shift & Operations", icon: <Sliders size={18} /> },
    { id: "security", label: "Security & Passwords", icon: <Shield size={18} /> },
    { id: "notifications", label: "Sounds & Alerts", icon: <Bell size={18} /> },
  ] as const;

  // Dropdown options constants
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

  return (
    <>
      <header className="mb-6">
        <h2 className="h2 text-text-primary font-figtree">Account Settings</h2>
        <p className="b1 text-text-secondary mt-1">
          Customize your workspace, operational defaults, and account credentials
        </p>
      </header>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Left Vertical Tab Selector */}
        <div className="w-full lg:w-64 flex flex-row lg:flex-col gap-1.5 overflow-x-auto lg:overflow-visible pb-3 lg:pb-0 border-b lg:border-b-0 lg:border-r border-brand-primary/10 pr-0 lg:pr-6 shrink-0 scrollbar-none">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setSaveSuccess(false);
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

        {/* Right Details Panel */}
        <div className="flex-1 w-full bg-white/70 backdrop-blur-md border border-brand-primary/10 rounded-[32px] p-6 md:p-8 shadow-sm">
          <form onSubmit={handleSave} className="space-y-6">
            
            {/* Tab 1: Profile Details */}
            {activeTab === "profile" && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="flex items-center gap-4 flex-wrap pb-4 border-b border-brand-primary/5">
                  <div className="w-16 h-16 rounded-full bg-brand-accent/10 border border-brand-accent/20 flex items-center justify-center text-brand-accent font-figtree text-2xl font-bold">
                    EU
                  </div>
                  <div>
                    <h3 className="h3 text-text-primary font-figtree">Personal Profile</h3>
                    <div className="flex gap-2 mt-1.5 flex-wrap">
                      <Badge color="accent" variant="subtle">Role: Cashier</Badge>
                      <Badge color="primary" variant="subtle">Employee ID: #QIOS-E4092</Badge>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="b4 text-text-secondary font-bold uppercase tracking-wider font-inter ml-1">
                      Full Name
                    </label>
                    <Input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="b4 text-text-secondary font-bold uppercase tracking-wider font-inter ml-1">
                      Display Name
                    </label>
                    <Input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="b4 text-text-secondary font-bold uppercase tracking-wider font-inter ml-1">
                      Email Address
                    </label>
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="b4 text-text-secondary font-bold uppercase tracking-wider font-inter ml-1">
                      Phone Number
                    </label>
                    <Input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Shift & Operations */}
            {activeTab === "shift" && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="pb-4 border-b border-brand-primary/5">
                  <h3 className="h3 text-text-primary font-figtree">Shift & Operational Defaults</h3>
                  <p className="b4 text-text-secondary mt-1 font-inter">
                    Manage active terminals, quick dashboard routing, and screen security behavior
                  </p>
                </div>

                <div className="space-y-5">
                  <Dropdown
                    label="Active Counter / Cash Terminal"
                    options={terminalOptions}
                    value={terminal}
                    onSelect={(opt) => setTerminal(opt.value)}
                    className="max-w-none w-full"
                  />

                  <Dropdown
                    label="Default Launch Station"
                    options={defaultViewOptions}
                    value={defaultView}
                    onSelect={(opt) => setDefaultView(opt.value)}
                    className="max-w-none w-full"
                  />

                  <Dropdown
                    label="Auto-Logoff Idle Lockout"
                    options={logoffOptions}
                    value={autoLogoff}
                    onSelect={(opt) => setAutoLogoff(opt.value)}
                    className="max-w-none w-full"
                  />

                  <div className="p-4 bg-brand-primary/5 rounded-[18px] border border-brand-primary/10 flex items-start gap-3 mt-4">
                    <Terminal size={18} className="text-brand-accent flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-text-secondary leading-relaxed font-inter">
                      <strong>Station Binding Alert:</strong> Changing your counter/terminal session will direct all transactions, printable receipts, and active queue logs to the specified hardware hub immediately.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 3: Security & Passwords */}
            {activeTab === "security" && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="pb-4 border-b border-brand-primary/5">
                  <h3 className="h3 text-text-primary font-figtree">Security & Credentials</h3>
                  <p className="b4 text-text-secondary mt-1 font-inter">
                    Manage active logins, change password credentials, or update your PIN number
                  </p>
                </div>

                <div className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <label className="b4 text-text-secondary font-bold uppercase tracking-wider font-inter ml-1">
                        Current Password
                      </label>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="b4 text-text-secondary font-bold uppercase tracking-wider font-inter ml-1">
                        New Password
                      </label>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="b4 text-text-secondary font-bold uppercase tracking-wider font-inter ml-1">
                        Confirm New Password
                      </label>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="h-px bg-brand-primary/10 my-4" />

                  <div className="space-y-2 max-w-sm">
                    <label className="b4 text-text-secondary font-bold uppercase tracking-wider font-inter ml-1 flex items-center gap-1.5">
                      <Lock size={14} className="text-brand-accent animate-pulse" />
                      4-Digit Terminal Quick PIN
                    </label>
                    <Input
                      type="password"
                      maxLength={4}
                      align="center"
                      value={quickPin}
                      onChange={(e) => setQuickPin(e.target.value.replace(/\D/g, ""))}
                      placeholder="1234"
                      className="text-lg tracking-[8px] font-bold bg-white"
                    />
                    <p className="text-[11px] text-text-secondary font-inter ml-1">
                      Used for quick unlocking when your counter screen goes idle.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 4: Sounds & Notifications */}
            {activeTab === "notifications" && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="pb-4 border-b border-brand-primary/5">
                  <h3 className="h3 text-text-primary font-figtree">Sound Effects & Alerts</h3>
                  <p className="b4 text-text-secondary mt-1 font-inter">
                    Manage operational sounds to ensure fast feedback in loud environments
                  </p>
                </div>

                <div className="space-y-4">
                  {/* Sound 1 */}
                  <div className="flex items-center justify-between p-5 border border-brand-primary/10 rounded-[24px] bg-white/50 hover:bg-white/80 transition-all">
                    <div className="flex-1 pr-4">
                      <p className="b2 font-bold text-text-primary font-figtree flex items-center gap-1.5">
                        <Volume2 size={16} className="text-brand-accent" />
                        Queue Placement Chime
                      </p>
                      <p className="text-xs text-text-secondary mt-0.5 leading-relaxed font-inter">
                        Play a gentle chime when a customer places a new order or updates queue status.
                      </p>
                    </div>
                    <Toggle
                      variant="accent"
                      isOn={soundQueue}
                      onChange={setSoundQueue}
                    />
                  </div>

                  {/* Sound 2 */}
                  <div className="flex items-center justify-between p-5 border border-brand-primary/10 rounded-[24px] bg-white/50 hover:bg-white/80 transition-all">
                    <div className="flex-1 pr-4">
                      <p className="b2 font-bold text-text-primary font-figtree flex items-center gap-1.5">
                        <Volume2 size={16} className="text-brand-accent" />
                        Scan Matching Beep
                      </p>
                      <p className="text-xs text-text-secondary mt-0.5 leading-relaxed font-inter">
                        Play a success indicator beep once a customer ticket QR code scan successfully finishes.
                      </p>
                    </div>
                    <Toggle
                      variant="accent"
                      isOn={soundScan}
                      onChange={setSoundScan}
                    />
                  </div>

                  {/* Sound 3 */}
                  <div className="flex items-center justify-between p-5 border border-brand-primary/10 rounded-[24px] bg-white/50 hover:bg-white/80 transition-all">
                    <div className="flex-1 pr-4">
                      <p className="b2 font-bold text-text-primary font-figtree flex items-center gap-1.5">
                        <Volume2 size={16} className="text-brand-accent" />
                        Critical Stock Alerts
                      </p>
                      <p className="text-xs text-text-secondary mt-0.5 leading-relaxed font-inter">
                        Play a low-frequency alert beep if an item scanned falls below inventory levels.
                      </p>
                    </div>
                    <Toggle
                      variant="accent"
                      isOn={soundStock}
                      onChange={setSoundStock}
                    />
                  </div>

                  <div className="h-px bg-brand-primary/10 my-4" />

                  <h3 className="b2 font-bold text-text-primary font-figtree mb-2 ml-1">Notification Channels</h3>

                  {/* Channel 1 */}
                  <div className="flex items-center justify-between p-5 border border-brand-primary/10 rounded-[24px] bg-white/50 hover:bg-white/80 transition-all">
                    <div className="flex-1 pr-4">
                      <p className="b2 font-bold text-text-primary font-figtree flex items-center gap-1.5">
                        <Mail size={16} className="text-brand-accent" />
                        Email shift updates
                      </p>
                      <p className="text-xs text-text-secondary mt-0.5 leading-relaxed font-inter">
                        Receive shift scheduling, roster modifications, or store reports on your email.
                      </p>
                    </div>
                    <Toggle
                      variant="accent"
                      isOn={notifyEmail}
                      onChange={setNotifyEmail}
                    />
                  </div>

                  {/* Channel 2 */}
                  <div className="flex items-center justify-between p-5 border border-brand-primary/10 rounded-[24px] bg-white/50 hover:bg-white/80 transition-all">
                    <div className="flex-1 pr-4">
                      <p className="b2 font-bold text-text-primary font-figtree flex items-center gap-1.5">
                        <Smartphone size={16} className="text-brand-accent" />
                        Mobile Push indicators
                      </p>
                      <p className="text-xs text-text-secondary mt-0.5 leading-relaxed font-inter">
                        Get fast notification banner alerts on emergency store messages or priority tasks.
                      </p>
                    </div>
                    <Toggle
                      variant="accent"
                      isOn={notifyPush}
                      onChange={setNotifyPush}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Footer Form Controls */}
            <div className="mt-8 pt-6 border-t border-brand-primary/10 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                {saveSuccess && (
                  <div className="flex items-center gap-1.5 text-success-primary bg-success-secondary/40 px-3 py-1.5 rounded-[12px] border border-success-primary/25 animate-in fade-in duration-300">
                    <Check size={16} className="text-success-primary" />
                    <span className="b4 font-semibold font-inter">Changes saved successfully!</span>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <Button
                  type="submit"
                  disabled={saving}
                  variant="accent"
                  shape="pill"
                  className="w-full sm:w-auto h-[50px] px-8 text-base font-bold font-figtree"
                  leftIcon={
                    saving ? (
                      <Loader2 size={18} className="animate-spin opacity-90" />
                    ) : (
                      <Check size={18} className="opacity-90" />
                    )
                  }
                >
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </div>

          </form>
        </div>
      </div>
    </>
  );
}
