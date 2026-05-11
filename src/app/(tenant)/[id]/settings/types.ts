export interface TenantProfileSettingsData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
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

export interface TenantBrandingSettingsData {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  fontFamily: string;
  menuLayout: string;
}

export interface TenantSecuritySettingsData {
  requireTwoFactorAuth: boolean;
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
