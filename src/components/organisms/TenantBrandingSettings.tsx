// fix

import React, { useActionState, useEffect, useState, useRef } from "react";
import chroma from "chroma-js";
import {
  Save,
  Upload,
  Image as ImageIcon,
  Type,
  Globe,
  AtSign,
  Link as LinkIcon,
  LayoutGrid,
  List,
  CheckCircle2,
  Edit2,
} from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
import { SectionHeader } from "@/components/molecules/SectionHeader";
import { cn } from "@/lib/utils";
import { saveTenantBrandingSettings } from "@/app/(tenant)/[id]/settings/actions";
import {
  emptySettingsActionState,
  type TenantBrandingSettingsData,
} from "@/app/(tenant)/[id]/settings/types";

interface TenantBrandingSettingsProps {
  tenantId: string;
  initialData: TenantBrandingSettingsData;
}

export const TenantBrandingSettings = ({
  tenantId,
  initialData,
}: TenantBrandingSettingsProps) => {
  const [theme, setTheme] = useState({
    primary: initialData.primaryColor || "#FFC670",
    secondary: initialData.secondaryColor || "#FFF9F0",
    accent: initialData.accentColor || "#F97316",
  });
  const [fontFamily, setFontFamily] = useState(initialData.fontFamily || "inter");
  const [menuLayout, setMenuLayout] = useState(initialData.menuLayout || "grid");
  
  const [qiosSubdomain, setQiosSubdomain] = useState("");
  const [customDomain, setCustomDomain] = useState("");
  const [instagramUrl, setInstagramUrl] = useState("");
  const [facebookUrl, setFacebookUrl] = useState("");
  const [tiktokUrl, setTiktokUrl] = useState("");

  const [isEditing, setIsEditing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const wasPending = useRef(false);

  const [state, formAction, isPending] = useActionState(
    saveTenantBrandingSettings.bind(null, tenantId),
    emptySettingsActionState,
  );

  useEffect(() => {
    setTheme({
      primary: initialData.primaryColor || "#FFC670",
      secondary: initialData.secondaryColor || "#FFF9F0",
      accent: initialData.accentColor || "#F97316",
    });
    setFontFamily(initialData.fontFamily || "inter");
    setMenuLayout(initialData.menuLayout || "grid");
  }, [initialData]);

  useEffect(() => {
    if (state.fieldErrors) {
      setFieldErrors(state.fieldErrors);
    }
  }, [state.fieldErrors]);

  useEffect(() => {
    if (wasPending.current && !isPending) {
      if (state.success) {
        setIsEditing(false);
        setShowSuccess(true);
      }
    }
    wasPending.current = isPending;
  }, [isPending, state.success]);

  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showSuccess]);

  const handlePresetColor = (color: string) => {
    setTheme({
      primary: color,
      secondary: chroma(color).set("hsl.l", 0.95).hex(),
      accent: chroma(color).set("hsl.h", "+150").saturate(2).hex(),
    });
    setFieldErrors((prev) => ({ ...prev, primaryColor: "", secondaryColor: "", accentColor: "" }));
  };

  const presetColors = [
    "#FFC670", // default
    "#3B82F6", // blue
    "#10B981", // green
    "#EF4444", // red
    "#8B5CF6", // purple
    "#F97316", // orange
  ];

  const fonts = [
    { id: "inter", name: "Inter", desc: "Modern & Clean" },
    { id: "playfair", name: "Playfair Display", desc: "Elegant & Classic" },
    { id: "roboto", name: "Roboto", desc: "Technical & Crisp" },
  ];

  const layouts = [
    {
      id: "grid",
      name: "Grid View",
      icon: LayoutGrid,
      desc: "Best for visual menus",
    },
    {
      id: "list",
      name: "List View",
      icon: List,
      desc: "Best for text-heavy menus",
    },
  ];

  // handle frontend validation for domain
  const handleClientSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    let hasError = false;
    const newErrors: Record<string, string> = {};

    if (!qiosSubdomain.trim()) {
      newErrors.qiosSubdomain = "Qios Subdomain is required.";
      hasError = true;
    }

    if (hasError) {
      e.preventDefault();
      setFieldErrors((prev) => ({ ...prev, ...newErrors }));
    }
  };

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

      <form action={formAction} onSubmit={handleClientSubmit} className="space-y-8 w-full">
        {showSuccess && state.success && (
          <div className="mb-6 w-full">
            <div className="flex items-center gap-2 w-full text-green-700 bg-green-50 border border-green-100 rounded-xl px-4 py-3">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <p className="text-sm font-medium">{state.success}</p>
            </div>
          </div>
        )}

        {/* brand colors */}
        <div className="space-y-6 w-full">
          <SectionHeader
            title="Brand Theme"
            className="mb-0 py-2 border-gray-100"
          />

          {/* presets */}
          <div className="pt-2">
            <label className="text-sm font-medium text-text-primary block mb-3">
              Quick Presets
            </label>
            <div className="flex flex-wrap items-center gap-3">
              {presetColors.map((color) => {
                const accentColor = chroma(color).set("hsl.h", "+150").saturate(2).hex();
                return (
                  <button
                    key={color}
                    type="button"
                    onClick={() => isEditing && handlePresetColor(color)}
                    className={cn(
                      "w-10 h-10 rounded-full border-2 transition-all duration-200 shadow-sm relative",
                      theme.primary === color
                        ? "scale-110"
                        : "border-transparent hover:scale-105"
                    )}
                    style={{ 
                      backgroundColor: color,
                      borderColor: theme.primary === color ? accentColor : "transparent"
                    }}
                    title={`Apply ${color} theme`}
                    disabled={!isEditing}
                  />
                );
              })}
            </div>
          </div>

          {/* custom theme colors */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* primary */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
                Primary <span className="text-brand-accent">*</span>
              </label>
              <div className={cn(
                "relative border rounded-xl p-2 flex items-center gap-3 transition-colors",
                !isEditing && "opacity-70",
                isEditing && "hover:border-brand-primary",
                fieldErrors.primaryColor ? "border-warning-primary" : "border-gray-200"
              )}>
                <div
                  className="w-8 h-8 rounded-lg shadow-inner flex items-center justify-center overflow-hidden relative cursor-pointer"
                  style={{ backgroundColor: theme.primary }}
                >
                  <input
                    type="color"
                    name="primaryColor"
                    value={theme.primary}
                    onChange={(e) => {
                      if (isEditing) {
                        setTheme((prev) => ({ ...prev, primary: e.target.value }));
                        setFieldErrors((prev) => ({ ...prev, primaryColor: "" }));
                      }
                    }}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    disabled={!isEditing}
                  />
                </div>
                <span className="text-sm font-medium text-text-primary font-mono">
                  {theme.primary.toUpperCase()}
                </span>
              </div>
              {fieldErrors.primaryColor && (
                <p className="text-xs text-warning-primary pl-1 mt-1">
                  {fieldErrors.primaryColor}
                </p>
              )}
            </div>

            {/* secondary */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
                Secondary <span className="text-brand-accent">*</span>
              </label>
              <div className={cn(
                "relative border rounded-xl p-2 flex items-center gap-3 transition-colors",
                !isEditing && "opacity-70",
                isEditing && "hover:border-brand-primary",
                fieldErrors.secondaryColor ? "border-warning-primary" : "border-gray-200"
              )}>
                <div
                  className="w-8 h-8 rounded-lg shadow-inner flex items-center justify-center overflow-hidden relative cursor-pointer"
                  style={{ backgroundColor: theme.secondary }}
                >
                  <input
                    type="color"
                    name="secondaryColor"
                    value={theme.secondary}
                    onChange={(e) => {
                      if (isEditing) {
                        setTheme((prev) => ({ ...prev, secondary: e.target.value }));
                        setFieldErrors((prev) => ({ ...prev, secondaryColor: "" }));
                      }
                    }}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    disabled={!isEditing}
                  />
                </div>
                <span className="text-sm font-medium text-text-primary font-mono">
                  {theme.secondary.toUpperCase()}
                </span>
              </div>
              {fieldErrors.secondaryColor && (
                <p className="text-xs text-warning-primary pl-1 mt-1">
                  {fieldErrors.secondaryColor}
                </p>
              )}
            </div>

            {/* accent */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
                Accent <span className="text-brand-accent">*</span>
              </label>
              <div className={cn(
                "relative border rounded-xl p-2 flex items-center gap-3 transition-colors",
                !isEditing && "opacity-70",
                isEditing && "hover:border-brand-primary",
                fieldErrors.accentColor ? "border-warning-primary" : "border-gray-200"
              )}>
                <div
                  className="w-8 h-8 rounded-lg shadow-inner flex items-center justify-center overflow-hidden relative cursor-pointer"
                  style={{ backgroundColor: theme.accent }}
                >
                  <input
                    type="color"
                    name="accentColor"
                    value={theme.accent}
                    onChange={(e) => {
                      if (isEditing) {
                        setTheme((prev) => ({ ...prev, accent: e.target.value }));
                        setFieldErrors((prev) => ({ ...prev, accentColor: "" }));
                      }
                    }}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    disabled={!isEditing}
                  />
                </div>
                <span className="text-sm font-medium text-text-primary font-mono">
                  {theme.accent.toUpperCase()}
                </span>
              </div>
              {fieldErrors.accentColor && (
                <p className="text-xs text-warning-primary pl-1 mt-1">
                  {fieldErrors.accentColor}
                </p>
              )}
            </div>
          </div>
          <p className="text-xs text-text-secondary">
            Primary color is used for main buttons. Secondary is used for subtle
            backgrounds and badges. Accent is used for notifications and
            important actions.
          </p>
        </div>

        {/* typography */}
        <div className="space-y-4 w-full">
          <SectionHeader
            title="Typography"
            className="mb-0 py-2 border-gray-100"
          />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <input type="hidden" name="fontFamily" value={fontFamily} />
            {fonts.map((font) => (
              <button
                key={font.id}
                type="button"
                onClick={() => {
                  if (isEditing) {
                    setFontFamily(font.id);
                    setFieldErrors((prev) => ({ ...prev, fontFamily: "" }));
                  }
                }}
                className={cn(
                  "p-4 rounded-xl border-2 text-left transition-all",
                  !isEditing && "opacity-70 cursor-not-allowed",
                  fontFamily === font.id
                    ? "border-brand-primary bg-brand-primary/5"
                    : "border-gray-100 hover:border-gray-200 bg-white",
                  fieldErrors.fontFamily ? "border-warning-primary" : ""
                )}
                disabled={!isEditing}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Type
                    size={16}
                    className={
                      fontFamily === font.id
                        ? "text-brand-primary"
                        : "text-text-secondary"
                    }
                  />
                  <span className="font-semibold text-text-primary">
                    {font.name}
                  </span>
                </div>
                <p className="text-xs text-text-secondary">{font.desc}</p>
              </button>
            ))}
          </div>
          {fieldErrors.fontFamily && (
            <p className="text-xs text-warning-primary pl-1 mt-1">
              {fieldErrors.fontFamily}
            </p>
          )}
        </div>

        {/* layout preferences */}
        <div className="space-y-4 w-full">
          <SectionHeader
            title="Menu Layout"
            className="mb-0 py-2 border-gray-100"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <input type="hidden" name="menuLayout" value={menuLayout} />
            {layouts.map((layout) => {
              const Icon = layout.icon;
              return (
                <button
                  key={layout.id}
                  type="button"
                  onClick={() => {
                    if (isEditing) {
                      setMenuLayout(layout.id);
                      setFieldErrors((prev) => ({ ...prev, menuLayout: "" }));
                    }
                  }}
                  className={cn(
                    "p-4 rounded-xl border-2 text-left transition-all flex items-start gap-4",
                    !isEditing && "opacity-70 cursor-not-allowed",
                    menuLayout === layout.id
                      ? "border-brand-primary bg-brand-primary/5"
                      : "border-gray-100 hover:border-gray-200 bg-white",
                    fieldErrors.menuLayout ? "border-warning-primary" : ""
                  )}
                  disabled={!isEditing}
                >
                  <div
                    className={cn(
                      "p-2 rounded-lg",
                      menuLayout === layout.id
                        ? "bg-brand-primary text-white"
                        : "bg-gray-100 text-text-secondary",
                    )}
                  >
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
          {fieldErrors.menuLayout && (
            <p className="text-xs text-warning-primary pl-1 mt-1">
              {fieldErrors.menuLayout}
            </p>
          )}
        </div>

        {/* logos & media */}
        <div className="space-y-4 w-full">
          <SectionHeader
            title="Logos & Media"
            className="mb-0 py-2 border-gray-100"
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            <div className="space-y-3">
              <label className="text-sm font-medium text-text-primary block">
                Dashboard & Receipt Logo <span className="text-brand-accent">*</span>
              </label>
              <div className={cn(
                "relative border-2 border-dashed border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center bg-gray-50 transition-colors h-40 overflow-hidden",
                isEditing ? "hover:bg-gray-100 cursor-pointer group" : "opacity-70"
              )}>
                <div className={cn(
                  "w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm mb-3 transition-transform",
                  isEditing && "group-hover:scale-110"
                )}>
                  <Upload size={20} className="text-brand-accent" />
                </div>
                <span className="text-sm font-medium text-text-primary">
                  Click to upload
                </span>
                <span className="text-xs text-text-secondary mt-1">
                  PNG, JPG (Square)
                </span>
                {isEditing && (
                  <label className="absolute inset-0 cursor-pointer w-full h-full">
                    <input
                      type="file"
                      name="dashboardLogo"
                      accept="image/*"
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium text-text-primary block">
                Kiosk Splash Screen <span className="text-brand-accent">*</span>
              </label>
              <div className={cn(
                "relative border-2 border-dashed border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center bg-gray-50 transition-colors h-40 overflow-hidden",
                isEditing ? "hover:bg-gray-100 cursor-pointer group" : "opacity-70"
              )}>
                <div className={cn(
                  "w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm mb-3 transition-transform",
                  isEditing && "group-hover:scale-110"
                )}>
                  <ImageIcon size={20} className="text-brand-accent" />
                </div>
                <span className="text-sm font-medium text-text-primary">
                  Click to upload
                </span>
                <span className="text-xs text-text-secondary mt-1">
                  Portrait 1080x1920
                </span>
                {isEditing && (
                  <label className="absolute inset-0 cursor-pointer w-full h-full">
                    <input
                      type="file"
                      name="kioskSplash"
                      accept="image/*"
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium text-text-primary block">
                Favicon <span className="text-brand-accent">*</span>
              </label>
              <div className={cn(
                "relative border-2 border-dashed border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center bg-gray-50 transition-colors h-40 overflow-hidden",
                isEditing ? "hover:bg-gray-100 cursor-pointer group" : "opacity-70"
              )}>
                <div className={cn(
                  "w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm mb-3 transition-transform",
                  isEditing && "group-hover:scale-110"
                )}>
                  <Globe size={20} className="text-brand-accent" />
                </div>
                <span className="text-sm font-medium text-text-primary">
                  Click to upload
                </span>
                <span className="text-xs text-text-secondary mt-1">
                  .ICO, .PNG (32x32)
                </span>
                {isEditing && (
                  <label className="absolute inset-0 cursor-pointer w-full h-full">
                    <input
                      type="file"
                      name="favicon"
                      accept="image/*"
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* web presence (domains) */}
        <div className="space-y-4 w-full">
          <SectionHeader
            title="Web Presence"
            className="mb-0 py-2 border-gray-100"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div className="space-y-1.5 w-full">
              <label className="text-sm font-medium text-text-primary">
                Qios Subdomain <span className="text-brand-accent">*</span>
              </label>
              <div className="relative flex items-center w-full">
                <Input
                  name="qiosSubdomain"
                  value={qiosSubdomain}
                  onChange={(e) => {
                    setQiosSubdomain(e.target.value);
                    setFieldErrors(prev => ({ ...prev, qiosSubdomain: "" }));
                  }}
                  placeholder="yourbrand"
                  isError={!!fieldErrors.qiosSubdomain}
                  className={cn(
                    "py-2.5 w-full rounded-xl focus:outline-none disabled:cursor-not-allowed pr-24",
                    !fieldErrors.qiosSubdomain
                      ? "focus:border-brand-primary focus:ring-brand-primary"
                      : ""
                  )}
                  disabled={!isEditing}
                />
                <span className={cn(
                  "absolute right-3 text-sm",
                  fieldErrors.qiosSubdomain ? "text-warning-primary" : "text-text-secondary"
                )}>
                  .qios.com
                </span>
              </div>
              {fieldErrors.qiosSubdomain && (
                <p className="text-xs text-warning-primary pl-1 mt-1">
                  {fieldErrors.qiosSubdomain}
                </p>
              )}
              <p className="text-xs text-text-secondary mt-1 ml-1">
                Your menu will be accessible at yourbrand.qios.com
              </p>
            </div>
            
            <div className="w-full flex items-start gap-2">
              <div className="space-y-1.5 flex-1">
                <label className="text-sm font-medium text-text-primary">
                  Custom Domain
                </label>
                <Input
                  name="customDomain"
                  value={customDomain}
                  onChange={(e) => setCustomDomain(e.target.value)}
                  placeholder="e.g. order.yourbrand.com"
                  className="py-2.5 w-full rounded-xl focus:outline-none disabled:cursor-not-allowed focus:border-brand-primary focus:ring-brand-primary"
                  disabled={!isEditing}
                />
                <p className="text-xs text-text-secondary mt-1 ml-1">
                  Requires DNS configuration
                </p>
              </div>
              <div className="pt-7">
                <Button 
                  type="button" 
                  variant="outline" 
                  shape="rounded"
                  disabled={!isEditing || !customDomain}
                >
                  Connect
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* social media links */}
        <div className="space-y-4 w-full">
          <SectionHeader
            title="Social Media Links"
            className="mb-0 py-2 border-gray-100"
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            <div className="space-y-1.5 w-full">
              <label className="text-sm font-medium text-text-primary">
                Instagram URL
              </label>
              <div className="relative flex items-center w-full">
                <div className="absolute left-3 text-text-secondary">
                  <AtSign size={18} />
                </div>
                <Input
                  name="instagramUrl"
                  value={instagramUrl}
                  onChange={(e) => setInstagramUrl(e.target.value)}
                  placeholder="https://instagram.com/..."
                  className="py-2.5 w-full rounded-xl focus:outline-none disabled:cursor-not-allowed pl-10 focus:border-brand-primary focus:ring-brand-primary"
                  disabled={!isEditing}
                />
              </div>
            </div>

            <div className="space-y-1.5 w-full">
              <label className="text-sm font-medium text-text-primary">
                Facebook URL
              </label>
              <div className="relative flex items-center w-full">
                <div className="absolute left-3 text-text-secondary">
                  <LinkIcon size={18} />
                </div>
                <Input
                  name="facebookUrl"
                  value={facebookUrl}
                  onChange={(e) => setFacebookUrl(e.target.value)}
                  placeholder="https://facebook.com/..."
                  className="py-2.5 w-full rounded-xl focus:outline-none disabled:cursor-not-allowed pl-10 focus:border-brand-primary focus:ring-brand-primary"
                  disabled={!isEditing}
                />
              </div>
            </div>

            <div className="space-y-1.5 w-full">
              <label className="text-sm font-medium text-text-primary">
                TikTok URL
              </label>
              <div className="relative flex items-center w-full">
                <div className="absolute left-3 text-text-secondary">
                  <LinkIcon size={18} />
                </div>
                <Input
                  name="tiktokUrl"
                  value={tiktokUrl}
                  onChange={(e) => setTiktokUrl(e.target.value)}
                  placeholder="https://tiktok.com/@..."
                  className="py-2.5 w-full rounded-xl focus:outline-none disabled:cursor-not-allowed pl-10 focus:border-brand-primary focus:ring-brand-primary"
                  disabled={!isEditing}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="pt-4 flex justify-end w-full border-t border-gray-100">
          {!isEditing ? (
            <Button
              type="button"
              variant="outline"
              shape="rounded"
              onClick={() => {
                setIsEditing(true);
                setShowSuccess(false);
              }}
              leftIcon={<Edit2 size={18} />}
            >
              Edit Branding & Appearance
            </Button>
          ) : (
            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="outline"
                shape="rounded"
                onClick={() => {
                  setIsEditing(false);
                  setTheme({
                    primary: initialData.primaryColor || "#FFC670",
                    secondary: initialData.secondaryColor || "#FFF9F0",
                    accent: initialData.accentColor || "#F97316",
                  });
                  setFontFamily(initialData.fontFamily || "inter");
                  setMenuLayout(initialData.menuLayout || "grid");
                  setFieldErrors({});
                }}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="accent"
                shape="rounded"
                leftIcon={<Save size={18} />}
                loading={isPending}
              >
                Save Changes
              </Button>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};
