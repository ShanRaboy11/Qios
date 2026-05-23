"use client";

import React, { useRef } from "react";
import QRCode from "react-qr-code";
import { Download, X } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/atoms/Button";
import { CartItem } from "@/contexts/CartContext";

interface OrderReceiptModalProps {
  onClose: () => void;
  orderId?: string;
  cartSnapshot: CartItem[];
  cartTotal: number;
}

export const OrderReceiptModal = ({
  onClose,
  orderId = "QIOS-9921",
  cartSnapshot,
  cartTotal,
}: OrderReceiptModalProps) => {
  const receiptRef = useRef<HTMLDivElement>(null);

  const JaggedEdge = () => (
    <div
      className="h-3 w-full flex overflow-hidden -mt-px relative z-10"
      aria-hidden="true"
    >
      {Array.from({ length: 50 }).map((_, i) => (
        <div
          key={i}
          className="w-4 h-full bg-[#FFDC72] shrink-0"
          style={{ clipPath: "polygon(0 0, 100% 0, 50% 100%)" }}
        />
      ))}
    </div>
  );

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 p-3 bg-white/20 hover:bg-white/40 rounded-full transition-colors z-[310] text-white"
      >
        <X size={24} />
      </button>

      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 50, scale: 0.95 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="w-full max-w-[360px] flex flex-col items-center relative"
      >
        {/* Receipt Body */}
        <div
          ref={receiptRef}
          className="bg-[#FFDC72] w-full rounded-t-[24px] px-6 pt-8 pb-6 flex flex-col relative"
        >
          {/* Order number + time */}
          <div className="flex flex-col items-center gap-4 mb-8">
            <div className="flex items-center gap-1.5 text-black/60 b5 font-medium">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              Today,{" "}
              {new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
            <div className="bg-[#FF5269] text-white px-6 py-2.5 rounded-full font-inter font-bold text-[16px] shadow-sm">
              Order #{orderId}
            </div>
          </div>

          {/* QR Code */}
          <div className="bg-white p-5 rounded-[20px] shadow-sm mb-8 flex items-center justify-center border border-black/5 w-full aspect-square relative mx-auto max-w-[240px]">
            <QRCode
              value={orderId}
              size={256}
              style={{ height: "auto", maxWidth: "100%", width: "100%" }}
            />
          </div>

          {/* Order Summary */}
          <div className="space-y-3 mb-6">
            {cartSnapshot.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-start gap-4 border-b border-black/10 border-dashed pb-3 last:border-0 last:pb-0"
              >
                <div className="b2 font-medium text-[#2D2D2D] leading-tight">
                  {item.quantity}× {item.menuItem.name}
                  {item.selectedOptions.length > 0 && (
                    <div className="text-[11px] text-black/50 mt-0.5 font-normal">
                      {item.selectedOptions.map((o) => o.name).join(", ")}
                    </div>
                  )}
                  {item.specialInstructions && (
                    <div className="text-[11px] text-black/40 mt-0.5 italic">
                      &ldquo;{item.specialInstructions}&rdquo;
                    </div>
                  )}
                </div>
                <div className="b2 font-bold text-[#2D2D2D] shrink-0">
                  ₱{item.totalPrice.toFixed(2)}
                </div>
              </div>
            ))}
          </div>

          <div className="h-px bg-black/20 w-full mb-4" />

          {/* Total */}
          <div className="flex justify-between items-center mb-8">
            <h3 className="h3 font-bold text-[#2D2D2D]">Total</h3>
            <h3 className="h3 font-bold text-[#2D2D2D]">
              ₱{(cartTotal * 1.12).toFixed(2)}
            </h3>
          </div>

          <Button
            variant="primary"
            shape="rounded"
            className="w-full bg-[#FF5269] hover:bg-[#FF3B55] text-white h-[56px] text-[16px] font-bold justify-center gap-2 shadow-[0_8px_20px_rgba(255,82,105,0.2)] active:scale-[0.98] transition-transform"
            onClick={() =>
              alert("Receipt download functionality to be implemented.")
            }
          >
            <Download size={20} />
            Download Receipt
          </Button>
        </div>

        <JaggedEdge />
      </motion.div>
    </div>
  );
};
