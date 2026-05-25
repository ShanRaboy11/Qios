import React, { useEffect, useState, useRef } from "react";
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
  Plus,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
import { SectionHeader } from "@/components/molecules/SectionHeader";
import { cn } from "@/lib/utils";
import {
  saveTenantBrandingSettings,
  saveTenantCustomThemes,
} from "@/app/(tenant)/[id]/settings/actions";
import {
  emptySettingsActionState,
  type SettingsActionState,
  type TenantBrandingSettingsData,
} from "@/app/(tenant)/[id]/settings/types";

interface TenantBrandingSettingsProps {
  tenantId: string;
  initialData: TenantBrandingSettingsData;
}

const safeHex = (val: string) =>
  /^#[0-9A-Fa-f]{6}$/.test(val) ? val : "#000000";

export const TenantBrandingSettings = ({
  tenantId,
  initialData,
}: TenantBrandingSettingsProps) => {
  const presetThemes = [
    { primary: "#FFC670", secondary: "#FFF9F0", accent: "#00FFFF" },
    { primary: "#3B82F6", secondary: "#EFF6FF", accent: "#F59E0B" },
    { primary: "#10B981", secondary: "#ECFDF5", accent: "#F43F5E" },
    { primary: "#EF4444", secondary: "#FEF2F2", accent: "#3B82F6" },
    { primary: "#8B5CF6", secondary: "#F5F3FF", accent: "#10B981" },
    { primary: "#F97316", secondary: "#FFF7ED", accent: "#06B6D4" },
  ];

  const isMatch = (t1: any, t2: any) =>
    t1.primary.toLowerCase() === t2.primary.toLowerCase() &&
    t1.secondary.toLowerCase() === t2.secondary.toLowerCase() &&
    t1.accent.toLowerCase() === t2.accent.toLowerCase();

  const [customThemes, setCustomThemes] = useState<
    { id: string; primary: string; secondary: string; accent: string }[]
  >(() => {
    // start with any themes from the database
    let themes = initialData.customThemes ? [...initialData.customThemes] : [];

    // if the currently saved theme in the db doesn't match any preset and isn't already in customthemes,
    // we inject it as a "draft" custom theme
    const initTheme = {
      primary: initialData.primaryColor || "#FFC670",
      secondary: initialData.secondaryColor || "#FFF9F0",
      accent: initialData.accentColor || "#00FFFF",
    };
    const isPreset = presetThemes.some((p) => isMatch(p, initTheme));
    const isAlreadyCustom = themes.some((t) => isMatch(t, initTheme));
    if (!isPreset && !isAlreadyCustom) {
      themes.push({ id: `custom-${Date.now()}`, ...initTheme });
    }
    return themes;
  });

  const [activeThemeId, setActiveThemeId] = useState<string>(() => {
    const initTheme = {
      primary: initialData.primaryColor || "#FFC670",
      secondary: initialData.secondaryColor || "#FFF9F0",
      accent: initialData.accentColor || "#00FFFF",
    };
    const presetIndex = presetThemes.findIndex((p) => isMatch(p, initTheme));
    if (presetIndex !== -1) return `preset-${presetIndex}`;

    // check if it matches any custom theme
    const customMatch = customThemes.find((t) => isMatch(t, initTheme));
    if (customMatch) return customMatch.id;

    return customThemes.length > 0
      ? customThemes[customThemes.length - 1].id
      : "custom-0";
  });

  const [theme, setTheme] = useState({
    primary: initialData.primaryColor || "#FFC670",
    secondary: initialData.secondaryColor || "#FFF9F0",
    accent: initialData.accentColor || "#00FFFF",
  });

  const isCustomSelected = activeThemeId.startsWith("custom-");

  const [fontFamily, setFontFamily] = useState(
    initialData.fontFamily || "inter",
  );
  const [secondaryFont, setSecondaryFont] = useState(
    initialData.secondaryFont || "inter",
  );
  const [menuLayout, setMenuLayout] = useState(
    initialData.menuLayout || "grid",
  );

  const [qiosSubdomain, setQiosSubdomain] = useState(
    initialData.qiosSubdomain || "",
  );
  const [customDomain, setCustomDomain] = useState(
    initialData.customDomain || "",
  );
  const [instagramUrl, setInstagramUrl] = useState(
    initialData.instagramUrl || "",
  );
  const [facebookUrl, setFacebookUrl] = useState(initialData.facebookUrl || "");
  const [tiktokUrl, setTiktokUrl] = useState(initialData.tiktokUrl || "");

  const [dashboardLogoPreview, setDashboardLogoPreview] = useState<
    string | null
  >(initialData.dashboardLogoUrl || null);
  const [kioskSplashPreview, setKioskSplashPreview] = useState<string | null>(
    initialData.kioskSplashUrl || null,
  );
  const [faviconPreview, setFaviconPreview] = useState<string | null>(
    initialData.faviconUrl || null,
  );

  const [isEditing, setIsEditing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const formRef = useRef<HTMLFormElement>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  const [state, setState] = useState<SettingsActionState>(
    emptySettingsActionState,
  );
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    if (isEditing) return; // prevent resetting while editing (e.g. after saving custom themes)

    const initTheme = {
      primary: initialData.primaryColor || "#FFC670",
      secondary: initialData.secondaryColor || "#FFF9F0",
      accent: initialData.accentColor || "#00FFFF",
    };
    const presetIndex = presetThemes.findIndex((p) => isMatch(p, initTheme));

    if (presetIndex !== -1) {
      setActiveThemeId(`preset-${presetIndex}`);
    } else {
      let activeCustomId = "custom-0";
      const customMatch = (initialData.customThemes || []).find((t) =>
        isMatch(t, initTheme),
      );
      if (customMatch) {
        activeCustomId = customMatch.id;
      } else {
        const fallbackId = `custom-${Date.now()}`;
        setCustomThemes((prev) => {
          if (!prev.some((t) => isMatch(t, initTheme))) {
            return [...prev, { id: fallbackId, ...initTheme }];
          }
          return prev;
        });
        activeCustomId = fallbackId;
      }
      setActiveThemeId(activeCustomId);
    }
    setTheme(initTheme);

    setFontFamily(initialData.fontFamily || "inter");
    setSecondaryFont(initialData.secondaryFont || "inter");
    setMenuLayout(initialData.menuLayout || "grid");
    setQiosSubdomain(initialData.qiosSubdomain || "");
    setCustomDomain(initialData.customDomain || "");
    setInstagramUrl(initialData.instagramUrl || "");
    setFacebookUrl(initialData.facebookUrl || "");
    setTiktokUrl(initialData.tiktokUrl || "");
    setDashboardLogoPreview(initialData.dashboardLogoUrl || null);
    setKioskSplashPreview(initialData.kioskSplashUrl || null);
    setFaviconPreview(initialData.faviconUrl || null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialData, isEditing]);

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

  const handleClientSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let hasError = false;
    const newErrors: Record<string, string> = {};

    if (!qiosSubdomain.trim()) {
      newErrors.qiosSubdomain = "Qios Subdomain is required.";
      hasError = true;
    }

    if (hasError) {
      setFieldErrors((prev) => ({ ...prev, ...newErrors }));
      return;
    }

    const formData = new FormData(e.currentTarget);
    setIsPending(true);

    try {
      const result = await saveTenantBrandingSettings(
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
            : "Unable to save branding settings.",
      });
    } finally {
      setIsPending(false);
    }
  };

  const handleConnect = async () => {
    if (!customDomain) return;
    setIsConnecting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsConnecting(false);

    if (formRef.current) {
      formRef.current.requestSubmit();
    }

    window.open(`https://${customDomain}`, "_blank");
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

      <form
        ref={formRef}
        onSubmit={handleClientSubmit}
        className="space-y-8 w-full"
      >
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

          <div className="pt-2">
            <label className="text-sm font-medium text-text-primary block mb-3">
              Quick Presets
            </label>
            <div className="flex flex-wrap items-center gap-3">
              {presetThemes.map((preset, index) => {
                const id = `preset-${index}`;
                const isActive = activeThemeId === id;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => {
                      if (isEditing) {
                        setActiveThemeId(id);
                        setTheme(preset);
                        setFieldErrors((prev) => ({
                          ...prev,
                          primaryColor: "",
                          secondaryColor: "",
                          accentColor: "",
                        }));
                      }
                    }}
                    className={cn(
                      "w-10 h-10 rounded-xl transition-all duration-200 shadow-sm relative overflow-hidden flex",
                      isActive
                        ? "scale-110 border-transparent"
                        : "border-2 border-gray-200 hover:scale-105",
                    )}
                    style={{
                      boxShadow: isActive
                        ? `0 0 0 2px white, 0 0 0 4px ${safeHex(preset.accent)}`
                        : undefined,
                    }}
                    title="Apply preset theme"
                    disabled={!isEditing}
                  >
                    <div
                      className="w-1/2 h-full"
                      style={{ backgroundColor: safeHex(preset.primary) }}
                    />
                    <div className="w-1/2 h-full flex flex-col">
                      <div
                        className="w-full h-1/2"
                        style={{ backgroundColor: safeHex(preset.secondary) }}
                      />
                      <div
                        className="w-full h-1/2"
                        style={{ backgroundColor: safeHex(preset.accent) }}
                      />
                    </div>
                  </button>
                );
              })}
              {customThemes.map((custom) => {
                const isActive = activeThemeId === custom.id;
                const displayTheme = isActive ? theme : custom;
                return (
                  <button
                    key={custom.id}
                    type="button"
                    onClick={() => {
                      if (isEditing) {
                        setActiveThemeId(custom.id);
                        setTheme(custom);
                        setFieldErrors((prev) => ({
                          ...prev,
                          primaryColor: "",
                          secondaryColor: "",
                          accentColor: "",
                        }));
                      }
                    }}
                    className={cn(
                      "w-10 h-10 rounded-xl transition-all duration-200 shadow-sm relative overflow-hidden flex",
                      isActive
                        ? "scale-110 border-transparent"
                        : "border-2 border-gray-200 hover:scale-105",
                    )}
                    style={{
                      boxShadow: isActive
                        ? `0 0 0 2px white, 0 0 0 4px ${safeHex(displayTheme.accent)}`
                        : undefined,
                    }}
                    title="Custom theme"
                    disabled={!isEditing}
                  >
                    <div
                      className="w-1/2 h-full"
                      style={{ backgroundColor: safeHex(displayTheme.primary) }}
                    />
                    <div className="w-1/2 h-full flex flex-col">
                      <div
                        className="w-full h-1/2"
                        style={{
                          backgroundColor: safeHex(displayTheme.secondary),
                        }}
                      />
                      <div
                        className="w-full h-1/2"
                        style={{
                          backgroundColor: safeHex(displayTheme.accent),
                        }}
                      />
                    </div>
                  </button>
                );
              })}
              {/* custom theme plus button */}
              <button
                type="button"
                onClick={() => {
                  if (isEditing) {
                    const newId = `custom-${Date.now()}`;
                    const newTheme = {
                      primary: "#000000",
                      secondary: "#000000",
                      accent: "#000000",
                    };
                    setCustomThemes([
                      ...customThemes,
                      { id: newId, ...newTheme },
                    ]);
                    setActiveThemeId(newId);
                    setTheme(newTheme);
                    setFieldErrors((prev) => ({
                      ...prev,
                      primaryColor: "",
                      secondaryColor: "",
                      accentColor: "",
                    }));
                  }
                }}
                className={cn(
                  "w-10 h-10 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center transition-all duration-200",
                  "hover:border-brand-primary hover:text-brand-primary text-gray-400 bg-gray-50",
                  !isEditing && "opacity-70 cursor-not-allowed",
                )}
                disabled={!isEditing}
                title="Add custom theme"
              >
                <Plus size={20} strokeWidth={2} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-primary block mb-3">
                Primary Color <span className="text-brand-accent">*</span>
              </label>
              <div
                className={cn(
                  "relative border rounded-xl p-2 flex items-center gap-3 transition-colors",
                  (!isEditing || !isCustomSelected) && "opacity-70",
                  isEditing && isCustomSelected && "hover:border-brand-primary",
                  fieldErrors.primaryColor
                    ? "border-warning-primary"
                    : "border-gray-200",
                )}
              >
                <div
                  className="w-8 h-8 shrink-0 rounded-md shadow-inner flex items-center justify-center overflow-hidden relative"
                  style={{ backgroundColor: safeHex(theme.primary) }}
                >
                  <input
                    type="color"
                    value={safeHex(theme.primary)}
                    onChange={(e) => {
                      if (isEditing && isCustomSelected) {
                        const val = e.target.value.toUpperCase();
                        const newTheme = { ...theme, primary: val };
                        setTheme(newTheme);
                        setCustomThemes((themes) =>
                          themes.map((t) =>
                            t.id === activeThemeId ? { ...t, primary: val } : t,
                          ),
                        );
                        setFieldErrors((prev) => ({
                          ...prev,
                          primaryColor: "",
                        }));
                      }
                    }}
                    className={cn(
                      "absolute inset-0 opacity-0",
                      isEditing && isCustomSelected
                        ? "cursor-pointer"
                        : "cursor-not-allowed",
                    )}
                    disabled={!isEditing || !isCustomSelected}
                  />
                </div>
                <input
                  type="text"
                  name="primaryColor"
                  value={theme.primary}
                  onChange={(e) => {
                    if (isEditing && isCustomSelected) {
                      const val = e.target.value.toUpperCase();
                      const newTheme = { ...theme, primary: val };
                      setTheme(newTheme);
                      setCustomThemes((themes) =>
                        themes.map((t) =>
                          t.id === activeThemeId ? { ...t, primary: val } : t,
                        ),
                      );
                      setFieldErrors((prev) => ({ ...prev, primaryColor: "" }));
                    }
                  }}
                  className="text-sm font-medium text-text-primary font-mono bg-transparent w-full outline-none"
                  readOnly={!isEditing || !isCustomSelected}
                  placeholder="#000000"
                  maxLength={7}
                />
              </div>
              {fieldErrors.primaryColor && (
                <p className="text-xs text-warning-primary pl-1 mt-1">
                  {fieldErrors.primaryColor}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-text-primary block mb-3">
                Secondary Color <span className="text-brand-accent">*</span>
              </label>
              <div
                className={cn(
                  "relative border rounded-xl p-2 flex items-center gap-3 transition-colors",
                  (!isEditing || !isCustomSelected) && "opacity-70",
                  isEditing && isCustomSelected && "hover:border-brand-primary",
                  fieldErrors.secondaryColor
                    ? "border-warning-primary"
                    : "border-gray-200",
                )}
              >
                <div
                  className="w-8 h-8 shrink-0 rounded-md shadow-inner flex items-center justify-center overflow-hidden relative"
                  style={{ backgroundColor: safeHex(theme.secondary) }}
                >
                  <input
                    type="color"
                    value={safeHex(theme.secondary)}
                    onChange={(e) => {
                      if (isEditing && isCustomSelected) {
                        const val = e.target.value.toUpperCase();
                        const newTheme = { ...theme, secondary: val };
                        setTheme(newTheme);
                        setCustomThemes((themes) =>
                          themes.map((t) =>
                            t.id === activeThemeId
                              ? { ...t, secondary: val }
                              : t,
                          ),
                        );
                        setFieldErrors((prev) => ({
                          ...prev,
                          secondaryColor: "",
                        }));
                      }
                    }}
                    className={cn(
                      "absolute inset-0 opacity-0",
                      isEditing && isCustomSelected
                        ? "cursor-pointer"
                        : "cursor-not-allowed",
                    )}
                    disabled={!isEditing || !isCustomSelected}
                  />
                </div>
                <input
                  type="text"
                  name="secondaryColor"
                  value={theme.secondary}
                  onChange={(e) => {
                    if (isEditing && isCustomSelected) {
                      const val = e.target.value.toUpperCase();
                      const newTheme = { ...theme, secondary: val };
                      setTheme(newTheme);
                      setCustomThemes((themes) =>
                        themes.map((t) =>
                          t.id === activeThemeId ? { ...t, secondary: val } : t,
                        ),
                      );
                      setFieldErrors((prev) => ({
                        ...prev,
                        secondaryColor: "",
                      }));
                    }
                  }}
                  className="text-sm font-medium text-text-primary font-mono bg-transparent w-full outline-none"
                  readOnly={!isEditing || !isCustomSelected}
                  placeholder="#000000"
                  maxLength={7}
                />
              </div>
              {fieldErrors.secondaryColor && (
                <p className="text-xs text-warning-primary pl-1 mt-1">
                  {fieldErrors.secondaryColor}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-text-primary block mb-3">
                Accent Color <span className="text-brand-accent">*</span>
              </label>
              <div
                className={cn(
                  "relative border rounded-xl p-2 flex items-center gap-3 transition-colors",
                  (!isEditing || !isCustomSelected) && "opacity-70",
                  isEditing && isCustomSelected && "hover:border-brand-primary",
                  fieldErrors.accentColor
                    ? "border-warning-primary"
                    : "border-gray-200",
                )}
              >
                <div
                  className="w-8 h-8 shrink-0 rounded-md shadow-inner flex items-center justify-center overflow-hidden relative"
                  style={{ backgroundColor: safeHex(theme.accent) }}
                >
                  <input
                    type="color"
                    value={safeHex(theme.accent)}
                    onChange={(e) => {
                      if (isEditing && isCustomSelected) {
                        const val = e.target.value.toUpperCase();
                        const newTheme = { ...theme, accent: val };
                        setTheme(newTheme);
                        setCustomThemes((themes) =>
                          themes.map((t) =>
                            t.id === activeThemeId ? { ...t, accent: val } : t,
                          ),
                        );
                        setFieldErrors((prev) => ({
                          ...prev,
                          accentColor: "",
                        }));
                      }
                    }}
                    className={cn(
                      "absolute inset-0 opacity-0",
                      isEditing && isCustomSelected
                        ? "cursor-pointer"
                        : "cursor-not-allowed",
                    )}
                    disabled={!isEditing || !isCustomSelected}
                  />
                </div>
                <input
                  type="text"
                  name="accentColor"
                  value={theme.accent}
                  onChange={(e) => {
                    if (isEditing && isCustomSelected) {
                      const val = e.target.value.toUpperCase();
                      const newTheme = { ...theme, accent: val };
                      setTheme(newTheme);
                      setCustomThemes((themes) =>
                        themes.map((t) =>
                          t.id === activeThemeId ? { ...t, accent: val } : t,
                        ),
                      );
                      setFieldErrors((prev) => ({ ...prev, accentColor: "" }));
                    }
                  }}
                  className="text-sm font-medium text-text-primary font-mono bg-transparent w-full outline-none"
                  readOnly={!isEditing || !isCustomSelected}
                  placeholder="#000000"
                  maxLength={7}
                />
              </div>
              {fieldErrors.accentColor && (
                <p className="text-xs text-warning-primary pl-1 mt-1">
                  {fieldErrors.accentColor}
                </p>
              )}
            </div>
          </div>
          <div className="flex justify-between items-end mt-2">
            <p className="text-xs text-text-secondary max-w-xl">
              Primary color is used for main buttons. Secondary is used for
              subtle backgrounds and badges. Accent is used for notifications
              and important actions.
            </p>
            {isCustomSelected && isEditing && (
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={async () => {
                    const btn = document.getElementById("save-custom-btn");
                    if (btn) {
                      btn.classList.add(
                        "text-green-600",
                        "bg-green-50",
                        "border-green-200",
                      );
                      setTimeout(
                        () =>
                          btn.classList.remove(
                            "text-green-600",
                            "bg-green-50",
                            "border-green-200",
                          ),
                        1000,
                      );
                    }
                    try {
                      await saveTenantCustomThemes(tenantId, customThemes);
                    } catch (err) {
                      console.error("Failed to save custom themes", err);
                    }
                  }}
                  id="save-custom-btn"
                  className="w-10 h-10 rounded-full border-2 border-gray-200 bg-white shadow-sm flex items-center justify-center text-text-secondary hover:text-success-primary hover:border-success-primary hover:bg-green-50 transition-all duration-200"
                  title="Save Custom Theme"
                >
                  <Save size={18} strokeWidth={2} />
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    const newThemes = customThemes.filter(
                      (t) => t.id !== activeThemeId,
                    );
                    setCustomThemes(newThemes);
                    const fallbackId =
                      newThemes.length > 0
                        ? newThemes[newThemes.length - 1].id
                        : "preset-0";
                    setActiveThemeId(fallbackId);
                    if (fallbackId.startsWith("preset-")) {
                      const presetIdx = parseInt(fallbackId.split("-")[1], 10);
                      setTheme(presetThemes[presetIdx]);
                    } else {
                      const t = newThemes.find((th) => th.id === fallbackId);
                      if (t) setTheme(t);
                    }
                    // persist delete
                    try {
                      await saveTenantCustomThemes(tenantId, newThemes);
                    } catch (err) {
                      console.error("Failed to delete custom theme", err);
                    }
                  }}
                  className="w-10 h-10 rounded-full border-2 border-gray-200 bg-white shadow-sm flex items-center justify-center text-text-secondary hover:text-warning-primary hover:border-warning-primary hover:bg-red-50 transition-all duration-200"
                  title="Delete Custom Theme"
                >
                  <Trash2 size={18} strokeWidth={2} />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* typography */}
        <div className="space-y-6 w-full">
          <SectionHeader
            title="Typography"
            className="mb-0 py-2 border-gray-100"
          />
          <div className="space-y-6 pt-2">
            <div>
              <label className="text-sm font-medium text-text-primary block mb-3">
                Primary Font <span className="text-brand-accent">*</span>
              </label>
              <input type="hidden" name="fontFamily" value={fontFamily} />
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
                      fieldErrors.fontFamily ? "border-warning-primary" : "",
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

            <div>
              <label className="text-sm font-medium text-text-primary block mb-3">
                Secondary Font <span className="text-brand-accent">*</span>
              </label>
              <input type="hidden" name="secondaryFont" value={secondaryFont} />
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {fonts.map((font) => (
                  <button
                    key={font.id}
                    type="button"
                    onClick={() => {
                      if (isEditing) {
                        setSecondaryFont(font.id);
                      }
                    }}
                    className={cn(
                      "p-4 rounded-xl border-2 text-left transition-all",
                      !isEditing && "opacity-70 cursor-not-allowed",
                      secondaryFont === font.id
                        ? "border-brand-primary bg-brand-primary/5"
                        : "border-gray-100 hover:border-gray-200 bg-white",
                    )}
                    disabled={!isEditing}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Type
                        size={16}
                        className={
                          secondaryFont === font.id
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
            </div>
          </div>
        </div>

        {/* layout preferences */}
        <div className="space-y-4 w-full">
          <SectionHeader
            title="Menu Layout"
            className="mb-0 py-2 border-gray-100"
          />
          <div className="pt-2">
            <label className="text-sm font-medium text-text-primary block mb-3">
              Layout Style <span className="text-brand-accent">*</span>
            </label>
            <input type="hidden" name="menuLayout" value={menuLayout} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                      fieldErrors.menuLayout ? "border-warning-primary" : "",
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
                      <p className="text-xs text-text-secondary">
                        {layout.desc}
                      </p>
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
                Dashboard & Receipt Logo{" "}
                <span className="text-brand-accent">*</span>
              </label>
              <div
                className={cn(
                  "relative border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center bg-gray-50 transition-colors h-40 overflow-hidden",
                  isEditing
                    ? "hover:bg-gray-100 cursor-pointer group"
                    : "opacity-70",
                )}
              >
                {dashboardLogoPreview ? (
                  <img
                    src={dashboardLogoPreview}
                    alt="Dashboard Logo"
                    className="w-full h-full object-contain p-2"
                  />
                ) : (
                  <>
                    <div
                      className={cn(
                        "w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm mb-3 transition-transform",
                        isEditing && "group-hover:scale-110",
                      )}
                    >
                      <Upload size={20} className="text-brand-accent" />
                    </div>
                    <span className="text-sm font-medium text-text-primary">
                      Click to upload
                    </span>
                    <span className="text-xs text-text-secondary mt-1">
                      PNG, JPG (Square)
                    </span>
                  </>
                )}
                {isEditing && (
                  <label
                    className={cn(
                      "absolute inset-0 cursor-pointer w-full h-full transition-colors",
                      dashboardLogoPreview
                        ? "bg-black/0 hover:bg-black/10"
                        : "",
                    )}
                  >
                    <input
                      type="file"
                      name="dashboardLogo"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file)
                          setDashboardLogoPreview(URL.createObjectURL(file));
                      }}
                    />
                  </label>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium text-text-primary block">
                Kiosk Splash Screen <span className="text-brand-accent">*</span>
              </label>
              <div
                className={cn(
                  "relative border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center bg-gray-50 transition-colors h-40 overflow-hidden",
                  isEditing
                    ? "hover:bg-gray-100 cursor-pointer group"
                    : "opacity-70",
                )}
              >
                {kioskSplashPreview ? (
                  <img
                    src={kioskSplashPreview}
                    alt="Kiosk Splash"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <>
                    <div
                      className={cn(
                        "w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm mb-3 transition-transform",
                        isEditing && "group-hover:scale-110",
                      )}
                    >
                      <ImageIcon size={20} className="text-brand-accent" />
                    </div>
                    <span className="text-sm font-medium text-text-primary">
                      Click to upload
                    </span>
                    <span className="text-xs text-text-secondary mt-1">
                      Portrait 1080x1920
                    </span>
                  </>
                )}
                {isEditing && (
                  <label
                    className={cn(
                      "absolute inset-0 cursor-pointer w-full h-full transition-colors",
                      kioskSplashPreview ? "bg-black/0 hover:bg-black/10" : "",
                    )}
                  >
                    <input
                      type="file"
                      name="kioskSplash"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file)
                          setKioskSplashPreview(URL.createObjectURL(file));
                      }}
                    />
                  </label>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium text-text-primary block">
                Favicon <span className="text-brand-accent">*</span>
              </label>
              <div
                className={cn(
                  "relative border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center bg-gray-50 transition-colors h-40 overflow-hidden",
                  isEditing
                    ? "hover:bg-gray-100 cursor-pointer group"
                    : "opacity-70",
                )}
              >
                {faviconPreview ? (
                  <img
                    src={faviconPreview}
                    alt="Favicon"
                    className="w-12 h-12 object-contain"
                  />
                ) : (
                  <>
                    <div
                      className={cn(
                        "w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm mb-3 transition-transform",
                        isEditing && "group-hover:scale-110",
                      )}
                    >
                      <Globe size={20} className="text-brand-accent" />
                    </div>
                    <span className="text-sm font-medium text-text-primary">
                      Click to upload
                    </span>
                    <span className="text-xs text-text-secondary mt-1">
                      .ICO, .PNG (32x32)
                    </span>
                  </>
                )}
                {isEditing && (
                  <label
                    className={cn(
                      "absolute inset-0 cursor-pointer w-full h-full transition-colors",
                      faviconPreview ? "bg-black/0 hover:bg-black/10" : "",
                    )}
                  >
                    <input
                      type="file"
                      name="favicon"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) setFaviconPreview(URL.createObjectURL(file));
                      }}
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
              <label className="text-sm font-medium text-text-primary block">
                Qios Subdomain <span className="text-brand-accent">*</span>
              </label>
              <div className="relative flex items-center w-full">
                <Input
                  name="qiosSubdomain"
                  value={qiosSubdomain}
                  onChange={(e) => {
                    setQiosSubdomain(e.target.value);
                    setFieldErrors((prev) => ({ ...prev, qiosSubdomain: "" }));
                  }}
                  placeholder="yourbrand"
                  isError={!!fieldErrors.qiosSubdomain}
                  className={cn(
                    "py-2.5 w-full rounded-xl focus:outline-none disabled:cursor-not-allowed pr-24",
                    !fieldErrors.qiosSubdomain
                      ? "focus:border-brand-primary focus:ring-brand-primary"
                      : "",
                  )}
                  disabled={!isEditing}
                />
                <span
                  className={cn(
                    "absolute right-3 text-sm",
                    fieldErrors.qiosSubdomain
                      ? "text-warning-primary"
                      : "text-text-secondary",
                  )}
                >
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
                <label className="text-sm font-medium text-text-primary block">
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
                  disabled={!isEditing || !customDomain || isConnecting}
                  onClick={handleConnect}
                >
                  {isConnecting ? "Connecting..." : "Connect"}
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
              <label className="text-sm font-medium text-text-primary block">
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
              <label className="text-sm font-medium text-text-primary block">
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
              <label className="text-sm font-medium text-text-primary block">
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
                  const initTheme = {
                    primary: initialData.primaryColor || "#FFC670",
                    secondary: initialData.secondaryColor || "#FFF9F0",
                    accent: initialData.accentColor || "#00FFFF",
                  };
                  const presetIndex = presetThemes.findIndex((p) =>
                    isMatch(p, initTheme),
                  );

                  if (presetIndex !== -1) {
                    setActiveThemeId(`preset-${presetIndex}`);
                    setCustomThemes([]);
                  } else {
                    setActiveThemeId("custom-0");
                    setCustomThemes([{ id: "custom-0", ...initTheme }]);
                  }
                  setTheme(initTheme);
                  setFontFamily(initialData.fontFamily || "inter");
                  setSecondaryFont(initialData.secondaryFont || "inter");
                  setMenuLayout(initialData.menuLayout || "grid");
                  setQiosSubdomain(initialData.qiosSubdomain || "");
                  setCustomDomain(initialData.customDomain || "");
                  setInstagramUrl(initialData.instagramUrl || "");
                  setFacebookUrl(initialData.facebookUrl || "");
                  setTiktokUrl(initialData.tiktokUrl || "");
                  setDashboardLogoPreview(initialData.dashboardLogoUrl || null);
                  setKioskSplashPreview(initialData.kioskSplashUrl || null);
                  setFaviconPreview(initialData.faviconUrl || null);
                  setFieldErrors({});
                }}
                disabled={isPending || isConnecting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="accent"
                shape="rounded"
                leftIcon={<Save size={18} />}
                loading={isPending}
                disabled={isConnecting}
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
