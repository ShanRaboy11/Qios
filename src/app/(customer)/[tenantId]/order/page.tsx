import React from "react";
import MenuCatalog from "@/components/organisms/MenuCatalog";

export default function CustomerMenuPage({ params }: { params: { tenantId: string } }) {
  return (
    <main className="min-h-screen bg-bg-primary">
      <MenuCatalog />
    </main>
  );
}