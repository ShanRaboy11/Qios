"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

import { CustomerHeader } from "@/components/organisms/CustomerHeader";
import { CategoryTabBar } from "@/components/organisms/CategoryTabBar";
import { MenuItemCard } from "@/components/molecules/MenuItemCard";
import { PromoBanner } from "@/components/organisms/PromoBanner";
import { ChevronRight, Search } from "lucide-react";
import OrderEditor from "@/components/organisms/OrderEditor";
import { CartDrawer } from "@/components/organisms/CartDrawer";
import { FloatingOrderStatus } from "@/components/organisms/FloatingOrderStatus";
import { GuestProfileDrawer } from "@/components/organisms/GuestProfileDrawer";
import { CartProvider } from "@/contexts/CartContext";
import { MenuItemData } from "@/components/organisms/MenuCatalog";
import { renderCategoryIcon } from "@/lib/utils/categoryIcons";

// Helper to create a mock MenuItemData with empty modifierGroups
const mockItem = (id: string, name: string, price: number, category: string, imageUrl: string): MenuItemData => ({
  id, name, price, available: true, category, imageUrl, modifierGroups: [],
});

const MOCK_MENU_CATALOG: MenuItemData[] = [
  mockItem("1", "Sushi", 105.5, "Meal", "/images/sushi.png"),
  mockItem("2", "Steak", 250.5, "Meal", "/images/steak.png"),
  mockItem("3", "Pasta", 80.5, "Meal", "/images/pasta.png"),
  mockItem("4", "Cupcake", 100.5, "Dessert", "/images/cupcake.png"),
  mockItem("5", "Noodles", 120.0, "Meal", "/images/noodles.png"),
  mockItem("6", "Spicy seasoned seafood noodles", 2.29, "Meal", "/images/noodles.png"),
  mockItem("7", "Classic Burger with Fries", 5.99, "Meal", "/images/food-placeholder.png"),
];

const DEMO_CATEGORIES = [
  { id: "Drinks", label: "Drinks", icon: renderCategoryIcon("coffee", 28) },
  { id: "Snacks", label: "Snacks", icon: renderCategoryIcon("cookie", 28) },
  { id: "Vegan", label: "Vegan", icon: renderCategoryIcon("leaf", 28) },
  { id: "Meal", label: "Meal", icon: renderCategoryIcon("utensils-crossed", 28) },
  { id: "Dessert", label: "Dessert", icon: renderCategoryIcon("ice-cream", 28) },
];

