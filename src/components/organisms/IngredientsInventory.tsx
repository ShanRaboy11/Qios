"use client";

import React, { useState, useMemo } from "react";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
import { SearchFilterBar } from "@/components/molecules/SearchFilterBar";
import { ActionConfirmationModal } from "@/components/molecules/ConfirmationModal";
import {
  useInventoryManagement,
  InventoryItem,
} from "@/hooks/useInventoryManagement";
import {
  Plus,
  Trash2,
  Edit2,
  AlertCircle,
  Package,
  Scale,
  FolderPlus,
  X,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { InventoryPageSkeleton } from "@/components/molecules/PageShimmerSkeleton";

function ModalOverlay({
  onClose,
  children,
}: {
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
    >
      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-md">
        {children}
      </div>
    </div>
  );
}

export default function IngredientsInventory() {
  const { items, isLoading, actionError, saveItem, restockItem, deleteItem } =
    useInventoryManagement();

  const [activeTab, setActiveTab] = useState<"measurement" | "unit">(
    "measurement",
  );
  const [searchQuery, setSearchQuery] = useState("");

  const [modalMode, setModalMode] = useState<"add" | "edit" | null>(null);
  const [draftItem, setDraftItem] = useState<Partial<InventoryItem> | null>(
    null,
  );
  const [isSaving, setIsSaving] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

  const [restockModalOpen, setRestockModalOpen] = useState(false);
  const [restockTarget, setRestockTarget] = useState<InventoryItem | null>(
    null,
  );
  const [restockQuantity, setRestockQuantity] = useState<number>(0);
  const [restockPrice, setRestockPrice] = useState<number>(0);
  const [isRestocking, setIsRestocking] = useState(false);

  const [isUnitDropdownOpen, setIsUnitDropdownOpen] = useState(false);
  const [unitSearch, setUnitSearch] = useState("");

  const MEASUREMENT_UNITS = [
    "kg",
    "g",
    "mg",
    "lb",
    "oz",
    "L",
    "ml",
    "gal",
    "pt",
  ];
  const PIECE_UNITS = [
    "pcs",
    "boxes",
    "bottles",
    "cans",
    "packs",
    "slices",
    "dozens",
  ];

  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const filteredItems = useMemo(() => {
    return items.filter(
      (i) =>
        i.inventory_mode === activeTab &&
        i.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [items, activeTab, searchQuery]);

  const handleOpenAddModal = () => {
    setDraftItem({
      name: "",
      unit_type: activeTab === "measurement" ? "kg" : "pcs",
      inventory_mode: activeTab,
      current_stock: 0,
      low_stock_threshold: 0,
      critical_stock_threshold: 0,
      purchase_price: 0,
    });
    setModalMode("add");
    setModalError(null);
  };

  const handleOpenEditModal = (item: InventoryItem) => {
    setDraftItem({ ...item });
    setModalMode("edit");
    setModalError(null);
  };

  const handleOpenRestockModal = (item: InventoryItem) => {
    setRestockTarget(item);
    setRestockQuantity(0);
    setRestockPrice(item.purchase_price ?? 0);
    setModalError(null);
    setRestockModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalMode(null);
    setDraftItem(null);
    setRestockModalOpen(false);
    setRestockTarget(null);
    setModalError(null);
    setIsUnitDropdownOpen(false);
    setUnitSearch("");
  };

  const handleSaveItem = async () => {
    if (!draftItem) return;

    // validation
    if (!draftItem.name?.trim()) {
      setModalError("Ingredient name is required.");
      return;
    }
    if (!draftItem.unit_type?.trim()) {
      setModalError("Unit type is required.");
      return;
    }

    const currentStock = draftItem.current_stock ?? 0;
    const lowStock = draftItem.low_stock_threshold ?? 0;
    const criticalStock = draftItem.critical_stock_threshold ?? 0;
    const purchasePrice = draftItem.purchase_price ?? 0;

    if (
      currentStock < 0 ||
      lowStock < 0 ||
      criticalStock < 0 ||
      purchasePrice < 0
    ) {
      setModalError("Stock numbers must be 0 or greater.");
      return;
    }
    if (criticalStock > lowStock) {
      setModalError(
        "Critical threshold cannot be greater than low stock threshold.",
      );
      return;
    }

    setModalError(null);
    setIsSaving(true);
    const { item: savedItem, error: saveError } = await saveItem(
      draftItem,
      modalMode === "add",
    );
    setIsSaving(false);

    if (savedItem) {
      handleCloseModal();
    } else {
      setModalError(
        saveError ||
          "Failed to save item. It might already exist or you lack permission.",
      );
    }
  };

  const handleRestockItem = async () => {
    if (!restockTarget) return;

    if (restockQuantity <= 0) {
      setModalError("Restock quantity must be greater than 0.");
      return;
    }
    if (restockPrice < 0) {
      setModalError("Purchase price must be 0 or greater.");
      return;
    }

    setModalError(null);
    setIsRestocking(true);
    const { item: savedItem, error: restockError } = await restockItem(
      restockTarget.id,
      restockQuantity,
      restockPrice,
    );
    setIsRestocking(false);

    if (savedItem) {
      handleCloseModal();
    } else {
      setModalError(restockError || "Failed to restock item.");
    }
  };

  const handleDelete = async () => {
    if (deleteConfirmId) {
      await deleteItem(deleteConfirmId);
      setDeleteConfirmId(null);
    }
  };

  const getStatus = (item: InventoryItem) => {
    if (item.current_stock <= item.critical_stock_threshold) return "critical";
    if (item.current_stock <= item.low_stock_threshold) return "low";
    return "good";
  };

  if (isLoading) {
    return <InventoryPageSkeleton />;
  }

  return (
    <div className="w-full flex flex-col gap-6 font-inter">
      {/* ── tabs ── */}
      <div className="flex bg-white/70 backdrop-blur-sm border border-black/5 rounded-2xl p-1.5 w-max">
        <button
          onClick={() => setActiveTab("measurement")}
          className={cn(
            "flex items-center gap-2 px-5 py-2.5 rounded-xl b3 font-bold transition-all",
            activeTab === "measurement"
              ? "bg-brand-accent text-white shadow-sm"
              : "text-text-secondary hover:text-text-primary hover:bg-black/5",
          )}
        >
          <Scale size={18} />
          Measurement Based
        </button>
        <button
          onClick={() => setActiveTab("unit")}
          className={cn(
            "flex items-center gap-2 px-5 py-2.5 rounded-xl b3 font-bold transition-all",
            activeTab === "unit"
              ? "bg-brand-accent text-white shadow-sm"
              : "text-text-secondary hover:text-text-primary hover:bg-black/5",
          )}
        >
          <Package size={18} />
          Unit Based
        </button>
      </div>

      {/* ── search & filter ── */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <SearchFilterBar
          onSearch={setSearchQuery}
          placeholder="Search ingredients..."
          supportiveText=""
          className="w-full sm:w-[340px] [&_input]:!h-[44px] [&_input]:!rounded-xl"
        />
        <Button
          variant="primary"
          leftIcon={<Plus size={18} />}
          onClick={handleOpenAddModal}
          className="w-full sm:w-auto h-[44px] rounded-xl bg-brand-accent hover:bg-brand-accent/90 border-brand-accent text-white"
        >
          Add Ingredient
        </Button>
      </div>

      {/* ── error banner ── */}
      {actionError && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 flex items-center gap-2">
          <AlertCircle size={18} />
          <span className="b4">{actionError}</span>
        </div>
      )}

      {/* ── grid ── */}
      {filteredItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 bg-white/50 border border-black/5 rounded-3xl min-h-[300px]">
          <div className="w-16 h-16 rounded-2xl bg-brand-accent/10 text-brand-accent flex items-center justify-center mb-4">
            <FolderPlus size={32} />
          </div>
          <h3 className="h4 text-text-primary font-semibold">
            No ingredients found
          </h3>
          <p className="b2 text-text-secondary mt-2">
            Add some {activeTab}-based ingredients to get started.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredItems.map((item) => {
            const status = getStatus(item);
            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl p-5 border border-black/5 shadow-sm hover:shadow-md transition-shadow relative group flex flex-col gap-4"
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <h4 className="b2 font-bold text-text-primary leading-tight">
                      {item.name}
                    </h4>
                    <p className="b5 text-text-secondary mt-1 tracking-wider uppercase">
                      Unit: {item.unit_type}
                    </p>
                    <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                      <span className="text-[12px] font-medium text-brand-accent/80 bg-brand-accent/5 px-2 py-0.5 rounded border border-brand-accent/10">
                        Purchase: ₱{item.purchase_price?.toFixed(2) ?? "0.00"}
                      </span>
                      {item.last_restocked_at && (
                        <span className="text-[11px] text-text-secondary/70">
                          Restocked:{" "}
                          {new Intl.DateTimeFormat("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          }).format(new Date(item.last_restocked_at))}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* status badge */}
                  <div
                    className={cn(
                      "px-3 py-1 rounded-full b5 font-bold uppercase whitespace-nowrap",
                      status === "good"
                        ? "bg-[#e0fad6] text-[#1fad66]"
                        : status === "low"
                          ? "bg-[#fff0f0] text-[#ec1313]"
                          : "bg-red-600 text-white animate-pulse",
                    )}
                  >
                    {status === "critical"
                      ? "Critical"
                      : status === "low"
                        ? "Low Stock"
                        : "In Stock"}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 bg-black/[0.02] rounded-xl p-3">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] uppercase font-bold text-text-secondary tracking-wide">
                      Stock
                    </span>
                    <span className="b2 font-bold text-text-primary">
                      {item.current_stock}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1 border-l border-black/5 pl-2">
                    <span className="text-[10px] uppercase font-bold text-text-secondary tracking-wide">
                      Low
                    </span>
                    <span className="b2 font-bold text-text-primary">
                      {item.low_stock_threshold}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1 border-l border-black/5 pl-2">
                    <span className="text-[10px] uppercase font-bold text-text-secondary tracking-wide">
                      Critical
                    </span>
                    <span className="b2 font-bold text-text-primary">
                      {item.critical_stock_threshold}
                    </span>
                  </div>
                </div>

                {/* actions overlay */}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 bg-white/90 backdrop-blur-sm rounded-lg p-1 shadow-sm border border-black/5">
                  <button
                    onClick={() => handleOpenRestockModal(item)}
                    className="p-1.5 text-text-secondary hover:text-green-600 hover:bg-green-50 rounded-md transition-colors"
                    title="Restock"
                  >
                    <Package size={16} />
                  </button>
                  <button
                    onClick={() => handleOpenEditModal(item)}
                    className="p-1.5 text-text-secondary hover:text-brand-accent hover:bg-brand-accent/10 rounded-md transition-colors"
                    title="Edit"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => setDeleteConfirmId(item.id)}
                    className="p-1.5 text-text-secondary hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── modals ── */}
      {modalMode && draftItem && (
        <ModalOverlay onClose={handleCloseModal}>
          <div className="bg-white rounded-[24px] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-5 border-b border-black/5 bg-black/[0.02]">
              <h3 className="b2 font-bold text-text-primary">
                {modalMode === "add" ? "Add Ingredient" : "Edit Ingredient"}
              </h3>
              <button
                onClick={handleCloseModal}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-black/5 hover:bg-black/10 text-text-secondary transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            <div className="p-5 flex flex-col gap-5">
              {modalError && (
                <div className="bg-red-50 text-red-600 p-3 rounded-xl border border-red-100 flex items-start gap-2">
                  <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
                  <span className="b4">{modalError}</span>
                </div>
              )}

              <div>
                <label className="block b5 font-bold text-text-secondary uppercase tracking-widest mb-1.5">
                  Ingredient Name
                </label>
                <Input
                  value={draftItem.name || ""}
                  onChange={(e) =>
                    setDraftItem({ ...draftItem, name: e.target.value })
                  }
                  placeholder="e.g. Flour, Sugar, Chicken..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block b5 font-bold text-text-secondary uppercase tracking-widest mb-1.5">
                    Current Stock
                  </label>
                  <Input
                    type="number"
                    value={draftItem.current_stock || 0}
                    onChange={(e) =>
                      setDraftItem({
                        ...draftItem,
                        current_stock: parseFloat(e.target.value) || 0,
                      })
                    }
                  />
                </div>
                <div className="relative" onClick={(e) => e.stopPropagation()}>
                  <label className="block b5 font-bold text-text-secondary uppercase tracking-widest mb-1.5">
                    Unit Type
                  </label>
                  <div className="relative">
                    <Input
                      value={
                        isUnitDropdownOpen
                          ? unitSearch
                          : draftItem.unit_type || ""
                      }
                      onChange={(e) => {
                        setUnitSearch(e.target.value);
                        setDraftItem({
                          ...draftItem,
                          unit_type: e.target.value,
                        });
                        setIsUnitDropdownOpen(true);
                      }}
                      onFocus={() => {
                        setUnitSearch(draftItem.unit_type || "");
                        setIsUnitDropdownOpen(true);
                      }}
                      placeholder={
                        activeTab === "measurement"
                          ? "Search or enter unit..."
                          : "Search or enter unit..."
                      }
                      className={cn(
                        "cursor-text pr-12",
                        isUnitDropdownOpen &&
                          "border-brand-primary shadow-[0_0_0_2px_rgba(255,198,112,0.15)]",
                      )}
                    />
                    <button
                      type="button"
                      className="absolute right-0 top-0 h-full px-4 flex items-center justify-center text-text-secondary"
                      onClick={() => setIsUnitDropdownOpen(!isUnitDropdownOpen)}
                    >
                      <ChevronDown
                        size={16}
                        className={cn(
                          "transition-transform duration-300",
                          isUnitDropdownOpen && "rotate-180 text-brand-primary",
                        )}
                      />
                    </button>
                  </div>

                  {isUnitDropdownOpen && (
                    <div className="absolute top-[calc(100%+6px)] left-0 z-50 bg-white border-2 border-[#E5E5E5] rounded-2xl shadow-xl overflow-hidden w-full animate-in zoom-in-95 duration-200">
                      <ul className="max-h-[200px] overflow-y-auto custom-scrollbar py-1">
                        {(() => {
                          const availableUnits =
                            activeTab === "measurement"
                              ? MEASUREMENT_UNITS
                              : PIECE_UNITS;
                          const filtered = availableUnits.filter((u) =>
                            u.toLowerCase().includes(unitSearch.toLowerCase()),
                          );

                          if (
                            unitSearch.trim() &&
                            !filtered.find(
                              (u) =>
                                u.toLowerCase() ===
                                unitSearch.toLowerCase().trim(),
                            )
                          ) {
                            filtered.unshift(unitSearch.trim());
                          }

                          if (filtered.length === 0) {
                            return (
                              <li className="px-4 py-3 b4 text-text-secondary text-center">
                                No matches
                              </li>
                            );
                          }

                          return filtered.map((u, i) => (
                            <li
                              key={i}
                              onClick={() => {
                                setDraftItem({ ...draftItem, unit_type: u });
                                setUnitSearch("");
                                setIsUnitDropdownOpen(false);
                              }}
                              className={cn(
                                "cursor-pointer transition-colors px-4 py-2.5 b4 hover:bg-slate-50 text-text-primary",
                                draftItem.unit_type === u &&
                                  "text-brand-primary bg-orange-50/50 font-semibold",
                              )}
                            >
                              {u}
                            </li>
                          ));
                        })()}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block b5 font-bold text-text-secondary uppercase tracking-widest mb-1.5">
                    Low Stock Threshold
                  </label>
                  <Input
                    type="number"
                    value={draftItem.low_stock_threshold || 0}
                    onChange={(e) =>
                      setDraftItem({
                        ...draftItem,
                        low_stock_threshold: parseFloat(e.target.value) || 0,
                      })
                    }
                  />
                </div>
                <div>
                  <label className="block b5 font-bold text-text-secondary uppercase tracking-widest mb-1.5">
                    Critical Threshold
                  </label>
                  <Input
                    type="number"
                    value={draftItem.critical_stock_threshold || 0}
                    onChange={(e) =>
                      setDraftItem({
                        ...draftItem,
                        critical_stock_threshold:
                          parseFloat(e.target.value) || 0,
                      })
                    }
                  />
                </div>
              </div>

              <div>
                <label className="block b5 font-bold text-text-secondary uppercase tracking-widest mb-1.5">
                  Purchase Cost
                </label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={draftItem.purchase_price ?? 0}
                  onChange={(e) =>
                    setDraftItem({
                      ...draftItem,
                      purchase_price: parseFloat(e.target.value) || 0,
                    })
                  }
                  placeholder="e.g. 500.00"
                />
                <p className="mt-1 text-[11px] text-text-secondary">
                  Total cost for this ingredient batch, not per unit.
                </p>
              </div>
            </div>

            <div className="p-5 border-t border-black/5 bg-black/[0.02] flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={handleCloseModal}
                className="border-brand-primary text-brand-primary hover:!bg-brand-primary hover:!border-brand-primary hover:!text-white"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleSaveItem}
                disabled={isSaving || !draftItem.name?.trim()}
                className="bg-brand-accent hover:bg-brand-accent/90 border-brand-accent text-white"
              >
                {isSaving ? "Saving..." : "Save Ingredient"}
              </Button>
            </div>
          </div>
        </ModalOverlay>
      )}

      {restockModalOpen && restockTarget && (
        <ModalOverlay onClose={handleCloseModal}>
          <div className="bg-white rounded-[24px] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-5 border-b border-black/5 bg-black/[0.02]">
              <h3 className="b2 font-bold text-text-primary">
                Restock {restockTarget.name}
              </h3>
              <button
                onClick={handleCloseModal}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-black/5 hover:bg-black/10 text-text-secondary transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            <div className="p-5 flex flex-col gap-5">
              {modalError && (
                <div className="bg-red-50 text-red-600 p-3 rounded-xl border border-red-100 flex items-start gap-2">
                  <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
                  <span className="b4">{modalError}</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block b5 font-bold text-text-secondary uppercase tracking-widest mb-1.5">
                    Quantity to Add
                  </label>
                  <div className="relative">
                    <Input
                      type="number"
                      min="0"
                      step="any"
                      value={restockQuantity || ""}
                      onChange={(e) =>
                        setRestockQuantity(parseFloat(e.target.value) || 0)
                      }
                      placeholder="0"
                      className="pr-12"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-text-secondary pointer-events-none">
                      {restockTarget.unit_type}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="block b5 font-bold text-text-secondary uppercase tracking-widest mb-1.5">
                    New Current Stock
                  </label>
                  <div className="bg-gray-50 rounded-xl px-4 py-[11px] border border-gray-100 text-sm font-bold text-text-primary">
                    {(
                      Number(restockTarget.current_stock ?? 0) +
                      (restockQuantity || 0)
                    ).toLocaleString()}{" "}
                    {restockTarget.unit_type}
                  </div>
                </div>
              </div>

              <div>
                <label className="block b5 font-bold text-text-secondary uppercase tracking-widest mb-1.5">
                  Purchase Cost (₱)
                </label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={restockPrice || ""}
                  onChange={(e) =>
                    setRestockPrice(parseFloat(e.target.value) || 0)
                  }
                  placeholder="e.g. 500.00"
                />
                <p className="text-[12px] text-text-secondary mt-1.5">
                  This will log a purchase of ₱
                  {(restockPrice || 0).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}{" "}
                  total cost.
                </p>
              </div>
            </div>

            <div className="p-5 border-t border-black/5 bg-black/[0.02] flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={handleCloseModal}
                className="border-brand-primary text-brand-primary hover:!bg-brand-primary hover:!border-brand-primary hover:!text-white"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleRestockItem}
                disabled={isRestocking || restockQuantity <= 0}
                className="bg-[#1fad66] hover:bg-[#1fad66]/90 border-[#1fad66] text-white"
              >
                {isRestocking ? "Restocking..." : "Confirm Restock"}
              </Button>
            </div>
          </div>
        </ModalOverlay>
      )}

      {/* ── delete confirmation ── */}
      {deleteConfirmId && (
        <ActionConfirmationModal
          isOpen={true}
          action="delete"
          title="Delete Ingredient"
          message="Are you sure you want to delete this ingredient? This action cannot be undone."
          confirmLabel="Delete"
          onClose={() => setDeleteConfirmId(null)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}
