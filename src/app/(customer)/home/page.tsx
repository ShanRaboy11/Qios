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
import { TenantBrandingProvider } from "@/components/providers/TenantBrandingProvider";
import { CartProvider, useCart } from "@/contexts/CartContext";
import { MenuItemData } from "@/components/organisms/MenuCatalog";

const MOCK_MENU_CATALOG: MenuItemData[] = [
  {
    id: "1",
    name: "Sushi",
    price: 105.5,
    available: true,
    category: "Meal",
    imageUrl: "/images/sushi.png",
  },
  {
    id: "2",
    name: "Steak",
    price: 250.5,
    available: true,
    category: "Meal",
    imageUrl: "/images/steak.png",
  },
  {
    id: "3",
    name: "Pasta",
    price: 80.5,
    available: true,
    category: "Meal",
    imageUrl: "/images/pasta.png",
  },
  {
    id: "4",
    name: "Cupcake",
    price: 100.5,
    available: true,
    category: "Dessert",
    imageUrl: "/images/cupcake.png",
  },
  {
    id: "5",
    name: "Noodles",
    price: 120.0,
    available: true,
    category: "Meal",
    imageUrl: "/images/noodles.png",
  },
  {
    id: "6",
    name: "Spicy seasoned seafood noodles",
    price: 2.29,
    available: true,
    category: "Meal",
    imageUrl: "/images/noodles.png",
  },
  {
    id: "7",
    name: "Classic Burger with Fries",
    price: 5.99,
    available: true,
    category: "Meal",
    imageUrl: "/images/food-placeholder.png",
  },
];

const MOCK_BRANDING = {
  primaryColor: "#00704A",
  secondaryColor: "#D4E9E2",
  accentColor: "#1E3932",
  fontFamily: "playfair",
  secondaryFont: "inter",
  menuLayout: "grid",
  dashboardLogoUrl: "/images/starbucks-logo.png",
};

// Isolated core view logic to correctly consume the useCart context safely down-tree
function HomePageContent() {
  const isGridView = MOCK_BRANDING.menuLayout === "grid";
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<MenuItemData | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Consume cart action handler context safely now
  const { setIsCartOpen } = useCart();

  const isCategoryView = selectedCategory !== null;
  const isSearching = searchQuery.trim().length > 0;

  const searchResults = MOCK_MENU_CATALOG.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <motion.main
      layout
      className="flex flex-col min-h-screen w-full overflow-x-hidden relative transition-colors duration-500 bg-brand-secondary"
    >
      <div className="w-full max-w-[500px] md:max-w-none mx-auto flex-grow flex flex-col relative pb-0 md:pb-10">
        <CustomerHeader
          isCategoryView={isCategoryView || isSearching}
          onBack={() => {
            if (isSearching) setSearchQuery("");
            else setSelectedCategory(null);
          }}
          onSearchChange={setSearchQuery}
          searchQuery={searchQuery}
          onCartClick={() => setIsCartOpen(true)}
          onProfileClick={() => setIsProfileOpen(true)}
        />

        <div className="flex-grow flex flex-col relative w-full items-center">
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

          <motion.div
            layout
            className={cn(
              "flex-grow bg-white w-full p-7 md:px-32 pb-10 flex flex-col items-center relative z-40 shadow-[0_-4px_24px_rgba(0,0,0,0.05)] transition-all duration-500",
              isCategoryView || isSearching
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
                          show: {
                            opacity: 1,
                            transition: { staggerChildren: 0.08 },
                          },
                        }}
                        className="grid grid-cols-2 gap-4 md:gap-6 md:grid-cols-3 lg:grid-cols-4"
                      >
                        {searchResults.map((item) => (
                          <motion.div
                            key={`search-${item.id}`}
                            variants={{
                              hidden: { opacity: 0, y: 20 },
                              show: { opacity: 1, y: 0 },
                            }}
                          >
                            <MenuItemCard
                              variant={isGridView ? "vertical" : "horizontal"}
                              title={item.name}
                              price={item.price}
                              availability="Available"
                              imageSrc={
                                item.imageUrl || "/images/food-placeholder.png"
                              }
                              onAdd={() => setSelectedItem(item)}
                            />
                          </motion.div>
                        ))}
                      </motion.div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-20 opacity-50">
                        <Search size={48} className="mb-4" />
                        <p className="text-lg font-bold">No items found</p>
                        <p className="text-sm">
                          Try searching for something else.
                        </p>
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
                    <div className="mt-12 mb-8 h-[1px] w-full bg-brand-accent/50" />
                    <div className="mb-10 w-full">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="h3 font-bold font-brand">Best Seller</h3>
                        <button className="flex items-center gap-1 text-brand-accent font-inter text-[14px] hover:scale-110 transition-all duration-300 cursor-pointer">
                          View All <ChevronRight size={16} />
                        </button>
                      </div>

                      <div className="flex flex-nowrap w-full overflow-x-auto justify-between sm:justify-start gap-4 pb-4 scrollbar-none">
                        {MOCK_MENU_CATALOG.slice(0, 5).map((item) => (
                          <MenuItemCard
                            key={`bestseller-${item.id}`}
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
                        <MenuItemCard
                          variant="horizontal"
                          title="Spicy seasoned seafood noodles"
                          price={2.29}
                          availability="20 Bowls available"
                          imageSrc="/images/noodles.png"
                          onAdd={() =>
                            setSelectedItem({
                              id: "6",
                              name: "Spicy seasoned seafood noodles",
                              price: 2.29,
                              available: true,
                              category: "Meal",
                              imageUrl: "/images/noodles.png",
                            })
                          }
                        />
                        <MenuItemCard
                          variant="horizontal"
                          title="Classic Burger with Fries"
                          price={5.99}
                          availability="15 Meals available"
                          imageSrc="/images/food-placeholder.png"
                          onAdd={() =>
                            setSelectedItem({
                              id: "7",
                              name: "Classic Burger with Fries",
                              price: 5.99,
                              available: true,
                              category: "Meal",
                              imageUrl: "/images/food-placeholder.png",
                            })
                          }
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
                          transition: { staggerChildren: 0.08 },
                        },
                      }}
                      className="grid grid-cols-2 gap-4 md:gap-6 md:grid-cols-3 lg:grid-cols-4"
                    >
                      {MOCK_MENU_CATALOG.filter(
                        (item) => item.category === selectedCategory,
                      ).map((item, i) => (
                        <motion.div
                          key={`cat-${item.id}-${i}`}
                          variants={{
                            hidden: { opacity: 0, y: 20 },
                            show: { opacity: 1, y: 0 },
                          }}
                        >
                          <MenuItemCard
                            variant={isGridView ? "vertical" : "horizontal"}
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
      <GuestProfileDrawer
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />
    </motion.main>
  );
}

// Global Orchestration Page Wrapper Component
export default function CustomerHomePage() {
  return (
    <TenantBrandingProvider branding={MOCK_BRANDING as any}>
      <CartProvider>
        <HomePageContent />
      </CartProvider>
    </TenantBrandingProvider>
  );
}
