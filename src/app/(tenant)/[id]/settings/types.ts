export interface TenantProfileSettingsData {
  name: string;
  email: string;
  phoneNumber: string;
  avatarUrl?: string;
}

export interface TenantStoreSettingsData {
  storeName: string;
  publicContactEmail: string;
  publicPhoneNumber: string;
  physicalAddress: string;
  currency: string;
  timezone: string;
  taxRate: string;
}

export interface CustomTheme {
  id: string;
  primary: string;
  secondary: string;
  accent: string;
}

export interface TenantBrandingSettingsData {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  fontFamily: string;
  secondaryFont: string;
  menuLayout: string;
  qiosSubdomain: string;
  customDomain: string;
  instagramUrl: string;
  facebookUrl: string;
  tiktokUrl: string;
  dashboardLogoUrl?: string;
  kioskSplashUrl?: string;
  faviconUrl?: string;
  customThemes?: CustomTheme[];
}

export interface TenantSecuritySettingsData {
  requireTwoFactorAuth: boolean;
  twoFactorEnabled?: boolean;
  hasAuthenticator?: boolean;
  hasEmail?: boolean;
  authenticatorUpdatedAt?: string;
  emailUpdatedAt?: string;
  recoveryCodesGeneratedAt?: string;
}

export interface TenantSettingsPageData {
  profile: TenantProfileSettingsData;
  store: TenantStoreSettingsData;
  branding: TenantBrandingSettingsData;
  security: TenantSecuritySettingsData;
}

export interface SettingsActionState {
  error: string;
  success: string;
  fieldErrors: Record<string, string>;
}

export const emptySettingsActionState: SettingsActionState = {
  error: "",
  success: "",
  fieldErrors: {},
};
