import React from "react";
import { TenantBrandingProvider } from "@/components/providers/TenantBrandingProvider";
import { TenantDashboardShell } from "@/components/organisms/TenantDashboardShell";
import { fetchTenantBranding } from "@/lib/tenantBranding";

export default async function TenantLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id: tenantId } = await params;
  const { branding, storeName } = await fetchTenantBranding(tenantId);

  return (
    <TenantBrandingProvider branding={branding}>
      <TenantDashboardShell storeName={storeName}>
        {children}
      </TenantDashboardShell>
    </TenantBrandingProvider>
  );
}
