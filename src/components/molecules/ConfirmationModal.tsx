"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Button, type ButtonVariant } from "@/components/atoms/Button";

type ConfirmationAction = "save" | "copy" | "delete" | "approve" | "reject" | "success";

type ActionConfirmationModalProps = {
  isOpen: boolean;
  action: ConfirmationAction | null;
  draftPlanName?: string;
  activePlanName?: string;
  title?: React.ReactNode;
  message?: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  confirmVariant?: ButtonVariant;
  saving?: boolean;
  requireReason?: boolean;
  reasonValue?: string;
  onReasonChange?: (val: string) => void;
  onClose: () => void;
  onConfirm: () => void;
};

export function ActionConfirmationModal({
  isOpen,
  action,
  draftPlanName,
  activePlanName,
  title,
  message,
  confirmLabel,
  cancelLabel = "Cancel",
  confirmVariant,
  saving = false,
  requireReason = false,
  reasonValue,
  onReasonChange,
  onClose,
  onConfirm,
}: ActionConfirmationModalProps) {
  if (!isOpen || !action) {
    return null;
  }

  const formatName = (s?: string) =>
    s ? s.charAt(0).toUpperCase() + s.slice(1) : s;

  const isDeleteLike = action === "delete" || action === "reject";
  const resolvedTitle =
    title ??
    (action === "save"
      ? "Save Changes?"
      : action === "copy"
        ? "Copy This Plan?"
        : action === "approve"
          ? "Approve This User?"
          : action === "reject"
            ? "Reject This User?"
            : "Delete This Plan?");
  const resolvedMessage =
    message ??
    (action === "save" ? (
      <>
        Your edits to{" "}
        <span className="font-semibold text-text-primary">
          "{formatName(draftPlanName) ?? "this plan"}"
        </span>{" "}
        will be saved permanently.
      </>
    ) : action === "copy" ? (
      <>
        A new copy of{" "}
        <span className="font-semibold text-text-primary">
          "{formatName(activePlanName) ?? "this plan"}"
        </span>{" "}
        will be created.
      </>
    ) : action === "approve" ? (
      <>
        Are you sure you want to approve{" "}
        <span className="font-semibold text-text-primary">
          "{formatName(activePlanName) ?? "this user"}"
        </span>{" "}
        and grant full access?
      </>
    ) : action === "reject" ? (
      <>
        Are you sure you want to reject{" "}
        <span className="font-semibold text-text-primary">
          "{formatName(activePlanName) ?? "this user"}"
        </span>{" "}
        ? This action cannot be undone immediately.
      </>
    ) : (
      <>
        Are you sure you want to remove{" "}
        <span className="font-semibold text-text-primary">
          "{formatName(activePlanName) ?? "this item"}"
        </span>
        ? This action cannot be undone.
      </>
    ));
  const resolvedConfirmLabel =
    confirmLabel ??
    (action === "save"
      ? "Save Changes"
      : action === "copy"
        ? "Create Copy"
        : action === "approve"
          ? "Approve"
          : action === "reject"
            ? "Reject"
            : action === "success"
              ? "Close"
              : "Yes, Delete");
  const resolvedConfirmVariant: ButtonVariant =
    confirmVariant ?? (isDeleteLike ? "outline" : "primary");

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-text-primary/45 backdrop-blur-sm p-4">
      <div
        className={cn(
          "bg-white rounded-[28px] w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200",
          requireReason ? "max-w-md" : "max-w-sm",
        )}
        style={{
          boxShadow:
            "0 24px 64px rgba(0,0,0,0.14), 0 4px 16px rgba(0,0,0,0.08)",
        }}
      >
        <div className="flex flex-col items-center text-center px-8 pt-8 pb-6">
          <div
            className={cn(
              "flex items-center justify-center mb-5",
              isDeleteLike
                ? "w-14 h-14 rounded-2xl bg-[#fff0f0]"
                : "w-14 h-14 rounded-2xl",
              action === "copy" && "bg-[#fff3da]",
              action === "save" && "bg-[#e0fad6]",
              action === "success" && "bg-[#e0fad6]",
              action === "approve" && "bg-[#e0fad6]",
              action === "reject" && "bg-[#fff0f0]",
            )}
            style={{
              boxShadow: isDeleteLike
                ? "0 4px 18px rgba(255,82,105,0.18)"
                : action === "copy"
                  ? "0 4px 18px rgba(255,215,122,0.35)"
                  : "0 4px 18px rgba(31,173,102,0.18)",
            }}
          >
            {isDeleteLike ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z"
                  stroke="#ec1313"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 9v4"
                  stroke="#ec1313"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                />
                <circle cx="12" cy="17" r="1" fill="#ec1313" />
              </svg>
            ) : action === "success" ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M20 6L9 17l-5-5"
                  stroke="#1fad66"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            ) : action === "copy" ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <rect
                  x="8"
                  y="8"
                  width="12"
                  height="12"
                  rx="3"
                  stroke="#c07a00"
                  strokeWidth="1.75"
                />
                <path
                  d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"
                  stroke="#c07a00"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                />
              </svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2Z"
                  stroke="#1fad66"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M17 21v-8H7v8M7 3v5h8"
                  stroke="#1fad66"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </div>

          <h3 className="font-bold text-[17px] text-text-primary leading-snug">
            {resolvedTitle}
          </h3>

          <p className="text-[13px] text-text-secondary mt-2 leading-relaxed max-w-[270px]">
            {resolvedMessage}
          </p>
        </div>

        {requireReason && (
          <div className="px-6 pb-2">
            <label className="b4 ml-1 font-medium text-text-secondary">
              Reason {"(Required)"}
            </label>
            <textarea
              placeholder="e.g. The submitted DTI/SEC registration appears to be expired or incomplete. Please resubmit with a valid, up-to-date copy of your business registration certificate."
              value={reasonValue ?? ""}
              onChange={(e) => onReasonChange?.(e.target.value)}
              rows={4}
              className="w-full bg-white text-sm md:text-[16px] px-4 py-3 transition-all duration-300 outline-none rounded-2xl border-2 border-[#E5E5E5] focus:border-brand-primary focus:shadow-[0_0_0_2px_rgba(255,198,112,0.15)] placeholder:text-text-secondary text-text-primary resize-y"
            />
          </div>
        )}

        <div className="h-px bg-black/[0.05] mx-6" />

        <div className="px-6 py-5 flex items-center gap-3">
          {action !== "success" && (
            <Button
              variant="ghost"
              onClick={onClose}
              disabled={saving}
              className="flex-1 rounded-xl h-11 text-[13.5px] font-medium text-text-secondary hover:bg-black/[0.04] hover:text-text-primary transition-all duration-150 border border-black/[0.07]"
            >
              {cancelLabel}
            </Button>
          )}
          <Button
            variant={resolvedConfirmVariant}
            onClick={onConfirm}
            loading={saving}
            disabled={saving}
            className={cn(
              "flex-1 rounded-xl h-11 text-[13.5px] font-semibold transition-all duration-200 shadow-sm active:scale-[0.98]",
              isDeleteLike &&
                "bg-warning-secondary text-warning-primary border-2 border-warning-primary/20 hover:bg-warning-primary hover:text-white hover:border-warning-primary hover:shadow-md",
            )}
          >
            {resolvedConfirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
