"use client"; {/* ibetter q pa i2 */}

import React, { useState } from "react";
import { Plus, Minus, PlusCircle } from "lucide-react";
import { cn } from "@/lib/utils";

// types
interface OrderItem {
  id: string;
  name: string;
  modifier: string;
  modifierColor: string;
  price: number;
  quantity: number;
}

// mock data
const INITIAL_ITEMS: OrderItem[] = [
  {
    id: "1",
    name: "Pad Thai Noodles",
    modifier: "Extra Spicy",
    modifierColor: "bg-[#FFE4E8] text-[#FF5269]",
    price: 100,
    quantity: 1,
  },
  {
    id: "2",
    name: "Green Curry Bowl",
    modifier: "Gluten - Free",
    modifierColor: "bg-[#E0FAD6] text-[#1FAD66]",
    price: 100,
    quantity: 1,
  },
  {
    id: "3",
    name: "Mango Sticky Rice",
    modifier: "Extra Coconut Drizzle",
    modifierColor: "bg-[#F3E8FF] text-[#A855F7]",
    price: 100,
    quantity: 1,
  },
  {
    id: "4",
    name: "Thai Iced Tea",
    modifier: "Less Sweet",
    modifierColor: "bg-[#E0F2FE] text-[#0EA5E9]",
    price: 100,
    quantity: 1,
  },
];

const OrderSummary = () => {
  // state
  const [items, setItems] = useState<OrderItem[]>(INITIAL_ITEMS);

  // handlers
  const updateQuantity = (id: string, delta: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item,
      ),
    );
  };

  // calculations
  const subtotal = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );
  const tax = subtotal * 0.085;
  const total = subtotal + tax;

  return (
    <div className="max-w-[900px] mx-auto bg-white rounded-3xl shadow-xl overflow-hidden font-inter border border-black/5 my-10">
      {/* header section */}
      <div className="bg-brand-secondary p-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-3">
          <h2 className="h2 text-text-primary">Order #ORD-2847</h2>
          <div className="flex items-center gap-3">
            <span className="bg-white/40 text-brand-accent b4 font-bold px-4 py-1 rounded-full border border-white/20">
              Table 12
            </span>
            <span className="b4 text-text-primary/60 font-medium">
              Today, 7:34 PM
            </span>
          </div>
        </div>
        <div className="bg-success-primary text-white b4 font-medium px-4 py-2 rounded-xl shadow-sm h-fit">
          Validated - ready for payment
        </div>
      </div>

      {/* items list section */}
      <div className="p-6 md:p-10 space-y-2">
        <h4 className="b3 text-text-secondary uppercase tracking-widest text-[13px] mb-4">
          Items
        </h4>

        <div className="divide-y divide-black/5">
          {items.map((item) => (
            <div
              key={item.id}
              className="py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-2">
                <h3 className="b2 font-bold text-text-primary text-[18px]">
                  {item.name}
                </h3>
                <span
                  className={cn(
                    "inline-block b4 font-bold px-3 py-1 rounded-full",
                    item.modifierColor,
                  )}
                >
                  {item.modifier}
                </span>
              </div>

              <div className="flex items-center gap-8 md:gap-16">
                {/* quantity controls */}
                <div className="flex items-center gap-4 bg-white">
                  <button
                    onClick={() => updateQuantity(item.id, -1)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg border border-black/10 hover:bg-black/5 transition-colors"
                  >
                    <Minus size={16} className="text-text-secondary" />
                  </button>
                  <span className="b2 font-bold text-text-primary w-4 text-center">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.id, 1)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-brand-primary text-text-primary hover:opacity-90 transition-all shadow-sm"
                  >
                    <Plus size={16} />
                  </button>
                </div>

                {/* price */}
                <div className="b2 font-bold text-text-primary min-w-[100px] text-right">
                  ₱ {(item.price * item.quantity).toFixed(2)}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* add item row */}
        <button className="w-full flex items-center gap-3 py-6 text-text-primary/60 hover:text-text-primary transition-colors border-t border-black/5 group">
          <PlusCircle
            size={24}
            className="text-text-primary group-hover:scale-110 transition-transform"
          />
          <span className="b2">Add item</span>
        </button>
      </div>

      {/* summary section */}
      <div className="px-6 md:px-10 pb-10 space-y-4">
        <div className="h-px bg-black/10 w-full mb-6" />

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="b2 text-text-secondary">Subtotal</span>
            <span className="b2 font-bold text-text-primary">
              ₱ {subtotal.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="b2 text-text-secondary">
              Tax <span className="b5">(8.5%)</span>
            </span>
            <span className="b2 font-bold text-text-primary">
              ₱ {tax.toFixed(2)}
            </span>
          </div>
        </div>

        <div className="h-px bg-black/10 w-full my-4" />

        <div className="flex justify-between items-center">
          <h3 className="h3 text-text-primary">Total</h3>
          <h3 className="h3 text-text-primary">₱ {total.toFixed(2)}</h3>
        </div>

        {/* action buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-10">
          <button className="w-full sm:w-auto min-w-[240px] bg-brand-accent hover:opacity-90 text-white h-16 rounded-[32px] b2 font-bold transition-all active:scale-95 shadow-lg shadow-brand-accent/20">
            Void Order
          </button>
          <button className="w-full sm:w-auto min-w-[240px] bg-brand-primary hover:opacity-90 text-text-primary h-16 rounded-[32px] b2 font-bold transition-all active:scale-95 shadow-lg shadow-brand-primary/20">
            Confirm Payment
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
