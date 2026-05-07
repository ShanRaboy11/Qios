"use client";

import React from "react";
import { motion } from "framer-motion";
import FeatureSection from "@/components/organisms/FeatureSection";
import { ProblemSolution } from "@/components/organisms/ProblemnSolution";
import SubscriptionPlans from "@/components/organisms/SubscriptionPlans";
import FAQs from "@/components/organisms/FAQs";
import { Footer } from "@/components/organisms/footer";
import { Hero } from "@/components/organisms/hero";
import { Navbar } from "@/components/organisms/navbar";

export default function HomePage() {
  return (
    <motion.main 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="flex flex-col min-h-screen bg-white w-full overflow-x-hidden"
    >
      <Navbar variant="transparent" />
      <Hero />
      <div className="flex-grow w-full">
        <ProblemSolution />
        <FeatureSection />
        <SubscriptionPlans />
        <FAQs />
      </div>
      <Footer />
    </motion.main>
  );
}
