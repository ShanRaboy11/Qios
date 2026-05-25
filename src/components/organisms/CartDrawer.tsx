"use client";

import React, { useState, useEffect } from "react";
import { useCart } from "@/contexts/CartContext";
import { ShoppingBag, X, Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { motion, AnimatePresence } from "framer-motion";
import { OrderReceiptModal } from "./OrderReceiptModal";

export const CartDrawer = () => {
  const {
    cart,
    itemCount,
    cartTotal,
    updateQuantity,
    removeFromCart,
    isCartOpen,
    setIsCartOpen,
  } = useCart();

  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  // Prevent background body scroll when the drawer layout is fully visible
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isCartOpen]);

  return (
    <>
      {/* Cart Drawer Wrapper */}
      <AnimatePresence>
        {isCartOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[200] flex justify-end bg-black/40 backdrop-blur-sm"
            onClick={() => setIsCartOpen(false)}
          >
            {/* Drawer Panel Container */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="w-full max-w-md h-full bg-white shadow-2xl flex flex-col rounded-l-[32px] md:rounded-l-[40px] overflow-hidden border-l border-black/5"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="bg-brand-secondary px-6 py-6 flex flex-col gap-3 relative font-brand-secondary shrink-0">
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="absolute top-4 right-4 p-2 hover:bg-black/5 rounded-full transition-colors active:scale-95 bg-white/50"
                  aria-label="Close cart"
                >
                  <X size={20} className="text-text-primary" />
                </button>

                <div className="flex items-start justify-between gap-3 pt-2">
                  <h2 className="text-xl md:text-2xl text-text-primary font-extrabold flex items-center gap-2 font-figtree">
                    <ShoppingBag className="text-brand-accent" size={24} />
                    Your Order
                  </h2>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-text-primary/60 font-medium font-inter">
                    {itemCount} {itemCount === 1 ? "item" : "items"} in cart
                  </span>
                </div>
              </div>

              {/* Cart Items List Area */}
              <div className="flex-1 overflow-y-auto px-6 py-4 style-scrollbar">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center py-12">
                    <ShoppingBag
                      size={40}
                      className="text-text-secondary/30 mb-3"
                    />
                    <p className="font-medium text-text-secondary font-inter">
                      Your cart is currently empty.
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-black/5">
                    {cart.map((item) => (
                      <div key={item.id} className="py-5 flex gap-4 font-inter">
                        {/* Item Thumbnail */}
                        <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl overflow-hidden bg-black/5 flex-shrink-0 border border-black/5">
                          <img
                            src={item.menuItem.imageUrl}
                            alt={item.menuItem.name}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Item Specifications */}
                        <div className="flex-1 flex flex-col min-w-0">
                          <div className="flex justify-between items-start gap-2">
                            <div className="space-y-1 min-w-0 flex-1">
                              <h3 className="font-bold text-text-primary line-clamp-1 font-figtree">
                                {item.menuItem.name}
                              </h3>
                              <div className="flex flex-wrap gap-1">
                                {item.selectedModifiers.length > 0 && (
                                  <span className="inline-block bg-brand-secondary/30 text-brand-primary text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                                    + {item.selectedModifiers.length} Add-ons
                                  </span>
                                )}
                                {item.selectedSize !== "s1" && (
                                  <span className="inline-block bg-info-secondary/30 text-info-primary text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                                    Large
                                  </span>
                                )}
                              </div>
                            </div>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="text-text-secondary/50 hover:text-error-primary transition-colors p-1 shrink-0"
                              title="Remove item"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>

                          {/* Item Quantity and Dynamic Price Controls */}
                          <div className="flex items-center justify-between mt-auto pt-2">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() =>
                                  updateQuantity(
                                    item.id,
                                    Math.max(1, item.quantity - 1),
                                  )
                                }
                                className="w-7 h-7 flex items-center justify-center rounded-lg border-2 border-black/10 hover:bg-black/5 transition-colors active:scale-90 disabled:opacity-45 disabled:cursor-not-allowed"
                                disabled={item.quantity <= 1}
                              >
                                <Minus
                                  size={14}
                                  className="text-text-secondary"
                                />
                              </button>
                              <span className="font-bold text-text-primary w-5 text-center font-figtree">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() =>
                                  updateQuantity(item.id, item.quantity + 1)
                                }
                                className="w-7 h-7 flex items-center justify-center rounded-lg bg-brand-primary hover:opacity-90 transition-all shadow-sm active:scale-90"
                              >
                                <Plus size={14} className="text-text-primary" />
                              </button>
                            </div>

                            <div className="font-bold text-text-primary text-right shrink-0 font-figtree">
                              ₱ {item.totalPrice.toFixed(2)}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Checkout Footer Structure */}
              <div className="bg-white px-6 py-6 rounded-t-[32px] border-t border-black/5 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] space-y-3 relative z-10 shrink-0 font-inter">
                <div className="flex justify-between items-center">
                  <span className="text-text-secondary">Subtotal</span>
                  <span className="font-bold text-text-primary">
                    ₱ {cartTotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-text-secondary">
                    Tax{" "}
                    <span className="text-xs text-text-secondary/70">
                      (12%)
                    </span>
                  </span>
                  <span className="font-bold text-text-primary">
                    ₱ {(cartTotal * 0.12).toFixed(2)}
                  </span>
                </div>
                <div className="h-px bg-black/5 w-full !my-4" />
                <div className="flex justify-between items-center pb-4">
                  <h3 className="text-lg font-extrabold text-text-primary font-figtree">
                    Total
                  </h3>
                  <h3 className="text-xl font-extrabold text-text-primary font-figtree">
                    ₱ {(cartTotal * 1.12).toFixed(2)}
                  </h3>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3">
                  <Button
                    variant="accent"
                    shape="rounded"
                    disabled={cart.length === 0}
                    className="flex-1 h-[56px] font-bold text-base shadow-lg justify-center active:scale-[0.97] transition-all disabled:opacity-50"
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

      {/* Checkout Confirmation Modal Layer */}
      <AnimatePresence>
        {isConfirmOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[250] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              transition={{ type: "spring", duration: 0.3 }}
              className="bg-white rounded-[24px] p-6 max-w-[320px] w-full text-center shadow-2xl border border-black/5 relative z-[260] font-inter"
            >
              <h3 className="text-lg font-extrabold text-text-primary mb-2 font-figtree">
                Checkout Order?
              </h3>
              <p className="text-sm text-text-secondary mb-6">
                Are you ready to place this order? Payment will be made at the
                counter.
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
                  onClick={() => {
                    setIsConfirmOpen(false);
                    setIsCartOpen(false); // Fixed: Changed from setIsOpen to matches your prop values
                    setTimeout(() => setIsReceiptOpen(true), 250);
                  }}
                >
                  Confirm
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Order Receipt Modal View */}
      <AnimatePresence>
        {isReceiptOpen && (
          <OrderReceiptModal
            onClose={() => setIsReceiptOpen(false)}
            orderId={`SIBAT-${Math.floor(1000 + Math.random() * 9000)}`} // Configured with consistent order prefix string references
          />
        )}
      </AnimatePresence>
    </>
  );
};
