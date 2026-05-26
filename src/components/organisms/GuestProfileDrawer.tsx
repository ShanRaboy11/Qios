"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, User, Edit2, BellRing, MessageSquare, History, Check } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { cn } from "@/lib/utils";

import { useCart } from "@/contexts/CartContext";

interface GuestProfileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  guestNumber?: number;
}

export const GuestProfileDrawer = ({ isOpen, onClose, guestNumber = 1 }: GuestProfileDrawerProps) => {
  const { isOrderPlaced, cartTotal, currency } = useCart();
  const [displayName, setDisplayName] = useState(`Guest #${guestNumber}`);
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(displayName);

  // update if guestNumber changes from upstream
  useEffect(() => {
    setDisplayName(`Guest #${guestNumber}`);
    setTempName(`Guest #${guestNumber}`);
  }, [guestNumber]);

  const handleSaveName = () => {
    setDisplayName(tempName || `Guest #${guestNumber}`);
    setIsEditingName(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[200] flex justify-end bg-black/40 backdrop-blur-sm font-figtree"
          onClick={onClose}
        >
          {/* drawer Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="w-full max-w-md h-full bg-bg-primary shadow-2xl flex flex-col rounded-l-[32px] md:rounded-l-[40px] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* header */}
            <div className="bg-brand-primary px-6 py-6 pb-8 flex flex-col gap-3 relative rounded-bl-[40px]">
              <button
                onClick={onClose}
                className="absolute top-6 right-6 w-10 h-10 bg-white/40 hover:bg-white/60 rounded-full flex items-center justify-center transition-colors"
              >
                <X size={20} className="text-text-primary" />
              </button>
              
              <div className="flex items-center gap-4 pt-2">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-inner">
                  <User size={32} className="text-brand-primary" />
                </div>
                <div>
                  <span className="text-sm font-bold text-gray-700 uppercase tracking-widest">Guest Session</span>
                  <h2 className="text-2xl font-black text-text-primary">My Profile</h2>
                </div>
              </div>
            </div>

            {/* content Area */}
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8">
              
              {/* name Edit Section */}
              <section>
                <h3 className="text-lg font-bold text-text-primary mb-3">Display Name</h3>
                <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between">
                  {isEditingName ? (
                    <div className="flex items-center gap-2 w-full">
                      <input 
                        type="text" 
                        value={tempName}
                        onChange={(e) => setTempName(e.target.value)}
                        className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-text-primary font-medium outline-none focus:border-brand-primary"
                        autoFocus
                      />
                      <button 
                        onClick={handleSaveName}
                        className="w-10 h-10 bg-brand-accent text-white rounded-xl flex items-center justify-center shrink-0"
                      >
                        <Check size={18} />
                      </button>
                    </div>
                  ) : (
                    <>
                      <div>
                        <p className="text-sm text-gray-400 mb-0.5">Call me</p>
                        <p className="text-xl font-bold text-text-primary">{displayName}</p>
                      </div>
                      <button 
                        onClick={() => setIsEditingName(true)}
                        className="w-10 h-10 bg-bg-primary text-text-primary rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
                      >
                        <Edit2 size={18} />
                      </button>
                    </>
                  )}
                </div>
              </section>

              {/* past Orders Summary */}
              <section>
                <div className="flex items-center gap-2 mb-3">
                  <History size={20} className="text-brand-primary" />
                  <h3 className="text-lg font-bold text-text-primary">Recent Orders</h3>
                </div>
                <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm">
                  {isOrderPlaced && cartTotal > 0 ? (
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-bold text-text-primary">Active Order</p>
                        <p className="text-sm text-gray-500">Just now</p>
                      </div>
                      <span className="font-bold text-brand-accent">{currency} {(cartTotal * 1.12).toFixed(2)}</span>
                    </div>
                  ) : (
                    <div className="text-sm text-gray-500 text-center py-2">
                      No recent orders found.
                    </div>
                  )}
                </div>
              </section>

              {/* actions */}
              <section className="pt-2 pb-8 flex gap-3">
                <Button 
                  variant="outline" 
                  className="flex-1 font-bold h-[56px] rounded-2xl bg-white border-2 border-gray-100 flex items-center justify-center gap-2 text-text-primary hover:bg-gray-50"
                  onClick={() => alert("Feedback form opened!")}
                >
                  <MessageSquare size={20} className="text-gray-400" />
                  Feedback
                </Button>
                <Button 
                  variant="accent" 
                  className="flex-1 font-bold h-[56px] rounded-2xl flex items-center justify-center gap-2 shadow-[0_8px_24px_rgba(255,82,105,0.3)]"
                  onClick={() => alert("Waiter has been notified!")}
                >
                  <BellRing size={20} />
                  Call Waiter
                </Button>
              </section>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
