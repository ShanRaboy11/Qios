"use client";

import React from "react";
import StaffManagement from "@/components/organisms/StaffManagement";
import { Button } from "@/components/atoms/Button";
import { useRouter, useParams } from "next/navigation";

export default function StaffPage() {
  const router = useRouter();
  const params = useParams();
  const tenantId = params.id as string;

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <div>
          <h2 className="h2 text-text-primary">Staff Management</h2>
          <p className="b1 text-text-secondary mt-2">
            Manage your restaurant&apos;s staff members and their roles
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="primary"
            shape="rounded"
            leftIcon={
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14" />
                <path d="M12 5v14" />
              </svg>
            }
            onClick={() => router.push(`/${tenantId}/roles`)}
          >
            Add New Role
          </Button>
        </div>
      </div>
      <div id="tutorial-staff-table">
        <StaffManagement />
      </div>
    </>
  );
}
