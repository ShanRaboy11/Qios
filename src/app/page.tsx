"use client";

import React from "react";
import { Navbar } from "@/components/organisms/navbar";
import FeatureSection from "@/components/organisms/FeatureSection";
import { ProblemSolution } from "@/components/organisms/ProblemnSolution";
import { Footer } from "@/components/organisms/footer";

export default function HomePage() {
  return (
    <main className="flex flex-col min-h-screen bg-white w-full overflow-x-hidden">
      <Navbar variant="transparent" />
      <div className="flex-grow w-full">
        <ProblemSolution />
        <FeatureSection />
      </div>
      <Footer />
    </main>
  );
}
