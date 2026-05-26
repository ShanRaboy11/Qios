"use client";

import React, { useEffect, useMemo, useState, useRef } from "react";
import {
  Save,
  CheckCircle2,
  Edit2,
  Download,
  QrCode,
  Copy,
  Layout,
  Palette,
} from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
import { Radio } from "@/components/atoms/Radio";
import { Dropdown } from "@/components/molecules/Dropdown";
import QRCode from "react-qr-code";
import { SectionHeader } from "@/components/molecules/SectionHeader";
import { saveTenantStoreSettings } from "@/app/(tenant)/[id]/settings/actions";
import { jsPDF } from "jspdf";
import {
  emptySettingsActionState,
  type SettingsActionState,
  type TenantStoreSettingsData,
  type TenantBrandingSettingsData,
} from "@/app/(tenant)/[id]/settings/types";
import { Toggle } from "@/components/atoms/Toggle";

interface TenantStoreSettingsProps {
  tenantId: string;
  initialData: TenantStoreSettingsData;
  brandingData: TenantBrandingSettingsData;
  scrollToQrSection?: boolean;
}

// Helper to determine if text should be white or black based on background brightness
const getContrastColor = (hexcolor: string) => {
  if (!hexcolor || hexcolor.startsWith("linear")) return "#FFFFFF";
  const hex = hexcolor.replace("#", "");
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 128 ? "#111827" : "#FFFFFF";
};

