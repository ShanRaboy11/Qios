"use client";

import React from "react";
import { Search, User, ChevronLeft, ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { FormField } from "@/components/molecules/FormField";
import { useTenantBranding } from "@/components/providers/TenantBrandingProvider";
import { useCart } from "@/contexts/CartContext"; // Dynamic interface consumption

export interface CustomerHeaderProps {
  isCategoryView?: boolean;
  onBack?: () => void;
  onCartClick?: () => void; // Added tracking signature property
  onProfileClick?: () => void;
  searchQuery?: string;
  onSearchChange?: (val: string) => void;
}

const smoothTransition = {
  type: "spring",
  stiffness: 300,
  damping: 30,
} as const;

export const CustomerHeader = ({
  isCategoryView = false,
  onBack,
  onCartClick,
  onProfileClick,
  searchQuery = "",
  onSearchChange,
}: CustomerHeaderProps) => {
  const { branding } = useTenantBranding();
  const { itemCount } = useCart(); // Read the real-time calculated context counter

  const [greeting, setGreeting] = React.useState("Good Morning!");
  const [subGreeting, setSubGreeting] = React.useState("Rise and Shine! It's Breakfast Time");

  React.useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      setGreeting("Good Morning!");
      setSubGreeting("Rise and Shine! It's Breakfast Time");
    } else if (hour >= 12 && hour < 17) {
      setGreeting("Good Afternoon!");
      setSubGreeting("Time for a delicious lunch!");
    } else {
      setGreeting("Good Evening!");
      setSubGreeting("Unwind with a great dinner!");
    }
  }, []);

  return (
    <motion.div
      layout
      transition={smoothTransition}
      className="w-full px-6 pt-12 pb-6 sticky top-0 z-30 backdrop-blur-md"
    >
      {/* Top action row */}
      <motion.div
        layout
        transition={smoothTransition}
        className="flex items-center gap-4 mb-4"
      >
        <AnimatePresence>
          {isCategoryView && (
            <motion.button
              key="back-button"
              initial={{ opacity: 0, x: -20, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -20, scale: 0.8 }}
              whileHover={{
                scale: 1.1,
                backgroundColor: "rgba(112, 112, 112, 0.1)",
              }}
              whileTap={{ scale: 0.95 }}
              transition={smoothTransition}
              onClick={onBack}
              className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-shadow hover:shadow-md bg-white"
            >
              <ChevronLeft className="text-[#2D2D2D]" size={24} />
            </motion.button>
          )}
        </AnimatePresence>

        {/* 1. Search Form Input Area */}
        <motion.div layout transition={smoothTransition} className="flex-grow">
          <FormField
            label=""
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => onSearchChange?.(e.target.value)}
            leftIcon={<Search size={20} />}
            className="max-w-none"
          />
        </motion.div>

        {/* 2. PLACED BETWEEN: Cart Action Drawer Trigger Button with dynamic badge rendering */}
        <motion.button
          layout
          transition={smoothTransition}
          whileTap={{ scale: 0.95 }}
          onClick={onCartClick}
          className="relative w-12 h-12 bg-white rounded-full flex items-center justify-center shrink-0 shadow-sm hover:shadow-md transition-all group cursor-pointer"
        >
          <ShoppingBag
            className="text-[#2D2D2D] group-hover:text-brand-accent transition-colors"
            size={22}
          />

          <AnimatePresence>
            {itemCount > 0 && (
              <motion.span
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 25 }}
                className="absolute -top-1 -right-1 bg-brand-accent text-white font-sans font-bold text-[11px] min-w-[20px] h-5 px-1.5 rounded-full flex items-center justify-center border-2 border-white shadow-sm"
              >
                {itemCount}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>

        {/* 3. Guest Profile Entry Block */}
        <motion.button
          layout
          transition={smoothTransition}
          whileTap={{ scale: 0.95 }}
          onClick={onProfileClick}
          className="w-12 h-12 bg-white rounded-full flex items-center justify-center shrink-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
        >
          <User className="text-[#2D2D2D]" size={22} />
        </motion.button>
      </motion.div>

      {/* Greeting text blocks layout template */}
      <AnimatePresence mode="wait">
        {!isCategoryView && (
          <motion.div
            key="greeting"
            initial={{ opacity: 0, y: 10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: 10, height: 0 }}
            transition={{ ...smoothTransition, opacity: { duration: 0.2 } }}
            className="mt-8 flex flex-col gap-1 overflow-hidden"
          >
            {branding?.dashboardLogoUrl && (
              <img
                src={branding.dashboardLogoUrl}
                alt="Brand Logo"
                className="h-10 w-auto object-contain mb-2 origin-left"
              />
            )}
            <h1 className="text-[28px] sm:text-[36px] md:text-[40px] font-brand font-medium text-[#2D2D2D] leading-tight">
              {greeting}
            </h1>
            <p className="text-[#2D2D2D]/80 font-brand-secondary text-[15px] sm:text-[18px] md:text-[20px]">
              {subGreeting}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
