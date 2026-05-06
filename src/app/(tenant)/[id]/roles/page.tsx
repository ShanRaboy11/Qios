"use client";

import React from "react";
import RolesManagement from "@/components/organisms/RolesManagement";
import { Button } from "@/components/atoms/Button";
import { ArrowLeft } from "lucide-react";
import { useRouter, useParams } from "next/navigation";

export default function RolesPage() {
  const router = useRouter();
  const params = useParams();
  const tenantId = params.id as string;

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <div>
          <h2 className="h2 text-text-primary">Role Management</h2>
          <p className="b1 text-text-secondary mt-2">
            Configure system roles and their permissions
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            shape="rounded"
            leftIcon={<ArrowLeft size={18} />}
            onClick={() => router.push(`/${tenantId}/staff`)}
          >
            Back to Staff
          </Button>
        </div>
      </div>
      <RolesManagement />
    </>
  );
}
