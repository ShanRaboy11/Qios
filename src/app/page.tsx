"use client";

import React from "react";
import { Navbar } from "@/components/organisms/navbar";
import FeatureSection from "@/components/organisms/FeatureSection";
import { ProblemSolution } from "@/components/organisms/ProblemnSolution";
import { Footer } from "@/components/organisms/footer";
import { MenuItemCard } from "@/components/molecules/MenuItemCard";

export default function HomePage() {
  return (
    <main className="flex flex-col min-h-screen bg-white w-full overflow-x-hidden">
      <Navbar variant="transparent" />
      <div className="flex-grow w-full">
        <ProblemSolution />
        <FeatureSection />

        {/* Example Menu Section */}
        <section className="py-24 bg-bg-primary flex flex-col items-center justify-center">
          <div className="text-center mb-16">
            <h2 className="text-[32px] md:text-[40px] font-bold font-ibrand text-text-primary tracking-tight">Our Signature Dishes</h2>
            <p className="text-text-secondary mt-3 max-w-lg mx-auto font-inter text-[16px]">
              Explore our best-selling menu items crafted with authentic flavors.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-10 px-6 w-full max-w-5xl">
            <MenuItemCard 
              title="Spicy seasoned seafood noodles"
              price={2.29}
              imageSrc="/images/noodles.png"
            />
            <MenuItemCard 
              title="Classic Filipino Pork Adobo"
              price={3.50}
              imageSrc="/images/adobo.png"
            />
            <MenuItemCard 
              title="Hearty Hot Soup"
              price={2.99}
              imageSrc="/images/soup.png"
            />
          </div>
        </section>

      </div>
      <Footer />
    </main>
  );
}
