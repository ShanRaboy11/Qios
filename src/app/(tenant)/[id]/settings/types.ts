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

export interface TenantSubscriptionPlanData {
  id: string;
  name: string;
  color: string;
  badge: string;
  priceMonthly: string;
  priceAnnually: string;
  features: Record<string, unknown>;
  displayOrder?: number;
}

export interface TenantPaymentMethodData {
  id: string;
  provider: string;
  displayName: string;
  last4: string;
  expMonth: string;
  expYear: string;
  cardholderName: string;
  isDefault: boolean;
  addedAt: string;
}

export interface TenantBillingHistoryData {
  id: string;
  invoiceNumber: string;
  description: string;
  amount: string;
  currency: string;
  status: string;
  billingDate: string;
  invoiceUrl?: string;
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

export interface TenantNotificationSettingsData {
  receiveSecurityAlerts: boolean;
  receiveDailySalesSummary: boolean;
  receiveLowStockAlerts: boolean;
  receiveStaffOvertimeAlerts: boolean;
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
  billing: TenantBillingSettingsData;
  notifications: TenantNotificationSettingsData;
  security: TenantSecuritySettingsData;
  isDeactivated: boolean;
}

export interface TenantBillingSettingsData {
  currentPlanName: string;
  currentPlanBadge: string;
  currentPlanPriceMonthly: string;
  currentPlanPriceAnnually: string;
  currentPlanColor: string;
  nextBillingDate: string;
  availablePlans: TenantSubscriptionPlanData[];
  paymentMethods: TenantPaymentMethodData[];
  billingHistory: TenantBillingHistoryData[];
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
