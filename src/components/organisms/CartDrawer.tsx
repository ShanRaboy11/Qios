"use client";

import React, { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { ShoppingBag, X, Minus, Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/atoms/Button";
import { motion, AnimatePresence } from "framer-motion";
import { useParams } from "next/navigation";
import { OrderReceiptModal } from "./OrderReceiptModal";
import { placeOrder } from "@/lib/actions/order";

export const CartDrawer = () => {
  const { cart, itemCount, cartTotal, updateQuantity, removeFromCart, clearCart } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [placedOrderId, setPlacedOrderId] = useState<string | null>(null);
  const [cartSnapshot, setCartSnapshot] = useState(cart);
  const [cartTotalSnapshot, setCartTotalSnapshot] = useState(cartTotal);

  const params = useParams();
  const tenantId = typeof params?.id === "string" ? params.id : "";

  if (itemCount === 0 && !isReceiptOpen && !isConfirmOpen) return null;

  return (
    <>
      {/* Floating Cart Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 md:bottom-10 right-6 md:right-10 z-[100] bg-brand-accent text-white p-4 rounded-full shadow-[0_8px_30px_rgba(255,82,105,0.3)] hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center group"
      >
        <div className="relative">
          <ShoppingBag size={28} />
          <span className="absolute -top-2 -right-2 bg-white text-brand-accent text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-sm">
            {itemCount}
          </span>
        </div>
      </button>

      {/* Cart Drawer Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[200] flex justify-end bg-black/40 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          >
            {/* Drawer Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="w-full max-w-md h-full bg-white shadow-2xl flex flex-col rounded-l-[32px] md:rounded-l-[40px] overflow-hidden border-l border-black/5"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
            <div className="bg-brand-secondary px-6 py-6 flex flex-col gap-3 relative">
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 p-2 hover:bg-black/5 rounded-full transition-colors active:scale-95 bg-white/50"
              >
                <X size={20} className="text-text-primary" />
              </button>
              
              <div className="flex items-start justify-between gap-3 pt-2">
                <h2 className="h2 text-text-primary font-extrabold flex items-center gap-2">
                  <ShoppingBag className="text-brand-accent" size={24} />
                  Your Order
                </h2>
              </div>
              <div className="flex items-center gap-3">
                <span className="b4 text-text-primary/60 font-medium">
                  {itemCount} {itemCount === 1 ? 'item' : 'items'} in cart
                </span>
              </div>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              <div className="divide-y divide-black/5">
                {cart.map((item) => (
                  <div key={item.id} className="py-5 flex gap-4">
                    {/* Item Image */}
                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl overflow-hidden bg-black/5 flex-shrink-0 border border-black/5">
                      <img
                        src={item.menuItem.imageUrl}
                        alt={item.menuItem.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Item Details */}
                    <div className="flex-1 flex flex-col min-w-0">
                      <div className="flex justify-between items-start gap-2">
                        <div className="space-y-1 min-w-0 flex-1">
                          <h3 className="b1 font-bold text-text-primary line-clamp-1">{item.menuItem.name}</h3>
                          {item.selectedOptions.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1">
                              {item.selectedOptions.map((o) => (
                                <span
                                  key={o.id}
                                  className="inline-block bg-brand-secondary/30 text-brand-primary text-[10px] font-bold px-2 py-0.5 rounded-pill uppercase tracking-wider"
                                >
                                  {o.name}
                                </span>
                              ))}
                            </div>
                          )}
                          {item.specialInstructions && (
                            <p className="b5 text-text-secondary/60 line-clamp-1 italic">
                              "{item.specialInstructions}"
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-text-secondary/50 hover:text-error-primary transition-colors p-1 shrink-0"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>

                      {/* Controls and Price */}
                      <div className="flex items-center justify-between mt-auto pt-2">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                            className="w-7 h-7 flex items-center justify-center rounded-lg border-2 border-black/10 hover:bg-black/5 transition-colors active:scale-90"
                            disabled={item.quantity <= 1}
                          >
                            <Minus size={14} className="text-text-secondary" />
                          </button>
                          <span className="b2 font-bold text-text-primary w-5 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-7 h-7 flex items-center justify-center rounded-lg bg-brand-primary hover:opacity-90 transition-all shadow-sm active:scale-90"
                          >
                            <Plus size={14} className="text-text-primary" />
                          </button>
                        </div>
                        
                        <div className="b2 font-bold text-text-primary text-right shrink-0">
                          ₱ {item.totalPrice.toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Checkout Footer */}
            <div className="bg-white px-6 py-6 rounded-t-[32px] border-t border-black/5 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] space-y-3 relative z-10">
              <div className="flex justify-between items-center">
                <span className="b2 text-text-secondary">Subtotal</span>
                <span className="b2 font-bold text-text-primary">₱ {cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="b2 text-text-secondary">
                  Tax <span className="b5 text-text-secondary/70">(12%)</span>
                </span>
                <span className="b2 font-bold text-text-primary">₱ {(cartTotal * 0.12).toFixed(2)}</span>
              </div>
              <div className="h-px bg-black/8 w-full !my-4" />
              <div className="flex justify-between items-center pb-4">
                <h3 className="h3 text-text-primary font-extrabold">Total</h3>
                <h3 className="h3 text-text-primary font-extrabold">
                  ₱ {(cartTotal * 1.12).toFixed(2)}
                </h3>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3">
                <Button
                  variant="primary"
                  shape="rounded"
                  className="flex-1 h-[56px] font-bold text-base shadow-[0_8px_24px_rgba(255,215,122,0.35)] justify-center active:scale-[0.97] transition-transform"
                  onClick={() => setIsConfirmOpen(true)}
                >
                  Checkout
                </Button>
              </div>
            </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Checkout Confirmation Modal */}
      <AnimatePresence>
        {isConfirmOpen && (
          <div className="fixed inset-0 z-[250] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className="bg-white rounded-[24px] p-6 max-w-[320px] w-full text-center shadow-2xl border-[8px] border-black/5 relative z-[260]"
            >
              <h3 className="h3 font-extrabold text-text-primary mb-2">Checkout Order?</h3>
              <p className="b3 text-text-secondary mb-6">
                Are you ready to place this order? Payment will be made at the counter.
              </p>
              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  shape="rounded"
                  className="flex-1 font-bold h-12" 
                  onClick={() => setIsConfirmOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  variant="accent" 
                  shape="rounded"
                  className="flex-1 font-bold text-white shadow-md h-12 justify-center"
                  disabled={isSubmitting}
                  onClick={async () => {
                    if (!tenantId) return;
                    setIsSubmitting(true);

                    const result = await placeOrder(tenantId, cart, cartTotal);
                    setIsSubmitting(false);

                    if (result.success && result.qrHash) {
                      // Capture snapshot BEFORE clearing the cart
                      setCartSnapshot([...cart]);
                      setCartTotalSnapshot(cartTotal);
                      setPlacedOrderId(result.qrHash);
                      setIsConfirmOpen(false);
                      setIsOpen(false);
                      clearCart();
                      setTimeout(() => setIsReceiptOpen(true), 200);
                    } else {
                      alert(result.error || "Failed to place order.");
                    }
                  }}
                >
                  {isSubmitting ? "Processing..." : "Confirm"}
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Order Receipt Modal */}
      <AnimatePresence>
        {isReceiptOpen && placedOrderId && (
          <OrderReceiptModal
            onClose={() => setIsReceiptOpen(false)}
            orderId={placedOrderId}
            cartSnapshot={cartSnapshot}
            cartTotal={cartTotalSnapshot}
          />
        )}
      </AnimatePresence>
    </>
  );
};
