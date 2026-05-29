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

      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={`staff-metric-${index}`}
            className="bg-white p-5 rounded-[24px] shadow-sm border border-gray-100 space-y-3"
          >
            <Block className="h-4 w-24 rounded-md" />
            <Block className="h-8 w-20 rounded-md" />
            <Block className="h-4 w-28 rounded-md" />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Block className="h-[320px] w-full rounded-[24px]" />
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <Block className="h-6 w-40 rounded-md" />
              <Block className="h-11 w-64 rounded-2xl" />
            </div>
            <div className="rounded-[24px] border border-gray-100 bg-white overflow-hidden">
              <div className="overflow-hidden pb-32">
                <div className="grid grid-cols-5 gap-4 bg-gray-50 px-6 py-4 border-b border-gray-100">
                  <Block className="h-3 w-24 rounded-md" />
                  <Block className="h-3 w-24 rounded-md" />
                  <Block className="h-3 w-16 rounded-md mx-auto" />
                  <Block className="h-3 w-20 rounded-md mx-auto" />
                  <Block className="h-3 w-16 rounded-md justify-self-end" />
                </div>
                <div className="space-y-3 p-6">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <div
                      key={`staff-row-${index}`}
                      className="grid grid-cols-5 gap-4 items-center rounded-2xl border border-gray-100 p-3"
                    >
                      <div className="flex items-center gap-3 col-span-1">
                        <Block className="h-12 w-12 rounded-full" />
                        <div className="space-y-2">
                          <Block className="h-4 w-32 rounded-md" />
                          <Block className="h-3 w-24 rounded-md" />
                        </div>
                      </div>
                      <div className="space-y-2 col-span-1">
                        <Block className="h-4 w-28 rounded-md" />
                        <Block className="h-3 w-20 rounded-md" />
                      </div>
                      <Block className="h-8 w-24 rounded-full mx-auto" />
                      <Block className="h-4 w-20 rounded-md mx-auto" />
                      <Block className="h-8 w-10 rounded-full justify-self-end" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <Block className="h-[280px] w-full rounded-[24px]" />
          <Block className="h-[600px] w-full rounded-[24px]" />
        </div>
      </div>
    </div>
  );
}
