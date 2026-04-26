"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

import { CustomerHeader } from "@/components/organisms/CustomerHeader";
import { CategoryTabBar } from "@/components/organisms/CategoryTabBar";
import { CategoryToggle } from "@/components/molecules/CategoryToggle";
import { MenuItemCard } from "@/components/molecules/MenuItemCard";
import { PromoBanner } from "@/components/organisms/PromoBanner";
import { ChevronRight } from "lucide-react";

export default function CustomerHomePage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const isCategoryView = selectedCategory !== null;

  return (
    <motion.main
      layout
      animate={{ backgroundColor: isCategoryView ? "#FF5269" : "#FFDC72" }}
      className="flex flex-col min-h-screen w-full overflow-x-hidden relative transition-colors duration-500"
    >
      <div className="w-full max-w-[500px] md:max-w-none mx-auto flex-grow flex flex-col relative pb-0 md:pb-10">
        {/* Mobile/Tablet Header */}
        <CustomerHeader
          isCategoryView={isCategoryView}
          onBack={() => setSelectedCategory(null)}
        />

        <div className="flex-grow flex flex-col relative w-full items-center">
          {/* Category Swiper (Positioned above white canvas in DOM to allow z-index layering) */}
          <div className="w-full max-w-[500px] md:max-w-[1024px] relative z-50">
            <CategoryTabBar
              categories={[
                { id: "Drinks", label: "Drinks", iconSrc: "/svg/drinks.svg" },
                { id: "Snacks", label: "Snacks", iconSrc: "/svg/snacks.svg" },
                { id: "Vegan", label: "Vegan", iconSrc: "/svg/vegan.svg" },
                { id: "Meal", label: "Meal", iconSrc: "/svg/meal.svg" },
                {
                  id: "Dessert",
                  label: "Dessert",
                  iconSrc: "/svg/dessert.svg",
                },
              ]}
              activeCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              isCategoryView={isCategoryView}
            />
          </div>

          {/* Main White Canvas Board */}
          <motion.div
            layout
            className={cn(
              "flex-grow bg-white w-full p-7 md:px-32 pb-10 flex flex-col items-center relative z-40 shadow-[0_-4px_24px_rgba(0,0,0,0.05)] transition-all duration-500",
              isCategoryView
                ? "-mt-[6px] pt-8 rounded-t-[18px]"
                : "-mt-[165px] pt-[140px] rounded-t-[40px]",
            )}
          >
            <div className="w-full">
              <AnimatePresence mode="wait">
                {!isCategoryView ? (
                  <motion.div
                    key="home"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="w-full"
                  >
                    <div className="mt-12 mb-8 h-[1px] w-full bg-[#FF5269]/50" />
                    {/* Best Seller Section */}
                    <div className="mb-10 w-full">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="h3 font-bold">Best Seller</h3>
                        <button className="flex items-center gap-1 text-brand-accent font-inter text-[14px] hover:scale-110 transition-all duration-300 cursor-pointer">
                          View All <ChevronRight size={16} />
                        </button>
                      </div>

                      <div className="flex flex-nowrap w-full justify-between sm:justify-start gap-4 pb-4">
                        <MenuItemCard
                          variant="bestseller"
                          price={105.5}
                          imageSrc="/images/sushi.png"
                          title="Sushi"
                        />
                        <MenuItemCard
                          variant="bestseller"
                          price={250.5}
                          imageSrc="/images/steak.png"
                          title="Steak"
                        />
                        <MenuItemCard
                          variant="bestseller"
                          price={80.5}
                          imageSrc="/images/pasta.png"
                          title="Pasta"
                        />
                        <MenuItemCard
                          variant="bestseller"
                          price={100.5}
                          imageSrc="/images/cupcake.png"
                          title="Cupcake"
                        />
                        <MenuItemCard
                          variant="bestseller"
                          price={120.0}
                          imageSrc="/images/noodles.png"
                          title="Noodles"
                        />
                      </div>
                    </div>

                    {/* Promo Banner Section */}
                    <div className="mb-10 w-full">
                      <PromoBanner />
                    </div>

                    {/* Recommended For You Section */}
                    <div className="w-full">
                      <h3 className="h3 font-bold mb-6">Recommended For You</h3>

                      <div className="flex flex-col md:flex-row gap-6 w-full">
                        <MenuItemCard
                          variant="horizontal"
                          title="Spicy seasoned seafood noodles"
                          price={2.29}
                          availability="20 Bowls available"
                          imageSrc="/images/noodles.png"
                        />
                        <MenuItemCard
                          variant="horizontal"
                          title="Spicy seasoned seafood noodles"
                          price={2.29}
                          availability="20 Bowls available"
                          imageSrc="/images/noodles.png"
                        />
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="category"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="w-full"
                  >
                    <h2 className="h3 font-bold mb-6 -mt-2">
                      {selectedCategory}
                    </h2>
                    <motion.div
                      initial="hidden"
                      animate="show"
                      variants={{
                        hidden: { opacity: 0 },
                        show: {
                          opacity: 1,
                          transition: {
                            staggerChildren: 0.08,
                          },
                        },
                      }}
                      className="grid grid-cols-2 gap-4 md:gap-6 md:grid-cols-3 lg:grid-cols-4"
                    >
                      {[1, 2, 3, 4, 5, 6].map((i) => (
                        <motion.div
                          key={i}
                          variants={{
                            hidden: { opacity: 0, y: 20 },
                            show: { opacity: 1, y: 0 },
                          }}
                        >
                          <MenuItemCard
                            variant="vertical"
                            title="Spicy seasoned seafood noodles"
                            price={2.29}
                            availability="20 Bowls available"
                            imageSrc="/images/noodles.png"
                          />
                        </motion.div>
                      ))}
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.main>
  );
}
