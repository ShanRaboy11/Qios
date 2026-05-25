import React, { useEffect, useState } from "react";
import { BentoCard } from "@/components/molecules/BentoCard";
import { InfoRow } from "@/components/molecules/InfoRow";
import {
  Building2,
  FileText,
  Settings,
  CreditCard,
  Check,
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
import { Modal } from "@/components/molecules/Modal";

import { cn } from "@/lib/utils";

const formatPlanName = (name: string) =>
  name ? name.charAt(0).toUpperCase() + name.slice(1).toLowerCase() : name;

interface TenantProfileBentoGridProps {
  tenant: TenantProfileData;
  onUpdateDocumentStatus: (
    docId: string,
    newStatus: "Approved" | "Revision Requested",
  ) => void;
  onManagePlan: () => void;
  className?: string;
}

export const TenantProfileBentoGrid = ({
  tenant,
  onUpdateDocumentStatus,
  onManagePlan,
  className,
}: TenantProfileBentoGridProps) => {
  const [previewDocument, setPreviewDocument] = useState<{
    url: string;
    title: string;
  } | null>(null);

  useEffect(() => {
    setPreviewDocument(null);
  }, [tenant.id]);

  const subscriptionStatusColor =
    tenant.status === "Active"
      ? "success"
      : tenant.status === "Pending"
        ? "primary"
        : tenant.status === "Onboarding"
          ? "warning"
          : "error";

  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 auto-rows-[minmax(160px,auto)]",
        className,
      )}
    >
      {/* 1. Business Information - Top Left (Span 1x1) */}
      <div className="col-span-1 row-span-1 h-full">
        <BentoCard
          title="Business Details"
          icon={<Building2 className="w-5 h-5 text-brand-primary" />}
          className="h-full border-gray-100 shadow-sm relative overflow-hidden"
        >
          <div className="absolute -bottom-6 -right-6 opacity-5 pointer-events-none">
            <Building2 className="w-40 h-40" />
          </div>
          <div className="flex flex-col h-full space-y-3 relative z-10">
            <InfoRow label="Owner Name" value={tenant.owner} />
            <InfoRow label="Email Address" value={tenant.email} />
            <InfoRow label="Registration Date" value={tenant.joined} />
          </div>
        </BentoCard>
      </div>

      {/* 5. Quick Stats - Top Middle (Span 1x1) */}
      <div className="col-span-1 row-span-1 h-full flex flex-col sm:flex-row xl:flex-col gap-4">
        <KPICard
          title="Total Locations"
          value={String(tenant.totalLocations ?? 0)}
          description={
            (tenant.totalLocations ?? 0) === 1
              ? "Single location"
              : `${tenant.totalLocations} active branches`
          }
          variant="outlined"
          className="shadow-sm border-gray-100 h-full flex-1 justify-center bg-white rounded-[24px]"
          icon={<MapPin size={24} className="text-brand-primary" />}
        />
        <KPICard
          title="Total Staff"
          value={String(tenant.totalStaff ?? 0)}
          description={
            (tenant.totalStaff ?? 0) === 1
              ? "1 registered member"
              : `${tenant.totalStaff} registered members`
          }
          variant="outlined"
          className="shadow-sm border-gray-100 h-full flex-1 justify-center bg-white rounded-[24px]"
          icon={<Users size={24} className="text-[#FF5269]" />}
        />
      </div>

      {/* 3. Subscription Details - Right Side (Span 1x1) */}
      <div className="col-span-1 md:col-span-2 xl:col-span-1 h-full">
        <BentoCard
          title="Subscription"
          icon={<CreditCard className="w-5 h-5 text-brand-primary" />}
          className="h-full border-gray-100 shadow-sm"
        >
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-4xl font-black text-text-primary uppercase tracking-tight">
                {formatPlanName(tenant.plan)}
              </span>
              <Badge
                color={subscriptionStatusColor}
                variant="solid"
                className="px-3 shadow-sm"
              >
                {tenant.status}
              </Badge>
            </div>
            <div className="flex flex-col gap-3 p-4 bg-gray-50 rounded-[16px] border border-gray-100">
              <div className="flex justify-between items-center border-b border-gray-200/60 pb-3">
                <span className="text-sm font-medium text-text-secondary">
                  Billing Cycle
                </span>
                <span className="text-sm font-bold text-text-primary capitalize">
                  {tenant.billingCycle}
                </span>
              </div>
              <div className="flex justify-between items-center border-b border-gray-200/60 pb-3">
                <span className="text-sm font-medium text-text-secondary">
                  Next Billing
                </span>
                <span className="text-sm font-bold text-text-primary">
                  {(() => {
                    const now = new Date();
                    const isAnnual = tenant.billingCycle?.toLowerCase().includes("annual");
                    const next = new Date(now);
                    if (isAnnual) {
                      next.setFullYear(next.getFullYear() + 1);
                    } else {
                      next.setMonth(next.getMonth() + 1);
                    }
                    return next.toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    });
                  })()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-text-secondary">
                  Est. Amount
                </span>
                <span className="text-sm font-bold text-text-primary">
                  {(() => {
                    const isAnnual = tenant.billingCycle?.toLowerCase().includes("annual");
                    const rawPrice = isAnnual
                      ? tenant.priceAnnually
                      : tenant.priceMonthly;
                    if (!rawPrice) return "—";
                    const numericStr = rawPrice.replace(/[^0-9.]/g, "");
                    const numericVal = parseFloat(numericStr);
                    if (isNaN(numericVal)) return `₱${rawPrice}`;
                    return `₱${numericVal.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}`;
                  })()}
                </span>
              </div>
            </div>

            <div className="mt-2">
              <Button
                variant="outline"
                shape="pill"
                className="w-full justify-center border-gray-200 text-text-primary hover:bg-brand-primary hover:text-white hover:border-brand-primary font-bold shadow-sm"
                onClick={onManagePlan}
              >
                Manage Plan
              </Button>
            </div>
          </div>
        </BentoCard>
      </div>

      {/* 2. Documents & Verification - Wide (Span 2x2) */}
      <div className="col-span-1 md:col-span-2 xl:col-span-2 xl:row-span-2 h-full">
        <BentoCard
          title="Documents & Verification"
          icon={<FileText className="w-5 h-5 text-brand-primary" />}
          className="h-full border-gray-100 shadow-sm"
        >
          <div className="flex flex-col gap-3">
            {tenant.documents.map((doc) => {
              const getDocIcon = (title: string) => {
                if (title.includes("DTI") || title.includes("SEC"))
                  return <Building2 className="w-4 h-4 text-text-secondary" />;
                if (title.includes("Mayor"))
                  return (
                    <ShieldCheck className="w-4 h-4 text-text-secondary" />
                  );
                if (title.includes("BIR"))
                  return <Receipt className="w-4 h-4 text-text-secondary" />;
                return <FileText className="w-4 h-4 text-text-secondary" />;
              };

              return (
                <div
                  key={doc.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50/50 hover:bg-gray-50 border border-gray-100 hover:border-gray-200 rounded-[20px] transition-all gap-4 group"
                >
                  <div className="flex items-start sm:items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shrink-0 border border-gray-100 shadow-sm group-hover:scale-105 transition-transform">
                      {getDocIcon(doc.title)}
                    </div>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="text-[14px] font-bold text-text-primary">
                          {doc.title}
                        </span>
                        {doc.required && (
                          <span className="px-1.5 py-0.5 text-[9px] font-bold text-warning-primary bg-warning-secondary rounded uppercase">
                            Req
                          </span>
                        )}
                      </div>
                      <span className="text-[12px] text-text-secondary mt-0.5 line-clamp-1 max-w-[200px] sm:max-w-[300px]">
                        {doc.description}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 sm:ml-auto w-full sm:w-auto justify-between sm:justify-end border-t sm:border-0 border-gray-100 pt-3 sm:pt-0">
                    {doc.fileName ? (
                      <>
                        {doc.url && (
                          <button
                            type="button"
                            onClick={() =>
                              setPreviewDocument({
                                url: doc.url || "",
                                title: doc.fileName || doc.title,
                              })
                            }
                            className="text-[12px] text-text-secondary hover:text-brand-primary font-bold flex items-center gap-1 shrink-0 transition-colors bg-white border border-gray-200 px-2.5 py-1.5 rounded-lg shadow-sm hover:shadow"
                          >
                            <Eye className="w-3.5 h-3.5" /> View
                          </button>
                        )}
                      </>
                    ) : (
                      <span className="text-[12px] font-medium text-text-secondary px-3 py-1 bg-white border border-dashed border-gray-200 rounded-lg">
                        Not Uploaded
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </BentoCard>
      </div>

      {/* 4. Feature Configuration - Bottom Right (Span 1x1) */}
      <div className="col-span-1 md:col-span-2 xl:col-span-1 h-full">
        <BentoCard
          title="Enabled Features"
          icon={<Settings className="w-5 h-5 text-brand-primary" />}
          className="h-full border-gray-100 shadow-sm"
        >
          <div className="flex flex-col gap-2 h-full justify-start">
            {tenant.features.map((feature, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3.5 bg-gray-50 border border-transparent hover:border-gray-100 rounded-[16px] transition-colors"
              >
                <span className="text-[14px] text-text-primary font-bold">
                  {feature}
                </span>
                <div className="flex items-center justify-center w-5 h-5 rounded-full bg-success-primary text-white shrink-0 shadow-sm">
                  <Check className="w-3 h-3" />
                </div>
              </div>
            ))}
            {tenant.features.length === 0 && (
              <div className="p-5 text-center rounded-[16px] bg-gray-50 border border-gray-100 flex-1 flex items-center justify-center">
                <span className="text-[14px] text-text-secondary font-medium">
                  No extra features enabled.
                </span>
              </div>
            )}
          </div>
        </BentoCard>
      </div>

      <Modal
        isOpen={Boolean(previewDocument)}
        onClose={() => setPreviewDocument(null)}
        title={
          previewDocument ? `Preview: ${previewDocument.title}` : "Preview"
        }
        className="max-w-5xl md:translate-y-9"
      >
        {previewDocument && (
          <div className="rounded-[24px] border border-gray-200 bg-white overflow-hidden shadow-sm">
            <iframe
              src={previewDocument.url}
              title={previewDocument.title}
              className="w-full h-[65vh] bg-gray-50"
            />
          </div>
        )}
      </Modal>
    </div>
  );
};
