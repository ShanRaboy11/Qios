"use client";

import React, { createContext, useContext } from "react";
import { cn } from "@/lib/utils";
import { TenantBrandingSettingsData } from "@/app/(tenant)/[id]/settings/types";

// Create the context
interface TenantBrandingContextType {
  branding: Partial<TenantBrandingSettingsData> | null;
}

export const TenantBrandingContext = createContext<TenantBrandingContextType>({ branding: null });

// Hook for consuming the context
export const useTenantBranding = () => {
  const context = useContext(TenantBrandingContext);
  if (!context) {
    throw new Error("useTenantBranding must be used within a TenantBrandingProvider");
  }
  return context;
};

// Map font settings to actual font families. 
// "inter" maps to Tailwind's var(--font-inter), etc.
const getFontFamilyString = (fontId?: string) => {
  switch (fontId) {
    case "inter": return "var(--font-inter), sans-serif";
    case "playfair": return "'Playfair Display', serif"; // If playfair is used, fallback
    case "roboto": return "'Roboto', monospace";
    case "figtree": return "var(--font-figtree), sans-serif";
    case "ibrand": return "var(--font-ibrand), serif";
    default: return "";
  }
};

interface TenantBrandingProviderProps {
  branding?: Partial<TenantBrandingSettingsData>;
  children: React.ReactNode;
  className?: string;
}

export const TenantBrandingProvider = ({
  branding,
  children,
  className,
}: TenantBrandingProviderProps) => {
  // Extract values
  const {
    primaryColor,
    secondaryColor,
    accentColor,
    fontFamily,
    secondaryFont,
  } = branding || {};

  const primaryFontStr = getFontFamilyString(fontFamily);
  const secondaryFontStr = getFontFamilyString(secondaryFont);

  return (
    <TenantBrandingContext.Provider value={{ branding: branding || null }}>
      <div
        className={cn("w-full h-full", className)}
        style={
          {
            ...(primaryColor && {
              "--brand-primary": primaryColor,
              "--color-brand-primary": primaryColor,
            }),
            ...(secondaryColor && {
              "--brand-secondary": secondaryColor,
              "--color-brand-secondary": secondaryColor,
              "--brand-bg": secondaryColor,
            }),
            ...(accentColor && {
              "--brand-accent": accentColor,
              "--color-brand-accent": accentColor,
            }),
            ...(primaryFontStr && { "--font-brand-primary": primaryFontStr }),
            ...(secondaryFontStr && { "--font-brand-secondary": secondaryFontStr }),
          } as React.CSSProperties
        }
      >
        {children}
      </div>
    </TenantBrandingContext.Provider>
  );
};
