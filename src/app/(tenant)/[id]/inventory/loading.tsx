import React from "react";

function Block({ className = "" }: { className?: string }) {
  return <div className={`skeleton-shimmer ${className}`} />;
}

export default function Loading() {
  return (
    <div className="space-y-6 pb-10">
      <div className="rounded-[24px] p-6 md:p-8 bg-white border border-gray-100 space-y-3">
        <Block className="h-8 w-72 max-w-full rounded-md" />
        <Block className="h-4 w-[28rem] max-w-full rounded-md" />
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Block className="h-10 w-36 rounded-xl" />
          <Block className="h-10 w-32 rounded-xl" />
        </div>
        <Block className="h-11 w-48 rounded-2xl" />
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={`inventory-metric-${index}`}
            className="rounded-[22px] border border-gray-100 bg-white p-5 shadow-sm space-y-4"
          >
            <Block className="h-4 w-24 rounded-md" />
            <Block className="h-9 w-24 rounded-md" />
            <Block className="h-3.5 w-32 rounded-md" />
          </div>
        ))}
      </div>

      <div className="rounded-[24px] border border-gray-100 bg-white shadow-sm p-5 md:p-6 space-y-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <Block className="h-11 w-full lg:max-w-[380px] rounded-2xl" />
          <div className="flex flex-wrap gap-2">
            <Block className="h-11 w-28 rounded-2xl" />
            <Block className="h-11 w-24 rounded-2xl" />
            <Block className="h-11 w-32 rounded-2xl" />
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
                  <Block className="h-5 w-44 rounded-md" />
                  <Block className="h-3.5 w-28 rounded-md" />
                </div>
                <Block className="h-8 w-16 rounded-full" />
              </div>
              <Block className="h-32 w-full rounded-[18px]" />
              <div className="grid grid-cols-3 gap-2">
                <Block className="h-16 rounded-xl" />
                <Block className="h-16 rounded-xl" />
                <Block className="h-16 rounded-xl" />
              </div>
              <div className="flex items-center justify-end gap-2 pt-1">
                <Block className="h-9 w-9 rounded-xl" />
                <Block className="h-9 w-9 rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
