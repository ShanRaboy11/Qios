"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Button, type ButtonVariant } from "@/components/atoms/Button";
import { Badge } from "@/components/atoms/Badge";

type ConfirmationAction =
  | "save"
  | "copy"
  | "delete"
  | "approve"
  | "reject"
  | "success";

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

// ── Per-action icon stroke colors (explicit, accessible) ─────────────────────
const ICON_COLORS = {
  save: "#C07A00",
  copy: "#185FA5",
  delete: "#A32D2D",
  approve: "#27500A",
  reject: "#854F0B",
  success: "#27500A",
} as const;

const ACTION_CONFIG = {
  save: {
    iconBg: "bg-[#FFF3DA]",
    kicker: "Unsaved changes",
    kickerColor: "text-[#C07A00]",
    tag: null,
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path
          d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2Z"
          stroke={ICON_COLORS.save}
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M17 21v-8H7v8M7 3v5h8"
          stroke={ICON_COLORS.save}
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    confirmVariant: "primary" as ButtonVariant,
    confirmClass: "!bg-[#FFD77A] !text-[#7A5800] hover:!bg-[#f5cc6a]",
  },

  copy: {
    iconBg: "bg-[#E6F1FB]",
    kicker: "Duplicate plan",
    kickerColor: "text-[#185FA5]",
    tag: null,
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <rect
          x="8"
          y="8"
          width="12"
          height="12"
          rx="3"
          stroke={ICON_COLORS.copy}
          strokeWidth="1.6"
        />
        <path
          d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"
          stroke={ICON_COLORS.copy}
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
    ),
    confirmVariant: "primary" as ButtonVariant,
    confirmClass: "!bg-[#378ADD] !text-white hover:!bg-[#2e78c8]",
  },

  delete: {
    iconBg: "bg-[#FCEBEB]",
    kicker: "Destructive action",
    kickerColor: "text-[#A32D2D]",
    tag: {
      text: "Permanent",
      color: "error" as const,
      variant: "subtle" as const,
    },
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path
          d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"
          stroke={ICON_COLORS.delete}
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M10 11v6M14 11v6"
          stroke={ICON_COLORS.delete}
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
    ),
    confirmVariant: "warning" as ButtonVariant,
    confirmClass: "!bg-[#E24B4A] !text-white hover:!bg-[#cc3f3e]",
  },

  approve: {
    iconBg: "bg-[#EAF3DE]",
    kicker: "Membership approval",
    kickerColor: "text-[#3B6D11]",
    tag: {
      text: "Verified",
      color: "success" as const,
      variant: "subtle" as const,
    },
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <circle
          cx="12"
          cy="12"
          r="9"
          stroke={ICON_COLORS.approve}
          strokeWidth="1.6"
        />
        <path
          d="M8 12l3 3 5-5"
          stroke={ICON_COLORS.approve}
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    confirmVariant: "approve" as ButtonVariant,
    confirmClass: "!bg-[#639922] !text-white hover:!bg-[#568018]",
  },

  reject: {
    iconBg: "bg-[#FAEEDA]",
    kicker: "Application review",
    kickerColor: "text-[#854F0B]",
    tag: null,
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path
          d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z"
          stroke={ICON_COLORS.reject}
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M12 9v4"
          stroke={ICON_COLORS.reject}
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <circle cx="12" cy="17" r="1" fill={ICON_COLORS.reject} />
      </svg>
    ),
    confirmVariant: "warning" as ButtonVariant,
    confirmClass: "!bg-[#BA7517] !text-white hover:!bg-[#a56612]",
  },

  success: {
    iconBg: "bg-[#EAF3DE]",
    kicker: "Complete",
    kickerColor: "text-[#3B6D11]",
    tag: null,
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <circle
          cx="12"
          cy="12"
          r="9"
          stroke={ICON_COLORS.success}
          strokeWidth="1.6"
        />
        <path
          d="M8 12l3 3 5-5"
          stroke={ICON_COLORS.success}
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    confirmVariant: "primary" as ButtonVariant,
    confirmClass: "!bg-[#3B6D11] !text-white hover:!bg-[#2f5a0d]",
  },
} as const;

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
  if (!isOpen || !action) return null;

  const cfg = ACTION_CONFIG[action];
  const isSuccess = action === "success";

  const formatName = (s?: string) =>
    s ? s.charAt(0).toUpperCase() + s.slice(1) : s;

  const resolvedTitle =
    title ??
    (
      {
        save: "Lock in your edits?",
        copy: "Make a copy of this plan?",
        approve: "Grant full access?",
        reject: "Turn down this application?",
        delete: "This can't be undone.",
        success: "You're all set.",
      } as Record<ConfirmationAction, string>
    )[action];

  const resolvedMessage =
    message ??
    (action === "save" ? (
      <>
        <strong className="font-semibold text-text-primary">
          {formatName(draftPlanName) ?? "Premium Plan"}
        </strong>{" "}
        will be updated everywhere. This replaces the current live version.
      </>
    ) : action === "copy" ? (
      <>
        A new draft of{" "}
        <strong className="font-semibold text-text-primary">
          {formatName(activePlanName) ?? "Premium Plan"}
        </strong>{" "}
        will be added to your workspace. You can edit it independently.
      </>
    ) : action === "approve" ? (
      <>
        <strong className="font-semibold text-text-primary">
          {formatName(activePlanName) ?? "This user"}
        </strong>{" "}
        will be verified and unlocked across all platform features.
      </>
    ) : action === "reject" ? (
      <>
        <strong className="font-semibold text-text-primary">
          {formatName(activePlanName) ?? "This user"}
        </strong>{" "}
        will be notified with your reason. They can reapply after resolving the
        issue.
      </>
    ) : action === "success" ? (
      <>Your changes are live. Everything looks good from here.</>
    ) : (
      <>
        <strong className="font-semibold text-text-primary">
          {formatName(activePlanName) ?? "Active Plan"}
        </strong>{" "}
        will be permanently deleted — all settings, history, and linked data
        gone with it.
      </>
    ));

  const resolvedConfirmLabel =
    confirmLabel ??
    (
      {
        save: "Save changes",
        copy: "Create copy",
        approve: "Approve",
        reject: "Reject",
        delete: "Yes, delete",
        success: "Done",
      } as Record<ConfirmationAction, string>
    )[action];

  const resolvedConfirmVariant = confirmVariant ?? cfg.confirmVariant;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-text-primary/40 backdrop-blur-sm p-4">
      <div
        className={cn(
          "bg-[var(--color-bg-primary)] rounded-[20px] w-full shadow-xl overflow-hidden",
          "animate-in fade-in zoom-in-95 duration-200",
          requireReason ? "max-w-md" : "max-w-sm",
        )}
      >
        {/* ── Header ── */}
        <div className="px-7 pt-8 pb-5 flex flex-col items-center text-center">
          {/* Icon */}
          <div
            className={cn(
              "w-14 h-14 rounded-2xl flex items-center justify-center mb-4",
              cfg.iconBg,
            )}
          >
            {cfg.icon}
          </div>

          {/* Badge */}
          {cfg.tag && (
            <div className="mb-3">
              <Badge
                color={cfg.tag.color}
                variant={cfg.tag.variant}
                shape="pill"
              >
                {cfg.tag.text}
              </Badge>
            </div>
          )}

          {/* Kicker */}
          <p
            className={cn(
              "text-[10px] font-bold uppercase tracking-[0.1em] mb-1.5",
              cfg.kickerColor,
            )}
          >
            {cfg.kicker}
          </p>

          {/* Title */}
          <h3 className="text-[17px] font-semibold leading-snug text-text-primary mb-2">
            {resolvedTitle}
          </h3>

          {/* Description */}
          <p className="text-[12.5px] leading-relaxed text-text-secondary">
            {resolvedMessage}
          </p>
        </div>

        {/* ── Reason textarea ── */}
        {requireReason && (
          <div className="px-7 pb-5">
            <label className="block text-[10px] font-bold uppercase tracking-[0.06em] text-text-secondary mb-1.5">
              Reason <span className="text-[#A32D2D]">*</span>
            </label>
            <textarea
              placeholder="e.g. The submitted registration appears expired. Please resubmit with a valid, up-to-date copy."
              value={reasonValue ?? ""}
              onChange={(e) => onReasonChange?.(e.target.value)}
              rows={4}
              className={cn(
                "w-full bg-white text-[12.5px] px-3.5 py-2.5",
                "rounded-xl border border-black/10 outline-none resize-y",
                "placeholder:text-text-secondary text-text-primary leading-relaxed",
                "transition-colors duration-150",
                "focus:border-[#378ADD]",
              )}
            />
          </div>
        )}

        {/* ── Divider ── */}
        <div className="h-px bg-black/[0.05] mx-7" />

        {/* ── Actions ── */}
        <div className="px-7 py-4 flex items-center gap-2.5">
          {!isSuccess && (
            <Button
              variant="ghost"
              size="md"
              shape="pill"
              onClick={onClose}
              disabled={saving}
              className="flex-1 h-10 text-[13px] text-text-secondary border border-black/10 hover:bg-black/[0.04] hover:text-text-primary"
            >
              {cancelLabel}
            </Button>
          )}

          <Button
            variant={resolvedConfirmVariant}
            size="md"
            shape="pill"
            onClick={onConfirm}
            loading={saving}
            disabled={saving}
            className={cn("flex-1 h-10 text-[13px]", cfg.confirmClass)}
          >
            {resolvedConfirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
