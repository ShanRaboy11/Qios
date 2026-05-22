import React from "react";
import { fetchTenantCustomerMenu } from "@/lib/customerMenu";
import CustomerOrderingHome from "@/components/organisms/CustomerOrderingHome";

export default async function CustomerHomePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: tenantId } = await params;
  const initialItems = await fetchTenantCustomerMenu(tenantId);

  return <CustomerOrderingHome initialItems={initialItems} />;
}