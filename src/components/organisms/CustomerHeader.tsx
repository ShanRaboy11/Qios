import React from "react";
import { Search, User, ChevronLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { FormField } from "@/components/molecules/FormField";
import { SearchFilterBar } from "./IngredientsInventory";
import { SearchFilterbarv2 } from "../molecules/SearchFilterbarv2";

export interface CustomerHeaderProps {
  isCategoryView?: boolean;
  onBack?: () => void;
}

export const CustomerHeader = ({
  isCategoryView = false,
  onBack,
}: CustomerHeaderProps) => {
  return (
    <motion.div layout className="w-full px-6 pt-12 pb-6 sticky top-0 z-30">
      {/* Top action row */}
      <motion.div layout className="flex items-center gap-4 mb-4">
        {isCategoryView && (
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            onClick={onBack}
            className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
          >
            <ChevronLeft className="text-[#2D2D2D]" size={24} />
          </motion.button>
        )}

        <FormField
          label=""
          placeholder="Search"
          leftIcon={<Search size={20} />}
          className="max-w-none flex-grow"
        />

        <button className="w-12 h-12 bg-white rounded-full flex items-center justify-center shrink-0 shadow-sm hover:shadow-md transition-shadow">
          <User className="text-[#2D2D2D]" size={24} />
        </button>
      </motion.div>

      {/* Greeting text */}
      <AnimatePresence mode="wait">
        {!isCategoryView && (
          <motion.div
            key="greeting"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-8 flex flex-col gap-1 overflow-hidden"
          >
            <h1 className="text-[40px] font-figtree font-medium text-[#2D2D2D] leading-tight">
              Good Morning, Name!
            </h1>
            <p className="text-[#2D2D2D]/80 font-inter text-[20px]">
              Rise and Shine! It's Breakfast Time
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
