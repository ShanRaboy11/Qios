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
} from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
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

export const TenantStoreSettings = ({
  tenantId,
  initialData,
  brandingData,
  scrollToQrSection = false,
}: TenantStoreSettingsProps) => {
  // --- START OF ORIGINAL LOGIC (UNCHANGED) ---
  const [formData, setFormData] = useState(initialData);
  const [isEditing, setIsEditing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [state, setState] = useState<SettingsActionState>(
    emptySettingsActionState,
  );
  const [isPending, setIsPending] = useState(false);

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
  // --- END OF ORIGINAL LOGIC ---

  // --- NEW ADDITIONAL QR LOGIC ---
  const [storeUrl, setStoreUrl] = useState("");
  const [qrLabelPosition, setQrLabelPosition] = useState<"top" | "bottom">(
    "top",
  );
  const [showBusinessName, setShowBusinessName] = useState(true);
  const [showLogoBadge, setShowLogoBadge] = useState(true);
  const qrSectionRef = useRef<HTMLDivElement>(null);

  const storeNameLabel = useMemo(
    () => formData.storeName?.trim() || "Your Store",
    [formData.storeName],
  );

  useEffect(() => {
    if (!tenantId) {
      setStoreUrl("");
      return;
    }
    // Hardcoded production URL instead of using window.location.origin
    setStoreUrl(`https://qios-exc.vercel.app/${tenantId}/home`);
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

    const canvas = document.createElement("canvas");
    const cardWidth = 1200;
    const cardHeight = 1600;
    canvas.width = cardWidth;
    canvas.height = cardHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, cardWidth, cardHeight);

    const roundRect = (
      x: number,
      y: number,
      w: number,
      h: number,
      r: number,
    ) => {
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

    const drawFancyBadge = (y: number) => {
      const badgeW = 340;
      const badgeH = 76;
      const badgeX = (cardWidth - badgeW) / 2;
      ctx.fillStyle = "#ff5269";
      roundRect(badgeX, y - badgeH / 2, badgeW, badgeH, 38);
      ctx.fill();
      ctx.fillStyle = "#FFFFFF";
      ctx.font = "bold 26px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("S C A N   H E R E", cardWidth / 2, y + 2);
    };

    // 1. Background
    ctx.fillStyle = "#FFFFFF";
    roundRect(0, 0, cardWidth, cardHeight, 100);
    ctx.fill();

    let currentY = 220;

    // 2. Business Name (At the very top)
    if (showBusinessName) {
      ctx.fillStyle = "#2d2d2d";
      ctx.font = "700 90px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(storeNameLabel, cardWidth / 2, currentY);
      currentY += 140;
    }

    // 3. Scan Here Badge (If Position is Top)
    if (qrLabelPosition === "top") {
      drawFancyBadge(currentY);
      currentY += 130;
    } else {
      currentY += 40;
    }

    // 4. QR Container
    const qrBoxSize = 760;
    const qrBoxX = (cardWidth - qrBoxSize) / 2;
    ctx.fillStyle = "#F9FAFB";
    roundRect(qrBoxX, currentY, qrBoxSize, qrBoxSize, 90);
    ctx.fill();

    const qrPadding = 110;
    ctx.drawImage(
      qrImage,
      qrBoxX + qrPadding,
      currentY + qrPadding,
      qrBoxSize - qrPadding * 2,
      qrBoxSize - qrPadding * 2,
    );

    // Logo Center Badge
    if (showLogoBadge) {
      const badgeSize = 145;
      const centerX = cardWidth / 2;
      const centerY = currentY + qrBoxSize / 2;
      ctx.fillStyle = "#FFFFFF";
      ctx.beginPath();
      ctx.arc(centerX, centerY, badgeSize / 2 + 18, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#ff5269";
      ctx.beginPath();
      ctx.arc(centerX, centerY, badgeSize / 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#FFFFFF";
      ctx.font = "bold 80px sans-serif";
      ctx.textAlign = "center"; // Centers horizontally
      ctx.textBaseline = "middle"; // Centers vertically
      ctx.fillText(
        storeNameLabel.charAt(0).toUpperCase(),
        centerX,
        centerY + 6,
      ); // +6 for perfect optical balance
    }

    // 5. Scan Here Badge (If Position is Bottom)
    if (qrLabelPosition === "bottom") {
      drawFancyBadge(currentY + qrBoxSize + 85);
    }

    // 6. Powered by Qios Footer
    const footerY = cardHeight - 140;
    ctx.strokeStyle = "#E5E7EB";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(150, footerY);
    ctx.lineTo(450, footerY);
    ctx.moveTo(750, footerY);
    ctx.lineTo(1050, footerY);
    ctx.stroke();

    ctx.fillStyle = "#6B7280";
    ctx.font = "700 24px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("POWERED BY QIOS", cardWidth / 2, footerY + 8);

    return canvas;
  };

  const downloadCanvas = async (format: "png" | "pdf") => {
    const canvas = await buildQrCanvas();
    if (!canvas) return;

    if (format === "pdf") {
      // 1. Create a PDF with the same dimensions as our high-res canvas
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "px",
        format: [canvas.width, canvas.height],
      });

      // 2. Convert canvas to Image Data
      const imgData = canvas.toDataURL("image/jpeg", 1.0);

      // 3. Add to PDF and save
      pdf.addImage(imgData, "JPEG", 0, 0, canvas.width, canvas.height);
      pdf.save(`qios-qr-${tenantId}.pdf`);
    } else {
      // Original PNG logic
      const link = document.createElement("a");
      link.download = `qios-qr-${tenantId}.png`;
      link.href = canvas.toDataURL("image/png", 1.0);
      link.click();
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 w-full">
      {/* --- FORM SECTION (ORIGINAL UI) --- */}
      <div>
        <h2 className="text-xl font-bold text-text-primary mb-1">
          Store Details
        </h2>
        <p className="text-sm text-text-secondary">
          Configure the business information displayed to customers.
        </p>
      </div>

      <div className="space-y-6 w-full">
        <div className="space-y-4 w-full">
          <SectionHeader
            title="General Information"
            className="mb-0 py-2 border-gray-100"
          />
          <form
            onSubmit={async (event) => {
              event.preventDefault();
              const formData = new FormData(event.currentTarget);
              setIsPending(true);

              try {
                const result = await saveTenantStoreSettings(
                  tenantId,
                  state,
                  formData,
                );
                setState(result);

                if (result.fieldErrors) {
                  setFieldErrors(result.fieldErrors);
                }

                if (result.success) {
                  setIsEditing(false);
                  setShowSuccess(true);
                }
              } catch (error) {
                setState({
                  ...emptySettingsActionState,
                  error:
                    error instanceof Error
                      ? error.message
                      : "Unable to save store settings.",
                });
              } finally {
                setIsPending(false);
              }
            }}
            className="pt-2 w-full space-y-6"
          >
            {showSuccess && state.success && (
              <div className="mb-6 w-full">
                <div className="flex items-center gap-2 w-full text-green-700 bg-green-50 border border-green-100 rounded-xl px-4 py-3">
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  <p className="text-sm font-medium">{state.success}</p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 w-full">
              <div className="space-y-1.5 sm:col-span-2 w-full">
                <label className="text-sm font-medium text-text-primary">
                  Store Name <span className="text-brand-accent">*</span>
                </label>
                <Input
                  name="storeName"
                  value={formData.storeName}
                  onChange={(e) => {
                    setFormData((prev) => ({
                      ...prev,
                      storeName: e.target.value,
                    }));
                    setFieldErrors((prev) => ({ ...prev, storeName: "" }));
                  }}
                  isError={!!fieldErrors.storeName}
                  disabled={!isEditing}
                />
                {fieldErrors.storeName && (
                  <p className="text-xs text-red-500 pl-1 mt-1">
                    {fieldErrors.storeName}
                  </p>
                )}
              </div>

              <div className="space-y-1.5 w-full">
                <label className="text-sm font-medium text-text-primary">
                  Email Address <span className="text-brand-accent">*</span>
                </label>
                <Input
                  name="publicContactEmail"
                  value={formData.publicContactEmail}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      publicContactEmail: e.target.value,
                    }))
                  }
                  disabled={!isEditing}
                />
              </div>

              <div className="space-y-1.5 w-full">
                <label className="text-sm font-medium text-text-primary">
                  Phone Number
                </label>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-text-primary">
                    +63
                  </span>
                  <Input
                    name="publicPhoneNumber"
                    value={formData.publicPhoneNumber}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        publicPhoneNumber: e.target.value
                          .replace(/[^0-9]/g, "")
                          .slice(0, 10),
                      }))
                    }
                    disabled={!isEditing}
                  />
                </div>
              </div>

              <div className="space-y-1.5 sm:col-span-2 w-full">
                <label className="text-sm font-medium text-text-primary">
                  Store Address
                </label>
                <Input
                  name="physicalAddress"
                  value={formData.physicalAddress}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      physicalAddress: e.target.value,
                    }))
                  }
                  disabled={!isEditing}
                />
              </div>
            </div>

            <div className="space-y-4 w-full pt-2">
              <SectionHeader
                title="Localization & Regional"
                className="mb-0 py-2 border-gray-100"
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 w-full">
                <div className="relative z-50 space-y-1.5 w-full">
                  <label className="text-sm font-medium text-text-primary">
                    Currency <span className="text-brand-accent">*</span>
                  </label>
                  <div
                    className={
                      !isEditing ? "opacity-70 pointer-events-none" : ""
                    }
                  >
                    <input
                      type="hidden"
                      name="currency"
                      value={formData.currency}
                    />
                    <Dropdown
                      label=""
                      options={currencyOptions}
                      value={formData.currency}
                      onSelect={(opt) =>
                        setFormData((prev) => ({
                          ...prev,
                          currency: opt.value,
                        }))
                      }
                    />
                  </div>
                </div>
                <div className="relative z-40 space-y-1.5 w-full">
                  <label className="text-sm font-medium text-text-primary">
                    Timezone <span className="text-brand-accent">*</span>
                  </label>
                  <div
                    className={
                      !isEditing ? "opacity-70 pointer-events-none" : ""
                    }
                  >
                    <input
                      type="hidden"
                      name="timezone"
                      value={formData.timezone}
                    />
                    <Dropdown
                      label=""
                      options={timezoneOptions}
                      value={formData.timezone}
                      onSelect={(opt) =>
                        setFormData((prev) => ({
                          ...prev,
                          timezone: opt.value,
                        }))
                      }
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-end w-full">
              {!isEditing ? (
                <Button
                  type="button"
                  variant="outline"
                  shape="rounded"
                  onClick={() => setIsEditing(true)}
                  leftIcon={<Edit2 size={18} />}
                >
                  Edit Store Details
                </Button>
              ) : (
                <div className="flex items-center gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    shape="rounded"
                    onClick={() => {
                      setIsEditing(false);
                      setFormData(initialData);
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

        {/* --- UPDATED QR CUSTOMIZER SECTION --- */}
        <div ref={qrSectionRef} className="space-y-4 w-full pt-6">
          <SectionHeader
            title="Store Access & QR Code"
            className="mb-0 py-2 border-gray-100"
          />
          <div className="grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-8">
            {/* Live Preview Column */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-bold text-text-primary px-1">
                <Layout size={18} className="text-brand-accent" /> Live Preview
              </div>
              <div className="bg-white border border-gray-100 rounded-[3rem] p-10 shadow-sm flex flex-col items-center justify-center text-center relative min-h-[550px] gap-y-6">
                {/* SEQUENCE: 1. Business Name */}
                {showBusinessName && (
                  <div className="text-3xl font-bold text-text-primary tracking-tight px-2">
                    {storeNameLabel}
                  </div>
                )}

                {/* SEQUENCE: 2. Badge (Top Position) */}
                {qrLabelPosition === "top" && (
                  <div
                    className="px-6 py-2 rounded-full text-[10px] font-bold text-white uppercase tracking-widest animate-in slide-in-from-top-1"
                    style={{ backgroundColor: brandingData.accentColor }}
                  >
                    Scan here
                  </div>
                )}

                {/* SEQUENCE: 3. QR Image Box */}
                <div className="relative p-6 bg-gray-50 rounded-[2.5rem] border border-gray-100">
                  <QRCode
                    id="store-qr-code"
                    value={storeUrl || "https://qios.com"}
                    size={180}
                    level="H"
                    bgColor="transparent"
                  />
                  {showLogoBadge && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div
                        className="h-12 w-12 rounded-full text-white text-lg font-bold shadow-xl border-4 border-white flex items-center justify-center"
                        style={{ backgroundColor: brandingData.accentColor }}
                      >
                        {storeNameLabel.charAt(0).toUpperCase()}
                      </div>
                    </div>
                  )}
                </div>

                {/* SEQUENCE: 4. Badge (Bottom Position) */}
                {qrLabelPosition === "bottom" && (
                  <div
                    className="px-6 py-2 rounded-full text-[10px] font-bold text-white uppercase tracking-widest animate-in slide-in-from-bottom-1"
                    style={{ backgroundColor: brandingData.accentColor }}
                  >
                    Scan here
                  </div>
                )}

                {/* SEQUENCE: 5. Footer */}
                <div className="flex items-center gap-3 w-full mt-4">
                  <div className="h-px flex-1 bg-gray-100" />
                  <span className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.3em]">
                    Powered by Qios
                  </span>
                  <div className="h-px flex-1 bg-gray-100" />
                </div>
              </div>
            </div>

            {/* Controls Panel */}
            <div className="space-y-6">
              <div className="bg-gray-50/50 border border-gray-100 rounded-[2rem] p-8 space-y-8">
                <div>
                  <h3 className="text-lg font-bold text-text-primary">
                    Download Settings
                  </h3>
                  <p className="text-sm text-text-secondary">
                    Customize your QR card appearance for printing.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <p className="text-xs font-bold text-text-secondary uppercase tracking-widest">
                      Label Position
                    </p>
                    <div className="flex flex-col gap-2">
                      {(["top", "bottom"] as const).map((pos) => (
                        <label
                          key={pos}
                          className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                            qrLabelPosition === pos
                              ? "border-brand-primary bg-brand-primary/5"
                              : "border-gray-200 bg-white hover:border-brand-primary/50"
                          }`}
                        >
                          <div
                            className={`w-4 h-4 rounded-full border flex items-center justify-center ${qrLabelPosition === pos ? "border-brand-primary" : "border-gray-300"}`}
                          >
                            {qrLabelPosition === pos && (
                              <div className="w-2 h-2 rounded-full bg-brand-primary" />
                            )}
                          </div>
                          <span className="text-sm font-semibold text-text-primary capitalize">
                            {pos}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <p className="text-xs font-bold text-text-secondary uppercase tracking-widest">
                      Visibility
                    </p>
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-between p-3 rounded-xl border border-gray-200 bg-white">
                        <span className="text-sm font-semibold text-text-primary">
                          Business Name
                        </span>
                        <Toggle
                          isOn={showBusinessName}
                          onChange={(val) => setShowBusinessName(val)}
                        />
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-xl border border-gray-200 bg-white">
                        <span className="text-sm font-semibold text-text-primary">
                          Logo Badge
                        </span>
                        <Toggle
                          isOn={showLogoBadge}
                          onChange={(val) => setShowLogoBadge(val)}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-200 space-y-4">
                  <div className="w-full relative">
                    <Input
                      value={storeUrl}
                      readOnly
                      className="pr-12 text-xs bg-white h-12 rounded-xl"
                    />
                    <button
                      type="button"
                      onClick={() => navigator.clipboard.writeText(storeUrl)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary hover:text-brand-accent transition-colors"
                    >
                      <Copy size={18} />
                    </button>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 w-full">
                    <Button
                      type="button"
                      variant="primary"
                      shape="rounded"
                      className="flex-1"
                      onClick={() => downloadCanvas("png")}
                      leftIcon={<Download size={18} />}
                    >
                      Download PNG
                    </Button>
                    <Button
                      type="button"
                      variant="accent"
                      shape="rounded"
                      className="flex-1"
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
