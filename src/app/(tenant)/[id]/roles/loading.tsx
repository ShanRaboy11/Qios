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
          <Block className="h-8 w-56 rounded-md" />
          <Block className="h-4 w-72 rounded-md" />
        </div>
        <Block className="h-11 w-40 rounded-2xl" />
      </div>

      <div className="grid gap-6 md:grid-cols-[280px_1fr]">
        <div className="rounded-[24px] border border-gray-100 bg-white shadow-sm p-5 md:p-6 min-h-[760px] space-y-4">
          <Block className="h-6 w-32 rounded-md" />
          <Block className="h-4 w-48 rounded-md" />
          <Block className="h-11 w-full rounded-2xl" />
          <Block className="h-11 w-full rounded-2xl" />
          <div className="space-y-2">
            {Array.from({ length: 7 }).map((_, index) => (
              <div
                key={`roles-nav-${index}`}
                className="flex items-center gap-3 rounded-2xl border border-gray-100 p-3"
              >
                <Block className="h-3 w-3 rounded-full" />
                <Block className="h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Block className="h-4 w-28 rounded-md" />
                  <Block className="h-3 w-20 rounded-md" />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[24px] border border-gray-100 bg-white shadow-sm p-5 md:p-6 min-h-[760px] space-y-5">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
            <div className="grid gap-4 md:grid-cols-2 flex-1">
              <div className="space-y-2">
                <Block className="h-4 w-24 rounded-md" />
                <Block className="h-12 w-full rounded-2xl" />
              </div>
              <div className="space-y-2">
                <Block className="h-4 w-24 rounded-md" />
                <Block className="h-12 w-full rounded-2xl" />
              </div>
            </div>
            <div className="flex gap-2">
              <Block className="h-11 w-11 rounded-2xl" />
              <Block className="h-11 w-11 rounded-2xl" />
              <Block className="h-11 w-11 rounded-2xl" />
            </div>
          </div>

          <Block className="h-11 w-full rounded-2xl" />

          <div className="space-y-4 rounded-[24px] border border-gray-100 bg-white p-5">
            <div className="space-y-2">
              <Block className="h-5 w-40 rounded-md" />
              <Block className="h-4 w-72 rounded-md" />
            </div>
            <div className="grid gap-4 lg:grid-cols-2">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={`role-permission-${index}`}
                  className="rounded-2xl border border-gray-100 p-4 space-y-3"
                >
                  <Block className="h-5 w-36 rounded-md" />
                  <Block className="h-3.5 w-full rounded-md" />
                  <Block className="h-3.5 w-5/6 rounded-md" />
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <Block className="h-10 rounded-xl" />
                    <Block className="h-10 rounded-xl" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
