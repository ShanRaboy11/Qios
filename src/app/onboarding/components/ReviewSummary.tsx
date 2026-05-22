"use client";

import React from "react";
import { ArrowLeft, CheckCircle2, ClipboardCheck } from "lucide-react";
import { Button } from "@/components/atoms/Button";

const formatPlanName = (name: string) =>
  name ? name.charAt(0).toUpperCase() + name.slice(1).toLowerCase() : name;

interface ReviewSummaryProps {
  adminEmail: string;
  selectedPlanName: string;
  businessData: {
    name: string;
    email: string;
    owner: string;
  };
  onBack: () => void;
  onSubmit: () => Promise<void> | void;
  loading?: boolean;
}

export function ReviewSummary({
  adminEmail,
  selectedPlanName,
  businessData,
  onBack,
  onSubmit,
  loading = false,
}: ReviewSummaryProps) {
  return (
    <div className="flex flex-col w-full max-w-[960px] mx-auto gap-6 animate-in fade-in slide-in-from-right-8 duration-500">
      <div className="rounded-[28px] border border-neutral-100 bg-white p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--color-brand-primary)]/10 text-[var(--color-brand-primary)] shrink-0">
            <ClipboardCheck className="h-6 w-6" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--color-brand-primary)]">
              Step 7
            </p>
            <h2 className="mt-1 text-2xl font-bold text-[var(--color-text-primary)]">
              Review your application
            </h2>
            <p className="mt-2 text-sm text-[var(--color-text-secondary)] leading-relaxed max-w-2xl">
              Confirm your business details, package choice, and operational
              strategy before submitting the application for review.
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-neutral-100 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-2">
          <ClipboardCheck className="h-5 w-5 text-[var(--color-brand-primary)]" />
          <h3 className="text-lg font-bold text-[var(--color-text-primary)]">
            Application Details
          </h3>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-neutral-100 bg-neutral-50 px-4 py-4 shadow-sm sm:col-span-2">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400">
              Admin Email
            </p>
            <p className="mt-2 text-base font-semibold text-[var(--color-text-primary)] break-all">
              {adminEmail || "-"}
            </p>
          </div>

          <div className="rounded-2xl border border-neutral-100 bg-neutral-50 px-4 py-4 shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400">
              Business Name
            </p>
            <p className="mt-2 text-base font-semibold text-[var(--color-text-primary)]">
              {businessData.name || "-"}
            </p>
          </div>

          <div className="rounded-2xl border border-neutral-100 bg-neutral-50 px-4 py-4 shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400">
              Owner Name
            </p>
            <p className="mt-2 text-base font-semibold text-[var(--color-text-primary)]">
              {businessData.owner || "-"}
            </p>
          </div>

          <div className="rounded-2xl border border-neutral-100 bg-neutral-50 px-4 py-4 shadow-sm sm:col-span-2">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400">
              Business Email
            </p>
            <p className="mt-2 text-base font-semibold text-[var(--color-text-primary)] break-all">
              {businessData.email || "-"}
            </p>
          </div>

          <div className="rounded-2xl border border-neutral-100 bg-white px-4 py-4 shadow-sm sm:col-span-2">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400">
              Selected Plan
            </p>
            <p className="mt-2 text-base font-semibold text-[var(--color-text-primary)]">
              {formatPlanName(selectedPlanName) || "-"}
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-green-100 bg-green-50 px-5 py-4 text-sm text-green-800 flex items-start gap-2">
        <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0" />
        <p>
          Final check: make sure all details are correct. Once submitted, your
          application status moves to pending review.
        </p>
      </div>

      <div className="flex w-full flex-row items-center gap-3 sm:gap-4">
        <Button
          variant="ghost"
          size="lg"
          className="h-12 shrink-0 border-neutral-200 px-4 text-sm text-neutral-500"
          onClick={onBack}
          disabled={loading}
        >
          <ArrowLeft className="mr-1.5 h-4 w-4" />
          Back
        </Button>
        <Button
          variant="primary"
          size="lg"
          className="h-12 flex-1 text-sm font-bold shadow-lg shadow-orange-200/40"
          onClick={onSubmit}
          loading={loading}
        >
          Submit Application
        </Button>
      </div>
    </div>
  );
}
