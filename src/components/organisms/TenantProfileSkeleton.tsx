import React from "react";
import { motion } from "framer-motion";

export const TenantProfileSkeleton = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col gap-8 w-full max-w-[1440px] mx-auto"
    >
      {/* header Skeleton */}
      <div className="flex flex-col gap-6">
        <div className="w-32 h-6 bg-gray-200 rounded-md animate-pulse" />
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="w-64 h-10 bg-gray-200 rounded-lg animate-pulse" />
              <div className="w-20 h-6 bg-gray-200 rounded-full animate-pulse" />
            </div>
            <div className="w-48 h-5 bg-gray-200 rounded-md animate-pulse" />
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="w-32 h-10 bg-gray-200 rounded-xl animate-pulse" />
            <div className="w-32 h-10 bg-gray-200 rounded-xl animate-pulse" />
          </div>
        </div>
      </div>

      {/* grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* business Info */}
        <div className="lg:col-span-1 bg-white rounded-[24px] p-6 border border-gray-100 flex flex-col min-h-[300px]">
          <div className="w-40 h-8 bg-gray-200 rounded-md animate-pulse mb-6" />
          <div className="flex flex-col gap-4">
            <div className="w-full h-10 bg-gray-100 rounded-md animate-pulse" />
            <div className="w-full h-10 bg-gray-100 rounded-md animate-pulse" />
            <div className="w-full h-10 bg-gray-100 rounded-md animate-pulse" />
          </div>
        </div>

        {/* documents */}
        <div className="lg:col-span-2 bg-white rounded-[24px] p-6 border border-gray-100 flex flex-col min-h-[300px]">
          <div className="w-48 h-8 bg-gray-200 rounded-md animate-pulse mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-[120px] bg-gray-100 rounded-[20px] animate-pulse"
              />
            ))}
          </div>
        </div>

        {/* subscription */}
        <div className="bg-white rounded-[24px] p-6 border border-gray-100 flex flex-col min-h-[250px]">
          <div className="w-40 h-8 bg-gray-200 rounded-md animate-pulse mb-6" />
          <div className="w-full h-32 bg-gray-100 rounded-xl animate-pulse" />
        </div>

        {/* features */}
        <div className="bg-white rounded-[24px] p-6 border border-gray-100 flex flex-col min-h-[250px]">
          <div className="w-40 h-8 bg-gray-200 rounded-md animate-pulse mb-6" />
          <div className="flex flex-col gap-4">
            <div className="w-full h-8 bg-gray-100 rounded-md animate-pulse" />
            <div className="w-full h-8 bg-gray-100 rounded-md animate-pulse" />
            <div className="w-full h-8 bg-gray-100 rounded-md animate-pulse" />
          </div>
        </div>

        {/* stats */}
        <div className="flex flex-col gap-4 min-h-[250px]">
          <div className="w-full h-full bg-white border border-gray-100 rounded-[24px] animate-pulse" />
          <div className="w-full h-full bg-white border border-gray-100 rounded-[24px] animate-pulse" />
        </div>
      </div>
    </motion.div>
  );
};