export const TenantStoreSettings = ({
  tenantId,
  initialData,
  brandingData,
  scrollToQrSection = false,
}: TenantStoreSettingsProps) => {
  const [formData, setFormData] = useState(initialData);
  const [isEditing, setIsEditing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [state, setState] = useState<SettingsActionState>(
    emptySettingsActionState,
  );
  const [isPending, setIsPending] = useState(false);

  const safeHex = (value: string | undefined, fallback: string) =>
    /^#[0-9A-Fa-f]{6}$/.test(value ?? "") ? (value as string) : fallback;

  // Pulling directly from Branding & Appearance logic
  const brandPalette = {
    primary: safeHex(brandingData.primaryColor, "#ffc670"),
    secondary: safeHex(brandingData.secondaryColor, "#fff9ef"),
    accent: safeHex(brandingData.accentColor, "#ff5269"), 
  };

  // Dynamically generate themes based on Branding & Appearance Tab
  const QR_THEMES = useMemo(() => [
    { 
      id: "brand-primary", 
      name: "Brand Primary", 
      bg: brandPalette.primary, 
      text: getContrastColor(brandPalette.primary), 
      secondary: "rgba(255,255,255,0.2)", 
      isGradient: false 
    },
    { 
      id: "brand-gradient", 
      name: "Brand Gradient", 
      bg: `linear-gradient(135deg, ${brandPalette.primary} 0%, ${brandPalette.accent} 100%)`, 
      text: "#FFFFFF", 
      secondary: "rgba(255,255,255,0.2)", 
      isGradient: true, 
      colors: [brandPalette.primary, brandPalette.accent] 
    },
    { 
      id: "brand-accent", 
      name: "Brand Accent", 
      bg: brandPalette.accent, 
      text: getContrastColor(brandPalette.accent), 
      secondary: "rgba(255,255,255,0.2)", 
      isGradient: false 
    },
    { 
      id: "brand-soft", 
      name: "Brand Soft", 
      bg: brandPalette.secondary, 
      text: getContrastColor(brandPalette.secondary), 
      secondary: "rgba(0,0,0,0.05)", 
      isGradient: false 
    },
  ], [brandPalette]);

  // QR Customization State
  const [selectedTheme, setSelectedTheme] = useState(QR_THEMES[0]);
  const [qrLabelPosition, setQrLabelPosition] = useState<"Top" | "Bottom">("Top");
  const [showBusinessName, setShowBusinessName] = useState(true);
  const [showLogoBadge, setShowLogoBadge] = useState(true);
  const [storeUrl, setStoreUrl] = useState("");
  const qrSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  useEffect(() => {
    if (state.fieldErrors) {
      setFieldErrors(state.fieldErrors);
    }
  }, [state.fieldErrors]);

  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showSuccess]);

  const currencyOptions = [
    { label: "PHP (₱)", value: "PHP" },
    { label: "USD ($)", value: "USD" },
    { label: "EUR (€)", value: "EUR" },
    { label: "GBP (£)", value: "GBP" },
    { label: "JPY (¥)", value: "JPY" },
    { label: "AUD (A$)", value: "AUD" },
    { label: "CAD (C$)", value: "CAD" },
    { label: "SGD (S$)", value: "SGD" },
  ];

  const timezoneOptions = [
    { label: "Asia/Manila (GMT+8)", value: "Asia/Manila" },
    { label: "Asia/Tokyo (GMT+9)", value: "Asia/Tokyo" },
    { label: "Asia/Singapore (GMT+8)", value: "Asia/Singapore" },
    { label: "Australia/Sydney (GMT+10)", value: "Australia/Sydney" },
    { label: "Europe/London (GMT)", value: "Europe/London" },
    { label: "America/New_York (GMT-5)", value: "America/New_York" },
    { label: "America/Los_Angeles (GMT-8)", value: "America/Los_Angeles" },
    { label: "UTC", value: "UTC" },
  ];

  const dashboardLogoUrl = brandingData.dashboardLogoUrl?.trim() || "";

  const loadImageFromUrl = async (url: string) => {
    try {
      const response = await fetch(url);
      if (!response.ok) return null;
      const objectUrl = URL.createObjectURL(await response.blob());
      return await new Promise<HTMLImageElement | null>((resolve) => {
        const image = new Image();
        image.onload = () => {
          URL.revokeObjectURL(objectUrl);
          resolve(image);
        };
        image.onerror = () => {
          URL.revokeObjectURL(objectUrl);
          resolve(null);
        };
        image.src = objectUrl;
      });
    } catch {
        return null;
    }
  };

  const storeNameLabel = useMemo(
    () => formData.storeName?.trim() || "Your Store",
    [formData.storeName],
  );

   useEffect(() => {
    if (!tenantId) {
      setStoreUrl("");
      return;
    }
    const origin = window.location.origin;
    setStoreUrl(`${origin}/${tenantId}/home`);
  }, [tenantId]);
  
  useEffect(() => {
    if (!scrollToQrSection) return;
    const timer = window.setTimeout(() => {
      qrSectionRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 150);
    return () => window.clearTimeout(timer);
  }, [scrollToQrSection]);

  const getQrSvgImage = async (): Promise<HTMLImageElement | null> => {
    const svg = document.getElementById("store-qr-code");
    if (!svg) return null;
    const svgData = new XMLSerializer().serializeToString(svg);
    const svgBlob = new Blob([svgData], {
      type: "image/svg+xml;charset=utf-8",
    });
    const url = URL.createObjectURL(svgBlob);
    const img = new Image();
    return new Promise((resolve) => {
      img.onload = () => {
        URL.revokeObjectURL(url);
        resolve(img);
      };
      img.src = url;
    });
  };

  const buildQrCanvas = async () => {
    await document.fonts.ready;
    const qrImage = await getQrSvgImage();
    if (!qrImage) return null;
    const logoImage = dashboardLogoUrl ? await loadImageFromUrl(dashboardLogoUrl) : null;

    const canvas = document.createElement("canvas");
    const cardWidth = 1200;
    const cardHeight = 1600;
    canvas.width = cardWidth;
    canvas.height = cardHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    const roundRect = (x: number, y: number, w: number, h: number, r: number) => {
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.lineTo(x + w - r, y);
      ctx.quadraticCurveTo(x + w, y, x + w, y + r);
      ctx.lineTo(x + w, y + h - r);
      ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
      ctx.lineTo(x + r, y + h);
      ctx.quadraticCurveTo(x, y + h, x, y + h - r);
      ctx.lineTo(x, y + r);
      ctx.quadraticCurveTo(x, y, x + r, y);
      ctx.closePath();
    };

    if (selectedTheme.isGradient && selectedTheme.colors) {
      const gradient = ctx.createLinearGradient(0, 0, cardWidth, cardHeight);
      gradient.addColorStop(0, selectedTheme.colors[0]);
      gradient.addColorStop(1, selectedTheme.colors[1]);
      ctx.fillStyle = gradient;
    } else {
      ctx.fillStyle = selectedTheme.bg;
    }
    roundRect(0, 0, cardWidth, cardHeight, 100);
    ctx.fill();

    // SPACING FIX: Consistent top-down sequence
    let currentY = 220;

    if (showBusinessName) {
      ctx.fillStyle = selectedTheme.text;
      ctx.font = "bold 90px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(storeNameLabel.toUpperCase(), cardWidth / 2, currentY);
      currentY += 160;
    } else {
      currentY += 80;
    }

    const drawFancyBadge = (y: number) => {
      const badgeW = 380;
      const badgeH = 86;
      const badgeX = (cardWidth - badgeW) / 2;
      // High-contrast logic for badge based on theme text color
      ctx.fillStyle = selectedTheme.text === "#FFFFFF" ? "rgba(255,255,255,0.9)" : brandPalette.accent;
      roundRect(badgeX, y - badgeH / 2, badgeW, badgeH, 43);
      ctx.fill();
      ctx.fillStyle = selectedTheme.text === "#FFFFFF" ? "#000000" : "#FFFFFF";
      ctx.font = "bold 28px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("SCAN TO ORDER", cardWidth / 2, y + 2);
    };

    if (qrLabelPosition === "Top") {
      drawFancyBadge(currentY);
      currentY += 150; 
    } else {
      currentY += 40;
    }

    const qrBoxSize = 800;
    const qrBoxX = (cardWidth - qrBoxSize) / 2;
    ctx.fillStyle = selectedTheme.id === "brand-soft" ? "rgba(0,0,0,0.05)" : "rgba(255,255,255,0.15)";
    roundRect(qrBoxX, currentY, qrBoxSize, qrBoxSize, 100);
    ctx.fill();

    const qrInnerPadding = 60;
    const qrWhiteSize = qrBoxSize - qrInnerPadding * 2;
    ctx.fillStyle = "#FFFFFF";
    roundRect(qrBoxX + qrInnerPadding, currentY + qrInnerPadding, qrWhiteSize, qrWhiteSize, 60);
    ctx.fill();

    ctx.drawImage(
      qrImage,
      qrBoxX + qrInnerPadding + 40,
      currentY + qrInnerPadding + 40,
      qrWhiteSize - 80,
      qrWhiteSize - 80
    );

    if (showLogoBadge) {
      const badgeSize = 160;
      const centerX = cardWidth / 2;
      const centerY = currentY + qrBoxSize / 2;
      ctx.fillStyle = "#FFFFFF";
      ctx.beginPath();
      ctx.arc(centerX, centerY, badgeSize / 2 + 15, 0, Math.PI * 2);
      ctx.fill();
      
      if (logoImage) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(centerX, centerY, badgeSize / 2, 0, Math.PI * 2);
        ctx.clip();
        ctx.drawImage(logoImage, centerX - badgeSize/2, centerY - badgeSize/2, badgeSize, badgeSize);
        ctx.restore();
      } else {
        ctx.fillStyle = brandPalette.accent;
        ctx.beginPath();
        ctx.arc(centerX, centerY, badgeSize / 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#FFFFFF";
        ctx.font = "bold 90px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("Q", centerX, centerY + 5);
      }
    }

    if (qrLabelPosition === "Bottom") {
      drawFancyBadge(currentY + qrBoxSize + 110);
    }

    const footerY = cardHeight - 120;
    ctx.fillStyle = selectedTheme.text;
    ctx.globalAlpha = 0.6;
    ctx.font = "bold 24px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("POWERED BY QIOS.COM", cardWidth / 2, footerY);
    ctx.globalAlpha = 1.0;

    return canvas;
  };

  const downloadCanvas = async (format: "png" | "pdf") => {
    const canvas = await buildQrCanvas();
    if (!canvas) return;
    if (format === "pdf") {
      const pdf = new jsPDF({ orientation: "portrait", unit: "px", format: [canvas.width, canvas.height] });
      const imgData = canvas.toDataURL("image/jpeg", 1.0);
      pdf.addImage(imgData, "JPEG", 0, 0, canvas.width, canvas.height);
      pdf.save(`qios-qr-${tenantId}.pdf`);
    } else {
      const link = document.createElement("a");
      link.download = `qios-qr-${tenantId}.png`;
      link.href = canvas.toDataURL("image/png", 1.0);
      link.click();
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 w-full">
      {/* --- FORM SECTION (Unchanged) --- */}
      <div>
        <h2 className="text-xl font-bold text-text-primary mb-1">Store Details</h2>
        <p className="text-sm text-text-secondary">Configure the business information displayed to customers.</p>
      </div>

      <div className="space-y-6 w-full">
        <div className="space-y-4 w-full">
          <SectionHeader title="General Information" className="mb-0 py-2 border-gray-100" />
          <form
            onSubmit={async (event) => {
              event.preventDefault();
              const formData = new FormData(event.currentTarget);
              setIsPending(true);
              try {
                const result = await saveTenantStoreSettings(tenantId, state, formData);
                setState(result);
                if (result.fieldErrors) setFieldErrors(result.fieldErrors);
                if (result.success) {
                  setIsEditing(false);
                  setShowSuccess(true);
                }
              } catch (error) {
                setState({ ...emptySettingsActionState, error: "Unable to save store settings." });
              } finally {
                setIsPending(false);
              }
            }}
            className="pt-2 w-full space-y-6"
          >
            {showSuccess && state.success && (
              <div className="mb-6 w-full text-green-700 bg-green-50 border border-green-100 rounded-xl px-4 py-3 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <p className="text-sm font-medium">{state.success}</p>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 w-full">
              <div className="space-y-1.5 sm:col-span-2 w-full">
                <label className="text-sm font-medium text-text-primary">Store Name <span className="text-brand-accent">*</span></label>
                <Input
                  name="storeName"
                  value={formData.storeName}
                  onChange={(e) => {
                    setFormData((prev) => ({ ...prev, storeName: e.target.value }));
                    setFieldErrors((prev) => ({ ...prev, storeName: "" }));
                  }}
                  isError={!!fieldErrors.storeName}
                  disabled={!isEditing}
                />
              </div>

              <div className="space-y-1.5 w-full">
                <label className="text-sm font-medium text-text-primary">Email Address <span className="text-brand-accent">*</span></label>
                <Input
                  name="publicContactEmail"
                  value={formData.publicContactEmail}
                  onChange={(e) => setFormData((prev) => ({ ...prev, publicContactEmail: e.target.value }))}
                  disabled={!isEditing}
                />
              </div>

              <div className="space-y-1.5 w-full">
                <label className="text-sm font-medium text-text-primary">Phone Number</label>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-text-primary">+63</span>
                  <Input
                    name="publicPhoneNumber"
                    value={formData.publicPhoneNumber}
                    onChange={(e) => setFormData((prev) => ({ ...prev, publicPhoneNumber: e.target.value.replace(/[^0-9]/g, "").slice(0, 10) }))}
                    disabled={!isEditing}
                  />
                </div>
              </div>

              <div className="space-y-1.5 sm:col-span-2 w-full">
                <label className="text-sm font-medium text-text-primary">Store Address</label>
                <Input
                  name="physicalAddress"
                  value={formData.physicalAddress}
                  onChange={(e) => setFormData((prev) => ({ ...prev, physicalAddress: e.target.value }))}
                  disabled={!isEditing}
                />
              </div>
            </div>

            <div className="space-y-4 w-full pt-2">
              <SectionHeader title="Localization & Regional" className="mb-0 py-2 border-gray-100" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 w-full">
                <div className="relative z-50 space-y-1.5 w-full">
                  <label className="text-sm font-medium text-text-primary">Currency <span className="text-brand-accent">*</span></label>
                  <div className={!isEditing ? "opacity-70 pointer-events-none" : ""}>
                    <input type="hidden" name="currency" value={formData.currency} />
                    <Dropdown
                      label=""
                      options={currencyOptions}
                      value={formData.currency}
                      onSelect={(opt) => setFormData((prev) => ({ ...prev, currency: opt.value }))}
                    />
                  </div>
                </div>
                <div className="relative z-40 space-y-1.5 w-full">
                  <label className="text-sm font-medium text-text-primary">Timezone <span className="text-brand-accent">*</span></label>
                  <div className={!isEditing ? "opacity-70 pointer-events-none" : ""}>
                    <input type="hidden" name="timezone" value={formData.timezone} />
                    <Dropdown
                      label=""
                      options={timezoneOptions}
                      value={formData.timezone}
                      onSelect={(opt) => setFormData((prev) => ({ ...prev, timezone: opt.value }))}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-end w-full">
              {!isEditing ? (
                <Button type="button" variant="outline" shape="rounded" onClick={() => setIsEditing(true)} leftIcon={<Edit2 size={18} />}>Edit Store Details</Button>
              ) : (
                <div className="flex items-center gap-3">
                  <Button type="button" variant="outline" shape="rounded" onClick={() => { setIsEditing(false); setFormData(initialData); }} disabled={isPending}>Cancel</Button>
                  <Button type="submit" variant="accent" shape="rounded" leftIcon={<Save size={18} />} loading={isPending}>Save Changes</Button>
                </div>
              )}
            </div>
          </form>
        </div>

        {/* --- BRANDED QR CUSTOMIZER SECTION --- */}
        <div ref={qrSectionRef} className="space-y-4 w-full pt-10">
          <SectionHeader title="Branded QR Customizer" className="mb-0 py-2 border-gray-100" />
          <div className="grid grid-cols-1 lg:grid-cols-[450px_1fr] gap-10">
            
            {/* Live Preview Column */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-text-primary flex items-center gap-2 px-1">
                <Layout size={18} className="text-brand-accent" /> Live Preview
              </h3>
              
              <div 
                className="rounded-[3.5rem] p-12 shadow-2xl flex flex-col items-center justify-between text-center relative min-h-[600px] transition-all duration-500 overflow-hidden"
                style={{ 
                    background: selectedTheme.bg,
                    color: selectedTheme.text
                }}
              >
                {selectedTheme.isGradient && (
                    <>
                        <div className="absolute -top-20 -left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
                        <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-black/10 rounded-full blur-3xl" />
                    </>
                )}

                {showBusinessName && (
                  <div className="text-3xl font-black uppercase tracking-tight px-2 z-10">
                    {storeNameLabel}
                  </div>
                )}

                <div className="flex flex-col items-center gap-6 z-10 w-full">
                    {qrLabelPosition === "Top" && (
                    <div
                        className="px-8 py-3 rounded-full text-xs font-black uppercase tracking-[0.2em] shadow-lg animate-in slide-in-from-top-2"
                        style={{ 
                            backgroundColor: selectedTheme.text === "#FFFFFF" ? "rgba(255,255,255,0.9)" : brandPalette.accent,
                            color: selectedTheme.text === "#FFFFFF" ? "#000" : "#FFF"
                        }}
                    >
                        Scan to Order
                    </div>
                    )}

                    <div
                    className="relative p-8 rounded-[3rem] shadow-inner backdrop-blur-md"
                    style={{ backgroundColor: selectedTheme.secondary }}
                    >
                        <div className="bg-white p-6 rounded-[2rem]">
                            <QRCode
                                id="store-qr-code"
                                value={storeUrl || "https://qios.com"}
                                size={180}
                                level="H"
                                bgColor="#FFFFFF"
                                fgColor="#000000"
                            />
                        </div>
                    
                        {showLogoBadge && (
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="h-16 w-16 rounded-full bg-white shadow-2xl border-4 border-white flex items-center justify-center overflow-hidden">
                                {dashboardLogoUrl ? (
                                <img src={dashboardLogoUrl} alt="Logo" className="h-10 w-10 object-contain" />
                                ) : (
                                <div 
                                  className="h-full w-full flex items-center justify-center text-white font-bold text-2xl" 
                                  style={{ backgroundColor: brandPalette.accent }}
                                >
                                  Q
                                </div>
                                )}
                            </div>
                            </div>
                        )}
                    </div>

                    {qrLabelPosition === "Bottom" && (
                    <div
                        className="px-8 py-3 rounded-full text-xs font-black uppercase tracking-[0.2em] shadow-lg animate-in slide-in-from-bottom-2"
                        style={{ 
                            backgroundColor: selectedTheme.text === "#FFFFFF" ? "rgba(255,255,255,0.9)" : brandPalette.accent,
                            color: selectedTheme.text === "#FFFFFF" ? "#000" : "#FFF"
                        }}
                    >
                        Scan to Order
                    </div>
                    )}
                </div>

                <div className="z-10 opacity-60 text-[10px] font-bold uppercase tracking-[0.4em] mt-4">
                  Powered by Qios.com
                </div>
              </div>
            </div>

            {/* Customization Column */}
            <div className="space-y-6">
              <div className="bg-white border border-gray-100 rounded-[2.5rem] p-8 shadow-sm space-y-10">
                
                {/* Brand Theme Selector */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Palette size={18} className="text-brand-accent" />
                    <h3 className="text-lg font-bold text-text-primary">Background Theme</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {QR_THEMES.map((theme) => (
                      <button
                        key={theme.id}
                        onClick={() => setSelectedTheme(theme)}
                        className={`p-3 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${
                          selectedTheme.id === theme.id ? "border-brand-accent bg-brand-accent/5" : "border-gray-100 hover:border-gray-200"
                        }`}
                      >
                        <div 
                          className="h-10 w-full rounded-lg shadow-sm" 
                          style={{ background: theme.bg }} 
                        />
                        <span className="text-xs font-bold">{theme.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <label className="text-sm font-bold text-text-primary block">Label Position</label>
                    <div className="flex flex-col gap-3">
                      {(["Top", "Bottom"] as const).map((pos) => (
                        <div 
                          key={pos} 
                          onClick={() => setQrLabelPosition(pos)}
                          className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${qrLabelPosition === pos ? 'border-brand-accent bg-brand-accent/5' : 'border-gray-100'}`}
                        >
                          <Radio name="qrLabelPosition" checked={qrLabelPosition === pos} readOnly />
                          <span className="text-sm font-medium">{pos} Side</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-sm font-bold text-text-primary block">Card Content</label>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 rounded-xl border border-gray-100">
                        <span className="text-sm font-medium">Business Name</span>
                        <Toggle variant="accent" isOn={showBusinessName} onChange={setShowBusinessName} />
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-xl border border-gray-100">
                        <span className="text-sm font-medium">Center Logo</span>
                        <Toggle variant="accent" isOn={showLogoBadge} onChange={setShowLogoBadge} />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-8 border-t border-gray-100 space-y-4">
                   <div className="w-full relative">
                    <Input value={storeUrl} readOnly className="pr-12 text-xs bg-gray-50 h-12 rounded-xl border-none" />
                    <button
                      type="button"
                      onClick={() => navigator.clipboard.writeText(storeUrl)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary hover:text-brand-primary transition-colors"
                    >
                      <Copy size={18} />
                    </button>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                      type="button"
                      variant="primary"
                      shape="rounded"
                      className="flex-1 py-6"
                      onClick={() => downloadCanvas("png")}
                      leftIcon={<Download size={18} />}
                    >
                      Download PNG
                    </Button>
                    <Button
                      type="button"
                      variant="accent"
                      shape="rounded"
                      className="flex-1 py-6"
                      onClick={() => downloadCanvas("pdf")}
                      leftIcon={<Download size={18} />}
                    >
                      Download PDF
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};