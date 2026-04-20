"use client";

import React from "react";
import { Navbar } from "@/components/organisms/navbar";
import FeatureSection from "@/components/organisms/Feature";
import { Footer } from "@/components/organisms/footer";

export default function HomePage() {
  return (
    <main className="flex flex-col min-h-screen bg-white w-full overflow-x-hidden">
      <Navbar variant="filled" />
      <div className="flex-grow w-full">
        <FeatureSection />
      </div>
      <Footer />
    </main>
  );
}
