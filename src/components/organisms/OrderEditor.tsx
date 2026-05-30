"use client";

import React, { useState, useMemo } from "react";
import { X, Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/atoms/Button";
import { Badge } from "@/components/atoms/Badge";
import { Checkbox } from "@/components/atoms/Checkbox";
import { Radio } from "@/components/atoms/Radio";
import { MenuItemData, MenuItemModifierOption } from "./MenuCatalog";
import { useCart, SelectedModifierOption } from "@/contexts/CartContext";

interface OrderEditorProps {
  menuItem: MenuItemData;
  onClose: () => void;
}

const OrderEditor = ({ menuItem, onClose }: OrderEditorProps) => {
  const { addToCart } = useCart();

  const [quantity, setQuantity] = useState(1);
  // map of modifierGroupId -> Set of selected optionIds
  const [selectionByGroup, setSelectionByGroup] = useState<
    Map<string, Set<string>>
  >(
    () =>
      new Map(menuItem.modifierGroups.map((g) => [g.id, new Set<string>()])),
  );
  const [instructions, setInstructions] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // flatten selected options across all groups for price + display
  const selectedOptions = useMemo<SelectedModifierOption[]>(() => {
    const result: SelectedModifierOption[] = [];
    for (const group of menuItem.modifierGroups) {
      const chosen = selectionByGroup.get(group.id) ?? new Set();
      for (const option of group.options) {
        if (chosen.has(option.id)) {
          result.push({
            id: option.id,
            modifierGroupId: group.id,
            modifierGroupName: group.name,
            name: option.name,
            additionalPrice: option.additionalPrice,
          });
        }
      }
    }
    return result;
  }, [selectionByGroup, menuItem.modifierGroups]);

  const modifiersTotal = selectedOptions.reduce(
    (sum, o) => sum + o.additionalPrice,
    0,
  );
  const unitPrice = menuItem.price + modifiersTotal;
  const totalPrice = unitPrice * quantity;

  const toggleOption = (
    group: MenuItemData["modifierGroups"][number],
    option: MenuItemModifierOption,
  ) => {
    setSelectionByGroup((prev) => {
      const next = new Map(prev);
      const current = new Set(next.get(group.id) ?? []);

      if (group.maxSelections === 1) {
        // radio behaviour: only one allowed
        next.set(group.id, new Set([option.id]));
      } else {
        // checkbox behaviour: toggle, but respect maxSelections
        if (current.has(option.id)) {
          current.delete(option.id);
        } else if (current.size < group.maxSelections) {
          current.add(option.id);
        }
        next.set(group.id, current);
      }
      return next;
    });
  };

  const handleAddToOrder = () => {
    addToCart({
      menuItem,
      quantity,
      selectedOptions,
      specialInstructions: instructions,
      totalPrice,
    });
    setShowSuccessModal(true);
    setTimeout(() => {
      setShowSuccessModal(false);
      onClose();
    }, 1500);
  };

  return (
    <div
      className="fixed inset-0 z-[150] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[700px] max-h-[90vh] flex flex-col bg-bg-primary rounded-[40px] md:rounded-[48px] border-[8px] md:border-[12px] border-white shadow-[var(--kds-shadow-hover)] relative font-inter overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
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
                {menuItem.category}
              </Badge>
              <h1 className="text-2xl md:text-4xl font-extrabold text-text-primary leading-tight">
                {menuItem.name}
              </h1>
              <p className="b4 md:b2 text-text-primary/70">
                Freshly prepared {menuItem.category.toLowerCase()} option
              </p>
            </div>

            {/* product image */}
            <div className="absolute right-[10%] md:right-8 top-1/2 -translate-y-1/2 w-[120px] h-[120px] md:w-[200px] md:h-[200px] rounded-full overflow-hidden border-4 border-white/60 shadow-xl flex-shrink-0">
              <img
                src={menuItem.imageUrl}
                alt={menuItem.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* close button */}
            <button
              onClick={onClose}
              className="absolute top-4 md:top-6 right-4 md:right-6 bg-white/90 hover:bg-white p-2 rounded-full shadow-md transition-all active:scale-95 z-20"
            >
              <X size={20} className="text-text-primary" />
            </button>
          </div>

          {/* pricing and quantity section */}
          <div className="px-2 md:px-4 flex items-center justify-between">
            <div>
              <h2 className="h2 text-brand-accent font-extrabold">
                ₱{" "}
                {totalPrice.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </h2>
              {modifiersTotal > 0 && (
                <p className="b5 text-text-secondary/70 mt-0.5">
                  ₱{menuItem.price.toFixed(2)} base + ₱
                  {modifiersTotal.toFixed(2)} add-ons × {quantity}
                </p>
              )}
            </div>

            {/* quantity stepper */}
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

          {/* dynamic modifier groups */}
          {menuItem.modifierGroups.length > 0 ? (
            menuItem.modifierGroups.map((group) => {
              const isRadio = group.maxSelections === 1;
              const chosen = selectionByGroup.get(group.id) ?? new Set();
              const atMax = chosen.size >= group.maxSelections;

              return (
                <div key={group.id} className="space-y-3 px-2 md:px-4">
                  <div className="flex justify-between items-center mb-1">
                    <h4 className="b3 font-bold text-text-secondary uppercase tracking-widest text-[11px] md:text-[13px]">
                      {group.name}
                    </h4>
                    <Badge
                      color={group.isRequired ? "error" : "primary"}
                      variant="outline"
                      shape="rounded"
                      className="text-[10px] font-bold uppercase px-3 py-1"
                    >
                      {group.isRequired ? "Required" : "Optional"}
                    </Badge>
                  </div>

                  {group.options.length === 0 ? (
                    <p className="b5 text-text-secondary/60 px-1">
                      No options available
                    </p>
                  ) : (
                    <div className="space-y-1">
                      {group.options.map((option) => {
                        const isSelected = chosen.has(option.id);
                        const isDisabled =
                          !option.isAvailable ||
                          (!isSelected && atMax && !isRadio);

                        return (
                          <label
                            key={option.id}
                            className={cn(
                              "flex items-center justify-between p-3 md:p-3.5 rounded-2xl cursor-pointer group transition-all",
                              isSelected
                                ? "bg-brand-secondary/20"
                                : "hover:bg-bg-primary",
                              isDisabled && "opacity-40 cursor-not-allowed",
                            )}
                          >
                            <div className="flex items-center gap-3 md:gap-4">
                              {isRadio ? (
                                <Radio
                                  variant="accent"
                                  name={`group-${group.id}`}
                                  checked={isSelected}
                                  onChange={() =>
                                    !isDisabled && toggleOption(group, option)
                                  }
                                  disabled={!option.isAvailable}
                                />
                              ) : (
                                <Checkbox
                                  variant="primary"
                                  checked={isSelected}
                                  onChange={() =>
                                    !isDisabled && toggleOption(group, option)
                                  }
                                  disabled={isDisabled}
                                />
                              )}
                              <p className="b2 font-semibold text-text-primary text-sm md:text-base">
                                {option.name}
                              </p>
                            </div>
                            <span className="b3 font-bold text-brand-primary shrink-0">
                              {option.additionalPrice === 0
                                ? "Free"
                                : `+₱${option.additionalPrice.toFixed(2)}`}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  )}
                  <div className="h-px bg-[var(--kds-border-warm)]" />
                </div>
              );
            })
          ) : (
            <div className="px-2 md:px-4">
              <p className="b4 text-text-secondary/60 text-center py-2">
                No customization options available for this item.
              </p>
              <div className="h-px bg-[var(--kds-border-warm)] mt-3" />
            </div>
          )}

          {/* special instructions section */}
          <div className="space-y-3 px-2 md:px-4">
            <h4 className="b3 font-bold text-text-secondary uppercase tracking-widest text-[11px] md:text-[13px]">
              Special Instructions
            </h4>
            <div className="relative">
              <textarea
                value={instructions}
                onChange={(e) => setInstructions(e.target.value.slice(0, 2000))}
                placeholder="e.g., less sauce, extra spicy, no onions..."
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
              Add to Cart
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
              <div className="flex justify-center pt-4 pb-1">
                <div className="w-10 h-1.5 bg-black/10 rounded-full" />
              </div>

              <div className="p-6 md:p-8 flex flex-col items-center gap-4 text-center">
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
                    Added to Cart!
                  </h3>
                  <p className="b4 text-text-secondary">
                    {quantity}× {menuItem.name} has been added to your cart.
                  </p>
                </div>

                {/* summary */}
                <div className="w-full bg-bg-primary rounded-2xl px-5 py-4 space-y-1.5 text-left">
                  <div className="flex justify-between b4 text-text-secondary">
                    <span>Base price</span>
                    <span className="font-semibold text-text-primary">
                      ₱{menuItem.price.toFixed(2)}
                    </span>
                  </div>
                  {selectedOptions.map((o) => (
                    <div
                      key={o.id}
                      className="flex justify-between b4 text-text-secondary"
                    >
                      <span>{o.name}</span>
                      <span className="font-semibold text-text-primary">
                        {o.additionalPrice === 0
                          ? "Free"
                          : `+₱${o.additionalPrice.toFixed(2)}`}
                      </span>
                    </div>
                  ))}
                  <div className="flex justify-between b4 text-text-secondary">
                    <span>Qty</span>
                    <span className="font-semibold text-text-primary">
                      ×{quantity}
                    </span>
                  </div>
                  <div className="h-px bg-black/5 my-1" />
                  <div className="flex justify-between b3 font-bold">
                    <span className="text-text-primary">Total</span>
                    <span className="text-brand-accent">
                      ₱
                      {totalPrice.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                </div>

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
