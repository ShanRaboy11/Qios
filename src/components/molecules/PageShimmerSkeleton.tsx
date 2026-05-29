import React from "react";
import { cn } from "@/lib/utils";

function ShimmerBlock({ className }: { className?: string }) {
  return <div className={cn("skeleton-shimmer rounded-xl", className)} />;
}

function SectionShell({
  titleWidth,
  subtitleWidth,
  children,
  className,
}: {
  titleWidth: string;
  subtitleWidth: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-[24px] border border-gray-100 bg-white/90 shadow-sm p-5 md:p-6",
        className,
      )}
    >
      <div className="space-y-2 mb-5">
        <ShimmerBlock className={cn("h-6", titleWidth)} />
        <ShimmerBlock className={cn("h-4", subtitleWidth)} />
      </div>
      {children}
    </div>
  );
}

function MetricSkeleton() {
  return (
    <div className="rounded-[22px] border border-gray-100 bg-white p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between gap-3">
        <ShimmerBlock className="h-4 w-24" />
        <ShimmerBlock className="h-8 w-8 rounded-full" />
      </div>
      <ShimmerBlock className="h-9 w-24" />
      <div className="space-y-2">
        <ShimmerBlock className="h-3.5 w-32" />
        <ShimmerBlock className="h-3.5 w-20" />
      </div>
      <ShimmerBlock className="h-2.5 w-full rounded-full" />
    </div>
  );
}

function TableSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <div className="rounded-[24px] border border-gray-100 bg-white shadow-sm overflow-hidden">
      <div className="flex items-center justify-between gap-4 border-b border-gray-100 p-5">
        <div className="space-y-2">
          <ShimmerBlock className="h-5 w-40" />
          <ShimmerBlock className="h-4 w-64" />
        </div>
        <div className="flex items-center gap-2">
          <ShimmerBlock className="h-11 w-28 rounded-2xl" />
          <ShimmerBlock className="h-11 w-20 rounded-2xl" />
        </div>
      </div>

      <div className="px-5 pt-5 pb-3">
        <div className="grid grid-cols-6 gap-4 text-xs uppercase tracking-[0.16em] text-gray-400 font-bold">
          <ShimmerBlock className="h-3 w-16" />
          <ShimmerBlock className="h-3 w-14" />
          <ShimmerBlock className="h-3 w-12" />
          <ShimmerBlock className="h-3 w-24" />
          <ShimmerBlock className="h-3 w-12" />
          <ShimmerBlock className="h-3 w-16 justify-self-end" />
        </div>
      </div>

      <div className="divide-y divide-gray-100">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div
            key={`table-row-${rowIndex}`}
            className="grid grid-cols-6 gap-4 px-5 py-4 items-center"
          >
            <ShimmerBlock className="h-4 w-24" />
            <ShimmerBlock className="h-4 w-20" />
            <ShimmerBlock className="h-4 w-16" />
            <ShimmerBlock className="h-4 w-full max-w-[260px]" />
            <ShimmerBlock className="h-7 w-20 rounded-full" />
            <ShimmerBlock className="h-5 w-16 justify-self-end" />
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between gap-4 border-t border-gray-100 px-5 py-4">
        <ShimmerBlock className="h-4 w-56" />
        <div className="flex items-center gap-2">
          <ShimmerBlock className="h-9 w-20 rounded-xl" />
          <ShimmerBlock className="h-9 w-24 rounded-xl" />
          <ShimmerBlock className="h-9 w-20 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

function CardGridSkeleton({ cards }: { cards: number }) {
  return (
    <div className="grid gap-4 md:gap-5 sm:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: cards }).map((_, index) => (
        <div key={`metric-${index}`}>
          <MetricSkeleton />
        </div>
      ))}
    </div>
  );
}

