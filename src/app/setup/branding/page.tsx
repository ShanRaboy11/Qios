"use client";

import React, { useState, useRef } from "react";
import chroma from "chroma-js";
import {
  Save,
  Upload,
  Palette,
  Image as ImageIcon,
  Type,
  Globe,
  LayoutGrid,
  List,
  ArrowLeft,
  Smartphone,
  Menu,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { SectionHeader } from "@/components/molecules/SectionHeader";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export default function BrandingSetupPage() {
  const router = useRouter();
  const [theme, setTheme] = useState({
    primary: "#FFC670",
    secondary: "#FFF9F0",
    accent: "#F97316",
  });
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [kioskFile, setKioskFile] = useState<File | null>(null);
  const [faviconFile, setFaviconFile] = useState<File | null>(null);
  // kioskInputRef declared below with other file refs
  const [fontFamily, setFontFamily] = useState("inter");
  const [secondaryFont, setSecondaryFont] = useState("inter");
  const [menuLayout, setMenuLayout] = useState("grid");
  const [isSaving, setIsSaving] = useState(false);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [kioskUrl, setKioskUrl] = useState<string | null>(null);
  const [faviconUrl, setFaviconUrl] = useState<string | null>(null);
  const [suggestedThemes, setSuggestedThemes] = useState<
    Array<{ primary: string; secondary: string; accent: string }>
  >([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const kioskInputRef = useRef<HTMLInputElement>(null);
  const faviconInputRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const handlePresetColor = (color: string) => {
    setTheme({
      primary: color,
      secondary: chroma(color).set("hsl.l", 0.95).hex(),
      accent: chroma(color).set("hsl.h", "+150").saturate(2).hex(),
    });
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setLogoUrl(url);
    setLogoFile(file);
    // Color extraction will happen in the onLoad handler of the image element
  };

  const handleKioskUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setKioskFile(file);
    setKioskUrl(url);
  };

  const handleFaviconUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setFaviconFile(file);
    setFaviconUrl(url);
  };

  const extractColors = () => {
    if (imageRef.current) {
      try {
        const img = imageRef.current;
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // Scale down to 64x64 for extremely fast processing
        canvas.width = 64;
        canvas.height = 64;
        ctx.drawImage(img, 0, 0, 64, 64);

        const data = ctx.getImageData(0, 0, 64, 64).data;
        const colorCounts: Record<string, number> = {};

        // Loop through pixels and bucket them
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const a = data[i + 3];

          // Ignore highly transparent pixels
          if (a < 128) continue;

          // Quantize the colors (bucket them into groups of 32 to find dominant areas)
          const qR = Math.round(r / 32) * 32;
          const qG = Math.round(g / 32) * 32;
          const qB = Math.round(b / 32) * 32;

          // Convert to valid 0-255 range after rounding
          const fR = Math.min(255, Math.max(0, qR));
          const fG = Math.min(255, Math.max(0, qG));
          const fB = Math.min(255, Math.max(0, qB));

          const hex =
            "#" +
            [fR, fG, fB].map((x) => x.toString(16).padStart(2, "0")).join("");

          // Try to skip pure white/black which are often just backgrounds
          if (hex !== "#ffffff" && hex !== "#000000") {
            colorCounts[hex] = (colorCounts[hex] || 0) + 1;
          }
        }

        // Sort by frequency and get top 3
        const sortedColors = Object.entries(colorCounts)
          .sort((a, b) => b[1] - a[1])
          .map(([hex]) => hex)
          .slice(0, 3);

        if (sortedColors.length > 0) {
          const themes = [];
          const c1 = sortedColors[0];
          const c2 = sortedColors.length > 1 ? sortedColors[1] : null;
          const c3 = sortedColors.length > 2 ? sortedColors[2] : null;

          if (c1 && c2 && c3) {
            // Logo has 3 colors: generate permutations
            themes.push({
              primary: c1,
              secondary: chroma(c1).set("hsl.l", 0.95).hex(),
              accent: c2,
            });
            themes.push({
              primary: c2,
              secondary: chroma(c2).set("hsl.l", 0.95).hex(),
              accent: c3,
            });
            themes.push({
              primary: c3,
              secondary: chroma(c1).set("hsl.l", 0.95).hex(),
              accent: c1,
            });
          } else if (c1 && c2) {
            // Logo has 2 colors: generate theme variants based on these two
            themes.push({
              primary: c1,
              secondary: chroma(c1).set("hsl.l", 0.95).hex(),
              accent: c2,
            });
            themes.push({
              primary: c2,
              secondary: chroma(c2).set("hsl.l", 0.95).hex(),
              accent: c1,
            });
            themes.push({
              primary: c1,
              secondary: chroma(c2).set("hsl.l", 0.95).hex(),
              accent: chroma(c1).set("hsl.h", "+150").saturate(2).hex(),
            });
          } else {
            // Logo has 1 color: generate monochromatic, analogous, and complementary themes
            themes.push({
              primary: c1,
              secondary: chroma(c1).set("hsl.l", 0.95).hex(),
              accent: chroma(c1).darken(1.5).hex(),
            });
            themes.push({
              primary: c1,
              secondary: chroma(c1)
                .set("hsl.h", "+30")
                .set("hsl.l", 0.95)
                .hex(),
              accent: chroma(c1).set("hsl.h", "-30").saturate(2).hex(),
            });
            themes.push({
              primary: c1,
              secondary: chroma(c1)
                .set("hsl.h", "+180")
                .set("hsl.l", 0.95)
                .hex(),
              accent: chroma(c1).set("hsl.h", "+180").saturate(2).hex(),
            });
          }

          setSuggestedThemes(themes);
          setTheme(themes[0]);
        }
      } catch (error) {
        console.error("Error extracting palette:", error);
      }
    }
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
    { id: "inter", name: "Inter", css: "font-sans", desc: "Modern & Clean" },
    {
      id: "playfair",
      name: "Playfair Display",
      css: "font-serif",
      desc: "Elegant & Classic",
    },
    {
      id: "roboto",
      name: "Roboto",
      css: "font-mono",
      desc: "Technical & Crisp",
    },
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

  const handleFinish = async () => {
    setIsSaving(true);
    try {
      const supabase = createSupabaseBrowserClient();
      const {
        data: { user },
        error: userErr,
      } = await supabase.auth.getUser();

      if (userErr || !user) {
        throw new Error("Unable to determine current user.");
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("tenant_id")
        .eq("id", user.id)
        .maybeSingle();

      const tenantId = profile?.tenant_id;
      if (!tenantId) {
        throw new Error("Tenant context not found for current user.");
      }

      // Upload files (if any) to storage under tenant folder
      const uploaded: Record<string, string> = {};
      const uploads: Array<{ file?: File | null; key: string }> = [
        { file: logoFile, key: "branding_logo_dashboard" },
        { file: kioskFile, key: "branding_kiosk_splash" },
        { file: faviconFile, key: "branding_favicon" },
      ];

      for (const item of uploads) {
        if (item.file) {
          const objectPath = `${tenantId}/${item.key}-${Date.now()}-${item.file.name}`;
          const { error: uploadError } = await supabase.storage
            .from("verification-docs")
            .upload(objectPath, item.file, { upsert: true });
          if (uploadError) throw uploadError;
          const { data: publicUrlData } = supabase.storage
            .from("verification-docs")
            .getPublicUrl(objectPath);
          if (publicUrlData?.publicUrl)
            uploaded[item.key] = publicUrlData.publicUrl;
        }
      }

      // POST payload to server API to persist settings
      const payload = {
        tenantId,
        primaryColor: theme.primary,
        secondaryColor: theme.secondary,
        accentColor: theme.accent,
        fontFamily,
        secondaryFont,
        menuLayout,
        uploaded,
      };

      const resp = await fetch("/api/branding/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!resp.ok) {
        const err = await resp.text();
        throw new Error(err || "Failed to save branding settings.");
      }

      setIsSaving(false);
      router.push("/");
    } catch (err: any) {
      console.error(err);
      setIsSaving(false);
      // eslint-disable-next-line no-alert
      alert(err?.message || "Unable to save branding.");
    }
  };

  const fontClass = fonts.find((f) => f.id === fontFamily)?.css || "font-sans";

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row w-full">
      {/* Left Column - Settings */}
      <div className="w-full md:w-[600px] lg:w-[650px] bg-white border-r border-gray-200 overflow-y-auto h-screen flex flex-col">
        <div className="p-6 md:p-10 flex-1">
          <div className="mb-10">
            <button
              onClick={() => router.push("/")}
              className="flex items-center text-sm font-medium text-text-secondary mb-6 transition-colors rounded-md px-2 py-1 hover:bg-brand-primary/10 hover:text-brand-primary"
            >
              <ArrowLeft size={16} className="mr-2" />
              Skip for now
            </button>
            <h1 className="text-3xl font-bold text-text-primary mb-2">
              Set Up Your Brand
            </h1>
            <p className="text-text-secondary">
              Let's customize how your menus and kiosks will look to your
              customers.
            </p>
          </div>

          <div className="space-y-10 pb-10">
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
                  {presetColors.map((color) => {
                    const presetAccent = chroma(color)
                      .set("hsl.h", "+150")
                      .saturate(2)
                      .hex();
                    const isActive =
                      theme.primary.toLowerCase() === color.toLowerCase();
                    return (
                      <button
                        key={color}
                        onClick={() => handlePresetColor(color)}
                        className={cn(
                          "w-10 h-10 rounded-xl transition-all duration-200 shadow-sm relative overflow-hidden flex",
                          isActive
                            ? "scale-[1.02] border-transparent"
                            : "border-2 border-gray-200 hover:scale-105",
                        )}
                        style={{
                          boxShadow: isActive
                            ? `0 0 0 2px white, 0 0 0 4px ${presetAccent}`
                            : undefined,
                        }}
                        title={`Preset ${color}`}
                      >
                        <div
                          className="w-1/2 h-full"
                          style={{ backgroundColor: color }}
                        />
                        <div className="w-1/2 h-full flex flex-col">
                          <div
                            className="w-full h-1/2"
                            style={{
                              backgroundColor: chroma(color)
                                .set("hsl.l", 0.95)
                                .hex(),
                            }}
                          />
                          <div
                            className="w-full h-1/2"
                            style={{ backgroundColor: presetAccent }}
                          />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Custom Theme Colors */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Primary */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
                    Primary
                  </label>
                  <div className="relative group border border-gray-200 rounded-xl p-2 flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-lg shadow-inner flex items-center justify-center overflow-hidden relative cursor-pointer"
                      style={{ backgroundColor: theme.primary }}
                    >
                      <input
                        type="color"
                        value={theme.primary}
                        onChange={(e) =>
                          setTheme((prev) => ({
                            ...prev,
                            primary: e.target.value,
                          }))
                        }
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                    </div>
                    <input
                      type="text"
                      value={theme.primary.toUpperCase()}
                      onChange={(e) =>
                        setTheme((prev) => ({
                          ...prev,
                          primary: e.target.value,
                        }))
                      }
                      className="text-sm font-mono text-text-primary bg-transparent border-0 w-24 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Secondary */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
                    Secondary
                  </label>
                  <div className="relative group border border-gray-200 rounded-xl p-2 flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-lg shadow-inner flex items-center justify-center overflow-hidden relative cursor-pointer"
                      style={{ backgroundColor: theme.secondary }}
                    >
                      <input
                        type="color"
                        value={theme.secondary}
                        onChange={(e) =>
                          setTheme((prev) => ({
                            ...prev,
                            secondary: e.target.value,
                          }))
                        }
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                    </div>
                    <input
                      type="text"
                      value={theme.secondary.toUpperCase()}
                      onChange={(e) =>
                        setTheme((prev) => ({
                          ...prev,
                          secondary: e.target.value,
                        }))
                      }
                      className="text-sm font-mono text-text-primary bg-transparent border-0 w-24 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Accent */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
                    Accent
                  </label>
                  <div className="relative group border border-gray-200 rounded-xl p-2 flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-lg shadow-inner flex items-center justify-center overflow-hidden relative cursor-pointer"
                      style={{ backgroundColor: theme.accent }}
                    >
                      <input
                        type="color"
                        value={theme.accent}
                        onChange={(e) =>
                          setTheme((prev) => ({
                            ...prev,
                            accent: e.target.value,
                          }))
                        }
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                    </div>
                    <input
                      type="text"
                      value={theme.accent.toUpperCase()}
                      onChange={(e) =>
                        setTheme((prev) => ({
                          ...prev,
                          accent: e.target.value,
                        }))
                      }
                      className="text-sm font-mono text-text-primary bg-transparent border-0 w-24 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Suggested Themes (Only visible if a logo is uploaded) */}
              {suggestedThemes.length > 0 && (
                <div className="pt-4 mt-2">
                  <label className="text-sm font-medium text-text-primary flex items-center gap-2 mb-3">
                    <Sparkles size={16} className="text-brand-accent" />
                    Suggested Themes from Logo
                  </label>
                  <div className="grid grid-cols-1 gap-3">
                    {suggestedThemes.map((t, index) => (
                      <button
                        key={index}
                        onClick={() => setTheme(t)}
                        className={cn(
                          "w-full rounded-2xl border-2 p-3 flex items-center gap-3 transition-all",
                          theme.primary === t.primary &&
                            theme.secondary === t.secondary &&
                            theme.accent === t.accent
                            ? "border-text-primary bg-gray-50 scale-[1.02]"
                            : "border-gray-100 hover:border-gray-200",
                        )}
                      >
                        <div
                          className="flex-1 h-10 rounded-lg shadow-sm"
                          style={{ backgroundColor: t.primary }}
                          title={`Primary: ${t.primary}`}
                        />
                        <div
                          className="flex-1 h-10 rounded-lg shadow-sm"
                          style={{ backgroundColor: t.secondary }}
                          title={`Secondary: ${t.secondary}`}
                        />
                        <div
                          className="flex-1 h-10 rounded-lg shadow-sm"
                          style={{ backgroundColor: t.accent }}
                          title={`Accent: ${t.accent}`}
                        />
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-text-secondary mt-3">
                    Click a theme above to apply the extracted colors from your
                    logo.
                  </p>
                </div>
              )}
            </div>

            {/* Typography */}
            <div className="space-y-4">
              <SectionHeader
                title="Typography"
                className="mb-0 py-2 border-gray-100"
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
                    Primary Font
                  </label>
                  <div className="grid grid-cols-1 gap-3 mt-2">
                    {fonts.map((font) => (
                      <button
                        key={font.id}
                        onClick={() => setFontFamily(font.id)}
                        className={cn(
                          "p-3 rounded-2xl border-2 text-left transition-all flex items-center gap-3",
                          fontFamily === font.id
                            ? "border-text-primary bg-gray-50"
                            : "border-gray-100 hover:border-gray-200 bg-white",
                        )}
                      >
                        <Type
                          size={18}
                          className={
                            fontFamily === font.id
                              ? "text-text-primary"
                              : "text-text-secondary"
                          }
                        />
                        <div>
                          <div className="font-semibold text-text-primary">
                            {font.name}
                          </div>
                          <div className="text-xs text-text-secondary">
                            {font.desc}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
                    Secondary Font
                  </label>
                  <div className="grid grid-cols-1 gap-3 mt-2">
                    {fonts.map((font) => (
                      <button
                        key={`secondary-${font.id}`}
                        onClick={() => setSecondaryFont(font.id)}
                        className={cn(
                          "p-3 rounded-2xl border-2 text-left transition-all flex items-center gap-3",
                          secondaryFont === font.id
                            ? "border-text-primary bg-gray-50"
                            : "border-gray-100 hover:border-gray-200 bg-white",
                        )}
                      >
                        <Type
                          size={18}
                          className={
                            secondaryFont === font.id
                              ? "text-text-primary"
                              : "text-text-secondary"
                          }
                        />
                        <div>
                          <div className="font-semibold text-text-primary">
                            {font.name}
                          </div>
                          <div className="text-xs text-text-secondary">
                            {font.desc}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
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
                        "p-5 rounded-2xl border-2 text-left transition-all flex items-start gap-4",
                        menuLayout === layout.id
                          ? "border-text-primary bg-gray-50"
                          : "border-gray-100 hover:border-gray-200 bg-white",
                      )}
                    >
                      <div
                        className={cn(
                          "p-3 rounded-xl transition-colors",
                          menuLayout === layout.id
                            ? "text-white"
                            : "bg-gray-100 text-text-secondary",
                        )}
                        style={
                          menuLayout === layout.id
                            ? { backgroundColor: theme.primary }
                            : {}
                        }
                      >
                        <Icon size={24} />
                      </div>
                      <div>
                        <span className="font-semibold text-text-primary block mb-1 text-lg">
                          {layout.name}
                        </span>
                        <p className="text-sm text-text-secondary">
                          {layout.desc}
                        </p>
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
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
                <div className="space-y-3">
                  <label className="text-sm font-medium text-text-primary block">
                    Dashboard & Receipt Logo
                  </label>
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-gray-200 rounded-2xl p-6 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer group h-40 relative overflow-hidden"
                  >
                    <input
                      type="file"
                      accept="image/*"
                      ref={fileInputRef}
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                    {logoUrl ? (
                      <img
                        src={logoUrl}
                        alt="Logo preview"
                        ref={imageRef}
                        onLoad={extractColors}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <>
                        <Upload
                          size={24}
                          className="text-gray-400 mb-3 group-hover:text-text-primary transition-colors"
                        />
                        <span className="text-sm font-medium text-text-primary">
                          Upload Logo
                        </span>
                        <span className="text-xs text-text-secondary mt-1">
                          PNG, JPG
                        </span>
                      </>
                    )}
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-sm font-medium text-text-primary block">
                    Kiosk Splash Screen
                  </label>
                  <div
                    onClick={() => kioskInputRef.current?.click()}
                    className="border-2 border-dashed border-gray-200 rounded-2xl p-6 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer group h-40 relative overflow-hidden"
                  >
                    <input
                      type="file"
                      accept="image/*"
                      ref={kioskInputRef}
                      onChange={handleKioskUpload}
                      className="hidden"
                    />
                    {kioskUrl ? (
                      <img
                        src={kioskUrl}
                        alt="Splash preview"
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <>
                        <ImageIcon
                          size={24}
                          className="text-gray-400 mb-3 group-hover:text-text-primary transition-colors"
                        />
                        <span className="text-sm font-medium text-text-primary">
                          Upload Splash
                        </span>
                        <span className="text-xs text-text-secondary mt-1">
                          PNG, JPG
                        </span>
                      </>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-medium text-text-primary block">
                    Favicon
                  </label>
                  <div
                    onClick={() => faviconInputRef.current?.click()}
                    className="border-2 border-dashed border-gray-200 rounded-2xl p-6 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer group h-40"
                  >
                    <input
                      type="file"
                      accept="image/*"
                      ref={faviconInputRef}
                      onChange={handleFaviconUpload}
                      className="hidden"
                    />
                    {faviconUrl ? (
                      <img
                        src={faviconUrl}
                        alt="Favicon preview"
                        className="w-12 h-12 object-contain"
                      />
                    ) : (
                      <>
                        <Globe size={24} className="text-gray-400 mb-3" />
                        <span className="text-sm font-medium text-text-primary">
                          Upload Icon
                        </span>
                        <span className="text-xs text-text-secondary mt-1">
                          32x32
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sticky Footer */}
        <div className="sticky bottom-0 left-0 right-0 p-6 bg-white border-t border-gray-200 flex justify-between items-center shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.05)]">
          <p className="text-sm text-text-secondary hidden sm:block">
            You can always change this later in Settings.
          </p>
          <Button
            variant="primary"
            size="lg"
            onClick={handleFinish}
            disabled={isSaving}
            leftIcon={isSaving ? undefined : <Save size={18} />}
            className="w-full sm:w-auto"
            style={isSaving ? undefined : { backgroundColor: theme.primary }}
          >
            {isSaving ? "Saving..." : "Finish Setup"}
          </Button>
        </div>
      </div>

      {/* Right Column - Live Preview */}
      <div className="flex-1 bg-gray-100 hidden md:flex flex-col items-center justify-center p-8 lg:p-12 relative overflow-hidden">
        {/* Background decorative blob colored by theme */}
        <div
          className="absolute inset-0 opacity-[0.04] transition-colors duration-500"
          style={{ backgroundColor: theme.primary }}
        />
        <div className="w-full max-w-[380px] relative z-10">
          <div className="flex items-center justify-center gap-2 mb-8">
            <Smartphone size={20} className="text-gray-400" />
            <h3 className="text-sm font-bold tracking-widest text-gray-500 uppercase">
              Live Preview
            </h3>
          </div>

          {/* Mobile Phone Mockup */}
          <div
            className={cn(
              "bg-white rounded-[48px] shadow-2xl border-[12px] border-white overflow-hidden flex flex-col relative h-[780px] max-h-[85vh] transition-all duration-300",
              fontClass,
            )}
          >
            {/* Phone Notch */}
            <div className="absolute top-0 inset-x-0 h-7 flex justify-center z-20">
              <div className="w-40 h-6 bg-white rounded-b-3xl shadow-sm"></div>
            </div>

            {/* App Header */}
            <div className="bg-white px-6 pt-14 pb-4 shadow-sm z-10 flex justify-between items-center relative">
              <div>
                <h4 className="font-bold text-xl text-gray-900">Your Menu</h4>
                <p className="text-xs text-gray-500 mt-0.5">Table 12</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                <Menu size={20} className="text-gray-600" />
              </div>
            </div>

            {/* App Body */}
            <div className="flex-1 overflow-y-auto bg-gray-50 p-6 space-y-8 no-scrollbar pb-32">
              {/* Category Pills */}
              <div className="flex gap-3 overflow-x-hidden -mx-2 px-2 pb-2">
                <div
                  className="px-5 py-2.5 rounded-full text-white text-sm font-semibold shadow-sm transition-colors duration-300 whitespace-nowrap"
                  style={{ backgroundColor: theme.primary }}
                >
                  Popular
                </div>
                <div
                  className="px-5 py-2.5 rounded-full text-gray-800 text-sm font-semibold shadow-sm border border-gray-100 whitespace-nowrap transition-colors"
                  style={{ backgroundColor: theme.secondary }}
                >
                  Mains
                </div>
                <div className="px-5 py-2.5 rounded-full bg-white text-gray-600 text-sm font-semibold shadow-sm border border-gray-100 whitespace-nowrap">
                  Drinks
                </div>
              </div>

              {/* Menu Items */}
              <div
                className={cn(
                  "gap-4",
                  menuLayout === "grid" ? "grid grid-cols-2" : "flex flex-col",
                )}
              >
                {[1, 2, 3, 4, 5, 6].map((item) => (
                  <div
                    key={item}
                    className={cn(
                      "bg-white rounded-2xl p-3 shadow-sm border border-gray-100 flex",
                      menuLayout === "grid"
                        ? "flex-col"
                        : "flex-row gap-4 items-center",
                    )}
                  >
                    <div
                      className={cn(
                        "bg-gray-100 rounded-xl",
                        menuLayout === "grid"
                          ? "w-full aspect-square mb-3"
                          : "w-24 h-24 shrink-0",
                      )}
                    />
                    <div className="flex-1 flex flex-col h-full">
                      <h5 className="font-semibold text-gray-900 text-sm mb-1">
                        Signature Dish {item}
                      </h5>
                      {menuLayout === "list" && (
                        <p className="text-xs text-gray-500 mb-2 line-clamp-2">
                          A delicious description of this amazing dish that your
                          customers will love.
                        </p>
                      )}
                      <div className="flex items-center justify-between mt-auto pt-2">
                        <span className="font-bold text-gray-900">$12.99</span>
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-white transition-colors duration-300 shadow-sm"
                          style={{ backgroundColor: theme.accent }}
                        >
                          +
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* App Footer / Cart */}
            <div className="absolute bottom-0 left-0 right-0 bg-white p-5 border-t border-gray-100 shadow-[0_-20px_40px_-15px_rgba(0,0,0,0.05)] z-20">
              <button
                className="w-full py-4 rounded-2xl flex items-center justify-between px-6 text-white font-bold transition-colors duration-300 shadow-lg"
                style={{ backgroundColor: theme.primary }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="bg-white w-7 h-7 rounded-full flex items-center justify-center text-sm"
                    style={{ color: theme.primary }}
                  >
                    2
                  </div>
                  <span className="text-lg">View Order</span>
                </div>
                <span className="text-lg">$25.98</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
