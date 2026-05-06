"use client";

import React from "react";
import RolesManagement from "@/components/organisms/RolesManagement";

export default function RoleManagementPage() {
  return (
    <div className="flex flex-col h-full w-full max-w-7xl mx-auto py-6 md:py-8 px-4 sm:px-6 lg:px-8">
      {/* header */}
      <div className="mb-6 md:mb-8">
        <h1 className="h2 text-text-primary mb-2">Role Management</h1>
        <p className="b1 text-text-secondary">Manage role permissions and access controls</p>
      </div>
      <RolesManagement />
    </div>
  );
}
