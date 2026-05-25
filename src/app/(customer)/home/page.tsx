"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

import { ChatbotLogo } from "@/components/molecules/ChatbotLogo";
import { CustomerHeader } from "@/components/organisms/CustomerHeader";
import { CategoryTabBar } from "@/components/organisms/CategoryTabBar";
import { MenuItemCard } from "@/components/molecules/MenuItemCard";
import { PromoBanner } from "@/components/organisms/PromoBanner";
import { ChevronRight, Search, MessageCircle, X } from "lucide-react"; // Added chat icons
import OrderEditor from "@/components/organisms/OrderEditor";
import { CartDrawer } from "@/components/organisms/CartDrawer";
import { FloatingOrderStatus } from "@/components/organisms/FloatingOrderStatus";
import { GuestProfileDrawer } from "@/components/organisms/GuestProfileDrawer";
import { TenantBrandingProvider } from "@/components/providers/TenantBrandingProvider";
import { CartProvider, useCart } from "@/contexts/CartContext";
import { MenuItemData } from "@/components/organisms/MenuCatalog";
import { renderCategoryIcon } from "@/lib/utils/categoryIcons";

// Helper to create a mock MenuItemData with empty modifierGroups
const mockItem = (
  id: string,
  name: string,
  price: number,
  category: string,
  imageUrl: string,
): MenuItemData => ({
  id,
  name,
  price,
  available: true,
  category,
  imageUrl,
  modifierGroups: [],
});

const MOCK_MENU_CATALOG: MenuItemData[] = [
  mockItem("1", "Sushi", 105.5, "Meal", "/images/sushi.png"),
  mockItem("2", "Steak", 250.5, "Meal", "/images/steak.png"),
  mockItem("3", "Pasta", 80.5, "Meal", "/images/pasta.png"),
  mockItem("4", "Cupcake", 100.5, "Dessert", "/images/cupcake.png"),
  mockItem("5", "Noodles", 120.0, "Meal", "/images/noodles.png"),
  mockItem(
    "6",
    "Spicy seasoned seafood noodles",
    2.29,
    "Meal",
    "/images/noodles.png",
  ),
  mockItem(
    "7",
    "Classic Burger with Fries",
    5.99,
    "Meal",
    "/images/food-placeholder.png",
  ),
];

const DEMO_CATEGORIES = [
  { id: "Drinks", label: "Drinks", icon: renderCategoryIcon("coffee", 28) },
  { id: "Snacks", label: "Snacks", icon: renderCategoryIcon("cookie", 28) },
  { id: "Vegan", label: "Vegan", icon: renderCategoryIcon("leaf", 28) },
  {
    id: "Meal",
    label: "Meal",
    icon: renderCategoryIcon("utensils-crossed", 28),
  },
  {
    id: "Dessert",
    label: "Dessert",
    icon: renderCategoryIcon("ice-cream", 28),
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

const smoothTransition = {
  type: "spring",
  stiffness: 300,
  damping: 30,
} as const;

function HomePageContent() {
  const isGridView = MOCK_BRANDING.menuLayout === "grid";
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<MenuItemData | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false); // Chat window visibility toggle
  const [searchQuery, setSearchQuery] = useState("");

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

      {/* FLOATING CHATBOT CONTAINER */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
        <AnimatePresence>
          {isChatOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: 20 }}
              transition={smoothTransition}
              className="w-[360px] h-[450px] bg-white rounded-2xl shadow-2xl border border-black/5 overflow-hidden flex flex-col"
            >
              {/* Chat Header */}
              <div className="bg-brand-accent p-4 text-white flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="font-inter font-semibold text-sm">
                    Store Concierge
                  </span>
                </div>
                <button
                  onClick={() => setIsChatOpen(false)}
                  className="p-1 hover:bg-white/10 rounded-full transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Chat Body messages area */}
              <div className="flex-grow p-4 overflow-y-auto bg-neutral-50/50 flex flex-col gap-3 font-inter text-sm">
                <div className="bg-brand-secondary/40 text-text-primary self-start p-3 rounded-2xl rounded-tl-none max-w-[80%] shadow-sm">
                  Hello! 👋 How can I assist you with your order today?
                </div>
              </div>

              {/* Chat Input row */}
              <div className="p-3 bg-white border-t border-black/5 flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Ask about ingredients, status..."
                  className="flex-grow px-4 py-2 border border-black/5 bg-neutral-50 rounded-full focus:outline-none text-sm font-inter"
                />
                <button className="bg-brand-accent text-white px-4 py-2 rounded-full text-xs font-semibold hover:opacity-90 transition-opacity cursor-pointer">
                  Send
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Solid Branded Action Trigger Circle */}
        <div
          role="button"
          tabIndex={0}
          onClick={() => setIsChatOpen((prev) => !prev)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              setIsChatOpen((prev) => !prev);
            }
          }}
          className="w-16 h-16 bg-brand-primary rounded-full flex items-center justify-center shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer select-none overflow-hidden outline-none group"
          aria-label="Toggle live helper assistant chat window"
        >
          {/* - Background is now 100% solid bg-brand-secondary to match the tenant theme color scheme.
            - Filter removed completely so ChatbotLogo keeps its native style.
            - translate-y-[7px] remains intact to lock the logo into the precise visual center.
          */}
          <div className="transform translate-y-[15px] transition-transform duration-200">
            <ChatbotLogo size={42} />
          </div>
        </div>
      </div>
    </motion.main>
  );
}

export default function CustomerHomePage() {
  return (
    <TenantBrandingProvider branding={MOCK_BRANDING as any}>
      <CartProvider>
        <HomePageContent />
      </CartProvider>
    </TenantBrandingProvider>
  );
}
