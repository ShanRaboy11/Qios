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

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <div className="space-y-3">
          <Block className="h-8 w-48 rounded-md" />
          <Block className="h-4 w-72 rounded-md" />
        </div>
        <div className="flex items-center gap-3">
          <Block className="h-11 w-72 rounded-2xl" />
          <Block className="h-11 w-36 rounded-2xl" />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Block className="h-11 w-72 rounded-2xl" />
        <Block className="h-11 w-32 rounded-2xl" />
        <div className="flex-1" />
        <Block className="h-11 w-24 rounded-2xl" />
      </div>

      <div className="rounded-[24px] border border-gray-100 bg-white shadow-sm overflow-hidden">
        <div className="flex items-center justify-between gap-4 border-b border-gray-100 p-5">
          <div className="space-y-2">
            <Block className="h-5 w-40 rounded-md" />
            <Block className="h-4 w-64 rounded-md" />
          </div>
          <div className="flex items-center gap-2">
            <Block className="h-11 w-28 rounded-2xl" />
            <Block className="h-11 w-20 rounded-2xl" />
          </div>
        </div>
        <div className="px-5 pt-5 pb-3">
          <div className="grid grid-cols-6 gap-4 text-xs uppercase tracking-[0.16em] text-gray-400 font-bold">
            <Block className="h-3 w-16 rounded-md" />
            <Block className="h-3 w-14 rounded-md" />
            <Block className="h-3 w-12 rounded-md" />
            <Block className="h-3 w-24 rounded-md" />
            <Block className="h-3 w-12 rounded-md" />
            <Block className="h-3 w-16 rounded-md justify-self-end" />
          </div>
        </div>
        <div className="divide-y divide-gray-100">
          {Array.from({ length: 7 }).map((_, rowIndex) => (
            <div
              key={`audit-row-${rowIndex}`}
              className="grid grid-cols-6 gap-4 px-5 py-4 items-center"
            >
              <Block className="h-4 w-24 rounded-md" />
              <Block className="h-4 w-20 rounded-md" />
              <Block className="h-4 w-16 rounded-md" />
              <Block className="h-4 w-full max-w-[260px] rounded-md" />
              <Block className="h-7 w-20 rounded-full" />
              <Block className="h-5 w-16 rounded-md justify-self-end" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
