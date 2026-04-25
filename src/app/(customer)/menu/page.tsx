import React from "react";
import { CustomerHeader } from "@/components/organisms/CustomerHeader";
import { CategoryMenuLayout } from "@/components/organisms/CategoryMenuLayout";

export default function CustomerMenuPage() {
  return (
    <main className="flex flex-col min-h-screen bg-[#FFDC72] w-full overflow-x-hidden relative">
      <div className="w-full max-w-[500px] md:max-w-none mx-auto flex-grow flex flex-col relative pb-0 md:pb-10">
        {/* Mobile/Tablet Header (Yellow Block) */}
        <CustomerHeader />

        {/* The entire Category Tab & Grid Layout */}
        <div className="flex-grow flex flex-col relative -mt-8 md:-mt-12 z-40">
          <CategoryMenuLayout />
        </div>
      </div>
    </main>
  );
}
