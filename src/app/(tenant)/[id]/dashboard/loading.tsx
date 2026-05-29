import React from "react";

function Block({ className = "" }: { className?: string }) {
  return <div className={`skeleton-shimmer ${className}`} />;
}

export default function Loading() {
  return (
    <div className="space-y-6 pb-10">
      <div className="rounded-[24px] p-6 md:p-8 bg-white border border-gray-100 space-y-3">
        <Block className="h-8 w-72 max-w-full rounded-md" />
        <Block className="h-4 w-80 max-w-full rounded-md" />
      </div>
      <Block className="h-14 w-full rounded-2xl" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {Array.from({ length: 8 }).map((_, idx) => (
          <div
            key={`tenant-kpi-skeleton-${idx}`}
            className="rounded-[20px] bg-white border border-gray-100 p-4 space-y-3"
          >
            <Block className="h-4 w-24 rounded-md" />
            <Block className="h-8 w-20 rounded-md" />
            <Block className="h-4 w-28 rounded-md" />
          </div>
        ))}
      </div>
      <div className="flex flex-col lg:flex-row gap-6">
        <Block className="w-full lg:w-[65%] rounded-[24px] h-[360px]" />
        <Block className="w-full lg:w-[35%] rounded-[24px] h-[360px]" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, idx) => (
          <div
            key={`tenant-list-skeleton-${idx}`}
            className="rounded-[24px] bg-white border border-gray-100 p-6 space-y-3"
          >
            <Block className="h-6 w-44 rounded-md" />
            {Array.from({ length: 4 }).map((__, rowIdx) => (
              <Block
                key={`tenant-list-row-skeleton-${idx}-${rowIdx}`}
                className="h-12 w-full rounded-xl"
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
