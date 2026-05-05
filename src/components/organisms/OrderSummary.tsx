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
  const [showVoidModal, setShowVoidModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

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

  const handleVoidConfirm = () => {
    setShowVoidModal(false);
    // void order logic goes here
  };

  const handlePaymentConfirm = () => {
    setShowVoidModal(false);
    setShowPaymentModal(true);
  };

  // calculations
  const subtotal = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );
  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax;

  return (
    <>
    <div className="max-w-[900px] mx-auto bg-white rounded-[32px] shadow-[var(--kds-shadow-hover)] overflow-hidden font-inter border border-black/5 my-8 md:my-10">
      {/* header section */}
      <div className="bg-brand-secondary px-6 md:px-10 py-7 flex flex-col gap-3">
        {/* top row: title + validated badge always side by side */}
        <div className="flex items-start justify-between gap-3">
          <h2 className="h2 text-text-primary font-extrabold">Order #ORD-2847</h2>
          {/* status badge - anchored top-right on all screen sizes */}
          <Badge
            color="success"
            variant="solid"
            shape="rounded"
            className="b4 font-bold px-4 py-2 h-fit shrink-0 shadow-sm mt-1"
          >
            Validated
          </Badge>
        </div>

        {/* bottom row: table badge + timestamp */}
        <div className="flex items-center gap-3">
          {/* table badge */}
          <Badge
            color="accent"
            variant="ghost"
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
                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-brand-primary hover:opacity-90 transition-all shadow-sm active:scale-90"
                  >
                    <Plus size={15} className="text-text-primary" />
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
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 pt-8">
          <Button
            variant="accent"
            shape="rounded"
            onClick={() => setShowVoidModal(true)}
            className="flex-1 sm:flex-none sm:min-w-[200px] h-[56px] text-white font-bold text-base shadow-[0_8px_24px_rgba(255,82,105,0.22)] justify-center active:scale-[0.97] transition-transform"
          >
            Void Order
          </Button>
          <Button
            variant="primary"
            shape="rounded"
            onClick={() => setShowPaymentModal(true)}
            className="flex-1 sm:flex-none sm:min-w-[200px] h-[56px] font-bold text-base shadow-[0_8px_24px_rgba(255,215,122,0.35)] justify-center active:scale-[0.97] transition-transform"
          >
            Confirm Payment
          </Button>
        </div>
      </div>
    </div>

      {/* void order confirmation modal */}
      {showVoidModal && (
        <div
          className="fixed inset-0 z-[200] flex items-end md:items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200"
          onClick={() => setShowVoidModal(false)}
        >
          <div
            className="w-full max-w-[420px] bg-white rounded-[32px] border-[8px] border-bg-primary shadow-[var(--kds-shadow-hover)] overflow-hidden animate-in slide-in-from-bottom-4 md:zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* modal handle */}
            <div className="flex justify-center pt-4 pb-1">
              <div className="w-10 h-1.5 bg-black/10 rounded-full" />
            </div>

            <div className="p-6 md:p-8 flex flex-col items-center gap-4 text-center">
              {/* warning icon */}
              <div className="w-16 h-16 rounded-full bg-warning-secondary flex items-center justify-center shadow-sm">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-8 h-8 text-warning-primary animate-in zoom-in-75 duration-300"
                >
                  <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                  <line x1="12" y1="9" x2="12" y2="13" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
              </div>

              <div className="space-y-1.5">
                <h3 className="text-xl font-extrabold text-text-primary">Void this order?</h3>
                <p className="b4 text-text-secondary">
                  Order #ORD-2847 will be permanently cancelled. This action cannot be undone.
                </p>
              </div>

              {/* summary pill */}
              <div className="w-full bg-warning-secondary/40 rounded-2xl px-5 py-3 flex justify-between items-center">
                <span className="b4 text-text-secondary">Total to void</span>
                <span className="b3 font-bold text-warning-primary">₱ {total.toFixed(2)}</span>
              </div>

              {/* action btns */}
              <div className="flex gap-3 w-full pt-1">
                <Button
                  variant="ghost"
                  shape="rounded"
                  onClick={() => setShowVoidModal(false)}
                  className="flex-1 h-[50px] font-bold text-base justify-center border border-black/10"
                >
                  Cancel
                </Button>
                <Button
                  variant="accent"
                  shape="rounded"
                  onClick={handleVoidConfirm}
                  className="flex-1 h-[50px] text-white font-bold text-base shadow-[0_6px_18px_rgba(255,82,105,0.22)] justify-center"
                >
                  Yes, Void
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* payment success modal */}
      {showPaymentModal && (
        <div
          className="fixed inset-0 z-[200] flex items-end md:items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200"
          onClick={() => setShowPaymentModal(false)}
        >
          <div
            className="w-full max-w-[420px] bg-white rounded-[32px] border-[8px] border-bg-primary shadow-[var(--kds-shadow-hover)] overflow-hidden animate-in slide-in-from-bottom-4 md:zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* modal handle */}
            <div className="flex justify-center pt-4 pb-1">
              <div className="w-10 h-1.5 bg-black/10 rounded-full" />
            </div>

            <div className="p-6 md:p-8 flex flex-col items-center gap-4 text-center">
              {/* success icon */}
              <div className="w-16 h-16 rounded-full bg-success-secondary flex items-center justify-center shadow-sm">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-8 h-8 text-success-primary animate-in zoom-in-75 duration-300"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>

              <div className="space-y-1.5">
                <h3 className="text-xl font-extrabold text-text-primary">Payment Confirmed!</h3>
                <p className="b4 text-text-secondary">
                  Order #ORD-2847 has been paid and closed successfully.
                </p>
              </div>

              {/* receipt summary */}
              <div className="w-full bg-bg-primary rounded-2xl px-5 py-4 space-y-1.5 text-left">
                <div className="flex justify-between b4 text-text-secondary">
                  <span>Subtotal</span>
                  <span className="font-semibold text-text-primary">₱ {subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between b4 text-text-secondary">
                  <span>Tax ({(TAX_RATE * 100).toFixed(1)}%)</span>
                  <span className="font-semibold text-text-primary">₱ {tax.toFixed(2)}</span>
                </div>
                <div className="h-px bg-black/5 my-1" />
                <div className="flex justify-between b3 font-bold">
                  <span className="text-text-primary">Total Paid</span>
                  <span className="text-success-primary">₱ {total.toFixed(2)}</span>
                </div>
              </div>

              {/* close btn */}
              <Button
                variant="primary"
                shape="rounded"
                onClick={() => setShowPaymentModal(false)}
                className="w-full h-[52px] font-bold text-base shadow-[0_8px_24px_rgba(255,215,122,0.35)] justify-center"
              >
                Done
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default OrderSummary;
