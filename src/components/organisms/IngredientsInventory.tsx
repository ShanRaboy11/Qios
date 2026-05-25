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
  const { items, isLoading, actionError, saveItem, deleteItem } =
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
    });
    setModalMode("add");
    setModalError(null);
  };

  const handleOpenEditModal = (item: InventoryItem) => {
    setDraftItem({ ...item });
    setModalMode("edit");
    setModalError(null);
  };

  const handleCloseModal = () => {
    setModalMode(null);
    setDraftItem(null);
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

    if (currentStock < 0 || lowStock < 0 || criticalStock < 0) {
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
    return (
      <div className="w-full h-[400px] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-brand-accent border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
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
                    <p className="b5 text-text-secondary mt-1 uppercase tracking-wider">
                      Unit: {item.unit_type}
                    </p>
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
                      Crit
                    </span>
                    <span className="b2 font-bold text-text-primary">
                      {item.critical_stock_threshold}
                    </span>
                  </div>
                </div>

                {/* actions overlay */}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 bg-white/90 backdrop-blur-sm rounded-lg p-1 shadow-sm border border-black/5">
                  <button
                    onClick={() => handleOpenEditModal(item)}
                    className="p-1.5 text-text-secondary hover:text-brand-accent hover:bg-brand-accent/10 rounded-md transition-colors"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => setDeleteConfirmId(item.id)}
                    className="p-1.5 text-text-secondary hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
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
            </div>

            <div className="p-5 border-t border-black/5 bg-black/[0.02] flex justify-end gap-3">
              <Button variant="outline" onClick={handleCloseModal}>
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
