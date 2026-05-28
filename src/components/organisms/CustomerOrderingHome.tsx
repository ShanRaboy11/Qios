"use client";

import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Search, X } from "lucide-react";
import { ChatbotLogo } from "@/components/molecules/ChatbotLogo";
import { cn } from "@/lib/utils";

import { CustomerHeader } from "@/components/organisms/CustomerHeader";
import { CategoryTabBar } from "@/components/organisms/CategoryTabBar";
import { MenuItemCard } from "@/components/molecules/MenuItemCard";
import { PromoBanner } from "@/components/organisms/PromoBanner";
import OrderEditor from "@/components/organisms/OrderEditor";
import { CartDrawer } from "@/components/organisms/CartDrawer";
import { FloatingOrderStatus } from "@/components/organisms/FloatingOrderStatus";
import { GuestProfileDrawer } from "@/components/organisms/GuestProfileDrawer";
import { CartProvider, useCart } from "@/contexts/CartContext";
import { MenuItemData } from "@/components/organisms/MenuCatalog";
import { useTenantBranding } from "@/components/providers/TenantBrandingProvider";
import { renderCategoryIcon } from "@/lib/utils/categoryIcons";

const smoothTransition = {
  type: "spring",
  stiffness: 300,
  damping: 30,
} as const;

