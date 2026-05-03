"use client";

import React, { useState } from "react";
import { X, Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

// types
interface Modifier {
  id: string;
  name: string;
  description: string;
  price: number;
}

interface Size {
  id: string;
  name: string;
  description: string;
  price: number;
}

// mock data
const MODIFIERS: Modifier[] = [
  {
    id: "m1",
    name: "Extra Rice",
    description: "Pan-fried crispy tofu cubes",
    price: 35,
  },
  {
    id: "m2",
    name: "French Fries",
    description: "Pan-fried crispy tofu cubes",
    price: 35,
  },
  {
    id: "m3",
    name: "Spaghetti",
    description: "Pan-fried crispy tofu cubes",
    price: 35,
  },
  {
    id: "m4",
    name: "Drinks",
    description: "Pan-fried crispy tofu cubes",
    price: 35,
  },
];

const SIZES: Size[] = [
  {
    id: "s1",
    name: "Regular",
    description: "Gentle kick, great for sensitive palates",
    price: 0,
  },
  {
    id: "s2",
    name: "Large",
    description: "Gentle kick, great for sensitive palates",
    price: 0,
  },
];

const OrderEditor = () => {
  // state
  const [quantity, setQuantity] = useState(1);
  const [selectedModifiers, setSelectedModifiers] = useState<string[]>([]);
  const [selectedSize, setSelectedSize] = useState<string>("s2");
  const [instructions, setInstructions] = useState("");

  // handlers
  const toggleModifier = (id: string) => {
    setSelectedModifiers((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id],
    );
  };

  const basePrice = 500;
  const modifiersTotal = selectedModifiers.length * 35;
  const totalPrice = (basePrice + modifiersTotal) * quantity;

  return (
    <div className="max-w-[700px] mx-auto bg-white rounded-[48px] border-[12px] border-bg-primary shadow-2xl overflow-hidden relative font-inter my-8">
      {/* drag handle bar */}
      <div className="flex justify-center pt-4 pb-2">
        <div className="w-16 h-1.5 bg-brand-accent/30 rounded-full" />
      </div>

      <div className="p-4 md:p-6 space-y-6">
        {/* hero product card */}
        <div className="relative bg-brand-secondary rounded-[40px] p-8 md:p-12 overflow-hidden flex items-center justify-between min-h-[280px]">
          <div className="relative z-10 space-y-3 max-w-[60%]">
            <span className="inline-block bg-warning-primary text-white text-[11px] font-bold px-3 py-1.5 rounded-lg uppercase tracking-wider shadow-sm">
              Bestseller
            </span>
            <h1 className="h1 text-text-primary">Chicken Adobo</h1>
            <p className="b2 text-text-primary/70">
              Slow-cooked in vinegar, soy, & garlic
            </p>
          </div>

          {/* product image */}
          <div className="absolute right-[-10%] md:right-0 w-[260px] md:w-[320px] h-full flex items-center justify-center pointer-events-none">
            <img
              src="https://images.unsplash.com/photo-1541544741938-0af808871cc0?q=80&w=1000&auto=format&fit=crop"
              alt="Chicken Adobo"
              className="w-full h-auto object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.3)] rotate-[-6deg]"
            />
          </div>

          <button className="absolute top-6 right-6 bg-white/90 hover:bg-white p-2 rounded-full shadow-md transition-all active:scale-95 z-20">
            <X size={24} className="text-text-primary" />
          </button>
        </div>

        {/* pricing and quantity section */}
        <div className="px-4 flex items-center justify-between">
          <h2 className="h2 text-brand-accent">₱ {basePrice.toFixed(2)}</h2>
          <div className="flex items-center gap-5">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-9 h-9 flex items-center justify-center rounded-xl border-2 border-brand-accent/20 text-brand-accent hover:bg-brand-accent/5 transition-colors"
            >
              <Minus size={20} />
            </button>
            <span className="h3 text-text-primary min-w-[20px] text-center">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="w-9 h-9 flex items-center justify-center rounded-xl bg-brand-secondary text-text-primary hover:opacity-90 transition-all shadow-sm"
            >
              <Plus size={20} />
            </button>
          </div>
        </div>

        <div className="h-px bg-kds-border-warm mx-4" />

        {/* modifiers section */}
        <div className="space-y-4 px-4">
          <div className="flex justify-between items-center">
            <h4 className="b3 text-text-secondary uppercase tracking-widest text-[13px]">
              Modifiers
            </h4>
            <span className="text-[10px] font-bold text-brand-primary border border-brand-primary/40 px-3 py-1.5 rounded-lg uppercase bg-brand-primary/5">
              Choose any
            </span>
          </div>

          <div className="space-y-1">
            {MODIFIERS.map((mod) => (
              <label
                key={mod.id}
                className="flex items-center justify-between p-3.5 hover:bg-bg-primary rounded-2xl cursor-pointer group transition-all active:scale-[0.995]"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={cn(
                      "w-6 h-6 rounded-lg border-2 transition-all flex items-center justify-center",
                      selectedModifiers.includes(mod.id)
                        ? "bg-brand-secondary border-brand-secondary shadow-sm"
                        : "border-kds-border-warm bg-white",
                    )}
                  >
                    <input
                      type="checkbox"
                      className="hidden"
                      checked={selectedModifiers.includes(mod.id)}
                      onChange={() => toggleModifier(mod.id)}
                    />
                    {selectedModifiers.includes(mod.id) && (
                      <Plus
                        size={14}
                        className="text-text-primary stroke-[3]"
                      />
                    )}
                  </div>
                  <div>
                    <p className="b2 text-text-primary group-hover:text-brand-accent transition-colors">
                      {mod.name}
                    </p>
                    <p className="b5 text-text-secondary">{mod.description}</p>
                  </div>
                </div>
                <span className="b3 text-brand-primary">
                  +₱{mod.price.toFixed(2)}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="h-px bg-kds-border-warm mx-4" />

        {/* size options section */}
        <div className="space-y-4 px-4">
          <div className="flex justify-between items-center">
            <h4 className="b3 text-text-secondary uppercase tracking-widest text-[13px]">
              Size
            </h4>
            <span className="text-[10px] font-bold text-brand-accent border border-brand-accent/40 px-3 py-1.5 rounded-lg uppercase bg-brand-accent/5">
              Required
            </span>
          </div>

          <div className="space-y-1">
            {SIZES.map((size) => (
              <label
                key={size.id}
                className="flex items-center justify-between p-3.5 hover:bg-bg-primary rounded-2xl cursor-pointer group transition-all"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={cn(
                      "w-6 h-6 rounded-full border-2 transition-all flex items-center justify-center",
                      selectedSize === size.id
                        ? "border-brand-accent"
                        : "border-kds-border-warm bg-white",
                    )}
                  >
                    <input
                      type="radio"
                      className="hidden"
                      name="size-option"
                      checked={selectedSize === size.id}
                      onChange={() => setSelectedSize(size.id)}
                    />
                    {selectedSize === size.id && (
                      <div className="w-3 h-3 bg-brand-accent rounded-full kds-fade-in" />
                    )}
                  </div>
                  <div>
                    <p className="b2 text-text-primary group-hover:text-brand-accent transition-colors">
                      {size.name}
                    </p>
                    <p className="b5 text-text-secondary">{size.description}</p>
                  </div>
                </div>
                <span className="b3 text-success-primary font-bold">Free</span>
              </label>
            ))}
          </div>
        </div>

        <div className="h-px bg-kds-border-warm mx-4" />

        {/* special instructions section */}
        <div className="space-y-4 px-4">
          <h4 className="b3 text-text-secondary uppercase tracking-widest text-[13px]">
            Special Instructions
          </h4>
          <div className="relative">
            <textarea
              value={instructions}
              onChange={(e) => setInstructions(e.target.value.slice(0, 2000))}
              placeholder="e.g., less sauce, extra spicy"
              className="w-full h-44 bg-transparent border-2 border-kds-border-warm rounded-[32px] p-7 b1 outline-none focus:border-brand-secondary focus:bg-bg-primary/30 transition-all resize-none placeholder:text-text-secondary/40"
            />
            <span className="absolute bottom-6 right-8 b5 text-text-secondary/50 font-medium">
              {instructions.length} / 2000
            </span>
          </div>
        </div>

        {/* checkout action footer */}
        <div className="p-4 md:px-8 pb-10 flex justify-center">
          <button className="w-full md:max-w-md bg-brand-accent hover:opacity-90 active:scale-[0.97] text-white h-[68px] rounded-full flex items-center justify-center gap-3 h3 transition-all shadow-[0_12px_24px_rgba(255,82,105,0.25)]">
            Add to Order
            <span className="w-px h-5 bg-white/30" />₱{" "}
            {totalPrice.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderEditor;