export default function CustomerHomePage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<MenuItemData | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const isCategoryView = selectedCategory !== null;
  const isSearching = searchQuery.trim().length > 0;

  const searchResults = MOCK_MENU_CATALOG.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <CartProvider>
      <motion.main
        layout
        animate={{ backgroundColor: isCategoryView ? "#FF5269" : "#FFDC72" }}
        className="flex flex-col min-h-screen w-full overflow-x-hidden relative transition-colors duration-500"
      >
        <div className="w-full max-w-[500px] md:max-w-none mx-auto flex-grow flex flex-col relative pb-0 md:pb-10">
          <CustomerHeader
            isCategoryView={isCategoryView || isSearching}
            onBack={() => {
              if (isSearching) setSearchQuery("");
              else setSelectedCategory(null);
            }}
            onProfileClick={() => setIsProfileOpen(true)}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />

          <div className="flex-grow flex flex-col relative w-full items-center">
            <div className="w-full max-w-[500px] md:max-w-[1024px] relative z-50">
              <CategoryTabBar
                categories={DEMO_CATEGORIES}
                activeCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
                isCategoryView={isCategoryView}
              />
            </div>

            <motion.div
              layout
              className={cn(
                "flex-grow bg-white w-full p-7 md:px-32 pb-10 flex flex-col items-center relative z-40 shadow-[0_-4px_24px_rgba(0,0,0,0.05)] transition-all duration-500",
                (isCategoryView || isSearching)
                  ? "-mt-[6px] pt-8 rounded-t-[18px]"
                  : "-mt-[165px] pt-[140px] rounded-t-[40px]",
              )}
            >
              <div className="w-full">
                <AnimatePresence mode="wait">
                  {isSearching ? (
                    <motion.div
                      key="search"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                      className="w-full"
                    >
                      <h2 className="h3 font-bold mb-6 -mt-2 text-[#2D2D2D]">
                        Search Results
                      </h2>
                      {searchResults.length > 0 ? (
                        <motion.div
                          initial="hidden"
                          animate="show"
                          variants={{
                            hidden: { opacity: 0 },
                            show: { opacity: 1, transition: { staggerChildren: 0.08 } },
                          }}
                          className="grid grid-cols-2 gap-4 md:gap-6 md:grid-cols-3 lg:grid-cols-4"
                        >
                          {searchResults.map((item) => (
                            <motion.div
                              key={`search-${item.id}`}
                              variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
                            >
                              <MenuItemCard
                                variant="vertical"
                                title={item.name}
                                price={item.price}
                                availability="Available"
                                imageSrc={item.imageUrl || "/images/food-placeholder.png"}
                                onAdd={() => setSelectedItem(item)}
                              />
                            </motion.div>
                          ))}
                        </motion.div>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-20 opacity-50">
                          <Search size={48} className="mb-4" />
                          <p className="text-lg font-bold">No items found</p>
                          <p className="text-sm">Try searching for something else.</p>
                        </div>
                      )}
                    </motion.div>
                  ) : !isCategoryView ? (
                    <motion.div
                      key="home"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                      className="w-full"
                    >
                      <div className="mt-12 mb-8 h-[1px] w-full bg-[#FF5269]/50" />
                      <div className="mb-10 w-full">
                        <div className="flex items-center justify-between mb-6">
                          <h3 className="h3 font-bold">Best Seller</h3>
                          <button className="flex items-center gap-1 text-brand-accent font-inter text-[14px] hover:scale-110 transition-all duration-300 cursor-pointer">
                            View All <ChevronRight size={16} />
                          </button>
                        </div>

                        <div className="flex flex-nowrap w-full justify-between sm:justify-start gap-4 pb-4">
                          {MOCK_MENU_CATALOG.slice(0, 5).map((item) => (
                            <MenuItemCard
                              key={item.id}
                              variant="bestseller"
                              price={item.price}
                              imageSrc={item.imageUrl}
                              title={item.name}
                              onAdd={() => setSelectedItem(item)}
                            />
                          ))}
                        </div>
                      </div>

                      <div className="mb-10 w-full">
                        <PromoBanner />
                      </div>

                      <div className="w-full">
                        <h3 className="h3 font-bold mb-6">Recommended For You</h3>
                        <div className="flex flex-col md:flex-row gap-6 w-full">
                          {MOCK_MENU_CATALOG.slice(5).map((item) => (
                            <MenuItemCard
                              key={item.id}
                              variant="horizontal"
                              title={item.name}
                              price={item.price}
                              availability="Available"
                              imageSrc={item.imageUrl}
                              onAdd={() => setSelectedItem(item)}
                            />
                          ))}
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
                      <h2 className="h3 font-bold mb-6 -mt-2">{selectedCategory}</h2>
                      <motion.div
                        initial="hidden"
                        animate="show"
                        variants={{
                          hidden: { opacity: 0 },
                          show: { opacity: 1, transition: { staggerChildren: 0.08 } },
                        }}
                        className="grid grid-cols-2 gap-4 md:gap-6 md:grid-cols-3 lg:grid-cols-4"
                      >
                        {MOCK_MENU_CATALOG.filter(i => i.category === selectedCategory).map((item) => (
                          <motion.div
                            key={item.id}
                            variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
                          >
                            <MenuItemCard
                              variant="vertical"
                              title={item.name}
                              price={item.price}
                              availability="Available"
                              imageSrc={item.imageUrl}
                              onAdd={() => setSelectedItem(item)}
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

        {selectedItem && (
          <OrderEditor
            menuItem={selectedItem}
            onClose={() => setSelectedItem(null)}
          />
        )}
        <CartDrawer />
        <FloatingOrderStatus />
        <GuestProfileDrawer isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
      </motion.main>
    </CartProvider>
  );
}
