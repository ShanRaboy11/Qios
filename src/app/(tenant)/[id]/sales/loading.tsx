import React from "react";

function Block({ className = "" }: { className?: string }) {
  return <div className={`skeleton-shimmer ${className}`} />;
}

export default function Loading() {
  return (
    <div className="space-y-6 pb-10">
      <div className="rounded-[24px] p-6 md:p-8 bg-white border border-gray-100 space-y-3">
        <Block className="h-8 w-72 max-w-full rounded-md" />
        <Block className="h-4 w-[30rem] max-w-full rounded-md" />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 w-full">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={`sales-metric-${index}`} className="bg-white rounded-[16px] sm:rounded-[24px] shadow-sm border border-gray-100 p-4 sm:p-6 min-w-0 space-y-4">
            <Block className="h-4 w-24 rounded-md" />
            <Block className="h-8 w-32 rounded-md" />
            <Block className="h-4 w-28 rounded-md" />
          </div>
        ))}
      </div>

      <div className="w-full h-[300px] rounded-[24px] bg-white border border-gray-100 p-6 space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-2">
            <Block className="h-6 w-40 rounded-md" />
            <Block className="h-4 w-56 rounded-md" />
          </div>
          <div className="flex gap-2">
            <Block className="h-9 w-28 rounded-lg" />
            <Block className="h-9 w-28 rounded-lg" />
            <Block className="h-9 w-28 rounded-lg" />
          </div>
        </div>
        <Block className="h-[220px] w-full rounded-[20px]" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 w-full">
        <div className="lg:col-span-1 bg-white rounded-[24px] shadow-sm border border-gray-100 overflow-hidden p-6 space-y-4">
          <Block className="h-6 w-40 rounded-md" />
          <Block className="h-4 w-56 rounded-md" />
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <Block key={`top-item-${index}`} className="h-14 rounded-2xl" />
            ))}
          </div>
        </div>
        <div className="lg:col-span-2 bg-white rounded-[24px] shadow-sm border border-gray-100 overflow-hidden p-6 space-y-4">
          <Block className="h-6 w-48 rounded-md" />
          <Block className="h-4 w-64 rounded-md" />
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={`transaction-row-${index}`} className="grid grid-cols-6 gap-3 items-center rounded-2xl border border-gray-100 px-4 py-3">
                <Block className="h-4 w-20 rounded-md" />
                <Block className="h-4 w-16 rounded-md" />
                <Block className="h-4 w-16 rounded-md" />
                <Block className="h-4 w-full rounded-md" />
                <Block className="h-6 w-20 rounded-full" />
                <Block className="h-4 w-20 rounded-md justify-self-end" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
