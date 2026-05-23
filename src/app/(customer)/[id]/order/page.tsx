import React from "react";
import MenuCatalog from "@/components/organisms/MenuCatalog";
import { CartProvider } from "@/contexts/CartContext";
import { fetchTenantCustomerMenu } from "@/lib/customerMenu";

export default async function CustomerMenuPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: tenantId } = await params;
  const { items: initialItems } = await fetchTenantCustomerMenu(tenantId);

  return (
    <main className="min-h-screen bg-bg-primary">
      <CartProvider>
        <MenuCatalog initialItems={initialItems} />
      </CartProvider>
    </main>
  );
}
