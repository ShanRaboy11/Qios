"use client";

import React, { useState } from "react";
import {
  FileUp,
  CheckCircle2,
  Info,
  X,
  ArrowRight,
  ArrowLeft,
  FileText,
  Landmark,
  Receipt,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { Badge } from "@/components/atoms/Badge";
import { cn } from "@/lib/utils";

interface DocumentUploadProps {
  data: Record<string, File>;
  setData: React.Dispatch<React.SetStateAction<Record<string, File>>>;
  onNext: () => Promise<void> | void;
  onBack: () => void;
  loading?: boolean;
}

const requirements = [
  {
    id: "dti_sec",
    title: "DTI or SEC Registration",
    desc: "Sole proprietor or Corporation registration.",
    required: true,
    icon: Landmark,
  },
  {
    id: "permit",
    title: "Mayor’s Permit",
    desc: "Includes local LGU and Barangay permits.",
    required: true,
    icon: ShieldCheck,
  },
  {
    id: "sanitary",
    title: "Sanitary Permit",
    desc: "Health certificates from your local LGU.",
    required: true,
    icon: FileText,
  },
  {
    id: "bir",
    title: "BIR Registration",
    desc: "TIN and Official Receipt compliance.",
    required: true,
    icon: Receipt,
  },
  {
    id: "fda",
    title: "FDA Licensing",
    desc: "For pre-packaged or manufactured food.",
    required: false,
    icon: FileText,
  },
];

export function DocumentUpload({
  data,
  setData,
  onNext,
  onBack,
  loading = false,
}: DocumentUploadProps) {
  const handleFileChange = (id: string, file: File) => {
    setData((prev) => ({
      ...prev,
      [id]: file,
    }));
  };

  const removeFile = (id: string) => {
    const newData = { ...data };
    delete newData[id];
    setData(newData);
  };

  const isComplete = requirements
    .filter((r) => r.required)
    .every((r) => Boolean(data[r.id]));

  return (
    <div className="flex flex-col w-full max-w-[1200px] mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/60 p-8 rounded-[28px] border border-[var(--kds-border-warm)] backdrop-blur-sm">
        <div className="space-y-1 text-center md:text-left">
          <h3 className="h4 text-[var(--color-text-primary)] font-bold">
            Business Documentation
          </h3>
          <p className="b2 text-[var(--color-text-secondary)]">
            Please upload the required Philippine legal permits.
          </p>
        </div>
        <Badge
          color="info"
          variant="subtle"
          shape="pill"
          leftIcon={<Info size={14} />}
        >
          Food Industry Standards
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
        {requirements.map((req) => (
          <div
            key={req.id}
            className={cn(
              "group relative p-8 rounded-[24px] border-2 transition-all duration-500 bg-white overflow-hidden",
              data[req.id]?.name
                ? "border-[var(--color-success-primary)] shadow-lg shadow-green-100/50"
                : "border-neutral-100 hover:border-[var(--color-brand-primary)] hover:shadow-xl hover:shadow-orange-100/30",
            )}
          >
            {data[req.id]?.name && (
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-[var(--color-success-secondary)] rounded-full blur-3xl opacity-50" />
            )}

            <div className="relative z-10 flex flex-col h-full justify-between gap-6">
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div
                    className={cn(
                      "p-3 rounded-xl transition-colors duration-300",
                      data[req.id]?.name
                        ? "bg-[var(--color-success-secondary)] text-[var(--color-success-primary)]"
                        : "bg-neutral-50 text-neutral-400 group-hover:bg-orange-50 group-hover:text-[var(--color-brand-primary)]",
                    )}
                  >
                    <req.icon size={24} />
                  </div>

                  {req.required && !data[req.id]?.name && (
                    <Badge
                      color="error"
                      variant="subtle"
                      shape="pill"
                      className="text-[10px] uppercase tracking-wider font-bold"
                    >
                      Required
                    </Badge>
                  )}
                  {data[req.id]?.name && (
                    <CheckCircle2
                      size={24}
                      className="text-[var(--color-success-primary)] animate-in zoom-in duration-300"
                    />
                  )}
                </div>

                <div>
                  <h4 className="b2 font-bold text-[var(--color-text-primary)] mb-1">
                    {req.title}
                  </h4>
                  <p className="b4 text-[var(--color-text-secondary)] leading-relaxed">
                    {req.desc}
                  </p>
                </div>
              </div>

              <div className="mt-auto">
                {data[req.id] ? (
                  <div className="flex items-center justify-between bg-neutral-50 p-2 rounded-xl border border-neutral-100 animate-in slide-in-from-left-2">
                    <span className="b4 font-medium text-neutral-600 pl-2 truncate max-w-[220px]">
                      {data[req.id]?.name}
                    </span>
                    <button
                      onClick={() => removeFile(req.id)}
                      type="button"
                      className="p-2 hover:bg-red-50 text-red-400 hover:text-red-600 rounded-lg transition-all"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <label className="block w-full cursor-pointer">
                    <input
                      type="file"
                      className="hidden"
                      onChange={(e) =>
                        e.target.files?.[0] &&
                        handleFileChange(req.id, e.target.files[0])
                      }
                    />
                    <div className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-neutral-200 rounded-xl hover:border-[var(--color-brand-primary)] hover:bg-orange-50/50 transition-all b3 font-bold text-neutral-400 hover:text-[var(--color-brand-primary)]">
                      <FileUp size={18} />
                      Upload File
                    </div>
                  </label>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-row items-center justify-center gap-4 md:gap-8 pt-8">
        <Button
          variant="ghost"
          size="lg"
          className="h-14 px-6 md:px-10 b2 border-neutral-200 text-neutral-500"
          onClick={onBack}
          disabled={loading}
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </Button>
        <Button
          variant="primary"
          size="lg"
          className={cn(
            "flex-1 h-14 b2 max-w-[320px] font-bold text-lg shadow-xl",
            isComplete && !loading
              ? "shadow-orange-200/50"
              : "bg-neutral-200 text-white cursor-not-allowed shadow-none",
          )}
          onClick={async () => isComplete && !loading && (await onNext())}
          disabled={!isComplete || loading}
        >
          {loading ? "Uploading…" : "Continue"}
          {!loading && <ArrowRight className="w-5 h-5 ml-2" />}
        </Button>
      </div>
    </div>
  );
}
