import React from "react";
import { TenantBrandingProvider } from "@/components/providers/TenantBrandingProvider";
import { EmployeeDashboardShell } from "@/components/organisms/EmployeeDashboardShell";
import { fetchTenantBranding } from "@/lib/tenantBranding";
import { getEmployeePermissionsForTenant } from "@/lib/serverPermissions";

export default async function EmployeeLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id: tenantId } = await params;
  const { branding, storeName } = await fetchTenantBranding(tenantId);
  const initialEmployeePermissions =
    await getEmployeePermissionsForTenant(tenantId);

  return (
    <TenantBrandingProvider branding={branding}>
      <EmployeeDashboardShell
        storeName={storeName}
        initialEmployeePermissions={initialEmployeePermissions}
      >
        {children}
      </EmployeeDashboardShell>
    </TenantBrandingProvider>
  );
}
