import React from "react";
import { TenantBrandingProvider } from "@/components/providers/TenantBrandingProvider";
import { TenantDashboardShell } from "@/components/organisms/TenantDashboardShell";
import { fetchTenantBranding } from "@/lib/tenantBranding";
import { TutorialProvider } from "@/components/providers/TutorialProvider";
import {
  getTenantFeatures,
  getTenantSubscriptionPlan,
} from "@/lib/subscriptionAccess";

export default async function TenantLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id: tenantId } = await params;
  const { branding, storeName } = await fetchTenantBranding(tenantId);
  const tenantFeatures = await getTenantFeatures(tenantId);
  const tenantSubscriptionPlan = await getTenantSubscriptionPlan(tenantId);

  return (
    <TenantBrandingProvider branding={branding}>
      <TutorialProvider>
        <TenantDashboardShell
          storeName={storeName}
          tenantFeatures={tenantFeatures}
          tenantSubscriptionPlan={tenantSubscriptionPlan}
        >
          {children}
        </TenantDashboardShell>
      </TutorialProvider>
    </TenantBrandingProvider>
  );
}
