import React from "react";
import TenantManagement from "@/components/organisms/TenantManagement";
import { getTenants } from "./actions";

export default async function TenantManagementPage() {
  const tenants = await getTenants();

  return (
    <main className="min-h-screen bg-bg-primary">
      <div className="max-w-7xl mx-auto py-8">
        <h1 className="text-3xl font-bold text-text-primary mb-8 px-6 md:px-8">Tenant Management</h1>
        <TenantManagement initialTenants={tenants} />
      </div>
    </main>
  );
}