export function TenantDashboardPageSkeleton() {
  return (
    <div className="space-y-6 pb-10">
      <SectionShell
        titleWidth="w-72"
        subtitleWidth="w-96"
        className="p-6 md:p-8"
      >
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3">
            <ShimmerBlock className="h-10 w-80" />
            <ShimmerBlock className="h-4 w-[28rem] max-w-full" />
          </div>
          <div className="flex flex-wrap gap-3">
            <ShimmerBlock className="h-11 w-32 rounded-2xl" />
            <ShimmerBlock className="h-11 w-28 rounded-2xl" />
          </div>
        </div>
      </SectionShell>

      <CardGridSkeleton cards={4} />

      <div className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
        <SectionShell
          titleWidth="w-56"
          subtitleWidth="w-80"
          className="min-h-[360px]"
        >
          <ShimmerBlock className="h-[280px] w-full rounded-[20px]" />
        </SectionShell>
        <SectionShell
          titleWidth="w-44"
          subtitleWidth="w-72"
          className="min-h-[360px]"
        >
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={`dashboard-side-${index}`}
                className="flex items-center gap-3 rounded-2xl border border-gray-100 p-4"
              >
                <ShimmerBlock className="h-12 w-12 rounded-2xl" />
                <div className="flex-1 space-y-2">
                  <ShimmerBlock className="h-4 w-28" />
                  <ShimmerBlock className="h-3 w-40 max-w-full" />
                </div>
                <ShimmerBlock className="h-6 w-16 rounded-full" />
              </div>
            ))}
          </div>
        </SectionShell>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <SectionShell
            key={`dashboard-list-${index}`}
            titleWidth="w-44"
            subtitleWidth="w-64"
          >
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((__, rowIndex) => (
                <div
                  key={`dashboard-list-row-${index}-${rowIndex}`}
                  className="flex items-center gap-3 rounded-2xl border border-gray-100 p-3"
                >
                  <ShimmerBlock className="h-10 w-10 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <ShimmerBlock className="h-4 w-32" />
                    <ShimmerBlock className="h-3 w-20" />
                  </div>
                </div>
              ))}
            </div>
          </SectionShell>
        ))}
      </div>
    </div>
  );
}

export function SalesPageSkeleton() {
  return (
    <div className="space-y-6 pb-10">
      <SectionShell
        titleWidth="w-56"
        subtitleWidth="w-80"
        className="p-6 md:p-8"
      >
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div className="space-y-3">
            <ShimmerBlock className="h-9 w-72 max-w-full" />
            <ShimmerBlock className="h-4 w-[30rem] max-w-full" />
          </div>
          <div className="flex flex-wrap gap-3">
            <ShimmerBlock className="h-11 w-36 rounded-2xl" />
            <ShimmerBlock className="h-11 w-28 rounded-2xl" />
            <ShimmerBlock className="h-11 w-24 rounded-2xl" />
          </div>
        </div>
      </SectionShell>

      <CardGridSkeleton cards={4} />

      <div className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
        <SectionShell
          titleWidth="w-56"
          subtitleWidth="w-64"
          className="min-h-[380px]"
        >
          <ShimmerBlock className="h-[300px] w-full rounded-[22px]" />
        </SectionShell>
        <SectionShell
          titleWidth="w-44"
          subtitleWidth="w-60"
          className="min-h-[380px]"
        >
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={`sales-top-${index}`}
                className="flex items-center gap-3 rounded-2xl border border-gray-100 p-4"
              >
                <ShimmerBlock className="h-12 w-12 rounded-2xl" />
                <div className="flex-1 space-y-2">
                  <ShimmerBlock className="h-4 w-32" />
                  <ShimmerBlock className="h-3 w-24" />
                </div>
                <ShimmerBlock className="h-7 w-16 rounded-full" />
              </div>
            ))}
          </div>
        </SectionShell>
      </div>

      <TableSkeleton rows={6} />
    </div>
  );
}

