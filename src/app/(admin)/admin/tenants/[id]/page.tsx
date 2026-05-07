import React from "react";
import { TenantProfilePage } from "@/components/organisms/TenantProfilePage";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  return (
    <div className="min-h-screen overflow-x-hidden relative">
      <TenantProfilePage tenantId={resolvedParams.id} />
    </div>
  );
}
