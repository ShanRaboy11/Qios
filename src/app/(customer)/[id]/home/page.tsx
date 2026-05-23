import React from "react";
import { fetchTenantCustomerMenu } from "@/lib/customerMenu";
import CustomerOrderingHome from "@/components/organisms/CustomerOrderingHome";

export default async function CustomerHomePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: tenantId } = await params;
  const { categories, items: initialItems } =
    await fetchTenantCustomerMenu(tenantId);

  return (
    <CustomerOrderingHome
      initialCategories={categories}
      initialItems={initialItems}
    />
  );
}
