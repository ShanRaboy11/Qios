"use client";

import React, { useEffect, useState } from "react";
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
  Eye,
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
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);
  const [previewIsImage, setPreviewIsImage] = useState(false);

  // fIXED: Dependency array size must remain constant.
  // we use previewSrc to ensure clean up happens when source changes or unmounts.
  useEffect(() => {
    return () => {
      if (previewSrc && previewSrc.startsWith("blob:")) {
        URL.revokeObjectURL(previewSrc);
      }
    };
  }, [previewSrc]);

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

  const openPreviewForFile = (file: File) => {
    if (previewSrc && previewSrc.startsWith("blob:")) {
      URL.revokeObjectURL(previewSrc);
    }
    const url = URL.createObjectURL(file);
    setPreviewSrc(url);
    setPreviewIsImage(file.type.startsWith("image/"));
    setPreviewOpen(true);
  };

  const openPreviewForUrl = (url: string) => {
    if (previewSrc && previewSrc.startsWith("blob:")) {
      URL.revokeObjectURL(previewSrc);
    }
    setPreviewSrc(url);
    const lowered = url.split("?")[0].toLowerCase();
    setPreviewIsImage(/\.(jpg|jpeg|png|gif|webp|bmp)$/.test(lowered));
    setPreviewOpen(true);
  };

  const closePreview = () => {
    setPreviewOpen(false);
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

      {/* preview Modal - High Z-index to cover Qios header */}
      {previewOpen && previewSrc && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="absolute inset-0" onClick={closePreview} />
          <div className="relative z-10 w-full max-w-6xl max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <div className="font-bold text-lg text-neutral-800">
                Document Preview
              </div>
              <div className="flex items-center gap-6">
                <a
                  href={previewSrc}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm font-bold text-[var(--color-brand-primary)] hover:underline"
                >
                  Open in new tab
                </a>
                <button
                  onClick={closePreview}
                  type="button"
                  className="rounded-full p-1 text-neutral-500 hover:bg-neutral-100 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            <div className="flex-1 bg-neutral-50 overflow-auto p-4 flex items-center justify-center">
              {previewIsImage ? (
                <img
                  src={previewSrc}
                  alt="preview"
                  className="max-w-full max-h-full object-contain"
                />
              ) : (
                <iframe
                  src={previewSrc}
                  className="w-full h-[75vh] border-0 bg-white"
                  title="document preview"
                />
              )}
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
        {DOCUMENT_REQUIREMENTS.map((req) => {
          const selectedFile = data[req.id];
          const existingUrl = existingUrls[req.id];
          const hasFile = !!(selectedFile || existingUrl);

          return (
            <div
              key={req.id}
              onClick={() => {
                if (selectedFile) openPreviewForFile(selectedFile);
                else if (existingUrl) openPreviewForUrl(existingUrl);
              }}
              className={cn(
                "group relative overflow-hidden rounded-[24px] border-2 bg-white p-8 transition-all duration-500",
                hasFile
                  ? "border-[var(--color-success-primary)] shadow-lg cursor-pointer"
                  : "border-neutral-100 hover:border-[var(--color-brand-primary)] hover:shadow-xl",
              )}
            >
              {hasFile && (
                <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-[var(--color-success-secondary)] opacity-50 blur-3xl" />
              )}

              <div className="relative z-10 flex h-full flex-col justify-between gap-6">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div
                      className={cn(
                        "rounded-xl p-3 transition-colors duration-300",
                        hasFile
                          ? "bg-[var(--color-success-secondary)] text-[var(--color-success-primary)]"
                          : "bg-neutral-50 text-neutral-400 group-hover:bg-orange-50 group-hover:text-[var(--color-brand-primary)]",
                      )}
                    >
                      <req.icon size={24} />
                    </div>
                    {req.required && !hasFile && (
                      <Badge
                        color="error"
                        variant="subtle"
                        shape="pill"
                        className="text-[10px] font-bold uppercase tracking-wider"
                      >
                        Required
                      </Badge>
                    )}
                    {hasFile && (
                      <CheckCircle2
                        size={24}
                        className="text-[var(--color-success-primary)]"
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
                  {selectedFile ? (
                    /* Newly Uploaded Bar - Matches Textbox.png gaps */
                    <div className="flex items-center justify-between rounded-xl border border-neutral-100 bg-neutral-50 p-4">
                      <div className="flex items-center gap-4 min-w-0">
                        <Eye
                          size={18}
                          className="text-[var(--color-brand-primary)]"
                        />
                        <span className="b4 truncate font-medium text-neutral-600">
                          {selectedFile.name}
                        </span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFile(req.id);
                        }}
                        type="button"
                        className="text-red-400 hover:text-red-600"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  ) : existingUrl ? (
                    /* Already Uploaded - Text on top, buttons below */
                    <div className="rounded-xl border border-[var(--color-success-primary)]/20 bg-[var(--color-success-secondary)]/40 p-4 flex flex-col gap-4">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-[var(--color-success-primary)]">
                          Already Uploaded
                        </p>
                        <p className="text-[11px] font-medium text-neutral-500">
                          Saved from previous session
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          className="flex-1 h-9 rounded-lg border border-neutral-200 bg-white text-xs font-bold text-[var(--color-brand-primary)] transition-all hover:bg-orange-50"
                        >
                          <Eye size={14} className="inline mr-2" /> View
                        </button>
                        <label
                          className="flex-1 h-9 flex items-center justify-center cursor-pointer rounded-lg border border-neutral-200 bg-white text-xs font-bold text-[var(--color-brand-primary)] transition-all hover:bg-orange-50"
                          onClick={(e) => e.stopPropagation()}
                        >
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
                      <div className="b3 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-neutral-200 py-3 font-bold text-neutral-400 transition-all hover:border-[var(--color-brand-primary)] hover:bg-orange-50">
                        <FileUp size={18} /> Upload File
                      </div>
                    </label>
                  )}
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
          className="h-14 px-6 md:px-10 b2"
          onClick={onBack}
          disabled={loading}
        >
          <ArrowLeft className="w-5 h-5 mr-2" /> Back
        </Button>
        <Button
          variant="primary"
          size="lg"
          className={cn(
            "flex-1 h-14 b2 max-w-[320px] font-bold text-lg",
            isComplete && !loading
              ? "shadow-xl shadow-orange-200"
              : "bg-neutral-200 cursor-not-allowed",
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
