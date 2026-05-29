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

      <div className="grid gap-6 xl:grid-cols-[300px_1fr] min-h-[760px]">
        <div className="rounded-[24px] border border-gray-100 bg-white shadow-sm p-5 md:p-6 min-h-[760px] space-y-4">
          <Block className="h-6 w-28 rounded-md" />
          <Block className="h-4 w-44 rounded-md" />
          <Block className="h-11 w-full rounded-2xl" />
          <Block className="h-10 w-full rounded-2xl" />
          <div className="space-y-2">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={`menu-cat-${index}`}
                className="flex items-center gap-3 rounded-2xl border border-gray-100 p-3"
              >
                <Block className="h-5 w-5 rounded" />
                <Block className="h-10 w-10 rounded-xl" />
                <div className="flex-1 space-y-2">
                  <Block className="h-4 w-28 rounded-md" />
                  <Block className="h-3 w-20 rounded-md" />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[24px] border border-gray-100 bg-white shadow-sm p-5 md:p-6 min-h-[760px] space-y-4">
          <Block className="h-6 w-48 rounded-md" />
          <Block className="h-4 w-72 rounded-md" />
          <div className="flex flex-wrap gap-3">
            <Block className="h-11 w-36 rounded-2xl" />
            <Block className="h-11 w-28 rounded-2xl" />
            <Block className="h-11 w-28 rounded-2xl" />
            <Block className="h-11 w-24 rounded-2xl" />
          </div>
          <Block className="h-11 w-full rounded-2xl" />
          <div className="grid gap-4 lg:grid-cols-2 2xl:grid-cols-3">
            {Array.from({ length: 9 }).map((_, index) => (
              <div
                key={`menu-item-${index}`}
                className="rounded-[24px] border border-gray-100 bg-white p-4 space-y-4"
              >
                <Block className="h-40 w-full rounded-[18px]" />
                <div className="space-y-2">
                  <Block className="h-5 w-40 rounded-md" />
                  <Block className="h-3.5 w-28 rounded-md" />
                </div>
                <div className="flex items-center gap-2">
                  <Block className="h-7 w-16 rounded-full" />
                  <Block className="h-7 w-20 rounded-full" />
                  <Block className="h-7 w-14 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
