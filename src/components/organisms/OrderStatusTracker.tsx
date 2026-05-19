"use client";

import React, { useState, useEffect } from "react";
import { StepperBar } from "@/components/molecules/StepperBar";
import {
  Receipt,
  ChefHat,
  ShoppingBag,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Clock,
  BellRing,
  ChevronLeft
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/atoms/Button";
import Link from "next/link";

// Mock Data
const ORDER_ITEMS = [
  { id: "1", name: "Classic Burger", qty: 1, price: 8.99, mods: "No onions" },
  { id: "2", name: "Large Fries", qty: 1, price: 3.99, mods: "" },
  { id: "3", name: "Vanilla Shake", qty: 2, price: 4.5, mods: "" },
];

const STEPS = [
  { id: 1, label: "Order Placed", icon: <Receipt size={24} /> },
  { id: 2, label: "In the Kitchen", icon: <ChefHat size={24} /> },
  { id: 3, label: "Ready to Pick Up", icon: <ShoppingBag size={24} /> },
  { id: 4, label: "Completed", icon: <CheckCircle size={24} /> },
];

export const OrderStatusTracker = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);
  const [isReadyNotified, setIsReadyNotified] = useState(false);

  // Trigger ready notification animation when step becomes 3
  useEffect(() => {
    if (currentStep === 3) {
      setIsReadyNotified(true);
      if (typeof window !== "undefined" && window.navigator && window.navigator.vibrate) {
        window.navigator.vibrate([200, 100, 200]);
      }
    } else {
      setIsReadyNotified(false);
    }
  }, [currentStep]);

  const subtotal = ORDER_ITEMS.reduce((sum, item) => sum + item.price * item.qty, 0);
  const tax = subtotal * 0.085;
  const total = subtotal + tax;

  return (
    <div className="flex flex-col w-full max-w-md mx-auto min-h-screen bg-[#FFF9F2] font-figtree relative pb-24">
      {/* 1. Header (Customer App Style) */}
      <div className="px-6 pt-12 pb-6 bg-[#FFC670] rounded-b-[40px] shadow-sm sticky top-0 z-20 flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <Link href="/123/home">
            <button className="w-10 h-10 bg-white/40 rounded-full flex items-center justify-center hover:bg-white/60 transition-colors">
              <ChevronLeft className="text-[#2D2D2D]" size={24} />
            </button>
          </Link>
          <h1 className="text-2xl font-bold text-[#2D2D2D] tracking-tight">Track Order</h1>
        </div>
        
        <div className="flex items-center justify-between bg-white rounded-3xl p-4 shadow-sm">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-0.5">Order Number</p>
            <h2 className="text-xl font-black text-[#2D2D2D]">#ORD-2847</h2>
          </div>
          <div className="bg-[#FFF1F2] px-4 py-2 rounded-2xl flex items-center gap-2">
            <Clock size={18} className="text-[#FF5269]" />
            <span className="text-base font-bold text-[#FF5269]">
              {currentStep < 3 ? "12 min" : "--"}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Main Status Area */}
      <div className="p-6 mt-4">
        <AnimatePresence mode="wait">
          {isReadyNotified ? (
            <motion.div
              key="ready-state"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: -20 }}
              className="bg-[#FF5269] rounded-[32px] p-8 text-center text-white shadow-lg mb-8 relative overflow-hidden"
            >
              {/* Pulsing background effect */}
              <motion.div 
                className="absolute inset-0 bg-white/10 rounded-[32px]"
                animate={{ scale: [1, 1.05, 1], opacity: [0, 0.5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              />
              
              <motion.div
                initial={{ rotate: -15, y: 10 }}
                animate={{ rotate: [0, -10, 10, -10, 10, 0], y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-white/20 backdrop-blur-md mb-6 shadow-inner"
              >
                <ShoppingBag size={48} className="text-white drop-shadow-md" />
              </motion.div>
              <h2 className="text-[32px] font-black mb-3 tracking-tight drop-shadow-sm">It's Ready!</h2>
              <p className="text-white/90 font-medium text-lg px-2">
                Your order is fresh and waiting for you at the counter!
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="progress-state"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100 mb-8"
            >
              <StepperBar 
                steps={STEPS} 
                currentStep={currentStep} 
                orientation="vertical" 
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* 3. Order Details Accordion */}
        <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden mt-4">
          <button 
            onClick={() => setIsSummaryOpen(!isSummaryOpen)}
            className="w-full flex items-center justify-between p-6 bg-white active:bg-gray-50 transition-colors"
          >
            <span className="text-lg font-bold text-[#2D2D2D]">Your Items</span>
            <motion.div
              animate={{ rotate: isSummaryOpen ? 180 : 0 }}
              transition={{ duration: 0.3, type: "spring" }}
              className="w-10 h-10 bg-[#FFF9F2] rounded-full flex items-center justify-center"
            >
              <ChevronDown size={20} className="text-[#2D2D2D]" />
            </motion.div>
          </button>
          
          <AnimatePresence>
            {isSummaryOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="px-6 pb-6 border-t border-gray-50 pt-4">
                  <div className="space-y-5">
                    {ORDER_ITEMS.map((item) => (
                      <div key={item.id} className="flex justify-between items-start gap-4">
                        <div className="flex gap-4">
                          <div className="w-8 h-8 rounded-full bg-[#FFC670]/20 flex items-center justify-center shrink-0 mt-0.5">
                            <span className="font-bold text-[#2D2D2D] text-sm">{item.qty}x</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="font-bold text-[#2D2D2D] text-base">{item.name}</span>
                            {item.mods && <span className="text-sm text-gray-400 mt-0.5">{item.mods}</span>}
                          </div>
                        </div>
                        <span className="font-bold text-[#2D2D2D] text-base whitespace-nowrap mt-1">
                          ₱{(item.price * item.qty).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="h-[2px] border-t-2 border-dashed border-gray-100 my-6" />
                  
                  <div className="space-y-3 mb-5">
                    <div className="flex justify-between text-base font-medium text-gray-500">
                      <span>Subtotal</span>
                      <span>₱{subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-base font-medium text-gray-500">
                      <span>Tax (8.5%)</span>
                      <span>₱{tax.toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center text-xl font-black text-[#2D2D2D] bg-[#FFF9F2] p-4 rounded-2xl">
                    <span>Total Paid</span>
                    <span className="text-[#FF5269]">₱{total.toFixed(2)}</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* 4. DEMO CONTROLS (Only visible in dev/demo mode) */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-md border-t border-gray-100 z-30 flex justify-center gap-3">
        <div className="w-full max-w-md flex gap-3">
          <Button 
            variant="outline" 
            className="flex-1 font-bold rounded-full border-gray-200"
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
            disabled={currentStep === 1}
          >
            Reverse
          </Button>
          <Button 
            variant="primary" 
            className="flex-1 font-bold rounded-full"
            onClick={() => setCurrentStep(Math.min(4, currentStep + 1))}
            disabled={currentStep === 4}
          >
            Next Stage
          </Button>
        </div>
      </div>
    </div>
  );
};
