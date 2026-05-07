import React from "react";
import { TenantProfilePage } from "@/components/organisms/TenantProfilePage";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  return (
    <div className="w-full relative">
      <TenantProfilePage tenantId={resolvedParams.id} />
    </div>
  );
}
