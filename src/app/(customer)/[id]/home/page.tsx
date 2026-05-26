import React from "react";
import { fetchTenantCustomerMenu } from "@/lib/customerMenu";
import CustomerOrderingHome from "@/components/organisms/CustomerOrderingHome";
import { TenantBrandingProvider } from "@/components/providers/TenantBrandingProvider";

export default async function CustomerHomePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: tenantId } = await params;
  const {
    categories,
    items: initialItems,
    currency,
    guestNumber,
    branding,
    storeName,
  } =
    await fetchTenantCustomerMenu(tenantId);

  return (
    <TenantBrandingProvider branding={branding}>
      <CustomerOrderingHome
        initialCategories={categories}
        initialItems={initialItems}
        currency={currency}
        guestNumber={guestNumber}
        tenantId={tenantId}
        storeName={storeName}
      />
    </TenantBrandingProvider>
  );
}
