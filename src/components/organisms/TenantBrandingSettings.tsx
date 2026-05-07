"use client";

import React, { useState } from "react";
import { Save, Upload, Palette, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { SectionHeader } from "@/components/molecules/SectionHeader";
import { cn } from "@/lib/utils";

export const TenantBrandingSettings = () => {
  const [primaryColor, setPrimaryColor] = useState("#FFC670");

  const presetColors = [
    "#FFC670", // Qios default
    "#3B82F6", // Blue
    "#10B981", // Green
    "#EF4444", // Red
    "#8B5CF6", // Purple
    "#F97316", // Orange
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 w-full">
      <div>
        <h2 className="text-xl font-bold text-text-primary mb-1">
          Branding & Appearance
        </h2>
        <p className="text-sm text-text-secondary">
          Customize the look and feel of your customer-facing interfaces like
          Kiosks and QR Menus.
        </p>
      </div>

      <div className="space-y-6">
        <div className="space-y-4">
          <SectionHeader
            title="Brand Colors"
            className="mb-0 py-2 border-gray-100"
          />
          <div className="pt-2">
            <label className="text-sm font-medium text-text-primary block mb-3">
              Primary Theme Color
            </label>
            <div className="flex flex-wrap items-center gap-3">
              {presetColors.map((color) => (
                <button
                  key={color}
                  onClick={() => setPrimaryColor(color)}
                  className={cn(
                    "w-10 h-10 rounded-full border-2 transition-all duration-200 shadow-sm",
                    primaryColor === color
                      ? "border-text-primary scale-110"
                      : "border-transparent hover:scale-105",
                  )}
                  style={{ backgroundColor: color }}
                  title={`Set primary color to ${color}`}
                />
              ))}
              <div className="h-8 w-px bg-gray-200 mx-2" />
              <div className="relative group">
                <div
                  className="w-10 h-10 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50 cursor-pointer overflow-hidden transition-all group-hover:border-brand-accent group-hover:bg-brand-accent/5"
                  title="Custom Color"
                >
                  <Palette
                    size={18}
                    className="text-gray-400 group-hover:text-brand-accent"
                  />
                  <input
                    type="color"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </div>
              </div>
              <div className="ml-2 text-sm font-medium text-text-secondary py-1.5 px-3 bg-gray-50 rounded-lg border border-gray-100">
                {primaryColor.toUpperCase()}
              </div>
            </div>
            <p className="text-xs text-text-secondary mt-3">
              This color will be used for primary buttons, active states, and
              highlights on your menus.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <SectionHeader
            title="Logos & Media"
            className="mb-0 py-2 border-gray-100"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div className="space-y-3">
              <label className="text-sm font-medium text-text-primary block">
                Dashboard & Receipt Logo
              </label>
              <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer group h-40">
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm mb-3 group-hover:scale-110 transition-transform">
                  <Upload size={20} className="text-brand-accent" />
                </div>
                <span className="text-sm font-medium text-text-primary">
                  Click to upload logo
                </span>
                <span className="text-xs text-text-secondary mt-1">
                  PNG, JPG (Square, Max 2MB)
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium text-text-primary block">
                Kiosk Splash Screen Image
              </label>
              <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer group h-40">
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm mb-3 group-hover:scale-110 transition-transform">
                  <ImageIcon size={20} className="text-brand-accent" />
                </div>
                <span className="text-sm font-medium text-text-primary">
                  Click to upload splash image
                </span>
                <span className="text-xs text-text-secondary mt-1">
                  Portrait 1080x1920 (Max 5MB)
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <Button
            variant="accent"
            shape="rounded"
            leftIcon={<Save size={18} />}
          >
            Save Branding
          </Button>
        </div>
      </div>
    </div>
  );
};
