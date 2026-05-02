import React, { useEffect, useState } from "react";
import { BentoCard } from "@/components/molecules/BentoCard";
import { InfoRow } from "@/components/molecules/InfoRow";
import {
  Building2,
  FileText,
  Settings,
  CreditCard,
  Check,
  AlertCircle,
  FileImage,
  Eye,
  ShieldCheck,
  Receipt,
  MapPin,
  Users,
} from "lucide-react";
import { TenantProfileData } from "./TenantProfilePage";
import { Button } from "@/components/atoms/Button";
import { Badge } from "@/components/atoms/Badge";
import { KPICard } from "@/components/molecules/KPICard";

import { cn } from "@/lib/utils";

interface TenantProfileBentoGridProps {
  tenant: TenantProfileData;
  onUpdateDocumentStatus: (
    docId: string,
    newStatus: "Approved" | "Revision Requested",
  ) => void;
  className?: string;
}

export const TenantProfileBentoGrid = ({
  tenant,
  onUpdateDocumentStatus,
  className,
}: TenantProfileBentoGridProps) => {
  const [previewDocument, setPreviewDocument] = useState<{
    url: string;
    title: string;
  } | null>(null);

  useEffect(() => {
    setPreviewDocument(null);
  }, [tenant.id]);

  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", className)}>
      {/* 1. Business Information */}
      <BentoCard
        title="Business Information"
        icon={<Building2 className="w-5 h-5 text-[#ffc670]" />}
        className="lg:col-span-1"
      >
        <div className="flex flex-col h-full">
          <InfoRow label="Owner Name" value={tenant.owner} />
          <InfoRow label="Email Address" value={tenant.email} />
          <InfoRow label="Contact Number" value={tenant.phone} />
          <InfoRow label="Registration Date" value={tenant.joined} />
        </div>
      </BentoCard>

      {/* 2. Documents & Verification */}
      <BentoCard
        title="Documents & Verification"
        icon={<FileText className="w-5 h-5 text-[#ffc670]" />}
        className="lg:col-span-2"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tenant.documents.map((doc) => {
            const getDocIcon = (title: string) => {
              if (title.includes("DTI") || title.includes("SEC"))
                return <Building2 className="w-5 h-5 text-text-secondary" />;
              if (title.includes("Mayor"))
                return <ShieldCheck className="w-5 h-5 text-text-secondary" />;
              if (title.includes("BIR"))
                return <Receipt className="w-5 h-5 text-text-secondary" />;
              return <FileText className="w-5 h-5 text-text-secondary" />;
            };

            return (
              <div
                key={doc.id}
                className="flex flex-col p-4 bg-white border border-gray-100 rounded-[20px] shadow-sm gap-4"
              >
                {/* Header: Icon, Title, Description, Required badge */}
                <div className="flex justify-between items-start gap-2">
                  <div className="flex gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center shrink-0 border border-gray-100">
                      {getDocIcon(doc.title)}
                    </div>
                    <div className="flex flex-col mt-0.5">
                      <span className="text-[15px] font-bold text-text-primary leading-tight">
                        {doc.title}
                      </span>
                      <span className="text-[13px] text-text-secondary mt-1 leading-snug">
                        {doc.description}
                      </span>
                    </div>
                  </div>
                  {doc.required && (
                    <span className="px-2.5 py-1 text-[10px] tracking-wide font-bold text-red-500 bg-red-50 rounded-full shrink-0 uppercase">
                      REQUIRED
                    </span>
                  )}
                </div>

                {/* File Area */}
                <div className="flex flex-col gap-3 mt-auto pt-4 border-t border-gray-50">
                  {doc.fileName ? (
                    <>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 max-w-[70%]">
                          <FileImage className="w-4 h-4 text-text-secondary shrink-0" />
                          <span
                            className="text-[13px] font-semibold text-text-primary truncate"
                            title={doc.fileName}
                          >
                            {doc.fileName}
                          </span>
                        </div>
                        {doc.url && (
                          <button
                            type="button"
                            onClick={() =>
                              setPreviewDocument({
                                url: doc.url || "",
                                title: doc.fileName || doc.title,
                              })
                            }
                            className="text-[12px] text-brand-primary font-bold hover:underline flex items-center gap-1 shrink-0"
                          >
                            View <Eye className="w-3 h-3" />
                          </button>
                        )}
                      </div>

                      {/* Actions / Status */}
                      <div className="flex items-center justify-between mt-1">
                        <Badge
                          color={
                            doc.status === "Approved"
                              ? "success"
                              : doc.status === "Revision Requested"
                                ? "error"
                                : "warning"
                          }
                          variant="outline"
                        >
                          {doc.status}
                        </Badge>

                        {doc.status === "Pending" && (
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() =>
                                onUpdateDocumentStatus(
                                  doc.id,
                                  "Revision Requested",
                                )
                              }
                              className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100"
                              title="Request Revision"
                            >
                              <AlertCircle className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() =>
                                onUpdateDocumentStatus(doc.id, "Approved")
                              }
                              className="p-1.5 text-green-500 hover:bg-green-50 rounded-lg transition-colors border border-transparent hover:border-green-100"
                              title="Approve"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-3 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50">
                      <span className="text-[13px] font-medium text-text-secondary">
                        Not Uploaded
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {previewDocument && (
          <div className="mt-5 rounded-2xl border border-gray-100 bg-gray-50/40 p-4 space-y-3">
            <div className="flex items-center justify-between gap-3">
              <h6 className="text-sm font-semibold text-text-primary truncate">
                Preview: {previewDocument.title}
              </h6>
              <button
                type="button"
                onClick={() => setPreviewDocument(null)}
                className="text-xs font-medium text-text-secondary hover:text-text-primary"
              >
                Close Preview
              </button>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
              <iframe
                src={previewDocument.url}
                title={previewDocument.title}
                className="w-full h-[58vh]"
              />
            </div>
          </div>
        )}
      </BentoCard>

      {/* 3. Subscription Details */}
      <BentoCard
        title="Subscription Plan"
        icon={<CreditCard className="w-5 h-5 text-[#ffc670]" />}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl font-bold text-text-primary">
              {tenant.plan}
            </span>
            <Badge color="success" variant="subtle">
              Active
            </Badge>
          </div>
          <InfoRow label="Billing Cycle" value={tenant.billingCycle} />
          <InfoRow label="Next Billing Date" value="May 15, 2026" />
          <div className="mt-4 flex-1 flex items-end">
            <Button variant="outline" className="w-full justify-center">
              Manage Plan
            </Button>
          </div>
        </div>
      </BentoCard>

      {/* 4. Feature Configuration */}
      <BentoCard
        title="Enabled Features"
        icon={<Settings className="w-5 h-5 text-[#ffc670]" />}
      >
        <div className="flex flex-col gap-3">
          {tenant.features.map((feature, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0"
            >
              <span className="text-[14px] text-text-primary font-medium">
                {feature}
              </span>
              <div className="w-2 h-2 rounded-full bg-green-500" />
            </div>
          ))}
          {tenant.features.length === 0 && (
            <span className="text-[14px] text-text-secondary py-2">
              No extra features enabled.
            </span>
          )}
        </div>
      </BentoCard>

      {/* 5. Quick Stats */}
      <BentoCard
        title="Quick Stats"
        className="bg-transparent border-none shadow-none p-0"
      >
        <div className="grid grid-cols-1 gap-4 h-full">
          <KPICard
            title="Total Locations"
            value="3"
            percentageChange={33}
            description="+1 this month"
            variant="outlined"
            className="shadow-sm border border-gray-100 h-full justify-center"
            icon={<MapPin size={24} />}
          />
          <KPICard
            title="Total Staff"
            value="18"
            description="Active now"
            variant="outlined"
            className="shadow-sm border border-gray-100 h-full justify-center"
            icon={<Users size={24} />}
          />
        </div>
      </BentoCard>
    </div>
  );
};
