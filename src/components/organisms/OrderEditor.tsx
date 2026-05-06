"use client";

import React, { useState } from "react";
import { X, Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/atoms/Button";
import { Badge } from "@/components/atoms/Badge";
import { Checkbox } from "@/components/atoms/Checkbox";
import { Radio } from "@/components/atoms/Radio";
import { MenuItemData } from "./MenuCatalog";
import { useCart } from "@/contexts/CartContext";

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
    description: "Extra portion for bigger appetites",
    price: 50,
  },
];

interface OrderEditorProps {
  menuItem: MenuItemData;
  onClose: () => void;
}

const OrderEditor = ({ menuItem, onClose }: OrderEditorProps) => {
  // state
  const [quantity, setQuantity] = useState(1);
  const [selectedModifiers, setSelectedModifiers] = useState<string[]>([]);
  const [selectedSize, setSelectedSize] = useState<string>("s2");
  const [instructions, setInstructions] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // handlers
  const toggleModifier = (id: string) => {
    setSelectedModifiers((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id],
    );
  };

  const { addToCart } = useCart();

  const handleAddToOrder = () => {
    addToCart({
      menuItem,
      quantity,
      selectedSize,
      selectedModifiers,
      specialInstructions: instructions,
      totalPrice,
    });
    setShowSuccessModal(true);
    setTimeout(() => {
      setShowSuccessModal(false);
      onClose();
    }, 1500); // Close after showing success for 1.5s
  };

  const basePrice = menuItem.price;
  const sizePrice = SIZES.find((s) => s.id === selectedSize)?.price ?? 0;
  const modifiersTotal = selectedModifiers.reduce((sum, id) => {
    const mod = MODIFIERS.find((m) => m.id === id);
    return sum + (mod?.price ?? 0);
  }, 0);
  const totalPrice = (basePrice + sizePrice + modifiersTotal) * quantity;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200" onClick={onClose}>
      <div className="w-full max-w-[700px] max-h-[90vh] flex flex-col bg-bg-primary rounded-[40px] md:rounded-[48px] border-[8px] md:border-[12px] border-white shadow-[var(--kds-shadow-hover)] relative font-inter overflow-hidden" onClick={(e) => e.stopPropagation()}>
        {/* drag handle bar */}
        <div className="flex justify-center pt-4 pb-1 shrink-0 bg-bg-primary z-30">
          <div className="w-12 h-1.5 bg-brand-accent rounded-full" />
        </div>

      <div className="p-4 md:p-6 space-y-5 md:space-y-6 overflow-y-auto no-scrollbar flex-grow">
        {/* hero product card */}
        <div className="relative bg-brand-secondary rounded-[28px] md:rounded-[40px] p-6 md:p-12 overflow-hidden flex items-center justify-between min-h-[200px] md:min-h-[280px]">
          <div className="relative z-10 space-y-2 md:space-y-3 max-w-[55%] md:max-w-[60%]">
            <Badge
              color="error"
              variant="solid"
              shape="rounded"
              className="text-[10px] md:text-[11px] font-bold px-3 py-1.5 uppercase tracking-wider shadow-sm"
            >
              Bestseller
            </Badge>
            <h1 className="text-2xl md:text-4xl font-extrabold text-text-primary leading-tight">
              {menuItem.name}
            </h1>
            <p className="b4 md:b2 text-text-primary/70">
              Freshly prepared {menuItem.category.toLowerCase()} option
            </p>
          </div>

          {/* product image in circular frame */}
          <div className="absolute right-[10%] md:right-8 top-1/2 -translate-y-1/2 w-[120px] h-[120px] md:w-[200px] md:h-[200px] rounded-full overflow-hidden border-4 border-white/60 shadow-xl flex-shrink-0">
            <img
              src={menuItem.imageUrl}
              alt={menuItem.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* close button */}
          <button onClick={onClose} className="absolute top-4 md:top-6 right-4 md:right-6 bg-white/90 hover:bg-white p-2 rounded-full shadow-md transition-all active:scale-95 z-20">
            <X size={20} className="text-text-primary" />
          </button>
        </div>

        {/* pricing and quantity section */}
        <div className="px-2 md:px-4 flex items-center justify-between">
          <h2 className="h2 text-brand-accent font-extrabold">
            ₱ {basePrice.toFixed(2)}
          </h2>

          {/* quantity counter */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-9 h-9 flex items-center justify-center rounded-xl border-2 border-brand-accent/20 text-brand-accent hover:bg-brand-accent/5 transition-colors active:scale-95"
            >
              <Minus size={18} />
            </button>
            <span className="h3 text-text-primary min-w-[20px] text-center">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="w-9 h-9 flex items-center justify-center rounded-xl bg-brand-secondary text-text-primary hover:opacity-90 transition-all shadow-sm active:scale-95"
            >
              <Plus size={18} />
            </button>
          </div>
        </div>

        <div className="h-px bg-[var(--kds-border-warm)] mx-2 md:mx-4" />

        {/* modifiers section */}
        <div className="space-y-3 px-2 md:px-4">
          <div className="flex justify-between items-center mb-1">
            <h4 className="b3 font-bold text-text-secondary uppercase tracking-widest text-[11px] md:text-[13px]">
              Modifiers
            </h4>
            <Badge
              color="primary"
              variant="outline"
              shape="rounded"
              className="text-[10px] font-bold uppercase px-3 py-1"
            >
              Choose any
            </Badge>
          </div>

          <div className="space-y-1">
            {MODIFIERS.map((mod) => (
              <label
                key={mod.id}
                className="flex items-center justify-between p-3 md:p-3.5 hover:bg-bg-primary rounded-2xl cursor-pointer group transition-all active:scale-[0.995]"
              >
                <div className="flex items-center gap-3 md:gap-4">
                  <Checkbox
                    variant="primary"
                    checked={selectedModifiers.includes(mod.id)}
                    onChange={() => toggleModifier(mod.id)}
                  />
                  <div>
                    <p className="b2 font-semibold text-text-primary group-hover:text-brand-primary transition-colors text-sm md:text-base">
                      {mod.name}
                    </p>
                    <p className="b5 text-text-secondary">{mod.description}</p>
                  </div>
                </div>
                <span className="b3 font-bold text-brand-primary shrink-0">
                  +₱{mod.price.toFixed(2)}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="h-px bg-[var(--kds-border-warm)] mx-2 md:mx-4" />

        {/* size options section */}
        <div className="space-y-3 px-2 md:px-4">
          <div className="flex justify-between items-center mb-1">
            <h4 className="b3 font-bold text-text-secondary uppercase tracking-widest text-[11px] md:text-[13px]">
              Size
            </h4>
            <Badge
              color="error"
              variant="outline"
              shape="rounded"
              className="text-[10px] font-bold uppercase"
            >
              Required
            </Badge>
          </div>

          <div className="space-y-1">
            {SIZES.map((size) => (
              <label
                key={size.id}
                className={cn(
                  "flex items-center justify-between p-3 md:p-3.5 rounded-2xl cursor-pointer group transition-all",
                  selectedSize === size.id
                    ? "bg-bg-primary"
                    : "hover:bg-bg-primary",
                )}
              >
                <div className="flex items-center gap-3 md:gap-4">
                  <Radio
                    variant="accent"
                    name="size-option"
                    checked={selectedSize === size.id}
                    onChange={() => setSelectedSize(size.id)}
                  />
                  <div>
                    <p className="b2 font-semibold text-text-primary group-hover:text-brand-accent transition-colors text-sm md:text-base">
                      {size.name}
                    </p>
                    <p className="b5 text-text-secondary">{size.description}</p>
                  </div>
                </div>
                <span className="b3 font-bold text-success-primary shrink-0">
                  {size.price === 0 ? "Free" : `+₱${size.price.toFixed(2)}`}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="h-px bg-[var(--kds-border-warm)] mx-2 md:mx-4" />

        {/* special instructions section */}
        <div className="space-y-3 px-2 md:px-4">
          <h4 className="b3 font-bold text-text-secondary uppercase tracking-widest text-[11px] md:text-[13px]">
            Special Instructions
          </h4>
          <div className="relative">
            <textarea
              value={instructions}
              onChange={(e) => setInstructions(e.target.value.slice(0, 2000))}
              placeholder="e.g., less sauce, extra spicy"
              className="w-full h-36 bg-transparent border-2 border-black/10 rounded-[20px] px-5 py-4 b1 outline-none focus:border-brand-secondary focus:ring-2 focus:ring-brand-secondary/20 transition-all resize-none placeholder:text-text-secondary/40"
            />
            <span className="absolute bottom-4 right-5 b5 text-text-secondary/50 font-medium">
              {instructions.length} / 2000
            </span>
          </div>
        </div>

        {/* checkout action footer */}
        <div className="px-2 md:px-4 pb-6 md:pb-8">
          <Button
            variant="accent"
            shape="rounded"
            onClick={handleAddToOrder}
            className="w-full h-[56px] md:h-[64px] text-white text-base md:text-[18px] font-bold shadow-[0_12px_24px_rgba(255,82,105,0.22)] justify-center gap-3 active:scale-[0.98] transition-transform"
          >
            Add to Order
            <span className="w-px h-5 bg-white/30" />₱{" "}
            {totalPrice.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </Button>
        </div>
      </div>

      {/* success modal overlay */}
      {showSuccessModal && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200"
          onClick={() => setShowSuccessModal(false)}
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
                <h3 className="text-xl font-extrabold text-text-primary">
                  Added to Order!
                </h3>
                <p className="b4 text-text-secondary">
                  {quantity}x {menuItem.name} has been added to your cart.
                </p>
              </div>

              {/* order summary */}
              <div className="w-full bg-bg-primary rounded-2xl px-5 py-4 space-y-1.5 text-left">
                <div className="flex justify-between b4 text-text-secondary">
                  <span>Base price</span>
                  <span className="font-semibold text-text-primary">₱{basePrice.toFixed(2)}</span>
                </div>
                {modifiersTotal > 0 && (
                  <div className="flex justify-between b4 text-text-secondary">
                    <span>Add-ons ({selectedModifiers.length})</span>
                    <span className="font-semibold text-text-primary">+₱{modifiersTotal.toFixed(2)}</span>
                  </div>
                )}
                {sizePrice > 0 && (
                  <div className="flex justify-between b4 text-text-secondary">
                    <span>Size</span>
                    <span className="font-semibold text-text-primary">+₱{sizePrice.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between b4 text-text-secondary">
                  <span>Qty</span>
                  <span className="font-semibold text-text-primary">&times;{quantity}</span>
                </div>
                <div className="h-px bg-black/5 my-1" />
                <div className="flex justify-between b3 font-bold">
                  <span className="text-text-primary">Total</span>
                  <span className="text-brand-accent">₱{totalPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
              </div>

              {/* close btn */}
              <Button
                variant="accent"
                shape="rounded"
                onClick={() => setShowSuccessModal(false)}
                className="w-full h-[52px] text-white text-base font-bold shadow-[0_8px_20px_rgba(255,82,105,0.2)] justify-center"
              >
                Done
              </Button>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default OrderEditor;
