import React from "react";
import { Badge } from "@/components/atoms/Badge";
import { Button } from "@/components/atoms/Button";
import { ArrowLeft, Check, X, Pause, Edit } from "lucide-react";
import Link from "next/link";
import { TenantProfileData } from "./TenantProfilePage";

interface TenantProfileHeaderProps {
  tenant: TenantProfileData;
  onStatusChange: (status: TenantProfileData["status"]) => void;
}

export const TenantProfileHeader = ({
  tenant,
  onStatusChange,
}: TenantProfileHeaderProps) => {
  return (
    <div className="flex flex-col gap-6">
      <Link
        href="/admin/tenants"
        className="flex items-center gap-2 text-text-secondary hover:scale-105 transition-all duration-300 w-fit"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="text-[15px] font-medium">Back to Tenants</span>
      </Link>

      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <h1 className="h1 text-text-primary">{tenant.name}</h1>
            <Badge
              color={
                tenant.status === "Active"
                  ? "success"
                  : tenant.status === "Pending"
                    ? "primary"
                    : tenant.status === "Suspended"
                      ? "error"
                      : "info"
              }
              variant="solid"
            >
              {tenant.status}
            </Badge>
          </div>
          <p className="text-[15px] text-text-secondary font-medium">
            {tenant.type} Plan • ID: {tenant.id}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {tenant.status === "Pending" && (
            <>
              <Button
                variant="warning"
                onClick={() => onStatusChange("Rejected")}
              >
                <X className="w-4 h-4 mr-2" />
                Reject
              </Button>
              <Button
                variant="primary"
                onClick={() => onStatusChange("Active")}
              >
                <Check className="w-4 h-4 mr-2" />
                Approve Tenant
              </Button>
            </>
          )}

          {tenant.status === "Active" && (
            <>
              <Button
                variant="outline"
                onClick={() => onStatusChange("Suspended")}
              >
                <Pause className="w-4 h-4 mr-2" />
                Suspend
              </Button>
            </>
          )}

          {tenant.status === "Suspended" && (
            <Button variant="accent" onClick={() => onStatusChange("Active")}>
              <Check className="w-4 h-4 mr-2" />
              Reactivate
            </Button>
          )}

          <Button variant="outline">
            <Edit className="w-4 h-4 mr-2" />
            Edit Info
          </Button>
        </div>
      </div>
    </div>
  );
};
