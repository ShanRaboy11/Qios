import React from "react";
import { Badge } from "@/components/atoms/Badge";
import { Button } from "@/components/atoms/Button";
import { ArrowLeft, Check, X, Pause, Building2, MapPin, Calendar, CircleDot } from "lucide-react";
import Link from "next/link";
import { TenantProfileData } from "./TenantProfilePage";
import { cn } from "@/lib/utils";

interface TenantProfileHeaderProps {
  tenant: TenantProfileData;
  onStatusChange: (status: TenantProfileData["status"]) => void;
  className?: string;
}

export const TenantProfileHeader = ({
  tenant,
  onStatusChange,
  className,
}: TenantProfileHeaderProps) => {
  return (
    <div className={cn("flex flex-col gap-6 pt-4 pb-2", className)}>
      <Link
        href="/admin/tenant_directory"
        className="flex items-center gap-2 text-text-secondary hover:text-text-primary font-bold text-[13px] transition-colors w-fit group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Back to Directory
      </Link>

      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
        <div className="flex items-start gap-6">
          {/* Minimalist Icon Block */}
          <div className="w-20 h-20 rounded-[20px] bg-white border border-gray-200 shadow-sm flex items-center justify-center shrink-0">
            <Building2 className="w-10 h-10 text-brand-primary" />
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center gap-4">
              <h1 className="text-4xl sm:text-5xl font-black text-text-primary tracking-tighter">
                {tenant.business_name}
              </h1>
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
                variant="subtle"
                className="px-3 py-1 uppercase tracking-widest font-extrabold text-[11px]"
              >
                {tenant.status}
              </Badge>
            </div>
            
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[14px] text-text-secondary font-medium">
              <span className="font-mono text-[13px] text-gray-400">
                Tenant ID: {tenant.id}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          {tenant.status === "Pending" && (
            <>
              <Button
                variant="ghost"
                shape="rounded"
                onClick={() => onStatusChange("Rejected")}
                className="text-red-500 hover:bg-red-50 hover:text-red-600 font-bold px-6"
              >
                <X className="w-4 h-4 mr-2" />
                Reject
              </Button>
              <Button
                variant="primary"
                shape="rounded"
                onClick={() => onStatusChange("Active")}
                className="font-bold px-8 shadow-sm"
              >
                <Check className="w-4 h-4 mr-2" />
                Approve Tenant
              </Button>
            </>
          )}

          {tenant.status === "Active" && (
            <Button
              variant="outline"
              shape="rounded"
              onClick={() => onStatusChange("Suspended")}
              className="border-gray-200 text-text-primary hover:bg-gray-50 font-bold px-6 shadow-sm"
            >
              <Pause className="w-4 h-4 mr-2" />
              Suspend Account
            </Button>
          )}

          {tenant.status === "Suspended" && (
            <Button 
              variant="primary" 
              shape="rounded"
              onClick={() => onStatusChange("Active")}
              className="font-bold px-8 shadow-sm"
            >
              <Check className="w-4 h-4 mr-2" />
              Reactivate Account
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
