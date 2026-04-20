"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/organisms/navbar";
import FeatureSection from "@/components/organisms/FeatureSection";
import { ProblemSolution } from "@/components/organisms/ProblemnSolution";
import { Footer } from "@/components/organisms/footer";
import { MenuItemCard } from "@/components/molecules/MenuItemCard";

import { CategoryToggle } from "@/components/molecules/CategoryToggle";

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState("Meal");

  return (
    <main className="flex flex-col min-h-screen bg-white w-full overflow-x-hidden">
      <Navbar variant="transparent" />
      <div className="flex-grow w-full">
        <ProblemSolution />
        <FeatureSection />

        {/* Example Menu Section */}
        <section className="py-24 bg-bg-primary flex flex-col items-center justify-center">
          <div className="text-center mb-10">
            <h2 className="text-[32px] md:text-[40px] font-bold font-ibrand text-text-primary tracking-tight">
              Our Signature Dishes
            </h2>
            <p className="text-text-secondary mt-3 max-w-lg mx-auto font-inter text-[16px]">
              Explore our best-selling menu items crafted with authentic
              flavors.
            </p>
          </div>

          {/* Category Toggle Example */}
          <div className="flex flex-wrap justify-center gap-6 mb-16 px-4">
            <CategoryToggle
              label="Snacks"
              iconSrc="/svg/snacks.svg"
              isActive={activeCategory === "Snacks"}
              onClick={() => setActiveCategory("Snacks")}
              size="md"
            />
            <CategoryToggle
              label="Meal"
              iconSrc="/svg/meal.svg"
              isActive={activeCategory === "Meal"}
              onClick={() => setActiveCategory("Meal")}
              size="md"
            />
            <CategoryToggle
              label="Vegan"
              iconSrc="/svg/vegan.svg"
              isActive={activeCategory === "Vegan"}
              onClick={() => setActiveCategory("Vegan")}
              size="md"
            />
            <CategoryToggle
              label="Dessert"
              iconSrc="/svg/dessert.svg"
              isActive={activeCategory === "Dessert"}
              onClick={() => setActiveCategory("Dessert")}
              size="md"
            />
            <CategoryToggle
              label="Drinks"
              iconSrc="/svg/drinks.svg"
              isActive={activeCategory === "Drinks"}
              onClick={() => setActiveCategory("Drinks")}
              size="md"
            />
          </div>

          <div className="flex flex-wrap justify-center gap-10 px-6 w-full max-w-5xl">
            <MenuItemCard
              title="Spicy seasoned seafood noodles"
              price={2.29}
              imageSrc="/images/noodles.png"
            />
            <MenuItemCard
              title="Classic Filipino Pork Adobo"
              price={3.5}
              imageSrc="/images/adobo.png"
            />
            <MenuItemCard
              title="Hearty Hot Soup"
              price={2.99}
              imageSrc="/images/soup.png"
            />
          </div>

          <div className="mt-16 text-center w-full max-w-5xl px-6">
            <h3 className="text-[24px] font-bold font-ibrand text-text-primary mb-8 tracking-tight">Horizontal Variant Layout Test</h3>
            <div className="flex flex-col md:flex-row justify-center gap-8 items-center">
               <MenuItemCard
                 variant="horizontal"
                 title="Spicy seasoned seafood noodles"
                 price={2.29}
                 imageSrc="/images/noodles.png"
                 availability="20 Bowls available"
               />
               <MenuItemCard
                 variant="horizontal"
                 title="Hearty Hot Soup"
                 price={2.99}
                 imageSrc="/images/soup.png"
                 availability="14 Bowls available"
               />
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </main>
  );
}
