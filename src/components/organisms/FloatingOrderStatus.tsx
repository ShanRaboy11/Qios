"use client";

import React, { useState, useEffect } from "react";
import { StepperBar } from "@/components/molecules/StepperBar";
import {
  Receipt,
  ChefHat,
  ShoppingBag,
  CheckCircle,
  BellRing,
  ChevronUp,
  ChevronDown,
  Clock,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

import { useCart } from "@/contexts/CartContext";

const STEPS = [
  { id: 0, label: "Pending Payment", icon: <Receipt size={18} /> },
  { id: 1, label: "Placed", icon: <Receipt size={18} /> },
  { id: 2, label: "Kitchen", icon: <ChefHat size={18} /> },
  { id: 3, label: "Ready", icon: <ShoppingBag size={18} /> },
  { id: 4, label: "Done", icon: <CheckCircle size={18} /> },
];

export const FloatingOrderStatus = () => {
  const { isOrderPlaced, setIsOrderPlaced, cartTotal, currency } = useCart();
  const [currentStep, setCurrentStep] = useState(0); // Start at Pending Payment
  const [isExpanded, setIsExpanded] = useState(false);
  const [isReadyNotified, setIsReadyNotified] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (isOrderPlaced) {
      setIsVisible(true);
      setCurrentStep(0);
    }
  }, [isOrderPlaced]);

  // Remove the setInterval auto-progress simulator for actual production.
  // We'll leave the Ready Notification effect in place so if it ever hits step 3 it works.

  useEffect(() => {
    if (currentStep === 3) {
      setIsReadyNotified(true);
      if (!isExpanded) setIsExpanded(true); // Auto expand when ready!
      if (
        typeof window !== "undefined" &&
        window.navigator &&
        window.navigator.vibrate
      ) {
        window.navigator.vibrate([200, 100, 200]);
      }
    } else {
      setIsReadyNotified(false);
    }
  }, [currentStep, isExpanded]);

  if (!isOrderPlaced || !isVisible) return null;

  const currentLabel =
    STEPS.find((s) => s.id === currentStep)?.label || "Processing";
  const progress = (currentStep / (STEPS.length - 1)) * 100;

  return (
    <div className="fixed bottom-6 left-0 right-0 z-[100] px-4 pointer-events-none flex justify-center">
      <AnimatePresence mode="wait">
        {!isExpanded ? (
          // COLLAPSED PILL STATE
          <motion.div
            key="collapsed"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsExpanded(true)}
            className="pointer-events-auto bg-white/90 backdrop-blur-xl border border-white shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-full px-5 py-3 flex items-center gap-4 cursor-pointer relative overflow-hidden max-w-sm w-full"
          >
            {/* Progress Bar background in pill */}
            <div
              className="absolute bottom-0 left-0 h-1 bg-brand-primary transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />

            <div
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center text-white shrink-0 shadow-inner",
                currentStep === 3
                  ? "bg-brand-accent animate-pulse"
                  : "bg-brand-primary",
              )}
            >
              {currentStep === 3 ? (
                <BellRing size={20} />
              ) : (
                <ChefHat size={20} />
              )}
            </div>

            <div className="flex flex-col flex-1">
              <span className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">
                Active Order
              </span>
              <span className="text-sm font-black text-text-primary truncate">
                {currentStep === 3
                  ? "Order is Ready!"
                  : `Status: ${currentLabel}`}
              </span>
            </div>

            <ChevronUp size={20} className="text-gray-400" />
          </motion.div>
        ) : (
          // EXPANDED CARD STATE
          <motion.div
            key="expanded"
            initial={{ y: 50, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 50, opacity: 0, scale: 0.95 }}
            className="pointer-events-auto w-full max-w-md bg-white rounded-[32px] shadow-[0_20px_40px_rgb(0,0,0,0.15)] border border-gray-100 overflow-hidden font-brand-secondary"
          >
            {/* Header: Order & Total (Requested by User) */}
            <div className="bg-bg-primary p-6 pb-5 relative">
              <button
                onClick={() => setIsExpanded(false)}
                className="absolute top-4 right-4 w-8 h-8 bg-white rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 shadow-sm"
              >
                <ChevronDown size={20} />
              </button>

              <div className="flex items-end justify-between pr-8 mb-4 font-brand-secondary">
                <div>
                  <span className="text-xs font-brand font-bold text-gray-500 uppercase tracking-widest mb-1 block">
                    Order Details
                  </span>
                  <h2 className="text-2xl font-brand font-black text-text-primary">
                    #ORD-2847
                  </h2>
                </div>
                <div className="text-right">
                  <span className="text-xs font-brand font-bold text-gray-500 uppercase tracking-widest mb-1 block">
                    Order Total
                  </span>
                  <span className="text-2xl font-brand font-black text-brand-accent">
                    {currency} {cartTotal.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Main Status Content */}
            <div className="p-6 bg-white relative">
              <AnimatePresence mode="wait">
                {isReadyNotified ? (
                  // Ready Notification State
                  <motion.div
                    key="ready"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-brand-accent rounded-3xl p-6 text-center text-white shadow-lg relative overflow-hidden"
                  >
                    <motion.div
                      className="absolute inset-0 bg-white/10"
                      animate={{ scale: [1, 1.1, 1], opacity: [0, 0.4, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                    <motion.div
                      animate={{ rotate: [0, -10, 10, -10, 10, 0] }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                      className="inline-flex w-16 h-16 rounded-full bg-white/20 items-center justify-center mb-3"
                    >
                      <ShoppingBag size={32} />
                    </motion.div>
                    <h3 className="text-2xl font-brand font-black mb-1">
                      It's Ready!
                    </h3>
                    <p className="text-white/90 text-sm font-brand-secondary">
                      Please present your receipt at the counter.
                    </p>
                  </motion.div>
                ) : (
                  // Horizontal StepperBar State
                  <motion.div
                    key="stepper"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="py-2 font-brand-secondary"
                  >
                    <div className="flex items-center gap-2 mb-6 text-brand-accent bg-brand-accent/10 w-fit px-3 py-1 rounded-full text-xs font-brand-secondary font-bold">
                      <Clock size={14} />
                      Est. Time: 12 min
                    </div>

                    {/* Horizontal StepperBar wrapper to handle overflow cleanly on mobile */}
                    <div className="w-full overflow-x-auto pb-4 scrollbar-hide">
                      <div className="min-w-[300px]">
                        <StepperBar
                          steps={STEPS}
                          currentStep={currentStep}
                          orientation="horizontal"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {currentStep === 4 && (
                <button
                  onClick={() => setIsVisible(false)}
                  className="w-full mt-4 py-3 bg-gray-100 text-gray-600 font-bold rounded-xl"
                >
                  Dismiss
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