export function InventoryPageSkeleton() {
  return (
    <div className="space-y-6 pb-10">
      <SectionShell
        titleWidth="w-64"
        subtitleWidth="w-96"
        className="p-6 md:p-8"
      >
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3">
            <ShimmerBlock className="h-9 w-72" />
            <ShimmerBlock className="h-4 w-[28rem] max-w-full" />
          </div>
          <div className="flex flex-wrap gap-3">
            <ShimmerBlock className="h-11 w-36 rounded-2xl" />
            <ShimmerBlock className="h-11 w-32 rounded-2xl" />
          </div>
        </div>
      </SectionShell>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <MetricSkeleton key={`inventory-metric-${index}`} />
        ))}
      </div>

      <div className="rounded-[24px] border border-gray-100 bg-white shadow-sm p-5 md:p-6 space-y-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <ShimmerBlock className="h-11 w-full lg:max-w-[380px] rounded-2xl" />
          <div className="flex flex-wrap gap-2">
            <ShimmerBlock className="h-11 w-28 rounded-2xl" />
            <ShimmerBlock className="h-11 w-24 rounded-2xl" />
            <ShimmerBlock className="h-11 w-32 rounded-2xl" />
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={`inventory-card-${index}`}
              className="rounded-2xl border border-gray-100 bg-white p-4 space-y-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-2 flex-1">
                  <ShimmerBlock className="h-5 w-44" />
                  <ShimmerBlock className="h-3.5 w-28" />
                </div>
                <ShimmerBlock className="h-8 w-16 rounded-full" />
              </div>
              <ShimmerBlock className="h-32 w-full rounded-[18px]" />
              <div className="grid grid-cols-3 gap-2">
                <ShimmerBlock className="h-16 rounded-xl" />
                <ShimmerBlock className="h-16 rounded-xl" />
                <ShimmerBlock className="h-16 rounded-xl" />
              </div>
              <div className="flex items-center justify-end gap-2 pt-1">
                <ShimmerBlock className="h-9 w-9 rounded-xl" />
                <ShimmerBlock className="h-9 w-9 rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function MenuManagementPageSkeleton() {
  return (
    <div className="space-y-6 pb-10">
      <SectionShell
        titleWidth="w-56"
        subtitleWidth="w-96"
        className="p-6 md:p-8"
      >
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3">
            <ShimmerBlock className="h-9 w-64" />
            <ShimmerBlock className="h-4 w-[28rem] max-w-full" />
          </div>
          <div className="flex flex-wrap gap-3">
            <ShimmerBlock className="h-11 w-32 rounded-2xl" />
            <ShimmerBlock className="h-11 w-32 rounded-2xl" />
          </div>
        </div>
      </SectionShell>

      <div className="grid gap-6 xl:grid-cols-[300px_1fr] min-h-[760px]">
        <SectionShell
          titleWidth="w-28"
          subtitleWidth="w-44"
          className="min-h-[760px]"
        >
          <div className="space-y-4">
            <ShimmerBlock className="h-11 w-full rounded-2xl" />
            <ShimmerBlock className="h-10 w-full rounded-2xl" />
            <div className="space-y-2">
              {Array.from({ length: 8 }).map((_, index) => (
                <div
                  key={`menu-cat-${index}`}
                  className="flex items-center gap-3 rounded-2xl border border-gray-100 p-3"
                >
                  <ShimmerBlock className="h-5 w-5 rounded" />
                  <ShimmerBlock className="h-10 w-10 rounded-xl" />
                  <div className="flex-1 space-y-2">
                    <ShimmerBlock className="h-4 w-28" />
                    <ShimmerBlock className="h-3 w-20" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </SectionShell>

        <SectionShell
          titleWidth="w-48"
          subtitleWidth="w-72"
          className="min-h-[760px]"
        >
          <div className="space-y-4">
            <div className="flex flex-wrap gap-3">
              <ShimmerBlock className="h-11 w-36 rounded-2xl" />
              <ShimmerBlock className="h-11 w-28 rounded-2xl" />
              <ShimmerBlock className="h-11 w-28 rounded-2xl" />
              <ShimmerBlock className="h-11 w-24 rounded-2xl" />
            </div>
            <ShimmerBlock className="h-11 w-full rounded-2xl" />
            <div className="grid gap-4 lg:grid-cols-2 2xl:grid-cols-3">
              {Array.from({ length: 9 }).map((_, index) => (
                <div
                  key={`menu-item-${index}`}
                  className="rounded-[24px] border border-gray-100 bg-white p-4 space-y-4"
                >
                  <ShimmerBlock className="h-40 w-full rounded-[18px]" />
                  <div className="space-y-2">
                    <ShimmerBlock className="h-5 w-40" />
                    <ShimmerBlock className="h-3.5 w-28" />
                  </div>
                  <div className="flex items-center gap-2">
                    <ShimmerBlock className="h-7 w-16 rounded-full" />
                    <ShimmerBlock className="h-7 w-20 rounded-full" />
                    <ShimmerBlock className="h-7 w-14 rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </SectionShell>
      </div>
    </div>
  );
}

export function TenantSettingsPageSkeleton() {
  return (
    <div className="space-y-6 pb-10">
      <SectionShell
        titleWidth="w-56"
        subtitleWidth="w-96"
        className="p-6 md:p-8"
      >
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3">
            <ShimmerBlock className="h-9 w-64" />
            <ShimmerBlock className="h-4 w-[30rem] max-w-full" />
          </div>
          <div className="flex flex-wrap gap-3">
            <ShimmerBlock className="h-11 w-32 rounded-2xl" />
            <ShimmerBlock className="h-11 w-28 rounded-2xl" />
          </div>
        </div>
      </SectionShell>

      <div className="grid gap-6 xl:grid-cols-[280px_1fr]">
        <SectionShell
          titleWidth="w-32"
          subtitleWidth="w-48"
          className="min-h-[720px]"
        >
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={`settings-nav-${index}`}
                className="flex items-center gap-3 rounded-2xl border border-gray-100 p-3"
              >
                <ShimmerBlock className="h-10 w-10 rounded-2xl" />
                <div className="flex-1 space-y-2">
                  <ShimmerBlock className="h-4 w-28" />
                  <ShimmerBlock className="h-3 w-20" />
                </div>
              </div>
            ))}
          </div>
        </SectionShell>

        <div className="space-y-6">
          <SectionShell
            titleWidth="w-48"
            subtitleWidth="w-72"
            className="min-h-[320px]"
          >
            <div className="grid gap-4 md:grid-cols-2">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={`settings-field-${index}`} className="space-y-2">
                  <ShimmerBlock className="h-4 w-28" />
                  <ShimmerBlock className="h-12 w-full rounded-2xl" />
                </div>
              ))}
            </div>
          </SectionShell>

          <SectionShell
            titleWidth="w-56"
            subtitleWidth="w-80"
            className="min-h-[220px]"
          >
            <div className="space-y-4">
              <ShimmerBlock className="h-24 w-full rounded-[20px]" />
              <div className="grid gap-4 md:grid-cols-3">
                <ShimmerBlock className="h-14 rounded-2xl" />
                <ShimmerBlock className="h-14 rounded-2xl" />
                <ShimmerBlock className="h-14 rounded-2xl" />
              </div>
            </div>
          </SectionShell>
        </div>
      </div>
    </div>
  );
}

