"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { MenuItemData } from "@/components/organisms/MenuCatalog";

// Snapshot of a selected modifier option stored inside a cart item
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
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const addToCart = (newItemInput: Omit<CartItem, "id">) => {
    setCart((prevCart) => {
      // Find out if an identical item configuration already exists in the bucket arrays
      const existingItemIndex = prevCart.findIndex(
        (item) =>
          item.menuItem.id === newItemInput.menuItem.id &&
          item.selectedSize === newItemInput.selectedSize &&
          JSON.stringify(item.selectedModifiers.sort()) ===
            JSON.stringify(newItemInput.selectedModifiers.sort()) &&
          item.specialInstructions.trim() ===
            newItemInput.specialInstructions.trim(),
      );

      if (existingItemIndex > -1) {
        // Safe duplication aggregation route
        return prevCart.map((item, idx) => {
          if (idx === existingItemIndex) {
            const updatedQuantity = item.quantity + newItemInput.quantity;
            // Deriving unit price directly using safe immutability to bypass fractional division bugs
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

      // Fresh unique entry instantiation route
      const cleanUniqueId = `${newItemInput.menuItem.id}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
      return [...prevCart, { ...newItemInput, id: cleanUniqueId }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return; // Core structural guard block

    setCart((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          // Recalculate price: (base + modifiers) * new quantity
          const basePerUnit = item.menuItem.price;
          const modifiersPerUnit = item.selectedOptions.reduce(
            (sum, o) => sum + o.additionalPrice,
            0,
          );
          return {
            ...item,
            quantity,
            totalPrice: (basePerUnit + modifiersPerUnit) * quantity,
          };
        }
        return item;
      }),
    );
  };

  const clearCart = () => setCart([]);

  // Compute derived state summaries cleanly
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
