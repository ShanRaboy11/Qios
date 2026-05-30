"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { MenuItemData } from "@/components/organisms/MenuCatalog";

// snapshot of a selected modifier option stored inside a cart item
export interface SelectedModifierOption {
  id: string;
  modifierGroupId: string;
  modifierGroupName: string;
  name: string;
  additionalPrice: number;
}

export interface CartItem {
  id: string; // unique cart item id (client-side)
  menuItem: MenuItemData;
  quantity: number;
  selectedOptions: SelectedModifierOption[];
  specialInstructions: string;
  totalPrice: number; // (basePrice + sum of additionalPrices) * quantity
}

export type CustomerOrderStatus =
  | "pending"
  | "preparing"
  | "ready"
  | "served"
  | "cancelled";

export type CustomerPaymentStatus = "unpaid" | "paid";

export interface ActiveOrderTracking {
  orderId: string;
  qrHash: string;
  tenantId: string;
  status: CustomerOrderStatus;
  paymentStatus: CustomerPaymentStatus;
  totalPrice: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, "id">) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  itemCount: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isOrderPlaced: boolean;
  setIsOrderPlaced: (placed: boolean) => void;
  activeOrder: ActiveOrderTracking | null;
  setActiveOrder: (order: ActiveOrderTracking | null) => void;
  clearActiveOrder: () => void;
  currency: string;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children, currency = "PHP" }: { children: ReactNode, currency?: string }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isOrderPlaced, setIsOrderPlaced] = useState(false);
  const [activeOrder, setActiveOrder] = useState<ActiveOrderTracking | null>(
    null,
  );

  const addToCart = (newItemInput: Omit<CartItem, "id">) => {
    setCart((prevCart) => {
      // find if an identical item configuration already exists
      const existingItemIndex = prevCart.findIndex(
        (item) =>
          item.menuItem.id === newItemInput.menuItem.id &&
          JSON.stringify(
            item.selectedOptions.map((o) => o.id).sort(),
          ) ===
            JSON.stringify(
              newItemInput.selectedOptions.map((o) => o.id).sort(),
            ) &&
          item.specialInstructions.trim() ===
            newItemInput.specialInstructions.trim(),
      );

      if (existingItemIndex > -1) {
        return prevCart.map((item, idx) => {
          if (idx === existingItemIndex) {
            const updatedQuantity = item.quantity + newItemInput.quantity;
            const unitPrice = newItemInput.totalPrice / newItemInput.quantity;
            return {
              ...item,
              quantity: updatedQuantity,
              totalPrice: Number((unitPrice * updatedQuantity).toFixed(2)),
            };
          }
          return item;
        });
      }

      const cleanUniqueId = `${newItemInput.menuItem.id}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
      return [...prevCart, { ...newItemInput, id: cleanUniqueId }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return;

    setCart((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const basePerUnit = item.menuItem.price;
          const modifiersPerUnit = item.selectedOptions.reduce(
            (sum, o) => sum + o.additionalPrice,
            0,
          );
          return {
            ...item,
            quantity: newQuantity,
            totalPrice: Number(
              ((basePerUnit + modifiersPerUnit) * newQuantity).toFixed(2),
            ),
          };
        }
        return item;
      }),
    );
  };

  const clearCart = () => setCart([]);
  const clearActiveOrder = () => {
    setActiveOrder(null);
    setIsOrderPlaced(false);
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.totalPrice, 0);
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        itemCount,
        isCartOpen,
        setIsCartOpen,
        isOrderPlaced,
        setIsOrderPlaced,
        activeOrder,
        setActiveOrder,
        clearActiveOrder,
        currency,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
