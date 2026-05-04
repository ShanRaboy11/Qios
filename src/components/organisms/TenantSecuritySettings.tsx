"use client";

import React from "react";
import { Shield, Laptop, Smartphone } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
import { Toggle } from "@/components/atoms/Toggle";
import { SectionHeader } from "@/components/molecules/SectionHeader";
import { SessionCard } from "@/components/molecules/SessionCard";

export const TenantSecuritySettings = () => {
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-sm font-medium text-text-primary">
                Current Password
              </label>
              <Input type="password" placeholder="••••••••" className="py-2.5 rounded-xl" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-text-primary">
                New Password
              </label>
              <Input type="password" placeholder="New Password" className="py-2.5 rounded-xl" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-text-primary">
                Confirm New Password
              </label>
              <Input type="password" placeholder="Confirm Password" className="py-2.5 rounded-xl" />
            </div>
            <div className="sm:col-span-2 flex justify-end mt-2">
               <Button variant="outline" shape="rounded">Update Password</Button>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <SectionHeader
            title="Two-Factor Authentication"
            className="mb-0 py-2 border-gray-100"
          />
          <div className="flex items-center justify-between p-4 mt-2 rounded-xl border border-gray-100">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center">
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
              <Toggle variant="accent" defaultIsOn={false} />
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
             <Button variant="outline" className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600">
               Log Out All Other Sessions
             </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
