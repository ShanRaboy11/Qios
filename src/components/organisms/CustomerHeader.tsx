import React from "react";
import { Search, User, ChevronLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { FormField } from "@/components/molecules/FormField";

export interface CustomerHeaderProps {
  isCategoryView?: boolean;
  onBack?: () => void;
}

// Add "as const" at the end to lock the string types
const smoothTransition = {
  type: "spring",
  stiffness: 300,
  damping: 30,
} as const;

export const CustomerHeader = ({
  isCategoryView = false,
  onBack,
}: CustomerHeaderProps) => {
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
                backgroundColor: "rgba(112, 112, 112, 0.3)",
              }} // Smooth hover
              whileTap={{ scale: 0.95 }}
              transition={smoothTransition}
              onClick={onBack}
              className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-shadow hover:shadow-md"
            >
              <ChevronLeft className="text-[#2D2D2D]" size={24} />
            </motion.button>
          )}
        </AnimatePresence>

        <motion.div layout transition={smoothTransition} className="flex-grow">
          <FormField
            label=""
            placeholder="Search"
            leftIcon={<Search size={20} />}
            className="max-w-none"
          />
        </motion.div>

        <motion.button
          layout
          transition={smoothTransition}
          className="w-12 h-12 bg-white rounded-full flex items-center justify-center shrink-0 shadow-sm hover:shadow-md transition-shadow"
        >
          <User className="text-[#2D2D2D]" size={24} />
        </motion.button>
      </motion.div>

      {/* Greeting text */}
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
