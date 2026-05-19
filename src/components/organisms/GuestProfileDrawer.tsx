"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, User, Edit2, BellRing, MessageSquare, History, Check } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { cn } from "@/lib/utils";

interface GuestProfileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GuestProfileDrawer = ({ isOpen, onClose }: GuestProfileDrawerProps) => {
  const [displayName, setDisplayName] = useState("Name");
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(displayName);

  const handleSaveName = () => {
    setDisplayName(tempName || "Guest");
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
          {/* Drawer Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="w-full max-w-md h-full bg-[#FFF9F2] shadow-2xl flex flex-col rounded-l-[32px] md:rounded-l-[40px] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-[#FFC670] px-6 py-6 pb-8 flex flex-col gap-3 relative rounded-bl-[40px]">
              <button
                onClick={onClose}
                className="absolute top-6 right-6 w-10 h-10 bg-white/40 hover:bg-white/60 rounded-full flex items-center justify-center transition-colors"
              >
                <X size={20} className="text-[#2D2D2D]" />
              </button>
              
              <div className="flex items-center gap-4 pt-2">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-inner">
                  <User size={32} className="text-[#FFC670]" />
                </div>
                <div>
                  <span className="text-sm font-bold text-gray-700 uppercase tracking-widest">Guest Session</span>
                  <h2 className="text-2xl font-black text-[#2D2D2D]">My Profile</h2>
                </div>
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8">
              
              {/* Name Edit Section */}
              <section>
                <h3 className="text-lg font-bold text-[#2D2D2D] mb-3">Display Name</h3>
                <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between">
                  {isEditingName ? (
                    <div className="flex items-center gap-2 w-full">
                      <input 
                        type="text" 
                        value={tempName}
                        onChange={(e) => setTempName(e.target.value)}
                        className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-[#2D2D2D] font-medium outline-none focus:border-[#FFC670]"
                        autoFocus
                      />
                      <button 
                        onClick={handleSaveName}
                        className="w-10 h-10 bg-[#FF5269] text-white rounded-xl flex items-center justify-center shrink-0"
                      >
                        <Check size={18} />
                      </button>
                    </div>
                  ) : (
                    <>
                      <div>
                        <p className="text-sm text-gray-400 mb-0.5">Call me</p>
                        <p className="text-xl font-bold text-[#2D2D2D]">{displayName}</p>
                      </div>
                      <button 
                        onClick={() => setIsEditingName(true)}
                        className="w-10 h-10 bg-[#FFF9F2] text-[#2D2D2D] rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
                      >
                        <Edit2 size={18} />
                      </button>
                    </>
                  )}
                </div>
              </section>

              {/* Past Orders Summary */}
              <section>
                <div className="flex items-center gap-2 mb-3">
                  <History size={20} className="text-[#FFC670]" />
                  <h3 className="text-lg font-bold text-[#2D2D2D]">Recent Orders</h3>
                </div>
                <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-3">
                    <div>
                      <p className="font-bold text-[#2D2D2D]">#ORD-2847</p>
                      <p className="text-sm text-gray-500">Today, 10:42 AM</p>
                    </div>
                    <span className="font-bold text-[#FF5269]">₱1,050.00</span>
                  </div>
                  <div className="flex items-center justify-between pb-1">
                    <div>
                      <p className="font-bold text-[#2D2D2D]">#ORD-2840</p>
                      <p className="text-sm text-gray-500">Today, 9:15 AM</p>
                    </div>
                    <span className="font-bold text-[#FF5269]">₱320.00</span>
                  </div>
                </div>
              </section>

              {/* Actions */}
              <section className="pt-2 pb-8 flex gap-3">
                <Button 
                  variant="outline" 
                  className="flex-1 font-bold h-[56px] rounded-2xl bg-white border-2 border-gray-100 flex items-center justify-center gap-2 text-[#2D2D2D] hover:bg-gray-50"
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
