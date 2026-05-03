"use client";

import React from "react";
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
import { DOCUMENT_REQUIREMENTS } from "../documentRequirements";

interface DocumentUploadProps {
  data: Record<string, File>;
  existingUrls: Record<string, string>;
  setData: React.Dispatch<React.SetStateAction<Record<string, File>>>;
  onNext: () => Promise<void> | void;
  onBack: () => void;
  loading?: boolean;
}

export function DocumentUpload({
  data,
  existingUrls,
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

  const isComplete = DOCUMENT_REQUIREMENTS.filter((r) => r.required).every(
    (r) => Boolean(data[r.id] || existingUrls[r.id]),
  );

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
        {DOCUMENT_REQUIREMENTS.map((req) => {
          const selectedFile = data[req.id];
          const existingUrl = existingUrls[req.id];

          return (
            <div
              key={req.id}
              className={cn(
                "group relative overflow-hidden rounded-[24px] border-2 bg-white p-8 transition-all duration-500",
                selectedFile || existingUrl
                  ? "border-[var(--color-success-primary)] shadow-lg shadow-green-100/50"
                  : "border-neutral-100 hover:border-[var(--color-brand-primary)] hover:shadow-xl hover:shadow-orange-100/30",
              )}
            >
              {(selectedFile || existingUrl) && (
                <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-[var(--color-success-secondary)] opacity-50 blur-3xl" />
              )}

              <div className="relative z-10 flex h-full flex-col justify-between gap-6">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div
                      className={cn(
                        "rounded-xl p-3 transition-colors duration-300",
                        selectedFile || existingUrl
                          ? "bg-[var(--color-success-secondary)] text-[var(--color-success-primary)]"
                          : "bg-neutral-50 text-neutral-400 group-hover:bg-orange-50 group-hover:text-[var(--color-brand-primary)]",
                      )}
                    >
                      <req.icon size={24} />
                    </div>

                    {req.required && !selectedFile && !existingUrl && (
                      <Badge
                        color="error"
                        variant="subtle"
                        shape="pill"
                        className="text-[10px] font-bold uppercase tracking-wider"
                      >
                        Required
                      </Badge>
                    )}
                    {(selectedFile || existingUrl) && (
                      <CheckCircle2
                        size={24}
                        className="text-[var(--color-success-primary)] animate-in zoom-in duration-300"
                      />
                    )}
                  </div>

                  <div>
                    <h4 className="b2 mb-1 font-bold text-[var(--color-text-primary)]">
                      {req.title}
                    </h4>
                    <p className="b4 leading-relaxed text-[var(--color-text-secondary)]">
                      {req.desc}
                    </p>
                  </div>
                </div>

                <div className="mt-auto">
                  <div className="space-y-3">
                    {selectedFile ? (
                      <div className="animate-in slide-in-from-left-2 flex items-center justify-between gap-3 rounded-xl border border-neutral-100 bg-neutral-50 p-2">
                        <span className="b4 max-w-[220px] truncate pl-2 font-medium text-neutral-600">
                          {selectedFile.name}
                        </span>
                        <button
                          onClick={() => removeFile(req.id)}
                          type="button"
                          className="rounded-lg p-2 text-red-400 transition-all hover:bg-red-50 hover:text-red-600"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ) : existingUrl ? (
                      <div className="animate-in slide-in-from-left-2 rounded-xl border border-[var(--color-success-primary)]/20 bg-[var(--color-success-secondary)]/40 p-3">
                        <div className="flex items-center justify-between gap-3">
                          <div className="min-w-0">
                            <p className="text-xs font-bold uppercase tracking-wider text-[var(--color-success-primary)]">
                              Already Uploaded
                            </p>
                            <p className="mt-1 truncate text-[11px] text-neutral-500">
                              Saved from your previous session
                            </p>
                          </div>
                          <label className="inline-flex cursor-pointer items-center justify-center rounded-lg border border-[var(--color-brand-primary)]/20 bg-white px-3 py-2 text-xs font-bold text-[var(--color-brand-primary)] transition-colors hover:bg-orange-50">
                            Replace
                            <input
                              type="file"
                              className="hidden"
                              onChange={(e) =>
                                e.target.files?.[0] &&
                                handleFileChange(req.id, e.target.files[0])
                              }
                            />
                          </label>
                        </div>
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
                        <div className="b3 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-neutral-200 py-3 font-bold text-neutral-400 transition-all hover:border-[var(--color-brand-primary)] hover:bg-orange-50/50 hover:text-[var(--color-brand-primary)]">
                          <FileUp size={18} />
                          Upload File
                        </div>
                      </label>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
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
