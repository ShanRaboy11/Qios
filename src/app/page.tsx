"use client";

import React from "react";
import FeatureSection from "@/components/organisms/FeatureSection";
import { ProblemSolution } from "@/components/organisms/ProblemnSolution";
import SubscriptionPlans from "@/components/organisms/SubscriptionPlans";
import { Footer } from "@/components/organisms/footer";
import { Hero } from "@/components/organisms/hero";
import { Navbar } from "@/components/organisms/navbar";

export default function HomePage() {
  return (
    <main className="flex flex-col min-h-screen bg-white w-full overflow-x-hidden">
      <Navbar variant="transparent" />
      <Hero />
      <div className="flex-grow w-full">
        <ProblemSolution />
        <FeatureSection />
        <SubscriptionPlans />
      </div>
      <Footer />
    </main>
  );
}
