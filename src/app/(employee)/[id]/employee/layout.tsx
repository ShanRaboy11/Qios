import React from "react";
import { TenantBrandingProvider } from "@/components/providers/TenantBrandingProvider";
import { EmployeeDashboardShell } from "@/components/organisms/EmployeeDashboardShell";
import { fetchTenantBranding } from "@/lib/tenantBranding";

export default async function EmployeeLayout({
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
      <EmployeeDashboardShell storeName={storeName}>
        {children}
      </EmployeeDashboardShell>
    </TenantBrandingProvider>
  );
}
