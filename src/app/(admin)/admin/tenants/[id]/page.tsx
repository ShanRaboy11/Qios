import React from "react";
import { TenantProfilePage } from "@/components/organisms/TenantProfilePage";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  return (
    <main className="min-h-screen bg-bg-primary pt-12 pb-20 px-4 md:px-8 lg:px-12">
      <TenantProfilePage tenantId={resolvedParams.id} />
    </main>
  );
}
