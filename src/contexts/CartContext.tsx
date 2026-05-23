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
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (item: Omit<CartItem, "id">) => {
    const newItem = { ...item, id: Math.random().toString(36).substring(2, 9) };
    setCart((prev) => [...prev, newItem]);
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
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
