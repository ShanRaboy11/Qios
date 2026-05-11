import React, { useState } from "react";
import chroma from "chroma-js";
import {
  Save,
  Upload,
  Palette,
  Image as ImageIcon,
  Type,
  Globe,
  AtSign,
  Link as LinkIcon,
  LayoutGrid,
  List,
} from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { FormField } from "@/components/molecules/FormField";
import { SectionHeader } from "@/components/molecules/SectionHeader";
import { cn } from "@/lib/utils";

export const TenantBrandingSettings = () => {
  const [theme, setTheme] = useState({
    primary: "#FFC670",
    secondary: "#FFF9F0",
    accent: "#F97316"
  });
  const [fontFamily, setFontFamily] = useState("inter");
  const [menuLayout, setMenuLayout] = useState("grid");

  const handlePresetColor = (color: string) => {
    setTheme({
      primary: color,
      secondary: chroma(color).set('hsl.l', 0.95).hex(),
      accent: chroma(color).set('hsl.h', '+150').saturate(2).hex()
    });
  };

  const presetColors = [
    "#FFC670", // Qios default
    "#3B82F6", // Blue
    "#10B981", // Green
    "#EF4444", // Red
    "#8B5CF6", // Purple
    "#F97316", // Orange
  ];

  const fonts = [
    { id: "inter", name: "Inter", desc: "Modern & Clean" },
    { id: "playfair", name: "Playfair Display", desc: "Elegant & Classic" },
    { id: "roboto", name: "Roboto", desc: "Technical & Crisp" },
  ];

  const layouts = [
    { id: "grid", name: "Grid View", icon: LayoutGrid, desc: "Best for visual menus" },
    { id: "list", name: "List View", icon: List, desc: "Best for text-heavy menus" },
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

      <div className="space-y-8">
        {/* Brand Colors */}
        <div className="space-y-6">
          <SectionHeader
            title="Brand Theme"
            className="mb-0 py-2 border-gray-100"
          />
          
          {/* Presets */}
          <div className="pt-2">
            <label className="text-sm font-medium text-text-primary block mb-3">
              Quick Presets
            </label>
            <div className="flex flex-wrap items-center gap-3">
              {presetColors.map((color) => (
                <button
                  key={color}
                  onClick={() => handlePresetColor(color)}
                  className={cn(
                    "w-10 h-10 rounded-full border-2 transition-all duration-200 shadow-sm",
                    theme.primary === color
                      ? "border-brand-primary scale-110"
                      : "border-transparent hover:scale-105",
                  )}
                  style={{ backgroundColor: color }}
                  title={`Apply ${color} theme`}
                />
              ))}
            </div>
          </div>

          {/* Custom Theme Colors */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Primary */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Primary</label>
              <div className="relative group border border-gray-200 rounded-xl p-2 flex items-center gap-3 hover:border-brand-primary transition-colors">
                <div 
                  className="w-8 h-8 rounded-lg shadow-inner flex items-center justify-center overflow-hidden relative cursor-pointer"
                  style={{ backgroundColor: theme.primary }}
                >
                  <input
                    type="color"
                    value={theme.primary}
                    onChange={(e) => setTheme(prev => ({ ...prev, primary: e.target.value }))}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </div>
                <span className="text-sm font-medium text-text-primary font-mono">{theme.primary.toUpperCase()}</span>
              </div>
            </div>

            {/* Secondary */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Secondary</label>
              <div className="relative group border border-gray-200 rounded-xl p-2 flex items-center gap-3 hover:border-brand-primary transition-colors">
                <div 
                  className="w-8 h-8 rounded-lg shadow-inner flex items-center justify-center overflow-hidden relative cursor-pointer"
                  style={{ backgroundColor: theme.secondary }}
                >
                  <input
                    type="color"
                    value={theme.secondary}
                    onChange={(e) => setTheme(prev => ({ ...prev, secondary: e.target.value }))}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </div>
                <span className="text-sm font-medium text-text-primary font-mono">{theme.secondary.toUpperCase()}</span>
              </div>
            </div>

            {/* Accent */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Accent</label>
              <div className="relative group border border-gray-200 rounded-xl p-2 flex items-center gap-3 hover:border-brand-primary transition-colors">
                <div 
                  className="w-8 h-8 rounded-lg shadow-inner flex items-center justify-center overflow-hidden relative cursor-pointer"
                  style={{ backgroundColor: theme.accent }}
                >
                  <input
                    type="color"
                    value={theme.accent}
                    onChange={(e) => setTheme(prev => ({ ...prev, accent: e.target.value }))}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </div>
                <span className="text-sm font-medium text-text-primary font-mono">{theme.accent.toUpperCase()}</span>
              </div>
            </div>
          </div>
          <p className="text-xs text-text-secondary">
            Primary color is used for main buttons. Secondary is used for subtle backgrounds and badges. Accent is used for notifications and important actions.
          </p>
        </div>

        {/* Typography */}
        <div className="space-y-4">
          <SectionHeader
            title="Typography"
            className="mb-0 py-2 border-gray-100"
          />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            {fonts.map((font) => (
              <button
                key={font.id}
                onClick={() => setFontFamily(font.id)}
                className={cn(
                  "p-4 rounded-xl border-2 text-left transition-all",
                  fontFamily === font.id
                    ? "border-brand-primary bg-brand-primary/5"
                    : "border-gray-100 hover:border-gray-200 bg-white",
                )}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Type size={16} className={fontFamily === font.id ? "text-brand-primary" : "text-text-secondary"} />
                  <span className="font-semibold text-text-primary">
                    {font.name}
                  </span>
                </div>
                <p className="text-xs text-text-secondary">{font.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Layout Preferences */}
        <div className="space-y-4">
          <SectionHeader
            title="Menu Layout"
            className="mb-0 py-2 border-gray-100"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            {layouts.map((layout) => {
              const Icon = layout.icon;
              return (
                <button
                  key={layout.id}
                  onClick={() => setMenuLayout(layout.id)}
                  className={cn(
                    "p-4 rounded-xl border-2 text-left transition-all flex items-start gap-4",
                    menuLayout === layout.id
                      ? "border-brand-primary bg-brand-primary/5"
                      : "border-gray-100 hover:border-gray-200 bg-white",
                  )}
                >
                  <div className={cn(
                    "p-2 rounded-lg",
                    menuLayout === layout.id ? "bg-brand-primary text-white" : "bg-gray-100 text-text-secondary"
                  )}>
                    <Icon size={20} />
                  </div>
                  <div>
                    <span className="font-semibold text-text-primary block mb-1">
                      {layout.name}
                    </span>
                    <p className="text-xs text-text-secondary">{layout.desc}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Logos & Media */}
        <div className="space-y-4">
          <SectionHeader
            title="Logos & Media"
            className="mb-0 py-2 border-gray-100"
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            <div className="space-y-3">
              <label className="text-sm font-medium text-text-primary block">
                Dashboard & Receipt Logo
              </label>
              <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer group h-40">
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm mb-3 group-hover:scale-110 transition-transform">
                  <Upload size={20} className="text-brand-accent" />
                </div>
                <span className="text-sm font-medium text-text-primary">
                  Click to upload
                </span>
                <span className="text-xs text-text-secondary mt-1">
                  PNG, JPG (Square)
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium text-text-primary block">
                Kiosk Splash Screen
              </label>
              <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer group h-40">
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm mb-3 group-hover:scale-110 transition-transform">
                  <ImageIcon size={20} className="text-brand-accent" />
                </div>
                <span className="text-sm font-medium text-text-primary">
                  Click to upload
                </span>
                <span className="text-xs text-text-secondary mt-1">
                  Portrait 1080x1920
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium text-text-primary block">
                Favicon
              </label>
              <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer group h-40">
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm mb-3 group-hover:scale-110 transition-transform">
                  <Globe size={20} className="text-brand-accent" />
                </div>
                <span className="text-sm font-medium text-text-primary">
                  Click to upload
                </span>
                <span className="text-xs text-text-secondary mt-1">
                  .ICO, .PNG (32x32)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Web Presence (Domains) */}
        <div className="space-y-4">
          <SectionHeader
            title="Web Presence"
            className="mb-0 py-2 border-gray-100"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div className="max-w-none">
              <FormField
                label="Qios Subdomain"
                placeholder="yourbrand"
                supportiveText="Your menu will be accessible at yourbrand.qios.com"
                className="max-w-full"
                rightIcon={<span className="text-text-secondary text-sm">.qios.com</span>}
              />
            </div>
            <div className="max-w-none flex items-end gap-2">
              <FormField
                label="Custom Domain"
                placeholder="e.g. order.yourbrand.com"
                supportiveText="Requires DNS configuration"
                className="max-w-full flex-1"
              />
              <Button variant="outline" className="mb-[26px]">Connect</Button>
            </div>
          </div>
        </div>

        {/* Social Media Links */}
        <div className="space-y-4">
          <SectionHeader
            title="Social Media Links"
            className="mb-0 py-2 border-gray-100"
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            <FormField
              label="Instagram URL"
              placeholder="https://instagram.com/..."
              leftIcon={<AtSign size={18} />}
              className="max-w-full"
            />
            <FormField
              label="Facebook URL"
              placeholder="https://facebook.com/..."
              leftIcon={<LinkIcon size={18} />}
              className="max-w-full"
            />
            <FormField
              label="TikTok URL"
              placeholder="https://tiktok.com/@..."
              leftIcon={<LinkIcon size={18} />}
              className="max-w-full"
            />
          </div>
        </div>

        <div className="pt-4 flex justify-end border-t border-gray-100">
          <Button
            variant="accent"
            shape="rounded"
            leftIcon={<Save size={18} />}
            className="mt-4"
          >
            Save Branding
          </Button>
        </div>
      </div>
    </div>
  );
};

