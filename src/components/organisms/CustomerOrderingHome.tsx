"use client";

import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Search } from "lucide-react";
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
import { ChatbotUI } from "@/components/organisms/ChatbotUI";
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
  tenantId,
  storeName,
}: {
  initialCategories: { id: string; name: string; icon: string }[];
  initialItems: MenuItemData[];
  currency?: string;
  guestNumber?: number;
  tenantId: string;
  storeName?: string;
}) {
  const { setIsCartOpen } = useCart();
  const { branding } = useTenantBranding();
  const accentColor = branding?.accentColor || "#FF5269";
  const primaryColor = branding?.primaryColor || "#FFC670";
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<MenuItemData | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
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
        <div className="w-full max-w-[500px] md:max-w-none mx-auto flex-grow flex flex-col relative pb-0 md:pb-0 overflow-visible">
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
                "flex-grow bg-white w-full px-5 py-7 md:px-32 pb-32 md:pb-48 flex flex-col items-center relative z-40 shadow-[0_-4px_24px_rgba(0,0,0,0.05)] transition-all duration-500",
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
                      <div className="sr-only">Category: {selectedCategory}</div>
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
        <FloatingOrderStatus tenantId={tenantId} />
        <GuestProfileDrawer
          isOpen={isProfileOpen}
          onClose={() => setIsProfileOpen(false)}
          guestNumber={guestNumber}
        />

        <ChatbotUI
          mode="floating"
          tenantId={tenantId}
          storeName={storeName}
          triggerContent={
            <div className="flex h-full w-full items-center justify-center overflow-visible scale-[0.56] origin-center translate-y-[2px]">
              <ChatbotLogo size={44} />
            </div>
          }
        />
      </motion.main>
  );
}

export default function CustomerOrderingHome({
  initialCategories,
  initialItems,
  currency = "PHP",
  guestNumber = 1,
  tenantId,
  storeName,
}: {
  initialCategories: { id: string; name: string; icon: string }[];
  initialItems: MenuItemData[];
  currency?: string;
  guestNumber?: number;
  tenantId: string;
  storeName?: string;
}) {
  return (
    <CartProvider currency={currency}>
      <CustomerOrderingHomeInner
        initialCategories={initialCategories}
        initialItems={initialItems}
        currency={currency}
        guestNumber={guestNumber}
        tenantId={tenantId}
        storeName={storeName}
      />
    </CartProvider>
  );
}