function CustomerOrderingHomeInner({
  initialCategories,
  initialItems,
  currency = "PHP",
  guestNumber = 1,
}: {
  initialCategories: { id: string; name: string; icon: string }[];
  initialItems: MenuItemData[];
  currency?: string;
  guestNumber?: number;
}) {
  const { setIsCartOpen } = useCart();
  const { branding } = useTenantBranding();
  const accentColor = branding?.accentColor || "#FF5269";
  const primaryColor = branding?.primaryColor || "#FFC670";
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<MenuItemData | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const categories = initialCategories;
  const isCategoryView = selectedCategory !== null;
  const isSearching = searchQuery.trim().length > 0;

  const filteredItems = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return initialItems.filter((item) => {
      const matchesSearch =
        normalizedQuery.length === 0 ||
        item.name.toLowerCase().includes(normalizedQuery);
      const matchesCategory =
        selectedCategory === null || item.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [initialItems, searchQuery, selectedCategory]);

  const searchResults = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();
    if (!normalizedQuery) {
      return [];
    }

    return initialItems.filter((item) =>
      item.name.toLowerCase().includes(normalizedQuery),
    );
  }, [initialItems, searchQuery]);

  const bestSellers = useMemo(() => initialItems.slice(0, 5), [initialItems]);
  const recommendedItems = useMemo(
    () => initialItems.slice(5, 7),
    [initialItems],
  );

  return (
    <motion.main
        layout
        animate={{ backgroundColor: isCategoryView ? accentColor : primaryColor }}
        className="flex flex-col min-h-screen w-full overflow-x-hidden relative transition-colors duration-500"
      >
        <div className="w-full max-w-[500px] md:max-w-none mx-auto flex-grow flex flex-col relative pb-0 md:pb-10 overflow-x-hidden">
          <CustomerHeader
            isCategoryView={isCategoryView || isSearching}
            onBack={() => {
              if (isSearching) setSearchQuery("");
              else setSelectedCategory(null);
            }}
            onCartClick={() => setIsCartOpen(true)}
            onProfileClick={() => setIsProfileOpen(true)}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />

          <div className="flex-grow flex flex-col relative w-full items-center">
            <div className="w-full max-w-[500px] md:max-w-[1024px] relative z-50">
              <CategoryTabBar
                categories={categories.map((category) => ({
                  id: category.name,
                  label: category.name,
                  icon: renderCategoryIcon(category.icon, 32),
                }))}
                activeCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
                isCategoryView={isCategoryView}
              />
            </div>

            <motion.div
              layout
              className={cn(
                "flex-grow bg-white w-full px-5 py-7 md:px-32 pb-10 flex flex-col items-center relative z-40 shadow-[0_-4px_24px_rgba(0,0,0,0.05)] transition-all duration-500",
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
                      {filteredItems.length > 0 ? (
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
                          {filteredItems.map((item) => (
                            <motion.div
                              key={`search-${item.id}`}
                              variants={{
                                hidden: { opacity: 0, y: 20 },
                                show: { opacity: 1, y: 0 },
                              }}
                            >
                              <MenuItemCard
                                variant="vertical"
                                title={item.name}
                                price={item.price}
                                availability={
                                  item.available ? "Available" : "Sold Out"
                                }
                                imageSrc={
                                  item.imageUrl ||
                                  "/images/food-placeholder.png"
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
                      <div className="mt-12 mb-8 h-[1px] w-full bg-[#FF5269]/50" />
                      <div className="mb-10 w-full">
                        <div className="flex items-center justify-between mb-6">
                          <h3 className="h3 font-bold">Best Seller</h3>
                          <button className="flex items-center gap-1 text-brand-accent font-inter text-[14px] hover:scale-110 transition-all duration-300 cursor-pointer">
                            View All <ChevronRight size={16} />
                          </button>
                        </div>

                        <div className="flex flex-nowrap w-full gap-4 pb-4 overflow-x-auto scrollbar-none -mx-1 px-1">
                          {bestSellers.length > 0 ? (
                            bestSellers.map((item) => (
                              <MenuItemCard
                                key={item.id}
                                variant="bestseller"
                                price={item.price}
                                imageSrc={
                                  item.imageUrl ||
                                  "/images/food-placeholder.png"
                                }
                                title={item.name}
                                onAdd={() => setSelectedItem(item)}
                              />
                            ))
                          ) : (
                            <div className="text-sm text-text-secondary">
                              No items available.
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="mb-10 w-full">
                        <PromoBanner />
                      </div>

                      <div className="w-full">
                        <h3 className="h3 font-bold mb-6">
                          Recommended For You
                        </h3>

                        <div className="flex flex-col gap-4 w-full">
                          {recommendedItems.length > 0 ? (
                            recommendedItems.map((item) => (
                              <MenuItemCard
                                key={item.id}
                                variant="horizontal"
                                title={item.name}
                                price={item.price}
                                availability={
                                  item.available ? "Available" : "Sold Out"
                                }
                                imageSrc={
                                  item.imageUrl ||
                                  "/images/food-placeholder.png"
                                }
                                onAdd={() => setSelectedItem(item)}
                              />
                            ))
                          ) : (
                            <div className="text-sm text-text-secondary">
                              More menu items will appear here.
                            </div>
                          )}
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
                        {filteredItems.length > 0 ? (
                          filteredItems.map((item) => (
                            <motion.div
                              key={item.id}
                              variants={{
                                hidden: { opacity: 0, y: 20 },
                                show: { opacity: 1, y: 0 },
                              }}
                            >
                              <MenuItemCard
                                variant="vertical"
                                title={item.name}
                                price={item.price}
                                availability={
                                  item.available ? "Available" : "Sold Out"
                                }
                                imageSrc={
                                  item.imageUrl ||
                                  "/images/food-placeholder.png"
                                }
                                onAdd={() => setSelectedItem(item)}
                              />
                            </motion.div>
                          ))
                        ) : (
                          <div className="col-span-full py-16 text-center text-text-secondary">
                            No menu items found for this category.
                          </div>
                        )}
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
          guestNumber={guestNumber}
        />

        {/* FLOATING CHATBOT */}
        <div className="fixed bottom-6 right-4 sm:right-6 z-50 flex flex-col items-end gap-4">
          <AnimatePresence>
            {isChatOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.85, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.85, y: 20 }}
                transition={smoothTransition}
                className="w-[min(360px,calc(100vw-2rem))] h-[450px] bg-white rounded-2xl shadow-2xl border border-black/5 overflow-hidden flex flex-col"
              >
                {/* Chat Header */}
                <div
                  className="p-4 text-white flex items-center justify-between shadow-sm"
                  style={{ backgroundColor: accentColor }}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="font-semibold text-sm">Store Concierge</span>
                  </div>
                  <button
                    onClick={() => setIsChatOpen(false)}
                    className="p-1 hover:bg-white/10 rounded-full transition-colors cursor-pointer"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Chat Body */}
                <div className="flex-grow p-4 overflow-y-auto bg-neutral-50/50 flex flex-col gap-3 text-sm">
                  <div className="bg-neutral-200/60 text-neutral-800 self-start p-3 rounded-2xl rounded-tl-none max-w-[80%] shadow-sm">
                    Hello! 👋 How can I assist you with your order today?
                  </div>
                </div>

                {/* Chat Input */}
                <div className="p-3 bg-white border-t border-black/5 flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Ask about ingredients, status..."
                    className="flex-grow px-4 py-2 border border-black/5 bg-neutral-50 rounded-full focus:outline-none text-sm"
                  />
                  <button
                    className="text-white px-4 py-2 rounded-full text-xs font-semibold hover:opacity-90 transition-opacity cursor-pointer"
                    style={{ backgroundColor: accentColor }}
                  >
                    Send
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Chatbot Trigger Button */}
          <div
            role="button"
            tabIndex={0}
            onClick={() => setIsChatOpen((prev) => !prev)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") setIsChatOpen((prev) => !prev);
            }}
            className="w-16 h-16 rounded-full flex items-center justify-center shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer select-none overflow-hidden outline-none"
            style={{ backgroundColor: primaryColor }}
            aria-label="Toggle live helper assistant chat window"
          >
            <div className="transform translate-y-[15px] transition-transform duration-200">
              <ChatbotLogo size={42} />
            </div>
          </div>
        </div>
      </motion.main>
  );
}

export default function CustomerOrderingHome({
  initialCategories,
  initialItems,
  currency = "PHP",
  guestNumber = 1,
}: {
  initialCategories: { id: string; name: string; icon: string }[];
  initialItems: MenuItemData[];
  currency?: string;
  guestNumber?: number;
}) {
  return (
    <CartProvider currency={currency}>
      <CustomerOrderingHomeInner
        initialCategories={initialCategories}
        initialItems={initialItems}
        currency={currency}
        guestNumber={guestNumber}
      />
    </CartProvider>
  );
}
