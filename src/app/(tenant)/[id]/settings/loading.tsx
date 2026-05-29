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

      <div className="grid gap-6 xl:grid-cols-[280px_1fr]">
        <div className="rounded-[24px] border border-gray-100 bg-white shadow-sm p-5 md:p-6 min-h-[720px] space-y-4">
          <Block className="h-6 w-32 rounded-md" />
          <Block className="h-4 w-48 rounded-md" />
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={`settings-nav-${index}`} className="flex items-center gap-3 rounded-2xl border border-gray-100 p-3">
              <Block className="h-10 w-10 rounded-2xl" />
              <div className="flex-1 space-y-2">
                <Block className="h-4 w-28 rounded-md" />
                <Block className="h-3 w-20 rounded-md" />
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-6">
          <div className="rounded-[24px] border border-gray-100 bg-white shadow-sm p-5 md:p-6 min-h-[320px] space-y-4">
            <Block className="h-6 w-48 rounded-md" />
            <Block className="h-4 w-72 rounded-md" />
            <div className="grid gap-4 md:grid-cols-2">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={`settings-field-${index}`} className="space-y-2">
                  <Block className="h-4 w-28 rounded-md" />
                  <Block className="h-12 w-full rounded-2xl" />
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[24px] border border-gray-100 bg-white shadow-sm p-5 md:p-6 min-h-[220px] space-y-4">
            <Block className="h-6 w-56 rounded-md" />
            <Block className="h-4 w-80 rounded-md" />
            <Block className="h-24 w-full rounded-[20px]" />
            <div className="grid gap-4 md:grid-cols-3">
              <Block className="h-14 rounded-2xl" />
              <Block className="h-14 rounded-2xl" />
              <Block className="h-14 rounded-2xl" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
