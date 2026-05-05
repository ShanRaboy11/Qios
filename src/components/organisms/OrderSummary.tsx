"use client";

import React, { useState } from "react";
import { Plus, Minus, PlusCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/atoms/Button";
import { Badge } from "@/components/atoms/Badge";

// types
interface OrderItem {
  id: string;
  name: string;
  modifier: string;
  modifierColor: "error" | "success" | "secondary" | "info";
  price: number;
  quantity: number;
}

// mock data
const INITIAL_ITEMS: OrderItem[] = [
  {
    id: "1",
    name: "Pad Thai Noodles",
    modifier: "Extra Spicy",
    modifierColor: "error",
    price: 100,
    quantity: 1,
  },
  {
    id: "2",
    name: "Green Curry Bowl",
    modifier: "Gluten - Free",
    modifierColor: "success",
    price: 100,
    quantity: 1,
  },
  {
    id: "3",
    name: "Mango Sticky Rice",
    modifier: "Extra Coconut Drizzle",
    modifierColor: "secondary",
    price: 100,
    quantity: 1,
  },
  {
    id: "4",
    name: "Thai Iced Tea",
    modifier: "Less Sweet",
    modifierColor: "info",
    price: 100,
    quantity: 1,
  },
];

const TAX_RATE = 0.085;

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
  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax;

  return (
    <div className="max-w-[900px] mx-auto bg-white rounded-[32px] shadow-[var(--kds-shadow-hover)] overflow-hidden font-inter border border-black/5 my-8 md:my-10">
      {/* header section */}
      <div className="bg-brand-secondary px-6 md:px-10 py-7 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2.5">
          <h2 className="h2 text-text-primary font-extrabold">Order #ORD-2847</h2>
          <div className="flex items-center gap-3">
            {/* table badge */}
            <Badge
              color="accent"
              variant="subtle"
              shape="pill"
              className="b4 font-bold px-4 py-1"
            >
              Table 12
            </Badge>
            <span className="b4 text-text-primary/60 font-medium">
              Today, 7:34 PM
            </span>
          </div>
        </div>

        {/* status badge */}
        <Badge
          color="success"
          variant="solid"
          shape="rounded"
          className="b4 font-bold px-4 py-2 h-fit self-start sm:self-auto shadow-sm"
        >
          Validated
        </Badge>
      </div>

      {/* items list section */}
      <div className="px-6 md:px-10 pt-8 pb-4 space-y-1">
        <h4 className="b3 font-bold text-text-secondary uppercase tracking-widest text-[12px] mb-5">
          Items
        </h4>

        <div className="divide-y divide-black/5">
          {items.map((item) => (
            <div
              key={item.id}
              className="py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              {/* item name + modifier */}
              <div className="space-y-2 min-w-0 flex-1">
                <h3 className="b1 font-bold text-text-primary">{item.name}</h3>
                <Badge
                  color={item.modifierColor}
                  variant="subtle"
                  shape="pill"
                  className="b5 font-bold px-3 py-1"
                >
                  {item.modifier}
                </Badge>
              </div>

              <div className="flex items-center gap-6 md:gap-12 shrink-0">
                {/* quantity controls */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => updateQuantity(item.id, -1)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg border-2 border-black/10 hover:bg-black/5 transition-colors active:scale-90"
                  >
                    <Minus size={15} className="text-text-secondary" />
                  </button>
                  <span className="b2 font-bold text-text-primary w-5 text-center">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.id, 1)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-brand-primary text-text-tertiary hover:opacity-90 transition-all shadow-sm active:scale-90"
                  >
                    <Plus size={15} />
                  </button>
                </div>

                {/* item total price */}
                <div className="b2 font-bold text-text-primary min-w-[90px] text-right">
                  ₱ {(item.price * item.quantity).toFixed(2)}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* add item row */}
        <button className="w-full flex items-center gap-3 py-5 text-text-secondary hover:text-text-primary transition-colors border-t border-black/5 group">
          <PlusCircle
            size={22}
            className="text-text-secondary group-hover:text-brand-primary group-hover:scale-110 transition-all duration-200"
          />
          <span className="b2 font-medium group-hover:text-brand-primary transition-colors">
            Add item
          </span>
        </button>
      </div>

      {/* summary / totals section */}
      <div className="px-6 md:px-10 pb-8 md:pb-10 space-y-3">
        <div className="h-px bg-black/8 w-full mb-5" />

        {/* subtotal row */}
        <div className="flex justify-between items-center">
          <span className="b2 text-text-secondary">Subtotal</span>
          <span className="b2 font-bold text-text-primary">
            ₱ {subtotal.toFixed(2)}
          </span>
        </div>

        {/* tax row */}
        <div className="flex justify-between items-center">
          <span className="b2 text-text-secondary">
            Tax{" "}
            <span className="b5 text-text-secondary/70">
              ({(TAX_RATE * 100).toFixed(1)}%)
            </span>
          </span>
          <span className="b2 font-bold text-text-primary">
            ₱ {tax.toFixed(2)}
          </span>
        </div>

        <div className="h-px bg-black/8 w-full !my-5" />

        {/* total row */}
        <div className="flex justify-between items-center">
          <h3 className="h3 text-text-primary font-extrabold">Total</h3>
          <h3 className="h3 text-text-primary font-extrabold">
            ₱ {total.toFixed(2)}
          </h3>
        </div>

        {/* action buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
          <Button
            variant="accent"
            shape="rounded"
            className={cn(
              "w-full sm:min-w-[220px] h-[60px] text-white font-bold text-base md:text-[17px]",
              "shadow-[0_8px_24px_rgba(255,82,105,0.22)] justify-center active:scale-[0.97] transition-transform",
            )}
          >
            Void Order
          </Button>
          <Button
            variant="primary"
            shape="rounded"
            className={cn(
              "w-full sm:min-w-[220px] h-[60px] font-bold text-base md:text-[17px]",
              "shadow-[var(--kds-shadow-gold)] justify-center active:scale-[0.97] transition-transform",
            )}
          >
            Confirm Payment
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