export function RolesManagementPageSkeleton() {
  return (
    <div className="grid gap-6 md:grid-cols-[280px_1fr] pb-10">
      <SectionShell titleWidth="w-32" subtitleWidth="w-48" className="min-h-[760px]">
        <div className="space-y-4">
          <ShimmerBlock className="h-11 w-full rounded-2xl" />
          <ShimmerBlock className="h-11 w-full rounded-2xl" />
          <div className="space-y-2">
            {Array.from({ length: 7 }).map((_, index) => (
              <div key={`roles-nav-${index}`} className="flex items-center gap-3 rounded-2xl border border-gray-100 p-3">
                <ShimmerBlock className="h-3 w-3 rounded-full" />
                <ShimmerBlock className="h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <ShimmerBlock className="h-4 w-28" />
                  <ShimmerBlock className="h-3 w-20" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </SectionShell>

      <SectionShell titleWidth="w-48" subtitleWidth="w-72" className="min-h-[760px]">
        <div className="space-y-5">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
            <div className="grid gap-4 md:grid-cols-2 flex-1">
              <div className="space-y-2">
                <ShimmerBlock className="h-4 w-24" />
                <ShimmerBlock className="h-12 w-full rounded-2xl" />
              </div>
              <div className="space-y-2">
                <ShimmerBlock className="h-4 w-24" />
                <ShimmerBlock className="h-12 w-full rounded-2xl" />
              </div>
            </div>
            <div className="flex gap-2">
              <ShimmerBlock className="h-11 w-11 rounded-2xl" />
              <ShimmerBlock className="h-11 w-11 rounded-2xl" />
              <ShimmerBlock className="h-11 w-11 rounded-2xl" />
            </div>
          </div>

          <ShimmerBlock className="h-11 w-full rounded-2xl" />

          <div className="space-y-4 rounded-[24px] border border-gray-100 bg-white p-5">
            <div className="space-y-2">
              <ShimmerBlock className="h-5 w-40" />
              <ShimmerBlock className="h-4 w-72" />
            </div>
            <div className="grid gap-4 lg:grid-cols-2">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={`role-permission-${index}`} className="rounded-2xl border border-gray-100 p-4 space-y-3">
                  <ShimmerBlock className="h-5 w-36" />
                  <ShimmerBlock className="h-3.5 w-full" />
                  <ShimmerBlock className="h-3.5 w-5/6" />
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <ShimmerBlock className="h-10 rounded-xl" />
                    <ShimmerBlock className="h-10 rounded-xl" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </SectionShell>
    </div>
  );
}

export function StaffManagementPageSkeleton() {
  return (
    <div className="grid gap-6 pb-10 xl:grid-cols-[1.2fr_0.8fr]">
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <MetricSkeleton key={`staff-metric-${index}`} />
          ))}
        </div>

        <SectionShell titleWidth="w-48" subtitleWidth="w-72" className="min-h-[560px]">
          <div className="space-y-4">
            <ShimmerBlock className="h-[320px] w-full rounded-[22px]" />
            <div className="grid gap-3 md:grid-cols-2">
              <ShimmerBlock className="h-12 rounded-2xl" />
              <ShimmerBlock className="h-12 rounded-2xl" />
            </div>
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={`staff-row-${index}`} className="flex items-center gap-3 rounded-2xl border border-gray-100 p-3">
                  <ShimmerBlock className="h-12 w-12 rounded-2xl" />
                  <div className="flex-1 space-y-2">
                    <ShimmerBlock className="h-4 w-32" />
                    <ShimmerBlock className="h-3 w-24" />
                  </div>
                  <ShimmerBlock className="h-8 w-20 rounded-full" />
                </div>
              ))}
            </div>
          </div>
        </SectionShell>
      </div>

      <div className="space-y-6">
        <SectionShell titleWidth="w-40" subtitleWidth="w-56" className="min-h-[320px]">
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={`staff-leader-${index}`} className="flex items-center gap-3 rounded-2xl border border-gray-100 p-3">
                <ShimmerBlock className="h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <ShimmerBlock className="h-4 w-28" />
                  <ShimmerBlock className="h-3 w-20" />
                </div>
              </div>
            ))}
          </div>
        </SectionShell>

        <SectionShell titleWidth="w-44" subtitleWidth="w-64" className="min-h-[280px]">
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={`staff-activity-${index}`} className="flex items-start gap-3 rounded-2xl border border-gray-100 p-3">
                <ShimmerBlock className="h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <ShimmerBlock className="h-4 w-32" />
                  <ShimmerBlock className="h-3 w-48 max-w-full" />
                  <ShimmerBlock className="h-3 w-20" />
                </div>
              </div>
            ))}
          </div>
        </SectionShell>
      </div>
    </div>
  );
}

export function AuditLogsPageSkeleton() {
  return (
    <div className="space-y-6 pb-10">
      <SectionShell titleWidth="w-48" subtitleWidth="w-80" className="p-6 md:p-8">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div className="space-y-3">
            <ShimmerBlock className="h-9 w-56" />
            <ShimmerBlock className="h-4 w-[28rem] max-w-full" />
          </div>
          <div className="flex flex-wrap gap-3">
            <ShimmerBlock className="h-11 w-72 rounded-2xl" />
            <ShimmerBlock className="h-11 w-36 rounded-2xl" />
            <ShimmerBlock className="h-11 w-36 rounded-2xl" />
          </div>
        </div>
      </SectionShell>

      <TableSkeleton rows={7} />
    </div>
  );
}
